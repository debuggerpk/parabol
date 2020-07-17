FROM node:13-alpine

RUN mkdir -p /home/node/app/node_modules && mkdir -p /home/node/.npm-global && chown -R node:node /home/node

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
WORKDIR /home/node/app

USER node

COPY --chown=node:node . .

EXPOSE 3000
CMD ["sh", "scripts/start.sh"]