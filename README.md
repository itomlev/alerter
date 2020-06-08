# alerter
Application server that accepts messages with a timestamp and prints messages at their given time in the future

## API
### POST /echoAtTime
Receives two parameters, time and message and persist them
 
### GET /messages
Get all persisted messages
 
### GET /messages/:time
Get all persisted messages up the current timestamp

## Developer notes
1. In order to run: `$ npm run start`
2. In order to run in dev mode: `$ npm run dev`
3. In order to test: `$ npm test`
