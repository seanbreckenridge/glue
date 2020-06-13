defmodule GlueWeb.IndexController do
  use GlueWeb, :controller

  @main_page_here [
    {"/feed", "Media Feed"},
    {"/mal_unapproved", "MAL Unapproved"},
    {"/animeshorts", "AnimeShorts"},
    {"https://seans-exobrain.netlify.app/feed/", "Blog"},
    {"https://seans-exobrain.netlify.app/", "ExoBrain"},
    {"/xkcd", "Favorite XKCDs"},
    {"/dvd", "DVD Logo"},
    {"/d/?dark", "Dotfiles"}
  ]

  @main_page_elsewhere [
    {"http://gitlab.com/seanbreckenridge/", "Code", "/images/gitlab.png"},
    {"https://letterboxd.com/purplepinapples/", "Movies", "/images/letterboxd.png"},
    {"https://trakt.tv/users/purplepinapples/ratings/all/all/highest", "TV Shows",
     "/images/trakt.png"},
    {"https://docs.google.com/spreadsheets/d/12htSAMg67czl8cpkj1mX0TuAFvqL_PJLI4hv1arG5-M/edit#gid=1451660661",
     "Music List", "/images/sheets.ico"},
    {"https://myanimelist.net/profile/purplepinapples", "Anime", "/images/mal.png"}
  ]

  alias GlueWeb.Utils

  def index(conn, _params) do
    data = Utils.common_values() |> Utils.add_page_title()
    data = Map.merge(data, %{here: @main_page_here, elsewhere: @main_page_elsewhere})
    render(conn, "index.html", data: data)
  end
end
