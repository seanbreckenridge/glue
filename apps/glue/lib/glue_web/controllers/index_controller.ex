defmodule GlueWeb.IndexController do
  use GlueWeb, :controller

  @main_page_here [
    {"/feed", "Media Feed"},
    {"/mal_unapproved", "MAL Unapproved"},
    {"/animeshorts", "AnimeShorts"},
    {"https://exobrain.sean.fish/feed/", "Blog"},
    {"https://exobrain.sean.fish/", "ExoBrain"},
    {"/xkcd", "Favorite XKCDs"},
    {"/dvd", "DVD Logo"}
  ]

  @main_page_elsewhere [
    {"https://letterboxd.com/purplepinapples/", "Movies", "/images/letterboxd.png"},
    {"https://trakt.tv/users/purplepinapples/ratings/all/all/highest", "TV Shows",
     "/images/trakt.png"},
    {"https://docs.google.com/spreadsheets/d/12htSAMg67czl8cpkj1mX0TuAFvqL_PJLI4hv1arG5-M/edit#gid=1451660661",
     "Music List", "/images/sheets.ico"},
    {"http://gitlab.com/seanbreckenridge/", "GitLab", "/images/gitlab.png"},
    {"http://github.com/seanbreckenridge/", "GitHub", "/images/github.ico"},
    {"https://myanimelist.net/profile/purplepinapples", "Anime", "/images/mal.png"}
  ]

  alias GlueWeb.Utils

  def index(conn, _params) do
    data = Utils.common_values() |> Utils.add_page_title()
    data = Map.merge(data, %{here: @main_page_here, elsewhere: @main_page_elsewhere})
    render(conn, "index.html", data: data)
  end
end
