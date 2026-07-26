import { randomBytes } from "node:crypto";

export class MemoryAdoptionRepository {
  constructor(initialAdoptions = []) {
    this.adoptions = new Map(
      initialAdoptions.map((adoption) => [adoption._id, structuredClone(adoption)])
    );
  }

  async getAll() {
    return Array.from(this.adoptions.values(), (adoption) => structuredClone(adoption));
  }

  async getById(id) {
    const adoption = this.adoptions.get(id);
    return adoption ? structuredClone(adoption) : null;
  }

  async create(data) {
    const adoption = {
      _id: randomBytes(12).toString("hex"),
      owner: data.ownerId,
      pet: data.petId,
      createdAt: new Date().toISOString()
    };

    this.adoptions.set(adoption._id, adoption);
    return structuredClone(adoption);
  }
}
