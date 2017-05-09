# Hackerrank-like test app using react and graphql

## Components
This app is divided in 2 w/ a client and a server app

## Quick start
Both apps can be run using `npm start`

## About the client app
The client app is mostly a re-hash of Apollo's react/graphql sample UI, with some tweaks to get 2 pages (1 for submitting a link, the other to see all available links) for example.
This app can also be optimized for run (and ran as such) through the `./scripts/run.sh` script


### Testing mechanics & pre-requisites
You need ruby to run these tests, it can usually be installed pretty easily through `rvm` (pretty much works like `nvm`, just for ruby : https://rvm.io/). 
Tests can be run via que `scripts/test.sh` script. The test runner ensures the client app is running (and starts it if necessary). It also reloads the server app if it is being run using pm2 and reinstalls npm modules / ruby gems

## About the server app
Most of the configuration should hopefuly be pretty straightforward. All boilerplate configuration (server port, cors whitelist ...) can be found in `config/base`
This app can be run through PM2 if you so desire (see `./server/server.pm2.json`)

### Pre-requisites 
The server needs to be connected to a mongodb database. The basic connection settings can be found in `config/base`

## Specific requirements

### Run
* NodeJS 6
* MongoDB (server)

### Testing
* Ruby (for capybara)

## About the `client/scripts` scripts

At this point, they need to be run from the client's root dir (i.e: `./client`).