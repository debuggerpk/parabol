FROM node:13.6.0 as base

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

RUN mkdir -p /parabol/node_modules && mkdir -p /home/node/.npm-global

WORKDIR /parabol/
ADD package.json .
ADD yarn.lock .
COPY . .
RUN chown -Rh node:node /home/node && chown -Rh node:node /parabol

FROM base as dev
RUN cp scripts/entrypoint.dev.sh /bin/entrypoint
RUN chmod +x /bin/entrypoint
USER node
ENTRYPOINT [ "entrypoint" ]
EXPOSE 3000
CMD ["yarn", "dev", "-i"]

FROM base as prod
RUN scripts/entrypoint.prod.sh /bin/entrypoint
RUN chmod +x /bin/entrypoint
USER node
ENTRYPOINT [ "entrypoint" ]
EXPOSE 80
CMD ["yarn", "start"]