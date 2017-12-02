'use strict';

const express = require('express');
const router = express.Router();

const offerings = require('./offerings');
const menu = require('./menu');
const locations = require('./locations');

router.use('/api/rest/v1/offerings', offerings);
router.use('/api/rest/v1/menu', menu);
router.use('/api/rest/v1/locations', locations);

module.exports = router;
