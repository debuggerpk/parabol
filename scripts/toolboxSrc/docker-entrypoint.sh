#!/bin/sh
set -e

export RETHINKDB_CLUSTER_IP_ADDR=$(nslookup ${RETHINKDB_SVC_NAME:=rethinkdb} 127.0.0.1 2>/dev/nul|awk '{print $3}'|egrep -v "(127.0.0.1|^$|$(hostname -i))"|sort|head -1)
export RETHINKDB_CLUSTER_PORT=29015

exec su-exec daemon:daemon rethinkdb --bind all -d /data -n ${HOSTNAME} \
                                     --server-tag ${RETHINKDB_TAGS:=default} \
                                     --join "${RETHINKDB_CLUSTER_ADDR:=localhost}:${RETHINKDB_CLUSTER_PORT:=29015}" \
                                     --join-delay $((RANDOM%50+9)) \
                                     --cluster-reconnect-timeout 600