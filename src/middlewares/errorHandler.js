export function errorHandler(err, req, res, next) {
  console.error("❌", err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Erreur interne",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}