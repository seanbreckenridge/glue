defmodule GlueWeb.DataController do
  @moduledoc """
  This is a public, generic JSON interface
  to a lot of the data on my website. It's used
  by the frontend to get data.
  """
  use GlueWeb, :controller
  alias GlueWeb.Cubing

  def cubing(conn, _params) do
    render(conn, "cubing.json", Cubing.get())
  end
end

defmodule GlueWeb.Cubing do
  def get() do
    wca_data = GenServer.call(Glue.WCA, :get_wca, :timer.seconds(10))

    events =
      wca_data["events"]
      |> Enum.map(fn event_data ->
        %{
          "name" => event_data["name"],
          "single" => format_event(event_data["single"]),
          "average" => format_event(event_data["average"])
        }
      end)

    %{cubing: Map.put(wca_data, "events", events)}
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
