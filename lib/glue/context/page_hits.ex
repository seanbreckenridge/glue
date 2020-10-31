defmodule Glue.PageHits do
  @moduledoc """
  The PageHits context.
  """

  import Ecto.Query, warn: false
  alias Glue.Repo

  alias Glue.PageHits.PageHit

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
end
