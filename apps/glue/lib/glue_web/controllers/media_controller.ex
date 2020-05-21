defmodule GlueWeb.MediaController do
  use GlueWeb, :controller
  alias GlueWeb.PageController.Utils

  plug :put_layout, "app.html"

  def media(conn, _params) do
    data = Utils.common_values("media") |> Utils.add_page_title()
    render(conn, "index.html", data: data)
  end
end
