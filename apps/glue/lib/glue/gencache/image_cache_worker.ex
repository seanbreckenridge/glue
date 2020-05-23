defmodule Glue.GenCache.ImageCache.Worker do
  @moduledoc """
  Caches Images for Trakt and MAL
  Requests are recieved from the GenCache.Worker whenever feeds are updated
  and are requested from GlueWeb FeedController to display images on the feed page.
  """

  use GenServer

  require Logger
  alias Glue.ImageCache.TraktAPI
  import Ecto.Query, only: [from: 2]

  @cached_endpoints MapSet.new(["mal", "trakt"])

  def start_link(data) do
    GenServer.start_link(__MODULE__, data, name: __MODULE__)
  end

  def init(_data) do
    {:ok, pid} = Glue.GenCache.ImageCache.SlugID.start_link()
    schedule_check()
    {:ok, %{uncached: [], image_cache: read_cache_from_db(), slug_cache_pid: pid}}
  end

  # recieves messages to cache images from GenCache.Worker
  # whenever the feed is updated
  def handle_cast({:cache_image, feed_item}, state) do
    # if this is one of the endpoints that this caches images for
    state =
      if MapSet.member?(@cached_endpoints, feed_item.type) do
        Map.put(state, :uncached, [feed_item | state[:uncached]])
      else
        state
      end

    {:noreply, state}
  end

  def handle_info(:cache_images, state) do
    # check if cache is up to date
    state = cache_images(state)
    schedule_check()
    {:noreply, state}
  end

  def handle_call(:get_cached_images, _from, state) do
    {:reply,
     state[:image_cache]
     |> Enum.filter(fn {_k, v} -> not is_nil(v) end)
     |> Enum.into(%{}), state}
  end

  # called periodically to check if image cache is updated
  defp cache_images(state) do
    state = remove_cached_images_from_front(state)

    if uncached_images?(state) do
      [uncached_feed_item | rest_uncached_list] = state[:uncached]

      state =
        add_to_image_cache(
          state,
          uncached_feed_item.site_url,
          cache_image(uncached_feed_item, state)
        )

      # remove first item from list
      Map.put(state, :uncached, rest_uncached_list)
    else
      state
    end
  end

  # feed_item passed is an uncached image, gets the image URL
  def cache_image(feed_item, state) do
    case feed_item.type do
      "mal" ->
        Logger.info("Requesting Image for MAL #{feed_item.site_url}...")

        case trim_mal_url(feed_item.site_url) |> JikanEx.Request.request(JikanEx.client()) do
          {:ok, resp} ->
            resp["image_url"]

          {:error, err} ->
            Logger.warn("Error caching image from MAL...")
            IO.inspect(err)
            nil
        end

      "trakt" ->
        Logger.info("Requesting Image for Trakt #{feed_item.site_url}...")

        case trim_trakt_url(feed_item.site_url) do
          {:episode, _url} ->
            # spawn in a separate process
            TraktAPI.episode(feed_item.site_url, state[:slug_cache_pid])

          {:movie, slug} ->
            TraktAPI.movie(slug)

          nil ->
            nil
        end
    end
  end

  defp trim_trakt_url(url) do
    case Regex.run(~r"https:\/\/trakt\.tv\/movies\/(.*)", url) do
      # this matches an episode, not a movie
      nil ->
        cond do
          # make sure it really matches an episode
          url |> String.contains?("episode") ->
            {:episode, url}

          # else nil
          true ->
            Logger.warn("Could not parse Trakt URL: #{url}")
            nil
        end

      [_, movie_slug] ->
        {:movie, movie_slug |> String.trim("/") |> String.split("/") |> Enum.at(0)}
    end
  end

  defp trim_mal_url(url) do
    url |> String.trim_leading("https://myanimelist.net/") |> String.trim("/")
  end

  # drops any items from the beginning of the cache which are already cached
  defp remove_cached_images_from_front(state) do
    Map.put(
      state,
      :uncached,
      Enum.drop_while(state[:uncached], &in_cache?(state, &1))
    )
  end

  # initial read cache from DB
  defp read_cache_from_db() do
    check_query =
      from c in "image_cache",
        select: {c.site_url, c.image_url}

    Glue.Repo.all(check_query)
    |> Enum.into(%{})
  end

  defp uncached_images?(state), do: not Enum.empty?(state[:uncached])

  defp in_cache?(state, feed_item),
    do: Map.has_key?(state[:image_cache], feed_item.site_url)

  # allow values to be nil, reset if the server is ever restarted
  # this means that values that dont get images wont retry
  # every time the cached feed is updated
  # and not is_nil(state[:image_cache][feed_item.site_url])

  defp add_to_image_cache(state, key, value) do
    # if request suceeded, save value
    if not is_nil(value) do
      %Glue.ImageCache{
        site_url: key,
        image_url: value
      }
      |> Glue.Repo.insert!()
    end

    Map.put(state, :image_cache, Map.get(state, :image_cache) |> Map.put(key, value))
  end

  # runs every 10 seconds, checking if it should cache any new images
  # but reduces load on APIs/FeedController
  def schedule_check() do
    Process.send_after(self(), :cache_images, :timer.seconds(10))
  end
end

defmodule Glue.GenCache.ImageCache.SlugID do
  @moduledoc """
  Caches Trakt TV show Slugs -> TMDB IDs
  """

  use GenServer

  def start_link(data \\ []) do
    GenServer.start_link(__MODULE__, data)
  end

  def init(_data) do
    # starts empty whenever server is restarted, re-builds image cache over time

    {:ok, %{}}
  end

  def get_tmdb_relation(pid, slug) do
    GenServer.call(pid, {:get_trakt_tmdb_relation, slug})
  end

  def save_tmdb_relation(pid, slug, tmdb_id) do
    GenServer.cast(pid, {:save_trakt_tmdb_relation, slug, tmdb_id})
  end

  def handle_call({:get_trakt_tmdb_relation, key}, _from, state) do
    {:reply, Map.get(state, "#{key}"), state}
  end

  def handle_cast({:save_trakt_tmdb_relation, key, value}, state) do
    state =
      Map.put(
        state,
        "#{key}",
        "#{value}"
      )

    {:noreply, state}
  end
end
