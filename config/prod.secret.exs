# In this file, we load production configuration and secrets
# from environment variables. You can also hardcode secrets,
# although such is generally not recommended and you have to
# remember to add this file to your .gitignore.
import Config

database_url =
  System.get_env("GLUE_DATABASE_PATH") ||
    raise """
    environment variable GLUE_DATABASE_PATH is missing
    """

config :glue, Glue.Repo,
  database: database_url,
  pool_size: String.to_integer(System.get_env("POOL_SIZE") || "5")

secret_key_base =
  System.get_env("GLUE_SECRET_KEY_BASE") ||
    raise """
    environment variable SECRET_KEY_BASE is missing.
    You can generate one by calling: mix phx.gen.secret
    """

config :glue, GlueWeb.Endpoint,
  http: [
    port: String.to_integer(System.get_env("GLUE_PORT") || "8082"),
    transport_options: [socket_opts: [:inet6]]
  ],
  secret_key_base: secret_key_base

# ## Using releases (Elixir v1.9+)
#
# If you are doing OTP releases, you need to instruct Phoenix
# to start each relevant endpoint:
#
#     config :glue, GlueWeb.Endpoint, server: true
#
# Then you can assemble a release by calling `mix release`.
# See `mix help release` for more information.
