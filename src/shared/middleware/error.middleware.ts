import { Request, Response, NextFunction } from 'express'
import { autoInjectable } from 'tsyringe'
import { QueryFailedError } from 'typeorm'
import Logger from '@shared/logger'
import HttpException from '@shared/http/exception/exception.http'
import InternalServerException from '@shared/http/exception/internalServerException.http'
import NotFoundException from '@shared/http/exception/notFoundException.http'
import UnauthorizedException from '@shared/http/exception/unauthorizedException.http'
import UnprocessableEntityException from '@shared/http/exception/unprocessableEntityException.http'

@autoInjectable()
export default class ErrorMiddleware {
  constructor(private readonly logger: Logger) {
    this.routeNotFound = this.routeNotFound.bind(this)
    this.processErrors = this.processErrors.bind(this)
  }

  routeNotFound(_req: Request, _res: Response, next: NextFunction) {
    const exception = new NotFoundException('Route Not Found')
    next(exception)
  }

  processErrors(
    error: Error,
    req: Request,
    res: Response,
    _next: NextFunction
  ) {
    const timestamp = new Date().toUTCString()
    const uri = `${req.protocol}://${req.hostname}${req.originalUrl}`

    this.logger.error(JSON.stringify({ timestamp, uri, error }, null, 2))
    this.logger.info('Server Status: Active')
    let exception: HttpException

    if (error instanceof HttpException) {
      exception = error
      return res.status(exception.statusCode).send({
        statusCode: exception.statusCode,
        message: exception.message,
        exception: exception.error,
        status: exception.status,
        exceptionType: exception.exceptionType,
        uri,
        timestamp,
      })
    }

    switch (error.constructor) {
      case QueryFailedError:
        let dbError = error as QueryFailedError
        exception = new UnprocessableEntityException(
          dbError.driverError.detail || dbError.message
        )
        break
      default:
        switch (error.message) {
          case 'invalid token':
            exception = new UnauthorizedException('Invalid Access Token')
            break
          case 'invalid signature':
            exception = new UnauthorizedException('Invalid Signature')
            break
          case 'TokenExpiredError':
            exception = new UnauthorizedException('Access Token Expired')
            break
          case 'jwt expired':
            exception = new UnauthorizedException('Session Timeout')
            break
          default:
            exception = new InternalServerException(error.message)
        }
    }

    return res.status(exception.statusCode).send({
      statusCode: exception.statusCode,
      message: exception.message,
      exception: exception.error,
      status: exception.status,
      exceptionType: exception.exceptionType,
      uri,
      timestamp,
    })
  }
}
