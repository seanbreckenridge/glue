defmodule Glue.Feed.External.Wca do
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
    Logger.info("Updating WCA cache...")
    id = meta_kwlist |> Keyword.get(:db_id)
    wca_port = meta_kwlist |> Keyword.get(:port)
    url = "http://localhost:#{wca_port}/2017BREC02"

    {status, response} = Utils.generic_json_request(url, [], recv_timeout: :timer.seconds(10))
    {status, {id, response}}
  end
end
