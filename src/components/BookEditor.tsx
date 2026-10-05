import { useEffect, useId, useState } from 'react'
import type { BookForm } from '../bookForm'
import type { LibraryItem, ReadingStatus } from '../types'
import { XIcon } from './Icons'
import { StarRating } from './StarRating'

const STATUSES: { value: ReadingStatus; label: string }[] = [
  { value: 'unread', label: 'Unread' },
  { value: 'reading', label: 'Reading' },
  { value: 'finished', label: 'Finished' },
]

interface BookEditorProps {
  item?: LibraryItem
  onSave: (value: BookForm) => void
  onCancel: () => void
}

export function BookEditor({ item, onSave, onCancel }: BookEditorProps) {
  const headingId = useId()
  // Title, author, ISBN and cover are fixed once a book exists; only your reading details change.
  const locked = Boolean(item)
  const [form, setForm] = useState<BookForm>({
    title: item?.book.title ?? '',
    author: item?.book.author ?? '',
    isbn: item?.book.isbn ?? '',
    coverUrl: item?.book.coverUrl ?? '',
    readingStatus: item?.readingStatus ?? 'unread',
    rating: item?.rating ?? 0,
    notes: item?.notes ?? '',
    dateStarted: item?.dateStarted ?? '',
    dateFinished: item?.dateFinished ?? '',
  })

  function update<K extends keyof BookForm>(key: K, value: BookForm[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel])

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel() }}>
      <form
        className="editor"
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        onSubmit={(event) => { event.preventDefault(); onSave(form) }}
      >
        <div className="panel-head">
          <div>
            <span className="eyebrow">{item ? 'EDIT ENTRY' : 'NEW ENTRY'}</span>
            <h2 id={headingId}>{item ? item.book.title : 'Add a book'}</h2>
          </div>
          <button type="button" className="icon-btn" onClick={onCancel} aria-label="Close">
            <XIcon />
          </button>
        </div>

        <label className="field">
          <span>Title</span>
          <input value={form.title} onChange={(event) => update('title', event.target.value)} required autoFocus={!locked} readOnly={locked} />
        </label>
        <label className="field">
          <span>Author</span>
          <input value={form.author} onChange={(event) => update('author', event.target.value)} required readOnly={locked} />
        </label>
        <div className="field-row">
          <label className="field">
            <span>ISBN</span>
            <input value={form.isbn} onChange={(event) => update('isbn', event.target.value)} readOnly={locked} />
          </label>
          <label className="field">
            <span>Cover URL</span>
            <input value={form.coverUrl} onChange={(event) => update('coverUrl', event.target.value)} readOnly={locked} />
          </label>
        </div>
        {locked && <p className="hint">Title, author, ISBN and cover are set when a book is added.</p>}

        <div className="field">
          <span>Status</span>
          <div className="segmented" role="radiogroup" aria-label="Reading status">
            {STATUSES.map((status) => (
              <button
                type="button"
                key={status.value}
                role="radio"
                aria-checked={form.readingStatus === status.value}
                className={form.readingStatus === status.value ? 'active' : ''}
                onClick={() => update('readingStatus', status.value)}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <span>Rating</span>
          <StarRating value={form.rating} onChange={(value) => update('rating', value)} size={26} />
        </div>

        <div className="field-row">
          <label className="field">
            <span>Started</span>
            <input type="date" value={form.dateStarted} onChange={(event) => update('dateStarted', event.target.value)} />
          </label>
          <label className="field">
            <span>Finished</span>
            <input type="date" value={form.dateFinished} onChange={(event) => update('dateFinished', event.target.value)} />
          </label>
        </div>

        <label className="field">
          <span>Notes</span>
          <textarea value={form.notes} onChange={(event) => update('notes', event.target.value)} rows={2} />
        </label>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary">{item ? 'Save changes' : 'Add to library'}</button>
        </div>
      </form>
    </div>
  )
}
