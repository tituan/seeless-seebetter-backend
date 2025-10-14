export function notFound(req, res, next) {
  res.status(404).json({ error: "Route non trouvée" });
}