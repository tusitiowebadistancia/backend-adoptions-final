# Analisis inicial del proyecto Backend Adoptions Final

## 1. Fecha y hora del analisis

- Fecha y hora local: `2026-07-26 14:29:25 -03:00`

## 2. Resumen ejecutivo

El proyecto implementa una API REST pequena y bien separada para adopciones con Node.js, Express 5 y modulos ES. La arquitectura actual favorece el testing funcional sin abrir un puerto real porque `src/app.js` crea la aplicacion desacoplada de `src/server.js`, y porque `createApp()` recibe `adoptionService` por inyeccion.

Los tres endpoints reales de `src/routes/adoption.router.js` ya tienen tests funcionales definidos en `test/functional/adoption.router.test.js`, con `supertest` y `sinon`, y cubren casos de exito, validacion, `404`, `409` y `500` segun el codigo actual.

Los principales bloqueos detectados para la entrega no estan en la logica HTTP sino en la verificabilidad del proyecto:

- Falta `package-lock.json`.
- No existe `node_modules` en el arbol auditado.
- No se pudo ejecutar `npm test`, `npm run test:coverage` ni `npm audit` sin instalar dependencias.
- La carpeta no esta inicializada como repositorio Git.
- No hay evidencias reales en `docs/evidence/` mas alla de `.gitkeep`.
- README, guia y template incluyen placeholders o afirmaciones que todavia no tienen evidencia ejecutada.

El Dockerfile tiene una base razonable y multietapa, pero su reproducibilidad es solo parcial porque depende de un lockfile inexistente y hace fallback a `npm install`.

## 3. Entorno detectado

### 3.1 Identificacion general

| Item | Valor detectado |
| --- | --- |
| Nombre del proyecto | `backend-adoptions-final` |
| Version | `1.0.0` |
| Descripcion | `API REST de adopciones con tests funcionales, cobertura y Docker.` |
| Autor | `Federico` |
| Licencia | `MIT` |
| Tipo de modulos | ES Modules |
| Campo `main` | `src/server.js` |
| Script de inicio | `node src/server.js` |
| Puerto por defecto | `8080` |
| Variable de entorno de puerto | `PORT` |
| Estado Git | No inicializado como repositorio en esta carpeta |

### 3.2 Versiones y herramientas disponibles

| Herramienta | Resultado |
| --- | --- |
| `node --version` | `v24.12.0` |
| `npm --version` | `11.6.2` |
| `git --version` | `git version 2.47.0.windows.1` |
| `docker --version` | `Docker version 29.1.3, build f52814d` |
| `docker compose version` | `Docker Compose version v2.40.3-desktop.1` |
| `docker scout version` | `v1.18.3` |

### 3.3 Node requerido por el proyecto

| Fuente | Valor |
| --- | --- |
| `package.json > engines.node` | `>=22` |
| README | `Node.js 24 LTS` en tecnologias y `22 o superior` en requisitos |
| Dockerfile | `node:24-alpine` |

Conclusion: el codigo exige formalmente Node `>=22`, pero la documentacion y Docker se apoyan en Node 24. No es una contradiccion total, pero si una definicion parcialmente alineada.

### 3.4 Dependencias

#### Dependencias de produccion

| Paquete | Version |
| --- | --- |
| `express` | `5.2.1` |

#### Dependencias de desarrollo

| Paquete | Version |
| --- | --- |
| `c8` | `12.0.0` |
| `mocha` | `11.7.6` |
| `sinon` | `22.1.0` |
| `supertest` | `7.2.2` |

### 3.5 Scripts disponibles

| Script | Comando |
| --- | --- |
| `start` | `node src/server.js` |
| `dev` | `node --watch src/server.js` |
| `test` | `mocha "test/**/*.test.js" --timeout 5000` |
| `test:functional` | `mocha "test/functional/**/*.test.js" --timeout 5000` |
| `test:unit` | `mocha "test/unit/**/*.test.js" --timeout 5000` |
| `test:coverage` | `c8 --reporter=text --reporter=html --check-coverage --lines=90 --functions=90 --branches=85 --statements=90 npm test` |

### 3.6 Archivos y configuraciones base

| Item | Estado |
| --- | --- |
| `package-lock.json` | Ausente |
| `.env.example` | Presente |
| `.gitignore` | Presente |
| `.dockerignore` | Presente |
| `.git/` | Ausente |
| `node_modules/` | Ausente en el arbol auditado |
| `coverage/` | Ausente en el arbol auditado |

## 4. Arbol del proyecto

Arbol observado al inicio del analisis, excluyendo `node_modules`, `coverage` y `.git`:

```text
backend-adoptions-final/
|-- .dockerignore
|-- .env.example
|-- .gitignore
|-- Dockerfile
|-- GUIA-PASO-A-PASO.md
|-- README.md
|-- package.json
|-- docs/
|   |-- entrega-final-template.md
|   `-- evidence/
|       `-- .gitkeep
|-- scripts/
|   `-- verificar-proyecto.ps1
|-- src/
|   |-- app.js
|   |-- composition-root.js
|   |-- server.js
|   |-- controllers/
|   |   `-- adoption.controller.js
|   |-- data/
|   |   `-- seed.js
|   |-- errors/
|   |   `-- app-errors.js
|   |-- middlewares/
|   |   |-- async-handler.js
|   |   |-- error-handler.js
|   |   `-- not-found.js
|   |-- repositories/
|   |   |-- memory-adoption.repository.js
|   |   |-- memory-pet.repository.js
|   |   `-- memory-user.repository.js
|   |-- routes/
|   |   `-- adoption.router.js
|   |-- services/
|   |   `-- adoption.service.js
|   `-- utils/
|       `-- is-valid-id.js
`-- test/
    |-- functional/
    |   |-- adoption.router.test.js
    |   `-- app.test.js
    `-- unit/
        `-- adoption.service.test.js
```

