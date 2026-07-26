import assert from "node:assert/strict";
import { MemoryAdoptionRepository } from "../../src/repositories/memory-adoption.repository.js";
import { MemoryPetRepository } from "../../src/repositories/memory-pet.repository.js";
import { MemoryUserRepository } from "../../src/repositories/memory-user.repository.js";

const ADOPTION_ID = "64b000000000000000000003";
const USER_ID = "64b000000000000000000001";
const PET_ID = "64b000000000000000000002";

describe("Repositorios en memoria", function () {
  describe("MemoryAdoptionRepository", function () {
    it("construye con datos iniciales y getAll devuelve clones", async function () {
      const repository = new MemoryAdoptionRepository([
        { _id: ADOPTION_ID, owner: USER_ID, pet: PET_ID, createdAt: "2026-07-26T12:00:00.000Z" }
      ]);

      const adoptions = await repository.getAll();

      assert.equal(adoptions.length, 1);
      assert.deepEqual(adoptions[0], {
        _id: ADOPTION_ID,
        owner: USER_ID,
        pet: PET_ID,
        createdAt: "2026-07-26T12:00:00.000Z"
      });

      adoptions[0].owner = "modificado";
      const stored = await repository.getById(ADOPTION_ID);
      assert.equal(stored.owner, USER_ID);
    });

    it("getById devuelve null cuando la adopcion no existe", async function () {
      const repository = new MemoryAdoptionRepository();

      const adoption = await repository.getById(ADOPTION_ID);

      assert.equal(adoption, null);
    });

    it("create genera un id hex, createdAt y protege el almacenado con clones", async function () {
      const repository = new MemoryAdoptionRepository();

      const created = await repository.create({ ownerId: USER_ID, petId: PET_ID });

      assert.match(created._id, /^[a-f0-9]{24}$/);
      assert.equal(created.owner, USER_ID);
      assert.equal(created.pet, PET_ID);
      assert.ok(!Number.isNaN(Date.parse(created.createdAt)));

      created.owner = "alterado";
      const stored = await repository.getById(created._id);
      assert.equal(stored.owner, USER_ID);
    });
  });

  describe("MemoryUserRepository", function () {
    it("obtiene un usuario existente y devuelve clones", async function () {
      const repository = new MemoryUserRepository([
        { _id: USER_ID, firstName: "Ada", pets: [] }
      ]);

      const user = await repository.getById(USER_ID);

      assert.deepEqual(user, { _id: USER_ID, firstName: "Ada", pets: [] });

      user.firstName = "Grace";
      const stored = await repository.getById(USER_ID);
      assert.equal(stored.firstName, "Ada");
    });

    it("devuelve null para un usuario inexistente", async function () {
      const repository = new MemoryUserRepository();

      const user = await repository.getById(USER_ID);

      assert.equal(user, null);
    });

    it("actualiza un usuario existente y protege el almacenado con clones", async function () {
      const repository = new MemoryUserRepository([
        { _id: USER_ID, firstName: "Ada", pets: [] }
      ]);

      const updated = await repository.update(USER_ID, { pets: [PET_ID] });

      assert.deepEqual(updated, { _id: USER_ID, firstName: "Ada", pets: [PET_ID] });

      updated.pets.push("otro");
      const stored = await repository.getById(USER_ID);
      assert.deepEqual(stored.pets, [PET_ID]);
    });

    it("devuelve null al intentar actualizar un usuario inexistente", async function () {
      const repository = new MemoryUserRepository();

      const updated = await repository.update(USER_ID, { pets: [PET_ID] });

      assert.equal(updated, null);
    });
  });

  describe("MemoryPetRepository", function () {
    it("obtiene una mascota existente y devuelve clones", async function () {
      const repository = new MemoryPetRepository([
        { _id: PET_ID, name: "Simba", adopted: false, owner: null }
      ]);

      const pet = await repository.getById(PET_ID);

      assert.deepEqual(pet, { _id: PET_ID, name: "Simba", adopted: false, owner: null });

      pet.name = "Nala";
      const stored = await repository.getById(PET_ID);
      assert.equal(stored.name, "Simba");
    });

    it("devuelve null para una mascota inexistente", async function () {
      const repository = new MemoryPetRepository();

      const pet = await repository.getById(PET_ID);

      assert.equal(pet, null);
    });

    it("actualiza una mascota existente y protege el almacenado con clones", async function () {
      const repository = new MemoryPetRepository([
        { _id: PET_ID, name: "Simba", adopted: false, owner: null }
      ]);

      const updated = await repository.update(PET_ID, { adopted: true, owner: USER_ID });

      assert.deepEqual(updated, {
        _id: PET_ID,
        name: "Simba",
        adopted: true,
        owner: USER_ID
      });

      updated.owner = "otro";
      const stored = await repository.getById(PET_ID);
      assert.equal(stored.owner, USER_ID);
    });

    it("devuelve null al intentar actualizar una mascota inexistente", async function () {
      const repository = new MemoryPetRepository();

      const updated = await repository.update(PET_ID, { adopted: true });

      assert.equal(updated, null);
    });
  });
});
