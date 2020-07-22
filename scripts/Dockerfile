FROM node:13.6.0

RUN mkdir -p /parabol/node_modules && mkdir -p /home/node/.npm-global

RUN chown -R node:node /home/node && chown -R node:node /parabol

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
WORKDIR /parabol/

RUN rm -rf dev

USER node

COPY --chown=node:node . .

EXPOSE 3000

CMD ["sh", "scripts/start.sh"]