import { useState, type CSSProperties, type FormEvent } from 'react'
import { login, register } from '../api/auth'
import { BookIcon, EyeIcon, EyeOffIcon } from './Icons'

const SPINES = [
  { height: 64, hue: 12 },
  { height: 82, hue: 150 },
  { height: 56, hue: 38 },
  { height: 92, hue: 200 },
  { height: 70, hue: 340 },
  { height: 78, hue: 95 },
  { height: 60, hue: 24 },
]

export function AuthScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const registering = mode === 'register'

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (registering) await register(identifier, password)
      else await login(identifier, password)
      onAuthenticated()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to authenticate')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-shell">
      <aside className="auth-aside">
        <div className="brand">
          <span className="brand-mark"><BookIcon size={20} /></span>
          Library
        </div>
        <div className="aside-copy">
          <h2>Every book you own, in your pocket.</h2>
          <p>A quiet, local-first place for the books you are carrying with you.</p>
          <ul className="feature-list">
            <li>Works offline, syncs when you are back</li>
            <li>Scan a barcode to add a book in seconds</li>
            <li>Track what you are reading and what you loved</li>
          </ul>
        </div>
        <div className="spines" aria-hidden="true">
          {SPINES.map((spine, index) => (
            <span key={index} className="spine" style={{ height: `${spine.height}%`, '--hue': spine.hue } as CSSProperties} />
          ))}
        </div>
      </aside>

      <section className="auth-main">
        <div className="auth-panel">
          <span className="eyebrow">FIELD NOTES / LIBRARY</span>
          <h1>{registering ? 'Create your shelf.' : 'Welcome back.'}</h1>
          <p className="lede">
            {registering ? 'It takes a few seconds. Your books stay on your device first.' : 'Sign in to pick up where you left off.'}
          </p>

          <form onSubmit={submit}>
            <label className="field">
              <span>Email or username</span>
              <input
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                autoComplete="username"
                required
              />
            </label>
            <label className="field">
              <span>Password</span>
              <div className="password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete={registering ? 'new-password' : 'current-password'}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="btn btn-primary btn-block" disabled={busy}>
              {busy ? 'Working...' : registering ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <button type="button" className="btn btn-ghost auth-switch" onClick={() => setMode(registering ? 'login' : 'register')}>
            {registering ? 'Already have an account? Sign in' : 'New here? Create an account'}
          </button>
        </div>
      </section>
    </main>
  )
}
