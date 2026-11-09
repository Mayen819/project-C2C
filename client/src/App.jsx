import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { ArrowRight, Check, Compass, Heart } from 'lucide-react'
import { Footer, Header } from './components/SiteChrome.jsx'
import { Cart } from './pages/CartPage.jsx'
import { Contact } from './pages/ContactPage.jsx'
import { OrderConfirmation } from './pages/OrderConfirmation.jsx'
import { Home, ProductDetail, Shop } from './pages/StorePages.jsx'

function App() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('northstar-cart') || '[]')
    } catch {
      return []
    }
  })
  useEffect(() => localStorage.setItem('northstar-cart', JSON.stringify(cart)), [cart])
  const toastTimer = useRef(null)
  useEffect(() => () => window.clearTimeout(toastTimer.current), [])
  const count = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart])
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('northstar-saved') || '[]')
    } catch {
      return []
    }
  })
  useEffect(() => localStorage.setItem('northstar-saved', JSON.stringify(saved)), [saved])
  function toggleSaved(product) {
    setSaved((items) =>
      items.some((item) => item.id === product.id)
        ? items.filter((item) => item.id !== product.id)
        : [...items, { id: product.id, name: product.name }],
    )
  }
  function add(product) {
    setCart((current) => {
      const found = current.find((i) => i.id === product.id)
      if (found)
        return current.map((i) =>
          i.id === product.id ? { ...i, quantity: Math.min(i.quantity + 1, 20) } : i,
        )
      return [...current, { ...product, quantity: 1 }]
    })
  }
  function update(id, delta) {
    setCart((current) =>
      current
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0 && i.quantity <= 20),
    )
  }
  const [toast, setToast] = useState('')
  function addWithToast(product) {
    add(product)
    setToast(`${product.name} added to your bag`)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(''), 2400)
  }
  return (
    <>
      <Header count={count} savedCount={saved.length} />
      <Routes>
        <Route
          path="/"
          element={<Home add={addWithToast} saved={saved} toggleSaved={toggleSaved} />}
        />
        <Route
          path="/shop"
          element={<Shop add={addWithToast} saved={saved} toggleSaved={toggleSaved} />}
        />
        <Route
          path="/saved"
          element={<Shop add={addWithToast} saved={saved} toggleSaved={toggleSaved} savedOnly />}
        />
        <Route
          path="/product/:id"
          element={<ProductDetail add={addWithToast} saved={saved} toggleSaved={toggleSaved} />}
        />
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              update={update}
              remove={(id) => setCart((c) => c.filter((i) => i.id !== id))}
              clear={() => setCart([])}
            />
          }
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/order/:id" element={<OrderConfirmation />} />
        <Route
          path="*"
          element={
            <main className="page-wrap wrap empty-state">
              <Compass />
              <h3>We can’t find that page.</h3>
              <Link to="/" className="text-link">
                Head back to the trail <ArrowRight size={16} />
              </Link>
            </main>
          }
        />
      </Routes>
      <Footer />
      {toast && (
        <div className="toast" role="status">
          <Check size={17} />
          {toast}
          <Link to="/cart">
            View bag <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </>
  )
}

export default App
