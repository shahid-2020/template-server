import HttpException from './exception.http'

export default class InternalServerException extends HttpException {
  constructor(error: any = null) {
    super(error, 500, 'exception', 'Internal Server Error')
  }
}
