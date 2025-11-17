# WhichSkin?

WhichSkin? est une application Next.js permettant de parier des tokens sur les prochains skins susceptibles d’apparaître dans les patchs de League of Legends.  
L’application inclut un système de paris, le scraping automatique des patchs, une roue de gains, ainsi que plusieurs pages d’information.

---

## Disclaimer

Étant débutant en JavaScript et Next.js, développer une application complète comme celle-ci a été un vrai défi. Certaines parties étaient accessibles, mais d’autres beaucoup plus techniques.  
Pour progresser et surmonter certaines difficultés, j’ai utilisé une IA comme outil d’assistance : pour mieux comprendre des notions, déboguer et m’aider sur les fonctionnalités les plus complexes.  
J’ai toutefois pris soin de comprendre et d’adapter chaque partie du code, et une bonne portion de la logique a été écrite par moi-même.  
La récupération automatique des patchs (scraping, parsing, insertion en base) est notamment la partie où l’assistance m’a été la plus utile.

---

## Fonctionnalités principales

- **Accueil (`/`)**  
  Présente l’application, le dernier patch récupéré et les accès rapides.

- **Paris (`/bets`)**  
  Création de paris, historique détaillé des mises, statut géré automatiquement.

- **Résultats (`/result`)**  
  Compare chaque pari au patch suivant pour déterminer si le pari est gagné ou perdu.

- **Patchs (`/patches`)**  
  Affichage des patchs scrapés automatiquement ainsi que leurs skins associés.

- **Champions (`/champions`)**  
  Liste des champions avec image et pick rate.

- **Wheel of Fortune (`/wheel`)**  
  Une roue offrant des tokens gratuits toutes les 60 secondes.

- **Connexion / Inscription (`/login`, `/register`)**  
  Permet de définir un pseudo utilisé dans l’application (stocké localement).


## Axes d’amélioration

- **Attribution automatique des tokens** : créditer directement les gains lorsque qu’un pari passe en statut "won".
- **Espace administrateur** : comptes admin, gestion des patchs, vérification manuelle des résultats, suppression/édition des paris.
- **Leaderboard** : classement global basé sur les gains, statistiques publiques des joueurs.

---

## Prérequis

Pour que l’application fonctionne, vous devez disposer :

- d’une base de données **MySQL** opérationnelle  
- d’un fichier `.env` contenant les informations de connexion  
- des tables suivantes importées :
  - `champions`
  - `bets`
  - `patches`
  - `patch_skins`

Le fichier `bdd.sql` doit être importé dans une base nommée **whichskin**.  
Pensez également à ajuster les identifiants dans `db.ts`.

Sans cette base, l’application **ne peut pas fonctionner** (API, paris, patchs…).

---

## Installation & Démarrage

```bash
git clone https://github.com/ton-repo/WhichSkin
cd WhichSkin
npm install
npm run dev
