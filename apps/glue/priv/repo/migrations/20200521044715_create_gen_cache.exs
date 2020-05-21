defmodule Glue.Repo.Migrations.CreateGenCache do
  use Ecto.Migration

  def change do
    create table(:gen_cache) do
      add :service, :string
      add :cached_data, :binary

      timestamps()
    end

  end
end
