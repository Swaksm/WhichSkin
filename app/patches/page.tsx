'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type SkinInfo = {
  name: string
  champion: string | null
  champion_id: number | null
}

type Patch = {
  id: number
  title: string
  date: string
  url: string
  skins: SkinInfo[]
}


export default function PatchesPage() {
  const [patches, setPatches] = useState<Patch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPatches = async () => {
      try {
        const res = await fetch('/api/patches', { cache: 'no-store' })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data?.error || 'Erreur API')
        setPatches(Array.isArray(data?.patches) ? data.patches : [])
      } catch (err) {
        console.error(err)
        setError('Erreur lors du chargement des données')
      } finally {
        setLoading(false)
      }
    }
    fetchPatches()
  }, [])

  return (
    <main className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="title" style={{ fontSize: '1.75rem' }}>
            Derniers Patchs League of Legends
          </h1>
          <p className="subtitle" style={{ marginTop: '.25rem' }}>
            Parcours les notes officielles et repère rapidement les nouveaux skins.
          </p>
        </div>

        <Link href="/bets" className="btn-primary">
          Parier sur un skin →
        </Link>
      </header>

      {/* Loader */}
      {loading && (
        <ul className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="card" style={{ overflow: 'hidden' }}>
              <div
                style={{
                  height: 18,
                  width: '60%',
                  background: 'linear-gradient(90deg, #1a1d23 25%, #222733 37%, #1a1d23 63%)',
                  animation: 'shimmer 1.6s infinite',
                  borderRadius: 6,
                }}
              />
              <div style={{ height: 10, width: '40%', marginTop: 10, opacity: .5, background: 'var(--border)', borderRadius: 6 }} />
              <div style={{ height: 44, marginTop: 16, background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 10 }} />
              <style jsx>{`
                @keyframes shimmer {
                  0% { background-position: -200px 0 }
                  100% { background-position: calc(200px + 100%) 0 }
                }
                div[style*="shimmer"] { background-size: 200px 100%; }
              `}</style>
            </li>
          ))}
        </ul>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="card subtitle" style={{ color: '#ff6b6b' }}>
          {error}
        </div>
      )}

      {/* Liste des patchs */}
      {!loading && !error && (
        <>
          {patches.length === 0 ? (
            <div className="card subtitle">Aucun patch disponible pour le moment.</div>
          ) : (
            <ul className="grid sm:grid-cols-2 gap-4">
              {patches.map((patch) => (
                <li key={patch.id} className="card" style={{ position: 'relative' }}>
                  {/* Titre */}
                  <h2 className="title" style={{ fontSize: '1.15rem' }}>
                    {patch.title}
                  </h2>

                  {/* Date */}
                  <div
                    className="subtitle"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '.5rem',
                      padding: '.25rem .5rem',
                      border: '1px solid var(--border)',
                      borderRadius: '999px',
                      marginTop: '.4rem',
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }} />
                    Publié le {patch.date}
                  </div>

                  {/* Lien patch officiel */}
                  <a
                    href={patch.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ marginTop: '0.9rem', display: 'inline-block' }}
                    title="Voir le patch complet"
                  >
                    Voir le patch officiel ↗
                  </a>

                  {/* Skins */}
                  <div style={{ marginTop: '1rem' }}>
                    <div className="subtitle" style={{ fontWeight: 600, marginBottom: '.35rem', color: '#ff7ad6' }}>
                      Nouveaux skins
                    </div>

                    {patch.skins.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
                        {patch.skins.map((skin) => {
                          const chip = (
                            <span
                              key={skin.name}
                              title={skin.champion ? `${skin.name} → ${skin.champion}` : skin.name}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '.4rem',
                                padding: '.35rem .6rem',
                                border: '1px solid var(--border)',
                                borderRadius: '999px',
                                background: 'var(--background)',
                                fontSize: '.9rem',
                              }}
                            >
                              <span style={{ fontWeight: 600 }}>{skin.name}</span>
                              {skin.champion && (
                                <span className="subtitle" style={{ fontSize: '.85rem' }}>→ {skin.champion}</span>
                              )}
                            </span>
                          )

                          // si on a un champion_id, on peut lier vers /champions
                          if (skin.champion_id) {
                            return (
                              <Link
                                key={skin.name}
                                href="/champions"
                                title={`Voir ${skin.champion || 'le champion'}`}
                                style={{ textDecoration: 'none' }}
                              >
                                {chip}
                              </Link>
                            )
                          }
                          return chip
                        })}
                      </div>
                    ) : (
                      <p className="subtitle" style={{ fontStyle: 'italic' }}>
                        Aucun skin détecté
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  )
}
