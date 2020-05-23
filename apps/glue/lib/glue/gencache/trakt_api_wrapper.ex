defmodule Glue.ImageCache.TraktAPI do
  require Logger
  alias Glue.GenCache.Utils
  alias Glue.GenCache.ImageCache.SlugID

  use Tesla, only: [:get]

  adapter(Tesla.Adapter.Hackney)
  plug(Tesla.Middleware.JSON)

  plug(Tesla.Middleware.Headers, [
    {"trakt-api-version", "2"},
    {"trakt-api-key", Application.get_env(:glue, :trakt_api_key)}
  ])

  plug(Tesla.Middleware.BaseUrl, "https://api.trakt.tv")

  plug Tesla.Middleware.Retry,
    delay: 2_000,
    max_retries: 3,
    max_delay: 4_000,
    should_retry: fn
      {:ok, %{status: status}} when status >= 400 -> true
      {:ok, _} -> false
      {:error, _} -> true
    end

  def movie(id_slug) do
    Logger.debug("Requesting Trakt movie #{id_slug}")

    case get("/movies/" <> id_slug) do
      {:ok, %{body: body}} ->
        body["ids"]["tmdb"]
        |> tmdb_movie_get_image()

      {:error, _} ->
        Logger.warn("Could not get tmdb id from Trakt API Request")
        nil
    end
  end

  # RSS feed returns something like https://trakt.tv/episodes/4101234
  def episode(shortened_episode_url, slug_cache_pid) do
    case get_tmdb_url(shortened_episode_url, slug_cache_pid) do
      {:ok, tmdb_url} ->
        case tmdb_url |> tmdb_episode_get_image() do
          {:ok, episode_image_url} ->
            episode_image_url

          {:error, _} ->
            nil
        end

      {:error, _} ->
        nil
    end
  end

  # get the TMDB API request for this episode
  # have to first get the Trakt slug by following the redirect
  # and use that to build a URL from the trakt web url
  # and the trakt api response (which includes the TMDB id)
  defp get_tmdb_url(shortened_episode_url, slug_cache_pid) do
    Logger.debug("Following rediect for Trakt episode URL...")
    trakt_full_web_url = follow_trakt_redirect(shortened_episode_url)

    # e.g. breaking-bad
    tv_slug = trakt_full_web_url |> get_tv_show_slug()
    # e.g. season/5/episode/2
    tv_url_season_episode = trakt_full_web_url |> get_tv_show_season_episode()

    tmdb_id? = SlugID.get_tmdb_relation(slug_cache_pid, tv_slug)

    if not is_nil(tmdb_id?) do
      {:ok, "https://api.themoviedb.org/3/tv/#{tmdb_id?}/#{tv_url_season_episode}"}
    else
      Logger.debug("Making request to Trakt to get TMDB ID for TV Show...")
      # get the TV show information from Trakt
      case get("shows/#{tv_slug}") do
        {:ok, %{body: body}} ->
          tmdb_id = body["ids"]["tmdb"]
          SlugID.save_tmdb_relation(slug_cache_pid, tv_slug, tmdb_id)

          {:ok, "https://api.themoviedb.org/3/tv/#{tmdb_id}/#{tv_url_season_episode}"}

        {:error, _} ->
          Logger.warn("Could not get TMDB id from Trakt API request")
          {:error, nil}
      end
    end
  end

  defp follow_trakt_redirect(url) do
    case Utils.generic_http_request(url) do
      {:ok, resp_text} ->
        case Floki.parse_fragment(resp_text) do
          {:ok, fragment} ->
            fragment
            |> Floki.find("a")
            |> Floki.attribute("href")
            # new url
            |> Enum.at(0)

          {:error, _} ->
            Logger.warn("Could not parse redirect from episode URL")
            ""
        end

      {:error, _} ->
        ""
    end
  end

  # gets the slug from a URL like:
  # https://trakt.tv/shows/american-crime-story/seasons/2/episodes/1
  defp get_tv_show_slug(url) do
    case Regex.run(~r"https:\/\/trakt\.tv\/shows\/([^\/]*)\/", url) do
      [_, tv_slug] ->
        tv_slug

      _ ->
        Logger.warn("Could not parse TV Show slug from #{url}")
        ""
    end
  end

  defp get_tv_show_season_episode(url) do
    case Regex.run(~r"seasons\/\d+\/episodes\/\d+", url) do
      [match] ->
        # Trakt and TMDB have slightly different URLs
        match |> String.replace("seasons", "season") |> String.replace("episodes", "episode")

      _ ->
        Logger.warn("Could not parse TV Show season/episodes from #{url}")
        ""
    end
  end

  defp tmdb_movie_get_image(id) do
    tmdb_api_key = Application.get_env(:glue, :tmdb_api_key)

    case Utils.generic_json_request(
           "https://api.themoviedb.org/3/movie/#{id}?api_key=#{tmdb_api_key}"
         ) do
      {:ok, json_resp} ->
        poster_path =
          json_resp
          |> Map.get("poster_path")

        case poster_path do
          nil ->
            nil

          url_part ->
            "https://image.tmdb.org/t/p/w400" <> url_part
        end

      {:error, _err} ->
        nil
    end
  end

  # already gets passed a well formed URL, just need to add API key
  defp tmdb_episode_get_image(api_episode_url) do
    tmdb_api_key = Application.get_env(:glue, :tmdb_api_key)

    case Utils.generic_json_request("#{api_episode_url}?api_key=#{tmdb_api_key}") do
      {:ok, json_resp} ->
        still_path = json_resp |> Map.get("still_path")

        case still_path do
          nil ->
            Logger.warn("Could not get image for #{api_episode_url}, trying season poster...")
            :timer.sleep(:timer.seconds(2))

            case Utils.generic_json_request(
                   (api_episode_url
                    |> String.split("/episode")
                    |> Enum.at(0)) <> "?api_key=#{tmdb_api_key}"
                 ) do
              {:ok, json_resp} ->
                poster_path = json_resp |> Map.get("poster_path")

                if is_nil(poster_path) do
                  Logger.warn("Could not get season poster for #{api_episode_url}")
                  {:error, nil}
                else
                  {:ok, "https://image.tmdb.org/t/p/w400" <> poster_path}
                end
            end

          screenshot_part ->
            {:ok, "https://image.tmdb.org/t/p/w400" <> screenshot_part}
        end

      {:error, _err} ->
        {:error, nil}
    end
  end
end
