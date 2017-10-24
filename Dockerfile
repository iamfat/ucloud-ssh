FROM node:alpine
MAINTAINER Jia Huang <iamfat@gmail.com>

ADD . /usr/src/app

RUN apk add --no-cache ncurses python make g++ openssh-client bash \
    && cd /usr/src/app && npm i && npm run build \
    && apk del python make g++

WORKDIR /usr/src/app

ENTRYPOINT ['/usr/local/bin/npm', 'run', 'start']
