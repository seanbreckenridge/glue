defmodule Glue.GuestBookComments.GuestBookComment do
  use Ecto.Schema
  import Ecto.Changeset

  schema "gb_comment" do
    field :approved, :boolean, default: false
    field :comment, :string
    field :name, :string

    timestamps()
  end

  @doc false
  def changeset(guest_book_comment, attrs) do
    guest_book_comment
    |> cast(attrs, [:name, :comment, :approved])
    |> validate_required([:name, :comment, :approved])
  end
end
