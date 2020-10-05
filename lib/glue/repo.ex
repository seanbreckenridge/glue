defmodule Glue.Repo do
  use Ecto.Repo,
    otp_app: :glue,
    adapter: Ecto.Adapters.Postgres
end
