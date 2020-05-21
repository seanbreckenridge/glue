defmodule Glue.GenCache.External.Albums do
  require Logger

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

    case HTTPoison.get(url) do
      {:ok, %HTTPoison.Response{status_code: status_code, body: body}} ->
        response =
          case Jason.decode(body) do
            {:ok, json_map} -> %{"albums" => json_map}
            {:error, _} -> %{"error" => "Error decoding response to JSON: #{body}"}
          end

        cond do
          status_code >= 200 and status_code < 400 ->
            Logger.debug("Requests to Albums server (Google API) succeeded")
            {:ok, {id, response}}

          true ->
            IO.inspect(response)
            Logger.warn("Albums request failed with status_code #{status_code}")
            {:error, {id, response}}
        end

      {:error, %HTTPoison.Error{reason: reason}} ->
        IO.inspect({:error, reason})
        {:error, {id, %{"error" => "unrecoverable error"}}}
    end
  end
end
