defmodule Glue.PageHits do
  @moduledoc """
  The PageHits context.
  """

  import Ecto.Query, warn: false
  alias Glue.Repo

  alias Glue.PageHits.PageHit

  @epoch ~N[1970-01-01 00:00:00]

  @doc """
  Returns the number of page hits
  """
  def page_hit_count do
    # returns something like [5], the head gets the actual count
    Repo.all(
      from p in PageHit,
        select: count(p.id)
    )
    |> hd
  end

  @doc """
  Creates a page_hit.

  ## Examples

      iex> create_page_hit(%{field: value})
      {:ok, %PageHit{}}

      iex> create_page_hit(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_page_hit(attrs \\ %{}) do
    %PageHit{}
    |> PageHit.changeset(attrs)
    |> Repo.insert()
  end

  def page_hit_epochs() do
    epochs =
      Repo.all(from p in PageHit, select: p.inserted_at)
      |> Enum.map(&NaiveDateTime.diff(&1, @epoch))
      |> Jason.encode!()

    IO.puts("EPOCHS:#{epochs}")
  end

  @doc """
  Returns the number of page hits in the last n days
  """
  def page_hits_in_last_n_days(days) do
    larger_than_on_day = NaiveDateTime.utc_now() |> NaiveDateTime.add(-60 * 60 * 24 * days - 1)
    # get the time at 00:00:01 on that day, so we get page-hits from the start of
    # the day onwards. This makes the stats easier to read since its not always
    # a rolling average, going up and down
    {:ok, larger_than} =
      NaiveDateTime.new(
        larger_than_on_day.year,
        larger_than_on_day.month,
        larger_than_on_day.day,
        0,
        0,
        1
      )

    Repo.all(
      from p in PageHit,
        where: p.inserted_at > ^larger_than,
        select: count(p.id)
    )
    |> hd
  end
end
