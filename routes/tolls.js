const express = require('express');
const router = express.Router();
const tollController = require('../app/api/controllers/tolls');


router.get('/', tollController.getAllToll);
router.get('/searchToll', tollController.searchToll);

module.exports = router;