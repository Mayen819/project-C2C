# AI Usage Log

Add an entry for each substantial piece of AI-assisted work. Keep the verification notes factual, and add your own review as you continue the project.

## 1. Build the store

- **Asked:** Build a full-stack store from the pathway guide.
- **Produced:** React/Vite client, Express API, SQLite catalog and records, API contract, README, and project spec.
- **Reviewed or changed:** The server uses database prices and checks inventory. It saves each order and stock update in one transaction.
- **Verified:** The production client build succeeded. Health and filtered product requests worked through the Vite proxy.

## 2. Improve readability

- **Asked:** Make the source easier to read and maintain while keeping the store polished.
- **Produced:** Formatted the code and split shared components, pages, and API helpers into separate files.
- **Reviewed or changed:** Fixed the shop retry behavior and stale request handling. Kept the AI log transparent.
- **Verified:** `npm run format:check`, `npm run build`, and server syntax checks succeeded. A browser screenshot was unavailable in this environment.

## 3. Check pathway requirements and persistence

- **Asked:** Check the remaining pathway requirements and verify order and message persistence.
- **Produced:** Added `PROJECT_SPEC.md` and exercised order and contact API routes with dummy data in a temporary database.
- **Reviewed or changed:** Used a temporary copy so the existing local database and its saved order stayed unchanged.
- **Verified:** Queried the temporary SQLite database. It contained one order and one message, and the order reduced inventory by one.

## 4. Set up Git

- **Asked:** Initialize Git for the project.
- **Produced:** Created a local repository on branch `main`.
- **Reviewed or changed:** No author name or email was configured, so the files remain uncommitted. There is no GitHub remote yet.
- **Verified:** `git status` showed the project files and no commit. `.gitignore` excludes `node_modules` and the local database.

## Still to verify

Order and contact submissions have been checked through the API and database. The full browser click-through and browser console check still need to be done manually.
