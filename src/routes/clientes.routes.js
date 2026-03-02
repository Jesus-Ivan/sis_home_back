import { Router } from "express";

import {
  actualizarCliente,
  actualizarEstado,
  cliente,
  crearCliente,
  getClientes,
} from "../controllers/clientes.controller.js";

//Crear un enrrutador nuevo (Es como un objeto que agrupa rutas)
const router = Router();

/**
 * Rutas correspondientes a los Clientes
 */

//Obtiene todos los clientes, junto con la suma se su saldo
router.get("/clientes", getClientes);
//Obtiene la informacion de un solo cliente
router.get("/cliente/:id", cliente);
router.post("/cliente", crearCliente);
router.put("/cliente/:id", actualizarCliente);
//Archiva un cliente
router.patch("/cliente/:id", actualizarEstado);

//Es un export default, significa que al ser importado desde otro script sera el import principal y puede ser renombrado
export default router;
