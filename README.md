# Backend Adoptions API

## Descripción

API REST de adopciones construida con Node.js y Express. El proyecto incluye tests funcionales, unitarios e integración, cobertura al 100 por ciento, Dockerfile multietapa, validación runtime en contenedor y documentación completa de calidad, Dockerización y remediación de seguridad.

## Tecnologías

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

## Instalación

Instalación recomendada con lockfile:

```bash
npm ci
```

Si necesitás definir variables locales, copiá el ejemplo:

```powershell
Copy-Item .env.example .env
```

El archivo de ejemplo actual contiene:

```text
PORT=8080
```

## Ejecución local

```bash
npm start
```

La API escucha por defecto en `http://localhost:8080` y expone:

```text
GET /health
```

Si `8080` ya está ocupado, podés usar otro puerto con `PORT` sin tocar PostgreSQL ni otros procesos del host.

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

Ejemplo de creación:

```bash
curl -X POST http://localhost:8080/api/adoptions/64b000000000000000000001/64b000000000000000000002
```

## Tests

Resultado vigente:

- Total: `42 passing`
- Funcionales: `17`
- Unitarios: `24`
- Integración: `1`

Distribución por archivo:

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

Configuración actual de `c8`:

- `--all`
- `--include=src/**/*.js`
- `--exclude=src/server.js`
- `--reporter=text`
- `--reporter=html`
- `--check-coverage`

`src/server.js` queda fuera de la instrumentación porque contiene apertura del socket HTTP real y manejo de señales del proceso. Su validez se comprobó con ejecución real.

## Docker

Estado vigente de imágenes:

- Runtime activa: `backend-adoptions-final:1.0.0` -> `774feb300e95`
- Tag adicional: `backend-adoptions-final:latest` -> `774feb300e95`
- Imagen histórica pre-remediation: `backend-adoptions-final:pre-remediation` -> `176501c7ab6f`
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

Ejemplo de ejecución runtime:

```bash
docker run --name backend-adoptions-final-container -p <PUERTO_HOST_LIBRE>:8080 backend-adoptions-final:1.0.0
curl http://localhost:<PUERTO_HOST_LIBRE>/health
docker logs backend-adoptions-final-container
docker stop backend-adoptions-final-container
docker rm backend-adoptions-final-container
```

## Seguridad

Resultado vigente:

- `npm audit --omit=dev`: `0` vulnerabilidades de producción
- Docker Scout final sobre la imagen activa: `0C 0H 0M 0L`

Comparación antes y después de la remediación:

| Severidad | Antes | Después |
| --- | ---: | ---: |
| Critical | 1 | 0 |
| High | 4 | 0 |
| Medium | 5 | 0 |
| Low | 2 | 0 |

Origen real de las vulnerabilidades iniciales:

- `tar@7.5.15`
- `brace-expansion@5.0.6`
- `undici@6.26.0`

Los tres paquetes provenían del `npm` global incluido por la imagen base `node:24-alpine`, no de `/app/node_modules`. La remediación aplicada fue eliminar `npm` y `npx` únicamente en el stage `runtime`, manteniendo intactas las dependencias reales de la aplicación.

Documentación relacionada:

- `docs/04-dockerizacion-seguridad.md`
- `docs/05-remediacion-seguridad.md`

## DockerHub Pendiente

Publicación todavía no ejecutada.

Referencia futura:

```text
https://hub.docker.com/r/<USUARIO_DOCKERHUB>/backend-adoptions-final
```

Comandos de referencia cuando corresponda:

```bash
docker tag backend-adoptions-final:1.0.0 <USUARIO_DOCKERHUB>/backend-adoptions-final:1.0.0
docker tag backend-adoptions-final:1.0.0 <USUARIO_DOCKERHUB>/backend-adoptions-final:latest
docker push <USUARIO_DOCKERHUB>/backend-adoptions-final:1.0.0
docker push <USUARIO_DOCKERHUB>/backend-adoptions-final:latest
```

## GitHub Pendiente

Publicación todavía no ejecutada.

Referencia futura:

```text
https://github.com/<USUARIO_GITHUB>/backend-adoptions-final
```

## Evidencias

Documentación de fases:

- `docs/01-analisis-inicial.md`
- `docs/02-verificacion-local.md`
- `docs/03-calidad-ejecucion-local.md`
- `docs/04-dockerizacion-seguridad.md`
- `docs/05-remediacion-seguridad.md`

Evidencias técnicas:

- `docs/evidence/tests-final-summary.txt`
- `docs/evidence/coverage-final-summary.txt`
- `docs/evidence/npm-audit-production.log`
- `docs/evidence/docker-images-remediation.txt`
- `docs/evidence/docker-scout-remediated-summary.txt`
- `docs/evidence/security-package-origin.log`
- `docs/evidence/remediation-final-checks-summary.txt`

## Autor

Federico
