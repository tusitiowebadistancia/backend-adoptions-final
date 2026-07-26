# Verificacion local reproducible - Fase 1

## 1. Fecha y hora

- Fecha y hora de cierre de la fase: `2026-07-26 14:52:29 -03:00`

## 2. Objetivo de la etapa

Dejar el proyecto instalado de manera reproducible en entorno local, generar `package-lock.json`, ejecutar tests funcionales y unitarios, medir cobertura, auditar dependencias de produccion y desarrollo, y guardar evidencia real sin tocar la logica de negocio.

## 3. Estado inicial

Resultado de la verificacion previa antes de instalar:

| Verificacion previa | Resultado real |
| --- | --- |
| `Get-Location` | `C:\Users\fedel\OneDrive\Escritorio\backend-adoptions-final\backend-adoptions-final` |
| `node --version` | `v24.12.0` |
| `npm --version` | `11.6.2` |
| `Get-ChildItem package.json` | Archivo presente en la raiz |
| `Test-Path package-lock.json` | `False` |
| `Test-Path node_modules` | `False` |
| `Test-Path package.json` | `True` |
| `Test-Path src` | `True` |
| `Test-Path test` | `True` |
| `Test-Path Dockerfile` | `True` |
| `Test-Path docs` | `True` |

Conclusion: la raiz era correcta y correspondia ejecutar `npm install`.

## 4. Versiones de Node y npm

| Herramienta | Version real |
| --- | --- |
| Node.js | `v24.12.0` |
| npm | `11.6.2` |

## 5. Instalacion con `npm install`

Comando ejecutado:

```powershell
npm install
```

Resultado real:

- Finalizo sin error fatal.
- `npm` informo una advertencia deprecada para `glob@10.5.0`.
- Se agregaron `211` paquetes.
- Se auditaron `212` paquetes.
- `69` paquetes mostraron mensaje de funding.
- Se informaron `6 vulnerabilities (1 low, 5 high)` en el arbol completo al final de la instalacion.

Diferencia entre advertencia y error fatal observada en esta corrida:

- La advertencia deprecada sobre `glob@10.5.0` no interrumpio la instalacion.
- La presencia de vulnerabilidades tampoco detuvo `npm install`.
- No hubo error fatal; el comando termino correctamente y dejo el entorno utilizable.

## 6. Generacion de `package-lock.json`

Verificaciones ejecutadas despues de `npm install`:

```powershell
Test-Path package-lock.json
Test-Path node_modules
npm ls --depth=0
```

Resultado real:

- `package-lock.json`: `True`
- `node_modules`: `True`
- Dependencias directas instaladas:

| Tipo | Paquete | Version instalada |
| --- | --- | --- |
| Produccion | `express` | `5.2.1` |
| Desarrollo | `c8` | `12.0.0` |
| Desarrollo | `mocha` | `11.7.6` |
| Desarrollo | `sinon` | `22.1.0` |
| Desarrollo | `supertest` | `7.2.2` |

Metadato del lockfile observado:

- Archivo: `package-lock.json`
- Tamano: `96086` bytes
- Ultima escritura observada: `26/7/2026 14:46:03`

## 7. Verificacion con `npm ci`

Comando ejecutado:

```powershell
npm ci
```

Resultado real:

- Finalizo sin error fatal.
- Reinstalo `211` paquetes.
- Audito `212` paquetes.
- Mantuvo `69` paquetes con funding.
- Volvio a mostrar `6 vulnerabilities (1 low, 5 high)` en el arbol completo.
- Volvio a mostrar la advertencia deprecada de `glob@10.5.0`.

Conclusion: la instalacion reproducible con lockfile funciona en este entorno.

## 8. Dependencias directas instaladas

Comparacion entre `package.json` y `npm ls --depth=0`:

| Paquete | Declarado | Instalado | Estado |
| --- | --- | --- | --- |
| `express` | `5.2.1` | `5.2.1` | Coincide |
| `c8` | `12.0.0` | `12.0.0` | Coincide |
| `mocha` | `11.7.6` | `11.7.6` | Coincide |
| `sinon` | `22.1.0` | `22.1.0` | Coincide |
| `supertest` | `7.2.2` | `7.2.2` | Coincide |

## 9. Resultado completo de los tests

Comando ejecutado:

```powershell
npm test
```

Primera ejecucion real:

- `26 passing`
- Duracion observada: `1s`
- Sin tests fallidos.
- Con stack traces impresos por `console.error` en los casos `500` simulados.

Correccion minima aplicada despues de confirmar que la suite ya pasaba:

- Se agrego `sandbox.stub(console, "error");` en `beforeEach` de `test/functional/adoption.router.test.js`.
- La restauracion siguio a cargo de `sandbox.restore()` existente en `afterEach`.
- No se modifico el manejo real de errores de produccion.

