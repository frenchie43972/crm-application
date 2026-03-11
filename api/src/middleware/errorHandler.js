/**
 * Purpose:
 * This module defines centralized error-handling middleware for the Express
 * application. It catches errors that occur anywhere in the request pipeline
 * and sends a standardized JSON error response to the client.
 *
 * Instead of every controller manually handling errors and building responses,
 * controllers can simply call:
 *
 *    next(err)
 *
 * Express will automatically forward the error to this middleware.
 *
 * In Express, middleware normally has this signature:
 *
 *   (req, res, next)
 *
 * Error middleware MUST have four parameters:
 *
 *   (err, req, res, next)
 *
 * The presence of the first parameter tells Express that this function is an
 * error handler and should only be executed when an error occurs.
 */

/*
  This middleware is ONLY called when `next(err)` is used.
  The four parameters are required by Express to identify
  it as an error handler.
*/
export function errorHandler(err, req, res, next) {
  console.error(err);

  /**
   * 500 = Internal Server Error
   */
  const status = err.status || 500;

  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
}
