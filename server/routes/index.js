const express = require('express');
const router = express.Router();

router.use('/', require('./vg'));

module.exports = router;
