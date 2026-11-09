# Northstar Supply Store — P2 Project Spec

## Problem

Shoppers need a simple way to browse a small outdoor-goods catalog, keep a bag while they browse, and submit a demo order. The catalog and submitted records should live in SQLite and be accessed through an API.

## Users

- A shopper browsing products, adding and removing items, and placing a demo order.
- A visitor sending a short message through the contact form.
- The developer maintaining the React client, Express API, and SQLite data.

## Inputs

- Product rows seeded in the SQLite `products` table.
- Search text and category selections in the storefront.
- Cart changes made in the browser.
- A name and product quantities for a demo order.
- A name and message for the contact form.

## Outputs

- A responsive React/Vite storefront with shop, product detail, cart, contact, and order confirmation pages.
- An Express API that reads products and saves orders and messages to SQLite.
- A persistent browser cart and an order total calculated by the server from current database prices.

## Acceptance criteria

1. `npm run dev` starts the Vite client and Express API; Vite proxies `/api` requests so the API port can remain private in Codespaces.
2. The shop renders SQLite products, searches by text, filters by category, and shows loading, error, and no-results states.
3. Product cards link to product details and add items to a cart. Cart count, quantities, removal, and total update correctly; the cart survives a page reload.
4. `GET /api/products` reads the product table. `GET /api/products/:id` returns one product or a 404 JSON error.
5. `POST /api/orders` validates the name, products, quantities, and inventory; calculates the total from SQLite; saves the order; and decreases inventory in one transaction.
6. `POST /api/messages` validates and saves the contact form. Submitted data persists in SQLite.
7. `CONTRACT.md` documents each API route, request, response, and error status.
8. The README explains setup and run commands, the client/server structure, and the page → API → database architecture.
9. `.gitignore` excludes dependencies, environment files, build output, and the local database. The AI log records what was generated, reviewed, changed, and verified.

## Out of scope

Real payment collection, customer accounts, addresses or phone numbers, production order fulfillment, public deployment, and the separate M1 exercise of typing a plain HTML/CSS/JavaScript profile card by hand. The project uses SQLite for its catalog, following P2 rather than P1's `catalog.json` approach.

## Architecture

See the architecture diagram in `README.md`. The intended request path is:

```text
React page → Vite /api proxy → Express route → SQLite table
```
