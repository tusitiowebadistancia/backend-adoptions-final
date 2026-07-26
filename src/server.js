import { createApp } from "./app.js";
import { adoptionService } from "./composition-root.js";

const PORT = Number(process.env.PORT) || 8080;
const app = createApp({ adoptionService });

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`API de adopciones escuchando en http://localhost:${PORT}`);
});

function shutdown(signal) {
  console.log(`Señal ${signal} recibida. Cerrando servidor...`);
  server.close((error) => {
    if (error) {
      console.error("No se pudo cerrar el servidor correctamente", error);
      process.exit(1);
    }

    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
