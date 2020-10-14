defmodule Glue.DateUtils do
  @minute :timer.minutes(1)
  @hour :timer.hours(1)
  @day :timer.hours(24)
  @week @day * 7

  def descrive_naive_datetime(time, now) do
    describe_naive_datetime(NaiveDateTime.diff(now, time, :millisecond))
  end

  # only show this if its more than 2 weeks ago
  def describe_naive_datetime(diff) when diff > @week * 4,
    do: quotient(diff, @week) - 1 |> describe_diff("week")

  def describe_naive_datetime(diff) when diff > @day,
    do: quotient(diff, @day) |> describe_diff("day")

  def describe_naive_datetime(diff) when diff > @hour,
    do: quotient(diff, @hour) |> describe_diff("hour")

  def describe_naive_datetime(diff) do
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
