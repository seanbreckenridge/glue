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

  # may be faster, probably overkill
  # defp replace_cache_control([]), do: []
  # defp replace_cache_control([first | rest]), do: replace_cache_control(first, [], rest)
  # defp replace_cache_control({"cache-control", _throwaway}, cur, rest) do
  #   Enum.concat([cur, rest, [{"cache-control", "max-age=600"}]]) # early exit if we find cache control
  # end
  # defp replace_cache_control(header, cur, []), do: [header | cur]  # if there are no more headers
  # defp replace_cache_control(header, cur, rest) do  # if this wasn't the cache control header
  #   replace_cache_control(rest |> hd(), [header | cur], rest |> tl())
  # end

  # def cached_response(conn, _opts, cache_time_seconds \\ 600)
  #     when is_integer(cache_time_seconds) do
  #   # Pass the number of seconds this request can be cached using
  #   # the CacheControl header as an argument. Else, defaults to 10 minutes
  #   new_headers =
  #     conn.resp_headers
  #     |> Enum.map(fn {header_name, header_value} ->
  #       # dont do anything
  #       if header_name == "cache-control" do
  #         {"cache-control", "max-age=#{cache_time_seconds}"}
  #       else
  #         {header_name, header_value}
  #       end
  #     end)

  #   %{conn | resp_headers: new_headers}
  # end

  # personal data api, items can be cached for 10 minutes or so,
  # to allow for cached requests on the TS frontend
  # pipeline :cached_api do
  #   plug :accepts, ["json"]
  #   plug :cached_response, 600
  # end

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
