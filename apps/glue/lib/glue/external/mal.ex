defmodule Glue.GenCache.External.Mal do
  @doc """
  meta_kwlist includes information (e.g. ports/tokens)
  for this external endpoint

  makes requests to update the cached data
  returns {:ok, {id, cached_value}}, where cached_value
  is a map if it suceeds, else {:error, {id, err}}
  """
  def update_cache(meta_kwlist) do
    id = meta_kwlist |> Keyword.get(:db_id)
    {:error, {id, %{}}}
  end
end
