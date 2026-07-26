# Dockerizacion y seguridad - Fase 3

## 1. Fecha y hora

- Fecha y hora de cierre de esta reanudacion: `2026-07-26 16:17:47 -03:00`

## 2. Estado recuperado

La fase se retomo desde un estado ya avanzado, sin reiniciar el proyecto y sin repetir tareas ya completadas.

Estado real recuperado antes de continuar:

- Ya existia `Dockerfile` multietapa.
- Ya existia `.dockerignore`.
- Ya estaban construidas las imagenes `backend-adoptions-final:test`, `backend-adoptions-final:1.0.0` y `backend-adoptions-final:latest`.
- Ya estaban ejecutados los `42` tests dentro de Docker.
- Ya estaba validado el runtime con usuario no root.
- Ya estaba validada la ausencia de `devDependencies` en la imagen final.
- Ya estaba validado el health check.
- Ya estaban guardadas respuestas HTTP reales para `200`, `201`, `400`, `404` y `409`.
- Ya se habia eliminado el contenedor usado para la prueba manual.

## 3. Archivos de proyecto involucrados

- `Dockerfile`
- `.dockerignore`
- `package.json`
- `package-lock.json`
- `README.md`
- `docs/04-dockerizacion-seguridad.md`

## 4. Verificacion de Docker operativo

Comando ejecutado en esta reanudacion:

```powershell
docker info
```

Resultado real:

- Docker Desktop estaba operativo.
- Cliente y servidor Docker: `29.1.3`.
- Contexto activo: `desktop-linux`.
- Plugin `docker scout` disponible: `v1.18.3`.
- El daemon respondio correctamente.

Evidencia:

- `docs/evidence/docker-info.txt`

## 5. Imagenes Docker existentes

Resultado real observado:

- `backend-adoptions-final:1.0.0` -> `176501c7ab6f`
- `backend-adoptions-final:latest` -> `176501c7ab6f`
- `backend-adoptions-final:test` -> `e2b699aff493`

Evidencias:

- `docs/evidence/docker-images.txt`
- `docs/evidence/docker-image-inspect.json`
- `docs/evidence/docker-history.log`

## 6. Validaciones reales ya completadas antes de la reanudacion

### 6.1 Test target de Docker

Resultado real ya disponible:

- `docker run --rm backend-adoptions-final:test`
- Total tests: `42`
- Passing: `42`
- Failing: `0`

Evidencias:

- `docs/evidence/docker-build-test.log`
- `docs/evidence/docker-tests.log`
- `docs/evidence/docker-tests-summary.txt`

### 6.2 Imagen runtime de produccion

Resultado real ya disponible:

- Imagen final construida con `node:24-alpine`.
- Tag final validado: `backend-adoptions-final:1.0.0`.
- Tag adicional validado: `backend-adoptions-final:latest`.
- Runtime configurado con `NODE_ENV=production` y `PORT=8080`.
- La imagen final expone `8080/tcp`.
- La imagen final define `HEALTHCHECK` sobre `/health`.

Evidencias:

- `docs/evidence/docker-build-production.log`
- `docs/evidence/docker-image-inspect.json`
- `docs/evidence/docker-history.log`

### 6.3 Usuario no root y dependencias finales

Resultado real ya disponible:

- Usuario efectivo dentro del contenedor: `uid=1000(node) gid=1000(node)`.
- `NODE_ENV=production`.
- Dependencia de produccion observada: `express@5.2.1`.
- Chequeo de ausencia de dependencias de desarrollo:
  - `ABSENT:mocha`
  - `ABSENT:sinon`
  - `ABSENT:supertest`
  - `ABSENT:c8`

Evidencias:

- `docs/evidence/docker-runtime-user.log`
- `docs/evidence/docker-production-dependencies.log`
- `docs/evidence/docker-dev-dependencies-check.log`

### 6.4 Ejecucion real del contenedor y pruebas HTTP

Resultado real ya disponible:

- El contenedor inicio correctamente.
- El health check interno reporto estado `healthy`.
- `GET /health` respondio correctamente.
- `GET /api/adoptions` respondio primero con lista vacia.
- `POST /api/adoptions/:uid/:pid` creo una adopcion.
- `GET /api/adoptions/:aid` devolvio la adopcion creada.
- `GET /api/adoptions` devolvio luego la adopcion persistida en memoria del proceso.
- Tambien quedaron evidencias reales de `400`, `404` y `409`.
- El contenedor de prueba manual fue eliminado despues de la validacion.

Evidencias:

- `docs/evidence/docker-container-id.txt`
- `docs/evidence/docker-container-state.json`
- `docs/evidence/docker-runtime.log`
- `docs/evidence/docker-health.json`
- `docs/evidence/docker-adoptions-before.json`
- `docs/evidence/docker-adoption-created.json`
- `docs/evidence/docker-adoption-by-id.json`
- `docs/evidence/docker-adoptions-after.json`
- `docs/evidence/docker-validation.json`
- `docs/evidence/docker-not-found.json`
- `docs/evidence/docker-conflict.json`

## 7. Docker Scout

### 7.1 Quickview

Comando ejecutado en esta reanudacion:

```powershell
docker scout quickview backend-adoptions-final:1.0.0
```

Resultado real:

- Target: `backend-adoptions-final:1.0.0`
- Digest: `176501c7ab6f`
- Base image auto-detectada: `node:24-alpine`
- Resumen de vulnerabilidades: `1 critical`, `4 high`, `5 medium`, `2 low`

Evidencias:

- `docs/evidence/docker-scout-quickview.txt`
- `docs/evidence/docker-scout-summary.txt`

### 7.2 CVEs

Comando ejecutado en esta reanudacion:

```powershell
docker scout cves backend-adoptions-final:1.0.0
```

