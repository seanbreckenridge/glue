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
  Returns the list of page_hit.

  ## Examples

      iex> list_page_hit()
      [%PageHit{}, ...]

  """
  def list_page_hit do
    Repo.all(PageHit)
  end

  @doc """
  Gets a single page_hit.

  Raises `Ecto.NoResultsError` if the Page hit does not exist.

  ## Examples

      iex> get_page_hit!(123)
      %PageHit{}

      iex> get_page_hit!(456)
      ** (Ecto.NoResultsError)

  """
  def get_page_hit!(id), do: Repo.get!(PageHit, id)

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

  @doc """
  Deletes a page_hit.

  ## Examples

      iex> delete_page_hit(page_hit)
      {:ok, %PageHit{}}

      iex> delete_page_hit(page_hit)
      {:error, %Ecto.Changeset{}}

  """
  def delete_page_hit(%PageHit{} = page_hit) do
    Repo.delete(page_hit)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking page_hit changes.

  ## Examples

      iex> change_page_hit(page_hit)
      %Ecto.Changeset{data: %PageHit{}}

  """
  def change_page_hit(%PageHit{} = page_hit, attrs \\ %{}) do
    PageHit.changeset(page_hit, attrs)
  end
end
