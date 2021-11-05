const path = require('path');
const { readIn } = require('./util/readInFiles');
const { setUserData, fetchIgdbData } = require('./util/queryIgdb');
const { writeOut } = require('./util/writeOutResults');
const edConsole = { consoleName: 'Nintendo 64', consoleId: 4 };

// read paths
const filesPath = '/media/digitaljedi/3232-3163';
const mainPath = path.join(filesPath, 'ROMS');

(async () => {
  // read in files from directories
  const games = await readIn(mainPath);
  const errorRun = null;
  const notes = 'playable via EverDrive 64';

  // games: lookup IGDB data, extra data, format, and write
  const edId = 210000;
  const userData = setUserData(
    edId,
    notes,
    edConsole.consoleName,
    edConsole.consoleId,
    'upstairs',
    false,
    edConsole
  );
  const results = await fetchIgdbData(games, userData);
  await writeOut(results, 'EverDrive64', errorRun);
})();
