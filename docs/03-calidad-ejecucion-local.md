# Calidad y ejecucion local - Fase 2

## 1. Fecha y hora

- Fecha y hora de cierre de la fase: `2026-07-26 15:22:57 -03:00`

## 2. Objetivos

- Revisar la integridad estructural de `README.md`.
- Fortalecer la suite de tests sin tocar innecesariamente el codigo de produccion.
- Cubrir las ramas pendientes detectadas en la fase anterior.
- Hacer que la cobertura incluya todos los modulos relevantes de `src`.
- Ejecutar la API real fuera de Supertest.
- Probar manualmente el flujo principal y casos de error.
- Guardar logs y respuestas como evidencia.

## 3. Estado inicial

Estado de referencia al comenzar la fase:

- `npm test`: `26 passing`
- `npm run test:coverage`:
  - Statements: `97.43%`
  - Branches: `93.10%`
  - Functions: `100%`
  - Lines: `97.43%`
- Faltaban ramas por cubrir en:
  - `src/controllers/adoption.controller.js`
  - `src/middlewares/error-handler.js`
  - `src/routes/adoption.router.js`
  - `src/services/adoption.service.js`
- La cobertura aun no incluia de forma explicita todos los modulos de `src`.

## 4. Problemas encontrados en el README

Revision realizada sobre:

- estructura de encabezados
- cierre de fences Markdown
- separacion de secciones
- coherencia de datos ya verificados

Hallazgo real:

- No se detectaron fences sin cierre.
- Conteo real de delimitadores: `58`, numero par.
- No habia secciones metidas dentro de bloques de codigo por error.
- Los problemas reales eran factuales, no estructurales:
  - el arbol no mostraba `test/integration`
  - el conteo de tests ya estaba desactualizado
  - la cobertura ya no representaba el estado final deseado
  - faltaba reflejar la ejecucion local real fuera de Supertest

## 5. Correcciones de Markdown realizadas

- Se valido que el README quedara con fences balanceados.
- Se mantuvieron las secciones separadas de instalacion, ejecucion local, tests, cobertura, Docker y seguridad.
- Se actualizaron solo datos realmente verificados:
  - cantidad final de tests
  - distribucion por tipo
  - cobertura final
  - ejecucion local comprobada
  - evidencias reales disponibles
- Se dejaron pendientes sin inventar:
  - GitHub
  - DockerHub
  - Docker build
  - Docker run
  - Docker Scout
  - capturas manuales

## 6. Tests nuevos

Archivos creados en esta fase:

- `test/unit/infrastructure.test.js`
- `test/unit/memory-repositories.test.js`
- `test/integration/composition-root.test.js`

Adicionalmente se agrego un caso nuevo en:

- `test/unit/adoption.service.test.js`

## 7. Tests fortalecidos

Archivo reforzado:

- `test/functional/adoption.router.test.js`

Cambios realizados:

- Se agregaron aserciones `calledOnceWithExactly(...)` en ramas con IDs validos y respuestas `404`, `409` y `500`.
- Se agrego una verificacion adicional de llamada en `GET /api/adoptions` cuando el servicio falla con `500`.
- Se mantuvieron `notCalled(...)` en los casos de IDs invalidos.

Objetivo logrado:

- reducir falsos positivos donde el endpoint respondiera bien pero invocara el servicio con parametros equivocados.

## 8. Tests de infraestructura

Archivo:

- `test/unit/infrastructure.test.js`

Cobertura aportada:

- `createAdoptionRouter()` lanza `TypeError` sin `adoptionController`
- `createAdoptionController()` lanza `TypeError` sin `adoptionService`
- `errorHandler()` delega a `next(error)` cuando `res.headersSent = true`

Estas pruebas cubrieron las guard clauses y la rama pendiente del middleware de errores.

## 9. Tests de repositorios

Archivo:

- `test/unit/memory-repositories.test.js`

Cobertura aportada:

- `MemoryAdoptionRepository`
  - construccion con datos iniciales
  - `getAll()`
  - `getById()` existente e inexistente
  - `create()`
  - formato del ID
  - `createdAt`
  - proteccion mediante clones
- `MemoryUserRepository`
  - usuario existente e inexistente
  - actualizacion exitosa
  - actualizacion inexistente
  - proteccion mediante clones
- `MemoryPetRepository`
  - mascota existente e inexistente
  - actualizacion exitosa
  - actualizacion inexistente
  - proteccion mediante clones

