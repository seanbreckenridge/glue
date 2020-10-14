defmodule GlueWeb.PageHitController do
  use GlueWeb, :controller

  alias Glue.PageHits
  alias Glue.PageHits.PageHit

  action_fallback GlueWeb.FallbackController

  def index(conn, _params) do
    page_hit_count = PageHits.page_hit_count()
    IO.inspect(page_hit_count)
    render(conn, "count.json", page_hits: page_hit_count)
  end

  def create(conn, _params) do
    with {:ok, %PageHit{} = _page_hit} <- PageHits.create_page_hit(%{}) do
      conn
      |> resp(:created, "")
    end
  end
end
