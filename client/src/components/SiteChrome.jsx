import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Compass, Heart, Menu, Search, ShoppingBag, X } from 'lucide-react'

export function Header({ count, savedCount = 0 }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => setOpen(false), [location])
  return (
    <>
      <div className="announcement">
        Free shipping on orders over $75 <span>— packed with care, sent your way</span>
      </div>
      <header className="header wrap">
        <button
          className="icon-btn mobile-menu"
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <Link to="/" className="wordmark">
          <span className="mark">
            <Compass size={21} />
          </span>
          <span>
            NORTHSTAR<span className="wordmark-small">SUPPLY CO.</span>
          </span>
        </Link>
        <nav className={open ? 'nav nav-open' : 'nav'}>
          <NavLink to="/shop">Shop all</NavLink>
          <a href="/#story">Our story</a>
          <a href="/#journal">Field notes</a>
        </nav>
        <div className="header-actions">
          <button
            className="icon-btn search-trigger"
            aria-label="Search products"
            onClick={() => {
              location.pathname === '/shop'
                ? document.querySelector('#catalog-search')?.focus()
                : navigate('/shop')
            }}
          >
            <Search />
          </button>
          <Link to="/saved" className="saved-link" aria-label={`Saved items, ${savedCount}`}>
            <Heart size={18} /> <span>Saved</span>
            {savedCount > 0 && <b>{savedCount}</b>}
          </Link>
          <Link to="/cart" className="bag-link">
            <ShoppingBag size={19} />
            <span>Bag</span>
            <b>{count}</b>
          </Link>
        </div>
      </header>
    </>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-top">
        <div>
          <Link to="/" className="wordmark footer-brand">
            <span className="mark">
              <Compass size={21} />
            </span>
            <span>
              NORTHSTAR<span className="wordmark-small">SUPPLY CO.</span>
            </span>
          </Link>
          <p>Useful things for weekends outside and the days in between.</p>
        </div>
        <div className="footer-links">
          <div>
            <strong>Explore</strong>
            <Link to="/shop">Shop all</Link>
            <a href="/#story">Our story</a>
            <a href="/#journal">Field notes</a>
          </div>
          <div>
            <strong>Here to help</strong>
            <Link to="/contact">Contact us</Link>
            <Link to="/contact">Shipping questions</Link>
            <Link to="/contact">Product questions</Link>
          </div>
          <div>
            <strong>Stay in the loop</strong>
            <p>Good things, occasionally.</p>
            <Link className="footer-underline" to="/contact">
              Say hello <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© Northstar Supply Co.</span>
        <span>Considered goods. Less, but better.</span>
        <span>Made for the long way round&nbsp; ↗</span>
      </div>
    </footer>
  )
}
