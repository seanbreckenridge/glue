defmodule GlueWeb.GuestBookCommentController do
  use GlueWeb, :controller

  alias Glue.GuestBookComments
  alias Glue.GuestBookComments.GuestBookComment

  require Logger

  action_fallback GlueWeb.FallbackController

  @message_limit 250

  def index(conn, _params) do
    # List comments that are approved by me
    gb_comment = GuestBookComments.list_approved_gb_comment()
    {:ok, old_rendered_comments} = GenServer.call(Glue.OldState, :get_guestbook_comments)

    # add any new comments to the end of the comments from the database to preserve the correct order
    gb_comment = gb_comment ++ old_rendered_comments
    render(conn, "index.json", gb_comment: gb_comment)
  end

  @max_unreviewed Application.compile_env(:glue, :guestbook_max_unreviewed)

  def create(conn, %{"name" => name, "comment" => comment}) do
    # make sure there are no more than @max_unreviewed unreviewed comments
    # (to prevent spam)
    unreviewed_count = Glue.GuestBookComments.CLI.new_comments() |> length()

    cond do
      unreviewed_count >= @max_unreviewed ->
        Logger.warning("Too many unreviewed comments (#{unreviewed_count})")

        conn
        |> put_status(400)
        |> json(%{
          message:
            "There are currently too many unreviewed comments. Someone is likely spamming the guestbook, I should fix this soon."
        })

      String.length(comment) > @message_limit ->
        conn
        |> put_status(400)
        |> json(%{
          message: "'comment' is too long. Must be #{@message_limit} characters or less."
        })

      true ->
        Logger.info(
          "Creating new guestbook comment, currently #{unreviewed_count} unreviewed comments"
        )

        with {:ok, %GuestBookComment{} = guest_book_comment} <-
               GuestBookComments.create_guest_book_comment(%{
                 name: name,
                 comment: comment,
                 approved: false,
                 denied: false
               }) do
          conn
          |> put_status(:created)
          # |> put_resp_header("location", Routes.guest_book_comment_path(conn, :show, guest_book_comment))
          |> render("show.json", guest_book_comment: guest_book_comment)
        end
    end
  end
end
