defmodule GlueWeb.DataView do
  # personal info
  def render("personal_info.json", %{links: links}) do
    %{
      "links" => links |> Enum.map(&serialize_tuple/1)
    }
  end

  # feed api
  def render("feed.json", %{feed: feed}) when is_list(feed), do: feed
  # my cubing records
  def render("cubing.json", %{cubing: info}), do: info

  defp serialize_tuple({url, name}), do: %{"name" => name, "url" => url}
  defp serialize_tuple({url, name, image}), do: %{"name" => name, "url" => url, "image" => image}
end
