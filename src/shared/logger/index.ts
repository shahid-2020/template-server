import * as winston from 'winston'
import { container, singleton } from 'tsyringe'
import { ConfigService, configService } from '@config'

export const level = () => {
  const env = configService.get('NODE_ENV') || 'development'
  const isDevelopment = env === 'development'
  return isDevelopment ? 'debug' : 'warn'
}

@singleton()
export default class Logger {
  private env: string
  private logger: winston.Logger

  constructor(private readonly configService: ConfigService) {
    this.env = this.configService.get<string>('NODE_ENV')

    const level = () => {
      const isDevelopment = this.env === 'development'
      return isDevelopment ? 'debug' : 'warn'
    }

    const colors = {
      error: 'red',
      warn: 'yellow',
      info: 'green',
      http: 'magenta',
      debug: 'white',
    }

    winston.addColors(colors)

    const consoleFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.colorize({ message: true }),
      winston.format.printf((info) => {
        return `${info.timestamp} ${info.level.toUpperCase()} ${info.message}`
      })
    )

    const fileFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
    )

    const transports = [
      new winston.transports.Console({ format: consoleFormat }),
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: fileFormat,
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
        format: fileFormat,
      }),
    ]

    this.logger = winston.createLogger({
      level: level(),
      format: winston.format.json(),
      transports,
    })
  }

  public info(message: string): void {
    this.logger.info(message)
  }

  public error(message: string): void {
    this.logger.error(message)
  }
}

export const logger = container.resolve(Logger)
