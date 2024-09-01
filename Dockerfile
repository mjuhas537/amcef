# Použitie oficiálneho Node.js image ako základného image
FROM node:18

# Nastavenie pracovného adresára v kontajneri
WORKDIR /src/app

# Kopírovanie package.json a package-lock.json do kontajnera
COPY package*.json ./

# Inštalácia závislostí
RUN npm install

# Kopírovanie zdrojového kódu aplikácie do kontajnera
COPY . .

# Skopírujeme všetky TypeScript súbory (ak používate TypeScript)
RUN npm run build

# Expozícia portu, na ktorom aplikácia beží, ak mam lokalnu db
#EXPOSE 3000 

# Definovanie príkazu pre spustenie aplikácie
CMD ["npm","run","startInsadeDocker"]