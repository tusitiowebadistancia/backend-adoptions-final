# Remediacion de seguridad - Fase 3.1

## 1. Fecha y hora

- Fecha y hora de cierre: `2026-07-26 16:36:54 -03:00`

## 2. Estado inicial

Estado real al comenzar esta fase:

- `42` tests aprobados dentro y fuera de Docker.
- Cobertura real: `100%`.
- Imagen runtime activa antes de remediar: `backend-adoptions-final:1.0.0` -> `176501c7ab6f`.
- Tag adicional activo antes de remediar: `backend-adoptions-final:latest` -> `176501c7ab6f`.
- Usuario runtime: `node` (`uid=1000`).
- `npm audit --omit=dev`: `0` vulnerabilidades de produccion.
- Docker Scout sobre la imagen runtime: `1 critical`, `4 high`, `5 medium`, `2 low`.

## 3. Vulnerabilidades iniciales

Resumen del primer escaneo de Docker Scout:

| Severidad | Cantidad |
| --- | ---: |
| Critical | 1 |
| High | 4 |
| Medium | 5 |
| Low | 2 |

Paquetes reportados:

- `tar@7.5.15`
- `brace-expansion@5.0.6`
- `undici@6.26.0`

## 4. CVEs

### tar@7.5.15

- `CVE-2026-59873` - Critical
- `CVE-2026-59874` - High
- `CVE-2026-53655` - Medium
- `GHSA-r292-9mhp-454m` - Medium
- `CVE-2026-59875` - Medium
- `CVE-2026-59871` - Medium

### brace-expansion@5.0.6

- `CVE-2026-13149` - High
- `CVE-2026-14257` - High

### undici@6.26.0

- `CVE-2026-12151` - High
- `CVE-2026-9679` - Medium
- `CVE-2026-6733` - Low
- `CVE-2026-11525` - Low

## 5. Origen exacto de los paquetes

Resultado real de la auditoria de origen:

- `tar` se encontro en `/usr/local/lib/node_modules/npm/node_modules/tar/package.json`.
- `brace-expansion` se encontro en `/usr/local/lib/node_modules/npm/node_modules/brace-expansion/package.json`.
- `undici` se encontro en `/usr/local/lib/node_modules/npm/node_modules/undici/package.json`.
- No se encontraron coincidencias en `/app/node_modules`.
- No se encontraron coincidencias en `corepack`.
- `express` sigue resolviendo desde `/app/node_modules/express/package.json`.

Clasificacion real:

- `tar`: `npm` global de la imagen base.
- `brace-expansion`: `npm` global de la imagen base.
- `undici`: `npm` global de la imagen base.

No pertenecen a:

- dependencias directas de la aplicacion
- dependencias runtime de `express`
- `corepack`
- paquetes `apk` de Alpine

Evidencias:

- `docs/evidence/security-package-origin.log`
- `docs/evidence/security-sbom.log`

## 6. Capas involucradas

Scout reporto la misma `diff_id` para los tres paquetes vulnerables:

- `sha256:0ba8902ff50f7fee1d64f2ed6d666e61a9fde25a6d288e667ac6690dd864f97b`

Cruce real con la imagen y el history:

- `docker-image-inspect.json` ubica esa `diff_id` como la segunda capa de filesystem de la imagen final.
- `docker-history.log` la vincula con la capa de instalacion de Node incluida por `node:24-alpine`.

Capa involucrada:

- `RUN /bin/sh -c addgroup -g 1000 node && adduser -u 1000 -G node -s /bin/sh -D node && ... && tar -xJf "node-v$NODE_VERSION-linux-$ARCH-musl.tar.xz" -C /usr/local --strip-components=1 --no-same-owner && ln -s /usr/local/bin/node /usr/local/bin/nodejs`

Conclusion:

- La aplicacion no introdujo la capa vulnerable.
- La vulnerabilidad llego por el `npm` global ya empaquetado en la imagen base de Node 24 Alpine.

## 7. Versiones corregidas indicadas por Scout

Resumen:

- `tar@7.5.15`: fixes entre `7.5.16` y `7.5.21` segun el CVE/advisory.
- `brace-expansion@5.0.6`: fixes `5.0.7` y `5.0.8`.
- `undici@6.26.0`: fix `6.27.0`.

Detalle completo:

- `docs/evidence/security-fixed-versions.md`

## 8. Estrategia aplicada

Caso aplicado: `Caso A`.

Razonamiento real:

- La API runtime inicia con `node src/server.js`.
- `npm` y `npx` no son necesarios para ejecutar la API ni para el health check.
- Los paquetes vulnerables no estaban en `/app/node_modules`.
- La remediacion compatible mas chica y verificable consistio en eliminar solo `npm` y `npx` del stage `runtime`.

