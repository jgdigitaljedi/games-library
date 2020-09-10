#!/bin/bash

# only run this from my work laptop and Mac Mini

cp ~/code/homeControl/server/db/games.json server/db/games.json
cp ~/code/homeControl/server/db/consoles.json server/db/consoles.json
cp ~/code/homeControl/server/db/clones.json server/db/clones.json
cp ~/code/homeControl/server/db/gameAcc.json server/db/gameAcc.json
cp ~/code/homeControl/server/db/collectibles.json server/db/collectibles.json
cp ~/code/homeControl/server/db/hardware.json server/db/hardware.json

npm run process