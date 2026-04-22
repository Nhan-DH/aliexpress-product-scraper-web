const scrapeAliexpressProduct = require('aliexpress-product-scraper');

function extractProductId(url) {
  const itemMatch = url.match(/\/item\/(\d+)\.html/);
  if (itemMatch) return itemMatch[1];

  const idMatch = url.match(/[?&]id=(\d+)/);
  if (idMatch) return idMatch[1];

  return null;
}

function transformProductData(raw) {
  return {
    title: raw.title || raw.name || '',
    price: raw.price || raw.salePrice || raw.unitPrice || null,
    rating: raw.rating || raw.starRating || null,
    orders: raw.orders || raw.totalOrders || raw.sold || null,
    stock: raw.stock || raw.availableStock || null,
    images: Array.isArray(raw.images) ? raw.images : (raw.imageList || []),
    store: {
      name: raw.store?.name || raw.storeName || raw.sellerName || '',
      url: raw.store?.url || raw.storeUrl || '',
      rating: raw.store?.rating || raw.sellerRating || null,
      followers: raw.store?.followers || raw.storeFollowers || null,
    },
    specifications: Array.isArray(raw.specifications)
      ? raw.specifications
      : Array.isArray(raw.specs)
      ? raw.specs
      : [],
    variants: Array.isArray(raw.variants)
      ? raw.variants
      : Array.isArray(raw.skuList)
      ? raw.skuList
      : [],
    shipping: Array.isArray(raw.shipping)
      ? raw.shipping
      : Array.isArray(raw.shippingList)
      ? raw.shippingList
      : [],
    reviews: Array.isArray(raw.reviews)
      ? raw.reviews
      : [],
  };
}

async function getProductData(url) {
  const productId = extractProductId(url);

  if (!productId) {
    throw new Error('Could not extract product ID from URL. Please use a direct AliExpress product URL.');
  }

  const raw = await scrapeAliexpressProduct(productId);

  if (!raw) {
    throw new Error('Product not found or could not be retrieved.');
  }

  return transformProductData(raw);
}

module.exports = { getProductData, extractProductId };
