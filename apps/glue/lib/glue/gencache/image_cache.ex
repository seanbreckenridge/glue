defmodule Glue.ImageCache do
  use Ecto.Schema
  import Ecto.Changeset

  schema "image_cache" do
    field :image_url, :string
    field :site_url, :string

    timestamps()
  end

  @doc false
  def changeset(image_cache, attrs) do
    image_cache
    |> cast(attrs, [:site_url, :image_url])
    |> validate_required([:site_url, :image_url])
  end
end
