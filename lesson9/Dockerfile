FROM node:22-alpine

WORKDIR /farm-app
COPY package*.json ./
RUN npm install

COPY ./src src

CMD ["npm", "run", "server"]