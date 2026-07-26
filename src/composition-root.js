import { seed } from "./data/seed.js";
import { MemoryAdoptionRepository } from "./repositories/memory-adoption.repository.js";
import { MemoryPetRepository } from "./repositories/memory-pet.repository.js";
import { MemoryUserRepository } from "./repositories/memory-user.repository.js";
import { AdoptionService } from "./services/adoption.service.js";

const adoptionRepository = new MemoryAdoptionRepository(seed.adoptions);
const userRepository = new MemoryUserRepository(seed.users);
const petRepository = new MemoryPetRepository(seed.pets);

export const adoptionService = new AdoptionService({
  adoptionRepository,
  userRepository,
  petRepository
});
