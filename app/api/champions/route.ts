import { NextResponse } from 'next/server'
import { db } from '../../../db'
import type { RowDataPacket } from 'mysql2'

export async function GET() {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT id, name, image_url,pick_rate FROM champions ORDER BY name'
    )

    return NextResponse.json(rows)
  } catch (err) {
    console.error('Erreur récupération champions :', err)
    return NextResponse.json(
      { error: 'Impossible de récupérer les champions' },
      { status: 500 }
    )
  }
}
