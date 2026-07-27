# Examen final de Backend

## 1. Portada

- Alumno: Federico
- Proyecto: Backend Adoptions API
- Fecha: `2026-07-27 10:27:32 -03:00`
- GitHub: `https://github.com/tusitiowebadistancia/backend-adoptions-final`
- Docker Hub: `https://hub.docker.com/r/figi1998/backend-adoptions-final`

## 2. Resumen ejecutivo

El proyecto implementa una API REST de adopciones con Node.js y Express, con foco en testing, reproducibilidad, Dockerizacion y remediacion de seguridad. El trabajo termino con publicacion valida en GitHub y Docker Hub, validacion funcional completa y evidencia tecnica organizada.

Resultados alcanzados:

- `42` tests aprobados
- cobertura `100%`
- `npm audit --omit=dev`: `0` vulnerabilidades de produccion
- imagen Docker runtime multietapa publicada y verificada publicamente
- usuario runtime no root `node` `uid=1000`
- Docker Scout remoto final: `0C 0H 0M 0L`

## 3. URLs publicas

- GitHub: `https://github.com/tusitiowebadistancia/backend-adoptions-final`
- Docker Hub: `https://hub.docker.com/r/figi1998/backend-adoptions-final`
- Pull publico:

```bash
docker pull figi1998/backend-adoptions-final:1.0.0
```

## 4. Arquitectura del proyecto

Estructura principal:

- `src/`: aplicacion, rutas, controladores, servicios, repositorios, middlewares y seed
- `test/`: pruebas funcionales, unitarias e integracion
- `docs/`: documentacion de fases, entrega y evidencias
- `scripts/`: utilidades locales de verificacion

Responsabilidades principales:

- `src/app.js`: arma Express sin abrir puerto real
- `src/server.js`: inicia el proceso HTTP real
- `src/composition-root.js`: ensambla el servicio real con repositorios en memoria
- `src/routes/adoption.router.js`: define rutas HTTP
- `src/controllers/adoption.controller.js`: valida parametros y serializa respuestas
- `src/services/adoption.service.js`: concentra reglas de negocio
- `src/repositories/*.js`: almacenamiento en memoria y actualizaciones
- `src/middlewares/*.js`: async handler, not found y error handler

## 5. Endpoints

| Metodo | Ruta | Funcion | Codigos esperados |
| --- | --- | --- | --- |
| `GET` | `/health` | salud de la API | `200` |
| `GET` | `/api/adoptions` | listar adopciones | `200`, `500` |
| `GET` | `/api/adoptions/:aid` | obtener adopcion por ID | `200`, `400`, `404`, `500` |
| `POST` | `/api/adoptions/:uid/:pid` | crear adopcion | `201`, `400`, `404`, `409`, `500` |

Ejemplos de respuestas reales:

```text
Health 200:
{
  "status": "success",
  "message": "API funcionando correctamente"
}

Validacion 400:
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El ID de la adopcion no es valido"
  }
}
```

## 6. Estrategia de testing

Distribucion final:

- Funcionales: `17`
- Unitarios: `24`
- Integracion: `1`

Herramientas usadas:

- Supertest para solicitudes HTTP
- Sinon para stubs, spies y sandboxes
- assert nativo para validaciones

Enfoque:

- tests funcionales sobre la app Express
- tests unitarios del servicio aislando repositorios
- test de integracion del composition root real
- fakes y stubs para evitar dependencias externas

## 7. Codigo completo de tests funcionales

### 7.1 `test/functional/adoption.router.test.js`

