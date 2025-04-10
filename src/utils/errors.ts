export class HttpResponseError extends Error {
  status: number;
  constructor(message: string = 'InternalError', status: number = 500,) {
    super(message);
    this.status = status;
  }
}
