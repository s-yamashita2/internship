export class InvalidParameterError extends Error {
  constructor(
    public readonly message: string,
    public readonly fields?: Record<string, string>
  ) {
    super(message);
    this.name = "InvalidParameterError";
  }
}

export class UnauthorizedError extends Error {
  constructor(public readonly message: string) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(public readonly message: string) {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends Error {
  constructor(public readonly message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class InternalServerError extends Error {
  constructor(public readonly message: string) {
    super(message);
    this.name = "InternalServerError";
  }
}
