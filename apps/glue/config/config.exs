use Mix.Config

config :glue, GenCache,
  albums: [db_id: 1, port: 8083, refresh_ms: :timer.hours(4)],
  wca: [db_id: 2, port: 8010, refresh_ms: :timer.hours(24 * 7)],
  mal: [db_id: 3, port: 8000, refresh_ms: :timer.hours(4)],
  trakt: [db_id: 4, refresh_ms: :timer.hours(1)],
