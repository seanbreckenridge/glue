defmodule Glue.GuestBookCommentsTest do
  use Glue.DataCase

  alias Glue.GuestBookComments

  describe "gb_comment" do
    alias Glue.GuestBookComments.GuestBookComment

    @valid_attrs %{approved: true, comment: "some comment", name: "some name"}
    @update_attrs %{approved: false, comment: "some updated comment", name: "some updated name"}
    @invalid_attrs %{approved: nil, comment: nil, name: nil}

    def guest_book_comment_fixture(attrs \\ %{}) do
      {:ok, guest_book_comment} =
        attrs
        |> Enum.into(@valid_attrs)
        |> GuestBookComments.create_guest_book_comment()

      guest_book_comment
    end

    test "list_gb_comment/0 returns all gb_comment" do
      guest_book_comment = guest_book_comment_fixture()
      assert GuestBookComments.list_gb_comment() == [guest_book_comment]
    end

    test "get_guest_book_comment!/1 returns the guest_book_comment with given id" do
      guest_book_comment = guest_book_comment_fixture()

      assert GuestBookComments.get_guest_book_comment!(guest_book_comment.id) ==
               guest_book_comment
    end

    test "create_guest_book_comment/1 with valid data creates a guest_book_comment" do
      assert {:ok, %GuestBookComment{} = guest_book_comment} =
               GuestBookComments.create_guest_book_comment(@valid_attrs)

      assert guest_book_comment.approved == true
      assert guest_book_comment.comment == "some comment"
      assert guest_book_comment.name == "some name"
    end

    test "create_guest_book_comment/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} =
               GuestBookComments.create_guest_book_comment(@invalid_attrs)
    end

    test "update_guest_book_comment/2 with valid data updates the guest_book_comment" do
      guest_book_comment = guest_book_comment_fixture()

      assert {:ok, %GuestBookComment{} = guest_book_comment} =
               GuestBookComments.update_guest_book_comment(guest_book_comment, @update_attrs)

      assert guest_book_comment.approved == false
      assert guest_book_comment.comment == "some updated comment"
      assert guest_book_comment.name == "some updated name"
    end

    test "update_guest_book_comment/2 with invalid data returns error changeset" do
      guest_book_comment = guest_book_comment_fixture()

      assert {:error, %Ecto.Changeset{}} =
               GuestBookComments.update_guest_book_comment(guest_book_comment, @invalid_attrs)

      assert guest_book_comment ==
               GuestBookComments.get_guest_book_comment!(guest_book_comment.id)
    end

    test "delete_guest_book_comment/1 deletes the guest_book_comment" do
      guest_book_comment = guest_book_comment_fixture()

      assert {:ok, %GuestBookComment{}} =
               GuestBookComments.delete_guest_book_comment(guest_book_comment)

      assert_raise Ecto.NoResultsError, fn ->
        GuestBookComments.get_guest_book_comment!(guest_book_comment.id)
      end
    end

    test "change_guest_book_comment/1 returns a guest_book_comment changeset" do
      guest_book_comment = guest_book_comment_fixture()
      assert %Ecto.Changeset{} = GuestBookComments.change_guest_book_comment(guest_book_comment)
    end
  end
end
