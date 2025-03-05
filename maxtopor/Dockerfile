FROM node:22-alpine

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY ./task5 task5

RUN npm install

CMD [ "node", "task5/index.js" ]