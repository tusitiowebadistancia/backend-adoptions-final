export function notFoundHandler(req, res) {
  return res.status(404).json({
    status: "error",
    error: {
      code: "ROUTE_NOT_FOUND",
      message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    }
  });
}
