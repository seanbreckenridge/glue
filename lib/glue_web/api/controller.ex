defmodule GlueWeb.DataController do
  @moduledoc """
  This is a public, generic JSON interface
  to a lot of the data on my website. It's used
  by the frontend to get data.

  Also the interface to Glue.Feed 
  """
  use GlueWeb, :controller
  alias GlueWeb.Feed
  alias GlueWeb.Cubing

  def feed(conn, params) do
    count = String.to_integer(Map.get(params, "count", "100"))
    format_dates = Map.has_key?(params, "format_dates")
    render(conn, "feed.json", Feed.get(count, format_dates))
  end

  def cubing(conn, _params) do
    render(conn, "cubing.json", Cubing.get())
  end
end

defmodule GlueWeb.Feed do
  require Logger

  @minute :timer.minutes(1)
  @hour :timer.hours(1)
  @day :timer.hours(24)

  def get(count, format_dates \\ true) do
    cache_key = "#{count}.#{format_dates}"
    {:ok, cached_feed_data} = Cachex.get(:feed_cache, cache_key)

    if is_nil(cached_feed_data) do
      Logger.debug("feed request cache miss for key #{cache_key}, computing value...")
      now = NaiveDateTime.utc_now()

      cached_images =
        GenServer.call(Glue.Feed.ImageCache.Server, :get_cached_images, :timer.seconds(30))

      feed_data = %{
        feed:
          GenServer.call(Glue.Feed.Server, :get_feed_data, :timer.seconds(30))
          # attach images
          |> Stream.map(fn feed_info ->
            if Map.has_key?(cached_images, feed_info.site_url) do
              %{feed_info | image_url: Map.get(cached_images, feed_info.site_url)}
            else
              feed_info
            end
          end)
          # format date if asked to
          |> Enum.map(fn feed_info ->
            if format_dates do
              %{feed_info | timestamp: descrive_naive_datetime(feed_info.timestamp, now)}
            else
              feed_info
            end
          end)
          |> Enum.take(count)
      }

      # this cache is invalidated in Glue.Feed.Server, whenever anything new is
      # added to the feed data
      {:ok, _} = Cachex.put(:feed_cache, cache_key, feed_data, ttl: :timer.minutes(30))
      feed_data
    else
      Logger.debug("feed request cache hit for key #{cache_key}, using cached value...")
      cached_feed_data
    end
  end

  defp descrive_naive_datetime(time, now) do
    describe_naive_datetime(NaiveDateTime.diff(now, time, :millisecond))
  end

  defp describe_naive_datetime(diff) when diff > @day,
    do: quotient(diff, @day) |> describe_diff("day")

  defp describe_naive_datetime(diff) when diff > @hour,
    do: quotient(diff, @hour) |> describe_diff("hour")

  defp describe_naive_datetime(diff) do
    minutes_ago = quotient(diff, @minute)

    if minutes_ago < 1 do
      "now"
    else
      minutes_ago |> describe_diff("minute")
    end
  end

  defp quotient(dividend, divisor), do: floor(dividend / divisor)

  defp describe_diff(ago, duration_str) do
    if ago == 1 do
      "#{ago} #{duration_str} ago"
    else
      "#{ago} #{duration_str}s ago"
    end
  end
end

defmodule GlueWeb.Cubing do
  def get() do
    wca_data = GenServer.call(Glue.Feed.Server, :get_wca_data, :timer.seconds(10))

    events =
      wca_data["events"]
      |> Enum.map(fn event_data ->
        %{
          "name" => event_data["name"],
          "single" => format_event(event_data["single"]),
          "average" => format_event(event_data["average"])
        }
      end)

    %{cubing: Map.put(wca_data, "events", events)}
  end

  defp format_event(event) do
    event
    |> Enum.map(fn {k, v} ->
      {k, format_item(v)}
    end)
    |> Enum.into(%{})
  end

  defp format_item(nil), do: "-"
  defp format_item(time) when is_bitstring(time), do: time
  defp format_item(rank) when is_integer(rank), do: rank |> Integer.to_string()
end
