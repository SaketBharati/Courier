/**
 * Async Error Wrapper
 *
 * Wraps async route handlers and forwards any errors
 * to the global error handling middleware.
 *
 * Usage:
 * router.get("/", catchAsync(controller.getUsers));
 */

const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync;