import HttpException from './exception.http'

export default class BadRequestException extends HttpException {
  constructor(public readonly error: any) {
    super(error, 400, 'exception', 'Bad Request')
  }
}
