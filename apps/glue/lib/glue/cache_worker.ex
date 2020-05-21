defmodule Glue.GenCache.Worker do
  use GenServer

  def start_link(data) do
    GenServer.start_link(__MODULE__, data, name: __MODULE__)
  end

  def init(_data) do
    state =
      maintenance(%{
        credentials: %{
          albums: Application.get_env(:glue, :albums),
          wca: Application.get_env(:glue, :wca),
          mal: Application.get_env(:glue, :mal),
          trakt: Application.get_env(:glue, :trakt)
        }
      })

    schedule_check()
    {:ok, state}
  end

  def handle_info(:check, state) do
    # check if the file has been changed
    state = maintenance(state)
    schedule_check()
    {:noreply, state}
  end

  # makes sure that the cache for each feed type is up to date
  defp maintenance(state) do
    IO.puts("Checking State...")
    state
  end

  # calls :check once every 5 minutes
  defp schedule_check() do
    Process.send_after(self(), :check, 60 * 1000)
  end
end
