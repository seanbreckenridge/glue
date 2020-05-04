#!/usr/bin/env bash

set -e

mix deps.get --only prod
MIX_ENV=prod mix compile

npm run deploy --prefix ./assets
mix phx.digest

MIX_ENV=prox mix ecto.migrate

MIX_ENV=prox mix phx.server
