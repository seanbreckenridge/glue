defmodule Glue.TMDB_API do
  require Logger

  use Tesla, only: [:get]

  @api_key Application.get_env(:glue, :tmdb_api_key)

  plug(Tesla.Middleware.JSON)

  plug(Tesla.Middleware.BaseUrl, "https://api.themoviedb.org/3")

  plug Tesla.Middleware.Retry,
    delay: 2_000,
    max_retries: 3,
    max_delay: 4_000,
    should_retry: fn
      {:ok, %{status: status}} when status >= 400 -> true
      {:ok, _} -> false
      {:error, _} -> true
    end

  def image_from_trakt_movie(meta_info) do
    slug = meta_info["ids"]["slug"]
    Logger.debug("Requesting Trakt movie #{slug}")

    case meta_info["ids"]["tmdb"] do
      nil ->
        Logger.warn("No tmdb entry for #{slug}, cant get image.")

        # can send another message to check the next item in cache in 1 second, since no request was made
        Process.whereis(Glue.Feed.ImageCache.Server)
        |> Process.send_after(:cache_images, :timer.seconds(1))

        nil

      tmdb_id ->
        get_movie_image(tmdb_id)
    end
  end

  def get_movie_image(tmdb_id) do
    case movie(tmdb_id) do
      {:ok, resp} ->
        poster_path = resp |> Map.get("poster_path", "")
        "https://image.tmdb.org/t/p/w400" <> poster_path

      {:err, _err} ->
        nil
    end
  end

  def movie(tmdb_id) do
    case get("/movie/#{tmdb_id}", query: [api_key: @api_key]) do
      {:ok, %{body: json_body}} ->
        {:ok, json_body}

      {:error, err} ->
        Logger.warn("Request to TMDB #{tmdb_id} failed")
        IO.inspect(err)
        {:error, err}
    end
  end

  def episode(tv_show_id, season, episode) do
    req_url = "/tv/#{tv_show_id}/season/#{season}/episode/#{episode}"

    case get(req_url, query: [api_key: @api_key]) do
      {:ok, %{body: json_body}} ->
        {:ok, json_body}

      {:error, err} ->
        Logger.warn("Request to TMDB #{req_url} failed")
        IO.inspect(err)
        {:error, err}
    end
  end

  def season(tv_show_id, season) do
    req_url = "/tv/#{tv_show_id}/season/#{season}"

    case get(req_url, query: [api_key: @api_key]) do
      {:ok, %{body: json_body}} ->
        {:ok, json_body}

      {:error, err} ->
        Logger.warn("Request to TMDB #{req_url} failed")
        IO.inspect(err)
        {:error, err}
    end
  end

  def tv(tv_show_id) do
    req_url = "/tv/#{tv_show_id}"

    case get(req_url, query: [api_key: @api_key]) do
      {:ok, %{body: json_body}} ->
        {:ok, json_body}

      {:error, err} ->
        Logger.warn("Request to TMDB #{req_url} failed")
        IO.inspect(err)
        {:error, err}
    end
  end

  # RSS feed returns something like https://trakt.tv/episodes/4101234
  def image_from_trakt_episode(meta_info) do
    slug = meta_info["show"]["ids"]["slug"]
    info = get_tmdb_info(meta_info)

    if is_nil(info[:tmdb]) do
      Logger.warn("No TMDB info for #{slug}")

      # can send another message to check the next item in cache in 1 second, since no request was made
      Process.whereis(Glue.Feed.ImageCache.Server)
      |> Process.send_after(:cache_images, :timer.seconds(1))

      nil
    else
      path =
        case episode(info[:tmdb], info[:season], info[:episode]) do
          {:ok, episode_resp} ->
            still_path = Map.get(episode_resp, "still_path")

            if is_nil(still_path) do
              Logger.warn(
                "Couldn't get episode still for #{info[:tmdb]} #{slug}, trying season poster..."
              )

              :timer.sleep(:timer.seconds(2))

              case season(info[:tmdb], info[:season]) do
                {:ok, season_resp} ->
                  poster_path = Map.get(season_resp, "poster_path")

                  if is_nil(poster_path) do
                    Logger.warn(
                      "Couldn't get season poster for #{info[:tmdb]} #{slug}, trying show poster..."
                    )

                    :timer.sleep(:timer.seconds(2))

                    case tv(info[:tmdb]) do
                      {:ok, tv_resp} ->
                        Map.get(tv_resp, "poster_path")

                      {:error, _err} ->
                        nil
                    end
                  else
                    poster_path
                  end

                {:error, _err} ->
                  nil
              end
            else
              still_path
            end

          {:error, _err} ->
            nil
        end

      if not is_nil(path) do
        "https://image.tmdb.org/t/p/w400" <> path
      else
        nil
      end
    end
  end

  defp get_tmdb_info(meta_info) do
    %{
      tmdb: meta_info["show"]["ids"]["tmdb"],
      season: meta_info["episode"]["season"],
      episode: meta_info["episode"]["number"]
    }
  end
end
