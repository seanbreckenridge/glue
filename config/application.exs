use Mix.Config

trakt_api_key = System.get_env("TRAKT_API_KEY")
tmdb_api_key = System.get_env("TMDB_API_KEY")

# service key specifies the module name to get cached information for the Feed,
# at Glue.Feed.External.ServiceKey
# e.g. Glue.Feed.External.Albums for "albums"
config :glue,
  albums: [db_id: 1, service_key: "albums", port: 8083, refresh_ms: :timer.hours(3)],
  wca: [db_id: 2, service_key: "wca", port: 8010, refresh_ms: :timer.hours(24 * 7)],
  mal: [db_id: 3, service_key: "mal", refresh_ms: :timer.hours(6)],
  trakt: [db_id: 4, service_key: "trakt", refresh_ms: :timer.hours(1)],
  trakt_api_key: trakt_api_key,
  tmdb_api_key: tmdb_api_key

config :jikan_ex,
  base_url: "http://localhost:8000/v3/"
