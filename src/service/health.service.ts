import { Request } from 'express'
import { injectable } from 'tsyringe'
import { getConnectionManager } from 'typeorm'
import OkResponse from '@shared/http/response/ok.http'
import HttpResponse from '@shared/http/response/response.http'

@injectable()
export default class HealthService {
  async health(req: Request): Promise<HttpResponse> {
    const uptime = `${Math.floor(process.uptime())}s`
    const timestamp = new Date().toUTCString()
    const uri = `${req.protocol}://${req.hostname}${req.originalUrl}`
    const dbConnection = getConnectionManager().get()
    return new OkResponse({
      status: 'active',
      'database status':
        dbConnection && dbConnection.isConnected ? 'active' : 'inactive',
      uri,
      uptime,
      timestamp,
    })
  }
}
