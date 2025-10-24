'use client'

import { useEffect, useState } from 'react'

type Team = {
  id: number
  name: string
  logo_url: string
}

type Match = {
  id: number
  team1: Team
  team2: Team
  match_date: string
  result?: string // ex: "G2 1-0 KC" si match passé
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Ici tu feras un fetch vers ton API
    // Exemple mock
    const mockMatches: Match[] = [
      {
        id: 1,
        team1: { id: 1, name: 'G2', logo_url: '/logos/g2.png' },
        team2: { id: 2, name: 'KC', logo_url: '/logos/kc.png' },
        match_date: '2025-10-10T21:00:00',
      },
      {
        id: 2,
        team1: { id: 3, name: 'Fnatic', logo_url: '/logos/fnatic.png' },
        team2: { id: 4, name: 'Vitality', logo_url: '/logos/vitality.png' },
        match_date: '2025-09-01T19:00:00',
        result: 'Vitality 1-0 Fnatic',
      },
    ]
    setMatches(mockMatches)
    setLoading(false)
  }, [])

  const now = new Date()

  const upcomingMatches = matches.filter((m) => new Date(m.match_date) > now)
  const pastMatches = matches.filter((m) => new Date(m.match_date) <= now)

  if (loading) return <p>Chargement des matchs...</p>

  return (
    <div className="p-6 flex flex-col gap-8">
      {/* Matchs à venir */}
      <section>
        <h2 className="text-2xl font-bold text-accent mb-4">Matchs à venir</h2>
        {upcomingMatches.length === 0 && <p>Aucun match à venir.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingMatches.map((match) => (
            <div
              key={match.id}
              className="flex items-center justify-between bg-background-secondary p-4 rounded-lg shadow"
            >
              <div className="flex items-center gap-4">
                <img src={match.team1.logo_url} alt={match.team1.name} className="w-12 h-12" />
                <span className="text-foreground font-semibold">{match.team1.name}</span>
              </div>

              <span className="text-foreground-secondary font-bold">vs</span>

              <div className="flex items-center gap-4">
                <span className="text-foreground font-semibold">{match.team2.name}</span>
                <img src={match.team2.logo_url} alt={match.team2.name} className="w-12 h-12" />
              </div>

              <div className="ml-4 text-foreground-secondary">
                {new Date(match.match_date).toLocaleString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Matchs passés */}
      <section>
        <h2 className="text-2xl font-bold text-accent mb-4">Matchs passés</h2>
        {pastMatches.length === 0 && <p>Aucun match passé.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pastMatches.map((match) => (
            <div
              key={match.id}
              className="flex items-center justify-between bg-background-secondary p-4 rounded-lg shadow"
            >
              <div className="flex items-center gap-4">
                <img src={match.team1.logo_url} alt={match.team1.name} className="w-12 h-12" />
                <span className="text-foreground font-semibold">{match.team1.name}</span>
              </div>

              <span className="text-foreground-secondary font-bold">vs</span>

              <div className="flex items-center gap-4">
                <span className="text-foreground font-semibold">{match.team2.name}</span>
                <img src={match.team2.logo_url} alt={match.team2.name} className="w-12 h-12" />
              </div>

              <div className="ml-4 text-foreground-secondary">
                {match.result ?? 'Match terminé'}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
