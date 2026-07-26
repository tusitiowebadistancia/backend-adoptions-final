import { AppError } from "../errors/app-errors.js";

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      error: {
        code: error.code,
        message: error.message
      }
    });
  }

  console.error(error);

  return res.status(500).json({
    status: "error",
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Error interno del servidor"
    }
  });
}
