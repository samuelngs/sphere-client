#!/bin/sh

if ! which node > /dev/null; then
    echo "nodejs is not installed"
    exit 1
fi

if ! which npm > /dev/null; then
    echo "npm is not installed"
    exit 1
fi

if ! which uglifyjs > /dev/null; then
    echo "uglify is not install, please install it with command 'npm install -g uglify'"
    exit 1
fi

cat ./main.js \
    ./vendor/eventemitter.js \
    ./core/base.js \
    ./modules/websocket.js \
    ./modules/packet.js \
    ./modules/message.js \
    ./modules/channel.js > sphere.js

uglifyjs ./sphere.js \
         -o sphere.min.js \
         --source-map sphere.min.js.map \
         -p 5 -c -m

