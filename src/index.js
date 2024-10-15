import express from "express";
import productosRoutes from "./routes/productos.routes.js";
import indexRoutes from "./routes/index.routes.js";
import { API_PORT } from "./config.js";

//Crear un objeto de express (un servidor)
const app = express();

//Establecer el parseo de entrada de datos del request-body
app.use(express.json());

app.use(indexRoutes);
//usando el grupo de rutas
app.use("/api", productosRoutes);

//Manejador 404 general
app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint not found" });
});

//Escucha en el puerto
app.listen(API_PORT);
console.log("Servidor corriendo en el puerto ", API_PORT);
