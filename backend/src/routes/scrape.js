const express = require('express');
const router = express.Router();
const { scrapeProduct } = require('../controllers/scrapeController');

router.post('/scrape', scrapeProduct);

module.exports = router;
