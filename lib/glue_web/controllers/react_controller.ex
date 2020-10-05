defmodule GlueWeb.ReactController do
  use GlueWeb, :controller

  @moduledoc """
  This defines the single entrypoint to the react part of this site.
  That uses react router, so its just the one route here to embed the root div
  """

  def catchall(conn, _params) do
    render(conn, "index.html")
  end
end
