import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Compass,
  Heart,
  Leaf,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { api, money } from '../lib/store.js'
import { ErrorMessage } from '../components/ErrorMessage.jsx'
import { ProductCard } from '../components/ProductCard.jsx'

export function Home({ add, saved = [], toggleSaved = () => {} }) {
  const [products, setProducts] = useState([])
  const [loadState, setLoadState] = useState('loading')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoadState('loading')

    api('/api/products', { signal: controller.signal })
      .then(({ products }) => {
        setProducts(products)
        setLoadState('ready')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setLoadState('error')
      })

    return () => controller.abort()
  }, [refreshKey])
  return (
    <main>
      <section className="hero">
        <img
          className="hero-bg"
          src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2200&q=90"
          alt="Sunrise over a quiet mountain lake"
        />
        <div className="hero-overlay" />
        <div className="wrap hero-inner">
          <div className="eyebrow light">
            <span /> GOODS FOR THE GREAT OUTSIDE
          </div>
          <h1>
            A little more
            <br />
            <em>outside.</em>
          </h1>
          <p>
            Useful gear for early starts,
            <br />
            weekend miles, and slower mornings.
          </p>
          <Link to="/shop" className="button button-light">
            Explore the collection <ArrowRight size={17} />
          </Link>
          <div className="hero-bottom">
            <span>PACK LIGHT. STAY AWHILE.</span>
            <span>45°31′N&nbsp; 122°40′W</span>
          </div>
        </div>
      </section>
      <section className="ticker">
        <div>
          FIELD-TESTED FAVORITES <span>✳</span> EVERYDAY GOODS <span>✳</span> PACK LIGHT, STAY
          AWHILE <span>✳</span> FIELD-TESTED FAVORITES <span>✳</span> EVERYDAY GOODS <span>✳</span>
        </div>
      </section>
      <section className="section wrap collection">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span /> THE GOOD STUFF
            </div>
            <h2>A few things we take along.</h2>
          </div>
          <Link to="/shop" className="text-link">
            Shop the collection <ArrowRight size={16} />
          </Link>
        </div>
        <div className="product-grid">
          {loadState === 'loading' ? (
            <p className="full-message">Finding the good stuff…</p>
          ) : loadState === 'error' ? (
            <ErrorMessage onRetry={() => setRefreshKey((key) => key + 1)} />
          ) : (
            products
              .slice(0, 4)
              .map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAdd={add}
                  isSaved={saved.some((item) => item.id === p.id)}
                  onToggleSaved={toggleSaved}
                />
              ))
          )}
        </div>
      </section>
      <section className="manifesto" id="story">
        <div className="manifesto-image">
          <img
            src="https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1300&q=85"
            alt="Deer in a sunlit forest"
            loading="lazy"
          />
        </div>
        <div className="manifesto-copy">
          <div className="eyebrow">
            <span /> WHY WE STARTED
          </div>
          <h2>
            Less noise.
            <br />
            <em>More outside.</em>
          </h2>
          <p>
            Northstar started with a simple idea: make a short list of everyday gear we would
            actually use, take care of it, and keep it for a long time.
          </p>
          <Link to="/contact" className="text-link">
            Get in touch <ArrowRight size={16} />
          </Link>
          <div className="manifesto-stamp">
            <Leaf size={19} />
            <span>
              KEEP IT
              <br />
              FOR YEARS
            </span>
          </div>
        </div>
      </section>
      <section className="values wrap">
        <div className="value-card">
          <Leaf />
          <div>
            <strong>Thoughtfully made</strong>
            <span>Picked for the job they need to do.</span>
          </div>
        </div>
        <div className="value-card">
          <ShieldCheck />
          <div>
            <strong>Made to go again</strong>
            <span>Repairable, reusable, ready to go.</span>
          </div>
        </div>
        <div className="value-card">
          <Sparkles />
          <div>
            <strong>Only the good stuff</strong>
            <span>A small edit of useful gear.</span>
          </div>
        </div>
      </section>
      <section className="journal" id="journal">
        <div className="wrap journal-inner">
          <div>
            <div className="eyebrow light">
              <span /> A NOTE FOR THE WEEKEND
            </div>
            <h2>
              Take the
              <br />
              <em>long way.</em>
            </h2>
          </div>
          <div className="journal-right">
            <p>
              A few ideas for making more room in the week for a walk, a good cup of coffee, or
              nowhere in particular.
            </p>
            <Link to="/shop" className="button button-outline">
              Browse the collection <ArrowDownRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export function Shop({ add, saved = [], toggleSaved = () => {}, savedOnly = false }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('featured')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')

    api(`/api/products?category=${encodeURIComponent(category)}&q=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    })
      .then(({ products }) => setProducts(products))
      .catch((error) => {
        if (error.name !== 'AbortError') setError(error.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [category, query, refreshKey])
  const categories = ['All', 'Carry', 'Hydration', 'Kitchen', 'Apparel', 'Home']
  const visibleProducts = products
    .filter((product) => !savedOnly || saved.some((item) => item.id === product.id))
    .slice()
    .sort((a, b) =>
      sort === 'price-low'
        ? a.price - b.price
        : sort === 'price-high'
          ? b.price - a.price
          : sort === 'name'
            ? a.name.localeCompare(b.name)
            : 0,
    )
  return (
    <main className="page-wrap">
      <div className="wrap">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{savedOnly ? 'Saved items' : 'Shop all'}</span>
        </div>
        <div className="shop-title">
          <div>
            <div className="eyebrow">
              <span /> {savedOnly ? 'YOUR FIELD NOTES' : 'THE NORTHSTAR EDIT'}
            </div>
            <h1>
              {savedOnly ? (
                <>
                  Your saved,
                  <br />
                </>
              ) : (
                <>
                  Good things,
                  <br />
                </>
              )}
              <em>{savedOnly ? 'for later.' : 'for out there.'}</em>
            </h1>
          </div>
          <p>
            {savedOnly
              ? 'A handy shortlist of the things you want to come back to.'
              : 'Packs, bottles, and small useful things for day trips, camp coffee, and the ride home.'}
          </p>
        </div>
        <div className="shop-tools">
          <div className="filters">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={category === c ? 'filter active' : 'filter'}
              >
                {c}
              </button>
            ))}
          </div>
          <label className="sort-control">
            SORT
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="name">Name</option>
            </select>
          </label>
          <label className="searchbox">
            <Search size={17} />
            <input
              id="catalog-search"
              placeholder="Find your thing…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span>{visibleProducts.length} GOODS</span>
          </label>
        </div>
        {error ? (
          <ErrorMessage onRetry={() => setRefreshKey((key) => key + 1)} />
        ) : loading ? (
          <div className="loading-state">Gathering the good stuff…</div>
        ) : visibleProducts.length ? (
          <div className="product-grid shop-grid">
            {visibleProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdd={add}
                isSaved={saved.some((item) => item.id === p.id)}
                onToggleSaved={toggleSaved}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Compass />
            <h3>
              {savedOnly
                ? 'Your shortlist is ready for a first pick.'
                : 'Nothing matched that search.'}
            </h3>
            <p>
              {savedOnly
                ? 'Tap the heart on anything you like and it will be waiting here.'
                : 'Try another search or category.'}
            </p>
            {savedOnly ? (
              <Link to="/shop" className="text-link">
                Browse the shop <ArrowRight size={15} />
              </Link>
            ) : (
              <button
                className="text-link"
                onClick={() => {
                  setQuery('')
                  setCategory('All')
                }}
              >
                Clear filters <ArrowRight size={15} />
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

export function ProductDetail({ add, saved = [], toggleSaved = () => {} }) {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    setProduct(null)
    setError('')

    api(`/api/products/${id}`, { signal: controller.signal })
      .then(({ product }) => setProduct(product))
      .catch((error) => {
        if (error.name !== 'AbortError') setError(error.message)
      })
    return () => controller.abort()
  }, [id])
  if (error)
    return (
      <main className="page-wrap wrap">
        <div className="breadcrumb">
          <Link to="/shop">Shop</Link>
          <span>/</span>
          <span>Not found</span>
        </div>
        <div className="empty-state">
          <Compass />
          <h3>We couldn’t find that product.</h3>
          <Link to="/shop" className="text-link">
            Back to the shop <ArrowRight size={15} />
          </Link>
        </div>
      </main>
    )
  if (!product)
    return (
      <main className="page-wrap wrap">
        <div className="loading-state">Finding your thing…</div>
      </main>
    )
  return (
    <main className="page-wrap wrap">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>
      <div className="detail">
        <div className="detail-image">
          <img src={product.image_url} alt={product.name} />
        </div>
        <div className="detail-info">
          <div className="eyebrow">
            <span /> {product.category.toUpperCase()} · {product.color.toUpperCase()}
          </div>
          <h1>{product.name}</h1>
          <div className="detail-price">{money(product.price)}</div>
          <button
            className={
              saved.some((item) => item.id === product.id) ? 'save-detail saved' : 'save-detail'
            }
            onClick={() => toggleSaved(product)}
            aria-pressed={saved.some((item) => item.id === product.id)}
          >
            <Heart
              size={17}
              fill={saved.some((item) => item.id === product.id) ? 'currentColor' : 'none'}
            />
            {saved.some((item) => item.id === product.id) ? 'Saved for later' : 'Save for later'}
          </button>
          <p>{product.description}</p>
          <p className="stock">
            <span />{' '}
            {product.inventory > 0 ? 'In stock and ready to roam' : 'Currently out of stock'}
          </p>
          <button
            disabled={!product.inventory}
            className="button button-dark full-button"
            onClick={() => add(product)}
          >
            Add to bag <Plus size={17} />
          </button>
          <div className="detail-promise">
            <span>
              <Leaf size={17} /> Thoughtfully made
            </span>
            <span>
              <ShieldCheck size={17} /> Built to last
            </span>
          </div>
          <Link to="/shop" className="text-link">
            <ArrowLeft size={15} /> Back to the shop
          </Link>
        </div>
      </div>
    </main>
  )
}
