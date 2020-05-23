#!/usr/bin/env bash

FILEPATH=${1:?"Error: Pass JSON config file as first argument"}
if [ ! -e "$1" ]; then
	printf "No such file: %s\n" "$1" 1>&2
	exit 1
fi
export GLUE_DATABASE_URI=$(jq -r '.postgres_uri' "$1")
export GLUE_SECRET_KEY_BASE=$(jq -r '.glue_secret' "$1")
export TRAKT_API_KEY=$(jq -r '.trakt_api_key' "$1")
export TMDB_API_KEY=$(jq -r '.tmdb_api_key' "$1")

export MIX_ENV=prod

if [ "$2" = "-i" ]; then
	bash
fi

mix deps.get --only prod
mix compile

npm install --prefix ./apps/glue/assets
npm run deploy --prefix ./apps/glue/assets
mix phx.digest

mix ecto.migrate

exec mix phx.server
