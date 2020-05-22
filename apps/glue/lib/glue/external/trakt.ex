defmodule Glue.GenCache.External.Trakt do
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
    id = meta_kwlist |> Keyword.get(:db_id)
    url = meta_kwlist |> Keyword.get(:rss_url)

    case Utils.generic_http_request(url, [], recv_timeout: :timer.seconds(10)) do
      {:ok, response_body} ->
        {:ok, {id, ElixirFeedParser.parse(response_body) |> cleanup_feed()}}

      # warning logged in generic_http_request
      {:error, _} ->
        {:error, {id, %{}}}
    end
  end

  # extracts items that I want from the feed, the entries, grabs some of the attributes
  defp cleanup_feed(feed) do
    feed
    |> Map.get(:entries)
    |> Enum.map(&cleanup_item/1)
  end

  defp cleanup_item(feed_item_map) do
    feed_item_map
    |> Map.take([:title, :published, :url])
    |> Map.put(
      :img_url,
      get_img_url(Map.get(feed_item_map, :content, ""))
    )
  end

  # reutrns nil if fragment couldnt be parsed/image doesnt exist
  defp get_img_url(html_text) do
    case Floki.parse_fragment(html_text) do
      {:ok, fragment} ->
        fragment
        |> Floki.find("img")
        |> Floki.attribute("src")
        |> Enum.at(0)

      {:error, _} ->
        Logger.warn("Error parsing HTML fragment: #{html_text}")
        nil
    end
  end
end
