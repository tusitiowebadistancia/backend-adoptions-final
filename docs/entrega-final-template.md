# Examen final de Backend — Tests funcionales y Docker

**Alumno:** Federico  
**Fecha:** [COMPLETAR]  
**Repositorio GitHub:** `https://github.com/tusitiowebadistancia/backend-adoptions-final`  
**Imagen DockerHub:** `https://hub.docker.com/r/figi1998/backend-adoptions-final`

---

## 1. Introducción

El proyecto implementa una API REST de adopciones con Node.js y Express. Se desarrollaron tests funcionales para todos los endpoints de `adoption.router.js`, tests unitarios para las reglas de negocio, un Dockerfile multietapa y documentación para reproducir la aplicación sin información adicional.

## 2. Estructura del proyecto

[Pegar aquí la salida limpia del comando `tree /F /A` o el árbol incluido en README.]

### 2.1 Propósito de los archivos y carpetas

- `src/app.js`: configura Express sin abrir un puerto, permitiendo probar la aplicación con Supertest.
- `src/server.js`: inicia el servidor HTTP.
- `src/routes/adoption.router.js`: registra todos los endpoints de adopciones.
- `src/controllers/adoption.controller.js`: valida parámetros y construye las respuestas HTTP.
- `src/services/adoption.service.js`: contiene las reglas de negocio.
- `src/repositories`: contiene repositorios en memoria.
- `test/functional`: contiene los tests HTTP completos del router.
- `test/unit`: contiene pruebas del servicio con dependencias simuladas.
- `Dockerfile`: define las etapas de test, dependencias de producción y runtime.

## 3. Tests funcionales

### 3.1 Estrategia

Los tests usan Supertest para enviar solicitudes directamente a la aplicación Express. El servicio de adopciones se reemplaza por un fake compuesto por stubs de Sinon. De esta manera, las pruebas no dependen de una base de datos, de Internet ni de información cargada previamente.

### 3.2 Casos cubiertos

- Obtención exitosa de todas las adopciones.
- Respuesta exitosa con lista vacía.
- Error interno al obtener todas las adopciones.
- Obtención de una adopción existente.
- ID de adopción inválido.
- Adopción inexistente.
- Error inesperado al obtener una adopción.
- Creación exitosa de una adopción.
- ID de usuario inválido.
- ID de mascota inválido.
- Usuario inexistente.
- Mascota inexistente.
- Mascota ya adoptada.
- Error inesperado durante la creación.

### 3.3 Código completo

[Pegar aquí el contenido completo de `test/functional/adoption.router.test.js`.]

### 3.4 Evidencia de ejecución

[Pegar logs completos de `npm test` o insertar captura legible.]

### 3.5 Cobertura

[Pegar salida de `npm run test:coverage` e insertar captura del reporte HTML.]

## 4. Dockerización

### 4.1 Dockerfile completo

[Pegar aquí el contenido completo del Dockerfile.]

### 4.2 Decisiones de optimización

- Se utiliza una imagen Alpine para reducir el tamaño de la imagen.
- Se separan las etapas de test, dependencias de producción y runtime.
- La capa de dependencias se construye antes de copiar el código para aprovechar la caché.
- `npm ci` utiliza el lockfile y produce instalaciones reproducibles.
- La imagen final no contiene dependencias de desarrollo.
- La aplicación se ejecuta con el usuario `node` y no como root.
- `.dockerignore` evita enviar archivos innecesarios al contexto de build.
- Se agrega un `HEALTHCHECK` sobre `/health`.

### 4.3 Log de construcción

[Pegar salida completa o captura del comando:]

```bash
docker build -t backend-adoptions-final:1.0.0 .
```

## 5. Imagen Docker

**Nombre local:** `backend-adoptions-final`  
**Tag:** `1.0.0`  
**Nombre público:** `figi1998/backend-adoptions-final:1.0.0`

### 5.1 Evidencia de construcción

[Insertar captura de `docker images`.]

### 5.2 Evidencia de ejecución

[Insertar logs del contenedor y respuesta de `/health`.]

### 5.3 Escaneo de seguridad

[Pegar la salida de:]

```bash
docker scout quickview backend-adoptions-final:1.0.0
docker scout cves backend-adoptions-final:1.0.0
npm audit --omit=dev
```

## 6. Ejecución del proyecto

### 6.1 Instalación local

```bash
npm ci
```

### 6.2 Ejecución local

```bash
npm start
```

### 6.3 Ejecución de tests

```bash
npm test
npm run test:coverage
```

### 6.4 Construcción Docker

```bash
docker build -t backend-adoptions-final:1.0.0 .
```

### 6.5 Tests dentro de Docker

```bash
docker build --target test -t backend-adoptions-final:test .
docker run --rm backend-adoptions-final:test
```

### 6.6 Ejecución del contenedor

```bash
docker run --name backend-adoptions-final-container -p <PUERTO_HOST_LIBRE>:8080 backend-adoptions-final:1.0.0
```

### 6.7 Publicación en DockerHub

```bash
docker login
docker tag backend-adoptions-final:1.0.0 figi1998/backend-adoptions-final:1.0.0
docker push figi1998/backend-adoptions-final:1.0.0
```

## 7. README completo

[Pegar aquí el contenido completo de README.md con las URLs públicas reales de GitHub y DockerHub.]

## 8. Conclusión

El proyecto cumple con la cobertura funcional de todos los endpoints del router de adopciones, aísla sus dependencias mediante mocks y fakes, puede ejecutarse localmente o dentro de Docker y contiene instrucciones reproducibles para tests, construcción, publicación y análisis básico de seguridad.
