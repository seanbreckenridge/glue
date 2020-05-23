defmodule Glue.Repo.Migrations.CreateImageCache do
  use Ecto.Migration

  def change do
    create table(:image_cache) do
      add :site_url, :string
      add :image_url, :string

      timestamps()
    end

  end
end
