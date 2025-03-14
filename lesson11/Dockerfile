FROM node:22-alpine

WORKDIR /farm-app
COPY package*.json ./
RUN npm install

COPY tsconfig.json ./

COPY ./src src

RUN npm run build

COPY ./src/index.html dist/src

EXPOSE 8080 9229

CMD ["node", "--inspect=0.0.0.0:9229", "./dist/src/server.js"]