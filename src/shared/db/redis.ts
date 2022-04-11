import { singleton } from 'tsyringe'
import { createClient } from 'redis'
import { ConfigService } from '@config'
import Logger from '@shared/logger'

@singleton()
export default class Redis {
  private client: any
  private isActive: boolean
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger
  ) {
    this.isActive = false
  }

  async connect(): Promise<void> {
    try {
      this.client = createClient({
        url: `redis://${this.configService.get<string>('REDIS_HOST')}`,
      })

      this.client
        .on('connect', () => {
          this.logger.info('Redis connected')
        })
        .on('ready', () => {
          this.isActive = true
          this.logger.info('Redis ready')
        })
        .on('error', (error: any) => {
          this.isActive = false
          this.logger.error('Redis error')
          this.logger.error(JSON.stringify(error, null, 2))
        })
        .on('close', () => {
          this.isActive = false
          this.logger.info('Redis close')
        })
        .on('reconnecting', () => {
          this.isActive = false
          this.logger.info('Redis reconnecting...')
        })
        .on('end', () => {
          this.isActive = false
          this.logger.info('Redis end')
        })
      await this.client.connect()
    } catch (error: any) {
      this.logger.error('Redis error')
      this.logger.error(JSON.stringify(error, null, 2))
    }
  }

  async set(
    key: string,
    value: string,
    expiry: number,
    strictMode = true
  ): Promise<void> {
    if (strictMode || this.isActive) {
      await this.client.set(key, value, expiry)
    }
  }

  async get(key: string, strictMode = true): Promise<string | null> {
    if (strictMode || this.isActive) {
      return await this.client.get(key)
    }

    return null
  }

  async del(key: string, strictMode = true): Promise<void> {
    if (strictMode || this.isActive) {
      await this.client.del(key)
    }
  }
}
