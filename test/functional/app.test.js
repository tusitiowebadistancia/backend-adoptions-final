import assert from "node:assert/strict";
import request from "supertest";
import sinon from "sinon";
import { createApp } from "../../src/app.js";

function createServiceFake() {
  return {
    getAll: sinon.stub(),
    getById: sinon.stub(),
    create: sinon.stub()
  };
}

describe("Aplicación Express", function () {
  it("responde correctamente al health check", async function () {
    const app = createApp({ adoptionService: createServiceFake() });

    const response = await request(app).get("/health");

    assert.equal(response.status, 200);
    assert.equal(response.body.status, "success");
  });

  it("devuelve 404 para una ruta inexistente", async function () {
    const app = createApp({ adoptionService: createServiceFake() });

    const response = await request(app).get("/ruta-inexistente");

    assert.equal(response.status, 404);
    assert.equal(response.body.error.code, "ROUTE_NOT_FOUND");
  });

  it("exige un servicio de adopciones para iniciar", function () {
    assert.throws(
      () => createApp(),
      /adoptionService es obligatorio para crear la aplicación/
    );
  });
});
