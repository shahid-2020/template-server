import HttpException from './exception.http'

export default class UnauthorizedException extends HttpException {
  constructor(public readonly error: any = null) {
    super(error, 401, 'exception', 'Unauthorized')
  }
}
