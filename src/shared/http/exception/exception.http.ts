export default abstract class HttpException extends Error {
  constructor(
    public readonly error: any,
    public readonly statusCode: number,
    public readonly status: string,
    public readonly exceptionType: string
  ) {
    super('Http Exception')
  }
}
