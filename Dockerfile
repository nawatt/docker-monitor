FROM node:6.4.0-slim

MAINTAINER Muhammad Al-Syrwan <mhdsyrwan@gmail.com>

RUN mkdir -p /var/app

WORKDIR /var/app

COPY package.json package.json

RUN npm install

VOLUME ["/var/app/data"]

COPY . .

CMD ["npm", "start"]
