import path from 'path'
import * as migrate from 'rethinkdb-ts-migrate'
import {parse} from 'url'
import getProjectRoot from '../webpack/utils/getProjectRoot'

const startMigration = async () => {
  const name = process.argv[2]
  const {hostname, port, path: rethinkPath} = parse(
    `rethinkdb://${process.env.RETHINKDB_HOST}:${process.env.RETHINKDB_PORT}/${process.env.RETHINKDB_DB}`
  )
  const PROJECT_ROOT = getProjectRoot()
  const DB_ROOT = path.join(PROJECT_ROOT, 'packages/server/database')
  process.env.host = process.env.RETHINKDB_HOST
  process.env.port = process.env.RETHINKDB_PORT
  process.env.db = process.env.RETHINKDB_DB
  process.env.r = process.cwd()
  try {
    await migrate.create(name, DB_ROOT)
  } catch (e) {
    process.exit()
  }
  process.exit()
}

startMigration()
