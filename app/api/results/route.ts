// app/api/results/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/db'
import type { RowDataPacket } from 'mysql2/promise'

type ResultRow = RowDataPacket & {
  bet_id: number
  amount: number
  status: 'pending' | 'won' | 'lost'
  created_at: string
  champion_id: number
  champion_name: string
  image_url: string
  patch_id: number | null
  patch_title: string | null
  patch_url: string | null
  patch_published_at: string | null
  has_skin: 0 | 1 | null
}

export async function GET() {
  try {
    const [rows] = await db.execute<ResultRow[]>(`
      SELECT
        b.id AS bet_id,
        b.amount,
        b.status,
        b.created_at,
        c.id AS champion_id,
        c.name AS champion_name,
        c.image_url,
        p.id AS patch_id,
        p.title AS patch_title,
        p.url AS patch_url,
        p.published_at AS patch_published_at,
        CASE
          WHEN p.id IS NULL THEN NULL
          ELSE EXISTS (
            SELECT 1
            FROM patch_skins ps
            WHERE ps.patch_id = p.id
              AND ps.champion_id = b.champion_id
          )
        END AS has_skin
      FROM bets b
      JOIN champions c ON c.id = b.champion_id
      LEFT JOIN patches p
        ON p.id = (
          SELECT p2.id
          FROM patches p2
          WHERE p2.published_at > b.created_at
          ORDER BY p2.published_at ASC
          LIMIT 1
        )
      ORDER BY b.created_at DESC
      LIMIT 200
    `)

    const data = rows.map(row => {
      let computed: 'pending' | 'won' | 'lost'

      if (!row.patch_id) {
        // pas de patch
        computed = 'pending'
      } else if (row.has_skin === 1) {
        // le patch d'apres contient = win
        computed = 'won'
      } else {
        // idem mais perdu
        computed = 'lost'
      }

      return {
        bet_id: row.bet_id,
        amount: Number(row.amount),
        created_at: row.created_at,
        champion_id: row.champion_id,
        champion_name: row.champion_name,
        image_url: row.image_url,
        patch_id: row.patch_id,
        patch_title: row.patch_title,
        patch_url: row.patch_url,
        patch_published_at: row.patch_published_at,
        db_status: row.status,
        computed_status: computed,
      }
    })

    return NextResponse.json(data)
  } catch (err) {
    console.error('[GET /api/results]', err)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
