const path = require('path');
const { returnWithConsoleName } = require('./util/completeFileObj');
const { readIn } = require('./util/readInFiles');
const { setUserData, fetchIgdbData } = require('./util/queryIgdb');
const { writeOut } = require('./util/writeOutResults');

// read paths
const filesPath = '/media/digitaljedi/ED';
const gbaPath = path.join(filesPath, 'ROMS');
const gbcPath = path.join(filesPath, 'GBC');
const gbPath = path.join(filesPath, 'GB');
const ggPath = path.join(filesPath, 'GG');
const nesPath = path.join(filesPath, 'NES');
const smsPath = path.join(filesPath, 'SMS');

// write paths
const writePathBase = path.join(__dirname, 'results');
const gbaWrite = path.join(writePathBase, 'nintendoGBAEverDriveGBA.json');
const gbcWrite = path.join(writePathBase, 'nintendoGBAEverDriveGBC.json');
const gbWrite = path.join(writePathBase, 'nintendoGBAEverDriveGB.json');
const ggWrite = path.join(writePathBase, 'nintendoGBAEverDriveGG.json');
const nesWrite = path.join(writePathBase, 'nintendoGBAEverDriveNES.json');
const smsWrite = path.join(writePathBase, 'nintendoGBAEverDriveSMS.json');

(async () => {
  // read in files from directories
  const gbaGames = await readIn(gbaPath);
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
    true
  );
  const results = await fetchIgdbData(gbaGames, gbaUserData);
  await writeOut(results, gbaWrite, errorRun);

  // // GBC games: lookup IGDB data, extra data, format, and write
  // const gbcConsole = returnWithConsoleName(22);
  // const gbcEdId = 140000;
  // const gbcUserData = setUserData(
  //   gbcEdId,
  //   notes,
  //   gbcConsole.consoleName,
  //   gbcConsole.consoleId,
  //   'both',
  //   true
  // );
  // const gbcResults = await fetchIgdbData(gbcGames, gbcUserData);
  // await writeOut(gbcResults, gbcWrite, errorRun);

  // // GB games: lookup IGDB data, extra data, format, and write
  // const gbConsole = returnWithConsoleName(33);
  // const gbEdId = 150000;
  // const gbUserData = setUserData(
  //   gbEdId,
  //   notes,
  //   gbConsole.consoleName,
  //   gbConsole.consoleId,
  //   'both',
  //   true
  // );
  // const gbResults = await fetchIgdbData(gbGames, gbUserData);
  // await writeOut(gbResults, gbWrite, errorRun);

  // // GG games: lookup IGDB data, extra data, format, and write
  // const ggConsole = returnWithConsoleName(35);
  // const ggEdId = 160000;
  // const ggUserData = setUserData(
  //   ggEdId,
  //   notes,
  //   ggConsole.consoleName,
  //   ggConsole.consoleId,
  //   'both',
  //   true
  // );
  // const ggResults = await fetchIgdbData(ggGames, ggUserData);
  // await writeOut(ggResults, ggWrite, errorRun);

  // // NES games: lookup IGDB data, extra data, format, and write
  // const nesConsole = returnWithConsoleName(18);
  // const nesEdId = 170000;
  // const nesUserData = setUserData(
  //   nesEdId,
  //   notes,
  //   nesConsole.consoleName,
  //   nesConsole.consoleId,
  //   'both',
  //   true
  // );
  // const nesResults = await fetchIgdbData(nesGames, nesUserData);
  // await writeOut(nesResults, nesWrite, errorRun);

  // // SMS games: lookup IGDB data, extra data, format, and write
  // const smsConsole = returnWithConsoleName(64);
  // const smsEdId = 180000;
  // const smsUserData = setUserData(
  //   smsEdId,
  //   notes,
  //   smsConsole.consoleName,
  //   smsConsole.consoleId,
  //   'both',
  //   true
  // );
  // const smsResults = await fetchIgdbData(smsGames, smsUserData);
  // await writeOut(smsResults, smsWrite, errorRun);
})();
// @TODO: figure out console name and id situation; playable on GBA but needs actual id and name for lookup (maybe just id)
