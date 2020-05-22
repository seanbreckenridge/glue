defmodule Glue.GenCache.FeedItem do
  defstruct title: "",
            timestamp: nil,
            image_url: nil,
            type: nil,
            site_url: nil
end

defmodule Glue.GenCache.GenerateFeed do
  require Logger
  alias Glue.GenCache.FeedItem
  # converts the raw cached data from all feeds to a single list,
  # ordered by most recent.
  def normalize_feed(feed_data) when is_map(feed_data) do
    feed_data
    |> Map.keys()
    # parse into FeedItems
    |> Enum.map(fn feed ->
      apply(
        __MODULE__,
        get_normalize_function(feed),
        [Map.get(feed_data, feed)]
      )
    end)
    # Combine Lists
    |> List.flatten()
    |> sort_feed_by_date()
  end

  defp album_date_to_naive_datetime(listened_str) when is_bitstring(listened_str) do
    [year, month, date] = listened_str |> String.split("-") |> Enum.map(&String.to_integer/1)

    case NaiveDateTime.new(
           year,
           month,
           date,
           12,
           0,
           0
         ) do
      {:ok, datetime} ->
        datetime

      {:error, _} ->
        Logger.warn("Couldnt parse #{listened_str} to datetime.")
        nil
    end
  end

  defp parse_iso8601_date(nil), do: nil

  defp parse_iso8601_date(datestr) when is_bitstring(datestr) do
    case NaiveDateTime.from_iso8601(datestr) do
      {:ok, datetime} ->
        datetime

      {:error, _} ->
        Logger.warn("Couldn't parse #{datestr} into datetime")
        nil
    end
  end

  def normalize_albums(album_data) do
    album_data
    |> Enum.map(fn old_map ->
      %FeedItem{
        type: "albums",
        image_url: old_map["album_artwork"],
        title: "#{old_map["album_name"]} - #{old_map["cover_artist"]}",
        site_url: old_map["discogs_url"],
        timestamp: album_date_to_naive_datetime(old_map["listened_str"])
      }
    end)
  end

  def normalize_mal(mal_data) do
    mal_data
    |> Map.get("history")
    |> Enum.map(fn old_map ->
      %FeedItem{
        type: "mal",
        image_url: nil,
        title: "#{old_map["meta"] |> Map.get("name")} Episode #{old_map["increment"]}",
        site_url: old_map["meta"] |> Map.get("url"),
        timestamp: parse_iso8601_date(old_map["date"])
      }
    end)
  end

  def normalize_trakt(trakt_data) do
    trakt_data
    |> Enum.map(fn old_data ->
      %FeedItem{
        type: "trakt",
        image_url: nil,
        timestamp: parse_iso8601_date(old_data["published"]),
        title: old_data["title"],
        site_url: old_data["url"]
      }
    end)
  end

  # gets the 'normalize' function for an endpoint
  defp get_normalize_function(key) when is_bitstring(key) do
    func_name = "normalize_#{key}"

    try do
      String.to_existing_atom(func_name)
    rescue
      ArgumentError ->
        String.to_atom(func_name)
    end
  end

  defp sort_feed_by_date(feed_list) do
    feed_list
    # remove anything without dates
    |> Enum.reject(&is_nil(&1.timestamp))
    # sort by date
    |> Enum.sort(fn f1, f2 ->
      NaiveDateTime.compare(f1.timestamp, f2.timestamp) == :gt
    end)
  end
end
