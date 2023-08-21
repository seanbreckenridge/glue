defmodule Glue.OldGuestBookComment do
  @moduledoc """
  This is a struct that represents a guestbook comment
  from the old site. It is used to convert the old
  guestbook comments to the new format.
  """
  defstruct [:name, :id, :at, :comment]
end

defmodule Glue.OldState do
  @moduledoc """
  This keeps the state of the old pagehits (integer)
  and guestbooks (list of JSON) in memory.

  This was made to make it easier to migrate from
  postgres to sqlite. Has the side effects of being
  faster and meaning I can modify page hits offset if
  someone was just spamming the endpoint
  """
  use GenServer
  require Logger

  def start_link(_) do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(:ok) do
    page_hits_offset = Application.get_env(:glue, :page_hits_offset)
    guestbook_json_path = Application.get_env(:glue, :guestbook_json_path)
    {:ok, guestbook_json} = parse_guestbook_file(guestbook_json_path)
    Logger.info("Loaded #{length(guestbook_json)} guestbook comments from #{guestbook_json_path}")
    {:ok, %{page_hits: page_hits_offset, guestbooks: guestbook_json}}
  end

  defp parse_guestbook_file(json_file) when is_binary(json_file) do
    case File.read(json_file) do
      {:ok, json_text} ->
        parse_guestbook_json(json_text)

      {:error, _} ->
        Logger.error("Error reading guestbook json file: #{json_file}")
        {:ok, []}
    end
  end

  defp parse_guestbook_file(_) do
    Logger.error("Guestbook json file path is not a filename")
    {:ok, []}
  end

  defp parse_guestbook_json(json_data) do
    case Jason.decode(json_data) do
      {:ok, json} ->
        {:ok,
         json
         |> Enum.map(fn jsc ->
           %{"name" => name, "id" => id, "at" => at, "comment" => comment} = jsc
           %Glue.OldGuestBookComment{name: name, id: "old_#{id}", at: at, comment: comment}
         end)
         |> Enum.sort_by(fn %{at: at} -> at end)
         |> Enum.reverse()}

      {:error, error} ->
        {:error, "Error parsing guestbook json: #{error}"}
    end
  end

  def handle_call(:get_page_hits, _from, state) do
    {:reply, {:ok, state.page_hits}, state}
  end

  def handle_call(:get_guestbook_comments, _from, state) do
    {:reply, {:ok, state.guestbooks}, state}
  end
end
