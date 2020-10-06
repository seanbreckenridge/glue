defmodule Glue.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      Glue.Repo,
      # Start the Telemetry supervisor
      GlueWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Glue.PubSub},
      # Start the Endpoint (http/https)
      GlueWeb.Endpoint,
      # start cachex process for caching feed requests
      {Cachex, name: :feed_cache},
      # Start Feed and Image Cache genservers
      Glue.Feed.ImageCache.Server,
      Glue.Feed.Server
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Glue.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    GlueWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
