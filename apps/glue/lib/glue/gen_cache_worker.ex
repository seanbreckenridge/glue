defmodule Glue.GenCache.Worker do
  use GenServer

  require Logger
  import Ecto.Query, only: [from: 2]
  alias Glue.GenCache.Utils

  def start_link(data) do
    GenServer.start_link(__MODULE__, data, name: __MODULE__)
  end

  def init(_data) do
    state =
      maintenance(%{
        meta:
          [
            Application.get_env(:glue, :mal),
            Application.get_env(:glue, :albums),
            Application.get_env(:glue, :wca),
            Application.get_env(:glue, :trakt)
          ]
          # sort by db_id so it can indexed into
          |> Enum.sort_by(fn ext -> Keyword.get(ext, :db_id) end),
        data: read_cache_from_db()
      })

    schedule_check()
    {:ok, state}
  end

  def handle_info(:check, state) do
    # check if the file has been changed
    state = maintenance(state)
    schedule_check()
    {:noreply, state}
  end

  # updates items in cache
  defp update_cache(state) do
    meta = state[:meta]

    # all ids from the configuration file
    all_ids =
      meta
      |> Enum.map(&Keyword.get(&1, :db_id))
      |> MapSet.new()

    # make request to get all cached id/update times from
    # postgres to make sure theyre up to date
    #
    # fine to hit the DB here, this is run periodically
    # in the background
    # requests hit the in memory genserver cache
    db_resp =
      Glue.Repo.all(
        from c in "gen_cache",
          select: {c.id, c.updated_at}
      )

    # mapset of ids already in the database
    db_ids =
      db_resp
      |> Enum.map(fn {id, _time} -> id end)
      |> MapSet.new()

    # if the ID doesnt exist in the postgres db, update it
    non_existent_ids = MapSet.difference(all_ids, db_ids)

    # If an ID has a value in the DB but has surpassed
    # refresh_ms since its last been updated, update it
    expired_ids =
      db_resp
      |> Stream.map(fn {id, updated_at} ->
        # use the ID to index into the meta list (ordered by index)
        Utils.get_kwlist(meta, id)
        # check if this has expired (returns nil if it hasnt)
        |> Utils.check_expiry(updated_at)
      end)
      # remove items which are nil (dont need to be updated)
      |> Stream.reject(&Kernel.is_nil/1)
      # get the corresponding id
      |> Stream.map(&Keyword.get(&1, :db_id))
      |> MapSet.new()

    # Log requests to be made
    non_existent_ids
    |> Enum.map(&Logger.info("#{Utils.describe(meta, &1)} doesn't exist in DB, requesting..."))

    expired_ids
    |> Enum.map(&Logger.info("#{Utils.describe(meta, &1)} has expired, requesting..."))

    # make requests to external APIs for updates
    update_tuples =
      MapSet.union(non_existent_ids, expired_ids)
      # use Enum instead of Stream to make parallel actions eager
      |> Enum.map(
        &Task.async(fn ->
          # dynamically get update function based on :service_key
          apply(
            Utils.load_external_api_module(meta, &1),
            :update_cache,
            [Utils.get_kwlist(meta, &1)]
          )
        end)
      )
      # wait for each endpoint to finish updating
      # generous 2 minute timeout for each to
      # run in the background in parallel
      |> Enum.map(&Task.await(&1, :timer.minutes(2)))
      # filter responses
      |> Enum.map(fn resp ->
        case resp do
          {:ok, {id, success_map_val}} ->
            {id, success_map_val}

          # warning message printed in external module
          {:error, _} ->
            nil
        end
      end)
      |> Enum.reject(&Kernel.is_nil/1)

    # generate structs for each update
    update_tuples
    |> Stream.map(fn {id, map_val} ->
      {Utils.get_kwlist(meta, id), Jason.encode!(map_val) |> Base.encode64()}
    end)
    |> Stream.map(fn {meta_info, base64_val} ->
      # if this doesnt have any value in the database, insert it (new)
      if MapSet.member?(non_existent_ids, meta_info[:db_id]) do
        %Glue.GenCache{
          id: meta_info[:db_id],
          service: meta_info[:service_key],
          cached_data: base64_val
        }
        |> Glue.Repo.insert!()
      else
        # else replace the cached value for this ID
        %Glue.GenCache{id: meta_info[:db_id]}
        |> Ecto.Changeset.cast(%{cached_data: base64_val}, [:cached_data])
        |> Glue.Repo.update!()
      end
    end)
    |> Stream.run()

    # save map into genserver memory cache
    # make sure updated_at gets updated for item in DB
    # new_genserver_cache only has items if something was updated
    # on this function call.
    # read_cache_from_db is called to initialize the cache before update_cache
    new_genserver_cache =
      update_tuples
      |> Enum.map(fn {id, map_val} ->
        {Utils.get_kwlist(meta, id)[:service_key], map_val}
      end)
      |> Enum.into(%{})

    # merge genserver data, preferring keys from the new_genserver_cache
    Map.put(
      state,
      :data,
      Map.merge(new_genserver_cache, Map.get(state, :data), fn _k, v1, _v2 -> v1 end)
    )
  end

  # reads all values from the "gen_cache" table into a map, with service_key => cached_data
  # this is called once, when the application first launches
  defp read_cache_from_db() do
    check_query =
      from c in "gen_cache",
        select: {c.service, c.cached_data}

    Glue.Repo.all(check_query)
    |> Enum.map(fn {key, val} ->
      {key, val |> Base.decode64!() |> Jason.decode!()}
    end)
    |> Enum.into(%{})
  end

  # makes sure that the cache for each feed type is up to date
  defp maintenance(state) do
    Logger.info("Checking State...")
    update_cache(state)
  end

  # calls :check once every 5 minutes
  defp schedule_check() do
    Process.send_after(self(), :check, 5 * 60 * 1000)
  end
end

defmodule Glue.GenCache.Utils do
  @doc """
  Checks if an external cache has expired.
  meta_kwlist is defined in config/config.exs
  for each endpoint, specifies the time
  in milliseconds before an item is stale

  was_updated_at is the updated_at
  field from Ecto for each item in the db.

  returns nil if it hasnt expired
  """
  def check_expiry(meta_kwlist, was_updated_at) do
    # if the elapsed time is less than
    if NaiveDateTime.diff(
         NaiveDateTime.utc_now(),
         was_updated_at,
         :millisecond
       ) - meta_kwlist[:refresh_ms] < 0 do
      nil
    else
      meta_kwlist
    end
  end

  @doc """
  Indexes into the meta Keyword list
  to get the full Keyword list based on the db_id
  """
  def get_kwlist(meta_kwlist, id) do
    meta_kwlist |> Enum.at(id - 1)
  end

  def describe(meta_kwlist, id) do
    get_kwlist(meta_kwlist, id) |> Keyword.get(:service_key)
  end

  @doc """
  Uses the service key to dynamically generate the module name
  for an external cache service
  """
  def load_external_api_module(meta_kwlist, id) do
    short_module_name =
      get_kwlist(meta_kwlist, id)
      |> Keyword.get(:service_key)
      |> String.capitalize()

    module_name = "Elixir.Glue.GenCache.External.#{short_module_name}"

    module =
      try do
        String.to_existing_atom(module_name)
      rescue
        ArgumentError ->
          String.to_atom(module_name)
      end

    {:module, module} = Code.ensure_loaded(module)
    module
  end
end
