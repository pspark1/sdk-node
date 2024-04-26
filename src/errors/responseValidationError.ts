export class ResponseValidationError extends Error {
  code: number;
  data: unknown;

  constructor(message: string, code: number, data: unknown) {
    super(message);
    this.name = 'ResponseValidationError';
    this.code = code;
    this.data = data;
  }
}
