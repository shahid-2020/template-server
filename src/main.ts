import { core } from './core'
import 'reflect-metadata'
import './shared/constant/global'
import './shared/db'
import { container } from 'tsyringe'
import express from 'express'
import dotenv from 'dotenv'
import config from 'config'
import helmet from 'helmet'
import cors from 'cors'
import xss from 'xss-clean'
import rateLimit from 'express-rate-limit'
import hpp from 'hpp'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import ErrorMiddleware from './shared/middleware/error.middleware'
import Logger from './shared/logger/logger'
import AuthController from './infrastructure/controller/auth.controller'
import HealthController from './infrastructure/controller/health.controller'
import UserController from './infrastructure/controller/user.controller'

async function bootstrap(): Promise<void> {
  dotenv.config()

  const port = config.get('PORT') as number

  const app = express()

  Sentry.init({
    dsn: config.get('SENTRY_DSN'),
    release: `${config.get('npm_package_name')}@${config.get(
      'npm_package_version'
    )}`,
    environment: config.get('NODE_ENV'),
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
  })

  app.use(Sentry.Handlers.requestHandler())
  app.use(Sentry.Handlers.tracingHandler())

  const logger = container.resolve(Logger)
  const errorMiddleware = container.resolve(ErrorMiddleware)
  const healthController = container.resolve(HealthController)
  const authController = container.resolve(AuthController)
  const userController = container.resolve(UserController)

  const apiLimiter = rateLimit({
    max: 50, // Limit each IP to 50 requests per `window` (here, per 1 minutes)
    windowMs: 1 * 60 * 1000, // 1 minutes
    message: 'Too many requests!',
    standardHeaders: true,
    legacyHeaders: false,
  })

  app.use(express.json({ limit: '5mb' }))
  app.use(express.urlencoded({ extended: false, limit: '5mb' }))
  app.use(cors({ origin: true, credentials: true }))
  app.use(helmet())
  app.use(xss())
  app.use(hpp({ whitelist: [] }))
  app.use(apiLimiter)

  app.use('/api/v1/health', healthController.routes())
  app.use('/api/v1/auth', authController.routes())
  app.use('/api/v1/user', userController.routes())

  app.use(Sentry.Handlers.errorHandler())
  core()
  app.use([errorMiddleware.routeNotFound, errorMiddleware.processErrors])
  app.listen(port, () => logger.info(`Application started at port ${port}`))
}

bootstrap()

//TODO Process errors globally
//TODO Use decorators for route mapping
//TODO Complete unit of work
//TODO Write test cases of current flow
