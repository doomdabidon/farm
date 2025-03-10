FROM node:22-alpine

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json
COPY ./task5/src src

RUN npm install
RUN npm install -g ts-node

CMD [ "npx", "ts-node", "src/gameserver/index.ts" ]