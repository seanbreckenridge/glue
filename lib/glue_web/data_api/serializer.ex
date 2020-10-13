defmodule GlueWeb.DataView do
  # feed api
  def render("feed.json", %{feed: feed}) when is_list(feed), do: feed
  # my cubing records
  def render("cubing.json", %{cubing: info}), do: info
end
