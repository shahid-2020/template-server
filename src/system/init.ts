import 'reflect-metadata'
import '@system/constant/globals'
import '@shared/db/init'
import { logger } from '@shared/logger'

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at Promise ${promise}`)
  logger.error(JSON.stringify({ reason }))
  
})

process.on('uncaughtException', function (error) {
  logger.error('Uncaught Exception')
  logger.error(JSON.stringify({ error }))
})

process.on('SIGINT', function () {
  logger.error('Server Status: Inactive')
  process.exit(0)
})
