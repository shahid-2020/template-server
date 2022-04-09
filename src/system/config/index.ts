import { join } from 'path'
import * as dotenv from 'dotenv'
import { container } from 'tsyringe'
import { inject, singleton } from 'tsyringe'

@singleton()
export class ConfigService {
  private envs: NodeJS.ProcessEnv
  constructor(@inject('path') path: string) {
    dotenv.config({ path })
    this.envs = { ...process.env }
  }

  get<T>(key: string): T {
    const val = this.envs[key]
    if (!val) {
      throw new Error('Invalid Env Key')
    }
    return val as unknown as T
  }
}

const path = join(global.__basedir, `.env.${process.env.NODE_ENV || `development`}`)

container.register('path', { useValue: path })
export const configService = container.resolve(ConfigService)
