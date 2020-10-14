defmodule Glue.GuestBookComments.CLI do

  @moduledoc """
  This module defines a CLI interface with the guestbook comments
  database contents, its how I approve/deny comments
  """

  alias Glue.Repo
  import Ecto.Query, warn: false

  alias Glue.GuestBookComments
  alias Glue.GuestBookComments.GuestBookComment

  @doc """
  Return any comments which have
  denied: false
  approved: false

  These are items I have to consider
  """
  def new_comments() do
    Repo.all(
      from c in GuestBookComment,
      where: c.approved == false and c.denied == false
    )
  end

  def print_comment(cmnt) do
    IO.puts("#{cmnt.name}\n#{cmnt.comment}")
  end

  defp approve_prompt_loop(new_comment, prompt \\ nil, error \\ false) do
    if error do
      IO.puts("Didn't recieve 'a' or 'd'")
    end
    IO.inspect(new_comment)
    print_comment(new_comment)
    resp = IO.gets(prompt || "Approve Comment? ['a' for approve, 'd' for deny] ") |> String.trim()
    cond do
      resp == "a" ->
        :approve
      resp == "d" ->
        :deny
      true ->
        approve_prompt_loop(new_comment, prompt, true)
    end
  end

  def prompt(new_comment) do
    case approve_prompt_loop(new_comment) do
      :approve ->
        GuestBookComments.update_guest_book_comment(new_comment, %{approved: true})
      :deny ->
        GuestBookComments.update_guest_book_comment(new_comment, %{denied: true})
    end
  end

  def prompt_comments([]) do
    IO.puts("Done approving comments!")
  end

  def prompt_comments([new_comment | rest_comments]) do
    prompt(new_comment)
    prompt_comments(rest_comments)
  end

  def main() do
    new_comments()
    |> prompt_comments()
  end

  def print_all() do
    Repo.all(GuestBookComment)
    |> Enum.each(fn cmnt ->
      IO.inspect(cmnt)
    end)
  end
end
