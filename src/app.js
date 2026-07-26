import express from "express";
import { createAdoptionController } from "./controllers/adoption.controller.js";
import { createAdoptionRouter } from "./routes/adoption.router.js";
import { notFoundHandler } from "./middlewares/not-found.js";
import { errorHandler } from "./middlewares/error-handler.js";

export function createApp({ adoptionService } = {}) {
  if (!adoptionService) {
    throw new TypeError("adoptionService es obligatorio para crear la aplicación");
  }

  const app = express();

  app.disable("x-powered-by");
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (req, res) => {
    return res.status(200).json({
      status: "success",
      message: "API funcionando correctamente"
    });
  });

  const adoptionController = createAdoptionController(adoptionService);
  const adoptionRouter = createAdoptionRouter(adoptionController);

  app.use("/api/adoptions", adoptionRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
