#!/bin/bash

npm i

echo "Building production version"
cp ./src/index.js{x,}
npm run build

echo "Spawning server w/ prod build"
./node_modules/.bin/pushstate-server build &
SERVER_PID=$!
echo "Spawned server (PID: ${SERVER_PID})"
