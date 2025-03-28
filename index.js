import express from "express";
import productosRoutes from "./src/routes/productos.routes.js";
import indexRoutes from "./src/routes/index.routes.js";
import { API_PORT } from "./src/config.js";
import imagesRoutes from "./src/routes/images.routes.js";
import path from "node:path";

//Crear un objeto de express (un servidor)
const app = express();

/**
 * Definir el directorio base de los recursos
 */
const __filename = import.meta.url;
export const __dirname = path.dirname(__filename);

//Establecer el parseo de entrada de datos del request-body
app.use(express.json());

app.use(indexRoutes);
//usando el grupo de rutas
app.use("/api", productosRoutes);
app.use(imagesRoutes);

//Manejador 404 general
app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint not found" });
});

//Escucha en el puerto
app.listen(API_PORT);
console.log("Servidor corriendo en el puerto ", API_PORT);