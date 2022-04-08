import { Request } from 'express'
import { injectable } from 'tsyringe'
import HttpResponse from '../shared/http/response/response.http'
import OkResponse from '../shared/http/response/ok.http'

@injectable()
export default class HealthService {
  async health(req: Request): Promise<HttpResponse> {
    const timestamp = new Date().toUTCString()
    const uri = `${req.protocol}://${req.hostname}${req.originalUrl}`
    return new OkResponse({ status: 'active', uri, timestamp })
  }
}
