// Wraps an async route handler so a rejected promise is forwarded to
// Express's error-handling middleware via next(err), instead of becoming
// an unhandled rejection that Express never sees. Sync throws inside the
// handler don't need this - Express already catches those on its own.
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;
