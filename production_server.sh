#!/usr/bin/env bash

set -e

export MIX_ENV=prod

mix deps.get --only prod
mix compile

npm run deploy --prefix ./assets
mix phx.digest

mix ecto.migrate

mix phx.server
