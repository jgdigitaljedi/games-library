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

// insecure auth
router.post('/auth', auth.login);

// gallery images
router.get('/gallerylist', gallery.imageCategories);

// IGDB search
router.post('/searchgame', auth.insecureMW, vgCtrl.searchGame);
router.post('/searchplatform', auth.insecureMW, vgCtrl.searchPlatforms);
router.post('/searchplatformversions', auth.insecureMW, vgCtrl.searchPlatformVersions);

// export to file
router.post('/exportcsv', exportCtrl.exportCsv);

// Data Viz
router.post('/dataviz', dataCtrl.dataVizData);

// Lists
router.post('/lists', listsCtrl.getList);

// eBay price search
router.post('/ebay', ebayCtrl.getEbayPrices);

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

// get everDrive data
router.get('/everdrives', vgDbCtrl.everDrives);

// get stats data
router.get('/stats', vgDbCtrl.collectionStats);
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

module.exports = router;
