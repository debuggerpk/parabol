import flag from 'node-env-flag'
import {parse} from 'url'
import readCert from './readCert'

export default function getRethinkConfig() {
  const urlString = `rethinkdb://${process.env.RETHINKDB_HOST}:${process.env.RETHINKDB_PORT}/${process.env.RETHINKDB_DB}`
  if (!urlString) throw new Error('Invalid RETHINKDB_URL in ENV')
  const u = parse(urlString)
  if (!u.port || !u.path) throw new Error('Invalid RethinkDB URL')
  const config = {
    host: process.env.RETHINKDB_HOST || '',
    port: parseInt(process.env.RETHINKDB_PORT || '', 10),
    authKey: process.env.RETHINKDB_AUTH_KEY || '',
    db: process.env.RETHINKDB_DB,
    min: process.env.NODE_ENV === 'production' ? 50 : 3,
    buffer: process.env.NODE_ENV === 'production' ? 50 : 3
  }

  if (process.env.NODE_ENV && flag(process.env.RETHINKDB_SSL)) {
    // we may need a cert for production deployment
    // Compose.io requires this, for example.
    // https://www.compose.io/articles/rethinkdb-and-ssl-think-secure/
    Object.assign(config, {
      ssl: {
        ca: readCert()
      }
    })
  }
  return config
}
