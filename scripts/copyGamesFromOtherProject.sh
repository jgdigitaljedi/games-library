#!/bin/bash

# only run this from my main laptop and gaming PC since they run Windows 10 (barf) with WSL

cp /mnt/c/code/homeControl/server/db/games.json server/db/games.json
cp /mnt/c/code/homeControl/server/db/consoles.json server/db/consoles.json
cp /mnt/c/code/homeControl/server/db/consoles.json server/db/clones.json
cp /mnt/c/code/homeControl/server/db/consoles.json server/db/gameAcc.json
cp /mnt/c/code/homeControl/server/db/consoles.json server/db/collectibles.json
cp /mnt/c/code/homeControl/server/db/consoles.json server/db/hardware.json

npm run process