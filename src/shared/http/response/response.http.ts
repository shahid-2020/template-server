export default abstract class HttpResponse {
  constructor(
    public readonly data: any,
    public readonly statusCode: number,
    public readonly status: string
  ) {
    if (data && !(data instanceof Object)) {
      throw new Error('data should be type of Object!')
    }
  }
}
