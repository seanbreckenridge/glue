defmodule Glue.FeedCache do
  use Ecto.Schema
  import Ecto.Changeset

  schema "feed_cache" do
    field :service, :string
    field :cached_data, :binary

    timestamps()
  end

  @doc false
  def changeset(feed_cache, attrs) do
    feed_cache
    |> cast(attrs, [:service, :cached_data])
    |> validate_required([:service, :cached_data])
  end
end
