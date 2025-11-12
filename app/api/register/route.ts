// app/api/patches/route.ts
import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import { db } from '@/db' // lecture seule des champions

type Champion = { id: number; name: string }
type SkinInfo  = { name: string; champion: string | null; champion_id: number | null }
type PatchInfo = { id: number; title: string; date: string; url: string; skins: SkinInfo[] }

/* ------------------------------- utils texte ------------------------------- */

function normalize(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function matchByLastWord(skinName: string, champions: Champion[]) {
  const words = skinName.trim().split(/\s+/)
  const lastWordRaw = words[words.length - 1] || ''
  const lastWord = normalize(lastWordRaw.replace(/[^a-zA-Z']/g, ''))
  if (!lastWord) return null

  for (const champ of champions) {
    const champNorm = normalize(champ.name.trim())
    if (champNorm === lastWord) return champ

    if (champNorm.length >= 4 && lastWord.length >= 4 && lastWord.slice(-4) === champNorm.slice(-4)) {
      return champ
    }
  }
  return null
}

function matchFuzzyWholeString(skinName: string, champions: Champion[]) {
  const skinNorm = normalize(skinName)
  for (const champ of champions) {
    const champNorm = normalize(champ.name.trim())
    if (skinNorm.includes(champNorm)) return champ

    for (let i = 0; i < champNorm.length - 3; i++) {
      const sub = champNorm.slice(i, i + 4)
      if (sub.length >= 4 && skinNorm.includes(sub)) return champ
    }
  }
  return null
}

function findChampionForSkin(skinName: string, champions: Champion[]) {
  return matchByLastWord(skinName, champions) ?? matchFuzzyWholeString(skinName, champions)
}

function extractSkinsFromPatch($: cheerio.CheerioAPI): string[] {
  const skins = new Set<string>()

  // cas 1 : phrase "the following skins will be released"
  $('p').each((_, el) => {
    const text = $(el).text().toLowerCase()
    if (text.includes('the following skins will be released')) {
      $(el)
        .parent()
        .find('a, h3, strong')
        .each((_, link) => {
          const name = $(link).text().trim()
          if (name && !name.toLowerCase().includes('chromas')) skins.add(name)
        })
    }
  })

  // cas 2 : section "upcoming skins and chromas"
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

/* ----------------------------------- GET ----------------------------------- */

export async function GET() {
  try {
    // 1) lecture des champions pour le mapping des skins
    const [rows] = await db.query('SELECT id, name FROM champions')
    const champions = rows as Champion[]

    // 2) récup des liens des 3 derniers patch notes
    const listRes = await fetch('https://www.leagueoflegends.com/en-us/news/tags/patch-notes/', {
      cache: 'no-store',
    })
    if (!listRes.ok) {
      return NextResponse.json({ error: 'Impossible de charger la liste des patchs' }, { status: 502 })
    }
    const html = await listRes.text()
    const $ = cheerio.load(html)

    const links: string[] = []
    $('a[href*="/en-us/news/game-updates/patch-"]').each((_, el) => {
      if (links.length >= 3) return
      const href = $(el).attr('href')
      if (!href) return
      const url = href.startsWith('http') ? href : `https://www.leagueoflegends.com${href}`
      if (!links.includes(url)) links.push(url)
    })

    // 3) scrape des pages de patch + extraction des skins
    const patches: PatchInfo[] = []
    for (const [i, url] of links.entries()) {
      const pageHtml = await fetch(url, { cache: 'no-store' }).then(r => r.text())
      const $page = cheerio.load(pageHtml)

      const title = $page('h1').first().text().trim() || `Patch ${i + 1}`
      const dateAttr = $page('time').attr('datetime')
      const date = dateAttr
        ? new Date(dateAttr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
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

      patches.push({ id: i + 1, title, date, url, skins })
    }

    return NextResponse.json({ patches })
  } catch (err) {
    console.error('Erreur PATCHES:', err)
    return NextResponse.json({ error: 'Erreur lors du chargement des patchs' }, { status: 500 })
  }
}
