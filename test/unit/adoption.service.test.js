import assert from "node:assert/strict";
import sinon from "sinon";
import { AdoptionService } from "../../src/services/adoption.service.js";
import { ConflictError, NotFoundError } from "../../src/errors/app-errors.js";

const ADOPTION_ID = "64b000000000000000000003";
const USER_ID = "64b000000000000000000001";
const PET_ID = "64b000000000000000000002";

const userMock = { _id: USER_ID, pets: [] };
const petMock = { _id: PET_ID, adopted: false, owner: null };
const adoptionMock = { _id: ADOPTION_ID, owner: USER_ID, pet: PET_ID };

describe("AdoptionService", function () {
  let sandbox;
  let adoptionRepository;
  let userRepository;
  let petRepository;
  let service;

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    adoptionRepository = {
      getAll: sandbox.stub(),
      getById: sandbox.stub(),
      create: sandbox.stub()
    };
    userRepository = {
      getById: sandbox.stub(),
      update: sandbox.stub()
    };
    petRepository = {
      getById: sandbox.stub(),
      update: sandbox.stub()
    };

    service = new AdoptionService({
      adoptionRepository,
      userRepository,
      petRepository
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("exige todos los repositorios", function () {
    assert.throws(() => new AdoptionService({}), /Los repositorios/);
  });

  it("obtiene todas las adopciones", async function () {
    adoptionRepository.getAll.resolves([adoptionMock]);

    const result = await service.getAll();

    assert.deepEqual(result, [adoptionMock]);
    sinon.assert.calledOnce(adoptionRepository.getAll);
  });

  it("obtiene una adopción por ID", async function () {
    adoptionRepository.getById.withArgs(ADOPTION_ID).resolves(adoptionMock);

    const result = await service.getById(ADOPTION_ID);

    assert.deepEqual(result, adoptionMock);
  });

  it("lanza NotFoundError si la adopción no existe", async function () {
    adoptionRepository.getById.resolves(null);

    await assert.rejects(
      () => service.getById(ADOPTION_ID),
      (error) => error instanceof NotFoundError && error.message === "Adopción no encontrada"
    );
  });

  it("lanza NotFoundError si el usuario no existe", async function () {
    userRepository.getById.resolves(null);

    await assert.rejects(
      () => service.create({ ownerId: USER_ID, petId: PET_ID }),
      (error) => error instanceof NotFoundError && error.message === "Usuario no encontrado"
    );

    sinon.assert.notCalled(petRepository.getById);
  });

  it("lanza NotFoundError si la mascota no existe", async function () {
    userRepository.getById.resolves(userMock);
    petRepository.getById.resolves(null);

    await assert.rejects(
      () => service.create({ ownerId: USER_ID, petId: PET_ID }),
      (error) => error instanceof NotFoundError && error.message === "Mascota no encontrada"
    );
  });

  it("lanza ConflictError si la mascota ya fue adoptada", async function () {
    userRepository.getById.resolves(userMock);
    petRepository.getById.resolves({ ...petMock, adopted: true });

    await assert.rejects(
      () => service.create({ ownerId: USER_ID, petId: PET_ID }),
      (error) => error instanceof ConflictError && error.message === "La mascota ya fue adoptada"
    );
  });

  it("crea la adopción y actualiza usuario y mascota", async function () {
    userRepository.getById.resolves(userMock);
    petRepository.getById.resolves(petMock);
    adoptionRepository.create.resolves(adoptionMock);
    userRepository.update.resolves({ ...userMock, pets: [PET_ID] });
    petRepository.update.resolves({ ...petMock, adopted: true, owner: USER_ID });

    const result = await service.create({ ownerId: USER_ID, petId: PET_ID });

    assert.deepEqual(result, adoptionMock);
    sinon.assert.calledOnceWithExactly(adoptionRepository.create, {
      ownerId: USER_ID,
      petId: PET_ID
    });
    sinon.assert.calledOnceWithExactly(userRepository.update, USER_ID, {
      pets: [PET_ID]
    });
    sinon.assert.calledOnceWithExactly(petRepository.update, PET_ID, {
      adopted: true,
      owner: USER_ID
    });
  });

  it("no duplica una mascota que ya figura en el usuario", async function () {
    userRepository.getById.resolves({ ...userMock, pets: [PET_ID] });
    petRepository.getById.resolves(petMock);
    adoptionRepository.create.resolves(adoptionMock);
    userRepository.update.resolves();
    petRepository.update.resolves();

    await service.create({ ownerId: USER_ID, petId: PET_ID });

    sinon.assert.calledOnceWithExactly(userRepository.update, USER_ID, {
      pets: [PET_ID]
    });
  });

  it("inicializa pets cuando el usuario no tiene esa propiedad", async function () {
    userRepository.getById.resolves({ _id: USER_ID });
    petRepository.getById.resolves(petMock);
    adoptionRepository.create.resolves(adoptionMock);
    userRepository.update.resolves({ _id: USER_ID, pets: [PET_ID] });
    petRepository.update.resolves({ ...petMock, adopted: true, owner: USER_ID });

    const result = await service.create({ ownerId: USER_ID, petId: PET_ID });

    assert.deepEqual(result, adoptionMock);
    sinon.assert.calledOnceWithExactly(userRepository.update, USER_ID, {
      pets: [PET_ID]
    });
    sinon.assert.calledOnceWithExactly(petRepository.update, PET_ID, {
      adopted: true,
      owner: USER_ID
    });
  });
});
