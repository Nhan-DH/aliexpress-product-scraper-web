import { getProductData } from '../services/scraperService.js';
import { COUNTRY_OPTIONS } from '../services/shippingDestination.service.js';

const ALIEXPRESS_URL_PATTERN = /aliexpress\.com/i;

async function scrapeProduct(req, res) {
  const { url, shipToCountry } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Please enter a valid AliExpress product URL' });
  }

  if (!ALIEXPRESS_URL_PATTERN.test(url)) {
    return res.status(400).json({ error: 'Please enter a valid AliExpress product URL' });
  }

  if (!shipToCountry || typeof shipToCountry !== 'string') {
    return res.status(400).json({ error: 'Please select a shipping destination country.' });
  }

  const selectedCountry = shipToCountry.toUpperCase();
  if (!COUNTRY_OPTIONS[selectedCountry]) {
    return res.status(400).json({ error: 'Please select a valid shipping destination country.' });
  }

  try {
    const productData = await getProductData(url, selectedCountry);
    res.json({
      success: true,
      selectedCountry,
      selectedCountryName: COUNTRY_OPTIONS[selectedCountry].name,
      warning: productData.shippingWarning || null,
      data: productData,
    });
  } catch (err) {
    const message = err.message || 'Failed to fetch product data';
    res.status(500).json({ error: message });
  }
}

export { scrapeProduct };