### 4.1 Proposito de archivos y carpetas principales

| Ruta | Proposito |
| --- | --- |
| `src/app.js` | Crea y configura la app Express sin abrir puerto. |
| `src/server.js` | Inicia el servidor HTTP real y gestiona apagado por seniales. |
| `src/composition-root.js` | Ensambla repositorios en memoria y `AdoptionService`. |
| `src/routes/adoption.router.js` | Declara las rutas reales del modulo de adopciones. |
| `src/controllers/adoption.controller.js` | Valida parametros y traduce resultados de servicio a HTTP. |
| `src/services/adoption.service.js` | Contiene reglas de negocio de adopcion. |
| `src/repositories/` | Persistencia en memoria mediante `Map`. |
| `src/data/seed.js` | Datos iniciales para usuarios, mascotas y adopciones. |
| `src/middlewares/` | Manejo de errores async, 404 y errores globales. |
| `src/errors/app-errors.js` | Jerarquia de errores de aplicacion. |
| `src/utils/is-valid-id.js` | Valida IDs con formato de ObjectId de 24 hexadecimales. |
| `test/functional/` | Tests HTTP con Supertest contra la app Express. |
| `test/unit/` | Tests unitarios del servicio con stubs de repositorios. |
| `Dockerfile` | Imagen multietapa para test y runtime. |
| `README.md` | Documentacion principal del proyecto. |
| `GUIA-PASO-A-PASO.md` | Guia operativa de entrega y publicacion. |
| `docs/entrega-final-template.md` | Plantilla para documento final en Google Docs. |
| `docs/evidence/` | Carpeta destinada a logs y capturas de evidencia. |
| `scripts/verificar-proyecto.ps1` | Script local de instalacion, test y cobertura. |

### 4.2 Hallazgos estructurales

| Tipo | Hallazgo |
| --- | --- |
| Archivo vacio | `docs/evidence/.gitkeep` esta vacio y parece intencional. |
| Archivos duplicados | No se detectaron duplicados exactos entre los archivos auditados. |
| Nombres inconsistentes | No hay inconsistencias bloqueantes; la convencion mezcla ingles en nombres y espanol en mensajes. |
| Documentos desactualizados | README, guia y template suponen lockfile, evidencias o URLs publicas que hoy no existen. |
| Archivos que deberian ignorarse en Git | `node_modules/`, `coverage/` y `.env` ya estan cubiertos por `.gitignore`. No se detecto un faltante critico de ignore para el estado actual. |
| Archivos requeridos faltantes | Falta `package-lock.json`. Tambien faltan evidencias reales en `docs/evidence/`. La carpeta no tiene repositorio Git inicializado. |

## 5. Arquitectura

### 5.1 Evaluacion general

| Aspecto | Estado | Observacion |
| --- | --- | --- |
| Separacion app/server | Buena | `src/app.js` crea la app; `src/server.js` solo escucha y maneja shutdown. |
| Composition root | Presente | `src/composition-root.js` ensambla dependencias reales. |
| Inyeccion de dependencias | Presente | `createApp()` recibe `adoptionService`; `AdoptionService` recibe repositorios. |
| Router | Simple y claro | Tres endpoints reales, todos envueltos en `asyncHandler`. |
| Controller | Presente | Valida IDs y responde JSON con codigos HTTP explicitos. |
| Service | Presente | Centraliza reglas de negocio y errores de dominio. |
| Repositories | Presentes | Implementaciones en memoria, no externas. |
| Middlewares | Presentes | 404, captura async y handler global. |
| Manejo de errores | Correcto para el alcance | `AppError` mapea a 400/404/409; errores genericos a 500. |
| Validacion de identificadores | Parcial pero suficiente | Solo se valida formato 24 hex; no hay validacion de body porque el POST no recibe body. |
| Persistencia | En memoria | No usa MongoDB ni otra base externa. |
| Datos seed | Presentes | Un usuario, una mascota y cero adopciones iniciales. |
| Dependencias externas reales | Minimas | Express y modulos nativos de Node. |

### 5.2 Capas y flujo real

Flujo principal:

1. `src/server.js` obtiene `PORT`, crea la app y abre el socket.
2. `src/app.js` monta middlewares, `GET /health` y `app.use("/api/adoptions", adoptionRouter)`.
3. `src/routes/adoption.router.js` enlaza cada ruta con el controller.
4. `src/controllers/adoption.controller.js` valida parametros y llama a `adoptionService`.
5. `src/services/adoption.service.js` consulta repositorios, decide errores y actualiza estado.
6. Los repositorios en memoria guardan datos en `Map`.

### 5.3 Persistencia utilizada

El proyecto usa repositorios en memoria:

- `MemoryAdoptionRepository`
- `MemoryUserRepository`
- `MemoryPetRepository`

No utiliza MongoDB, Mongoose, PostgreSQL, Redis, filesystem ni servicios de terceros.

### 5.4 Dependencias externas reales a considerar

