defmodule GlueWeb.DataView do
  # personal info
  def render("personal_info.json", %{links: links}), do: links
  # feed api
  def render("feed.json", %{feed: feed}) when is_list(feed), do: feed
  # my cubing records
  def render("cubing.json", %{cubing: info}), do: info
end
