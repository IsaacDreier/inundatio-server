const express = require('express');
const router = express.Router();
const checkJwt = require('../auth');
const dataController = require('../controllers/dataController');

router.get('/', checkJwt, dataController.getSiteData);
router.get('/locations', checkJwt, dataController.getLocations);
module.exports = router;
