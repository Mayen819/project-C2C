import dotenv from 'dotenv'
import express from 'express'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import db from './db.js'

dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) })
const app = express()
const port = Number(process.env.PORT) || 3001
app.use(express.json({ limit: '20kb' }))

function toProduct(row) {
  const { price_cents, ...product } = row
  return {
    ...product,
    price: price_cents / 100,
    featured: Boolean(row.featured),
  }
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.get('/api/products', (req, res) => {
  const { category, q, maxPrice } = req.query
  let rows = db.prepare('SELECT * FROM products ORDER BY featured DESC, name ASC').all()
  if (category && category !== 'All')
    rows = rows.filter((p) => p.category.toLowerCase() === String(category).toLowerCase())
  if (q) {
    const query = String(q).trim().toLowerCase()
    rows = rows.filter((p) =>
      `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(query),
    )
  }
  if (maxPrice && Number.isFinite(Number(maxPrice)))
    rows = rows.filter((p) => p.price_cents <= Number(maxPrice) * 100)
  res.json({ products: rows.map(toProduct), count: rows.length })
})
app.get('/api/products/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
  if (!product) return res.status(404).json({ error: 'Product not found.' })
  res.json({ product: toProduct(product) })
})
app.post('/api/orders', (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
  const items = req.body?.items
  if (name.length < 2 || name.length > 80)
    return res.status(400).json({ error: 'Please enter a name between 2 and 80 characters.' })
  if (!Array.isArray(items) || items.length < 1 || items.length > 30)
    return res.status(400).json({ error: 'Your order needs between 1 and 30 items.' })
  if (items.some((item) => typeof item?.productId !== 'string'))
    return res.status(400).json({ error: 'Each item needs a productId.' })
  const find = db.prepare('SELECT id,name,price_cents,inventory FROM products WHERE id = ?')
  const requested = new Map()
  for (const item of items) {
    const quantity = Number(item?.quantity)
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20)
      return res.status(400).json({ error: 'Item quantities must be whole numbers from 1 to 20.' })
    requested.set(item.productId, (requested.get(item.productId) || 0) + quantity)
  }
  const lines = []
  for (const [id, quantity] of requested) {
    const product = find.get(id)
    if (!product)
      return res.status(400).json({ error: 'A product in your cart is no longer available.' })
    if (quantity > product.inventory)
      return res.status(409).json({ error: `${product.name} has only ${product.inventory} left.` })
    lines.push({
      productId: id,
      name: product.name,
      quantity,
      unitPrice: product.price_cents / 100,
    })
  }
  const totalCents = lines.reduce(
    (sum, line) => sum + Math.round(line.unitPrice * 100) * line.quantity,
    0,
  )
  const order = {
    id: randomUUID(),
    customer_name: name,
    items_json: JSON.stringify(lines),
    total_cents: totalCents,
  }
  const save = db.transaction(() => {
    db.prepare(
      'INSERT INTO orders (id, customer_name, items_json, total_cents) VALUES (@id,@customer_name,@items_json,@total_cents)',
    ).run(order)
    const reduce = db.prepare(
      'UPDATE products SET inventory = inventory - ? WHERE id = ? AND inventory >= ?',
    )
    for (const line of lines) {
      const result = reduce.run(line.quantity, line.productId, line.quantity)
      if (result.changes !== 1) throw new Error('Inventory changed; please refresh your cart.')
    }
  })
  try {
    save()
  } catch (error) {
    return res.status(409).json({ error: error.message || 'Could not place your order.' })
  }
  res.status(201).json({
    order: { id: order.id, name, items: lines, total: totalCents / 100, status: 'received' },
    message: 'Your order is in. Thanks for being here.',
  })
})
app.post('/api/messages', (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : ''
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
  if (name.length < 2 || name.length > 80 || message.length < 5 || message.length > 1000)
    return res
      .status(400)
      .json({ error: 'Please add your name and a message between 5 and 1,000 characters.' })
  const result = db.prepare('INSERT INTO messages (name,message) VALUES (?,?)').run(name, message)
  res.status(201).json({
    message: 'Thanks for reaching out. Your note is saved.',
    id: Number(result.lastInsertRowid),
  })
})
app.use((_req, res) => res.status(404).json({ error: 'Route not found.' }))
app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ error: 'Something went wrong. Please try again.' })
})

app.listen(port, '0.0.0.0', () => console.log(`Northstar API listening on ${port}`))
