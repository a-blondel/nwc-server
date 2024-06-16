FROM ghcr.io/a-blondel/node:0.10.33-jessie

WORKDIR /app

COPY package*.json ./

RUN npm install --production \
    && npm cache clean --force

COPY app.js .
COPY controllers controllers
COPY utils utils

RUN mkdir certs

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["npm", "run"]
CMD ["start-http"]