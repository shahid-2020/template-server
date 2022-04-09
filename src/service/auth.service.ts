import { delay, inject, injectable } from 'tsyringe'
import { plainToInstance } from 'class-transformer'
import bcrypt from 'bcrypt'
import { UtilService } from './util.service'
import { UserRepository } from '@repository/user.repository'
import Redis from '@shared/db/redis'
import { RefreshTokenDto, SigninDto, SignupDto } from '@shared/dto/auth.dto'
import HttpResponse from '@shared/http/response/response.http'
import { User } from '@domain/user.entity'
import OkResponse from '@shared/http/response/ok.http'
import NotFoundException from '@shared/http/exception/notFoundException.http'
import { ConfigService } from '@config'
import UnauthorizedException from '@shared/http/exception/unauthorizedException.http'

@injectable()
export default class AuthService {
  constructor(
    @inject(delay(() => UserRepository))
    private readonly userRepository: UserRepository,
    private readonly utilService: UtilService,
    private readonly configService: ConfigService,
    private readonly redis: Redis
  ) {}

  async signup(data: SignupDto): Promise<HttpResponse> {
    try {
      const { password } = data
      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await this.userRepository.create({
        ...data,
        password: hashedPassword,
      })
      const serialized = plainToInstance(User, user)
      return new OkResponse({ user: serialized })
    } catch (error: any) {
      throw error
    }
  }

  async signin(data: SigninDto): Promise<HttpResponse> {
    try {
      const { username, email, password } = data
      const user = await this.userRepository.findOne({
        where: [{ username }, { email }],
      })
      if (!user) {
        throw new NotFoundException('Invalid Username/Email')
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        throw new NotFoundException('Invalid Passowrd')
      }

      const { token: accessToken } = this.utilService.generateJWTToken(
        { id: user.id },
        this.configService.get('ACCESS_TOKEN_SECRET'),
        `${
          (this.configService.get('ACCESS_TOKEN_SECRET_EXPIRES_HRS') as number) *
          60 *
          60 *
          1000
        }`
      )

      const { token: refreshToken } = this.utilService.generateJWTToken(
        { id: user.id },
        this.configService.get('REFRESH_TOKEN_SECRET'),
        `${
          (this.configService.get('REFRESH_TOKEN_SECRET_EXPIRES_HRS') as number) *
          60 *
          60 *
          1000
        }`
      )
      await this.redis.set(
        user.id,
        refreshToken,
        (this.configService.get('REFRESH_TOKEN_SECRET_EXPIRES_HRS') as number) * 60 * 60
      )
      return new OkResponse({ accessToken, refreshToken })
    } catch (error: any) {
      throw error
    }
  }

  async refreshToken(data: RefreshTokenDto): Promise<HttpResponse> {
    try {
      const { refreshToken } = data
      const payload = this.utilService.verifyJWTToken(
        refreshToken,
        this.configService.get('REFRESH_TOKEN_SECRET') as string
      )

      const cachedToken = await this.redis.get(payload.id)

      if (cachedToken && refreshToken !== cachedToken) {
        throw new UnauthorizedException()
      }

      const user = await this.userRepository.findOne({
        where: { id: payload.id },
      })

      if (!user) {
        throw new UnauthorizedException()
      }

      const { token: accessToken } = this.utilService.generateJWTToken(
        { id: user.id },
        this.configService.get('ACCESS_TOKEN_SECRET'),
        `${
          (this.configService.get('ACCESS_TOKEN_SECRET_EXPIRES_HRS') as number) *
          60 *
          60 *
          1000
        }`
      )

      return new OkResponse({ accessToken })
    } catch (error: any) {
      throw error
    }
  }

  async signout(data: RefreshTokenDto): Promise<HttpResponse> {
    try {
      const { refreshToken } = data
      const payload = this.utilService.verifyJWTToken(
        refreshToken,
        this.configService.get('REFRESH_TOKEN_SECRET') as string
      )

      await this.redis.del(payload.id)
      return new OkResponse()
    } catch (error: any) {
      throw error
    }
  }
}
