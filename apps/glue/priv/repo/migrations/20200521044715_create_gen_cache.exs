defmodule Glue.Repo.Migrations.CreateGenCache do
  use Ecto.Migration

  def change do
    create table(:gen_cache) do
      add :service, :string
      add :cached_data, :string

      timestamps()
    end

  end
end
