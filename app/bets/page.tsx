'use client'
import Link from 'next/link'
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
  amount: number           // = nombre de tokens misés
  status: BetStatus
  created_at: string
  champion_id: number
  champion_name: string
  image_url: string
}
type ApiError = { error: string }

/* -------------------------- Helpers -------------------------- */
const toNum = (v: unknown): number => (v === null || v === undefined ? NaN : Number(v))
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
function normBet(x: unknown): Bet {
  const o = x as Record<string, unknown>
  return {
    id: Number(o.id),
    amount: Number(o.amount), // tokens
    status: (o.status as BetStatus) ?? 'pending',
    created_at: String(o.created_at),
    champion_id: Number(o.champion_id),
    champion_name: String(o.champion_name),
    image_url: String(o.image_url),
  }
}
const fmtTokens = (n: unknown) => {
  const x = toNum(n)
  return Number.isFinite(x) ? Math.round(x).toString() : '0'
}

/* --------------------------- Page --------------------------- */
export default function BetsPage() {
  const [champions, setChampions] = useState<Champion[]>([])
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingBets, setLoadingBets] = useState(true)
  const [selected, setSelected] = useState<number | null>(null)
  const [amount, setAmount] = useState('5')          // tokens (string pour l’input)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

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
        setChampions(Array.isArray(champsJson) ? champsJson.map((c) => normChampion(c as Champion)) : [])
        setBets(Array.isArray(betsJson) ? betsJson.map((b) => (isBet(b) ? normBet(b) : normBet(b))) : [])
      } catch (err) {
        console.error(err)
        setMessage('Impossible de charger les données.')
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

  async function submitBet() {
    if (!selected) return setMessage('Choisis un champion.')
    const amt = Math.floor(Number(amount))
    if (!Number.isFinite(amt) || amt <= 0) return setMessage('Montant de tokens invalide.')
        
    setSubmitting(true)
    setMessage(null)
    try {
      const res = await fetch('/api/bets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ champion_id: selected, amount: amt }), // amount = tokens
      })
      const json: unknown = await res.json()
      if (!res.ok || isApiError(json)) throw new Error(isApiError(json) ? json.error : 'Erreur API')
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

  async function changeStatus(id: number, status: BetStatus) {
    try {
      const res = await fetch(`/api/bets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const json: unknown = await res.json()
      if (!res.ok || isApiError(json)) throw new Error(isApiError(json) ? json.error : 'Erreur API')
      const updated = isBet(json) ? normBet(json) : normBet(json)
      setBets(prev => prev.map(b => (b.id === id ? updated : b)))
    } catch (err) {
      if (err instanceof Error) setMessage(err.message)
      else setMessage('Erreur inconnue')
    }
  }

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

  /* --------------------------- UI --------------------------- */
  return (
    <main className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1rem' }}>
        <h1 className="title" style={{ fontSize: '1.5rem' }}>Parier des tokens sur un skin au prochain patch</h1>
        <Link href="/patches" className="btn-primary" title="Voir les patchs">
          Voir les patchs
        </Link>
      </div>

      {/* Historique des paris */}
      <section className="card" style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontWeight: 600, marginBottom: '.5rem' }}>Mes derniers paris</h2>

        {loadingBets ? (
          <p className="subtitle">Chargement…</p>
        ) : bets.length === 0 ? (
          <p className="subtitle">Aucun pari pour l’instant.</p>
        ) : (
          <ul style={{ display: 'grid', gap: '.5rem' }}>
            {bets.map(b => (
              <li
                key={b.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: `1px solid var(--border)`,
                  backgroundColor: 'var(--background-secondary)',
                }}
              >
                <img src={b.image_url} alt={b.champion_name} style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'contain' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{b.champion_name}</div>
                  <div className="subtitle" style={{ fontSize: '.8rem' }}>{new Date(b.created_at).toLocaleString()}</div>
                </div>

                <div style={{ fontWeight: 600 }}>Mise : {fmtTokens(b.amount)} tokens</div>

                <span className="subtitle" style={{ fontSize: '0.9rem', opacity: 0.8 }}>
  {b.status}
</span>


                <button
                  onClick={() => removeBet(b.id)}
                  className="input-field"
                  style={{ padding: '0.25rem 0.5rem', borderColor: 'var(--border)', background: 'transparent', cursor: 'pointer' }}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Création d'un pari */}
      <section className="card" style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontWeight: 600, marginBottom: '.75rem' }}>Nouveau pari</h2>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <label className="subtitle" style={{ display: 'block', marginBottom: '.25rem' }}>Champion</label>
            <ChampionSelect champions={champions} loading={loading} selected={selected} onChange={setSelected} />
          </div>

          <div>
            <label className="subtitle" style={{ display: 'block', marginBottom: '.25rem' }}>Mise (tokens)</label>
            <input
              type="number"
              inputMode="numeric"
              step={1}
              min={1}
              className="input-field"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>

          <button
            onClick={submitBet}
            disabled={submitting || loading || !selected}
            className="btn-primary"
            style={{ opacity: submitting || loading || !selected ? .6 : 1 }}
          >
            {submitting ? 'Enregistrement…' : 'Parier'}
          </button>
        </div>

        {useMemo(() => {
          const cc = chosenChampion
          if (!cc) return null
          const pr = Number(cc.pick_rate)
          return (
            <div className="subtitle" style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginTop: '.75rem' }}>
              <img src={cc.image_url} alt={cc.name} style={{ width: 24, height: 24, borderRadius: 6, objectFit: 'contain' }} />
              <span>{cc.name}</span>
              {Number.isFinite(pr) && <span>• Pick rate : {pr.toFixed(2)}%</span>}
            </div>
          )
        }, [chosenChampion])}

        {message && <p className="subtitle" style={{ color: '#ff6b6b', marginTop: '.5rem' }}>{message}</p>}
      </section>

      {/* Grille des champions */}
      <section>
        <h2 style={{ fontWeight: 600, marginBottom: '.75rem' }}>Choisis ton champion</h2>
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
      className="input-field"
      value={selected ?? ''}
      disabled={loading}
      onChange={e => onChange(e.target.value ? Number(e.target.value) : null)}
      style={{ width: '100%' }}
    >
      <option value="">{loading ? 'Chargement…' : '— Choisir —'}</option>
      {champions.map(c => {
        const pr = Number(c.pick_rate)
        return (
          <option key={c.id} value={c.id}>
            {c.name}{Number.isFinite(pr) ? ` (pick ${pr.toFixed(2)}%)` : ''}
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
    <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))' }}>
      {champions.map(c => {
        const pr = Number(c.pick_rate)
        const isSelected = selected === c.id
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className="card"
            style={{ textAlign: 'left', transition: 'box-shadow .2s', outline: isSelected ? `2px solid var(--accent)` : 'none', cursor: 'pointer' }}
          >
            <img src={c.image_url} alt={c.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'contain', marginBottom: 8 }} />
            <div style={{ fontWeight: 600 }}>{c.name}</div>
            {Number.isFinite(pr) && <div className="subtitle" style={{ fontSize: '.85rem' }}>Pick rate: {pr.toFixed(2)}%</div>}
          </button>
        )
      })}
    </div>
  )
}