| Dependencia | Tipo | Impacto en tests |
| --- | --- | --- |
| `express` | Libreria HTTP | Se puede probar en memoria con Supertest sin puerto real. |
| `node:crypto` | Modulo nativo | `MemoryAdoptionRepository.create()` genera IDs aleatorios. |
| `Date` | API global | `MemoryAdoptionRepository.create()` genera `createdAt` dinamico. |
| `process.env.PORT` | Configuracion | Solo afecta `src/server.js` y runtime real. |

### 5.5 Testabilidad de la arquitectura

Conclusion explicita: si, la arquitectura permite ejecutar tests funcionales sin abrir un puerto real y sin conectarse a servicios externos.

Motivos:

- Los tests funcionales usan `request(app)` sobre la instancia creada por `createApp()`.
- `createApp()` exige `adoptionService` inyectado, lo que permite usar fakes y stubs.
- La implementacion real usa memoria local, no una base remota.

## 6. Inventario de endpoints de `adoption.router.js`

Se detectaron exactamente 3 endpoints reales en `src/routes/adoption.router.js`.

### 6.1 Detalle por endpoint

| Metodo | Ruta | Parametros | Controller | Servicio | Exito esperado | Codigo exito | Validaciones | Errores posibles | Codigos error | Dependencias a mockear/stubear |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `GET` | `/api/adoptions` | Ninguno | `adoptionController.getAll` | `adoptionService.getAll()` | `{ status: "success", payload: []|[...]} ` | `200` | No aplica | Error inesperado del servicio | `500` | `adoptionService.getAll` |
| `GET` | `/api/adoptions/:aid` | `aid` en ruta | `adoptionController.getById` | `adoptionService.getById(aid)` | `{ status: "success", payload: adoption }` | `200` | `aid` debe ser string hex de 24 caracteres | ID invalido, adopcion inexistente, error inesperado | `400`, `404`, `500` | `adoptionService.getById` |
| `POST` | `/api/adoptions/:uid/:pid` | `uid`, `pid` en ruta | `adoptionController.create` | `adoptionService.create({ ownerId: uid, petId: pid })` | `{ status: "success", message: "Adopcion creada correctamente", payload: adoption }` | `201` | `uid` y `pid` deben ser strings hex de 24 caracteres | Usuario inexistente, mascota inexistente, mascota ya adoptada, error inesperado | `400`, `404`, `409`, `500` | `adoptionService.create` |

### 6.2 Matriz de pruebas esperadas del router

| Endpoint | Exito | Validacion | 404 | 409 | 500 | Test existente |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `GET /api/adoptions` | Si | N/A | N/A | N/A | Si | Si |
| `GET /api/adoptions/:aid` | Si | Si | Si | N/A | Si | Si |
| `POST /api/adoptions/:uid/:pid` | Si | Si | Si | Si | Si | Si |

### 6.3 Observaciones sobre validaciones y errores

- La validacion de IDs ocurre en el controller, no en el router.
- `GET /api/adoptions` no tiene validaciones ni errores de dominio previstos por codigo, solo `500` por fallo inesperado.
- `GET /api/adoptions/:aid` depende de que el servicio lance `NotFoundError` para devolver `404`.
- `POST /api/adoptions/:uid/:pid` no usa body; toda la entrada relevante llega por parametros.
- `409` solo existe para la mascota ya adoptada.

## 7. Matriz y auditoria de tests

### 7.1 Inventario real de tests

| Item | Valor |
| --- | --- |
| Carpeta de tests detectada | `test/` |
| Carpeta `tests/` | Ausente |
| Framework | Mocha |
| Libreria HTTP | Supertest |
| Libreria de mocks/stubs | Sinon |
| Suites (`describe`) | `6` |
| Archivos de test | `3` |
| Tests (`it`) | `26` |
| Tests funcionales | `17` |
| Tests unitarios | `9` |

Distribucion observada:

- `test/functional/app.test.js`: 3 tests.
- `test/functional/adoption.router.test.js`: 14 tests.
- `test/unit/adoption.service.test.js`: 9 tests.

### 7.2 Cobertura funcional actual por endpoint

| Endpoint | Casos de exito | Casos de validacion | Casos 404 | Casos 409 | Casos 500 | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| `GET /api/adoptions` | Si | No aplica | No aplica | No aplica | Si | Cubierto por codigo de test |
| `GET /api/adoptions/:aid` | Si | Si | Si | No aplica | Si | Cubierto por codigo de test |
| `POST /api/adoptions/:uid/:pid` | Si | Si | Si | Si | Si | Cubierto por codigo de test |

### 7.3 Casos adicionales fuera de `adoption.router.js`

Tambien existen tests para:

- `GET /health`
- `404` de ruta inexistente
- error por falta de `adoptionService` al crear la app

### 7.4 Aislamiento y uso de dobles de prueba

| Aspecto | Estado | Observacion |
| --- | --- | --- |
| Uso de stubs/fakes en funcionales | Correcto | Se inyecta un `adoptionService` fake con stubs de Sinon. |
| Uso de stubs en unitarios | Correcto | Se stubbean repositorios de adopciones, usuarios y mascotas. |
| Restauracion de stubs | Correcta | `sandbox.restore()` en `afterEach` de suites principales. |
| Aislamiento entre tests | Correcto | App y stubs se recrean en `beforeEach`. |
| Dependencias externas aisladas | Si | No hay acceso real a DB ni red durante los tests definidos. |