No se hizo:

- `npm audit fix`
- `npm audit fix --force`
- cambio de major de Node
- cambio a Node 25
- borrado de `/app/node_modules`
- publicacion en DockerHub

## 9. Cambios del Dockerfile

Cambio real aplicado en `runtime`:

```dockerfile
# Runtime starts with `node src/server.js`, so npm/npx are not required here.
RUN rm -rf /usr/local/lib/node_modules/npm \
  && rm -f /usr/local/bin/npm /usr/local/bin/npx
```

Impacto esperado:

- Se elimina el arbol global de `npm` donde estaban `tar`, `brace-expansion` y `undici`.
- Se mantiene `node`.
- Se mantienen las dependencias de la aplicacion en `/app/node_modules`.
- El target `test` no cambia.

## 10. Imagen candidata

Pasos reales:

- Se preservo la imagen previa con `backend-adoptions-final:pre-remediation`.
- Se construyo `backend-adoptions-final:security-candidate`.
- Luego de validar, la candidata se promovio a `backend-adoptions-final:1.0.0` y `backend-adoptions-final:latest`.

Tags e IDs finales:

- `backend-adoptions-final:pre-remediation` -> `176501c7ab6f`
- `backend-adoptions-final:security-candidate` -> `774feb300e95`
- `backend-adoptions-final:1.0.0` -> `774feb300e95`
- `backend-adoptions-final:latest` -> `774feb300e95`

Evidencias:

- `docs/evidence/docker-security-candidate-build.log`
- `docs/evidence/docker-images-remediation.txt`

## 11. Tests

Comprobacion final real:

- `npm test`: `42 passing`
- `npm run test:coverage`: `42 passing`
- El target `test` del Dockerfile no fue modificado por esta remediacion.

## 12. Usuario runtime

Resultado real:

- `uid=1000(node) gid=1000(node)`
- No se ejecuto como root.

Evidencia:

- `docs/evidence/security-candidate-runtime-user.log`

## 13. Dependencias runtime

Resultado real:

- `express` sigue presente en `/app/node_modules/express/package.json`.
- `mocha`, `sinon`, `supertest` y `c8` siguen ausentes en runtime.
- `npm` y `npx` quedaron ausentes en runtime.
- `NODE_ENV=production` y `PORT=8080` se mantuvieron.

Evidencias:

- `docs/evidence/security-candidate-express.log`
- `docs/evidence/security-candidate-dev-dependencies.log`
- `docs/evidence/security-candidate-npm.log`
- `docs/evidence/security-candidate-env.log`

## 14. Health check

Resultado real:

- El contenedor candidato llego a estado `healthy`.
- La respuesta de `/health` siguio devolviendo exito.

Evidencias:

- `docs/evidence/security-candidate-container-state.json`
- `docs/evidence/security-candidate-health.json`

## 15. Pruebas HTTP

Resultado real sobre `8082:8080`:

- `200` en `GET /health`
- `200` en `GET /api/adoptions` antes y despues
- `201` en `POST /api/adoptions/:uid/:pid`
- `400` en `GET /api/adoptions/invalid-id`
- `404` en `GET /api/adoptions/ffffffffffffffffffffffff`
- `409` en un segundo `POST` con la misma mascota

Evidencias:

- `docs/evidence/security-candidate-runtime.log`
- `docs/evidence/security-candidate-adoptions-before.json`
- `docs/evidence/security-candidate-adoption-created.json`
- `docs/evidence/security-candidate-adoption-by-id.json`
- `docs/evidence/security-candidate-adoptions-after.json`
- `docs/evidence/security-candidate-validation.json`
- `docs/evidence/security-candidate-not-found.json`
- `docs/evidence/security-candidate-conflict.json`

## 16. Segundo escaneo

Comandos reales:

```powershell
docker scout quickview backend-adoptions-final:security-candidate
docker scout cves backend-adoptions-final:security-candidate
docker scout recommendations backend-adoptions-final:security-candidate
```

Resultado real:

- Quickview: `0 critical`, `0 high`, `0 medium`, `0 low`
- CVEs: `No vulnerable packages detected`
- Recommendations: la base `node:24-alpine` sigue al dia y sin recomendacion de tag alternativo

Evidencias:

- `docs/evidence/docker-scout-remediated-quickview.log`
- `docs/evidence/docker-scout-remediated-cves.log`
- `docs/evidence/docker-scout-remediated-recommendations.log`
- `docs/evidence/docker-scout-remediated-summary.txt`

## 17. Comparacion antes/despues

