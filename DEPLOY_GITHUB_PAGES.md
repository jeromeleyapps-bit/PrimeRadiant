# Guide de Déploiement PWA sur GitHub Pages

Suivez ces étapes pour mettre **Prime Radiant** en ligne gratuitement et le rendre installable sur mobile.

## Étape 1 : Préparer les fichiers (Local)
Assurez-vous que votre dossier `Prime Radiant` contient bien tous les fichiers finaux :
- `index_final.html` (Renommez-le en `index.html` pour que ce soit la page d'accueil par défaut)
- `schrodinger_engine_v3.js`
- `radiant_visualizer_v5.js`
- `param_dictionary_l4.js`
- `manifest.json`
- `sw.js`
- `instructions_run.json` (optionnel)

> **Action recommandée** : Renommez `index_final.html` en `index.html` maintenant. Cela simplifie l'URL (ex: `votre-nom.github.io/PrimeRadiant/` au lieu de `.../index_final.html`).

## Étape 2 : Créer le Dépôt Git
1. Ouvrez un terminal dans le dossier du projet.
2. Initialisez Git :
   ```sh
   git init
   git add .
   git commit -m "Version Finale 7.2 - PWA Ready"
   ```

## Étape 3 : Envoyer sur GitHub
1. Allez sur [github.com/new](https://github.com/new) et connectez-vous.
2. Nommez le dépôt `PrimeRadiant` (Public).
3. Ne cochez rien (pas de README, pas de license), créez le dépôt.
4. Copiez les commandes proposées par GitHub ("...or push an existing repository..."). Elles ressemblent à :
   ```sh
   git remote add origin https://github.com/VOTRE_USER/PrimeRadiant.git
   git branch -M main
   git push -u origin main
   ```
5. Exécutez-les dans votre terminal.

## Étape 4 : Activer GitHub Pages
1. Sur la page de votre dépôt GitHub, allez dans l'onglet **Settings** (Paramètres).
2. Dans le menu de gauche, cliquez sur **Pages**.
3. Dans la section **Build and deployment** > **Branch** :
   - Sélectionnez `main`.
   - Laissez le dossier sur `/(root)`.
   - Cliquez sur **Save**.
4. Attendez environ 1 à 2 minutes. Rafraîchissez la page. GitHub vous affichera :
   > "Your site is live at https://votre-user.github.io/PrimeRadiant/"

## Étape 5 : Installation PWA (Mobile/Tablette)
1. Ouvrez l'URL fournie par GitHub sur votre smartphone (Chrome sur Android ou Safari sur iOS).
2. **Android** : Une bannière peut apparaître "Ajouter Prime Radiant à l'écran d'accueil". Sinon, menu (3 points) > "Installer l'application".
3. **iOS** : Bouton Partage (Carré avec flèche) > "Sur l'écran d'accueil".

✨ **Bravo !** Vous avez maintenant l'application installée, qui fonctionne hors ligne et en plein écran.
