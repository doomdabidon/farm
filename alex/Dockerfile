FROM node:22-alpine

WORKDIR /alex
COPY ./lesson5 ./
COPY package.json ./
RUN npm install

CMD ["npm", "run", "server"]