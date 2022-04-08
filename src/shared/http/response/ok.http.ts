import HttpResponse from './response.http'

export default class OkResponse extends HttpResponse {
  constructor(data: any = null) {
    super(data, 200, 'success')
  }
}
