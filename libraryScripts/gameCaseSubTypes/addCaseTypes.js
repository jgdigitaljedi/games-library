const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const games = require('../../server/db/games.json');
const consoleIdList = require('../buildConsleIdList/consoleIds.json');

const defaultCaseTypes = {
  // I'll default to these and go back and change the few that don't match later
  50: { custom: 'dvd', original: 'cd' },
  59: { custom: 'ugc', original: 'ugc' },
  66: { custom: 'ugc', original: 'ugc' },
  60: { custom: 'ugc', original: 'ugc' },
  62: { custom: 'ugc', original: 'ugc' },
  23: { custom: 'dvd', original: 'cd' },
  33: { custom: 'ds', original: 'ds' },
  24: { custom: 'ds', original: 'ds' },
  22: { custom: 'ds', original: 'ds' },
  67: { custom: 'ugc', original: 'ugc' },
  37: { custom: 'ds', original: 'ds' },
  4: { custom: 'ugc', original: 'ugc' },
  20: { custom: 'ds', original: 'ds' },
  18: { custom: 'ugc', original: 'ugc' },
  21: { custom: 'dvd', original: 'dvd' },
  130: { custom: 'shell', original: 'switch' },
  6: { custom: 'none', original: 'none' },
  7: { custom: 'cd', original: 'cd' },
  8: { custom: 'dvd', original: 'dvd' },
  9: { custom: 'dvd', original: 'bluray' },
  48: { custom: 'dvd', original: 'bluray' },
  38: { custom: 'psp', original: 'psp' },
  30: { custom: 'ugc', original: 'sega' },
  78: { custom: 'dvd', original: 'longbox' },
  35: { custom: 'ds', original: 'ds' },
  64: { custom: 'ugc', original: 'sega' },
  29: { custom: 'ugc', original: 'sega' },
  32: { custom: 'dvd', original: 'longbox' },
  19: { custom: 'bitbox', original: 'bitbox' },
  86: { custom: 'dvd', original: 'cd' },
  5: { custom: 'dvd', original: 'dvd' },
  41: { custom: 'dvd', original: 'dvd' },
  11: { custom: 'dvd', original: 'dvd' },
  12: { custom: 'dvd', original: 'dvd' },
  49: { custom: 'dvd', original: 'xbone' }
};

function fixConsoleId(game) {
  const consoleId = consoleIdList.find(c => c.name === game.consoleName).id;
  return consoleId;
}

function addCaseType(game) {
  if (game.case !== 'none') {
    try {
      return defaultCaseTypes[game.consoleId][game.case];
    } catch (e) {
      console.log(chalk.yellow('ERROR WITH CONSOLE ID AGAIN'));
      console.log('game', game);
      throw new Error('Your mom');
    }
  }
  return 'none';
}

(function () {
  const gamesWithFixedConsoleIds = games.map(game => {
    if (typeof game.consoleId !== 'number' || game.consoleId > 1000) {
      console.log(chalk.cyan('game name', game.name));
      const consoleId = fixConsoleId(game);
      return { ...game, consoleId };
    }
    return game;
  });

  const gamesWithCaseType = gamesWithFixedConsoleIds.map(game => {
    const caseType = addCaseType(game);
    return { ...game, caseType };
  });

  fs.writeFile(
    path.join(__dirname, './gamesWithCaseType.json'),
    JSON.stringify(gamesWithCaseType),
    error => {
      if (error) {
        console.log(chalk.red.bold('ERROR WRITING GAMES!'));
        console.log(chalk.red.bold(error));
      } else {
        console.log(chalk.green.bold('SUCCESSFULLY WROTE GAMES!'));
      }
    }
  );
})();
