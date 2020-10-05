defmodule Glue.Repo.Migrations.CreateFeedCache do
  use Ecto.Migration

  def change do
    create table(:feed_cache) do
      add :service, :string
      add :cached_data, :binary

      timestamps()
    end
  end
end
