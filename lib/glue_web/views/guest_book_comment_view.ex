defmodule GlueWeb.GuestBookCommentView do
  use GlueWeb, :view
  alias GlueWeb.GuestBookCommentView

  @epoch ~N[1970-01-01 00:00:00]

  def render("index.json", %{gb_comment: gb_comments}) do
    render_many(gb_comments, GuestBookCommentView, "guest_book_comment.json")
  end

  def render("error.json", %{message: err_msg}) do
    Jason.encode!(%{error: err_msg})
  end

  def render("guest_book_comment.json", %{guest_book_comment: guest_book_comment}) do
    # the ids for the old guestbook are prefixed with old_, so they're a string
    # if its an integer, its from the new guestbook and was just read from the database
    if is_integer(guest_book_comment.id) do
      %{
        id: guest_book_comment.id |> Integer.to_string(),
        name: guest_book_comment.name,
        comment: guest_book_comment.comment,
        at: NaiveDateTime.diff(guest_book_comment.inserted_at, @epoch)
      }
    else
      # This is a comment from the old guestbook, they're not in the database
      # but are already rendered as JSON properly
      %{
        id: guest_book_comment.id,
        name: guest_book_comment.name,
        comment: guest_book_comment.comment,
        at: guest_book_comment.at
      }
    end
  end

  def render("show.json", %{guest_book_comment: guest_book_comment}) do
    render_one(guest_book_comment, GuestBookCommentView, "guest_book_comment.json")
  end
end
