defmodule Glue.Repo.Migrations.CreateGbComment do
  use Ecto.Migration

  def change do
    create table(:gb_comment) do
      add :name, :string
      add :comment, :string
      add :approved, :boolean, default: false, null: false

      timestamps()
    end

  end
end
