import { Router } from "express";

import {
  obtenerMovimientos,
  crearMovimiento,
  actualizarMovimiento,
} from "../controllers/movimientos.controller.js";

//Crear un enrrutador nuevo (Es como un objeto que agrupa rutas)
const router = Router();

/**
 * Rutas correspondientes a los movimientos
 */

//Obtiene la informacion de un solo cliente
router.get("/movimientos/:id_cliente", obtenerMovimientos);
router.post("/movimiento", crearMovimiento);
router.put("/movimiento", actualizarMovimiento);

//Es un export default, significa que al ser importado desde otro script sera el import principal y puede ser renombrado
export default router;
