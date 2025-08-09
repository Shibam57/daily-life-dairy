const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  console.error("API Error:", {
    message: err.message,
    statusCode,
    stack: err.stack,
    errors: err.errors,
  });

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    data: null,
  });
};

module.exports = errorHandler;