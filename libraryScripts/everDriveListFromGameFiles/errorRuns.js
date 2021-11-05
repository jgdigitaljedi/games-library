const { setUserData, fetchIgdbData } = require('./util/queryIgdb');
const { returnWithConsoleName } = require('./util/completeFileObj');
const { writeOut } = require('./util/writeOutResults');

// change for console, error run number, location, handheld, writeOut file name
const writeOutName = 'EverDrive64';
const errorFileName = 'errorsEverDrive64.json';
const romConsoleId = 4; // console of the ROM in case of emulators; if not, same as edConsole id
const edId = 220000; // try to use a different starting point for each everdrive
const errorRun = 1; // what number errorRun is it; make sure to change
const notes = 'playable via EverDrive 64';
const edConsole = { consoleName: 'Nintendo 64', consoleId: 4 }; // console everdirve is for
const location = 'upstairs';
const handheld = false;
const errorRunAttr = 'gameNoParens'; // attribute containing name in error file
const errorFile = require(`./errors/${errorFileName}`);

(async () => {
  const consoleData = returnWithConsoleName(romConsoleId);
  const userData = setUserData(
    edId,
    notes,
    consoleData.consoleName,
    consoleData.consoleId,
    location,
    handheld,
    edConsole
  );
  const games = errorFile.map(game => game[errorRunAttr]);
  const results = await fetchIgdbData(games, userData, errorRun);
  await writeOut(results, writeOutName, errorRun);
})();
