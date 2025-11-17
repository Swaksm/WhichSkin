import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import { db } from '@/db'
import type { ResultSetHeader, RowDataPacket } from 'mysql2'


type Champion = {
  id: number
  name: string
}

type DBPatchRow = RowDataPacket & {
  id: number
}


type SkinInfo = {
  name: string
  champion: string | null
  champion_id: number | null
}

type PatchInfo = {
  id: number
  title: string
  date: string
  url: string
  skins: SkinInfo[]
}

// Normalise une string (minuscules, sans accents)
function normalize(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

// Essaie de deviner le champion depuis le dernier mot du nom du skin
function matchByLastWord(skinName: string, champions: Champion[]) {
  // ex: "Flora Fatalis Soraka" -> "Soraka"
  // ex: "Prestige Eternal Aspect Zoe" -> "Zoe"
  const words = skinName.trim().split(/\s+/)
  const lastWordRaw = words[words.length - 1] || ''
  const lastWord = normalize(lastWordRaw.replace(/[^a-zA-Z']/g, '')) // enlève ponctuation

  if (!lastWord) return null

  for (const champ of champions) {
    const champNorm = normalize(champ.name)
    // match strict ou presque strict
    if (champNorm === lastWord) return champ

    // autoriser petites variations genre "neeko" vs "beeko":
    // si les 4 dernières lettres matchent
    if (
      champNorm.length >= 4 &&
      lastWord.length >= 4 &&
      lastWord.slice(-4) === champNorm.slice(-4)
    ) {
      return champ
    }
  }

  return null
}

// Fallback fuzzy : cherche un match partiel de >=4 lettres dans tout le skin
function matchFuzzyWholeString(skinName: string, champions: Champion[]) {
  const skinNorm = normalize(skinName)

  for (const champ of champions) {
    const champNorm = normalize(champ.name)

    // nom complet du champion trouvé dans le skin
    if (skinNorm.includes(champNorm)) {
      return champ
    }

    // sous-chaînes de 4 lettres consécutives
    for (let i = 0; i < champNorm.length - 3; i++) {
      const sub = champNorm.slice(i, i + 4)
      if (sub.length >= 4 && skinNorm.includes(sub)) {
        return champ
      }
    }
  }

  return null
}

// version finale: essaie d'abord last word, puis fuzzy
function findChampionForSkin(skinName: string, champions: Champion[]) {
  const byLastWord = matchByLastWord(skinName, champions)
  if (byLastWord) return byLastWord

  const fuzzy = matchFuzzyWholeString(skinName, champions)
  if (fuzzy) return fuzzy

  return null
}

// Extrait les skins depuis la page d'un patch
function extractSkinsFromPatch($: cheerio.CheerioAPI): string[] {
  const skins = new Set<string>()

  // Ancienne structure ("The following skins will be released ...")
  $('p').each((_, el) => {
    const text = $(el).text().toLowerCase()
    if (text.includes('the following skins will be released')) {
      $(el)
        .parent()
        .find('a, h3, strong')
        .each((_, link) => {
          const name = $(link).text().trim()
          if (name && !name.toLowerCase().includes('chromas')) {
            skins.add(name)
          }
        })
    }
  })

  // Nouvelle structure ("Upcoming Skins & Chromas")
  $('#patch-upcoming-skins-and-chromas')
    .closest('header')
    .next('.content-border')
    .find('.skin-title a')
    .each((_, el) => {
      const name = $(el).text().trim()
      if (name) skins.add(name)
    })

  return Array.from(skins)
}

async function savePatchToDb(patch: {
  title: string
  url: string
  publishedAt: Date | null
  skins: SkinInfo[]
}) {
  // 1) On regarde si le patch existe déjà via son URL
  const [rows] = await db.query<DBPatchRow[]>(
    'SELECT id FROM patches WHERE url = ? LIMIT 1',
    [patch.url]
  )

  const existing = rows[0]
  let patchId: number

  if (existing) {
    // Patch déjà en base -> on récupère juste son id
    patchId = existing.id
  } else {
    // 2) On insère le patch
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO patches (title, url, published_at) VALUES (?, ?, ?)',
      [patch.title, patch.url, patch.publishedAt]
    )

    patchId = result.insertId
  }

  // 3) On insère les skins (si déjà présents, le UNIQUE + INSERT IGNORE évitent les doublons)
  for (const skin of patch.skins) {
    await db.query(
      'INSERT IGNORE INTO patch_skins (patch_id, name, champion_id) VALUES (?, ?, ?)',
      [patchId, skin.name, skin.champion_id]
    )
  }

  return patchId
}


export async function GET() {
  try {
    // 1. Récup les champions BDD
    const [rows] = await db.query('SELECT id, name FROM champions')
    const champions = rows as Champion[]

    // 2. Récup la page liste des patchs
    const res = await fetch('https://www.leagueoflegends.com/en-us/news/tags/patch-notes/')
    const html = await res.text()
    const $ = cheerio.load(html)

    // 3. Prend les 3 derniers liens de patch
    const links: string[] = []
    $('a[href*="/en-us/news/game-updates/patch-"]').each((_, el) => {
      const href = $(el).attr('href')
      if (href && links.length < 3) {
        links.push(href.startsWith('http') ? href : `https://www.leagueoflegends.com${href}`)
      }
    })

        const patches: PatchInfo[] = []

    // 4. Pour chaque patch on scrape + map skins -> champion + save BDD
    for (const [i, url] of links.entries()) {
      const page = await fetch(url).then(r => r.text())
      const $page = cheerio.load(page)

      const title = $page('h1').first().text().trim() || `Patch ${i + 1}`

      const dateAttr = $page('time').attr('datetime')
      const publishedAt = dateAttr ? new Date(dateAttr) : null

      const date = publishedAt
        ? publishedAt.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })
        : 'Date inconnue'

      const rawSkins = extractSkinsFromPatch($page)

      const skins: SkinInfo[] = rawSkins.map(name => {
        const champ = findChampionForSkin(name, champions)
        return {
          name,
          champion: champ ? champ.name : null,
          champion_id: champ ? champ.id : null,
        }
      })

      // 👉 Sauvegarde en base (ne recrée rien si le patch existe déjà)
      await savePatchToDb({
        title,
        url,
        publishedAt,
        skins,
      })

      // Ce qui est renvoyé au front
      patches.push({
        id: i + 1,
        title,
        date,
        url,
        skins,
      })
    }


    return NextResponse.json({ patches })
  } catch (err) {
    console.error('Erreur PATCHES:', err)
    return NextResponse.json(
      { error: 'Erreur lors du chargement des patchs' },
      { status: 500 }
    )
  }
}
