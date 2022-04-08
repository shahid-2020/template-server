import { singleton } from 'tsyringe'
import { createClient } from 'redis'
import config from 'config'
import Logger from '../logger/logger'

@singleton()
export default class Redis {
  private client: any
  private isActive: boolean
  constructor(private readonly logger: Logger) {
    this.isActive = false
  }

  public async connectRedis(): Promise<void> {
    try {
      this.client = createClient({
        url: `redis://${config.get('REDIS_HOST') as string}`,
      })

      this.client
        .on('connect', () => {
          this.logger.info('Redis connected')
        })
        .on('ready', () => {
          this.isActive = true
          this.logger.info('Redis ready')
        })
        .on('error', (_error: any) => {
          this.isActive = false
          this.logger.error('Redis error')
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
    }
  }

  async set(key: string, value: string, expiry: number): Promise<void> {
    if (this.isActive) {
      await this.client.set(key, value, expiry)
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.isActive) {
      return await this.client.get(key)
    }

    return null
  }

  async del(key: string): Promise<void> {
    if (this.isActive) {
      await this.client.del(key)
    }
  }
}
