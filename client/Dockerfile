# Folosim Node pentru build
FROM node:20 AS build

# Setăm directorul de lucru în container
WORKDIR /app

# Copiem package.json și package-lock.json
COPY package*.json ./

# Instalăm dependențele
RUN npm install

# Copiem restul codului frontend
COPY . .

# Construim aplicația React
RUN npm run build

# Folosim Nginx pentru a servi aplicația construită
FROM nginx:alpine

# Copiem build-ul React în folderul servit de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expunem portul 80
EXPOSE 80

# Pornim Nginx
CMD ["nginx", "-g", "daemon off;"]
