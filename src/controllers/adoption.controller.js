import { ValidationError } from "../errors/app-errors.js";
import { isValidId } from "../utils/is-valid-id.js";

export function createAdoptionController(adoptionService) {
  if (!adoptionService) {
    throw new TypeError("adoptionService es obligatorio");
  }

  return {
    getAll: async (req, res) => {
      const adoptions = await adoptionService.getAll();

      return res.status(200).json({
        status: "success",
        payload: adoptions
      });
    },

    getById: async (req, res) => {
      const { aid } = req.params;

      if (!isValidId(aid)) {
        throw new ValidationError("El ID de la adopción no es válido");
      }

      const adoption = await adoptionService.getById(aid);

      return res.status(200).json({
        status: "success",
        payload: adoption
      });
    },

    create: async (req, res) => {
      const { uid, pid } = req.params;

      if (!isValidId(uid)) {
        throw new ValidationError("El ID del usuario no es válido");
      }

      if (!isValidId(pid)) {
        throw new ValidationError("El ID de la mascota no es válido");
      }

      const adoption = await adoptionService.create({
        ownerId: uid,
        petId: pid
      });

      return res.status(201).json({
        status: "success",
        message: "Adopción creada correctamente",
        payload: adoption
      });
    }
  };
}
