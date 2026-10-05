import type { SyncStatus } from '../types'
import { RefreshIcon } from './Icons'

interface SyncBadgeProps {
  status: SyncStatus
  onSync: () => void
}

export function SyncBadge({ status, onSync }: SyncBadgeProps) {
  const label =
    status.state === 'offline' ? 'Offline'
    : status.state === 'syncing' ? 'Syncing'
    : status.state === 'error' ? 'Sync error'
    : status.pending ? `${status.pending} pending`
    : 'Online / synced'

  return (
    <div className={`sync-badge ${status.state}`} role="status" aria-live="polite">
      <span className="dot" />
      <span className="sync-label">{label}</span>
      <button
        type="button"
        className="icon-btn"
        onClick={onSync}
        disabled={status.state === 'syncing'}
        aria-label="Sync now"
        title="Sync now"
      >
        <RefreshIcon size={16} className={status.state === 'syncing' ? 'spin' : ''} />
      </button>
    </div>
  )
}
