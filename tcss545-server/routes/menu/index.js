'use strict';

const express = require('express');
const router = express.Router();

const controller = require('./controller');

router.get('/', controller.getMenu);
router.get('/:id', controller.getMenuForLocation);

module.exports = router;