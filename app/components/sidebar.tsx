// app/components/sidebar.tsx
'use client'

import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'

type UserTokensResponse = { tokens?: number | string; error?: string }

export default function Sidebar() {
  const [pseudo, setPseudo] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [tokens, setTokens] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const readPseudo = () => (localStorage.getItem('pseudo') || '').trim() || null
  const readUserId = () => {
    const n = Number(localStorage.getItem('user_id'))
    return Number.isFinite(n) && n > 0 ? n : null
  }

  const fetchUserTokens = useCallback(async (id: number | null) => {
    if (!id) { setTokens(null); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${id}?t=${Date.now()}`, { cache: 'no-store' })
      const data: UserTokensResponse = await res.json().catch(() => ({}))
      if (!res.ok) {
        console.error('[Sidebar] fetch tokens error:', data?.error || res.status)
        setTokens(0)
        return
      }
      const n = Number(data.tokens)
      setTokens(Number.isFinite(n) ? n : 0)
    } catch (err) {
      console.error('[Sidebar] fetch tokens error:', err)
      setTokens(0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const p = readPseudo()
    const id = readUserId()
    setPseudo(p)
    setUserId(id)
    void fetchUserTokens(id)
  }, [fetchUserTokens])

  useEffect(() => {
    const onTokensUpdated = () => fetchUserTokens(readUserId())
    const onVisible = () => {
      if (document.visibilityState === 'visible') fetchUserTokens(readUserId())
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'user_id' || e.key === 'pseudo') {
        const p = readPseudo()
        const id = readUserId()
        setPseudo(p)
        setUserId(id)
        fetchUserTokens(id)
      }
    }

    window.addEventListener('tokens-updated', onTokensUpdated as EventListener)
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('tokens-updated', onTokensUpdated as EventListener)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('storage', onStorage)
    }
  }, [fetchUserTokens])

  const handleManualRefresh = () => fetchUserTokens(readUserId())

  const handleLogout = () => {
    localStorage.clear()
    // propage aux autres onglets
    localStorage.setItem('user_id', '')
    localStorage.setItem('pseudo', '')
    setPseudo(null)
    setUserId(null)
    setTokens(null)
    window.location.reload()
  }

  return (
    <aside
      style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--foreground)' }}
      className="flex flex-col justify-between h-screen w-64"
    >
      <div>
        <div
          style={{ borderBottom: '1px solid var(--border)' }}
          className="p-6 text-2xl font-bold"
        >
          <Link href="/" style={{ color: 'var(--accent)' }}>
            WhichSkin?
          </Link>
        </div>

        <nav className="mt-6 flex flex-col gap-2">
          {['patches', 'champions', 'bets', 'wheel','results'].map((p) => (
            <Link
              key={p}
              href={`/${p}`}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                display: 'block',
                color: 'var(--foreground)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--border)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {userId ? (
          <>
            <div className="mb-3 text-sm text-center opacity-80">
              <div className="font-semibold">{pseudo ?? `User #${userId}`}</div>
              <div className="flex items-center justify-center gap-2">
                <span>Tokens :</span>
                <span className="font-bold text-yellow-400">
                  {tokens !== null ? tokens : '...'}
                </span>
                <button
                  onClick={handleManualRefresh}
                  title="Rafraîchir"
                  className="text-xs px-2 py-1 border rounded hover:bg-white/5 transition disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? '...' : '↻'}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogout}
              style={{ backgroundColor: '#FF4C4C', color: 'var(--foreground)' }}
              className="w-full block text-center px-4 py-2 rounded font-semibold hover:bg-red-600 transition"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn-primary w-full block text-center">
              Se connecter
            </Link>
            <Link href="/register" className="btn-primary w-full block text-center mt-2">
              S’enregistrer
            </Link>
          </>
        )}
      </div>
    </aside>
  )
}