## 10. Test del composition root

Archivo:

- `test/integration/composition-root.test.js`

Validaciones reales:

- `adoptionService` esta ensamblado como instancia real de `AdoptionService`
- usa `MemoryAdoptionRepository`, `MemoryUserRepository` y `MemoryPetRepository`
- `getAll()` funciona y devuelve un array
- puede consultar los repositorios reales con el seed cargado

## 11. Cantidad final de tests

Resultado final real:

- Total: `42`
- Fallidos: `0`

## 12. Distribucion por tipo

| Tipo | Cantidad real |
| --- | ---: |
| Funcionales | 17 |
| Unitarios | 24 |
| Integracion | 1 |
| Total | 42 |

Detalle por archivo:

- `test/functional/adoption.router.test.js`: `14`
- `test/functional/app.test.js`: `3`
- `test/unit/adoption.service.test.js`: `10`
- `test/unit/infrastructure.test.js`: `3`
- `test/unit/memory-repositories.test.js`: `11`
- `test/integration/composition-root.test.js`: `1`

## 13. Configuracion final de c8

Script final en `package.json`:

```text
c8 --all --include=src/**/*.js --exclude=src/server.js --reporter=text --reporter=html --check-coverage --lines=100 --functions=100 --branches=100 --statements=100 npm test
```

Cambios reales respecto del estado anterior:

- se agrego `--all`
- se agrego `--include=src/**/*.js`
- se agrego `--exclude=src/server.js`
- los umbrales se elevaron a `100/100/100/100` despues de comprobar cobertura real completa

## 14. Justificacion de exclusion de `src/server.js`

`src/server.js` se excluye de cobertura porque contiene:

- apertura del socket HTTP real
- lectura de `PORT`
- manejo de seniales `SIGTERM` y `SIGINT`

Ese archivo se valido mediante ejecucion local real en esta fase, no mediante tests instrumentados en proceso.

## 15. Cobertura final real

Resultado final real de `npm run test:coverage`:

| Metrica | Valor real |
| --- | --- |
| Statements | `100%` |
| Branches | `100%` |
| Functions | `100%` |
| Lines | `100%` |

Conclusion:

- La cobertura es realmente completa sobre todos los archivos incluidos.
- No es solo alta; es `100%` real para el conjunto cubierto por c8.

## 16. Archivos o ramas pendientes

Pendientes de cobertura:

- Ninguno dentro del conjunto incluido por c8.

Pendiente fuera de cobertura instrumentada, pero validado por ejecucion real:

- `src/server.js`

## 17. Ejecucion local del servidor

Bloqueo encontrado:

- `8080` estaba ocupado por un proceso externo `postgres`.
- No se cerro automaticamente ese proceso ajeno.

Decision tomada:

- Se uso `8081` con aprobacion explicita del usuario para completar la fase.

Resultado real:

- La API inicio correctamente en `http://localhost:8081`.
- Evidencia: `docs/evidence/local-server.log`
- `docs/evidence/local-server-error.log` quedo vacio.

## 18. Health check

Resultado real:

- Codigo HTTP: `200`
- Body:
  - `status: success`
  - `message: API funcionando correctamente`

Evidencia:

- `docs/evidence/local-health.json`

## 19. Flujo de creacion y consulta

IDs usados del seed:

- `USER_ID = 64b000000000000000000001`
- `PET_ID = 64b000000000000000000002`

Flujo real observado:

1. Listado inicial:
   - `GET /api/adoptions`
   - HTTP `200`
   - array inicial vacio
2. Creacion:
   - `POST /api/adoptions/64b000000000000000000001/64b000000000000000000002`
   - HTTP `201`
   - ID generado real: `ad15803dba02fe72afc851de`
   - ID valido de 24 hexadecimales
3. Consulta por ID:
   - `GET /api/adoptions/ad15803dba02fe72afc851de`
   - HTTP `200`
4. Listado posterior:
   - `GET /api/adoptions`
   - HTTP `200`
   - contiene la adopcion creada

Evidencias:

- `docs/evidence/local-adoptions-before.json`
- `docs/evidence/local-adoption-created.json`
- `docs/evidence/local-adoption-by-id.json`
- `docs/evidence/local-adoptions-after.json`

## 20. Casos manuales `400`, `404` y `409`

### Validacion `400`

- Request: `GET /api/adoptions/id-invalido`
- HTTP: `400`
- `code: VALIDATION_ERROR`
- Evidencia: `docs/evidence/local-validation.json`