```js
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

    it("devuelve una lista vacia cuando no existen adopciones", async function () {
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
    it("devuelve una adopcion existente", async function () {
      adoptionService.getById.withArgs(ADOPTION_ID).resolves(adoptionMock);

      const response = await request(app).get(`/api/adoptions/${ADOPTION_ID}`);

      assert.equal(response.status, 200);
      assert.deepEqual(response.body.payload, adoptionMock);
      sinon.assert.calledOnceWithExactly(adoptionService.getById, ADOPTION_ID);
    });

    it("devuelve 400 cuando el ID tiene un formato invalido", async function () {
      const response = await request(app).get("/api/adoptions/id-invalido");

      assert.equal(response.status, 400);
      assert.equal(response.body.error.code, "VALIDATION_ERROR");
      assert.equal(response.body.error.message, "El ID de la adopcion no es valido");
      sinon.assert.notCalled(adoptionService.getById);
    });

    it("devuelve 404 cuando la adopcion no existe", async function () {
      adoptionService.getById.rejects(new NotFoundError("Adopcion no encontrada"));

      const response = await request(app).get(`/api/adoptions/${ADOPTION_ID}`);

      assert.equal(response.status, 404);
      assert.equal(response.body.error.code, "NOT_FOUND");
      assert.equal(response.body.error.message, "Adopcion no encontrada");
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
    it("crea una adopcion correctamente", async function () {
      adoptionService.create
        .withArgs({ ownerId: USER_ID, petId: PET_ID })
        .resolves(adoptionMock);

      const response = await request(app).post(`/api/adoptions/${USER_ID}/${PET_ID}`);

      assert.equal(response.status, 201);
      assert.equal(response.body.status, "success");
      assert.equal(response.body.message, "Adopcion creada correctamente");
      assert.deepEqual(response.body.payload, adoptionMock);
      sinon.assert.calledOnceWithExactly(adoptionService.create, {
        ownerId: USER_ID,
        petId: PET_ID
      });
    });

    it("devuelve 400 cuando el ID del usuario es invalido", async function () {
      const response = await request(app).post(`/api/adoptions/usuario-invalido/${PET_ID}`);

      assert.equal(response.status, 400);
      assert.equal(response.body.error.message, "El ID del usuario no es valido");
      sinon.assert.notCalled(adoptionService.create);
    });

    it("devuelve 400 cuando el ID de la mascota es invalido", async function () {
      const response = await request(app).post(`/api/adoptions/${USER_ID}/mascota-invalida`);

      assert.equal(response.status, 400);
      assert.equal(response.body.error.message, "El ID de la mascota no es valido");
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
```

### 7.2 `test/functional/app.test.js`

```js
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

describe("Aplicacion Express", function () {
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
      /adoptionService es obligatorio para crear la aplicacion/
    );
  });
});
```

Explicacion de grupos:

- `GET /api/adoptions`: cubre exito, lista vacia y error interno
- `GET /api/adoptions/:aid`: cubre exito, validacion, no encontrado y error interno
- `POST /api/adoptions/:uid/:pid`: cubre creacion, validaciones, no encontrado, conflicto y error interno
- `app.test.js`: asegura health, 404 general y guard clause de inicializacion

## 8. Tests unitarios e integracion

Archivos relevantes:

- `test/unit/adoption.service.test.js`
- `test/unit/infrastructure.test.js`
- `test/unit/memory-repositories.test.js`
- `test/integration/composition-root.test.js`

Fragmento relevante del servicio:

```js
it("lanza ConflictError si la mascota ya fue adoptada", async function () {
  userRepository.getById.resolves(userMock);
  petRepository.getById.resolves({ ...petMock, adopted: true });

  await assert.rejects(
    () => service.create({ ownerId: USER_ID, petId: PET_ID }),
    (error) => error instanceof ConflictError && error.message === "La mascota ya fue adoptada"
  );
});
```

Fragmento relevante de integracion:

```js
it("ensambla una instancia real de AdoptionService con repositorios en memoria", async function () {
  assert.ok(adoptionService instanceof AdoptionService);
  assert.ok(adoptionService.adoptionRepository instanceof MemoryAdoptionRepository);
  assert.ok(adoptionService.userRepository instanceof MemoryUserRepository);
  assert.ok(adoptionService.petRepository instanceof MemoryPetRepository);
});
```

Valor de estas pruebas:

- verifican reglas de negocio sin HTTP
- validan guard clauses de infraestructura
- cubren repositorios en memoria reales
- prueban el ensamblado del composition root real

## 9. Cobertura

Comando:

```bash
npm run test:coverage
```

Configuracion vigente:

```text
c8 --all --include=src/**/*.js --exclude=src/server.js --reporter=text --reporter=html --check-coverage --lines=100 --functions=100 --branches=100 --statements=100 npm test
```

Resultado real:

- Statements: `100%`
- Branches: `100%`
- Functions: `100%`
- Lines: `100%`

Justificacion de la exclusion de `src/server.js`:

- contiene apertura del servidor HTTP real
- contiene manejo de senales del proceso
- fue validado por ejecucion real local y Docker, no por instrumentacion en proceso

Evidencias:

- `docs/evidence/coverage-final-summary.txt`
- `docs/evidence/coverage-final.log`

## 10. Ejecucion local

Pasos reproducibles:

```bash
npm ci
npm start
```

Health:

```text
GET http://localhost:8080/health
```

