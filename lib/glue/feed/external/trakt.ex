defmodule Glue.Feed.External.Trakt do
  require Logger
  alias Glue.TraktAPI

  @doc """
  meta_kwlist includes information (e.g. ports/tokens)
  for this external endpoint

  makes requests to update the cached data
  returns {:ok, {id, cached_value}}, where cached_value
  is a map if it succeeds, else {:error, {id, err}}
  """
  def update_cache(meta_kwlist) do
    id = meta_kwlist |> Keyword.get(:db_id)

    case request_trakt() do
      nil ->
        {:error, {id, nil}}

      pages ->
        {:ok, {id, pages}}
    end
  end

  def request_trakt() do
    first_page = TraktAPI.history(1)
    # safely comply with rate limit
    :timer.sleep(5000)
    second_page = TraktAPI.history(2)

    if first_page |> Enum.empty?() or second_page |> Enum.empty?() do
      nil
    else
      Enum.concat(first_page, second_page) |> Enum.map(&cleanup_item/1)
    end
  end

  # extracts items that I want from the feed, the entries, grabs some of the attributes
  def cleanup_item(feed_item_map) do
    if feed_item_map["type"] == "episode" do
      %{
        "meta_info" => feed_item_map |> Map.take(["show", "episode"]),
        "title" =>
          feed_item_map["show"]["title"] <>
            " " <>
            Integer.to_string(feed_item_map["episode"]["season"]) <>
            "x" <>
            Integer.to_string(feed_item_map["episode"]["number"]) <>
            " \"" <> feed_item_map["episode"]["title"] <> "\"",
        "timestamp" => feed_item_map["watched_at"],
        "site_url" =>
          "https://trakt.tv/shows/" <>
            feed_item_map["show"]["ids"]["slug"] <>
            "/seasons/" <>
            Integer.to_string(feed_item_map["episode"]["season"]) <>
            "/episodes/" <> Integer.to_string(feed_item_map["episode"]["number"])
      }
    else
      %{
        "meta_info" => feed_item_map["movie"],
        "title" => feed_item_map["movie"]["title"],
        "timestamp" => feed_item_map["watched_at"],
        "site_url" =>
          "https://trakt.tv/movies/" <>
            feed_item_map["movie"]["ids"]["slug"]
      }
    end
  end
end
