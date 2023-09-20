import Config

config :glue,
  cubing_json: System.get_env("CUBING_JSON"),
  page_hits_offset: (System.get_env("PAGE_HITS_OFFSET") || "0") |> String.to_integer(),
  guestbook_json_path: System.get_env("GUESTBOOK_JSON_PATH"),
  guestbook_max_unreviewed:
    (System.get_env("GUESTBOOK_MAX_UNREVIEWED") || "100") |> String.to_integer()
