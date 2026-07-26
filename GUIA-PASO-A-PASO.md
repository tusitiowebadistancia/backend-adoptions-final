# Guía paso a paso — Examen final Backend

Esta guía parte desde cero y termina con GitHub, DockerHub, seguridad, README y documento para Google Docs.

## Etapa 1 — Preparar la computadora

Instalar:

1. Node.js 24 LTS.
2. Git.
3. Docker Desktop.
4. Visual Studio Code.

Abrir PowerShell y verificar:

```powershell
node --version
npm --version
git --version
docker --version
docker compose version
```

## Etapa 2 — Abrir e instalar el proyecto

Extraer el ZIP y abrir la carpeta `backend-adoptions-final` en VS Code.

En la terminal integrada:

```powershell
npm install
```

Este comando también crea `package-lock.json`. El lockfile debe subirse a GitHub.

## Etapa 3 — Ejecutar los tests

```powershell
npm test
```

La suite contiene tests funcionales de todos los endpoints y tests unitarios del servicio.

Guardar evidencia:

```powershell
npm test 2>&1 | Tee-Object -FilePath docs/evidence/tests.log
```

Tomar una captura completa donde se vean todos los tests aprobados.

## Etapa 4 — Ejecutar cobertura

```powershell
npm run test:coverage
```

Guardar el log:

```powershell
npm run test:coverage 2>&1 | Tee-Object -FilePath docs/evidence/coverage.log
```

Abrir `coverage/index.html` en el navegador y tomar una captura legible.

## Etapa 5 — Ejecutar la API localmente

```powershell
npm start
```

Abrir:

```text
http://localhost:8080/health
```

Respuesta esperada:

```json
{
  "status": "success",
  "message": "API funcionando correctamente"
}
```

Probar creación:

```powershell
curl.exe -X POST http://localhost:8080/api/adoptions/64b000000000000000000001/64b000000000000000000002
```

Luego listar:

```powershell
curl.exe http://localhost:8080/api/adoptions
```

## Etapa 6 — Crear el repositorio Git

```powershell
git init
git add .
git commit -m "feat: implement adoption API with functional tests and Docker"
git branch -M main
```

En GitHub crear un repositorio público llamado `backend-adoptions-final` sin README adicional.

Conectar y publicar:

```powershell
git remote add origin https://github.com/tusitiowebadistancia/backend-adoptions-final.git
git push -u origin main
```

Abrir el repositorio en modo incógnito para comprobar que sea público.

## Etapa 7 — Construir la imagen Docker

Asegurarse de que Docker Desktop esté abierto.

```powershell
docker build -t backend-adoptions-final:1.0.0 .
```

Guardar el log:

```powershell
docker build -t backend-adoptions-final:1.0.0 . 2>&1 | Tee-Object -FilePath docs/evidence/docker-build.log
```

Verificar:

```powershell
docker images backend-adoptions-final
```

## Etapa 8 — Correr tests dentro de Docker

```powershell
docker build --target test -t backend-adoptions-final:test .
docker run --rm backend-adoptions-final:test
```

Tomar captura del resultado aprobado.

## Etapa 9 — Ejecutar el contenedor

```powershell
docker run --name backend-adoptions-final-container -p <PUERTO_HOST_LIBRE>:8080 backend-adoptions-final:1.0.0
```

En otra terminal:

```powershell
curl.exe http://localhost:<PUERTO_HOST_LIBRE>/health
docker ps
docker logs backend-adoptions-final-container
```

Guardar logs:

```powershell
docker logs backend-adoptions-final-container 2>&1 | Tee-Object -FilePath docs/evidence/docker-run.log
```

Detener y borrar cuando termines:

```powershell
docker stop backend-adoptions-final-container
docker rm backend-adoptions-final-container
```

## Etapa 10 — Escaneo de seguridad

```powershell
npm audit
docker scout quickview backend-adoptions-final:1.0.0
docker scout cves backend-adoptions-final:1.0.0
```

Guardar evidencia:

```powershell
docker scout cves backend-adoptions-final:1.0.0 2>&1 | Tee-Object -FilePath docs/evidence/docker-scout.log
```

No ocultar resultados. Explicar vulnerabilidades encontradas y si existe una actualización disponible.

## Etapa 11 — Publicar en DockerHub

Crear en DockerHub un repositorio público llamado `backend-adoptions-final`.

```powershell
docker login
docker tag backend-adoptions-final:1.0.0 figi1998/backend-adoptions-final:1.0.0
docker tag backend-adoptions-final:1.0.0 figi1998/backend-adoptions-final:latest
docker push figi1998/backend-adoptions-final:1.0.0
docker push figi1998/backend-adoptions-final:latest
```

Probar la imagen publicada:

```powershell
docker run --rm -p <PUERTO_HOST_LIBRE>:8080 figi1998/backend-adoptions-final:1.0.0
```

## Etapa 12 — Completar el README

Usar los metadatos públicos reales:

```text
https://github.com/tusitiowebadistancia/backend-adoptions-final
https://hub.docker.com/r/figi1998/backend-adoptions-final
```

GitHub y DockerHub ya pueden quedar con sus URLs públicas reales.

Comprobar que el README incluya:

- URL pública de GitHub.
- URL pública de DockerHub.
- Instalación.
- Ejecución local.
- Tests.
- Cobertura.
- Construcción Docker.
- Ejecución del contenedor.
- Tests dentro de Docker.
- Escaneo de seguridad.
- Datos de prueba.

## Etapa 13 — Reunir evidencias

Guardar en `docs/evidence`:

```text
01-project-tree.png
02-tests-passing.png
03-test-coverage.png
04-docker-build.png
05-docker-images.png
06-docker-tests.png
07-docker-run.png
08-health-response.png
09-docker-scout.png
10-dockerhub.png
11-github.png
```

Generar árbol en Windows:

```powershell
tree /F /A > docs/evidence/project-tree.txt
```

Eliminar manualmente la parte de `node_modules` antes de pegarla en el documento.

## Etapa 14 — Documento Google Docs

Abrir `docs/entrega-final-template.md` y usarlo como base.

Debe incluir:

1. Portada.
2. URLs públicas.
3. Estructura y explicación.
4. Código completo de tests funcionales.
5. Explicación de cada grupo.
6. Logs o capturas.
7. Dockerfile completo.
8. Explicación de optimizaciones.
9. Build y ejecución.
10. Escaneo.
11. Instrucciones reproducibles.
12. README completo.

## Etapa 15 — Commit final

```powershell
git add .
git commit -m "docs: add final evidence and delivery documentation"
git push
```

## Control final

```text
[ ] package-lock.json está versionado
[ ] npm test pasa
[ ] npm run test:coverage pasa
[ ] todos los endpoints tienen éxito, validación y error
[ ] Docker build pasa
[ ] tests dentro de Docker pasan
[ ] el contenedor responde en /health
[ ] Docker Scout fue ejecutado
[ ] la imagen 1.0.0 está en DockerHub
[ ] la imagen latest está en DockerHub
[ ] GitHub es público
[ ] README no contiene placeholders viejos del examen
[ ] Google Docs contiene códigos, logs y evidencias
[ ] no hay contraseñas ni archivos .env en GitHub
```
