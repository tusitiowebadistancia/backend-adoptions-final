# Publicacion en Docker Hub - Fase 4C

## 1. Fecha y hora

- Fecha originalmente consignada: `2026-07-26 17:27:37 -03:00`
- Estado: dato arrastrado de la fase anterior
- Evidencia temporal de ejecucion: `2026-07-26T23:44:06.603Z`
- Hora minima aproximada de ejecucion en Argentina: `2026-07-26 20:44:06 -03:00`
- Fecha y hora de correccion documental: `2026-07-27 10:27:32 -03:00`
- Aclaracion: la hora exacta original de cierre no fue capturada, pero la publicacion y validacion siguen demostradas por las evidencias tecnicas y temporales disponibles

## 2. Usuario Docker Hub

- `figi1998`

## 3. Correo de inicio de sesión

- `fedelfigini@gmail.com`

No se registraron credenciales, contraseñas ni tokens en archivos o logs.

## 4. Nombre del repositorio

- `backend-adoptions-final`

## 5. URL pública

- `https://hub.docker.com/r/figi1998/backend-adoptions-final`

## 6. Imagen local de origen

- `backend-adoptions-final:1.0.0`

## 7. ID de imagen

- `774feb300e95`

## 8. Tags públicos

- `figi1998/backend-adoptions-final:1.0.0`
- `figi1998/backend-adoptions-final:latest`

## 9. Resultado de los pushes

Resultado real:

- `figi1998/backend-adoptions-final:1.0.0` publicado correctamente
- `figi1998/backend-adoptions-final:latest` publicado correctamente
- ambos tags publicaron el mismo digest de tag remoto

Evidencias:

- `docs/evidence/dockerhub-push-1.0.0.log`
- `docs/evidence/dockerhub-push-latest.log`

## 10. Digests remotos

Digest remoto del tag publicado:

- `sha256:774feb300e9562eca3a44c0c1e972238339f5af22acbd2e466f0744ad845ffe1`

Digest del manifiesto remoto `linux/amd64`:

- `sha256:0968a924fc93a6e6bfeb1aba69f38a897131cfcc1032e2c497838fc7c53bd227`

Digest adicional de attestation observado en `manifest inspect`:

- `sha256:624c2bcc8ca41e3c9eda5565743b2644bebca08643f389dca99db18c5de8b709`

## 11. Verificación con manifest inspect

Resultado real:

- `docker manifest inspect figi1998/backend-adoptions-final:1.0.0` devolvió manifiesto remoto válido
- `docker manifest inspect figi1998/backend-adoptions-final:latest` devolvió manifiesto remoto válido
- ambos tags existen remotamente

Evidencias:

- `docs/evidence/dockerhub-manifest-1.0.0.json`
- `docs/evidence/dockerhub-manifest-latest.json`

## 12. Verificación con docker pull

Resultado real:

- `docker pull figi1998/backend-adoptions-final:1.0.0` resolvió el digest `sha256:774feb300e9562eca3a44c0c1e972238339f5af22acbd2e466f0744ad845ffe1`
- la imagen quedó confirmada como pública y descargable

Evidencias:

- `docs/evidence/dockerhub-pull.log`
- `docs/evidence/dockerhub-image-inspect.txt`

## 13. Ejecución de la imagen publicada

Comando real ejecutado:

```powershell
docker run -d --name backend-adoptions-final-dockerhub-check -p 8082:8080 figi1998/backend-adoptions-final:1.0.0
```

Resultado real:

- la imagen publicada arrancó correctamente desde Docker Hub
- se ejecutó exclusivamente con namespace `figi1998/backend-adoptions-final:1.0.0`
- el contenedor se eliminó al finalizar la validación

Evidencias:

- `docs/evidence/dockerhub-container-id.txt`
- `docs/evidence/dockerhub-container-state.json`
- `docs/evidence/dockerhub-runtime.log`
- `docs/evidence/dockerhub-container-remove.txt`
- `docs/evidence/dockerhub-container-ps-after-remove.txt`

## 14. Estado healthy

- estado `healthy` confirmado antes de probar endpoints

## 15. Pruebas HTTP

Resultado real sobre `8082:8080`:

- `GET /health` -> exito
- `GET /api/adoptions` -> `200`
- `POST /api/adoptions/:uid/:pid` -> `201`
- `GET /api/adoptions/:aid` -> `200`
- error de validacion -> `400`
- recurso inexistente -> `404`
- conflicto por mascota ya adoptada -> `409`

Evidencias:

- `docs/evidence/dockerhub-health.json`
- `docs/evidence/dockerhub-adoptions-before.json`
- `docs/evidence/dockerhub-adoption-created.json`
- `docs/evidence/dockerhub-adoption-by-id.json`
- `docs/evidence/dockerhub-adoptions-after.json`
- `docs/evidence/dockerhub-validation.json`
- `docs/evidence/dockerhub-not-found.json`
- `docs/evidence/dockerhub-conflict.json`

## 16. Usuario no root

Resultado real:

- `uid=1000(node) gid=1000(node)`

Evidencia:

- `docs/evidence/dockerhub-runtime-user.log`

## 17. Dependencias runtime

Resultado real:

- `express` presente en `/app/node_modules/express/package.json`
- `mocha`, `sinon`, `supertest` y `c8` ausentes en runtime
- `npm` y `npx` ausentes en runtime
- `NODE_ENV=production`
- `PORT=8080`

Evidencias:

