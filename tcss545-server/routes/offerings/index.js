'use strict';

const express = require('express');
const router = express.Router();

const controller = require('./controller');

router.get('/', controller.getOfferings);
router.get('/:id', controller.getOffering);
router.post('/search', controller.searchOfferings);

module.exports = router;