### 7.5 Posibles falsos positivos o debilidades de la suite

| Tipo | Archivo | Observacion |
| --- | --- | --- |
| Verificacion incompleta de llamadas en errores | `test/functional/adoption.router.test.js` | En varios casos `404`, `409` y `500` no se afirma `calledOnceWithExactly`, por lo que algunos errores de mapeo de parametros podrian pasar inadvertidos. |
| Cobertura no verificada en ejecucion real | Toda la suite | Los tests existen en codigo, pero no se validaron corriendo en este entorno porque faltan dependencias instaladas. |
| Cobertura probable fuera del alcance del router | `src/server.js`, `src/composition-root.js`, repositorios | No hay tests directos observados para startup real, composition root ni repositorios en memoria. |

### 7.6 Tests faltantes o pendientes para alta cobertura

| Categoria | Archivo probable | Motivo |
| --- | --- | --- |
| Guard clauses de factories | `src/routes/adoption.router.js`, `src/controllers/adoption.controller.js` | No se observaron tests para errores por dependencia obligatoria faltante. |
| Composition root | `src/composition-root.js` | No se observo cobertura directa de ensamblado real. |
| Repositorios en memoria | `src/repositories/*.js` | No se observo test directo de persistencia en memoria, clonacion ni aleatoriedad. |
| Startup y shutdown | `src/server.js` | No se observo cobertura del `listen()` ni del cierre por senial. |
| Rama `headersSent` | `src/middlewares/error-handler.js` | No se observo test directo de esa rama. |

### 7.7 Tests redundantes

No se detectaron redundancias claras. Los casos repetidos en apariencia cubren salidas diferentes del servicio y por eso aportan valor.

### 7.8 Nota sobre stack traces esperados

Si mas adelante la suite muestra errores simulados por consola y aun asi termina aprobada, eso no implica necesariamente un fallo del test. `src/middlewares/error-handler.js` hace `console.error(error)` para errores genericos antes de responder `500`, por lo que los casos que intencionalmente stubbean `new Error("fallo inesperado")` pueden imprimir stack traces y al mismo tiempo pasar correctamente si Mocha informa suite exitosa y las aserciones del `500` coinciden.

## 8. Resultados reales de ejecucion

### 8.1 Comandos ejecutados en esta auditoria

| Comando | Resultado |
| --- | --- |
| `node --version` | OK |
| `npm --version` | OK |
| `git --version` | OK |
| `docker --version` | OK |
| `docker compose version` | OK |
| `docker scout version` | OK |
| `git status` | Falla porque la carpeta no es repositorio Git |

### 8.2 Comandos no ejecutados por restriccion o bloqueo tecnico

| Comando | Motivo |
| --- | --- |
| `npm test` | No existe `node_modules/` en el arbol auditado. La consigna de esta etapa indica no instalar dependencias. |
| `npm run test:coverage` | Mismo bloqueo: dependencias no instaladas. |
| `npm audit --omit=dev` | Mismo bloqueo: dependencias no instaladas. |
| `npm audit` | Mismo bloqueo: dependencias no instaladas. |
| `npm ls glob` | Mismo bloqueo: dependencias no instaladas. |
| `docker build ...` | La etapa actual pide inspeccionar el Dockerfile sin construir la imagen. |
| `docker run ...` | La etapa actual pide no ejecutar la imagen todavia. |

## 9. Cobertura

### 9.1 Estado de ejecucion

`npm run test:coverage` no se ejecuto porque no existe `node_modules/` y no corresponde instalar dependencias en esta etapa.

### 9.2 Umbrales configurados en `package.json`

| Metrica | Umbral |
| --- | --- |
| Statements | `90%` |
| Branches | `85%` |
| Functions | `90%` |
| Lines | `90%` |

### 9.3 Estado actual verificable

No hay valores reales verificables de:

- Statements
- Branches
- Functions
- Lines
- Archivos con lineas no cubiertas
- Exito o fallo real del comando

Conclusion: no puede afirmarse cobertura alta ni cobertura completa en el estado auditado actual.

## 10. Seguridad de dependencias npm

### 10.1 Estado de auditoria

No se ejecutaron `npm audit --omit=dev`, `npm audit` ni `npm ls glob` porque no hay dependencias instaladas localmente y la etapa actual prohibe instalar o actualizar paquetes.

### 10.2 Resultado verificable hoy

| Item | Estado |
| --- | --- |
| Vulnerabilidades de produccion | No verificadas |
| Vulnerabilidades solo de desarrollo | No verificadas |
| Dependencia directa que origina problemas | No verificada |
| Dependencias transitivas involucradas | No verificadas |
| Riesgo real para la imagen de produccion | No cuantificado aun |

### 10.3 Riesgo estimado segun el codigo actual

- La imagen de produccion instalaria solo dependencias de runtime si el Dockerfile se ejecuta como fue escrito.
- La dependencia directa de produccion es solo `express`.
- Sin embargo, mientras no se corra `npm audit --omit=dev` y no exista lockfile, el riesgo real no puede certificarse.

## 11. Evaluacion del Dockerfile

### 11.1 Inspeccion punto por punto

