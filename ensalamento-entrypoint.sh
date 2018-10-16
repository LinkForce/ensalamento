#!/usr/bin/env bash
set -e


if [ "$1" = 'DEVELOPMENT' ]; then
    /usr/local/bin/node /app/bin/automigrate.js
    # echo "oi"
fi

if [ "$1" = 'PRODUCTION' ]; then
    /usr/local/bin/node /app/bin/automigrate.js
fi

# echo "while true; do sleep 2; done" >> /app/test.sh && chmod +x /app/test.sh
# /bin/bash /app/test.sh
/usr/local/bin/yarn start
exec "$@"
# exec "$@:2"
# exec "${@:2}"
