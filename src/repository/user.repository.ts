import { injectable } from 'tsyringe'
import { BaseRepository } from './base/base.repository'
import { User } from '@domain/user.entity'

@injectable()
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User)
  }
}