| Punto auditado | Estado | Observacion |
| --- | --- | --- |
| Imagen base | Cumplido | Usa `node:24-alpine`. |
| Version de Node | Cumplido | Version explicita mayor `24`, aunque no esta fijada por digest. |
| Uso de Alpine o Debian | Cumplido | Usa Alpine. |
| Multistage build | Cumplido | Tiene `base`, `test`, `production-dependencies` y `runtime`. |
| Instalacion reproducible con `npm ci` | Parcialmente cumplido | Usa `npm ci` solo si existe `package-lock.json`; hoy el lockfile falta. |
| Tratamiento cuando falta `package-lock.json` | Parcialmente cumplido | Hace fallback a `npm install`, funcional pero no reproducible. |
| Exclusion de devDependencies en produccion | Cumplido | `npm ci --omit=dev` o `npm install --omit=dev`. |
| Limpieza de cache | Cumplido | Ejecuta `npm cache clean --force`. |
| Orden de capas | Cumplido | Copia `package*.json` antes de instalar dependencias. |
| Aprovechamiento de cache | Parcialmente cumplido | Bueno para dependencias, pero el contexto aun incluye docs y otros archivos no necesarios en etapa de test. |
| Usuario no root | Cumplido | Ejecuta con `USER node`. |
| Puerto expuesto | Cumplido | `EXPOSE 8080`. |
| `NODE_ENV` | Cumplido | Definido en etapas `test` y `runtime/production-dependencies`. |
| Health check | Cumplido | Existe `HEALTHCHECK` sobre `/health`. |
| Comando de inicio | Cumplido | `CMD ["node", "src/server.js"]`. |
| Archivos copiados a produccion | Cumplido | Runtime copia `package*.json`, `src/` y `node_modules` de produccion. |
| Compatibilidad con `.dockerignore` | Cumplido | No hay conflicto evidente con el contexto definido. |
| Etapa para ejecutar tests | Cumplido | Existe stage `test` con `CMD ["npm", "test"]`. |
| Seguridad y tamano | Parcialmente cumplido | Base razonable, pero falta lockfile y podria reducirse mas el contexto de build. |

### 11.2 Observaciones importantes

- El Dockerfile esta mejor que el promedio para este tipo de examen porque ya es multietapa, usa usuario no root y separa dependencias de produccion.
- El principal problema es la falta de `package-lock.json`, que impide instalaciones reproducibles con `npm ci` como camino normal.
- El `HEALTHCHECK` esta fijado a `8080`; si mas adelante se decide ejecutar el contenedor con otro `PORT`, el healthcheck no acompana ese cambio.
- El stage de test copia todo el contexto con `COPY . .`; esto no rompe el build, pero incluye archivos de documentacion y script que no son necesarios para correr la suite.

## 12. Evaluacion de documentacion

### 12.1 README vs implementacion real

| Item a verificar | Estado | Contraste con codigo real |
| --- | --- | --- |
| Descripcion | Presente | Compatible con el codigo. |
| Tecnologias | Presente | Compatible en general, aunque mezcla `Node 24` con `engines >=22`. |
| Requisitos | Presente | Compatible parcialmente. |
| Estructura | Presente | Compatible con el arbol real observado. |
| Instalacion | Presente | Indica `npm install` inicial y luego `npm ci`, pero hoy falta `package-lock.json`. |
| Variables de entorno | Presente | Compatible con `.env.example` y `PORT`. |
| Ejecucion local | Presente | Compatible con `npm start` y `8080`. |
| Endpoints | Presente | Coincide con los 3 endpoints reales. |
| Tests | Presente | Coincide con los archivos existentes, pero no con evidencia ejecutada. |
| Cobertura | Presente | No verificable todavia. |
| Construccion Docker | Presente | No verificada todavia. |
| Ejecucion Docker | Presente | No verificada todavia. |
| Tests dentro de Docker | Presente | No verificados todavia. |
| DockerHub | Presente | Tiene placeholders de usuario pendientes. |
| Seguridad | Presente | No tiene resultados reales aun. |
| Evidencias | Presente | La carpeta esta vacia salvo `.gitkeep`. |
| URL de GitHub | Placeholder | No existe URL real consignada. |
| URL publica de DockerHub | Placeholder | No existe URL real consignada. |
| Autor | Presente | `Federico`. |

### 12.2 Placeholders y afirmaciones sin evidencia

| Archivo | Hallazgo |
| --- | --- |
| `README.md` | Contenia placeholders de usuario en URLs y comandos de DockerHub. |
| `GUIA-PASO-A-PASO.md` | Contenia placeholders de usuario y asumia etapas todavia no realizadas. |
| `docs/entrega-final-template.md` | Contiene `[COMPLETAR]`, URLs pendientes y texto declarativo que aun no puede sostenerse con evidencia real. |

### 12.3 Revision de `GUIA-PASO-A-PASO.md`

Observaciones:

- La guia es util como checklist operativo.
- Asume un estado futuro del proyecto mas avanzado que el actual.
- Indica que `npm install` generara `package-lock.json` y que ese archivo debe subirse, pero hoy el repositorio auditado no lo incluye.
- Incluye instrucciones Git y GitHub correctas para una etapa posterior, pero todavia no aplican a esta carpeta porque no hay repo Git.

### 12.4 Revision de `docs/entrega-final-template.md`

Observaciones:

- Es una plantilla valida para el informe final.
- Todavia no puede usarse como evidencia de cumplimiento porque contiene placeholders y texto prospectivo.
- La seccion de Dockerizacion da por buenas optimizaciones que recien quedaran sustentadas cuando el build exista y sea reproducible.

