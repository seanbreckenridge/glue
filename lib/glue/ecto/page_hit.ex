defmodule Glue.PageHits.PageHit do
  use Ecto.Schema
  import Ecto.Changeset

  schema "page_hit" do
    timestamps()
  end

  @doc false
  def changeset(page_hit, attrs) do
    page_hit
    |> cast(attrs, [])
    |> validate_required([])
  end
end
