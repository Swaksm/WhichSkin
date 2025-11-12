// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import type { RowDataPacket } from 'mysql2/promise'

interface UserRow extends RowDataPacket {
  tokens: number | string
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // 👈 params is a Promise
) {
  try {
    const { id: idRaw } = await params                 // 👈 await it
    const id = Number(idRaw)

    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 })
    }

    const [rows] = await db.query<UserRow[]>(
      'SELECT tokens FROM users WHERE id = ? LIMIT 1',
      [id]
    )

    if (!rows.length) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }

    const n = Number(rows[0].tokens)
    return NextResponse.json({ tokens: Number.isFinite(n) ? n : 0 })
  } catch (e) {
    console.error('[GET /api/users/:id]', e)
    return NextResponse.json({ error: 'Erreur serveur interne' }, { status: 500 })
  }
}
