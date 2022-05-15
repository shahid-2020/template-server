// import'module-alias/register'
// import 'source-map-support/register'
import '@system/init'
import { configService } from '@config'
import { container } from 'tsyringe'
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import xss from 'xss-clean'
import rateLimit from 'express-rate-limit'
import hpp from 'hpp'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import { logger } from '@shared/logger'
import ErrorMiddleware from '@shared/middleware/error.middleware'
import HealthController from '@controller/health.controller'
import AuthController from '@controller/auth.controller'
import UserController from '@controller/user.controller'
import { mapRoutes } from '@system/core'

async function bootstrap(): Promise<void> {
  const port = configService.get<number>('PORT')

  const app = express()

  Sentry.init({
    dsn: configService.get('SENTRY_DSN'),
    release: `${configService.get('npm_package_name')}@${configService.get(
      'npm_package_version'
    )}`,
    environment: configService.get('NODE_ENV'),
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
  })

  app.use(Sentry.Handlers.requestHandler())
  app.use(Sentry.Handlers.tracingHandler())

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

  app.use(apiLimiter)
  app.use(morgan('combined'))
  app.use(express.json({ limit: '5mb' }))
  app.use(express.urlencoded({ extended: false, limit: '5mb' }))
  app.use(cors({ origin: true, credentials: true }))
  app.use(helmet())
  app.use(xss())
  app.use(hpp({ whitelist: [] }))

  mapRoutes(app, [HealthController])
  // app.use('/api/v1/health', healthController.routes())
  app.use('/api/v1/auth', authController.routes())
  app.use('/api/v1/user', userController.routes())

  app.use(Sentry.Handlers.errorHandler())
  app.use([errorMiddleware.routeNotFound, errorMiddleware.processErrors])
  app.listen(port, () => logger.info(`Application started at port ${port}`))
}

bootstrap()

//TODO Use decorators for route mapping //class // http verb //midleware //versioning
//TODO Complete unit of work
//TODO Write test cases of current flow