### 12.5 Revision de `docs/evidence/`

Estado actual:

- Solo contiene `.gitkeep`.
- No hay logs.
- No hay capturas.
- No hay arbol exportado.
- No hay evidencia de tests, cobertura, Docker ni seguridad.

## 13. Comparacion con la consigna

| Requisito de la consigna | Estado | Evidencia actual | Trabajo pendiente |
| --- | --- | --- | --- |
| Crear tests funcionales para todos los endpoints de `adoption.router.js` | Parcial | Existe `test/functional/adoption.router.test.js` con cobertura por codigo de los 3 endpoints | Ejecutar la suite y validar que pasa realmente |
| Usar mocks, stubs o fakes para aislar dependencias externas | Cumplido | Se inyecta `adoptionService` fake con stubs de Sinon; en unitarios se stubbean repositorios | Mantener enfoque y reforzar aserciones donde haga falta |
| Cubrir casos de exito, errores y validaciones | Parcial | Los casos estan definidos en codigo | Ejecutarlos y ajustar lo que falle |
| Obtener una cobertura alta y verificable | Pendiente | Solo existe el script y umbrales configurados | Instalar dependencias, correr cobertura y cerrar gaps reales |
| Crear un Dockerfile optimizado | Parcial | Dockerfile multietapa, usuario no root, healthcheck y `--omit=dev` | Incorporar lockfile, validar build real y ajustar contexto/cache |
| Construir correctamente la imagen Docker | Pendiente | No hay build ejecutado en esta etapa | Ejecutar `docker build` y guardar evidencia |
| Ejecutar correctamente la imagen Docker | Pendiente | No hay `docker run` ejecutado en esta etapa | Levantar contenedor, probar `/health` y endpoints |
| Publicar posteriormente la imagen en DockerHub | Pendiente | No hay imagen publica ni URL real | Etiquetar, publicar y documentar |
| Realizar un escaneo basico de seguridad | Pendiente | Solo se verifico que `docker scout` esta disponible | Ejecutar `npm audit` y `docker scout` con evidencia |
| Completar un README reproducible | Parcial | README extenso y cercano al objetivo | Eliminar placeholders, contrastar con resultados reales y corregir desajustes |
| Preparar toda la informacion y evidencia para Google Docs | Parcial | Existe `docs/entrega-final-template.md` | Completar capturas, logs, URLs y narrativa final |

## 14. Problemas priorizados

| Prioridad | Problema | Archivo afectado | Impacto | Solucion propuesta | Momento recomendado |
| --- | --- | --- | --- | --- | --- |
| Critico | Falta `package-lock.json` | Raiz del proyecto | Bloquea `npm ci` reproducible y debilita tests, cobertura y Docker | Generar lockfile controlado una vez instaladas dependencias correctas y versionarlo | Fase 1 |
| Critico | No hay evidencia ejecutada de tests, cobertura ni auditoria npm | Estado general | No puede demostrarse cumplimiento real de la consigna | Instalar dependencias y ejecutar test, coverage y audit guardando logs | Fases 1 y 2 |
| Alto | La carpeta no esta inicializada como repositorio Git | Estado del repo | Impide versionado formal, push a GitHub y trazabilidad de entrega | Inicializar Git cuando el proyecto este listo para empezar evidencia y publicacion | Fase 6 |
| Alto | `docs/evidence/` no contiene evidencias reales | `docs/evidence/` | La entrega final no tiene respaldos visuales ni logs | Generar y guardar capturas y logs de cada hito | Fase 8 |
| Alto | Dockerfile depende de un lockfile inexistente y hace fallback a `npm install` | `Dockerfile` | El build es menos reproducible y puede variar con el tiempo | Ajustar politica a lockfile obligatorio o documentar claramente el cambio tras generar el lock | Fases 1 y 4 |
| Medio | README afirma pasos y resultados que todavia no fueron ejecutados | `README.md` | Riesgo de documentacion no reproducible o enganosa | Reescribir secciones con evidencia real y placeholders resueltos | Fase 9 |
| Medio | Guia y template contienen placeholders y texto prospectivo | `GUIA-PASO-A-PASO.md`, `docs/entrega-final-template.md` | Riesgo de entrega inconsistente si no se actualizan al final | Completar o ajustar cuando existan URLs, logs y capturas reales | Fases 8, 9 y 10 |
| Medio | Los tests negativos del router no siempre verifican argumentos exactos del servicio | `test/functional/adoption.router.test.js` | Puede haber falsos positivos si el controller llama al servicio con datos incorrectos en ramas de error | Reforzar aserciones `calledOnceWithExactly` en ramas negativas relevantes | Fase 2 |
| Bajo | `HEALTHCHECK` queda fijo en `8080` aunque la app admite `PORT` configurable | `Dockerfile`, `src/server.js`, `.env.example` | Puede fallar el healthcheck si el contenedor se ejecuta con otro puerto interno | Revisar estrategia de configuracion de puerto en Docker | Fase 4 |
| Bajo | `scripts/verificar-proyecto.ps1` usa `npm install` y modifica el entorno | `scripts/verificar-proyecto.ps1` | Menor reproducibilidad que `npm ci` una vez exista lockfile | Alinear el script con la estrategia final de instalacion | Fase 1 |
| Mejora opcional | El contexto de build aun incluye documentacion y scripts no necesarios en la etapa de test | `.dockerignore`, `Dockerfile` | Build algo mas pesado de lo necesario | Afinar `.dockerignore` si no afecta la estrategia de evidencia | Fase 4 |