Resultado real:

- Total de vulnerabilidades detectadas: `12`
- Paquetes afectados: `3`
- `tar@7.5.15`: `1 critical`, `1 high`, `4 medium`
- `brace-expansion@5.0.6`: `2 high`
- `undici@6.26.0`: `1 high`, `1 medium`, `2 low`

Observacion importante:

- `npm audit --omit=dev` del proyecto reporto `0` vulnerabilidades de produccion.
- Docker Scout analiza la imagen construida completa y aun asi detecto vulnerabilidades presentes en paquetes incluidos en la imagen runtime.

Evidencias:

- `docs/evidence/docker-scout-cves.txt`
- `docs/evidence/docker-scout-summary.txt`

### 7.3 Recommendations

Comando ejecutado en esta reanudacion:

```powershell
docker scout recommendations backend-adoptions-final:1.0.0
```

Resultado real:

- El comando estaba disponible en este entorno.
- Imagen base analizada: `node:24-alpine`
- Resultado de refresh: la version actual de la base esta al dia.
- Resultado de change base image: no hubo recomendaciones de tags alternativas.

Evidencias:

- `docs/evidence/docker-scout-recommendations.txt`
- `docs/evidence/docker-scout-summary.txt`

## 8. Comprobacion final del proyecto

Comandos ejecutados en esta reanudacion:

```powershell
npm test
npm run test:coverage
npm audit --omit=dev
```

Resultados reales:

- `npm test`: `42 passing`
- `npm run test:coverage`: `42 passing`
- Cobertura final: `100%` statements, `100%` branches, `100%` functions, `100%` lines
- `npm audit --omit=dev`: `found 0 vulnerabilities`

Evidencias:

- `docs/evidence/tests-final-summary.txt`
- `docs/evidence/coverage-final-summary.txt`
- `docs/evidence/npm-audit-production.log`
- `docs/evidence/fase3-final-checks-summary.txt`

## 9. Dockerfile completo

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

USER node
EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=5 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:' + (process.env.PORT || 8080) + '/health').then((response) => { if (!response.ok) process.exit(1); }).catch(() => process.exit(1))"]

CMD ["node", "src/server.js"]
```

## 10. .dockerignore completo

```text
node_modules
coverage
.git
.gitignore
.env
.env.*
npm-debug.log*
docs
*.log
.vscode
.idea
.DS_Store
```

## 11. Inventario de evidencias disponibles

### 11.1 Calidad y cobertura

- `docs/evidence/tests.log`
- `docs/evidence/tests-summary.txt`
- `docs/evidence/coverage.log`
- `docs/evidence/tests-final.log`
- `docs/evidence/tests-final-summary.txt`
- `docs/evidence/coverage-final.log`
- `docs/evidence/coverage-final-summary.txt`
- `docs/evidence/npm-audit-development.log`
- `docs/evidence/npm-audit-production.log`
- `docs/evidence/npm-ls-glob.log`

### 11.2 Ejecucion local

- `docs/evidence/local-server.log`
- `docs/evidence/local-server-error.log`
- `docs/evidence/local-health.json`
- `docs/evidence/local-adoptions-before.json`
- `docs/evidence/local-adoption-created.json`
- `docs/evidence/local-adoption-by-id.json`
- `docs/evidence/local-adoptions-after.json`
- `docs/evidence/local-validation.json`
- `docs/evidence/local-not-found.json`
- `docs/evidence/local-conflict.json`

### 11.3 Dockerizacion

- `docs/evidence/docker-build-test.log`
- `docs/evidence/docker-tests.log`
- `docs/evidence/docker-tests-summary.txt`
- `docs/evidence/docker-build-production.log`
- `docs/evidence/docker-images.txt`
- `docs/evidence/docker-image-inspect.json`
- `docs/evidence/docker-history.log`
- `docs/evidence/docker-runtime-user.log`
- `docs/evidence/docker-production-dependencies.log`
- `docs/evidence/docker-dev-dependencies-check.log`
- `docs/evidence/docker-container-id.txt`
- `docs/evidence/docker-container-state.json`
- `docs/evidence/docker-runtime.log`
- `docs/evidence/docker-health.json`
- `docs/evidence/docker-adoptions-before.json`
- `docs/evidence/docker-adoption-created.json`
- `docs/evidence/docker-adoption-by-id.json`
- `docs/evidence/docker-adoptions-after.json`
- `docs/evidence/docker-validation.json`
- `docs/evidence/docker-not-found.json`
- `docs/evidence/docker-conflict.json`

### 11.4 Seguridad y cierre

- `docs/evidence/docker-info.txt`
- `docs/evidence/docker-scout-quickview.txt`
- `docs/evidence/docker-scout-cves.txt`
- `docs/evidence/docker-scout-recommendations.txt`
- `docs/evidence/docker-scout-summary.txt`
- `docs/evidence/fase3-final-checks-summary.txt`

## 12. Conclusion

La Fase 3 queda cerrada con evidencia real de:

- build multietapa
- test target de Docker
- imagen runtime de produccion
- usuario no root
- ausencia de dependencias de desarrollo en runtime
- ejecucion real del contenedor
- health check
- flujo HTTP principal y errores esperados
- escaneo con Docker Scout
- comprobacion final local con tests, cobertura y `npm audit --omit=dev`

Quedaron fuera por instruccion explicita de esta etapa:

- publicacion en DockerHub
- uso de Git o GitHub
- limpieza destructiva de Docker

## 13. Continuidad

La remediacion posterior de seguridad y la promocion de la imagen remediada quedaron documentadas en:

- `docs/05-remediacion-seguridad.md`

Este documento conserva el resultado historico del primer escaneo de Docker Scout previo a la remediacion.
