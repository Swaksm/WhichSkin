// app/result/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type BetStatus = 'pending' | 'won' | 'lost'

type BetResult = {
  bet_id: number
  amount: number
  created_at: string
  champion_id: number
  champion_name: string
  image_url: string
  patch_id: number | null
  patch_title: string | null
  patch_url: string | null
  patch_published_at: string | null
  db_status: BetStatus
  computed_status: BetStatus
}

const fmtTokens = (v: unknown) => {
  const n = Number(v)
  return Number.isFinite(n) ? Math.round(n).toString() : '0'
}

export default function ResultPage() {
  const [results, setResults] = useState<BetResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/results', { cache: 'no-store' })
        const json = await res.json()
        if (!res.ok || !Array.isArray(json)) {
          throw new Error(json?.error || 'Erreur API')
        }
        setResults(json)
      } catch (err) {
        console.error(err)
        setError('Impossible de charger les résultats.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <main className="max-w-6xl mx-auto p-6">
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '.75rem',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <h1 className="title" style={{ fontSize: '1.6rem' }}>
            Résultats des paris
          </h1>
          <p className="subtitle" style={{ marginTop: '.25rem' }}>
            Chaque pari est évalué avec le premier patch sorti après l&apos;heure du pari.
          </p>
        </div>

        <Link href="/bets" className="btn-primary">
          Retour aux paris
        </Link>
      </header>

      {loading && <p className="subtitle">Chargement…</p>}
      {!loading && error && (
        <div className="card subtitle" style={{ color: '#ff6b6b' }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {results.length === 0 ? (
            <div className="card subtitle">Aucun pari trouvé.</div>
          ) : (
            <ul style={{ display: 'grid', gap: '.75rem' }}>
              {results.map(r => {
                const betDate = new Date(r.created_at)
                const patchDate = r.patch_published_at
                  ? new Date(r.patch_published_at)
                  : null

                let statusColor = '#ffd166' // pending
                if (r.computed_status === 'won') statusColor = '#06d6a0'
                if (r.computed_status === 'lost') statusColor = '#ff6b6b'

                return (
                  <li
                    key={r.bet_id}
                    className="card"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto',
                      gap: '0.75rem',
                      alignItems: 'center',
                    }}
                  >
                    {/* Champion */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                      <img
                        src={r.image_url}
                        alt={r.champion_name}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          objectFit: 'contain',
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{r.champion_name}</div>
                        <div className="subtitle" style={{ fontSize: '.8rem' }}>
                          Pari du {betDate.toLocaleString()}
                        </div>
                        <div className="subtitle" style={{ fontSize: '.8rem' }}>
                          Mise : {fmtTokens(r.amount)} tokens
                        </div>
                      </div>
                    </div>

                    {/* Patch associé */}
                    <div className="subtitle" style={{ fontSize: '.85rem' }}>
                      {r.patch_id ? (
                        <>
                          <div>
                            Patch utilisé :{' '}
                            {r.patch_url ? (
                              <a
                                href={r.patch_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link"
                              >
                                {r.patch_title || 'Patch'}
                              </a>
                            ) : (
                              r.patch_title || 'Patch'
                            )}
                          </div>
                          {patchDate && (
                            <div>Sorti le {patchDate.toLocaleDateString('fr-FR')}</div>
                          )}
                        </>
                      ) : (
                        <div>Aucun patch encore sorti après ce pari (en attente).</div>
                      )}
                    </div>

                    {/* Statut calculé */}
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '.25rem .6rem',
                          borderRadius: 999,
                          border: '1px solid var(--border)',
                          background: 'var(--background)',
                          color: statusColor,
                          fontWeight: 600,
                          fontSize: '.85rem',
                        }}
                      >
                        {r.computed_status.toUpperCase()}
                      </div>

                      {r.db_status !== r.computed_status && (
                        <div
                          className="subtitle"
                          style={{ fontSize: '.75rem', marginTop: '.25rem', opacity: 0.75 }}
                        >
                          (DB: {r.db_status})
                        </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}
    </main>
  )
}
