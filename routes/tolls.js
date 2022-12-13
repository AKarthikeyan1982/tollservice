const express = require('express');
const router = express.Router();
const tollController = require('../app/api/controllers/tolls');


router.get('/all', tollController.getAllToll);
router.get('/search', tollController.searchToll);

module.exports = router;
