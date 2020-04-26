defmodule GlueWeb.PageController do
  use GlueWeb, :controller
  alias GlueWeb.PageController.Utils

  def index(conn, _params) do
    data = Utils.common_values() |> Utils.add_page_title()
    render(conn, "index.html", data: data)
  end
end
