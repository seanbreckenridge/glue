defmodule Glue.Repo.Migrations.CreatePageHit do
  use Ecto.Migration

  def change do
    create table(:page_hit) do
      timestamps()
    end
  end
end
