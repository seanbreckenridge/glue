defmodule GlueWeb.GuestBookCommentControllerTest do
  use GlueWeb.ConnCase

  alias Glue.GuestBookComments
  alias Glue.GuestBookComments.GuestBookComment

  @create_attrs %{
    approved: true,
    comment: "some comment",
    name: "some name"
  }
  @update_attrs %{
    approved: false,
    comment: "some updated comment",
    name: "some updated name"
  }
  @invalid_attrs %{approved: nil, comment: nil, name: nil}

  def fixture(:guest_book_comment) do
    {:ok, guest_book_comment} = GuestBookComments.create_guest_book_comment(@create_attrs)
    guest_book_comment
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all gb_comment", %{conn: conn} do
      conn = get(conn, Routes.guest_book_comment_path(conn, :index))
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create guest_book_comment" do
    test "renders guest_book_comment when data is valid", %{conn: conn} do
      conn = post(conn, Routes.guest_book_comment_path(conn, :create), guest_book_comment: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, Routes.guest_book_comment_path(conn, :show, id))

      assert %{
               "id" => id,
               "approved" => true,
               "comment" => "some comment",
               "name" => "some name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, Routes.guest_book_comment_path(conn, :create), guest_book_comment: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update guest_book_comment" do
    setup [:create_guest_book_comment]

    test "renders guest_book_comment when data is valid", %{conn: conn, guest_book_comment: %GuestBookComment{id: id} = guest_book_comment} do
      conn = put(conn, Routes.guest_book_comment_path(conn, :update, guest_book_comment), guest_book_comment: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, Routes.guest_book_comment_path(conn, :show, id))

      assert %{
               "id" => id,
               "approved" => false,
               "comment" => "some updated comment",
               "name" => "some updated name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, guest_book_comment: guest_book_comment} do
      conn = put(conn, Routes.guest_book_comment_path(conn, :update, guest_book_comment), guest_book_comment: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete guest_book_comment" do
    setup [:create_guest_book_comment]

    test "deletes chosen guest_book_comment", %{conn: conn, guest_book_comment: guest_book_comment} do
      conn = delete(conn, Routes.guest_book_comment_path(conn, :delete, guest_book_comment))
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, Routes.guest_book_comment_path(conn, :show, guest_book_comment))
      end
    end
  end

  defp create_guest_book_comment(_) do
    guest_book_comment = fixture(:guest_book_comment)
    %{guest_book_comment: guest_book_comment}
  end
end