Segunda ejecucion de validacion despues de la correccion:

- `26 passing (882ms)`
- `0` fallidos.
- Sin ruido de consola en los casos `500` simulados.

Suites ejecutadas por `npm test`:

1. `Tests funcionales de adoption.router.js`
2. `GET /api/adoptions`
3. `GET /api/adoptions/:aid`
4. `POST /api/adoptions/:uid/:pid`
5. `Aplicacion Express`
6. `AdoptionService`

## 10. Distribucion entre tests funcionales y unitarios

Comandos ejecutados:

```powershell
npm run test:functional
npm run test:unit
```

Resultado real:

| Script | Resultado |
| --- | --- |
| `npm run test:functional` | `17 passing (569ms)` |
| `npm run test:unit` | `9 passing (176ms)` |
| `npm test` | `26 passing (882ms)` |

Verificacion de alcance:

- `test:functional` ejecuto solo `test/functional/**/*.test.js`.
- `test:unit` ejecuto solo `test/unit/**/*.test.js`.
- `npm test` ejecuto ambas carpetas mediante `test/**/*.test.js`.

Casos funcionales por endpoint observados:

| Endpoint | Casos ejecutados |
| --- | --- |
| `GET /api/adoptions` | exito con datos, exito con lista vacia, `500` |
| `GET /api/adoptions/:aid` | exito, validacion `400`, `404`, `500` |
| `POST /api/adoptions/:uid/:pid` | exito `201`, validacion `400` de usuario, validacion `400` de mascota, `404` usuario, `404` mascota, `409`, `500` |
| Extras funcionales | `GET /health`, `404` de ruta inexistente, guard clause de `createApp()` |

## 11. Resultado de cobertura

Comando ejecutado:

```powershell
npm run test:coverage
```

Umbrales configurados:

| Metrica | Umbral |
| --- | --- |
| Statements | `90%` |
| Branches | `85%` |
| Functions | `90%` |
| Lines | `90%` |

Resultado global real:

| Metrica | Valor real |
| --- | --- |
| Statements | `97.43%` |
| Branches | `93.10%` |
| Functions | `100%` |
| Lines | `97.43%` |

Estado del comando:

- Finalizo exitosamente.
- Genero `coverage/index.html`.
- Cumple todos los umbrales.

Clasificacion:

- `Excelente`: todas las metricas globales son mayores o iguales a `90%`.
- No es `Completa` porque no todas las metricas llegaron a `100%`.

## 12. Archivos o ramas no cubiertos

Lineas o ramas reportadas como no cubiertas:

| Archivo | Metrica destacada | Lineas no cubiertas |
| --- | --- | --- |
| `src/controllers/adoption.controller.js` | `96.49%` statements, `93.33%` branches | `6-7` |
| `src/middlewares/error-handler.js` | `92.59%` statements, `80%` branches | `5-6` |
| `src/routes/adoption.router.js` | `87.5%` statements, `66.66%` branches | `6-7` |
| `src/services/adoption.service.js` | `100%` statements, `94.44%` branches | `46` |

Observacion importante:

- Aunque algunos archivos tienen branches por debajo de `85%`, el chequeo de `c8` esta configurado a nivel global y por eso el comando pasa con las metricas agregadas del proyecto.

## 13. Auditoria de produccion

Comando ejecutado:

```powershell
npm audit --omit=dev
```

Resultado real:

- `found 0 vulnerabilities`

Interpretacion:

- No se detectaron vulnerabilidades en las dependencias de produccion instaladas localmente.
- La unica dependencia directa de produccion sigue siendo `express@5.2.1`.
- Si la imagen final se construye luego solo con dependencias de runtime, este resultado reduce el riesgo para el contenedor final.

## 14. Auditoria de desarrollo

Comando ejecutado:

```powershell
npm audit
```

Resultado real:

- `6 vulnerabilities (1 low, 5 high)`

Dependencias involucradas segun el reporte:

| Paquete vulnerable | Severidad observada | Relacion |
| --- | --- | --- |
| `brace-expansion <=5.0.7` | High | transitiva |
| `diff 6.0.0 - 8.0.2` | Reportada en audit | transitiva |
| `serialize-javascript <=7.0.4` | High | transitiva |
| `minimatch 2.0.0 - 10.0.2` | dependiente de `brace-expansion` | transitiva |
| `glob 4.3.0 - 10.5.0` | dependiente de `minimatch` | transitiva |

Dependencia directa responsable segun la cadena real detectada:

- `mocha@11.7.6`

Cadena resumida:

- `mocha -> glob@10.5.0 -> minimatch -> brace-expansion`
- `mocha -> diff`
- `mocha -> serialize-javascript`

