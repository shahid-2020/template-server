import { container } from 'tsyringe'
import { getConnectionManager } from 'typeorm'
import Database from './database'
import Redis from './redis'

(async () => {
  const db = container.resolve(Database)
  const redis = container.resolve(Redis)
  await Promise.all([db.connectPg(), redis.connectRedis()])
  const connectionManager = getConnectionManager()
  const connection = connectionManager.get('default')
  await connection.runMigrations()
})()
 