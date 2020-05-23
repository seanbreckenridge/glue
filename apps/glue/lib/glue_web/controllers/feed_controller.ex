defmodule GlueWeb.FeedController do
  require Logger
  use GlueWeb, :controller
  alias GlueWeb.PageController.Utils

  plug :put_layout, "app.html"

  def feed(conn, _params) do
    cached_images = GenServer.call(Glue.GenCache.ImageCache.Worker, :get_cached_images)

    feed_data =
      GenServer.call(Glue.GenCache.Worker, :get_feed_data)
      |> Enum.map(fn feed_info ->
        if Map.has_key?(cached_images, feed_info.site_url) do
          %{feed_info | image_url: Map.get(cached_images, feed_info.site_url)}
        else
          feed_info
        end
      end)

    data =
      Utils.common_values("media feed")
      |> Utils.add_page_title()
      |> Map.put(
        :feed_data,
        feed_data
      )
      |> Map.put(
        :include_bootstrap,
        true
      )

    render(conn, "index.html", data: data)
  end
end
