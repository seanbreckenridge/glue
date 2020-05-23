defmodule Glue.GenCache.External.Trakt do
  require Logger
  alias Glue.TraktAPI

  @doc """
  meta_kwlist includes information (e.g. ports/tokens)
  for this external endpoint

  makes requests to update the cached data
  returns {:ok, {id, cached_value}}, where cached_value
  is a map if it suceeds, else {:error, {id, err}}
  """
  def update_cache(meta_kwlist) do
    id = meta_kwlist |> Keyword.get(:db_id)

    {:ok, {id, request_trakt()}}
  end

  def request_trakt() do
    first_page = TraktAPI.history(1)
    second_page = TraktAPI.history(2)
    Enum.concat(first_page, second_page) |> Enum.map(&cleanup_item/1)
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
          "https=>//trakt.tv/movies/" <>
            feed_item_map["movie"]["ids"]["slug"]
      }
    end
  end
end
