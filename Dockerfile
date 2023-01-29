FROM node:18.13-alpine

RUN apk add --no-cache bash

RUN npm i -g @nestjs/cli

USER node

WORKDIR /app