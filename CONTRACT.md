# Northstar Store API Contract

All routes use JSON. During development, the Vite proxy forwards `/api/*` to Express on port 3001. Currency values in JSON are USD dollars; the database stores integer cents. Errors use `{ "error": "human-readable explanation" }`.

## `GET /api/health`

- Request: no body.
- `200`: `{ "status": "ok" }`.

## `GET /api/products`

- Query (all optional): `category` exact category name; `q` substring search over name/category/description; `maxPrice` maximum price in USD.
- Request body: none.
- `200`: `{ "products": Product[], "count": number }`.
- `Product`: `{ "id": string, "name": string, "category": string, "price": number, "description": string, "image_url": string, "color": string, "featured": boolean, "inventory": number }`.
- Example: `GET /api/products?category=Carry&q=bag`.

## `GET /api/products/:id` (custom detail endpoint)

- `200`: `{ "product": Product }`.
- `404`: `{ "error": "Product not found." }`.

## `POST /api/orders` (custom order endpoint)

- Request: `{ "name": string, "items": [{ "productId": string, "quantity": integer }] }`.
- Constraints: name 2–80 characters; 1–30 submitted item rows; quantity 1–20; product IDs must exist; requested quantities cannot exceed current inventory. Prices are read from SQLite, never trusted from the browser.
- `201`: `{ "order": { "id": string, "name": string, "items": [{ "productId": string, "name": string, "quantity": integer, "unitPrice": number }], "total": number, "status": "received" }, "message": string }`.
- `400`: invalid request, unknown product, or invalid quantity.
- `409`: insufficient inventory or inventory changed while placing the order.
- Persistence behavior: insert order and decrement stock within one SQLite transaction. This demo does not collect payment.

## `POST /api/messages`

- Request: `{ "name": string, "message": string }`.
- Constraints: name 2–80 characters; message 5–1,000 characters.
- `201`: `{ "message": string, "id": number }`.
- `400`: invalid name or message.
- Persistence behavior: inserts the message into SQLite; the API does not expose messages publicly.

## General behavior

- Unknown route: `404 { "error": "Route not found." }`.
- Unexpected server error: `500 { "error": "Something went wrong. Please try again." }`.
- The API uses parameterized SQL for user-supplied product IDs and values. Order totals and stock availability are calculated server-side.