Datos seed:

```text
Usuario: 64b000000000000000000001
Mascota: 64b000000000000000000002
```

Ejemplos curl:

```bash
curl http://localhost:8080/health
curl http://localhost:8080/api/adoptions
curl -X POST http://localhost:8080/api/adoptions/64b000000000000000000001/64b000000000000000000002
```

## 11. Dockerfile completo

```dockerfile
# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
WORKDIR /app

FROM base AS development-dependencies
COPY package.json package-lock.json ./
RUN npm ci

FROM development-dependencies AS test
ENV NODE_ENV=test
COPY src ./src
COPY test ./test
CMD ["npm", "test"]

FROM base AS production-dependencies
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev \
  && npm cache clean --force

FROM base AS runtime
ENV NODE_ENV=production
ENV PORT=8080

COPY --from=production-dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node src ./src

# Runtime starts with `node src/server.js`, so npm/npx are not required here.
RUN rm -rf /usr/local/lib/node_modules/npm \
  && rm -f /usr/local/bin/npm /usr/local/bin/npx

USER node
EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=5 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:' + (process.env.PORT || 8080) + '/health').then((response) => { if (!response.ok) process.exit(1); }).catch(() => process.exit(1))"]

CMD ["node", "src/server.js"]
```

Explicacion por stage:

- `development-dependencies`: instala dependencias completas para el target de tests
- `test`: ejecuta `npm test` dentro de Docker
- `production-dependencies`: instala solo dependencias de produccion con `npm ci --omit=dev`
- `runtime`: copia solo lo necesario para ejecutar la API y elimina `npm` y `npx`

## 12. Docker

Estado de tags e IDs:

- Local activa: `backend-adoptions-final:1.0.0` -> `774feb300e95`
- Local `latest`: `774feb300e95`
- Historica `pre-remediation`: `176501c7ab6f`
- Publica: `figi1998/backend-adoptions-final:1.0.0`
- Publica: `figi1998/backend-adoptions-final:latest`

Digest publico del tag:

- `sha256:774feb300e9562eca3a44c0c1e972238339f5af22acbd2e466f0744ad845ffe1`

Manifest remoto linux/amd64:

- `sha256:0968a924fc93a6e6bfeb1aba69f38a897131cfcc1032e2c497838fc7c53bd227`

Comandos relevantes:

```bash
docker build --target test -t backend-adoptions-final:test .
docker run --rm backend-adoptions-final:test
docker pull figi1998/backend-adoptions-final:1.0.0
docker run --rm -p <PUERTO_HOST_LIBRE>:8080 figi1998/backend-adoptions-final:1.0.0
docker manifest inspect figi1998/backend-adoptions-final:1.0.0
docker manifest inspect figi1998/backend-adoptions-final:latest
```

## 13. Seguridad

Primer escaneo real:

- `1C 4H 5M 2L`

Paquetes vulnerables detectados inicialmente:

- `tar@7.5.15`
- `brace-expansion@5.0.6`
- `undici@6.26.0`

Origen real:

- pertenecian al `npm` global incluido por `node:24-alpine`
- no pertenecian a `/app/node_modules`

Remediacion aplicada:

- eliminacion de `npm` y `npx` solo en el stage `runtime`
- mantenimiento de Node 24
- mantenimiento de dependencias reales de la API

Segundo escaneo real:

- local remediado: `0C 0H 0M 0L`
- remoto Docker Hub `linux/amd64`: `0C 0H 0M 0L`

Riesgos residuales:

- el runtime ya no incluye `npm` ni `npx`
- si en el futuro se quisiera administrar paquetes dentro del contenedor runtime, habria que ajustar la estrategia de imagen

## 14. Publicacion en GitHub

- Usuario: `tusitiowebadistancia`
- Repositorio: `backend-adoptions-final`
- Branch: `main`
- Commit inicial: `b8af038`
- Correccion documental: `04f3d4b`
- Evidencia final GitHub: `cd49dd8`
- Hash final previo a esta fase: `a49460e1b090810d55e01738d7389575e7e1eaea`

Verificacion:

```bash
git ls-remote --heads origin main
git branch -vv
```

## 15. Publicacion en Docker Hub

- Namespace: `figi1998`
- Tags publicos: `1.0.0` y `latest`
- Digest del tag: `sha256:774feb300e9562eca3a44c0c1e972238339f5af22acbd2e466f0744ad845ffe1`
- Pull publico validado
- Ejecucion publica validada en `8082:8080`
- Scout remoto validado en `linux/amd64`

