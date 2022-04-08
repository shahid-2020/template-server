import { User } from '../../../domain/user.entity'

declare global {
  namespace Express {
    interface Request {
      user: User
    }
  }
}
