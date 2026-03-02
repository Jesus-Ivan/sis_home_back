import {
  createImageMov,
  getImageMov,
  deleteImageMov,
  createImageProducto,
  getImageProducto,
  deleteImageProducto
} from "../controllers/images.controller.js";
import { Router } from "express";
import { image_endpoint } from "../multer.config.js";

//Objeto de multer
import { upload, uploadMovimiento } from "../multer.config.js";

//Crear un enrrutador nuevo (Es como un objeto que agrupa rutas)
const router = Router();

/**
 * Rutas para las imagenes de productos
 */
router.post(image_endpoint, upload.single("imageProduct"), createImageProducto);
router.get(`${image_endpoint}/:imageName`, getImageProducto);
router.delete(`${image_endpoint}/:imageName`, deleteImageProducto);
/**
 * Rutas para las imagenes de movimientos
 */
router.post(
  `${image_endpoint}/movimiento`,
  uploadMovimiento.single("image"),
  createImageMov
);
router.get(`${image_endpoint}/movimiento/:imageName`, getImageMov);
router.delete(`${image_endpoint}/movimiento/:imageName`, deleteImageMov);
export default router;
