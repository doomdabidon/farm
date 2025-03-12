FROM node:22-alpine

WORKDIR /alex
COPY ./src ./src
COPY package.json ./
COPY tsconfig.json ./
RUN npm install
RUN npm i -D ts-node

CMD ["npm", "run", "server"]