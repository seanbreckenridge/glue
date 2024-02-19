interface LinkInfo {
  name: string;
  url?: string;
  icon?: string;
  tooltip?: string;
}

const MediaElsewhere: LinkInfo[] = [
  {
    name: "Movies [Letterboxd]",
    url: "https://letterboxd.com/purplepinapples/",
    tooltip: "Just the Movies",
  },
  {
    name: "TV Shows [Trakt]",
    url: "https://trakt.tv/users/purplepinapples/ratings/all/all/highest",
    tooltip: "Movies and TV shows",
  },
  {
    name: "Music [Spreadsheet]",
    url: "https://sean.fish/s/albums",
    tooltip: "Personal Music Spreadsheet/Album tracking",
  },
  {
    name: "Video Games [Grouvee]",
    url: "https://www.grouvee.com/user/purplepinapples/shelves/106920-played/?sort_by=their_rating&dir=desc&",
    tooltip: "Don't play a lot of video games, but this tracks what I do",
  },
  {
    name: "Anime [MAL]",
    url: "https://myanimelist.net/profile/purplepinapples",
    tooltip: "Anime and Manga",
  },
  {
    name: "Anime [AniList]",
    url: "https://anilist.co/user/purplepinapples/",
    tooltip: "Used as a backup, and for my friends on Anilist",
  },
];

const MiscLinks: LinkInfo[] = [
  {
    name: "MAL Unapproved",
    url: "/mal_unapproved/",
    tooltip: "A website displaying unapproved entries on MyAnimeList",
  },
  {
    name: "AnimeShorts",
    url: "/animeshorts/",
    tooltip: "A recommendation list of my favorite anime short films",
  },
  {
    name: "DVD Logo",
    url: "/dvd/",
    tooltip: "DVD logo bouncing around in your browser!",
  },
  {
    name: "Favorite XKCDs",
    url: "/xkcd",
    tooltip: "A list of my favorite XKCDs",
  },
  {
    name: "Dotfiles Index",
    url: "/d/?dark",
    tooltip:
      "A index of every file in my dotfiles -- often use this to send a file to someone quickly",
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
    name: "Projects",
    url: "https://sean.fish/projects",
    icon: "/images/frontend/laptop.png",
  },
  {
    name: "ExoBrain",
    url: "https://sean.fish/x/",
    icon: "/images/frontend/brain.png",
  },
  {
    name: "Blog",
    url: "https://sean.fish/x/blog/",
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
    name: "Dotfiles",
    icon: "/images/frontend/dotfiles.png",
    url: "https://github.com/seanbreckenridge/dotfiles",
  },
  {
    name: "Tools",
    icon: "/images/frontend/gear.png",
    url: "https://sean.fish/x/notes/tools/",
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

export { LinkInfo, IconData, MediaElsewhere, MiscLinks };
