export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'library-theme'

/** Saved choice if there is one, otherwise follow the operating system. */
export function getStoredTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    /* storage can be blocked (private mode); fall through to the OS setting */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Call once before the first render so the page never flashes the wrong theme. */
export function initTheme(): void {
  document.documentElement.dataset.theme = getStoredTheme()
}

/** Call when the user presses the toggle; this one is remembered. */
export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* ignore */
  }
}
