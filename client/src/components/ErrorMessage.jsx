import { ArrowRight } from 'lucide-react'

export function ErrorMessage({ onRetry }) {
  return (
    <div className="notice error-notice">
      <strong>We couldn’t reach the shop just now.</strong>
      <span>Give it another try in a moment.</span>
      <button className="text-link" onClick={onRetry}>
        Try again <ArrowRight size={15} />
      </button>
    </div>
  )
}
