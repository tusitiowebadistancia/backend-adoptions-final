import { ConflictError, NotFoundError } from "../errors/app-errors.js";

export class AdoptionService {
  constructor({ adoptionRepository, userRepository, petRepository }) {
    if (!adoptionRepository || !userRepository || !petRepository) {
      throw new TypeError("Los repositorios de adopciones, usuarios y mascotas son obligatorios");
    }

    this.adoptionRepository = adoptionRepository;
    this.userRepository = userRepository;
    this.petRepository = petRepository;
  }

  async getAll() {
    return this.adoptionRepository.getAll();
  }

  async getById(adoptionId) {
    const adoption = await this.adoptionRepository.getById(adoptionId);

    if (!adoption) {
      throw new NotFoundError("Adopción no encontrada");
    }

    return adoption;
  }

  async create({ ownerId, petId }) {
    const user = await this.userRepository.getById(ownerId);

    if (!user) {
      throw new NotFoundError("Usuario no encontrado");
    }

    const pet = await this.petRepository.getById(petId);

    if (!pet) {
      throw new NotFoundError("Mascota no encontrada");
    }

    if (pet.adopted) {
      throw new ConflictError("La mascota ya fue adoptada");
    }

    const adoption = await this.adoptionRepository.create({ ownerId, petId });
    const updatedPets = Array.from(new Set([...(user.pets ?? []), petId]));

    await Promise.all([
      this.userRepository.update(ownerId, { pets: updatedPets }),
      this.petRepository.update(petId, { adopted: true, owner: ownerId })
    ]);

    return adoption;
  }
}
