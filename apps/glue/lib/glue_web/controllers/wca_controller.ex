defmodule GlueWeb.WCAController do
  require Logger
  use GlueWeb, :controller
  alias GlueWeb.Utils

  plug :put_layout, "app.html"

  def wca(conn, _params) do
    wca_data = GenServer.call(Glue.GenCache.Worker, :get_wca_data, :timer.seconds(10))

    events =
      wca_data["events"]
      |> Enum.map(fn event_data ->
        %{
          "name" => event_data["name"],
          "single" => format_event(event_data["single"]),
          "average" => format_event(event_data["average"])
        }
      end)

    wca_data = Map.put(wca_data, "events", events)

    data =
      Utils.common_values("cubing")
      |> Utils.add_page_title()
      |> Map.put(:wca_data, wca_data)

    render(conn, "index.html", data: data)
  end

  defp format_event(event) do
    event
    |> Enum.map(fn {k, v} ->
      {k, format_item(v)}
    end)
    |> Enum.into(%{})
  end

  defp format_item(nil), do: "-"
  defp format_item(time) when is_bitstring(time), do: time
  defp format_item(rank) when is_integer(rank), do: rank |> Integer.to_string()
end