### No encontrado `404`

- Request: `GET /api/adoptions/64b000000000000000000099`
- HTTP: `404`
- `code: NOT_FOUND`
- Evidencia: `docs/evidence/local-not-found.json`

### Conflicto `409`

- Request: segundo `POST` con el mismo usuario y mascota
- HTTP: `409`
- `code: CONFLICT`
- Evidencia: `docs/evidence/local-conflict.json`

## 21. Logs generados

- `docs/evidence/tests-final.log`
- `docs/evidence/tests-final-summary.txt`
- `docs/evidence/coverage-final.log`
- `docs/evidence/coverage-final-summary.txt`
- `docs/evidence/local-server.log`
- `docs/evidence/local-server-error.log`

Observacion:

- Los logs UTF-8 originales se conservaron.
- Se agregaron resumentes ASCII para tests y cobertura porque PowerShell muestra algunos caracteres corruptos al leer los archivos redirigidos.

## 22. Archivos creados

- `test/unit/infrastructure.test.js`
- `test/unit/memory-repositories.test.js`
- `test/integration/composition-root.test.js`
- `docs/evidence/tests-final.log`
- `docs/evidence/tests-final-summary.txt`
- `docs/evidence/coverage-final.log`
- `docs/evidence/coverage-final-summary.txt`
- `docs/evidence/local-server.log`
- `docs/evidence/local-server-error.log`
- `docs/evidence/local-health.json`
- `docs/evidence/local-adoptions-before.json`
- `docs/evidence/local-adoption-created.json`
- `docs/evidence/local-adoption-by-id.json`
- `docs/evidence/local-adoptions-after.json`
- `docs/evidence/local-conflict.json`
- `docs/evidence/local-validation.json`
- `docs/evidence/local-not-found.json`
- `docs/03-calidad-ejecucion-local.md`

## 23. Archivos modificados

- `package.json`
- `README.md`
- `test/functional/adoption.router.test.js`
- `test/unit/adoption.service.test.js`

## 24. Evidencias

| Verificacion | Resultado real | Evidencia | Estado |
| --- | --- | --- | --- |
| README valido | Fences balanceados, estructura correcta, datos actualizados | `README.md` | Cumplido |
| Tests totales | `42 passing` | `docs/evidence/tests-final.log` | Cumplido |
| Cobertura | `100/100/100/100` | `docs/evidence/coverage-final.log` | Cumplido |
| API inicia | Exitosa en `8081` por bloqueo externo de `8080` | `docs/evidence/local-server.log` | Cumplido |
| Health check | `200` | `docs/evidence/local-health.json` | Cumplido |
| Crear adopcion | `201` | `docs/evidence/local-adoption-created.json` | Cumplido |
| Consultar adopcion | `200` | `docs/evidence/local-adoption-by-id.json` | Cumplido |
| Conflicto | `409` | `docs/evidence/local-conflict.json` | Cumplido |
| Validacion | `400` | `docs/evidence/local-validation.json` | Cumplido |
| No encontrado | `404` | `docs/evidence/local-not-found.json` | Cumplido |

## 25. Capturas que el usuario debera tomar manualmente

- vista legible de `coverage/index.html`
- terminal con `npm test` aprobado
- terminal con `npm run test:coverage` aprobada
- evidencia visual del inicio local del servidor
- respuesta del health check en navegador o terminal

## 26. Criterios de aceptacion

- README estructuralmente valido: cumplido
- Tests fortalecidos sin cambiar contratos HTTP: cumplido
- Cobertura completa del conjunto incluido: cumplido
- Ejecucion local real fuera de Supertest: cumplido
- Evidencias guardadas en `docs/evidence`: cumplido
- Proceso del servidor detenido al finalizar: a verificar en la comprobacion final

## 27. Conclusion

La fase 2 quedo tecnicamente resuelta. La suite paso de `26` a `42` tests, la cobertura paso de alta a completa (`100%` real sobre todos los archivos incluidos), el README quedo estructuralmente valido y actualizado con resultados comprobados, y la API real funciono fuera de Supertest.

La unica desviacion respecto del puerto esperado fue operativa y estuvo justificada:

- `8080` estaba ocupado por `postgres`
- no se intervino ese proceso ajeno
- se ejecuto la API en `8081` con aprobacion explicita del usuario

No se tocaron Docker, Git, GitHub ni DockerHub en esta fase.