## 16. Evidencias principales

| Evidencia | Ruta | Demuestra |
| --- | --- | --- |
| Tests finales | `docs/evidence/tests-final-summary.txt` | `42` tests aprobados |
| Cobertura final | `docs/evidence/coverage-final-summary.txt` | `100%` de cobertura |
| Audit produccion | `docs/evidence/npm-audit-production.log` | `0` vulnerabilidades npm |
| Imagenes locales | `docs/evidence/docker-images-remediation.txt` | IDs locales finales |
| Scout remediado | `docs/evidence/docker-scout-remediated-summary.txt` | `0C 0H 0M 0L` local |
| Push Docker Hub | `docs/evidence/dockerhub-push-1.0.0.log` | publicacion del tag `1.0.0` |
| Manifest 1.0.0 | `docs/evidence/dockerhub-manifest-1.0.0.json` | existencia remota del tag |
| Pull publico | `docs/evidence/dockerhub-pull.log` | descarga desde Docker Hub |
| Runtime publico | `docs/evidence/dockerhub-runtime-user.log` | usuario `node` `uid=1000` |
| Scout remoto | `docs/evidence/dockerhub-scout-summary.txt` | `0C 0H 0M 0L` remoto |
| GitHub remoto | `docs/evidence/github-ls-remote.txt` | existencia de `origin/main` |

## 17. Reproducibilidad

Pasos desde cero:

```bash
git clone https://github.com/tusitiowebadistancia/backend-adoptions-final.git
cd backend-adoptions-final
npm ci
npm test
npm run test:coverage
docker build --target test -t backend-adoptions-final:test .
docker run --rm backend-adoptions-final:test
docker pull figi1998/backend-adoptions-final:1.0.0
docker run --rm -p <PUERTO_HOST_LIBRE>:8080 figi1998/backend-adoptions-final:1.0.0
```

Health check:

```bash
curl http://localhost:<PUERTO_HOST_LIBRE>/health
```

## 18. README completo

~~~~md
# Backend Adoptions API

## Descripcion

API REST de adopciones construida con Node.js y Express. El proyecto incluye tests funcionales, unitarios e integracion, cobertura al 100 por ciento, Dockerfile multietapa, validacion runtime en contenedor y documentacion completa de calidad, Dockerizacion y remediacion de seguridad.

## Tecnologias

- Node.js 24 LTS
- Express 5.2.1
- Mocha
- Supertest
- Sinon
- c8
- Docker

## Requisitos

- Node.js 22 o superior
- npm
- Docker Desktop
- Git

## Instalacion

Instalacion recomendada con lockfile:

```bash
npm ci
~~~~

Si necesitas definir variables locales, copia el ejemplo:

```powershell
Copy-Item .env.example .env
```

El archivo de ejemplo actual contiene:

```text
PORT=8080
```

## Ejecucion local

```bash
npm start
```

La API escucha por defecto en `http://localhost:8080` y expone:

```text
GET /health
```

Si `8080` ya esta ocupado, podes usar otro puerto con `PORT` sin tocar PostgreSQL ni otros procesos del host.

Datos de prueba disponibles:

```text
Usuario: 64b000000000000000000001
Mascota: 64b000000000000000000002
```

## Endpoints

```http
GET /api/adoptions
GET /api/adoptions/:aid
POST /api/adoptions/:uid/:pid
```

Ejemplo de creacion:

```bash
curl -X POST http://localhost:8080/api/adoptions/64b000000000000000000001/64b000000000000000000002
```

## Tests

Resultado vigente:

- Total: `42 passing`
- Funcionales: `17`
- Unitarios: `24`
- Integracion: `1`

Distribucion por archivo:

- `test/functional/adoption.router.test.js`: `14`
- `test/functional/app.test.js`: `3`
- `test/unit/adoption.service.test.js`: `10`
- `test/unit/infrastructure.test.js`: `3`
- `test/unit/memory-repositories.test.js`: `11`
- `test/integration/composition-root.test.js`: `1`

Comandos:

```bash
npm test
npm run test:functional
npm run test:unit
```

## Cobertura

Comando:

```bash
npm run test:coverage
```

Resultado vigente:

- Statements: `100%`
- Branches: `100%`
- Functions: `100%`
- Lines: `100%`

Configuracion actual de `c8`:

- `--all`
- `--include=src/**/*.js`
- `--exclude=src/server.js`
- `--reporter=text`
- `--reporter=html`
- `--check-coverage`

