import { Router } from "express";
import { asyncHandler } from "../middlewares/async-handler.js";

export function createAdoptionRouter(adoptionController) {
  if (!adoptionController) {
    throw new TypeError("adoptionController es obligatorio");
  }

  const router = Router();

  router.get("/", asyncHandler(adoptionController.getAll));
  router.get("/:aid", asyncHandler(adoptionController.getById));
  router.post("/:uid/:pid", asyncHandler(adoptionController.create));

  return router;
}
