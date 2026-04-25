const { getProductData } = require('../services/scraperService');

const ALIEXPRESS_URL_PATTERN = /aliexpress\.com/i;

async function scrapeProduct(req, res) {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Please enter a valid AliExpress product URL' });
  }

  if (!ALIEXPRESS_URL_PATTERN.test(url)) {
    return res.status(400).json({ error: 'Please enter a valid AliExpress product URL' });
  }

  try {
    const productData = await getProductData(url);
    res.json({ success: true, data: productData });
  } catch (err) {
    const message = err.message || 'Failed to fetch product data';
    res.status(500).json({ error: message });
  }
}

module.exports = { scrapeProduct };