## 15. Plan completo de trabajo

### Fase 1. Normalizacion inicial

Objetivo: dejar el proyecto en un estado reproducible para poder verificar todo lo demas.

Archivos que probablemente se modificaran:

- `package-lock.json`
- `package.json`
- `scripts/verificar-proyecto.ps1`
- `README.md`
- `Dockerfile`

Comandos previstos:

- `npm install`
- `npm ci`
- `npm test`

Evidencias que deben guardarse:

- log de instalacion
- presencia de `package-lock.json`
- captura o log de estructura resultante

Criterio de aceptacion:

- existe `package-lock.json`
- `npm ci` funciona
- la instalacion es repetible

Riesgos:

- resolucion inesperada de dependencias
- cambios necesarios en scripts o Dockerfile por el nuevo lockfile

### Fase 2. Tests y cobertura

Objetivo: verificar y, si hace falta, completar la suite funcional y la cobertura real.

Archivos que probablemente se modificaran:

- `test/functional/adoption.router.test.js`
- `test/functional/app.test.js`
- `test/unit/adoption.service.test.js`
- archivos de `src/` que fallen en test real

Comandos previstos:

- `npm test`
- `npm run test:functional`
- `npm run test:unit`
- `npm run test:coverage`

Evidencias que deben guardarse:

- log de tests aprobados
- log de cobertura
- captura de `coverage/index.html`

Criterio de aceptacion:

- todos los tests pasan
- todos los endpoints del router tienen casos exigidos por la consigna
- se cumplen los umbrales de `c8`

Riesgos:

- cobertura insuficiente en `server`, `composition-root` o repositorios
- falsos positivos en ramas negativas

### Fase 3. Ejecucion local

Objetivo: validar el comportamiento manual de la API fuera del runner de tests.

Archivos que probablemente se modificaran:

- `src/server.js`
- `.env.example`
- `README.md`

Comandos previstos:

- `npm start`
- `curl.exe http://localhost:8080/health`
- `curl.exe http://localhost:8080/api/adoptions`
- `curl.exe -X POST http://localhost:8080/api/adoptions/64b000000000000000000001/64b000000000000000000002`

Evidencias que deben guardarse:

- captura del `health`
- log o captura de endpoints principales

Criterio de aceptacion:

- la app responde en `8080`
- los endpoints devuelven lo esperado

Riesgos:

- diferencias entre flujo real y pruebas con dependencias mockeadas

### Fase 4. Dockerizacion

Objetivo: hacer reproducible el build y validar runtime en contenedor.

Archivos que probablemente se modificaran:

- `Dockerfile`
- `.dockerignore`
- `README.md`

Comandos previstos:

- `docker build -t backend-adoptions-final:1.0.0 .`
- `docker build --target test -t backend-adoptions-final:test .`
- `docker run --rm backend-adoptions-final:test`
- `docker run --name backend-adoptions-final-container -p 8080:8080 backend-adoptions-final:1.0.0`

Evidencias que deben guardarse:

- log de build
- captura de `docker images`
- log de ejecucion del contenedor
- respuesta de `/health`

Criterio de aceptacion:

- build exitoso
- tests en Docker exitosos
- contenedor operativo

Riesgos:

- fallos por lockfile
- diferencias entre entorno local y Alpine
- healthcheck no alineado con el puerto configurado

### Fase 5. Seguridad

Objetivo: obtener una fotografia real de riesgos npm y de la imagen.

Archivos que probablemente se modificaran:

- `README.md`
- `docs/entrega-final-template.md`
- eventualmente `package.json` o `Dockerfile` si aparecen hallazgos accionables

Comandos previstos:

- `npm audit --omit=dev`
- `npm audit`
- `npm ls glob`
- `docker scout quickview backend-adoptions-final:1.0.0`
- `docker scout cves backend-adoptions-final:1.0.0`

Evidencias que deben guardarse:

- logs de auditoria npm
- logs de Docker Scout

Criterio de aceptacion:

- hallazgos documentados claramente
- diferenciacion entre produccion y desarrollo

Riesgos:

- vulnerabilidades transitivas sin fix simple
- cambios incompatibles si alguna actualizacion mayor fuese necesaria

### Fase 6. Git y GitHub

Objetivo: preparar versionado publico y trazabilidad de entrega.

Archivos que probablemente se modificaran:

- `.git/` como estado del repo
- `README.md`

Comandos previstos:

- `git init`
- `git add .`
- `git commit -m "..."`
- `git branch -M main`
- `git remote add origin ...`
- `git push -u origin main`

Evidencias que deben guardarse:

- captura del repo publico
- URL final de GitHub

Criterio de aceptacion:

- repo accesible publicamente
- historial minimo coherente

Riesgos:

- olvidar archivos requeridos
- exponer archivos no deseados

### Fase 7. DockerHub

Objetivo: publicar imagenes versionadas y verificables.

Archivos que probablemente se modificaran:

- `README.md`
- `docs/entrega-final-template.md`

Comandos previstos:

- `docker login`
- `docker tag backend-adoptions-final:1.0.0 <USUARIO_DOCKERHUB>/backend-adoptions-final:1.0.0`
- `docker tag backend-adoptions-final:1.0.0 <USUARIO_DOCKERHUB>/backend-adoptions-final:latest`
- `docker push <USUARIO_DOCKERHUB>/backend-adoptions-final:1.0.0`
- `docker push <USUARIO_DOCKERHUB>/backend-adoptions-final:latest`

