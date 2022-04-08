import { delay, inject, injectable } from 'tsyringe'
import { plainToInstance } from 'class-transformer'
import bcrypt from 'bcrypt'
import { User } from '../domain/user.entity'
import HttpResponse from '../shared/http/response/response.http'
import OkResponse from '../shared/http/response/ok.http'
import BadRequestException from '../shared/http/exception/badRequestException.http'
import { UserRepository } from '../repository/user.repository'
import { UpdateUserDto } from 'src/shared/dto/user.dto'

@injectable()
export default class UserService {
  constructor(
    @inject(delay(() => UserRepository))
    private readonly userRepository: UserRepository
  ) {}

  async me(user: User): Promise<HttpResponse> {
    try {
      const serialized = plainToInstance(User, user)
      return new OkResponse({ user: serialized })
    } catch (error: any) {
      throw error
    }
  }

  async updateMe(user: User, data: UpdateUserDto): Promise<HttpResponse> {
    try {
      let { password } = data
      if (password) {
        data.password = await bcrypt.hash(password, 10)
      }
      const updatedUser = await this.userRepository.update(user.id, data)
      if (!updatedUser) {
        throw new BadRequestException('Invalid Operational Parameter')
      }
      const serialized = plainToInstance(User, updatedUser)
      return new OkResponse({ user: serialized })
    } catch (error: any) {
      throw error
    }
  }

  async deleteMe(user: User): Promise<HttpResponse> {
    try {
      const deletedUser = await this.userRepository.delete(user.id)
      if (!deletedUser) {
        throw new BadRequestException('Invalid Operational Parameter')
      }
      const serialized = plainToInstance(User, deletedUser)
      return new OkResponse({ user: serialized })
    } catch (error: any) {
      throw error
    }
  }
}
