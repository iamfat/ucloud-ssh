FROM node:8-alpine
MAINTAINER Jia Huang <iamfat@gmail.com>

ADD . /usr/src/app

RUN apk add --no-cache ncurses openssh-client bash
RUN apk add --no-cache --virtual .build-deps python make g++ \
    && cd /usr/src/app && rm -rf node_modules && npm i \
    && npm run build && npm prune \
    && apk del .build-deps

WORKDIR /usr/src/app

CMD ["npm", "run", "start"]
