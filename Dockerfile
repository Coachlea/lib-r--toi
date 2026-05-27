FROM node:18-alpine

WORKDIR /app

COPY . .

RUN node -v

CMD node server.js
