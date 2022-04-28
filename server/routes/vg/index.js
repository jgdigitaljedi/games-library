const express = require('express');
const router = express.Router();
const vgCtrl = require('./vg.controller.js');
const vgDbCtrl = require('./vgDb.controller');
// const gbCtrl = require('./giantBomb.controller');
const dataCtrl = require('./dataViz.controller');
const updateCtrl = require('./updateData.controller');
const ebayCtrl = require('./ebay.controller');
const exportCtrl = require('./exportCsv.controller');
const listsCtrl = require('./lists.controller');
const utilsCtrl = require('./vgUtil.controller');
const gallery = require('./gallery.controller.js');
const auth = require('./auth.controller');
const itemsCtrl = require('./itemsCtrl.controller');
const pcCtrl = require('./pricecharting.controller');

// insecure auth
router.post('/auth', auth.login);

// gallery images
router.get('/gallerylist', gallery.imageCategories);

// IGDB search
router.post('/searchgame', auth.insecureMW, vgCtrl.searchGame);
router.post('/searchplatform', auth.insecureMW, vgCtrl.searchPlatforms);
router.post('/searchplatformversions', auth.insecureMW, vgCtrl.searchPlatformVersions);
router.post('/updategameigdb/:id', auth.insecureMW, vgCtrl.updateGameById);
router.post('/updateplatformigdb/:id', auth.insecureMW, vgCtrl.updatePlatformById);
router.get('/updatealligdbgames', auth.insecureMW, vgCtrl.updateAllIgdbGames);
router.get('/updatealligdbplatforms', auth.insecureMW, vgCtrl.updateAllIgdbPlatforms);

// export to file
router.post('/exportcsv', exportCtrl.exportCsv);

// Data Viz
router.post('/dataviz', dataCtrl.dataVizData);

// Lists
router.post('/lists', listsCtrl.getList);

// Items context
router.get('/items', itemsCtrl.getItems);

// eBay price search
router.post('/ebay', ebayCtrl.getEbayPrices);

// pricecharting calls
router.post('/pcnamesearch', pcCtrl.searchByName);
router.post('/pcgetprice', pcCtrl.searchById);
router.get('/pcgamestats', pcCtrl.gameStats);
router.get('/pcplatformstats', pcCtrl.platformStats);
router.get('/pcaccstats', pcCtrl.accStats);
router.get('/pcclonestats', pcCtrl.cloneStats);
router.get('/pccollstats', pcCtrl.collStats);
router.get('/pcvaluegames', pcCtrl.mostValuableGames);
router.get('/pcvalueplatforms', pcCtrl.mostValuablePlatforms);
router.get('/pcupdategames', pcCtrl.updateGamesPrices);
router.get('/pcupdateconsoles', pcCtrl.updateConsolesPrices);
router.get('/pcupdateclones', pcCtrl.updateClonesPrices);
router.get('/pcupdateacc', pcCtrl.updateAccPrices);
router.get('/pcupdatecollectibles', pcCtrl.updateCollPrices);

// Update install_base values from GB on most recent generations of consoles
router.post('/updateconsole/:id', updateCtrl.updateConsoles);
// Update ratings fields from IGDB on newer games
router.post('/updategame/:id', updateCtrl.updateGame);

// DB Game CRUD
router.get('/games', vgDbCtrl.getMyGames);
router.post('/gamescombined', vgDbCtrl.getCombinedGameData);
router.put('/games', vgDbCtrl.saveGame);
router.delete('/games/:id', vgDbCtrl.deleteGame);
router.patch('/games/:id', vgDbCtrl.editGame);
router.get('/games/total', vgDbCtrl.gamesTotal);
router.get('/games/physicaltotal', vgDbCtrl.getPhysicalGamesTotal);

// get everDrive data
router.get('/everdrives', vgDbCtrl.everDrives);
router.get('/everdrivescount', vgDbCtrl.everdrivesTotal);

// get stats data
router.get('/stats', vgDbCtrl.collectionStats);
router.get('/extra', vgDbCtrl.collectionExtra);
router.get('/gamestats', vgDbCtrl.gameStats);

// DB Platform/Console CRUD
router.get('/consoles', vgDbCtrl.getMyPlatforms);
router.post('/consoles', vgDbCtrl.searchMyPlatforms);
router.put('/consoles', vgDbCtrl.savePlatform);
router.delete('/consoles/:id', vgDbCtrl.deleteConsole);
router.patch('/consoles/:id', vgDbCtrl.editConsole);

// DB Accessories CRUD
router.get('/acc', vgDbCtrl.getMyAcc);
router.put('/acc', vgDbCtrl.saveAcc);
router.delete('/acc/:id', vgDbCtrl.deleteAcc);
router.patch('/acc/:id', vgDbCtrl.editAcc);

// DB Collectibles CRUD
router.get('/collectibles', vgDbCtrl.getMyColl);
router.put('/collectibles', vgDbCtrl.saveColl);
router.delete('/collectibles/:id', vgDbCtrl.deleteColl);
router.patch('/collectibles/:id', vgDbCtrl.editColl);

// DB Clones CRUD
router.get('/clones', vgDbCtrl.getMyClones);
router.put('/clones', vgDbCtrl.saveClone);
router.delete('/clones/:id', vgDbCtrl.deleteClone);
router.patch('/clones/:id', vgDbCtrl.editClone);

// DB Hardware CRUD
router.get('/hardware', vgDbCtrl.getMyHardware);
router.put('/hardware', vgDbCtrl.saveHardware);
router.delete('/hardware/:id', vgDbCtrl.deleteHardware);
router.patch('/hardware/:id', vgDbCtrl.editHardware);

// DB Wishlist CRUD
router.get('/wishlist/:which', vgDbCtrl.getMyWishlist);
router.put('/wishlist/:which', vgDbCtrl.saveWishlist);
router.delete('/wishlist/:which/:id', vgDbCtrl.deleteWishlist);
router.patch('/wishlist/:which/:id', vgDbCtrl.editWishlist);

// Utils
router.get('/utils/platforms', utilsCtrl.getPlatformArray);
router.get('/utils/esrb', utilsCtrl.getEsrbArray);
router.get('/utils/genres', utilsCtrl.getGenreArray);
router.get('/utils/platformids', utilsCtrl.getPlatformsWithId);
router.get('/utils/howacquired', utilsCtrl.getHowAcquiredArr);

module.exports = router;
