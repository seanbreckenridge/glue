defmodule GlueWeb.PageHitController do
  use GlueWeb, :controller

  alias Glue.PageHits
  alias Glue.PageHits.PageHit

  action_fallback GlueWeb.FallbackController

  def index(conn, _params) do
    {:ok, page_hits_offset} = GenServer.call(Glue.OldState, :get_page_hits)
    page_hits_db = PageHits.page_hit_count()
    render(conn, "count.json", page_hits: page_hits_db + page_hits_offset)
  end

  def create(conn, _params) do
    with {:ok, %PageHit{} = _page_hit} <- PageHits.create_page_hit(%{}) do
      conn
      |> resp(:created, "")
    end
  end
end
