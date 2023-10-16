defmodule GlueWeb.PageHitController do
  require Logger

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

  # this returns statistics for how many page hits have been recorded
  # in the last 'n' days, n being the number of days specified
  # e.g. like /page_hit/7 for the last 7 days
  def show(conn, %{"id" => day_str}) do
    days = day_str |> String.to_integer()
    Logger.info("Getting page hits for the last #{days} days")
    page_hits = PageHits.page_hits_in_last_n_days(days)

    render(conn, "count.json", page_hits: page_hits)
  end
end
