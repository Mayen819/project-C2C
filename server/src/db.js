import Database from 'better-sqlite3'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.resolve(here, '../data')
fs.mkdirSync(dataDir, { recursive: true })
const db = new Database(path.join(dataDir, 'northstar.db'))
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    color TEXT NOT NULL,
    featured INTEGER NOT NULL DEFAULT 0,
    inventory INTEGER NOT NULL DEFAULT 0 CHECK (inventory >= 0)
  );
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    items_json TEXT NOT NULL,
    total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
    status TEXT NOT NULL DEFAULT 'received',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`)

const seed = [
  [
    'field-notes',
    'Field Notes Journal',
    'Carry',
    1800,
    'A pocket notebook with 160 pages of recycled paper and a binding that stays open on the table.',
    'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=85',
    'Clay',
    1,
    32,
  ],
  [
    'trail-bottle',
    'Trail Bottle',
    'Hydration',
    3200,
    'An insulated steel bottle for hot coffee, cold water, and the drive between the two.',
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85',
    'Pine',
    1,
    18,
  ],
  [
    'daypack',
    'Everyday Daypack',
    'Carry',
    7800,
    'A light shell, roomy main compartment, and outside bottle pocket. Enough for a day out.',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
    'Moss',
    1,
    9,
  ],
  [
    'camp-mug',
    'Enamel Camp Mug',
    'Kitchen',
    2400,
    'A classic enamel mug for the kitchen shelf, the campsite, and coffee by the car.',
    'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85',
    'Cream',
    0,
    24,
  ],
  [
    'wool-cap',
    'Ridge Wool Cap',
    'Apparel',
    4600,
    'A soft wool blend with a low profile, made for chilly mornings and bad hair days.',
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=85',
    'Rust',
    0,
    15,
  ],
  [
    'utility-tote',
    'Utility Tote',
    'Carry',
    3800,
    'A canvas carryall with reinforced handles and enough room for a market run or a beach towel.',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85',
    'Natural',
    0,
    21,
  ],
  [
    'sunrise-prints',
    'Sunrise Print Set',
    'Home',
    2800,
    'Three small prints in warm sunrise colors, sized for a desk, shelf, or gallery wall.',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=85',
    'Ochre',
    0,
    40,
  ],
  [
    'field-socks',
    'Field Wool Socks',
    'Apparel',
    2200,
    'Merino-blend socks with a cushioned sole and a breathable knit for long walks.',
    'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=900&q=85',
    'Olive',
    0,
    27,
  ],
]
const insert = db.prepare(
  'INSERT OR IGNORE INTO products (id,name,category,price_cents,description,image_url,color,featured,inventory) VALUES (?,?,?,?,?,?,?,?,?)',
)
const seedAll = db.transaction((rows) => rows.forEach((row) => insert.run(...row)))
seedAll(seed)

export default db
