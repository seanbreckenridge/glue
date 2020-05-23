defmodule Glue.GenCache.Worker do
  use GenServer

  require Logger
  import Ecto.Query, only: [from: 2]
  alias Glue.GenCache.Utils
  alias Glue.GenCache.GenerateFeed

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

  #  call like GenServer.call(Glue.GenCache.Worker, :get_feed_data)
  def handle_call(:get_feed_data, _from, state) do
    {:reply, state[:cached_feed], state}
  end

  # WCA has its own page, doesnt appear on the chronological feed
  def handle_call(:get_wca_data, _from, state) do
    {:reply, state[:data] |> Map.get("wca"), state}
  end

  def handle_info(:check, state) do
    # check if cache is up to date
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
    |> Enum.each(&Logger.info("#{Utils.describe(meta, &1)} doesn't exist in DB, requesting..."))

    expired_ids
    |> Enum.each(&Logger.info("#{Utils.describe(meta, &1)} has expired, requesting..."))

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

    update_tuples
    |> Enum.each(fn {id, _map_val} ->
      Logger.info("Update for #{Utils.describe(meta, id)} succeeded, updating cache/db...")
    end)

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
    state =
      Map.put(
        state,
        :data,
        Map.merge(new_genserver_cache, Map.get(state, :data), fn _k, v1, _v2 -> v1 end)
      )

    update_cached_feed(state, length(update_tuples) > 0 or is_nil(state[:cached_feed]))
  end

  # updates the cached feed value in this GenServer and
  # casts values off to image caching genserver for specific endpoints.
  defp update_cached_feed(state, should_update) do
    if should_update do
      Logger.info("Updating cached feed...")
      # if the values changed, update the cached feed value
      state =
        Map.put(
          state,
          :cached_feed,
          state[:data]
          |> Map.drop(["wca"])
          |> GenerateFeed.normalize_feed()
          |> Enum.take(120)
        )

      # send off casts to image genservers
      state
      |> Map.get(:cached_feed)
      |> Enum.map(&GenServer.cast(Glue.GenCache.ImageCache.Worker, {:cache_image, &1}))

      state
    else
      state
    end
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
    Logger.debug("Checking State...")
    update_cache(state)
  end

  # calls :check once every 5 minutes
  defp schedule_check() do
    Process.send_after(self(), :check, :timer.minutes(5))
  end
end
