# 🛠️ Guide DevOps — Git, Docker, Jenkins, SonarQube

Ce guide vous accompagne pas à pas pour mettre le projet en place et obtenir les **4 captures d'écran** nécessaires au mémoire :

| Capture | Figure du mémoire |
|---------|-------------------|
| Dépôt GitHub | Figure 12 |
| Conteneurs Docker | Figure 13 |
| Pipeline Jenkins | Figure 14 |
| Analyse SonarQube | Figure (tableau de bord qualité) |

---

## 📦 Prérequis

Installez ces outils s'ils ne sont pas déjà présents :

- **Git** — https://git-scm.com/downloads
- **Docker Desktop** — https://www.docker.com/products/docker-desktop
- **Node.js 20+** — https://nodejs.org

Vérification :

```bash
git --version
docker --version
node --version
```

---

## 1️⃣ GitHub — mettre le projet en ligne

### Étape 1 : créer le dépôt sur GitHub

1. Allez sur https://github.com et connectez-vous.
2. Cliquez sur **New repository** (bouton vert).
3. Nom : `dakarpark-frontend`
4. Description : `Application de gestion et d'optimisation du stationnement urbain — Ville de Dakar`
5. Laissez **Public**, ne cochez rien d'autre.
6. Cliquez **Create repository**.

### Étape 2 : pousser le code

Dans le dossier du projet, ouvrez un terminal :

```bash
git init
git add .
git commit -m "Initial commit — Frontend DakarPark (Angular 18)"
git branch -M main
git remote add origin https://github.com/VOTRE-COMPTE/dakarpark-frontend.git
git push -u origin main
```

> Remplacez `VOTRE-COMPTE` par votre nom d'utilisateur GitHub.
> GitHub demandera vos identifiants : utilisez un **token d'accès personnel**
> (Settings → Developer settings → Personal access tokens → Generate new token).

### 📸 Capture n°1 — Dépôt GitHub

Rafraîchissez la page de votre dépôt. Vous verrez la liste des fichiers, le README affiché, le nombre de commits.

**Capturez cette page** → c'est la **Figure 12**.

> 💡 Bonus : faites 2 ou 3 commits supplémentaires pour que l'historique paraisse plus réaliste.

---

## 2️⃣ Docker — conteneuriser l'application

### Étape 1 : construire l'image

```bash
docker build -t dakarpark-frontend .
```

Patientez (2 à 4 minutes la première fois).

### Étape 2 : lancer le conteneur

```bash
docker run -d --name dakarpark-frontend -p 8080:80 dakarpark-frontend
```

Vérifiez que l'application tourne : ouvrez **http://localhost:8080**

### Étape 3 : vérifier

```bash
docker ps
```

### 📸 Capture n°2 — Conteneurs Docker

Deux options :

- **Docker Desktop** → onglet **Containers** : vous voyez `dakarpark-frontend` avec son statut *Running*, le port, l'image. **C'est la plus jolie capture.**
- Ou le terminal avec `docker ps`.

**Capturez** → c'est la **Figure 13**.

> 💡 Si vous lancez aussi Jenkins et SonarQube (étape suivante), la liste contiendra
> plusieurs conteneurs — la capture sera encore plus parlante.

---

## 3️⃣ Jenkins — pipeline CI/CD

### Étape 1 : lancer Jenkins et SonarQube

```bash
docker compose -f docker-compose.devops.yml up -d
```

Cela démarre **Jenkins** (port 8081) et **SonarQube** (port 9000).
Patientez 2 à 3 minutes au premier lancement.

### Étape 2 : configurer Jenkins

1. Ouvrez **http://localhost:8081**
2. Récupérez le mot de passe initial :
   ```bash
   docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   ```
3. Collez-le, puis choisissez **Install suggested plugins**.
4. Créez votre compte administrateur.

### Étape 3 : installer les plugins nécessaires

**Administrer Jenkins → Plugins → Available plugins**, cherchez et installez :

- `SonarQube Scanner`
- `Docker Pipeline`
- `NodeJS`

Redémarrez Jenkins après l'installation.

### Étape 4 : configurer les outils

