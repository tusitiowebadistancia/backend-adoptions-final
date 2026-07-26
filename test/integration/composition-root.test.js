import assert from "node:assert/strict";
import { seed } from "../../src/data/seed.js";
import { adoptionService } from "../../src/composition-root.js";
import { MemoryAdoptionRepository } from "../../src/repositories/memory-adoption.repository.js";
import { MemoryPetRepository } from "../../src/repositories/memory-pet.repository.js";
import { MemoryUserRepository } from "../../src/repositories/memory-user.repository.js";
import { AdoptionService } from "../../src/services/adoption.service.js";

describe("Composition root", function () {
  it("ensambla una instancia real de AdoptionService con repositorios en memoria", async function () {
    assert.ok(adoptionService instanceof AdoptionService);
    assert.ok(adoptionService.adoptionRepository instanceof MemoryAdoptionRepository);
    assert.ok(adoptionService.userRepository instanceof MemoryUserRepository);
    assert.ok(adoptionService.petRepository instanceof MemoryPetRepository);

    const adoptions = await adoptionService.getAll();
    const user = await adoptionService.userRepository.getById(seed.users[0]._id);
    const pet = await adoptionService.petRepository.getById(seed.pets[0]._id);

    assert.ok(Array.isArray(adoptions));
    assert.equal(adoptions.length, seed.adoptions.length);
    assert.deepEqual(user, seed.users[0]);
    assert.deepEqual(pet, seed.pets[0]);
  });
});
