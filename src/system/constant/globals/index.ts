import path from 'path'
import { User } from '@domain/user.entity'

declare global {
  namespace Express {
    interface Request {
      user: User
    }
  }
  namespace NodeJS {
    interface Global {
      __basedir: string
    }
  }
}

global.__basedir = path.resolve('./')
