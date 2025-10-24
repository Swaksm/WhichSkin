'use client'

import { useEffect, useState } from 'react'

type Champion = {
  id: number
  name: string
  image_url: string
  pick_rate?: number 
}

export default function ChampionsPage() {
  const [champions, setChampions] = useState<Champion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedChamp, setSelectedChamp] = useState<Champion | null>(null)

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const res = await fetch('/api/champions')
        if (!res.ok) throw new Error('Erreur lors de la récupération des champions')
        const data: Champion[] = await res.json()
        setChampions(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchChampions()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <p className="text-foreground">Chargement des champions...</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1">
        {champions.map((champ) => (
          <img
            key={champ.id}
            src={champ.image_url}
            alt={champ.name}
            title={champ.name}
            className="w-10 h-10 rounded cursor-pointer hover:scale-110 transition-transform"
            onClick={() => setSelectedChamp(champ)}
          />
        ))}
      </div>

      {/* Popup */}
      {selectedChamp && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedChamp(null)}
        >
          <div
            className="bg-background-secondary p-6 rounded-lg shadow-lg flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedChamp.image_url}
              alt={selectedChamp.name}
              className="w-24 h-24 rounded mb-4"
            />
            <h2 className="title text-lg mb-2">{selectedChamp.name}</h2>
            {selectedChamp.pick_rate !== undefined && (
              <p className="subtitle text-sm">{selectedChamp.pick_rate}% pick rate</p>
            )}
            <button
              className="btn-primary mt-4"
              onClick={() => setSelectedChamp(null)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
