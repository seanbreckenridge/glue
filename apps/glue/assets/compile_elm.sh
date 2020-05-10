#!/bin/bash
# just build manually instead of trying
# to do fancy webpack stuff.
# This is only used for the twinkling effect
# on the home page.

cd "$(dirname "${BASH_SOURCE[0]}")"
cd elm
# debug
#elm make src/Stars.elm --output=../../priv/static/js/stars.js
# prod
elm make src/Stars.elm --optimize --output=../../priv/static/js/stars.js
