'use strict';

const express = require('express');
const router = express.Router();

const controller = require('./controller');

router.get('/', controller.getLocations);
router.get('/:id', controller.getLocationsById);

module.exports = router;