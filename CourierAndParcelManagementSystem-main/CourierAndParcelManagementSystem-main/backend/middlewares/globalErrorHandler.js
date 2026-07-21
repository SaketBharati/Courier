const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // MongoDB Errors
  if (err.name === "MongoServerError") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token has expired.",
    });
  }

  // Development
  if (process.env.NODE_ENV === "development") {
    return res.status(statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }

  // Production
  console.error(err);

  return res.status(statusCode).json({
    success: false,
    message: err.isOperational
      ? err.message
      : "Internal server error.",
  });
};

export default globalErrorHandler;