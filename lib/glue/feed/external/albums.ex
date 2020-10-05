defmodule Glue.Feed.External.Albums do
  require Logger
  alias Glue.Feed.Utils

  @doc """
  meta_kwlist includes information (e.g. ports/tokens)
  for this external endpoint

  makes requests to update the cached data
  returns {:ok, {id, cached_value}}, where cached_value
  is a map if it succeeds, else {:error, {id, err}}
  """
  def update_cache(meta_kwlist) do
    Logger.info("Updating albums cache...")
    id = meta_kwlist |> Keyword.get(:db_id)
    album_port = meta_kwlist |> Keyword.get(:port)
    url = "http://localhost:#{album_port}?limit=9999&order_by=listened_on&sort=desc"

    case Utils.generic_json_request(url, [], recv_timeout: :timer.minutes(1)) do
      {:ok, response} ->
        cleaned_response =
          response
          |> Enum.map(&Map.drop(&1, ["main_artists", "reasons", "other_artists"]))

        {:ok, {id, cleaned_response}}

      {:error, reason} ->
        {:error, {id, reason}}
    end
  end
end