- `docs/evidence/dockerhub-express.log`
- `docs/evidence/dockerhub-dev-dependencies.log`
- `docs/evidence/dockerhub-npm.log`
- `docs/evidence/dockerhub-env.log`

## 18. Escaneo remoto

Comandos finales usados:

```powershell
docker scout quickview --platform linux/amd64 registry://figi1998/backend-adoptions-final:1.0.0
docker scout cves --platform linux/amd64 registry://figi1998/backend-adoptions-final:1.0.0
```

Nota:

- el primer intento sin `--platform linux/amd64` falló porque el host resolvía `windows/amd64`
- el escaneo válido final se ejecutó sobre la plataforma correcta publicada

## 19. Resultado de vulnerabilidades

Resultado remoto final:

- Critical: `0`
- High: `0`
- Medium: `0`
- Low: `0`

Evidencias:

- `docs/evidence/dockerhub-scout-quickview.log`
- `docs/evidence/dockerhub-scout-cves.log`
- `docs/evidence/dockerhub-scout-summary.txt`

## 20. Actualización del README

Cambios realizados:

- DockerHub pasó de pendiente a publicado
- se incorporó la URL real `https://hub.docker.com/r/figi1998/backend-adoptions-final`
- se reemplazaron comandos pendientes por `docker pull` y `docker run` públicos reales
- se conservaron GitHub real, `42` tests, cobertura `100%` y Scout final `0C 0H 0M 0L`

## 21. Actualización de la guía

Cambios realizados:

- se reemplazó el namespace pendiente por `figi1998/backend-adoptions-final`
- se mantuvo `<PUERTO_HOST_LIBRE>` como placeholder técnico válido
- se dejaron GitHub y DockerHub con sus datos públicos reales

## 22. Actualización del template

Cambios realizados:

- se actualizó la URL real de Docker Hub
- se actualizó el nombre público de la imagen
- se reemplazaron comandos pendientes por el namespace real `figi1998`

## 23. Archivos creados

- `docs/08-publicacion-dockerhub.md`
- `docs/evidence/dockerhub-push-1.0.0.log`
- `docs/evidence/dockerhub-push-latest.log`
- `docs/evidence/dockerhub-manifest-1.0.0.json`
- `docs/evidence/dockerhub-manifest-latest.json`
- `docs/evidence/dockerhub-pull.log`
- `docs/evidence/dockerhub-image-inspect.txt`
- `docs/evidence/dockerhub-runtime-user.log`
- `docs/evidence/dockerhub-env.log`
- `docs/evidence/dockerhub-express.log`
- `docs/evidence/dockerhub-dev-dependencies.log`
- `docs/evidence/dockerhub-npm.log`
- `docs/evidence/dockerhub-container-id.txt`
- `docs/evidence/dockerhub-container-state.json`
- `docs/evidence/dockerhub-runtime.log`
- `docs/evidence/dockerhub-health.json`
- `docs/evidence/dockerhub-adoptions-before.json`
- `docs/evidence/dockerhub-adoption-created.json`
- `docs/evidence/dockerhub-adoption-by-id.json`
- `docs/evidence/dockerhub-adoptions-after.json`
- `docs/evidence/dockerhub-validation.json`
- `docs/evidence/dockerhub-not-found.json`
- `docs/evidence/dockerhub-conflict.json`
- `docs/evidence/dockerhub-container-remove.txt`
- `docs/evidence/dockerhub-container-ps-before-remove.txt`
- `docs/evidence/dockerhub-container-ps-after-remove.txt`
- `docs/evidence/dockerhub-scout-quickview.log`
- `docs/evidence/dockerhub-scout-cves.log`
- `docs/evidence/dockerhub-scout-summary.txt`

## 24. Evidencias

- `docs/evidence/dockerhub-push-1.0.0.log`
- `docs/evidence/dockerhub-push-latest.log`
- `docs/evidence/dockerhub-manifest-1.0.0.json`
- `docs/evidence/dockerhub-manifest-latest.json`
- `docs/evidence/dockerhub-pull.log`
- `docs/evidence/dockerhub-image-inspect.txt`
- `docs/evidence/dockerhub-runtime-user.log`
- `docs/evidence/dockerhub-env.log`
- `docs/evidence/dockerhub-express.log`
- `docs/evidence/dockerhub-dev-dependencies.log`
- `docs/evidence/dockerhub-npm.log`
- `docs/evidence/dockerhub-container-state.json`
- `docs/evidence/dockerhub-runtime.log`
- `docs/evidence/dockerhub-health.json`
- `docs/evidence/dockerhub-adoptions-before.json`
- `docs/evidence/dockerhub-adoption-created.json`
- `docs/evidence/dockerhub-adoption-by-id.json`
- `docs/evidence/dockerhub-adoptions-after.json`
- `docs/evidence/dockerhub-validation.json`
- `docs/evidence/dockerhub-not-found.json`
- `docs/evidence/dockerhub-conflict.json`
- `docs/evidence/dockerhub-scout-quickview.log`
- `docs/evidence/dockerhub-scout-cves.log`
- `docs/evidence/dockerhub-scout-summary.txt`

## 25. Conclusión

La imagen remediada `774feb300e95` fue publicada correctamente en Docker Hub bajo `figi1998/backend-adoptions-final` con los tags `1.0.0` y `latest`, ambos resolviendo el mismo digest remoto. La imagen publicada pudo descargarse, ejecutarse, responder healthy, validar el flujo HTTP completo y mantener `0C 0H 0M 0L` en Docker Scout remoto para `linux/amd64`.
