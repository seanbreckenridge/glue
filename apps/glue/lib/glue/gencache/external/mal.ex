defmodule Glue.GenCache.External.Mal do
  require Logger

  @doc """
  meta_kwlist includes information (e.g. ports/tokens)
  for this external endpoint

  makes requests to update the cached data
  returns {:ok, {id, cached_value}}, where cached_value
  is a map if it succeeds, else {:error, {id, err}}
  """
  def update_cache(meta_kwlist) do
    id = meta_kwlist |> Keyword.get(:db_id)
    # grabs URL from application configuration
    client = JikanEx.client()

    case client
         |> JikanEx.Request.user("purplepinapples", ["history"], %{},
           adapter: [recv_timeout: 30_000]
         ) do
      {:ok, response} ->
        Logger.debug("JikanEx request succeeded")
        {:ok, {id, response |> Map.take(["history"])}}

      {:error, error} ->
        Logger.warn("JikanEx request failed:")
        IO.inspect(error)
        {:error, {id, %{}}}
    end
  end
end
