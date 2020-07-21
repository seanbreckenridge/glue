# [Glue](https://sean.fish)

Glue all the webapps together!

Acts a landing page/connects all of my projects.

Renders the [home page](https://sean.fish/), some other random pages (e.g. my [cubing](https://sean.fish/cubing) page), and the my [media feed](https://sean.fish/feed) page.

The `media feed` gets recently updated entries from `Trakt`, `MyAnimeList`, and my [`albums`](https://sean.fish/s/albums) spreadsheet. Code to update the in-memory cache for the feed is in [gencache](https://github.com/seanbreckenridge/glue/tree/master/apps/glue/lib/glue) module, which Runs a separate genserver loop in the background, to request out to APIs described by [`config.exs`](https://github.com/seanbreckenridge/glue/blob/master/config/config.exs).

