import { useState, type CSSProperties } from 'react'
import type { LibraryItem, ReadingStatus } from '../types'
import { PencilIcon, TrashIcon } from './Icons'
import { StarRating } from './StarRating'

const STATUS_LABEL: Record<ReadingStatus, string> = {
  unread: 'Unread',
  reading: 'Reading',
  finished: 'Finished',
}

/** Same title always gets the same colour, so books without a cover still look distinct. */
function hueFor(text: string): number {
  let hash = 0
  for (const char of text) hash = (hash * 31 + (char.codePointAt(0) ?? 0)) % 360
  return hash
}

interface BookCardProps {
  item: LibraryItem
  onEdit: () => void
  onRemove: () => void
}

export function BookCard({ item, onEdit, onRemove }: BookCardProps) {
  const { book } = item
  const [coverFailed, setCoverFailed] = useState(false)
  const showImage = Boolean(book.coverUrl) && !coverFailed

  return (
    <article className="book-card">
      <div className="cover" style={{ '--hue': hueFor(book.title) } as CSSProperties}>
        {showImage ? (
          <img src={book.coverUrl} alt="" loading="lazy" onError={() => setCoverFailed(true)} />
        ) : (
          <span className="cover-fallback">
            <span className="cover-title">{book.title}</span>
            <span className="cover-author">{book.author}</span>
          </span>
        )}
        <span className={`chip ${item.readingStatus}`}>{STATUS_LABEL[item.readingStatus]}</span>
        <div className="card-actions">
          <button type="button" className="icon-btn" onClick={onEdit} aria-label={`Edit ${book.title}`} title="Edit">
            <PencilIcon size={16} />
          </button>
          <button type="button" className="icon-btn danger" onClick={onRemove} aria-label={`Remove ${book.title}`} title="Remove">
            <TrashIcon size={16} />
          </button>
        </div>
      </div>
      <div className="card-body">
        <h3 title={book.title}>{book.title}</h3>
        <p className="author">{book.author || 'Unknown author'}</p>
        <StarRating value={item.rating ?? 0} size={14} />
      </div>
    </article>
  )
}
