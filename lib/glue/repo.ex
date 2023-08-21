defmodule Glue.Repo do
  use Ecto.Repo,
    otp_app: :glue,
    adapter: Ecto.Adapters.SQLite3
end
