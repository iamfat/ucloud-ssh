FROM node:alpine
MAINTAINER Jia Huang <iamfat@gmail.com>

ADD . /usr/src/app

RUN apk add --no-cache ncurses python make g++ openssh-client bash \
    && cd /usr/src/app && rm -rf node_modules && npm i \
    && npm run build && npm prune \
    && apk del python make g++

WORKDIR /usr/src/app

CMD ["npm", "run", "start"]
