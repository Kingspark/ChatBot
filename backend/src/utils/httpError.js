// App-level error with explicit HTTP status for controller/service validation.
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

module.exports = {
  HttpError,
};
