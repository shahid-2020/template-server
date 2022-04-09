import { injectable } from 'tsyringe'
import { User } from '@domain/user.entity'
import { BaseRepository } from './base/base.repository'

@injectable()
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User)
  }
}