| Severidad | Antes | Despues |
| --- | ---: | ---: |
| Critical | 1 | 0 |
| High | 4 | 0 |
| Medium | 5 | 0 |
| Low | 2 | 0 |

## 18. Riesgos residuales

Riesgos residuales reales:

- La remediacion depende de que runtime no necesite `npm` ni `npx`.
- Si en el futuro se quisiera ejecutar `npm` dentro del contenedor runtime, esta imagen ya no lo permite.
- Docker Scout sigue mostrando vulnerabilidades asociadas a la referencia de la base `node:24-alpine`, pero la imagen final remediada ya no contiene paquetes vulnerables detectados.

No quedaron CVEs detectados por Scout en la candidata validada.

## 19. Decision de publicacion

Decision tecnica:

- Publicacion habilitada segun los criterios tecnicos de esta fase.

Justificacion:

- `Critical = 0`
- `42` tests pasan
- cobertura `100%`
- runtime `healthy`
- usuario no root
- sin devDependencies en runtime
- vulnerabilidades iniciales y remediacion documentadas

Estado operativo:

- No se publico en DockerHub por instruccion explicita.
- GitHub y DockerHub siguen pendientes.

## 20. Correcciones del README

Cambios realizados:

- se eliminaron referencias obsoletas al primer escaneo como estado vigente
- se actualizo la seccion de seguridad con comparacion antes/despues
- se reemplazo `TU_USUARIO` por `<USUARIO_DOCKERHUB>` en la seccion pendiente de DockerHub
- se mantuvo GitHub y DockerHub como pendientes
- se uso `<PUERTO_HOST_LIBRE>` en los ejemplos Docker donde el puerto del host puede variar
- se conservaron `42` tests y `100%` de cobertura como resultados actuales
- se agrego referencia a esta fase de remediacion

## 21. Archivos creados

- `docs/evidence/security-package-origin.log`
- `docs/evidence/security-sbom.log`
- `docs/evidence/security-fixed-versions.md`
- `docs/evidence/docker-scout-remediated-summary.txt`
- `docs/evidence/remediation-final-checks-summary.txt`
- `docs/evidence/docker-images-remediation.txt`
- `docs/05-remediacion-seguridad.md`

## 22. Archivos modificados

- `Dockerfile`
- `README.md`
- `docs/04-dockerizacion-seguridad.md`

## 23. Evidencias

### Origen y capas

- `docs/evidence/security-package-origin.log`
- `docs/evidence/security-sbom.log`
- `docs/evidence/security-fixed-versions.md`
- `docs/evidence/docker-image-inspect.json`
- `docs/evidence/docker-history.log`

### Build y tags

- `docs/evidence/docker-security-candidate-build.log`
- `docs/evidence/docker-images-remediation.txt`
- `docs/evidence/security-candidate-image-size.log`

### Runtime candidato

- `docs/evidence/security-candidate-runtime-user.log`
- `docs/evidence/security-candidate-env.log`
- `docs/evidence/security-candidate-express.log`
- `docs/evidence/security-candidate-dev-dependencies.log`
- `docs/evidence/security-candidate-npm.log`
- `docs/evidence/security-candidate-container-id.txt`
- `docs/evidence/security-candidate-container-state.json`
- `docs/evidence/security-candidate-runtime.log`
- `docs/evidence/security-candidate-health.json`
- `docs/evidence/security-candidate-adoptions-before.json`
- `docs/evidence/security-candidate-adoption-created.json`
- `docs/evidence/security-candidate-adoption-by-id.json`
- `docs/evidence/security-candidate-adoptions-after.json`
- `docs/evidence/security-candidate-validation.json`
- `docs/evidence/security-candidate-not-found.json`
- `docs/evidence/security-candidate-conflict.json`

### Escaneo y checks finales

- `docs/evidence/docker-scout-remediated-quickview.log`
- `docs/evidence/docker-scout-remediated-cves.log`
- `docs/evidence/docker-scout-remediated-recommendations.log`
- `docs/evidence/docker-scout-remediated-summary.txt`
- `docs/evidence/remediation-final-checks-summary.txt`

## 24. Conclusión

La remediacion de seguridad fue efectiva y minima:

- no se tocaron las dependencias reales de la aplicacion
- no se cambio Node 24
- no se uso remediacion automatica de npm
- se elimino solo `npm` global del runtime, que era el origen real de `tar`, `brace-expansion` y `undici`
- la imagen resultante mantuvo comportamiento funcional valido y paso de `1C 4H 5M 2L` a `0C 0H 0M 0L` en Docker Scout

La imagen queda tecnicamente habilitada para publicacion, pero no publicada por instruccion explicita del usuario.
