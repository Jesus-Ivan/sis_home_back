import { Router } from "express";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  getProducto
} from "../controllers/productos.controller.js";

//Crear un enrrutador nuevo (Es como un objeto que agrupa rutas)
const router = Router();

/**
 * Rutas correspondientes a los productos
 */

router.get("/productos", getProductos);
router.get("/productos/:id", getProducto);
router.post("/productos", createProducto);
router.put("/productos/:id", updateProducto);
router.delete("/productos/:id", deleteProducto);

//Es un export default, significa que al ser importado desde otro script sera el import principal y puede ser renombrado
export default router;
