const express = require('express');
const router = express.Router();

const controller = require('../controllers/elementalDexController');

router
.route('/')
.get(controller.readAllDex)


module.exports = router;
