defmodule Glue.GenCache do
  use Ecto.Schema
  import Ecto.Changeset

  schema "gen_cache" do
    field :service, :string
    field :cached_data, :string

    timestamps()
  end

  @doc false
  def changeset(gen_cache, attrs) do
    gen_cache
    |> cast(attrs, [:service, :cached_data])
    |> validate_required([:service, :cached_data])
  end
end
