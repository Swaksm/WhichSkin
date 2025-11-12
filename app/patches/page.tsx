'use client'

import { useEffect, useState } from 'react'

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

  useEffect(() => {
    const fetchPatches = async () => {
      try {
        const res = await fetch('/api/patches')
        const data = await res.json()
        setPatches(data.patches || [])
      } catch (e) {
        console.error('Erreur fetch patches', e)
      } finally {
        setLoading(false)
      }
    }
    fetchPatches()
  }, [])

  if (loading) return <p className="p-6">Chargement des patchs...</p>

  return (
    <div className="p-6 flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-accent mb-6">
        Derniers Patchs League of Legends
      </h1>

      {patches.map((patch) => (
        <div
          key={patch.id}
          className="bg-background-secondary rounded-lg shadow p-6 flex flex-col gap-4 hover:scale-[1.02] transition-transform"
        >
          <h2 className="text-2xl font-bold text-foreground">{patch.title}</h2>
          <p className="text-foreground-secondary">Publié le {patch.date}</p>

          <a
            href={patch.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline text-sm font-semibold hover:text-accent/80 transition"
          >
            Voir le patch complet sur le site officiel →
          </a>

          <div className="mt-4">
            <h3 className="text-lg font-semibold text-pink-400 mb-2">
              Nouveaux skins dans ce patch
            </h3>

            {patch.skins.length > 0 ? (
              <ul className="list-disc list-inside">
                {patch.skins.map((skin) => (
                  <li key={skin.name} className="text-foreground">
                    {skin.name}
                    {skin.champion && (
                      <span className="text-sm text-foreground-secondary ml-2">
                        → {skin.champion}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-foreground-secondary italic">
                Aucun skin détecté
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
