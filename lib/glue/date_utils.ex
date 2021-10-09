defmodule Glue.DateUtils do
  @moduledoc """
  Describes datetimes in a readable format, describing the
  difference between now and the datetime. Like

  '2 hours ago'
  '1 week ago'
  '6 months ago'

  Used for the API endpoints which render the
  'Media Feed' and 'Guest Book' windows
  """

  @minute :timer.minutes(1)
  @hour :timer.hours(1)
  @day :timer.hours(24)
  @week @day * 7
  # 30.44 accounts for leap years - is the average month length
  @month @day * 30.44
  @year @month * 12

  def descrive_naive_datetime(time, now) do
    describe_naive_datetime(NaiveDateTime.diff(now, time, :millisecond))
  end

  def describe_naive_datetime(diff) when diff > @year,
    do: quotient(diff, @year) |> describe_diff("year")

  # only show this if its more than 3 months ago
  def describe_naive_datetime(diff) when diff > @month * 3,
    do: quotient(diff, @month) |> describe_diff("month")

  # only show this if its more than 4 weeks ago
  def describe_naive_datetime(diff) when diff > @week * 4,
    do: quotient(diff, @week) |> describe_diff("week")

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
