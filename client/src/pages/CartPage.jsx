import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag } from 'lucide-react'
import { api, money } from '../lib/store.js'

export function Cart({ cart, update, remove, clear }) {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  async function checkout(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const result = await api('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          name,
          items: cart.map(({ id, quantity }) => ({ productId: id, quantity })),
        }),
      })
      clear()
      navigate(`/order/${result.order.id}`, { state: result.order })
    } catch (e) {
      setError(e.message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <main className="page-wrap wrap">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Your bag</span>
      </div>
      <div className="cart-heading">
        <div className="eyebrow">
          <span /> GOOD THINGS, COMING YOUR WAY
        </div>
        <h1>
          Your bag<span className="cart-count">({cart.reduce((s, i) => s + i.quantity, 0)})</span>
        </h1>
      </div>
      {cart.length === 0 ? (
        <div className="empty-state cart-empty">
          <ShoppingBag />
          <h3>Your bag is empty for now.</h3>
          <p>Add something from the shop and it’ll show up here.</p>
          <Link to="/shop" className="button button-dark">
            Explore the collection <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-items">
            {cart.map((item) => (
              <article className="cart-row" key={item.id}>
                <Link to={`/product/${item.id}`} className="cart-thumb">
                  <img src={item.image_url} alt={item.name} />
                </Link>
                <div className="cart-item-info">
                  <Link to={`/product/${item.id}`} className="product-name">
                    {item.name}
                  </Link>
                  <span>
                    {item.color} · {money(item.price)}
                  </span>
                  <button className="remove-link" onClick={() => remove(item.id)}>
                    Remove
                  </button>
                </div>
                <div className="quantity">
                  <button aria-label="Decrease quantity" onClick={() => update(item.id, -1)}>
                    <Minus size={14} />
                  </button>
                  <span>{item.quantity}</span>
                  <button aria-label="Increase quantity" onClick={() => update(item.id, 1)}>
                    <Plus size={14} />
                  </button>
                </div>
                <strong className="cart-line-total">{money(item.price * item.quantity)}</strong>
              </article>
            ))}
          </section>
          <aside className="order-summary">
            <div className="eyebrow">
              <span /> YOUR ORDER
            </div>
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{money(subtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{subtotal >= 75 ? 'On us' : 'Calculated at checkout'}</span>
            </div>
            <p className="checkout-note">
              {subtotal < 75
                ? `You’re ${money(75 - subtotal)} away from free shipping.`
                : 'You’ve unlocked free shipping. Nice.'}
            </p>
            <form onSubmit={checkout} className="checkout-form">
              <label htmlFor="customer-name">Your name</label>
              <input
                id="customer-name"
                required
                minLength="2"
                maxLength="80"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should we call you?"
              />
              <p className="demo-note">Demo checkout — no payment details collected.</p>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <button className="button button-dark full-button" disabled={busy}>
                {busy ? 'Placing your order…' : 'Place demo order'} <ArrowRight size={16} />
              </button>
            </form>
            <div className="secure-note">
              <ShieldCheck size={16} /> Just a name and your selected items.
            </div>
          </aside>
        </div>
      )}
    </main>
  )
}
