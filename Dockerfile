FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY app.js .
COPY controllers controllers
COPY utils utils

EXPOSE 80

CMD ["node", "app.js"]