import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';
import { get as getReviews } from 'aliexpress-product-scraper/src/reviews.js';
import { parseJsonp, extractDataFromApiResponse } from 'aliexpress-product-scraper/src/parsers.js';
import { buildProductJson } from 'aliexpress-product-scraper/src/transform.js';

puppeteer.use(StealthPlugin());

const FAST_SCRAPE = process.env.FAST_SCRAPE !== 'false';
const PRODUCT_DATA_WAIT_MS = Number(process.env.PRODUCT_DATA_WAIT_MS || 5000);

const COUNTRY_OPTIONS = {
  CA: { name: 'Canada', currency: 'USD', locale: 'en_US' },
  US: { name: 'United States', currency: 'USD', locale: 'en_US' },
  GB: { name: 'United Kingdom', currency: 'GBP', locale: 'en_GB' },
  AU: { name: 'Australia', currency: 'AUD', locale: 'en_US' },
  VN: { name: 'Vietnam', currency: 'USD', locale: 'en_US' },
  JP: { name: 'Japan', currency: 'JPY', locale: 'en_US' },
  DE: { name: 'Germany', currency: 'EUR', locale: 'en_US' },
  FR: { name: 'France', currency: 'EUR', locale: 'en_US' },
};

function getCountryConfig(shipToCountry) {
  return COUNTRY_OPTIONS[String(shipToCountry || '').toUpperCase()] || null;
}

function normalizeCountry(value) {
  return String(value || '').trim().toLowerCase();
}

