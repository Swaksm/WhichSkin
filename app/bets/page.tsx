'use client'

import { useEffect, useMemo, useState } from 'react'

/* ----------------------------- Types ----------------------------- */
type Champion = {
  id: number
  name: string
  image_url: string
  pick_rate?: number | null
}

type BetStatus = 'pending' | 'won' | 'lost'

type Bet = {
  id: number
  amount: number
  status: BetStatus
  created_at: string
  champion_id: number
  champion_name: string
  image_url: string
}

type ApiError = { error: string }

/* -------------------------- Helpers -------------------------- */
const toNum = (v: unknown): number =>
  v === null || v === undefined ? NaN : Number(v)

const normChampion = (c: Champion): Champion => ({
  ...c,
  pick_rate:
    c.pick_rate === undefined || c.pick_rate === null ? undefined : Number(c.pick_rate),
})

function isApiError(x: unknown): x is ApiError {
  return typeof x === 'object' && x !== null && 'error' in x && typeof (x as { error: unknown }).error === 'string'
}

function isBetStatus(x: unknown): x is BetStatus {
  return x === 'pending' || x === 'won' || x === 'lost'
}

function isBet(x: unknown): x is Bet {
  if (typeof x !== 'object' || x === null) return false
  const o = x as Record<string, unknown>
  return (
    typeof o.id !== 'undefined' &&
    typeof o.amount !== 'undefined' &&
    typeof o.created_at === 'string' &&
    typeof o.champion_name === 'string' &&
    typeof o.image_url === 'string' &&
    typeof o.champion_id !== 'undefined' &&
    isBetStatus(o.status)
  )
}

/** Convertit une structure inconnue (issue de JSON) en Bet, en forçant les numériques. */
function normBet(x: unknown): Bet {
  const o = x as Record<string, unknown>
  return {
    id: Number(o.id),
    amount: Number(o.amount),
    status: (o.status as BetStatus) ?? 'pending',
    created_at: String(o.created_at),
    champion_id: Number(o.champion_id),
    champion_name: String(o.champion_name),
    image_url: String(o.image_url),
  }
}

const fmtAmount = (n: unknown) => {
  const x = toNum(n)
  return Number.isFinite(x) ? x.toFixed(2) : '0.00'
}

/* --------------------------- Composant --------------------------- */

