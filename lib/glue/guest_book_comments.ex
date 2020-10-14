defmodule Glue.GuestBookComments do
  @moduledoc """
  The GuestBookComments context.
  """

  import Ecto.Query, warn: false
  alias Glue.Repo

  alias Glue.GuestBookComments.GuestBookComment

  @doc """
  Returns the list of gb_comment.

  ## Examples

      iex> list_gb_comment()
      [%GuestBookComment{}, ...]

  """
  def list_gb_comment do
    Repo.all(GuestBookComment)
  end

  @doc """
  Return the list of approved gb_comment.

  ## Examples

      iex> list_approved_gb_comment()
      [%GuestBookComment{}, ...]
  """
  def list_approved_gb_comment do
    query =
      from c in GuestBookComment,
        order_by: c.id,
        where: c.approved and not c.denied

    Repo.all(query |> reverse_order)
  end

  @doc """
  Gets a single guest_book_comment.

  Raises `Ecto.NoResultsError` if the Guest book comment does not exist.

  ## Examples

      iex> get_guest_book_comment!(123)
      %GuestBookComment{}

      iex> get_guest_book_comment!(456)
      ** (Ecto.NoResultsError)

  """
  def get_guest_book_comment!(id), do: Repo.get!(GuestBookComment, id)

  @doc """
  Creates a guest_book_comment.

  ## Examples

      iex> create_guest_book_comment(%{field: value})
      {:ok, %GuestBookComment{}}

      iex> create_guest_book_comment(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_guest_book_comment(attrs \\ %{}) do
    %GuestBookComment{}
    |> GuestBookComment.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a guest_book_comment.

  ## Examples

      iex> update_guest_book_comment(guest_book_comment, %{field: new_value})
      {:ok, %GuestBookComment{}}

      iex> update_guest_book_comment(guest_book_comment, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_guest_book_comment(%GuestBookComment{} = guest_book_comment, attrs) do
    guest_book_comment
    |> GuestBookComment.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a guest_book_comment.

  ## Examples

      iex> delete_guest_book_comment(guest_book_comment)
      {:ok, %GuestBookComment{}}

      iex> delete_guest_book_comment(guest_book_comment)
      {:error, %Ecto.Changeset{}}

  """
  def delete_guest_book_comment(%GuestBookComment{} = guest_book_comment) do
    Repo.delete(guest_book_comment)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking guest_book_comment changes.

  ## Examples

      iex> change_guest_book_comment(guest_book_comment)
      %Ecto.Changeset{data: %GuestBookComment{}}

  """
  def change_guest_book_comment(%GuestBookComment{} = guest_book_comment, attrs \\ %{}) do
    GuestBookComment.changeset(guest_book_comment, attrs)
  end
end
