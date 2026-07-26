import assert from "node:assert/strict";
import request from "supertest";
import sinon from "sinon";
import { createApp } from "../../src/app.js";
import { ConflictError, NotFoundError } from "../../src/errors/app-errors.js";

const ADOPTION_ID = "64b000000000000000000003";
const USER_ID = "64b000000000000000000001";
const PET_ID = "64b000000000000000000002";

const adoptionMock = {
  _id: ADOPTION_ID,
  owner: USER_ID,
  pet: PET_ID,
  createdAt: "2026-07-26T12:00:00.000Z"
};

describe("Tests funcionales de adoption.router.js", function () {
  let sandbox;
  let adoptionService;
  let app;

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    sandbox.stub(console, "error");
    adoptionService = {
      getAll: sandbox.stub(),
      getById: sandbox.stub(),
      create: sandbox.stub()
    };
    app = createApp({ adoptionService });
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe("GET /api/adoptions", function () {
    it("devuelve todas las adopciones", async function () {
      adoptionService.getAll.resolves([adoptionMock]);

      const response = await request(app).get("/api/adoptions");

      assert.equal(response.status, 200);
      assert.equal(response.body.status, "success");
      assert.deepEqual(response.body.payload, [adoptionMock]);
      sinon.assert.calledOnce(adoptionService.getAll);
    });

    it("devuelve una lista vacía cuando no existen adopciones", async function () {
      adoptionService.getAll.resolves([]);

      const response = await request(app).get("/api/adoptions");

      assert.equal(response.status, 200);
      assert.deepEqual(response.body.payload, []);
    });

    it("devuelve 500 cuando el servicio falla", async function () {
      adoptionService.getAll.rejects(new Error("fallo simulado"));

      const response = await request(app).get("/api/adoptions");

      assert.equal(response.status, 500);
      assert.equal(response.body.error.code, "INTERNAL_SERVER_ERROR");
      assert.equal(response.body.error.message, "Error interno del servidor");
      sinon.assert.calledOnce(adoptionService.getAll);
    });
  });

  describe("GET /api/adoptions/:aid", function () {
    it("devuelve una adopción existente", async function () {
      adoptionService.getById.withArgs(ADOPTION_ID).resolves(adoptionMock);

      const response = await request(app).get(`/api/adoptions/${ADOPTION_ID}`);

      assert.equal(response.status, 200);
      assert.deepEqual(response.body.payload, adoptionMock);
      sinon.assert.calledOnceWithExactly(adoptionService.getById, ADOPTION_ID);
    });

    it("devuelve 400 cuando el ID tiene un formato inválido", async function () {
      const response = await request(app).get("/api/adoptions/id-invalido");

      assert.equal(response.status, 400);
      assert.equal(response.body.error.code, "VALIDATION_ERROR");
      assert.equal(response.body.error.message, "El ID de la adopción no es válido");
      sinon.assert.notCalled(adoptionService.getById);
    });

    it("devuelve 404 cuando la adopción no existe", async function () {
      adoptionService.getById.rejects(new NotFoundError("Adopción no encontrada"));

      const response = await request(app).get(`/api/adoptions/${ADOPTION_ID}`);

      assert.equal(response.status, 404);
      assert.equal(response.body.error.code, "NOT_FOUND");
      assert.equal(response.body.error.message, "Adopción no encontrada");
      sinon.assert.calledOnceWithExactly(adoptionService.getById, ADOPTION_ID);
    });

    it("devuelve 500 ante un error inesperado", async function () {
      adoptionService.getById.rejects(new Error("fallo inesperado"));

      const response = await request(app).get(`/api/adoptions/${ADOPTION_ID}`);

      assert.equal(response.status, 500);
      assert.equal(response.body.error.code, "INTERNAL_SERVER_ERROR");
      sinon.assert.calledOnceWithExactly(adoptionService.getById, ADOPTION_ID);
    });
  });

  describe("POST /api/adoptions/:uid/:pid", function () {
    it("crea una adopción correctamente", async function () {
      adoptionService.create
        .withArgs({ ownerId: USER_ID, petId: PET_ID })
        .resolves(adoptionMock);

      const response = await request(app).post(`/api/adoptions/${USER_ID}/${PET_ID}`);

      assert.equal(response.status, 201);
      assert.equal(response.body.status, "success");
      assert.equal(response.body.message, "Adopción creada correctamente");
      assert.deepEqual(response.body.payload, adoptionMock);
      sinon.assert.calledOnceWithExactly(adoptionService.create, {
        ownerId: USER_ID,
        petId: PET_ID
      });
    });

    it("devuelve 400 cuando el ID del usuario es inválido", async function () {
      const response = await request(app).post(`/api/adoptions/usuario-invalido/${PET_ID}`);

      assert.equal(response.status, 400);
      assert.equal(response.body.error.message, "El ID del usuario no es válido");
      sinon.assert.notCalled(adoptionService.create);
    });

    it("devuelve 400 cuando el ID de la mascota es inválido", async function () {
      const response = await request(app).post(`/api/adoptions/${USER_ID}/mascota-invalida`);

      assert.equal(response.status, 400);
      assert.equal(response.body.error.message, "El ID de la mascota no es válido");
      sinon.assert.notCalled(adoptionService.create);
    });

    it("devuelve 404 cuando el usuario no existe", async function () {
      adoptionService.create.rejects(new NotFoundError("Usuario no encontrado"));

      const response = await request(app).post(`/api/adoptions/${USER_ID}/${PET_ID}`);

      assert.equal(response.status, 404);
      assert.equal(response.body.error.message, "Usuario no encontrado");
      sinon.assert.calledOnceWithExactly(adoptionService.create, {
        ownerId: USER_ID,
        petId: PET_ID
      });
    });

    it("devuelve 404 cuando la mascota no existe", async function () {
      adoptionService.create.rejects(new NotFoundError("Mascota no encontrada"));

      const response = await request(app).post(`/api/adoptions/${USER_ID}/${PET_ID}`);

      assert.equal(response.status, 404);
      assert.equal(response.body.error.message, "Mascota no encontrada");
      sinon.assert.calledOnceWithExactly(adoptionService.create, {
        ownerId: USER_ID,
        petId: PET_ID
      });
    });

    it("devuelve 409 cuando la mascota ya fue adoptada", async function () {
      adoptionService.create.rejects(new ConflictError("La mascota ya fue adoptada"));

      const response = await request(app).post(`/api/adoptions/${USER_ID}/${PET_ID}`);

      assert.equal(response.status, 409);
      assert.equal(response.body.error.code, "CONFLICT");
      assert.equal(response.body.error.message, "La mascota ya fue adoptada");
      sinon.assert.calledOnceWithExactly(adoptionService.create, {
        ownerId: USER_ID,
        petId: PET_ID
      });
    });

    it("devuelve 500 ante un error inesperado", async function () {
      adoptionService.create.rejects(new Error("fallo inesperado"));

      const response = await request(app).post(`/api/adoptions/${USER_ID}/${PET_ID}`);

      assert.equal(response.status, 500);
      assert.equal(response.body.error.code, "INTERNAL_SERVER_ERROR");
      sinon.assert.calledOnceWithExactly(adoptionService.create, {
        ownerId: USER_ID,
        petId: PET_ID
      });
    });
  });
});
