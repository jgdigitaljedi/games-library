const express = require('express');
const router = express.Router();

router.use('/vg', require('./vg'));

module.exports = router;
