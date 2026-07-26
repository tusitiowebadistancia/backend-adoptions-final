export class MemoryPetRepository {
  constructor(initialPets = []) {
    this.pets = new Map(initialPets.map((pet) => [pet._id, structuredClone(pet)]));
  }

  async getById(id) {
    const pet = this.pets.get(id);
    return pet ? structuredClone(pet) : null;
  }

  async update(id, changes) {
    const current = this.pets.get(id);

    if (!current) {
      return null;
    }

    const updated = { ...current, ...structuredClone(changes) };
    this.pets.set(id, updated);
    return structuredClone(updated);
  }
}