`src/server.js` queda fuera de la instrumentacion porque contiene apertura del socket HTTP real y manejo de senales del proceso. Su validez se comprobo con ejecucion real.

## Docker

Estado vigente de imagenes:

- Runtime activa: `backend-adoptions-final:1.0.0` -> `774feb300e95`
- Tag adicional: `backend-adoptions-final:latest` -> `774feb300e95`
- Imagen historica pre-remediation: `backend-adoptions-final:pre-remediation` -> `176501c7ab6f`
- Imagen de tests: `backend-adoptions-final:test` -> `e2b699aff493`

Build y test target:

```bash
docker build --target test -t backend-adoptions-final:test .
docker run --rm backend-adoptions-final:test
docker build --target runtime -t backend-adoptions-final:1.0.0 .
```

Resultados vigentes en Docker:

- `42` tests aprobados dentro de Docker
- runtime ejecutado como usuario `node` con `uid=1000`
- `NODE_ENV=production`
- `PORT=8080`
- `mocha`, `sinon`, `supertest` y `c8` ausentes en runtime
- `npm` y `npx` ausentes solo en runtime
- health check en estado `healthy`
- endpoints `200`, `201`, `400`, `404` y `409` comprobados

Ejemplo de ejecucion runtime:

```bash
docker run --name backend-adoptions-final-container -p <PUERTO_HOST_LIBRE>:8080 backend-adoptions-final:1.0.0
curl http://localhost:<PUERTO_HOST_LIBRE>/health
docker logs backend-adoptions-final-container
docker stop backend-adoptions-final-container
docker rm backend-adoptions-final-container
```

## Seguridad

Resultado vigente:

- `npm audit --omit=dev`: `0` vulnerabilidades de produccion
- Docker Scout final sobre la imagen activa: `0C 0H 0M 0L`

Comparacion antes y despues de la remediacion:

| Severidad | Antes | Despues |
| --- | ---: | ---: |
| Critical | 1 | 0 |
| High | 4 | 0 |
| Medium | 5 | 0 |
| Low | 2 | 0 |

Origen real de las vulnerabilidades iniciales:

- `tar@7.5.15`
- `brace-expansion@5.0.6`
- `undici@6.26.0`

Los tres paquetes provenian del `npm` global incluido por la imagen base `node:24-alpine`, no de `/app/node_modules`. La remediacion aplicada fue eliminar `npm` y `npx` unicamente en el stage `runtime`, manteniendo intactas las dependencias reales de la aplicacion.

Documentacion relacionada:

- `docs/04-dockerizacion-seguridad.md`
- `docs/05-remediacion-seguridad.md`

## DockerHub

Repositorio publico publicado:

```text
https://hub.docker.com/r/figi1998/backend-adoptions-final
```

Usuario Docker Hub publicado:

- `figi1998`

Comandos publicos verificados:

```bash
docker pull figi1998/backend-adoptions-final:1.0.0
docker run --rm -p <PUERTO_HOST_LIBRE>:8080 figi1998/backend-adoptions-final:1.0.0
```

## GitHub

Repositorio publico publicado:

```text
https://github.com/tusitiowebadistancia/backend-adoptions-final
```

## Evidencias

Documentacion de fases:

- `docs/01-analisis-inicial.md`
- `docs/02-verificacion-local.md`
- `docs/03-calidad-ejecucion-local.md`
- `docs/04-dockerizacion-seguridad.md`
- `docs/05-remediacion-seguridad.md`

Evidencias tecnicas:

- `docs/evidence/tests-final-summary.txt`
- `docs/evidence/coverage-final-summary.txt`
- `docs/evidence/npm-audit-production.log`
- `docs/evidence/docker-images-remediation.txt`
- `docs/evidence/docker-scout-remediated-summary.txt`
- `docs/evidence/dockerhub-manifest-1.0.0.json`
- `docs/evidence/dockerhub-manifest-latest.json`
- `docs/evidence/dockerhub-scout-summary.txt`
- `docs/evidence/security-package-origin.log`
- `docs/evidence/remediation-final-checks-summary.txt`

## Autor

Federico
```

## 19. Conclusion

El proyecto cumple los requisitos funcionales, de testing, cobertura, Dockerizacion, remediacion de seguridad y publicacion publica. La API queda reproducible, documentada y verificable desde GitHub y Docker Hub, con evidencia suficiente para armar la entrega final en Google Docs sin inventar resultados ni depender de pasos ocultos.
