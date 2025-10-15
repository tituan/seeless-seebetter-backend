// avant : module.exports = (req, res, next) => { ... }

export default function notFound(req, res, next) {
  res.status(404).json({
    error: true,
    message: `Route non trouvée: ${req.originalUrl}`,
  });
}