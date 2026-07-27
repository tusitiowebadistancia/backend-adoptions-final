# Checklist de capturas finales

## 1. GitHub publico

### 1. Captura sugerida: `01-github-repo-publico.png`
- Ventana o comando: navegador en GitHub
- Parte que debe verse: URL completa y nombre del repositorio
- Dato que demuestra: repositorio publico correcto
- Seccion del documento: URLs publicas / Publicacion en GitHub

### 2. Captura sugerida: `02-github-arbol.png`
- Ventana o comando: navegador en GitHub
- Parte que debe verse: arbol de archivos del proyecto
- Dato que demuestra: estructura del repositorio
- Seccion del documento: Arquitectura del proyecto

### 3. Captura sugerida: `03-github-commits.png`
- Ventana o comando: navegador en GitHub o `git log --oneline --decorate -5`
- Parte que debe verse: commit `a49460e`
- Dato que demuestra: commit final publicado
- Seccion del documento: Publicacion en GitHub

## 2. Docker Hub publico

### 4. Captura sugerida: `04-dockerhub-repo.png`
- Ventana o comando: navegador en Docker Hub
- Parte que debe verse: `figi1998/backend-adoptions-final`
- Dato que demuestra: repositorio publico correcto
- Seccion del documento: URLs publicas / Publicacion en Docker Hub

### 5. Captura sugerida: `05-dockerhub-tags.png`
- Ventana o comando: navegador en Docker Hub
- Parte que debe verse: tags `1.0.0` y `latest`
- Dato que demuestra: tags publicos publicados
- Seccion del documento: Publicacion en Docker Hub

## 3. Pull y ejecucion publica

### 6. Captura sugerida: `06-docker-pull-publico.png`
- Ventana o comando: `docker pull figi1998/backend-adoptions-final:1.0.0`
- Parte que debe verse: nombre de la imagen y digest
- Dato que demuestra: descarga publica valida
- Seccion del documento: Docker / Publicacion en Docker Hub

### 7. Captura sugerida: `07-docker-images.png`
- Ventana o comando: `docker images backend-adoptions-final`
- Parte que debe verse: `1.0.0`, `latest` y `pre-remediation`
- Dato que demuestra: estado local de imagenes
- Seccion del documento: Docker

### 8. Captura sugerida: `08-contenedor-healthy.png`
- Ventana o comando: `docker ps` o inspeccion de health
- Parte que debe verse: contenedor healthy
- Dato que demuestra: health check operativo
- Seccion del documento: Docker / Publicacion en Docker Hub

### 9. Captura sugerida: `09-health-response.png`
- Ventana o comando: `curl http://localhost:<PUERTO_HOST_LIBRE>/health`
- Parte que debe verse: JSON de exito
- Dato que demuestra: health endpoint funcional
- Seccion del documento: Endpoints / Docker

### 10. Captura sugerida: `10-post-adopcion.png`
- Ventana o comando: `curl -X POST ...`
- Parte que debe verse: respuesta `201`
- Dato que demuestra: creacion de adopcion
- Seccion del documento: Endpoints / Publicacion en Docker Hub

### 11. Captura sugerida: `11-error-400.png`
- Ventana o comando: request con ID invalido
- Parte que debe verse: respuesta `400`
- Dato que demuestra: validacion de parametros
- Seccion del documento: Endpoints

### 12. Captura sugerida: `12-error-404.png`
- Ventana o comando: request con ID inexistente
- Parte que debe verse: respuesta `404`
- Dato que demuestra: recurso inexistente
- Seccion del documento: Endpoints

### 13. Captura sugerida: `13-error-409.png`
- Ventana o comando: segundo POST de la misma mascota
- Parte que debe verse: respuesta `409`
- Dato que demuestra: deteccion de conflicto
- Seccion del documento: Endpoints

## 4. Calidad local

### 14. Captura sugerida: `14-npm-test.png`
- Ventana o comando: `npm test`
- Parte que debe verse: `42 passing`
- Dato que demuestra: suite aprobada
- Seccion del documento: Tests

### 15. Captura sugerida: `15-coverage-100.png`
- Ventana o comando: `npm run test:coverage`
- Parte que debe verse: `100%` en todas las metricas
- Dato que demuestra: cobertura total
- Seccion del documento: Cobertura

### 16. Captura sugerida: `16-npm-audit-production.png`
- Ventana o comando: `npm audit --omit=dev`
- Parte que debe verse: `found 0 vulnerabilities`
- Dato que demuestra: produccion sin vulnerabilidades npm
- Seccion del documento: Seguridad

## 5. Seguridad y runtime

### 17. Captura sugerida: `17-docker-scout-remoto.png`
- Ventana o comando: `docker scout cves --platform linux/amd64 registry://figi1998/backend-adoptions-final:1.0.0`
- Parte que debe verse: `0C 0H 0M 0L`
- Dato que demuestra: escaneo remoto limpio
- Seccion del documento: Seguridad / Publicacion en Docker Hub

### 18. Captura sugerida: `18-runtime-node-uid1000.png`
- Ventana o comando: `docker run --rm figi1998/backend-adoptions-final:1.0.0 id`
- Parte que debe verse: `uid=1000(node)`
- Dato que demuestra: usuario no root
- Seccion del documento: Docker / Seguridad

### 19. Captura sugerida: `19-dockerfile-multistage.png`
- Ventana o comando: editor abierto en `Dockerfile`
- Parte que debe verse: stages, `USER node`, healthcheck y eliminacion de `npm` y `npx`
- Dato que demuestra: optimizacion y remediacion runtime
- Seccion del documento: Dockerfile completo

### 20. Captura sugerida: `20-readme-publico.png`
- Ventana o comando: `README.md` local o en GitHub
- Parte que debe verse: URLs publicas reales y estado final
- Dato que demuestra: documentacion final coherente
- Seccion del documento: README completo
