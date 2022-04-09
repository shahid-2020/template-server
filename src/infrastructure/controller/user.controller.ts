import { Router, Request, Response, NextFunction } from 'express'
import { autoInjectable } from 'tsyringe'
import UserService from '@service/user.service'
import { UtilService } from '@service/util.service'
import { UpdateUserDto } from '@shared/dto/user.dto'
import BadRequestException from '@shared/http/exception/badRequestException.http'
import AuthMiddleware from '@shared/middleware/auth.middleware'

@autoInjectable()
export default class UserController {
  private router: Router

  constructor(
    private readonly utilService: UtilService,
    private readonly userService: UserService,
    private readonly authMiddleware: AuthMiddleware
  ) {
    this.router = Router()
    this.me = this.me.bind(this)
    this.updateMe = this.updateMe.bind(this)
    this.deleteMe = this.deleteMe.bind(this)
  }

  async me(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | unknown> {
    try {
      const result = await this.userService.me(req.user)
      return res.status(result.statusCode).send(result)
    } catch (error: any) {
      next(error)
    }
  }

  async updateMe(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | unknown> {
    try {
      const validatedDto = await this.utilService.validateDTO(
        UpdateUserDto,
        req.body
      )
      if (validatedDto.errors) {
        throw new BadRequestException(validatedDto.errors)
      }
      const result = await this.userService.updateMe(
        req.user,
        validatedDto.data
      )
      return res.status(result.statusCode).send(result)
    } catch (error: any) {
      next(error)
    }
  }

  async deleteMe(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | unknown> {
    try {
      const result = await this.userService.deleteMe(req.user)
      return res.status(result.statusCode).send(result)
    } catch (error: any) {
      next(error)
    }
  }

  public routes(): Router {
    this.router.get('/me', [this.authMiddleware.isAuthorized], this.me)
    this.router.patch(
      '/update/me',
      [this.authMiddleware.isAuthorized],
      this.updateMe
    )
    this.router.delete(
      '/delete/me',
      [this.authMiddleware.isAuthorized],
      this.deleteMe
    )
    return this.router
  }
}
