defmodule GlueWeb.ReactController do
  use GlueWeb, :controller

  require Logger

  @moduledoc """
  This defines the single entrypoint to the react part of this site.
  react_layout.html has the compiled js bundle as part of the <head>

  If the user is using curl (or maybe in the future, something else as well?)
  instead of a browser, we can render something using ANSI instead
  """

  plug :put_layout, "react_layout.html"

  # returns a string
  @spec ansi() :: String.t()
  def ansi() do
    figlet =
      "                        _____ _     _     \n ___  ___  __ _ _ __   |  ___(_)___| |__  \n/ __|/ _ \\/ _` | '_ \\  | |_  | / __| '_ \\ \n\\__ \\  __/ (_| | | | |_|  _| | \\__ \\ | | |\n|___/\\___|\\__,_|_| |_(_)_|   |_|___/_| |_|"

    welcome =
      "Typically this works as a react app (I would recommend using a browser)

But here are some links to other parts of the site:

Github:\t\t\thttps://github.com/seanbreckenridge/
Notes:\t\t\thttps://sean.fish/x/
Projects:\t\thttps://sean.fish/projects/
Favorite XKCDs:\t\thttps://sean.fish/xkcd/
A DVD Logo:\t\thttps://sean.fish/dvd/
Anime Short Films:\thttps://sean.fish/animeshorts/\n"

    IO.ANSI.blue() <> IO.ANSI.italic() <> figlet <> IO.ANSI.reset() <> "\n\n" <> welcome
  end

  @spec is_curl(Plug.Conn.t()) :: boolean()
  defp is_curl(conn) do
    conn.req_headers
    |> Enum.filter(fn {k, _} -> String.downcase(k) == "user-agent" end)
    |> Enum.filter(fn {_, v} -> String.downcase(v) |> String.starts_with?("curl") end)
    |> length() > 0
  end

  def catchall(conn, _params) do
    is_curl = is_curl(conn)
    Logger.info("is a curl request: #{is_curl}")

    if is_curl do
      text(conn, ansi())
    else
      render(conn, "index.html")
    end
  end
end
