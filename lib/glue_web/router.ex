defmodule GlueWeb.Router do
  use GlueWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", GlueWeb do
    pipe_through :browser

    # catchall for frontend typescript react-router routes
    get "/", ReactController, :catchall
  end

  # Other scopes may use custom stacks.
  scope "/api", GlueWeb do
    pipe_through :api

    get "/data/personal", DataController, :personal
    get "/data/feed", DataController, :feed
    get "/data/cubing", DataController, :cubing
  end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through :browser
      live_dashboard "/dashboard", metrics: GlueWeb.Telemetry
    end
  end
end
