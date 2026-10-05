import { StarIcon } from './Icons'

interface StarRatingProps {
  value: number
  /** When provided the stars become clickable; clicking the current value clears it. */
  onChange?: (value: number) => void
  size?: number
}

const STARS = [1, 2, 3, 4, 5]

export function StarRating({ value, onChange, size = 16 }: StarRatingProps) {
  if (!onChange) {
    return (
      <span className="stars" role="img" aria-label={value ? `${value} out of 5` : 'Not rated'}>
        {STARS.map((n) => (
          <StarIcon key={n} size={size} className={n <= value ? 'on' : ''} fill={n <= value ? 'currentColor' : 'none'} />
        ))}
      </span>
    )
  }

  return (
    <div className="stars input" role="radiogroup" aria-label="Rating">
      {STARS.map((n) => (
        <button
          type="button"
          key={n}
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className={n <= value ? 'on' : ''}
          onClick={() => onChange(value === n ? 0 : n)}
        >
          <StarIcon size={size} fill={n <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  )
}
