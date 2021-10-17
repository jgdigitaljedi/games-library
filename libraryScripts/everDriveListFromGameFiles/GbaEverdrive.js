const path = require('path');
const { returnWithConsoleName } = require('./util/completeFileObj');
const { readIn } = require('./util/readInFiles');
const { setUserData, fetchIgdbData } = require('./util/queryIgdb');
const { writeOut } = require('./util/writeOutResults');
const edConsole = { consoleName: 'Game Boy Advance', consoleId: 24 };

// read paths
const filesPath = '/media/digitaljedi/ED';
const gbaPath = path.join(filesPath, 'ROMS');
const gbcPath = path.join(filesPath, 'GBC');
const gbPath = path.join(filesPath, 'GB');
const ggPath = path.join(filesPath, 'GG');
const nesPath = path.join(filesPath, 'NES');
const smsPath = path.join(filesPath, 'SMS');

// sub directories
const gbaSubs = ['The best', 'Japan'];

// error paths

(async () => {
  // read in files from directories
  const gbaGames = await readIn(gbaPath, gbaSubs);
  const gbcGames = await readIn(gbcPath);
  const gbGames = await readIn(gbPath);
  const ggGames = await readIn(ggPath);
  const nesGames = await readIn(nesPath);
  const smsGames = await readIn(smsPath);
  const errorRun = null;
  const notes = 'playable via GBA EverDrive';

  // GBA games: lookup IGDB data, extra data, format, and write
  const gbaConsole = returnWithConsoleName(24);
  const gbaEdId = 130000;
  const gbaUserData = setUserData(
    gbaEdId,
    notes,
    gbaConsole.consoleName,
    gbaConsole.consoleId,
    'both',
    true,
    edConsole
  );
  const results = await fetchIgdbData(gbaGames, gbaUserData);
  await writeOut(results, 'GBAEverDrive', errorRun);

  // GBC games: lookup IGDB data, extra data, format, and write
  const gbcConsole = returnWithConsoleName(22);
  const gbcEdId = 140000;
  const gbcUserData = setUserData(
    gbcEdId,
    notes,
    gbcConsole.consoleName,
    gbcConsole.consoleId,
    'both',
    true,
    edConsole
  );
  const gbcResults = await fetchIgdbData(gbcGames, gbcUserData);
  await writeOut(gbcResults, 'GBAEverDriveGBCGames', errorRun);

  // GB games: lookup IGDB data, extra data, format, and write
  const gbConsole = returnWithConsoleName(33);
  const gbEdId = 150000;
  const gbUserData = setUserData(
    gbEdId,
    notes,
    gbConsole.consoleName,
    gbConsole.consoleId,
    'both',
    true,
    edConsole
  );
  const gbResults = await fetchIgdbData(gbGames, gbUserData);
  await writeOut(gbResults, 'GBAEverDriveGBGames', errorRun);

  // GG games: lookup IGDB data, extra data, format, and write
  const ggConsole = returnWithConsoleName(35);
  const ggEdId = 160000;
  const ggUserData = setUserData(
    ggEdId,
    notes,
    ggConsole.consoleName,
    ggConsole.consoleId,
    'both',
    true,
    edConsole
  );
  const ggResults = await fetchIgdbData(ggGames, ggUserData);
  await writeOut(ggResults, 'GBAEverDriveGGGames', errorRun);

  // NES games: lookup IGDB data, extra data, format, and write
  const nesConsole = returnWithConsoleName(18);
  const nesEdId = 170000;
  const nesUserData = setUserData(
    nesEdId,
    notes,
    nesConsole.consoleName,
    nesConsole.consoleId,
    'both',
    true,
    edConsole
  );
  const nesResults = await fetchIgdbData(nesGames, nesUserData);
  await writeOut(nesResults, 'GBAEverDriveNESGames', errorRun);

  // SMS games: lookup IGDB data, extra data, format, and write
  const smsConsole = returnWithConsoleName(64);
  const smsEdId = 180000;
  const smsUserData = setUserData(
    smsEdId,
    notes,
    smsConsole.consoleName,
    smsConsole.consoleId,
    'both',
    true,
    edConsole
  );
  const smsResults = await fetchIgdbData(smsGames, smsUserData);
  await writeOut(smsResults, 'GBAEverDriveSMSGames', errorRun);
})();
