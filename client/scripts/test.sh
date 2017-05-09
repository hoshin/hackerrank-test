#!/bin/bash

npm i
bundle install

echo "Building production version"
cp ./src/index.js{x,}
npm run build

echo "Spawning server w/ prod build"
./node_modules/.bin/pushstate-server build &
SERVER_PID=$!
echo "Spawned server (PID: ${SERVER_PID})"

echo "Restarting server app"
pm2 restart test-server

sleep 2
echo "Running tests"
rspec ./test/clientSpec.rb
sleep 2
echo "Tests ran, terminating server"
kill ${SERVER_PID}