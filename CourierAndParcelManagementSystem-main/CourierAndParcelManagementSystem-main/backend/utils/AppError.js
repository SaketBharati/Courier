/**
 * Custom Error Class
 * Used for operational errors throughout the application.
 */

class AppError extends Error {
  constructor(message = "Something went wrong", statusCode = 500) {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;