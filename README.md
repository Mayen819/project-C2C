# Northstar Supply Co.

A complete, responsive storefront built with React + Vite, an Express API, and SQLite. Browse the catalog, search and filter products, add goods to a persistent bag, place a demo order, and send a message. Orders and messages are saved in the local database. Checkout asks for a name only. It never collects payment details.

## Run it locally or in Codespaces

You need Node.js 20.19+ or 22.12+ and npm. In GitHub Codespaces, open the repository in a Codespace; no local database installation is needed.

```sh
npm install
npm run dev
```

Open the Vite forwarded port (usually 5173). The API runs on port 3001. Vite proxies `/api` requests to Express, so the browser uses one origin and the API port can stay private in Codespaces. To check the API, open `/api/health` on the Vite origin or request it from the browser console. The API process is intentionally started without recursive file watching for compatibility with browser IDEs that impose low file-watcher limits; restart the API terminal after server code changes. Vite still hot-reloads the client.

To create a production front-end bundle, run `npm run build`. To run the API without the dev watchers, run `npm start`. The SQLite file is created and seeded at `server/data/northstar.db` the first time the server starts. It is ignored by Git so each developer gets their own local data. Sample catalog records are inserted only when their IDs are missing.

Optional configuration: copy `.env.example` to `.env` and set `PORT` to change the API port. Vite uses the same value for its proxy. Never commit `.env` or live secrets. Run `npm run format` to format the source, or `npm run format:check` to check it.

## What’s included

- Home page, shop, category filters, live search, product detail pages, responsive navigation, and contact page.
- Accessible loading, empty, and error states; labels and feedback for forms; reduced-motion support.
- Cart with add/remove/quantity controls, totals, and local browser persistence.
- Demo checkout that validates current inventory, saves an order transactionally, and decrements stock. It does not accept payment details.
- SQLite products, orders, and messages tables, with a small starter catalog.
- Custom product detail endpoint, price filter, health endpoint, and contact-message endpoint.
- `CONTRACT.md` describes the API; `AI_LOG.md` records AI-assisted work; this README includes the architecture and acceptance checklist.
- `PROJECT_SPEC.md` records the P2 problem, users, inputs, outputs, and numbered acceptance criteria.

## Architecture

```text
React pages (Home / Shop / Product / Bag / Contact)
                │ fetch /api/* (same origin)
                ▼
       Vite dev proxy ───────────────┐
                                     ▼
                            Express JSON API
                         ┌───────────┴───────────┐
                         ▼                       ▼
                SQLite products           SQLite orders
                                          SQLite messages
```

Client code lives in `client/`; API and database code live in `server/`. The API recalculates order totals from database prices, validates quantities and current stock, and commits order creation and inventory updates in a single SQLite transaction. The cart is saved in localStorage; the catalog and submitted orders/messages are read from or written to SQLite.

## Acceptance checklist

1. `npm run dev` starts the client and API; the home page loads catalog data and the browser console has no application errors.
2. Shop navigation, filters, search, product details, bag, contact, and order confirmation work without full-page reloads.
3. Catalog cards are generated from SQLite rows. Add/edit a product row and it appears without editing React components.
4. Add, remove, and quantity controls update the bag and correct total; the bag survives a refresh.
5. A demo order saves to SQLite, validates stock on the server, and remains in the database after refresh. Inventory decreases only after a valid order.
6. A contact note is saved to SQLite; invalid name/message input returns a helpful error.
7. API errors, loading, and empty states are shown to the user. No secrets, payment data, phone numbers, addresses, or birthdates are collected.
8. API request and response shapes match `CONTRACT.md`; `npm run build` creates the production client bundle.

For a guided manual review: open the shop, filter to Carry, search “journal”, add a product, reload, change its quantity, place a demo order with a name, then send a contact note. The guide's acceptance criteria can be checked against those paths. To inspect persistence, open `server/data/northstar.db` in a SQLite viewer and query `products`, `orders`, or `messages`.

## Structure

```text
client/                 React/Vite application
  src/App.jsx           routes, cart state, and shared layout
  src/components/       navigation, footer, product cards, feedback
  src/pages/            catalog, product, cart, contact, confirmation
  src/lib/store.js      shared API and currency helpers
  src/styles.css        responsive storefront design
server/
  src/index.js           Express routes and validation
  src/db.js              SQLite schema and seed catalog
  data/northstar.db      created on first server start (gitignored)
CONTRACT.md              API contract
PROJECT_SPEC.md          P2 project spec and acceptance criteria
AI_LOG.md                AI usage record
```

## Scope

This is a learning/demo storefront. It intentionally does not process payments, collect account credentials, or claim to ship real orders. Use made-up names and demo messages only if you expose it publicly; take down a public deployment when the course ends. A production store would need payment processing, authentication and authorization, operational email, deployment secrets, stronger abuse controls, and legal/fulfillment review before accepting real customers.
