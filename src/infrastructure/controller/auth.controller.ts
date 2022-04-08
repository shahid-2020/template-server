import { Router, Request, Response, NextFunction } from 'express'
import { autoInjectable } from 'tsyringe'
import {
  RefreshTokenDto,
  SigninDto,
  SignupDto,
} from '../../shared/dto/auth.dto'
import { UtilService } from '../../service/util.service'
import BadRequestException from '../../shared/http/exception/badRequestException.http'
import AuthService from '../../service/auth.service'

@autoInjectable()
export default class AuthController {
  private router: Router

  constructor(
    private readonly utilService: UtilService,
    private readonly authService: AuthService
  ) {
    this.router = Router()
    this.signup = this.signup.bind(this)
    this.signin = this.signin.bind(this)
    this.refreshToken = this.refreshToken.bind(this)
    this.signout = this.signout.bind(this)
  }

  async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | unknown> {
    try {
      const validatedDto = await this.utilService.validateDTO(
        SignupDto,
        req.body
      )
      if (validatedDto.errors) {
        throw new BadRequestException(validatedDto.errors)
      }
      const result = await this.authService.signup(validatedDto.data)
      return res.status(result.statusCode).send(result)
    } catch (error: any) {
      next(error)
    }
  }

  async signin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | unknown> {
    try {
      const validatedDto = await this.utilService.validateDTO(
        SigninDto,
        req.body
      )
      if (validatedDto.errors) {
        throw new BadRequestException(validatedDto.errors)
      }
      const result = await this.authService.signin(validatedDto.data)
      return res.status(result.statusCode).send(result)
    } catch (error: any) {
      next(error)
    }
  }

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | unknown> {
    try {
      const validatedDto = await this.utilService.validateDTO(
        RefreshTokenDto,
        req.body
      )
      if (validatedDto.errors) {
        throw new BadRequestException(validatedDto.errors)
      }

      const result = await this.authService.refreshToken(validatedDto.data)
      return res.status(result.statusCode).send(result)
    } catch (error: any) {
      next(error)
    }
  }

  async signout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | unknown> {
    try {
      const validatedDto = await this.utilService.validateDTO(
        RefreshTokenDto,
        req.body
      )
      if (validatedDto.errors) {
        throw new BadRequestException(validatedDto.errors)
      }

      const result = await this.authService.signout(validatedDto.data)
      return res.status(result.statusCode).send(result)
    } catch (error: any) {
      next(error)
    }
  }

  public routes(): Router {
    this.router.post('/signup', this.signup)
    this.router.post('/signin', this.signin)
    this.router.post('/refreshToken', this.refreshToken)
    this.router.delete('/signout', this.signout)
    return this.router
  }
}
