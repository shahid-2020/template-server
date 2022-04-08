import HttpException from './exception.http'

export default class UnprocessableEntityException extends HttpException {
  constructor(public readonly error: any) {
    super(error, 422, 'exception', 'Unprocessable Entity')
  }
}
