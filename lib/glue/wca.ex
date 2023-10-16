defmodule Glue.WCA do
  use GenServer
  require Logger

  @moduledoc """
  GenServer to manage loading/caching the WCA JSON file from disk
  """

  @json_file Application.compile_env(:glue, :cubing_json)

  def start_link(data) do
    GenServer.start_link(__MODULE__, data, name: __MODULE__)
  end

  def init(_data) do
    state = maintenance(%{})

    schedule_check()
    {:ok, state}
  end

  def handle_call(:get_wca, _from, state) do
    {:reply, state[:data], state}
  end

  defp read_json_file(f) when is_nil(f) do
    Logger.warning("No Cubing JSON file!")
    %{}
  end

  defp read_json_file(path) when is_bitstring(path) do
    File.read!(path) |> Jason.decode!()
  end

  def handle_info(:check, state) do
    state = maintenance(state)
    schedule_check()
    {:noreply, state}
  end

  defp maintenance(state) do
    Logger.debug("Reading cubing JSON file...")
    Map.put(state, :data, read_json_file(@json_file))
  end

  defp schedule_check() do
    Process.send_after(self(), :check, :timer.hours(1))
  end
end
