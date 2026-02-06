export class AppError extends Error {
  public constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  public constructor(resource: string) {
    super(404, `${resource} not found`);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends AppError {
  public constructor(
    message: string,
    public readonly errors: Array<{ field: string; message: string }>,
  ) {
    super(400, message);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AppError {
  public constructor(
    message: string
  ) {
    super(401, `User unauthorized. ${message}`);
    this.name = 'AuthorizationError';
  }
}