function parseFee(value) {
  if (value == null || value === '') return null;
  if (typeof value === 'number') return value;
  const parsed = Number(String(value).replace(/[^\d.]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

async function setAliExpressShipToCountry(page, shipToCountry) {
  const countryCode = String(shipToCountry || '').toUpperCase();
  const config = getCountryConfig(countryCode);

  if (!config) {
    throw new Error('Please select a valid shipping destination country.');
  }

  const cookieValue = [
    'site=glo',
    `c_tp=${config.currency}`,
    `region=${countryCode}`,
    `b_locale=${config.locale}`,
  ].join('&');

  await page.setCookie(
    {
      name: 'aep_usuc_f',
      value: cookieValue,
      domain: '.aliexpress.com',
      path: '/',
    },
    {
      name: 'intl_locale',
      value: config.locale,
      domain: '.aliexpress.com',
      path: '/',
    },
    {
      name: 'xman_us_f',
      value: `x_l=0&x_locale=${config.locale}&x_c_chg=1&acs_rt=0&x_ship_to=${countryCode}`,
      domain: '.aliexpress.com',
      path: '/',
    },
  );

  await page.setExtraHTTPHeaders({
    'accept-language': `${config.locale.replace('_', '-')},en;q=0.9`,
  });
}

function normalizeShippingData(rawShippingData, shipToCountry, { includeUnmatched = false } = {}) {
  const countryCode = String(shipToCountry || '').toUpperCase();
  const config = getCountryConfig(countryCode);

  if (!Array.isArray(rawShippingData)) return [];

  return rawShippingData
    .filter((option) => {
      const toCode = String(option.shippingInfo?.toCode || '').toUpperCase();
      const toName = normalizeCountry(option.shippingInfo?.to);
      const hasDestination = Boolean(toCode || toName);
      return toCode === countryCode
        || toName === normalizeCountry(config?.name)
        || (includeUnmatched && !hasDestination);
    })
    .map((option) => ({
      provider: option.deliveryProviderName || option.provider || option.company || 'Shipping option',
      deliveryProviderName: option.deliveryProviderName || option.provider || option.company || 'Shipping option',
      from: option.shippingInfo?.from || null,
      to: option.shippingInfo?.to || config?.name || countryCode,
      fee: parseFee(option.shippingInfo?.fees),
      currency: option.shippingInfo?.displayCurrency || config?.currency || 'USD',
      deliveryMin: option.deliveryInfo?.min ?? null,
      deliveryMax: option.deliveryInfo?.max ?? null,
      unreachable: Boolean(option.shippingInfo?.unreachable),
      shippingInfo: {
        from: option.shippingInfo?.from || null,
        to: option.shippingInfo?.to || config?.name || countryCode,
        toCode: option.shippingInfo?.toCode || countryCode,
        fees: parseFee(option.shippingInfo?.fees) ?? 0,
        unreachable: Boolean(option.shippingInfo?.unreachable),
      },
      deliveryInfo: {
        min: option.deliveryInfo?.min ?? null,
        max: option.deliveryInfo?.max ?? null,
      },
    }));
}

function hasUsableShippingData(shipping) {
  return Array.isArray(shipping) && shipping.some((option) => (
    option.fee != null
    || option.shippingInfo?.fees != null
    || option.deliveryMin != null
    || option.deliveryMax != null
    || option.deliveryInfo?.min != null
    || option.deliveryInfo?.max != null
  ));
}

async function speedUpPage(page) {
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const blockedTypes = new Set(['image', 'media', 'font', 'stylesheet']);
    if (blockedTypes.has(request.resourceType())) {
      request.abort();
      return;
    }
    request.continue();
  });
}

async function scrapeProductWithDestination(productId, shipToCountry) {
  const countryCode = String(shipToCountry || '').toUpperCase();
  const config = getCountryConfig(countryCode);

  if (!config) {
    throw new Error('Please select a valid shipping destination country.');
  }

  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--disable-blink-features=AutomationControlled'],
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1365, height: 900 });
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      + '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    );
    await speedUpPage(page);
    await setAliExpressShipToCountry(page, countryCode);

    let apiData = null;
    page.on('response', async (response) => {
      const responseUrl = response.url();
      if (!responseUrl.includes('mtop.aliexpress') || !responseUrl.includes('pdp')) return;

      try {
        const text = await response.text();
        const parsed = parseJsonp(text);
        if (parsed?.data?.result) {
          apiData = parsed;
        }
      } catch {
        // Some intercepted responses are not product JSONP.
      }
    });

    await page.goto(`https://www.aliexpress.com/item/${productId}.html?shipToCountry=${countryCode}`, {
      waitUntil: 'domcontentloaded',
      timeout: 20000,
    });

    let data = null;
    const startTime = Date.now();
    while (!data && Date.now() - startTime < PRODUCT_DATA_WAIT_MS) {
      if (apiData) {
        data = extractDataFromApiResponse(apiData);
      }

      if (!data) {
        data = await page.evaluate(() => window.runParams?.data || null);
      }

      if (!data) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    if (!data) {
      throw new Error('Unable to fetch shipping data for selected destination.');
    }

    const descriptionUrl = FAST_SCRAPE ? null : data?.productDescComponent?.descriptionUrl;
    const descriptionDataPromise = descriptionUrl
      ? page.goto(descriptionUrl).then(async () => {
          const descriptionPageHtml = await page.content();
          const $ = cheerio.load(descriptionPageHtml);
          return $('body').html();
        })
      : Promise.resolve(null);

    const reviewsPromise = FAST_SCRAPE
      ? Promise.resolve([])
      : getReviews({
          productId,
          limit: 20,
          total: data.feedbackComponent?.totalValidNum || 0,
          filterReviewsBy: 'all',
        });

    const [descriptionData, reviews] = await Promise.all([
      descriptionDataPromise,
      reviewsPromise,
    ]);

    const productData = buildProductJson({ data, descriptionData, reviews });
    let matchedShipping = normalizeShippingData(productData.shipping, countryCode);
    if (!hasUsableShippingData(matchedShipping)) {
      matchedShipping = normalizeShippingData(productData.shipping, countryCode, { includeUnmatched: true });
    }
    const returnedCountries = [...new Set((productData.shipping || []).map((item) => item.shippingInfo?.to).filter(Boolean))];
    const warning = hasUsableShippingData(matchedShipping)
      ? null
      : 'AliExpress did not return shipping fee or delivery-day data for the selected destination.';

    return {
      ...productData,
      selectedCountry: countryCode,
      selectedCountryName: config.name,
      shippingWarning: warning,
      shipping: matchedShipping,
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

export {
  COUNTRY_OPTIONS,
  scrapeProductWithDestination,
  setAliExpressShipToCountry,
  normalizeShippingData,
};
