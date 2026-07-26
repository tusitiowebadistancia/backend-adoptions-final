import assert from "node:assert/strict";
import { createAdoptionController } from "../../src/controllers/adoption.controller.js";
import { errorHandler } from "../../src/middlewares/error-handler.js";
import { createAdoptionRouter } from "../../src/routes/adoption.router.js";

describe("Infraestructura", function () {
  it("createAdoptionRouter exige un adoptionController", function () {
    assert.throws(
      () => createAdoptionRouter(),
      (error) => error instanceof TypeError && error.message === "adoptionController es obligatorio"
    );
  });

  it("createAdoptionController exige un adoptionService", function () {
    assert.throws(
      () => createAdoptionController(),
      (error) => error instanceof TypeError && error.message === "adoptionService es obligatorio"
    );
  });

  it("errorHandler delega en next(error) cuando headersSent ya es true", function () {
    const error = new Error("respuesta ya enviada");
    const req = {};
    let statusCalled = false;
    let jsonCalled = false;
    let forwardedError;
    const res = {
      headersSent: true,
      status() {
        statusCalled = true;
        return this;
      },
      json() {
        jsonCalled = true;
        return this;
      }
    };

    const result = errorHandler(error, req, res, (receivedError) => {
      forwardedError = receivedError;
    });

    assert.equal(result, undefined);
    assert.equal(forwardedError, error);
    assert.equal(statusCalled, false);
    assert.equal(jsonCalled, false);
  });
});
