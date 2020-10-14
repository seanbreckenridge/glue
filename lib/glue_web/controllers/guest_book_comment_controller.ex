defmodule GlueWeb.GuestBookCommentController do
  use GlueWeb, :controller

  alias Glue.GuestBookComments
  alias Glue.GuestBookComments.GuestBookComment

  action_fallback GlueWeb.FallbackController

  @message_limit 250

  def index(conn, _params) do
    # gb_comment = GuestBookComments.list_gb_comment()
    # List comments that are approved by me
    gb_comment = GuestBookComments.list_approved_gb_comment()
    render(conn, "index.json", gb_comment: gb_comment)
  end

  def create(conn, %{"name" => name, "comment" => comment}) do
    if String.length(comment) > @message_limit do
      conn
      |> put_status(400)
      |> render("error.json", %{message: "'comment' is too long. Must be #{@message_limit} characters or less."})
    else
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

  def create(conn, %{"guest_book_comment" => guest_book_comment_params}) do
    with {:ok, %GuestBookComment{} = guest_book_comment} <-
           GuestBookComments.create_guest_book_comment(guest_book_comment_params) do
      conn
      |> put_status(:created)
      # |> put_resp_header("location", Routes.guest_book_comment_path(conn, :show, guest_book_comment))
      |> render("show.json", guest_book_comment: guest_book_comment)
    end
  end

  def show(conn, %{"id" => id}) do
    guest_book_comment = GuestBookComments.get_guest_book_comment!(id)
    render(conn, "show.json", guest_book_comment: guest_book_comment)
  end

  def update(conn, %{"id" => id, "guest_book_comment" => guest_book_comment_params}) do
    guest_book_comment = GuestBookComments.get_guest_book_comment!(id)

    with {:ok, %GuestBookComment{} = guest_book_comment} <-
           GuestBookComments.update_guest_book_comment(
             guest_book_comment,
             guest_book_comment_params
           ) do
      render(conn, "show.json", guest_book_comment: guest_book_comment)
    end
  end

  def delete(conn, %{"id" => id}) do
    guest_book_comment = GuestBookComments.get_guest_book_comment!(id)

    with {:ok, %GuestBookComment{}} <-
           GuestBookComments.delete_guest_book_comment(guest_book_comment) do
      send_resp(conn, :no_content, "")
    end
  end
end
