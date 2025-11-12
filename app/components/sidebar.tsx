'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Sidebar() {
  const [pseudo, setPseudo] = useState<string | null>(null)

  useEffect(() => {
    const storedPseudo = localStorage.getItem('pseudo')
    if (storedPseudo) setPseudo(storedPseudo)
  }, [])

  const handleLogout = () => {
    localStorage.clear()          // supprime toutes les info coté client
    setPseudo(null)            
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
            Esportify
          </Link>
        </div>

        <nav className="mt-6 flex flex-col gap-2">
          {['patches','champions','bets','page4'].map((p) => (
            <Link
              key={p}
              href={`/${p}`}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                display: 'block',
                color: 'var(--foreground)',
                transition: 'background 0.2s'
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
        {pseudo ? (
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#FF4C4C',
              color: 'var(--foreground)',
            }}
            className="w-full block text-center px-4 py-2 rounded font-semibold hover:bg-red-600 transition"
          >
            Déconnexion
          </button>
        ) : (
          <>
            <Link
              href="/login"
              className="btn-primary w-full block text-center"
            >
              Se connecter
            </Link>

            <Link
              href="/register"
              className="btn-primary w-full block text-center mt-2"
            >
              Enregistrer
            </Link>
          </>
        )}
      </div>
    </aside>
  )
}
