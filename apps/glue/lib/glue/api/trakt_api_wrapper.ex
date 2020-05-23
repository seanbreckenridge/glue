defmodule Glue.TraktAPI do
  require Logger
  alias Glue.GenCache.Utils
  alias Glue.TMDB_API

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

  def history(page) when is_integer(page) do
    case get("/users/purplepinapples/history?limit=100&page=#{page}") do
      {:ok, %{body: body}} ->
        body

      {:error, _} ->
        Logger.warn("Could not get tmdb id from Trakt API Request")
        []
    end
  end
end