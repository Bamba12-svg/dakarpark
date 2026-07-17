# ============================================================
#  DakarPark — Frontend Angular
#  Dockerfile multi-stage : build Angular puis service via nginx
# ============================================================

# ---- Étape 1 : build ----
FROM node:20-alpine AS build
WORKDIR /app

# Installer les dépendances (cache optimisé)
# npm ci garantit une installation reproductible à partir du package-lock.json.
# Le repli sur npm install évite l'échec du build en cas de désynchronisation du lock.
COPY package*.json ./
RUN npm ci || npm install

# Copier le code et compiler en production
COPY . .
RUN npm run build

# ---- Étape 2 : service web ----
FROM nginx:1.27-alpine

# Configuration nginx (routing SPA Angular)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers compilés
COPY --from=build /app/dist/stationnement-dakar/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
