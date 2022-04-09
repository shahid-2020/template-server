import { Router, Request, Response, NextFunction } from 'express'
import { autoInjectable } from 'tsyringe'
import HealthService from '@service/health.service'

@autoInjectable()
export default class HealthController {
  private router: Router

  constructor(private readonly healtService: HealthService) {
    this.router = Router()
    this.health = this.health.bind(this)
  }

  async health(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | unknown> {
    try {
      const result = await this.healtService.health(req)
      return res.status(result.statusCode).send(result)
    } catch (error: any) {
      next(error)
    }
  }

  public routes(): Router {
    this.router.get('/status', this.health)
    return this.router
  }
}
