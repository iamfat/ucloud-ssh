FROM node:alpine
MAINTAINER Jia Huang <iamfat@gmail.com>

ADD . /usr/src/app

RUN apk add --no-cache ncurses python make g++ openssh-client bash \
    && cd /usr/src/app && rm -rf node_modules && npm i \
    && apk del python make g++\
    && npm run build

WORKDIR /usr/src/app

ENTRYPOINT ['/usr/local/bin/npm', 'run', 'start']
