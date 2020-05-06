#!/usr/bin/env bash

FILEPATH=${1:?"Error: Pass JSON config file as first argument"}
if [ ! -e "$1" ]; then
  printf "No such file: %s\n" "$1" 2>&1
  exit 1
fi

export GLUE_DATABASE_URI=$(jq -r '.postgres_uri' "$1")
export GLUE_SECRET_KEY_BASE=$(jq -r '.glue_secret' "$1")

export MIX_ENV=prod

mix deps.get --only prod
mix compile

npm run deploy --prefix ./apps/glue/assets
mix phx.digest

mix ecto.migrate

exec mix phx.server
