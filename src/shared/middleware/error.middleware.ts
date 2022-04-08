import { Request, Response, NextFunction } from 'express'
import { autoInjectable } from 'tsyringe'
import Logger from '../logger/logger'
import HttpException from '../http/exception/exception.http'
import NotFoundException from '../http/exception/notFoundException.http'
import UnauthorizedException from '../http/exception/unauthorizedException.http'
import InternalServerException from '../http/exception/internalServerException.http'
import UnprocessableEntityException from '../http/exception/unprocessableEntityException.http'
import { QueryFailedError } from 'typeorm'

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
    // console.log(error)
    const timestamp = new Date().toUTCString()
    const uri = `${req.protocol}://${req.hostname}${req.originalUrl}`

    // this.logger.error(JSON.stringify({ timestamp, uri, error }))

    // if (error instanceof HttpException) {
    //   return res.status(error.statusCode).send({
    //     statusCode: error.statusCode,
    //     message: error.message,
    //     error: error.error,
    //     status: error.status,
    //     exceptionType: error.exceptionType,
    //     uri,
    //     timestamp,
    //   })
    // }

    let exception: HttpException

    switch (error.constructor) {
      case HttpException:
        exception = error as HttpException
        break
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
