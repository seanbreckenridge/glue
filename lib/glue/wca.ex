defmodule Glue.WCA do
  use GenServer
  require Logger

  @moduledoc """
  GenServer to manage loading/caching the WCA JSON file from disk
  """

  @json_file Application.get_env(:glue, :cubing_json)

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

  defp read_json_file(path \\ @json_file) do
    File.read!(path) |> Jason.decode!()
  end

  def handle_info(:check, state) do
    state = maintenance(state)
    schedule_check()
    {:noreply, state}
  end

  # makes sure that the cache for each feed type is up to date
  defp maintenance(state) do
    Logger.debug("Checking State...")
    Map.put(state, :data, read_json_file())
  end

  defp schedule_check() do
    Process.send_after(self(), :check, :timer.hours(1))
  end
end
