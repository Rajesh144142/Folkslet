FROM node:18-alpine

WORKDIR /app

COPY Socket/package*.json ./Socket/

WORKDIR /app/Socket

RUN npm ci --omit=dev

WORKDIR /app

COPY Server/utils ./Server/utils
COPY Server/config ./Server/config
COPY Socket/ ./Socket/

WORKDIR /app/Socket

EXPOSE 8800

CMD ["node", "index.js"]

