# AliExpress Product Scraper Web

A full-stack web application that scrapes AliExpress product data and displays it in a clean, interactive UI with export capabilities.

## Features

- 🔍 Scrape any AliExpress product by URL
- 📊 View product details: title, price, rating, orders, stock
- 🖼️ Browse product images with gallery view
- 🏪 Store information and ratings
- 📋 Product specifications table
- 🎨 Variants (colors, sizes, etc.)
- 🚚 Shipping options
- ⭐ Customer reviews
- 📥 Export to Excel (multi-sheet)
- 📋 Copy raw JSON data

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

### Backend

```bash
cd backend
npm install
npm start
```

The backend server runs on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server runs on `http://localhost:5173`.

## Running Both Servers

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend && npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend && npm run dev
```

Then open `http://localhost:5173` in your browser.

## API Usage

**POST /api/scrape**

```bash
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.aliexpress.com/item/1005006789012345.html"}'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "title": "Product Name",
    "price": "9.99",
    "rating": "4.8",
    "orders": 1234,
    "stock": 500,
    "images": ["https://..."],
    "store": { "name": "...", "url": "...", "rating": "...", "followers": 0 },
    "specifications": [{ "key": "Material", "value": "Cotton" }],
    "variants": [],
    "shipping": [],
    "reviews": []
  }
}
```

## Environment Variables

Create a `backend/.env` file (optional):

```
PORT=5000
```
