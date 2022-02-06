import Config

config :glue,
  cubing_json: System.get_env("CUBING_JSON") || raise("CUBING_JSON is missing")
