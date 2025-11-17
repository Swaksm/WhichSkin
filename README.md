Assurez-vous d’avoir :

une base MySQL opérationnelle

un fichier .env contenant les informations de connexion

les tables importées


-----------------------------


WhichSkin? est une application Next.js permettant de parier des tokens sur l’arrivée de skins dans les prochains patchs de League of Legends.
L’application inclut un système de paris, une analyse automatisée des patchs, une roue de gain de tokens, et diverses pages d’information.

Fonctionnalités principales


Page d’accueil (/) – Présente l’application, le dernier patch et l’accès rapide aux principales sections.

Paris (/bets) – Permet de créer un pari et d’afficher l’historique des mises.

Résultats (/result) – Montre si les paris sont gagnés ou perdus selon le patch suivant.

Patchs (/patches) – Liste les patchs récupérés automatiquement et leurs skins.

Champions (/champions) – Affiche tous les champions avec image et pick rate.
    
Wheel of Fortune (/wheel) – Donne des tokens gratuits via une roue toutes les 60 secondes.

Connexion / Inscription (/login, /register) – Permet de définir le pseudo utilisé sur l’application.

Démarrage rapide
git clone https://github.com/ton-repo/WhichSkin
cd WhichSkin
npm install
npm run dev
