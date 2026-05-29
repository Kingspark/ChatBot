// Centralized API error handler: preserves existing status codes and
// avoids writing a second response when headers were already sent.
// Params: err=raised error, req=incoming request, res=outgoing response,
// next=passes control to the next/default Express error handler.
const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  const status = Number.isInteger(err.status) ? err.status : 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    success: false,
    message,
  });
};

module.exports = {
  errorHandler,
};
