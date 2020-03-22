const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const createMaster = require('./createVizStatsMaster').createMaster;

const games = require('../server/db/gamesExtra.json');

// now to get counts for games collection
createMaster()
  .then(result => {
    games.forEach(game => {});
  })
  .catch(error => {
    console.log(chalk.red.bold("CAN'T GET VIZ STATS IF MASTER DATA SCRIPTS WON'T FINISH!!"));
  });
