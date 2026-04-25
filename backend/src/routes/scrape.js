import express from 'express';
import { scrapeProduct } from '../controllers/scrapeController.js';

const router = express.Router();

router.post('/scrape', scrapeProduct);
router.post('/products/scrape', scrapeProduct);

export default router;
