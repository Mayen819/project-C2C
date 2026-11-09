import { Link } from 'react-router-dom'
import { Heart, Plus } from 'lucide-react'
import { money } from '../lib/store.js'

export function ProductCard({ product, onAdd, isSaved = false, onToggleSaved = () => {} }) {
  return (
    <article className="product-card">
      <div className="product-image">
        <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
          <img src={product.image_url} alt={product.name} loading="lazy" />
        </Link>
        <span className="image-tag">
          {product.featured ? 'FIELD FAVORITE' : product.category.toUpperCase()}
        </span>
        <button
          className={isSaved ? 'save-product saved' : 'save-product'}
          onClick={() => onToggleSaved(product)}
          aria-label={isSaved ? `Remove ${product.name} from saved items` : `Save ${product.name}`}
          aria-pressed={isSaved}
        >
          <Heart size={17} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
        <button
          className="quick-add"
          onClick={() => onAdd(product)}
          aria-label={`Add ${product.name} to bag`}
        >
          <Plus size={18} />
        </button>
      </div>
      <div className="product-meta">
        <div>
          <Link to={`/product/${product.id}`} className="product-name">
            {product.name}
          </Link>
          <p>
            {product.color} · {product.category}
          </p>
        </div>
        <span className="price">{money(product.price)}</span>
      </div>
    </article>
  )
}