**Administrer Jenkins → Tools** :

- **NodeJS installations** → Ajouter → Nom : `Node20`, cocher *Install automatically*, version 20.
- **SonarQube Scanner installations** → Ajouter → Nom : `SonarScanner`, cocher *Install automatically*.

### Étape 5 : créer le pipeline

1. **Nouveau Item** → nom : `dakarpark-frontend` → type **Pipeline** → OK.
2. Section **Pipeline** :
   - Definition : **Pipeline script from SCM**
   - SCM : **Git**
   - Repository URL : `https://github.com/VOTRE-COMPTE/dakarpark-frontend.git`
   - Branch : `*/main`
   - Script Path : `Jenkinsfile`
3. **Enregistrer**, puis **Lancer un build**.

### 📸 Capture n°3 — Pipeline Jenkins

Une fois le build terminé, la page du projet affiche le **Stage View** : un tableau avec toutes les étapes (Checkout, Installation, Build, SonarQube, Docker, Déploiement) et leur durée, en vert.

**Capturez cette vue** → c'est la **Figure 14**.

> ⚠️ Si certaines étapes échouent (SonarQube pas encore configuré, Docker inaccessible),
> ce n'est pas grave pour la capture. Mais pour un rendu propre, voyez la section
> **Dépannage** plus bas.

---

## 4️⃣ SonarQube — analyse de la qualité du code

### Étape 1 : accéder à SonarQube

1. Ouvrez **http://localhost:9000**
2. Identifiants par défaut : `admin` / `admin`
3. Changez le mot de passe quand il le demande.

### Étape 2 : créer le projet

1. **Create Project** → **Manually**
2. Project key : `dakarpark-frontend`
3. Display name : `DakarPark — Frontend Angular`
4. **Set Up** → **Locally** → générez un **token**, copiez-le.

### Étape 3 : lancer l'analyse

**Option A — directement (le plus simple pour la capture) :**

```bash
npx sonarqube-scanner \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=VOTRE_TOKEN
```

**Option B — via Jenkins :**

1. Dans Jenkins : **Administrer Jenkins → System → SonarQube servers**
2. Ajoutez un serveur : Nom `SonarQube`, URL `http://sonarqube:9000`, et le token en credential (type *Secret text*).
3. Relancez le pipeline.

### 📸 Capture n°4 — Tableau de bord SonarQube

Après l'analyse, le tableau de bord affiche : bugs, vulnérabilités, code smells, couverture, duplication, et le **Quality Gate** (Passed/Failed).

**Capturez cette page** → figure qualité du code.

---

## 🔧 Dépannage

| Problème | Solution |
|----------|----------|
| `docker: permission denied` | Lancez Docker Desktop, ou sous Linux : `sudo usermod -aG docker $USER` puis reconnectez-vous |
| Jenkins ne trouve pas `npm` | Vérifiez la configuration **Tools → NodeJS installations** (nom `Node20`) |
| Jenkins ne peut pas lancer Docker | Le volume `/var/run/docker.sock` doit être monté (c'est déjà dans `docker-compose.devops.yml`) |
| SonarQube ne démarre pas | Augmentez la mémoire Docker (Settings → Resources → 4 Go minimum) |
| Erreur `vm.max_map_count` (Linux) | `sudo sysctl -w vm.max_map_count=262144` |
| Port déjà utilisé | Changez le port dans le `docker-compose`, ex. `8082:8080` |

---

## 🧹 Arrêter les services

```bash
# Arrêter la stack DevOps
docker compose -f docker-compose.devops.yml down

# Arrêter l'application
docker rm -f dakarpark-frontend
```

---

## ✅ Récapitulatif des captures

Une fois les 4 captures prises, vous aurez :

- ✅ **Figure 12** — Dépôt GitHub du projet
- ✅ **Figure 13** — Conteneurs sur Docker
- ✅ **Figure 14** — Pipeline Jenkins
- ✅ **Figure qualité** — Tableau de bord SonarQube

Elles remplaceront les images actuellement empruntées au mémoire de référence.

---

*DakarPark © 2026 — Khadim Diakhaté · ISI*
