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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: 'id invalide' }, { status: 400 })
    }

    const body = (await req.json().catch(() => ({}))) as { status?: string }
    const status = body.status
    if (!status || !['pending', 'won', 'lost'].includes(status)) {
      return NextResponse.json({ error: 'status invalide' }, { status: 400 })
    }

    // UPDATE
    const [updateRes] = await db.execute<ResultSetHeader>(
      'UPDATE bets SET status=? WHERE id=?',
      [status, id]
    )
    if (updateRes.affectedRows === 0) {
      return NextResponse.json({ error: 'Pari introuvable' }, { status: 404 })
    }

    // SELECT (pari mis à jour)
    const [rows] = await db.execute<BetRow[]>(
      `SELECT b.id, b.amount, b.status, b.created_at,
              c.id AS champion_id, c.name AS champion_name, c.image_url
       FROM bets b
       JOIN champions c ON c.id = b.champion_id
       WHERE b.id = ? LIMIT 1`,
      [id]
    )

    return NextResponse.json(rows[0] ?? null)
  } catch (err) {
    console.error('[PATCH /api/bets/:id]', err)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id)
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: 'id invalide' }, { status: 400 })
    }

    const [delRes] = await db.execute<ResultSetHeader>(
      'DELETE FROM bets WHERE id=?',
      [id]
    )
    if (delRes.affectedRows === 0) {
      return NextResponse.json({ error: 'Pari introuvable' }, { status: 404 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/bets/:id]', err)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
