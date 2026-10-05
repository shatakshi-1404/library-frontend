import { useEffect, useMemo, useState } from 'react'
import { clearToken, hasToken } from './api/client'
import { enqueue, pendingCount } from './db/outbox'
import { makeBook, makeEntry, putBook, putEntry, searchLibrary, tombstoneEntry, updateEntry } from './db/library'
import { getSyncStatus, subscribeSync, sync } from './sync/sync'
import type { LibraryItem, ReadingStatus, SyncStatus } from './types'
import { serverStatus, type BookForm } from './bookForm'
import { applyTheme, getStoredTheme, type Theme } from './theme'
import { AuthScreen } from './components/AuthScreen'
import { BookCard } from './components/BookCard'
import { BookEditor } from './components/BookEditor'
import { BookIcon, CameraIcon, LogOutIcon, MoonIcon, PlusIcon, SearchIcon, SunIcon } from './components/Icons'
import { ScanBook } from './components/ScanBook'
import { SyncBadge } from './components/SyncBadge'
import './App.css'

type Filter = 'all' | ReadingStatus

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'reading', label: 'Reading' },
  { key: 'unread', label: 'Unread' },
  { key: 'finished', label: 'Finished' },
]

function Library() {
  const [items, setItems] = useState<LibraryItem[]>([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [editing, setEditing] = useState<LibraryItem | 'new'>()
  const [scanning, setScanning] = useState(false)
  const [status, setStatus] = useState<SyncStatus>(getSyncStatus())
  const [toast, setToast] = useState('')
  const [theme, setTheme] = useState<Theme>(getStoredTheme)

  async function refresh(nextQuery = query) {
    const [nextItems, pending] = await Promise.all([searchLibrary(nextQuery), pendingCount()])
    setItems(nextItems)
    setStatus((current) => ({ ...current, pending }))
  }

  useEffect(() => {
    void refresh()
    void sync()
    const unsubscribe = subscribeSync(setStatus)
    const reconnect = () => void sync()
    window.addEventListener('online', reconnect)
    return () => {
      unsubscribe()
      window.removeEventListener('online', reconnect)
    }
  }, [])

  // Toasts disappear on their own.
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  async function save(value: BookForm) {
    const creating = editing === 'new'
    if (creating) {
      const book = makeBook(value.title, value.author, { isbn: value.isbn || undefined, coverUrl: value.coverUrl || undefined })
      const entry = {
        ...makeEntry(book.id, value.readingStatus),
        rating: value.rating || undefined,
        notes: value.notes || undefined,
        dateStarted: value.dateStarted || undefined,
        dateFinished: value.dateFinished || undefined,
      }
      await putBook(book)
      await putEntry(entry)
      await enqueue({
        entityType: 'library_entry',
        entityId: entry.id,
        operation: 'create',
        payload: {
          isbn13: book.isbn,
          title: book.title,
          authors: book.author ? [book.author] : [],
          cover_url: book.coverUrl,
          reading_status: serverStatus(entry.readingStatus),
          rating: entry.rating,
          notes: entry.notes,
          date_started: entry.dateStarted,
          date_finished: entry.dateFinished,
        },
      })
    } else if (editing) {
      const entry = await updateEntry(editing.id, {
        readingStatus: value.readingStatus,
        rating: value.rating || undefined,
        notes: value.notes || undefined,
        dateStarted: value.dateStarted || undefined,
        dateFinished: value.dateFinished || undefined,
      })
      const book = {
        ...editing.book,
        title: value.title,
        author: value.author,
        isbn: value.isbn || undefined,
        coverUrl: value.coverUrl || undefined,
        updatedAt: new Date().toISOString(),
      }
      await putBook(book)
      await enqueue({
        entityType: 'library_entry',
        entityId: entry.id,
        operation: 'update',
        payload: {
          reading_status: serverStatus(entry.readingStatus),
          rating: entry.rating,
          notes: entry.notes,
          date_started: entry.dateStarted,
          date_finished: entry.dateFinished,
        },
      })
    }
    setEditing(undefined)
    setToast(creating ? 'Book added to your library' : 'Changes saved')
    await refresh()
  }

  async function remove(item: LibraryItem) {
    if (!window.confirm(`Remove ${item.book.title} from your library?`)) return
    const entry = await tombstoneEntry(item.id)
    await enqueue({ entityType: 'library_entry', entityId: entry.id, operation: 'delete', payload: {} })
    setToast('Removed from your library')
    await refresh()
  }

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }

  const counts = useMemo(() => ({
    all: items.length,
    reading: items.filter((item) => item.readingStatus === 'reading').length,
    unread: items.filter((item) => item.readingStatus === 'unread').length,
    finished: items.filter((item) => item.readingStatus === 'finished').length,
  }), [items])

  const averageRating = useMemo(() => {
    const rated = items.filter((item) => item.rating)
    if (!rated.length) return '-'
    return (rated.reduce((sum, item) => sum + (item.rating ?? 0), 0) / rated.length).toFixed(1)
  }, [items])

  const visible = filter === 'all' ? items : items.filter((item) => item.readingStatus === filter)
  const searching = query.trim().length > 0

  return (
    <div className="shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark"><BookIcon size={20} /></span>
          Library
        </div>
        <div className="header-actions">
          <SyncBadge status={status} onSync={() => void sync()} />
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title="Toggle theme"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => { clearToken(); window.location.reload() }}
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOutIcon />
          </button>
        </div>
      </header>

      <main>
        {scanning ? (
          <ScanBook
            onCancel={() => setScanning(false)}
            onAdded={() => { setScanning(false); setToast('Book added to your library'); void refresh() }}
          />
        ) : (
          <>
            <section className="hero">
              <span className="eyebrow">PERSONAL LIBRARY</span>
              <h1>Your shelf</h1>
              <p className="hero-sub">
                {searching
                  ? `${items.length} ${items.length === 1 ? 'match' : 'matches'} for "${query.trim()}"`
                  : `${items.length} ${items.length === 1 ? 'book' : 'books'}, always with you, even offline.`}
              </p>
              {!searching && items.length > 0 && (
                <div className="stats">
                  <div className="stat"><strong>{counts.all}</strong><span>Books</span></div>
                  <div className="stat"><strong>{counts.reading}</strong><span>Reading now</span></div>
                  <div className="stat"><strong>{counts.finished}</strong><span>Finished</span></div>
                  <div className="stat"><strong>{averageRating}</strong><span>Avg rating</span></div>
                </div>
              )}
            </section>

            <section className="toolbar">
              <label className="search">
                <SearchIcon size={18} />
                <input
                  placeholder="Search title, author, or ISBN"
                  aria-label="Search your library"
                  value={query}
                  onChange={(event) => { setQuery(event.target.value); void refresh(event.target.value) }}
                />
              </label>
              <div className="tabs" role="tablist" aria-label="Filter by reading status">
                {FILTERS.map((entry) => (
                  <button
                    type="button"
                    key={entry.key}
                    role="tab"
                    aria-selected={filter === entry.key}
                    className={`tab ${filter === entry.key ? 'active' : ''}`}
                    onClick={() => setFilter(entry.key)}
                  >
                    {entry.label}<small>{counts[entry.key]}</small>
                  </button>
                ))}
              </div>
              <div className="toolbar-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setScanning(true)}>
                  <CameraIcon size={16} />Add from Photo
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setEditing('new')}>
                  <PlusIcon size={16} />Add manually
                </button>
              </div>
            </section>

            {visible.length === 0 ? (
              <section className="empty">
                <span className="empty-icon"><BookIcon size={30} /></span>
                <h2>{searching || filter !== 'all' ? 'Nothing here' : 'Your shelf is still empty'}</h2>
                <p>
                  {searching
                    ? 'No books match that search.'
                    : filter !== 'all'
                      ? 'No books with that status yet.'
                      : 'Scan a barcode or type in a title to add your first book.'}
                </p>
                {!searching && filter === 'all' && (
                  <div className="empty-actions">
                    <button type="button" className="btn btn-primary" onClick={() => setScanning(true)}>
                      <CameraIcon size={16} />Scan a book
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setEditing('new')}>Add your first book</button>
                  </div>
                )}
              </section>
            ) : (
              <ul className="book-grid">
                {visible.map((item, index) => (
                  <li key={item.id} style={{ animationDelay: `${Math.min(index, 12) * 30}ms` }}>
                    <BookCard item={item} onEdit={() => setEditing(item)} onRemove={() => void remove(item)} />
                  </li>
                ))}
              </ul>
            )}

            {editing && (
              <BookEditor
                item={editing === 'new' ? undefined : editing}
                onSave={save}
                onCancel={() => setEditing(undefined)}
              />
            )}
          </>
        )}
      </main>

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(hasToken())
  return authenticated ? <Library /> : <AuthScreen onAuthenticated={() => setAuthenticated(true)} />
}
