const express = require('express');
const router = express.Router();
const vgCtrl = require('./vg.controller.js');
const vgDbCtrl = require('./vgDb.controller');
const gbCtrl = require('./giantBomb.controller');
const dataCtrl = require('./dataViz.controller');
const updateCtrl = require('./updateData.controller');
const ebayCtrl = require('./ebay.controller');
const exportCtrl = require('./exportCsv.controller');
const xboxbc = require('./xboxBc.controller');

// XBOX Backward Compatibility
router.post('/xboxbc', xboxbc.xboxBackward);

// IGDB search
router.post('/searchgame', vgCtrl.searchGame);
router.post('/searchplatform', vgCtrl.searchPlatforms);

// export to file
router.post('/exportcsv', exportCtrl.exportCsv);

// Giant Bomb search
router.post('/searchgbplatform', gbCtrl.searchConsoles);
router.post('/searchgbgame', gbCtrl.searchGames);
router.post('/searchgenre', vgCtrl.getGenre);

// Data Viz
router.post('/dataviz', dataCtrl.dataVizData);

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

module.exports = router;