Evidencias que deben guardarse:

- capturas de DockerHub
- URL publica de la imagen

Criterio de aceptacion:

- imagen `1.0.0` publicada
- imagen `latest` publicada

Riesgos:

- login incorrecto
- tags inconsistentes

### Fase 8. Evidencias

Objetivo: reunir todo el material verificable de la entrega.

Archivos que probablemente se modificaran:

- `docs/evidence/*`

Comandos previstos:

- `npm test 2>&1 | Tee-Object -FilePath docs/evidence/tests.log`
- `npm run test:coverage 2>&1 | Tee-Object -FilePath docs/evidence/coverage.log`
- `docker build -t backend-adoptions-final:1.0.0 . 2>&1 | Tee-Object -FilePath docs/evidence/docker-build.log`
- `docker logs backend-adoptions-final-container 2>&1 | Tee-Object -FilePath docs/evidence/docker-run.log`
- `docker scout cves backend-adoptions-final:1.0.0 2>&1 | Tee-Object -FilePath docs/evidence/docker-scout.log`

Evidencias que deben guardarse:

- logs
- capturas
- arbol del proyecto
- URLs publicas

Criterio de aceptacion:

- carpeta `docs/evidence/` con material suficiente para sostener el README y el documento final

Riesgos:

- capturas incompletas o ilegibles
- logs sin contexto

### Fase 9. README final

Objetivo: convertir el README en un instructivo totalmente reproducible y basado en evidencia.

Archivos que probablemente se modificaran:

- `README.md`

Comandos previstos:

- sin comando obligatorio; trabajo editorial basado en resultados reales

Evidencias que deben guardarse:

- diff final del README
- verificacion manual de enlaces y comandos

Criterio de aceptacion:

- no quedan placeholders
- todas las afirmaciones se pueden demostrar

Riesgos:

- dejar texto que prometa mas de lo efectivamente ejecutado

### Fase 10. Documento final

Objetivo: completar el documento de entrega en base a la plantilla y las evidencias reunidas.

Archivos que probablemente se modificaran:

- `docs/entrega-final-template.md`
- documento final en Google Docs fuera del repo

Comandos previstos:

- sin comando tecnico obligatorio

Evidencias que deben guardarse:

- version final del documento
- enlaces a GitHub y DockerHub

Criterio de aceptacion:

- el documento puede leerse de punta a punta sin requerir informacion externa

Riesgos:

- inconsistencias entre README, documento y evidencia

### Fase 11. Revision de entrega

Objetivo: hacer una verificacion final cruzada antes de publicar o entregar.

Archivos que probablemente se modificaran:

- `README.md`
- `docs/entrega-final-template.md`
- `docs/evidence/*`

Comandos previstos:

- `npm test`
- `npm run test:coverage`
- `docker build -t backend-adoptions-final:1.0.0 .`
- `docker run --rm -p 8080:8080 backend-adoptions-final:1.0.0`

Evidencias que deben guardarse:

- checklist final completado
- confirmacion visual de URLs, imagenes y comandos

Criterio de aceptacion:

- no quedan placeholders
- todas las tareas criticas tienen evidencia
- el proyecto se puede reproducir de local a DockerHub

Riesgos:

- cambios de ultimo momento que rompan tests o documentacion

## 16. Lista de comandos ejecutados

```text
node --version
npm --version
git --version
docker --version
docker compose version
git status
docker scout version
Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz"
```

## 17. Archivos revisados

- `package.json`
- `README.md`
- `Dockerfile`
- `.env.example`
- `.gitignore`
- `.dockerignore`
- `GUIA-PASO-A-PASO.md`
- `docs/entrega-final-template.md`
- `docs/evidence/.gitkeep`
- `scripts/verificar-proyecto.ps1`
- `src/app.js`
- `src/server.js`
- `src/composition-root.js`
- `src/routes/adoption.router.js`
- `src/controllers/adoption.controller.js`
- `src/services/adoption.service.js`
- `src/repositories/memory-adoption.repository.js`
- `src/repositories/memory-user.repository.js`
- `src/repositories/memory-pet.repository.js`
- `src/data/seed.js`
- `src/errors/app-errors.js`
- `src/middlewares/async-handler.js`
- `src/middlewares/error-handler.js`
- `src/middlewares/not-found.js`
- `src/utils/is-valid-id.js`
- `test/functional/app.test.js`
- `test/functional/adoption.router.test.js`
- `test/unit/adoption.service.test.js`

## 18. Conclusion

El proyecto tiene una base tecnica buena para cumplir la consigna: arquitectura simple, testeable, sin dependencias externas reales y con una suite funcional ya escrita para los endpoints del router de adopciones. El mayor trabajo pendiente no es inventar la solucion desde cero, sino normalizar el entorno, ejecutar y verificar lo ya construido, cerrar brechas de reproducibilidad y producir evidencia real.

Los bloqueos concretos de esta etapa son:

- falta `package-lock.json`
- falta `node_modules/`
- no hay repo Git inicializado
- no hay evidencia en `docs/evidence/`
- no hay ejecucion real registrada de tests, cobertura, Docker ni seguridad

Con esos puntos resueltos en el orden propuesto, el proyecto deberia poder completarse de forma controlada y documentada.
