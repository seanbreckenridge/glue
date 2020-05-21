defmodule Glue.GenCache.External.Albums do
  require Logger
  alias Glue.GenCache.Utils

  @doc """
  meta_kwlist includes information (e.g. ports/tokens)
  for this external endpoint

  makes requests to update the cached data
  returns {:ok, {id, cached_value}}, where cached_value
  is a map if it suceeds, else {:error, {id, err}}
  """
  def update_cache(meta_kwlist) do
    Logger.info("Updating albums cache...")
    id = meta_kwlist |> Keyword.get(:db_id)
    album_port = meta_kwlist |> Keyword.get(:port)
    url = "http://localhost:#{album_port}?limit=9999&order_by=listened_on&sort=desc"

    {status, response} = Utils.generic_json_request(url, [], recv_timeout: :timer.seconds(30))

    cleaned_response =
      response
      |> Map.get("albums")
      |> Enum.map(&Map.drop(&1, ["main_artists", "reasons", "other_artists"]))

    {status, {id, cleaned_response}}
  end
end