Dependencias no afectadas por este reporte segun lo ejecutado:

- `c8` aparece con `glob@13.0.6`, no con `glob@10.5.0`.
- `sinon` no aparece en la cadena vulnerable reportada.
- `supertest` no aparece en la cadena vulnerable reportada.

Impacto para produccion:

- Estas vulnerabilidades quedan en dependencias de desarrollo.
- No deberian ingresar a una imagen final correctamente construida con `--omit=dev`.
- De todos modos, siguen siendo un riesgo para el entorno de desarrollo y para pipelines que ejecuten test con esas dependencias.

Riesgo documentado y no aplicado automaticamente:

- `npm audit` propone `npm audit fix --force`.
- El reporte indica que eso instalaria `mocha@11.3.0` y lo marca como breaking change.
- No se aplico ningun arreglo automatico en esta fase.

## 15. Arbol de dependencia de `glob`

Comando ejecutado:

```powershell
npm ls glob
```

Resultado real:

```text
backend-adoptions-final@1.0.0
|- c8@12.0.0
|  `- test-exclude@8.0.0
|     `- glob@13.0.6
`- mocha@11.7.6
   `- glob@10.5.0
```

Conclusion:

- La rama vulnerable observada en `npm audit` proviene de `mocha`, no de `c8`.

## 16. Cambios realizados

Archivos modificados o creados durante esta fase:

- `package-lock.json` generado por `npm install`
- `test/functional/adoption.router.test.js` ajustado para silenciar `console.error` en tests `500` simulados
- `docs/evidence/tests.log`
- `docs/evidence/tests-summary.txt`
- `docs/evidence/coverage.log`
- `docs/evidence/npm-audit-production.log`
- `docs/evidence/npm-audit-development.log`
- `docs/evidence/npm-ls-glob.log`
- `docs/02-verificacion-local.md`

## 17. Evidencias generadas

| Evidencia | Ruta |
| --- | --- |
| Log de tests | `docs/evidence/tests.log` |
| Resumen ASCII de tests | `docs/evidence/tests-summary.txt` |
| Log de cobertura | `docs/evidence/coverage.log` |
| Auditoria npm produccion | `docs/evidence/npm-audit-production.log` |
| Auditoria npm desarrollo | `docs/evidence/npm-audit-development.log` |
| Arbol de `glob` | `docs/evidence/npm-ls-glob.log` |
| Reporte HTML de cobertura | `coverage/index.html` |

## 18. Problemas pendientes

- Persisten `6` vulnerabilidades en dependencias de desarrollo ligadas a `mocha` y su cadena transitiva.
- El proyecto aun no tiene evidencia de Docker, Git, GitHub, DockerHub ni ejecucion manual de la API.
- La cobertura global es excelente, pero quedan ramas no cubiertas en `error-handler.js` y `adoption.router.js`.
- El log UTF-8 de tests se genera correctamente, pero la lectura desde la ruta actual de PowerShell muestra algunos caracteres corruptos; por eso se agrego `tests-summary.txt` como evidencia suplementaria en ASCII.

## 19. Criterios de aceptacion

| Verificacion | Resultado | Evidencia | Estado |
| --- | --- | --- | --- |
| `npm install` | Exitoso, `211` paquetes agregados, `212` auditados | `package-lock.json` | Cumplido |
| `npm ci` | Exitoso, reinstalacion limpia con lockfile | Salida real en consola documentada en este archivo | Cumplido |
| `npm test` | `26 passing`, `0` fallidos | `docs/evidence/tests.log` | Cumplido |
| Tests funcionales | `17 passing` | Salida real de `npm run test:functional` documentada en este archivo | Cumplido |
| Tests unitarios | `9 passing` | Salida real de `npm run test:unit` documentada en este archivo | Cumplido |
| Cobertura | `97.43 / 93.10 / 100 / 97.43` | `docs/evidence/coverage.log` | Cumplido |
| Auditoria produccion | `0` vulnerabilidades | `docs/evidence/npm-audit-production.log` | Cumplido |
| Auditoria desarrollo | `6` vulnerabilidades (`1 low`, `5 high`) | `docs/evidence/npm-audit-development.log` | Cumplido |

## 20. Conclusion

La fase 1 quedo completada con instalacion reproducible validada por `npm ci`, lockfile generado, tests funcionales y unitarios pasando, cobertura global excelente y auditoria npm separada entre produccion y desarrollo.

Estado final de esta fase:

- Todos los tests pasan.
- La cobertura cumple los umbrales configurados.
- Produccion no presenta vulnerabilidades segun `npm audit --omit=dev`.
- Desarrollo si presenta vulnerabilidades transitivas ligadas a `mocha`.
- No se aplico ningun arreglo automatico.
