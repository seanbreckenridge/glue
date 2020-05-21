defmodule GlueWeb.FeedController do
  use GlueWeb, :controller
  alias GlueWeb.PageController.Utils

  plug :put_layout, "app.html"

  def feed(conn, _params) do
    data = Utils.common_values("feed") |> Utils.add_page_title()
    render(conn, "index.html", data: data)
  end
end
