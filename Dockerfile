FROM node:lts-alpine

WORKDIR /usr/src/server

RUN mkdir -p dist 
COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE ${PORT}

CMD [ "npm", "run", "start" ]
