// avant : module.exports = (err, req, res, next) => { ... }

export default function errorHandler(err, req, res, next) {
  console.error("Erreur serveur:", err);

  const status = err.status || 500;
  const message = err.message || "Erreur interne du serveur";

  res.status(status).json({
    error: true,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}