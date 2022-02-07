defmodule GlueWeb.GuestBookCommentView do
  use GlueWeb, :view
  alias GlueWeb.GuestBookCommentView

  @epoch ~N[1970-01-01 00:00:00]

  def render("index.json", %{gb_comment: gb_comment}) do
    render_many(gb_comment, GuestBookCommentView, "guest_book_comment.json")
  end

  def render("error.json", %{message: err_msg}) do
    Jason.encode!(%{error: err_msg})
  end

  def render("guest_book_comment.json", %{guest_book_comment: guest_book_comment}) do
    %{
      id: guest_book_comment.id,
      name: guest_book_comment.name,
      comment: guest_book_comment.comment,
      at: NaiveDateTime.diff(guest_book_comment.inserted_at, @epoch)
    }
  end

  def render("show.json", %{guest_book_comment: guest_book_comment}) do
    render_one(guest_book_comment, GuestBookCommentView, "guest_book_comment.json")
  end
end
