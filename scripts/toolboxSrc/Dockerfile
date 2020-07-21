FROM alpine:latest

ARG BUILD_DATE
ARG VCS_REF
ARG RETHINKDB_VERSION=2.3.6

LABEL org.label-schema.build-date=${BUILD_DATE} \
	  org.label-schema.vcs-url="https://github.com/mterron/rethinkdb.git" \
	  org.label-schema.vcs-ref=${VCS_REF} \
	  org.label-schema.schema-version="1.0.0-rc.1" \
	  org.label-schema.version=${RETHINKDB_VERSION} \
	  org.label-schema.description="Alpine based RethinkDB image"

ENV LANG="en_US.UTF-8" \
    LC_ALL="en_US.UTF-8" \
    LANGUAGE="en_US.UTF-8" \
    TIMEZONE="UTC" \
    RETHINKDB_TAGS="default" \
    RETHINKDB_SVC_NAME="rethinkdb"

COPY scripts/toolboxSrc/docker-entrypoint.sh /usr/local/bin/docker-entrypoint

# Install Rethinkdb for Alpine Linux
RUN apk --no-cache --update add rethinkdb su-exec \
 && apk --no-cache info -v | sed 's/-r\d*$//g' | sed 's/\(.*\)-/\1 /' > /etc/manifest.txt \
 && chmod a+x /usr/local/bin/docker-entrypoint \
 && mkdir data \
 && chown -R daemon:daemon /data

VOLUME /data

WORKDIR /data

# Ports: process cluster webui
EXPOSE	 28015   29015   8080

CMD ["docker-entrypoint"]