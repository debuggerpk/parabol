import flag from 'node-env-flag'
import readCert from './readCert'

export default function getRethinkConfig() {
  const urlString = `rethinkdb://${process.env.RETHINKDB_HOST}:${process.env.RETHINKDB_PORT}/${process.env.RETHINKDB_DB}`
  if (!urlString)
    throw new Error(
      'HOST: ' +
        process.env.RETHINKDB_HOST +
        ', PORT: ' +
        process.env.RETHINKDB_PORT +
        ', DB:' +
        process.env.RETHINKDB_DB +
        ', Invalid RETHINKDB_URL in ENV'
    )
  const config = {
    host: process.env.RETHINKDB_HOST || '',
    port: 28015,
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
