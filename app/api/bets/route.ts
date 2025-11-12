import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'

type BetRow = RowDataPacket & {
  id: number
  amount: number
  status: 'pending' | 'won' | 'lost'
  created_at: string
  champion_id: number
  champion_name: string
  image_url: string
}

export async function GET() {
  try {
    const [rows] = await db.execute<BetRow[]>(
      `SELECT b.id, b.amount, b.status, b.created_at,
              c.id AS champion_id, c.name AS champion_name, c.image_url
       FROM bets b
       JOIN champions c ON c.id = b.champion_id
       ORDER BY b.created_at DESC
       LIMIT 200`
    )
    return NextResponse.json(rows)
  } catch (err) {
    console.error('[GET /api/bets]', err)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      champion_id?: number
      amount?: number
    }

    const champion_id = Number(body.champion_id)
    const amount = Number(body.amount)

    if (!Number.isFinite(champion_id) || champion_id <= 0) {
      return NextResponse.json({ error: 'champion_id invalide' }, { status: 400 })
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'amount invalide' }, { status: 400 })
    }

    // Vérifier si le champion existe
    const [champRows] = await db.execute<RowDataPacket[]>(
      'SELECT id, name, image_url FROM champions WHERE id=? LIMIT 1',
      [champion_id]
    )
    const champ = champRows[0]
    if (!champ) {
      return NextResponse.json({ error: 'Champion introuvable' }, { status: 404 })
    }

    // Insertion du pari
    const [insertRes] = await db.execute<ResultSetHeader>(
      'INSERT INTO bets (champion_id, amount) VALUES (?, ?)',
      [champion_id, amount]
    )

    // Sélection du pari inséré
    const [rows] = await db.execute<BetRow[]>(
      `SELECT b.id, b.amount, b.status, b.created_at,
              c.id AS champion_id, c.name AS champion_name, c.image_url
       FROM bets b
       JOIN champions c ON c.id = b.champion_id
       WHERE b.id = ? LIMIT 1`,
      [insertRes.insertId]
    )

    return NextResponse.json(rows[0] ?? null)
  } catch (err) {
    console.error('[POST /api/bets]', err)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
