import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function GET() {
  try {
    console.log('[API PATCHES] Scraping Riot...')
    const res = await fetch('https://www.leagueoflegends.com/en-us/news/tags/patch-notes/')
    const html = await res.text()
    const $ = cheerio.load(html)

    const patches: { id: number; title: string; date: string; url: string }[] = []

    // ✅ Sélecteur plus fiable et adaptatif
    $('a[href*="/en-us/news/game-updates/patch-"]').each((i, el) => {
      if (i >= 5) return // Limite à 5 patchs

      const href = $(el).attr('href')
      const fullUrl = href?.startsWith('http')
        ? href
        : `https://www.leagueoflegends.com${href}`

      // ✅ Le titre se trouve souvent dans <h2> ou dans un attribut aria-label
      const title =
        $(el).find('h2').text().trim() ||
        $(el).attr('aria-label') ||
        'Patch inconnu'

      // ✅ La date est souvent dans <time datetime="...">
      const timeTag = $(el).find('time').attr('datetime')
      const rawDate = timeTag || $(el).find('time').text().trim() || ''
      const formattedDate = rawDate
        ? new Date(rawDate).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })
        : 'Date inconnue'

      patches.push({
        id: i + 1,
        title,
        date: formattedDate,
        url: fullUrl ?? '',
      })
    })

    console.log('[API PATCHES] Patchs trouvés :', patches.length)
    return NextResponse.json({ patches })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[API PATCHES] Erreur :', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
