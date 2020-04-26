# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :glue,
  ecto_repos: [Glue.Repo]

# Configures the endpoint
config :glue, GlueWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "uY5v8eAXQFG+cgRJ9/qWDd/tB8TLktM0rFpXmAvVHUQtzb9eXvQbeH0MHrFvOFnt",
  render_errors: [view: GlueWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Glue.PubSub, adapter: Phoenix.PubSub.PG2],
  site_name: "SeanBr"

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
