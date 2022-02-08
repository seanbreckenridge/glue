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
    url: "https://docs.google.com/spreadsheets/d/12htSAMg67czl8cpkj1mX0TuAFvqL_PJLI4hv1arG5-M/edit?usp=sharing",
  },
  {
    name: "Video Games [Grouvee]",
    url: "https://www.grouvee.com/user/purplepinapples/shelves/106920-played/?sort_by=their_rating&dir=desc&",
  },
  {
    name: "Anime [MAL]",
    url: "https://myanimelist.net/profile/purplepinapples",
  },
  {
    name: "Anime [AniList]",
    url: "https://anilist.co/user/purplepinapples/",
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
    name: "README",
    icon: "/images/frontend/notepad.png",
  },
  {
    name: "Guest Book",
    icon: "/images/frontend/guestbook.png",
  },
  {
    name: "Media Feed",
    icon: "/images/frontend/camerafeed.png",
    url: "https://sean.fish/feed/",
  },
  {
    name: "Data",
    icon: "/images/frontend/barchart.png",
  },
  {
    name: "Portfolio",
    url: "https://sean.fish/projects",
    icon: "/images/frontend/laptop.png",
  },
  {
    name: "ExoBrain",
    url: "https://exobrain.sean.fish",
    icon: "/images/frontend/brain.png",
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
  {
    name: "Cubing",
    icon: "/images/frontend/rubikscube.png",
  },
  {
    name: "Browser",
    icon: "/images/frontend/globe.png",
  },
  {
    name: "TextEdit",
    icon: "/images/frontend/texteditor.png",
  },
  {
    name: "Paint",
    icon: "/images/frontend/paint.png",
  },
  {
    name: "Customize",
    icon: "/images/frontend/hammer_wrench.png",
  },
  {
    name: "Not_a_Virus",
    icon: "/images/frontend/heart.png",
  },
];

export { LinkInfo, IconData, MediaElsewhere, MiscApps };
