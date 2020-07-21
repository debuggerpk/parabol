#!/bin/sh

source /home/node/app/.env

printenv

npm install -g yarn

yarn && yarn dev