export default function BetsPage() {
  const [champions, setChampions] = useState<Champion[]>([])
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingBets, setLoadingBets] = useState(true)
  const [selected, setSelected] = useState<number | null>(null)
  const [amount, setAmount] = useState('5')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  /* --- Chargement des données --- */
  useEffect(() => {
    const load = async () => {
      try {
        const [cRes, bRes] = await Promise.all([
          fetch('/api/champions', { cache: 'no-store' }),
          fetch('/api/bets', { cache: 'no-store' }),
        ])
        if (!cRes.ok || !bRes.ok) throw new Error('Erreur réseau')

        const champsJson: unknown = await cRes.json()
        const betsJson: unknown = await bRes.json()

        if (Array.isArray(champsJson)) {
          // on suppose que l’API renvoie des champs compatibles avec Champion
          setChampions(champsJson.map((c) => normChampion(c as Champion)))
        } else {
          setChampions([])
        }

        if (Array.isArray(betsJson)) {
          const normalized = betsJson.map((b) => (isBet(b) ? normBet(b) : normBet(b)))
          setBets(normalized)
        } else {
          setBets([])
        }
      } catch (err) {
        console.error(err)
        setMessage('Erreur lors du chargement des données.')
      } finally {
        setLoading(false)
        setLoadingBets(false)
      }
    }
    load()
  }, [])

  const chosenChampion = useMemo(
    () => champions.find(c => c.id === selected) || null,
    [champions, selected]
  )

  /* --- Créer un pari --- */
  async function submitBet() {
    if (!selected) return setMessage('Choisis un champion.')
    const amt = Number(amount)
    if (!Number.isFinite(amt) || amt <= 0) return setMessage('Montant invalide.')

    setSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch('/api/bets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ champion_id: selected, amount: amt }),
      })

      const json: unknown = await res.json()
      if (!res.ok || isApiError(json)) {
        throw new Error(isApiError(json) ? json.error : 'Erreur API')
      }
      // json devrait être un Bet-like
      const bet = isBet(json) ? normBet(json) : normBet(json)
      setBets(prev => [bet, ...prev])
      setMessage('Pari enregistré ✅')
    } catch (err) {
      if (err instanceof Error) setMessage(err.message)
      else setMessage('Erreur inconnue')
    } finally {
      setSubmitting(false)
    }
  }

  /* --- Modifier le statut --- */
  async function changeStatus(id: number, status: BetStatus) {
    try {
      const res = await fetch(`/api/bets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const json: unknown = await res.json()
      if (!res.ok || isApiError(json)) {
        throw new Error(isApiError(json) ? json.error : 'Erreur API')
      }
      const updated = isBet(json) ? normBet(json) : normBet(json)
      setBets(prev => prev.map(b => (b.id === id ? updated : b)))
    } catch (err) {
      if (err instanceof Error) setMessage(err.message)
      else setMessage('Erreur inconnue')
    }
  }

  /* --- Supprimer un pari --- */
  async function removeBet(id: number) {
    try {
      const res = await fetch(`/api/bets/${id}`, { method: 'DELETE' })
      const json: unknown = await res.json()
      const ok = typeof json === 'object' && json !== null && (json as Record<string, unknown>).ok === true
      const errMsg =
        typeof json === 'object' && json !== null && 'error' in json
          ? String((json as Record<string, unknown>).error)
          : 'Erreur API'
      if (!res.ok || !ok) throw new Error(errMsg)
      setBets(prev => prev.filter(b => b.id !== id))
    } catch (err) {
      if (err instanceof Error) setMessage(err.message)
      else setMessage('Erreur inconnue')
    }
  }

  /* --- Rendu --- */
  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Parier sur un skin au prochain patch</h1>
        {/* --- Historique des paris --- */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Mes derniers paris</h2>

        {loadingBets ? (
          <p className="opacity-70 text-sm">Chargement…</p>
        ) : bets.length === 0 ? (
          <p className="opacity-70 text-sm">Aucun pari pour l’instant.</p>
        ) : (
          <ul className="space-y-2">
            {bets.map(b => (
              <li
                key={b.id}
                className="p-3 border rounded flex items-center gap-3 bg-white/5"
              >
                <img
                  src={b.image_url}
                  alt={b.champion_name}
                  className="w-8 h-8 rounded object-contain"
                />
                <div className="flex-1">
                  <div className="font-medium">{b.champion_name}</div>
                  <div className="text-xs opacity-70">
                    {new Date(b.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="text-sm font-medium">
                  Mise : {fmtAmount(b.amount)} €
                </div>

                <select
                  className="text-xs border rounded px-2 py-1 ml-2"
                  value={b.status}
                  onChange={e =>
                    changeStatus(b.id, e.target.value as BetStatus)
                  }
                >
                  <option value="pending">pending</option>
                  <option value="won">won</option>
                  <option value="lost">lost</option>
                </select>

                <button
                  className="text-xs ml-3 px-2 py-1 border rounded hover:bg-red-50"
                  onClick={() => removeBet(b.id)}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      {/* --- Formulaire --- */}
      <section className="mb-8 space-y-4">
        <div className="flex items-end gap-4 flex-wrap">
          <div className="flex-1 min-w-[260px]">
            <label className="block text-sm mb-1">Champion</label>
            <ChampionSelect
              champions={champions}
              loading={loading}
              selected={selected}
              onChange={setSelected}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Mise (€)</label>
            <input
              type="number"
              inputMode="decimal"
              step="0.5"
              min="0.5"
              className="px-3 py-2 rounded border bg-transparent"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>

          <button
            onClick={submitBet}
            disabled={submitting || loading || !selected}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            {submitting ? 'Enregistrement…' : 'Parier'}
          </button>
        </div>

        {chosenChampion && (
          <div className="flex items-center gap-3 text-sm opacity-80">
            <img
              src={chosenChampion.image_url}
              alt={chosenChampion.name}
              className="w-8 h-8 rounded object-contain"
            />
            <span>{chosenChampion.name}</span>
            {chosenChampion.pick_rate !== undefined &&
              Number.isFinite(Number(chosenChampion.pick_rate)) && (
                <span>• Pick rate : {Number(chosenChampion.pick_rate).toFixed(2)}%</span>
              )}
          </div>
        )}

        {message && <p className="text-sm text-red-500">{message}</p>}
      </section>

      {/* --- Grille des champions --- */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Choisis ton champion</h2>
        <ChampionGrid champions={champions} selected={selected} onSelect={setSelected} />
      </section>
    </main>
  )
}

/* ---------------------- Composants secondaires ---------------------- */

function ChampionSelect({
  champions,
  loading,
  selected,
  onChange,
}: {
  champions: Champion[]
  loading: boolean
  selected: number | null
  onChange: (id: number | null) => void
}) {
  return (
    <select
      className="w-full px-3 py-2 rounded border bg-transparent"
      value={selected ?? ''}
      disabled={loading}
      onChange={e => onChange(e.target.value ? Number(e.target.value) : null)}
    >
      <option value="">{loading ? 'Chargement…' : '— Choisir —'}</option>
      {champions.map(c => {
        const pr = Number(c.pick_rate)
        return (
          <option key={c.id} value={c.id}>
            {c.name}
            {Number.isFinite(pr) ? ` (pick ${pr.toFixed(2)}%)` : ''}
          </option>
        )
      })}
    </select>
  )
}

function ChampionGrid({
  champions,
  selected,
  onSelect,
}: {
  champions: Champion[]
  selected: number | null
  onSelect: (id: number) => void
}) {
  if (!champions.length) return null

  return (
    <div className="grid gap-3 grid-template">
      <style jsx>{`
        .grid-template {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
        }
      `}</style>

      {champions.map(c => {
        const pr = Number(c.pick_rate)
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`p-3 border rounded text-left hover:shadow transition ${
              selected === c.id ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <img
              src={c.image_url}
              alt={c.name}
              className="w-12 h-12 rounded mb-2 object-contain"
            />
            <div className="font-medium">{c.name}</div>
            {Number.isFinite(pr) && (
              <div className="text-xs opacity-70">Pick rate: {pr.toFixed(2)}%</div>
            )}
          </button>
        )
      })}
    </div>
  )
}
