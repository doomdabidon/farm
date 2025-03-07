FROM node:22-alpine

WORKDIR /farm-app
COPY package*.json ./
RUN npm install

COPY tsconfig.json ./

COPY ./src src

RUN npm run build

# COPY ./dist/src src

CMD ["node", "./dist/src/server.js"]