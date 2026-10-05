import type { ReadingStatus } from './types'

export type BookForm = {
  title: string
  author: string
  isbn: string
  coverUrl: string
  readingStatus: ReadingStatus
  rating: number
  notes: string
  dateStarted: string
  dateFinished: string
}

/** The backend calls "finished" books "read". */
export const serverStatus = (status: ReadingStatus): 'unread' | 'reading' | 'read' =>
  status === 'finished' ? 'read' : status
