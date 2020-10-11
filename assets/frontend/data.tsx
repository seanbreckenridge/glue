interface LinkInfo {
  name: string;
  url?: string;
  icon?: string;
}

const MediaElsewhere: LinkInfo[] = [
  {
    name: "Movies [Letterboxd]",
    url: "https://letterboxd.com/purplepinapples/",
  },
  {
    name: "TV Shows [Trakt]",
    url: "https://trakt.tv/users/purplepinapples/ratings/all/all/highest",
  },
  {
    name: "Music [Spreadsheet]",
    url:
      "https://www.grouvee.com/user/purplepinapples/shelves/106920-played/?sort_by=their_rating&dir=desc&",
  },
  {
    name: "Video Games [Grouvee]",
    url:
      "https://www.grouvee.com/user/purplepinapples/shelves/106920-played/?sort_by=their_rating&dir=desc&",
  },
  {
    name: "Anime [MAL]",
    url: "https://myanimelist.net/profile/purplepinapples",
  },
];

const IconData: LinkInfo[] = [
  {
    name: "ExoBrain",
    url: "https://exobrain.sean.fish",
  },
  {
    name: "Media Feed",
  },
  {
    name: "Cubing",
  },
  {
    name: "Blog",
    url: "https://exobrain.sean.fish/feed/",
  },
  {
    name: "Media Accounts",
  },
];

export { LinkInfo, IconData, MediaElsewhere };
