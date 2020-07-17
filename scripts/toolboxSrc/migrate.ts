import path from 'path'
import * as migrate from 'rethinkdb-ts-migrate'
import {parse} from 'url'
import getProjectRoot from '../webpack/utils/getProjectRoot'

const startMigration = async () => {
  const [, , direction = 'up'] = process.argv
  // migrating up goes all the way, migrating down goes down by 1
  const all = direction === 'up'
  if (process.env.NODE_ENV === 'test') {
    console.log('NODE_ENV is test, loading .env.test...')
  }
  const PROJECT_ROOT = getProjectRoot()
  const DB_ROOT = path.join(PROJECT_ROOT, 'packages/server/database')
  const {hostname, port, path: urlPath} = parse(
    `rethinkdb://${process.env.RETHINKDB_HOST}:${process.env.RETHINKDB_PORT}/${process.env.RETHINKDB_DB}`
  )
  process.env.host = process.env.RETHINKDB_HOST
  process.env.port = process.env.RETHINKDB_PORT
  process.env.db = process.env.RETHINKDB_DB
  process.env.r = process.cwd()
  try {
    await migrate[direction]({all, root: DB_ROOT})
  } catch (e) {
    console.error('Migration error', e)
    process.exit()
  }
  process.exit()
}

startMigration().catch(console.log)
