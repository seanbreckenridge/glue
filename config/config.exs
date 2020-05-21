# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :glue,
  ecto_repos: [Glue.Repo]

# service key specifies the module name to get cached information for the GenCache,
# at Glue.GenCache.External.ServiceKey
# e.g. Glue.GenCache.External.Albums for "albums"
config :glue,
  albums: [db_id: 1, service_key: "albums", port: 8083, refresh_ms: :timer.hours(6)],
  wca: [db_id: 2, service_key: "wca", port: 8010, refresh_ms: :timer.hours(24 * 7)],
  mal: [db_id: 3, service_key: "mal", port: 8000, refresh_ms: :timer.hours(4)],
  trakt: [db_id: 4, service_key: "trakt", refresh_ms: :timer.hours(1)]

# Configures the endpoint
config :glue, GlueWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "n+5UxTP3OEwLSslhJ6IECJI503FuwxN3EVl3qQ64GlanvT2k6uKbaIk2WrHO2MNv",
  render_errors: [view: GlueWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Glue.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
