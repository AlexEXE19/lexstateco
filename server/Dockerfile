# Folosim Node ca imagine de bază
FROM node:20

# Setăm directorul de lucru
WORKDIR /app

# Copiem package.json și package-lock.json
COPY package*.json ./

# Instalăm dependențele
RUN npm install

# Copiem tot codul sursă
COPY . .

# Expunem portul pe care rulează backend-ul
EXPOSE 5000

# Comanda pentru a porni backend-ul
CMD ["npm", "run", "dev", "--prefix", "."]
