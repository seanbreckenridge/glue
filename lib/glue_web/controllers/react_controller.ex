defmodule GlueWeb.ReactController do
  use GlueWeb, :controller

  @moduledoc """
  This defines the single entrypoint to the react part of this site.
  react_layout.html has the compiled js bundle as part of the <head>
  """

  plug :put_layout, "react_layout.html"

  def catchall(conn, _params) do
    render(conn, "index.html")
  end
end
