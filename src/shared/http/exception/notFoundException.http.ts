import HttpException from './exception.http'

export default class NotFoundException extends HttpException {
  constructor(public readonly error: any) {
    super(error, 404, 'exception', 'Not Found')
  }
}
