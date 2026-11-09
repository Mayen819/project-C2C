import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { money } from '../lib/store.js'

export function OrderConfirmation() {
  const location = useLocation()
  const order = location.state
  return (
    <main className="page-wrap wrap">
      <div className="order-confirm">
        <div className="confirm-icon">
          <Check />
        </div>
        <div className="eyebrow">
          <span /> ORDER RECEIVED
        </div>
        <h1>
          Well, this is
          <br />
          <em>the good part.</em>
        </h1>
        <p>
          Thanks{order?.name ? `, ${order.name}` : ''}. Your demo order is saved. No payment was
          taken.
        </p>
        {order && (
          <div className="confirmation-summary">
            <strong>Order {order.id.slice(0, 8).toUpperCase()}</strong>
            {order.items.map((i) => (
              <div key={i.productId}>
                <span>
                  {i.quantity} × {i.name}
                </span>
                <span>{money(i.unitPrice * i.quantity)}</span>
              </div>
            ))}
            <div className="summary-total">
              <strong>Total</strong>
              <strong>{money(order.total)}</strong>
            </div>
          </div>
        )}
        <Link to="/shop" className="button button-dark">
          Keep wandering <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  )
}
