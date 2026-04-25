import scrapeAliexpressProduct from 'aliexpress-product-scraper';
import { scrapeProductWithDestination } from './shippingDestination.service.js';

function extractProductId(url) {
  if (!url || typeof url !== 'string') return null;

  const normalizedUrl = url.trim();

  try {
    const parsedUrl = new URL(normalizedUrl);
    const pathMatch = parsedUrl.pathname.match(/(?:\/item\/|\/i\/)?(\d{8,})(?:\.html)?\/?$/i)
      || parsedUrl.pathname.match(/\/item\/(\d{8,})\.html/i);
    if (pathMatch) return pathMatch[1];

    for (const key of ['id', 'productId', 'product_id']) {
      const value = parsedUrl.searchParams.get(key);
      if (/^\d{8,}$/.test(value || '')) return value;
    }
  } catch {
    // Fall back to regex parsing for pasted URLs that are not fully encoded.
  }

  const itemMatch = normalizedUrl.match(/\/(?:item|i)\/(\d{8,})(?:\.html)?/i);
  if (itemMatch) return itemMatch[1];

  const htmlMatch = normalizedUrl.match(/(\d{8,})\.html/i);
  if (htmlMatch) return htmlMatch[1];

  const idMatch = normalizedUrl.match(/[?&](?:id|productId|product_id)=(\d{8,})/i);
  if (idMatch) return idMatch[1];

  return null;
}

function numericValue(value) {
  if (value == null) return null;
  if (typeof value === 'number') return value;
  if (typeof value === 'object') {
    if (typeof value.value === 'number') return value.value;
    if (typeof value.min === 'number') return value.min;
    if (typeof value.current === 'number') return value.current;
    return null;
  }
  const parsed = Number(String(value).replace(/[^\d.]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizePriceRange(price) {
  return {
    min: numericValue(price?.min),
    max: numericValue(price?.max),
  };
}

function normalizeSkuPrice(price) {
  return {
    ...price,
    originalPrice: numericValue(price?.originalPrice),
    salePrice: numericValue(price?.salePrice),
  };
}

function normalizeOrders(orders) {
  const parsed = Number(String(orders ?? 0).replace(/[^\d]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function transformProductData(raw) {
  const totalAvailableQuantity = raw.totalAvailableQuantity
    ?? raw.quantity?.available
    ?? raw.inventoryComponent?.totalAvailQuantity
    ?? raw.stock
    ?? raw.availableStock
    ?? null;
  const originalPrice = normalizePriceRange(raw.originalPrice);
  const salePrice = normalizePriceRange(raw.salePrice);
  const currency = raw.currency
    || raw.currencyInfo?.currencyCode
    || raw.currencyInfo?.currency
    || raw.salePrice?.min?.currency
    || raw.originalPrice?.min?.currency
    || 'USD';
  const variants = {
    options: raw.variants?.options || [],
    prices: (raw.variants?.prices || []).map(normalizeSkuPrice),
  };
  const storeInfo = raw.storeInfo || raw.store || {};
  const specs = Array.isArray(raw.specs)
    ? raw.specs
    : Array.isArray(raw.specifications)
    ? raw.specifications
    : [];
  const averageRating = raw.ratings?.averageStar || raw.rating || raw.starRating || null;

  return {
    title: raw.title || raw.name || '',
    selectedCountry: raw.selectedCountry || null,
    selectedCountryName: raw.selectedCountryName || null,
    shippingWarning: raw.shippingWarning || null,
    categoryId: raw.categoryId ?? null,
    productId: raw.productId ?? null,
    totalAvailableQuantity,
    description: raw.description || '',
    orders: normalizeOrders(raw.orders || raw.totalOrders || raw.sold),
    storeInfo,
    ratings: raw.ratings || {},
    variants,
    specs,
    currency,
    originalPrice,
    salePrice,
    images: Array.isArray(raw.images) ? raw.images : (raw.imageList || []),
    reviews: Array.isArray(raw.reviews) ? raw.reviews : [],
    shipping: Array.isArray(raw.shipping)
      ? raw.shipping
      : Array.isArray(raw.shippingList)
      ? raw.shippingList
      : [],

    price: salePrice.min ?? salePrice.max ?? originalPrice.min ?? raw.price ?? raw.unitPrice ?? null,
    rating: averageRating,
    stock: totalAvailableQuantity,
    store: {
      name: storeInfo.name || raw.storeName || raw.sellerName || '',
      url: storeInfo.url || raw.storeUrl || '',
      rating: storeInfo.rating || raw.sellerRating || null,
      followers: storeInfo.followers || raw.storeFollowers || null,
      ratingCount: storeInfo.ratingCount || null,
    },
    specifications: specs,
  };
}

async function getProductData(url, shipToCountry = null) {
  const productId = extractProductId(url);

  if (!productId) {
    throw new Error('Could not extract product ID from URL. Please use a direct AliExpress product URL.');
  }

  const raw = shipToCountry
    ? await scrapeProductWithDestination(productId, shipToCountry)
    : await scrapeAliexpressProduct(productId);

  if (!raw) {
    throw new Error('Product not found or could not be retrieved.');
  }

  return transformProductData(raw);
}

export { getProductData, extractProductId };
