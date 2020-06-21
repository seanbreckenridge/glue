defmodule GlueWeb.FeedController do
  require Logger
  use GlueWeb, :controller
  alias GlueWeb.Utils

  @minute :timer.minutes(1)
  @hour :timer.hours(1)
  @day :timer.hours(24)

  plug :put_layout, "app.html"

  def feed(conn, _params) do
    now = NaiveDateTime.utc_now()

    cached_images =
      GenServer.call(Glue.GenCache.ImageCache.Worker, :get_cached_images, :timer.seconds(30))

    feed_data =
      GenServer.call(Glue.GenCache.Worker, :get_feed_data)
      |> Stream.map(fn feed_info ->
        if Map.has_key?(cached_images, feed_info.site_url) do
          %{feed_info | image_url: Map.get(cached_images, feed_info.site_url)}
        else
          feed_info
        end
      end)
      |> Enum.map(fn feed_info ->
        %{feed_info | timestamp: descrive_naive_datetime(feed_info.timestamp, now)}
      end)

    data =
      Utils.common_values("media feed")
      |> Utils.add_page_title()
      |> Map.put(
        :feed_data,
        feed_data
      )
      |> Map.put(
        :include_bootstrap,
        true
      )

    render(conn, "index.html", data: data)
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
