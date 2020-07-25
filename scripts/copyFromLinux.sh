#!/bin/bash

# only run this from my work laptop and Mac Mini

cp ~/code/homeControl/server/db/games.json server/db/games.json
cp ~/code/homeControl/server/db/consoles.json server/db/consoles.json

npm run process