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
    url: "https://sean.fish/s/albums",
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

const MiscApps: LinkInfo[] = [
  {
    name: "MAL Unapproved",
    url: "/mal_unapproved/",
  },
  {
    name: "AnimeShorts",
    url: "/animeshorts/",
  },
  {
    name: "DVD Logo",
    url: "/dvd/",
  },
  {
    name: "Favorite XKCDs",
    url: "/xkcd",
  },
];

const IconData: LinkInfo[] = [
  {
    name: "Media Feed",
    icon: "/images/frontend/camerafeed.png",
  },
  {
    name: "ExoBrain",
    url: "https://exobrain.sean.fish",
    icon: "/images/frontend/brain.png",
  },
  {
    name: "Cubing",
    icon: "/images/frontend/rubikscube.png",
  },
  {
    name: "Blog",
    url: "https://exobrain.sean.fish/feed/",
    icon: "/images/frontend/feather.png",
  },
  {
    name: "Media Accts",
    icon: "/images/frontend/musicnote.png",
  },
  {
    name: "Misc",
    icon: "/images/frontend/misc.png",
  },
];

export { LinkInfo, IconData, MediaElsewhere, MiscApps };
