defmodule GlueWeb.FeedController do
  require Logger
  use GlueWeb, :controller
  alias GlueWeb.PageController.Utils

  plug :put_layout, "app.html"

  def feed(conn, _params) do
    data =
      Utils.common_values("feed")
      |> Utils.add_page_title()
      |> Map.put(
        :feed_data,
        GenServer.call(Glue.GenCache.Worker, :get_feed_data)
      )

    IO.inspect(data)

    render(conn, "index.html", data: data)
  end
end
