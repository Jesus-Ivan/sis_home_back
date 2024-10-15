import { Router } from "express";
import { getPing } from "../controllers/index.controller.js";

//Crear un enrrutador nuevo (Es como un objeto que agrupa rutas)
const router = Router();

//Ruta de prueba conexion mysql
router.get("/ping", getPing);

export default router;
