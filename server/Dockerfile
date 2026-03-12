FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

COPY . .

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server.js"]
