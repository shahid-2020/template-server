import HttpResponse from './response.http'

export default class CreatedResponse extends HttpResponse {
  constructor(data: any = null) {
    super(data, 201, 'created')
  }
}
