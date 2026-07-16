# 🅿️ DakarPark — Frontend

Application de **gestion et d'optimisation du stationnement urbain avec paiement mobile** pour la Ville de Dakar.

Frontend développé avec **Angular 18**. Ce dépôt contient l'interface utilisateur (automobilistes) et l'espace agent municipal.

> Projet réalisé dans le cadre du mémoire de Licence en Génie Informatique — ISI.
> Auteur : **Khadim Diakhaté** · Sous la direction de **M. Ibrahima LO**.

> 🛠️ **Pour Git, Docker, Jenkins et SonarQube** (et les captures d'écran du mémoire),
> suivez le guide détaillé : **[GUIDE-DEVOPS.md](GUIDE-DEVOPS.md)**

---

## 📋 Prérequis

- **Node.js** 20 ou supérieur — [télécharger](https://nodejs.org)
- **npm** 10+ (installé avec Node.js)
- (optionnel) **Docker** et **Jenkins** pour le déploiement

Vérifiez votre installation :

```bash
node --version
npm --version
```

---

## 🚀 Lancer l'application en local

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer le serveur de développement
npm start
```

L'application s'ouvre automatiquement sur **http://localhost:4200**.

---

## 📸 Pages disponibles (pour les captures d'écran du mémoire)

| Interface | URL | Figure du mémoire |
|-----------|-----|-------------------|
| Page d'accueil | `/` | Figure 16 |
| Inscription | `/inscription` | Figure 17 |
| Connexion | `/connexion` | Figure 18 |
| Carte / géolocalisation | `/carte` | Figure 19 |
| Réservation + paiement mobile | `/reservation/1` | Figure 20 |
| Tableau de bord agent | `/agent` | Figure 21 |
| Mes réservations | `/mes-reservations` | — |

**Astuce pour de belles captures :** utilisez `F11` (plein écran) et l'outil de capture de Windows (`Win + Maj + S`) ou de votre navigateur.

---

## 🏗️ Compiler pour la production

```bash
npm run build
```

Les fichiers optimisés sont générés dans `dist/stationnement-dakar/browser/`.

---

## 🐙 Mettre le projet sur Git / GitHub

```bash
# Initialiser le dépôt
git init
git add .
git commit -m "Initial commit — Frontend DakarPark"

# Lier à votre dépôt GitHub (créez-le d'abord sur github.com)
git branch -M main
git remote add origin https://github.com/VOTRE-COMPTE/dakarpark-frontend.git
git push -u origin main
```

Un workflow **GitHub Actions** (`.github/workflows/ci.yml`) compile automatiquement le projet à chaque `push`.

---

## 🐳 Lancer avec Docker

```bash
# Construire l'image
docker build -t dakarpark-frontend .

# Lancer le conteneur
docker run -d -p 8080:80 --name dakarpark-frontend dakarpark-frontend
```

Ou avec Docker Compose :

```bash
docker compose up -d --build
```

L'application est alors disponible sur **http://localhost:8080**.

---

## 🔧 Pipeline Jenkins (CI/CD)

Le fichier `Jenkinsfile` décrit un pipeline complet :

1. **Checkout** — récupération du code depuis Git
2. **Install** — installation des dépendances (`npm ci`)
3. **Build** — compilation Angular
4. **Archivage** — sauvegarde des artefacts
5. **Docker** — construction de l'image
6. **Déploiement** — lancement du conteneur

### Configuration dans Jenkins

1. Créez un nouveau projet de type **Pipeline**.
2. Dans **Pipeline > Definition**, choisissez **Pipeline script from SCM**.
3. Indiquez l'URL de votre dépôt Git.
4. Chemin du script : `Jenkinsfile`.
5. Lancez le build.

---

## 📁 Structure du projet

```
stationnement-dakar/
├── src/
│   ├── app/
│   │   ├── components/       # Composants partagés (navbar)
│   │   ├── models/           # Modèles de données (diagramme de classes)
│   │   ├── pages/            # Les 7 écrans de l'application
│   │   ├── services/         # Données simulées + authentification
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── styles.css            # Design system global
│   └── index.html
├── Dockerfile                # Image Docker (build + nginx)
├── docker-compose.yml
├── nginx.conf                # Config nginx (routing SPA)
├── Jenkinsfile               # Pipeline CI/CD
└── .github/workflows/ci.yml  # GitHub Actions
```

---

## 🔌 Connexion au backend Laravel

Les données sont actuellement **simulées** (`src/app/services/data.service.ts`) pour permettre la démonstration sans backend.

Pour connecter l'API Laravel, remplacez les méthodes du service par des appels HTTP :

```typescript
// Exemple
constructor(private http: HttpClient) {}

getZones() {
  return this.http.get<ZoneStationnement[]>('http://localhost:8000/api/zones');
}
```

---

## 🛠️ Technologies

- **Angular 18** (standalone components, signals)
- **TypeScript 5.5**
- **CSS** (design system maison, sans framework)
- **Docker** + **nginx**
- **Jenkins** / **GitHub Actions**

---

*DakarPark © 2026 — Ville de Dakar*
