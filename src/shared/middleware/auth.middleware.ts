import { NextFunction, Request, Response } from 'express'
import { inject, injectable, delay } from 'tsyringe'
import config from 'config'
import { UtilService } from '../../service/util.service'
import UnauthorizedException from '../http/exception/unauthorizedException.http'
import { UserRepository } from '../../repository/user.repository'

@injectable()
export default class AuthMiddleware {
  constructor(
    @inject(delay(() => UserRepository))
    private readonly userRepository: UserRepository,
    private readonly utilService: UtilService
  ) {
    this.isAuthorized = this.isAuthorized.bind(this)
  }

  async isAuthorized(req: Request, _res: Response, next: NextFunction) {
    try {
      const token =
        req.headers.authorization && req.headers.authorization.split(' ')[1]

      if (!token) {
        throw new UnauthorizedException()
      }

      const payload = this.utilService.verifyJWTToken(
        token,
        config.get('ACCESS_TOKEN_SECRET')
      )

      const user = await this.userRepository.findById(payload.id)

      if (!user) {
        throw new UnauthorizedException()
      }

      req.user = user

      next()
    } catch (error: any) {
      next(error)
    }
  }
}
