import express from 'express';
import { scrapeProduct } from '../controllers/scrapeController.js';

const router = express.Router();

router.post('/scrape', scrapeProduct);

export default router;
