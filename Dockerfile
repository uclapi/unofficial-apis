FROM node:lts-alpine

WORKDIR /usr/src/server

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE ${PORT}

USER node
CMD [ "npm", "run", "start" ]
