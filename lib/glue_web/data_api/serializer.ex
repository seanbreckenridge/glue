defmodule GlueWeb.DataView do
  # my cubing records
  def render("cubing.json", %{cubing: info}), do: info
end
