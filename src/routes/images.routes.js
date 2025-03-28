import { createImage, getImage, deleteImage } from "../controllers/images.controller.js";
import { Router } from "express";
import { image_endpoint } from "../multer.config.js";

//Objeto de multer
import upload from "../multer.config.js";


//Crear un enrrutador nuevo (Es como un objeto que agrupa rutas)
const router = Router();


router.post(image_endpoint, upload.single("imageProduct"), createImage);
router.get(`${image_endpoint}/:imageName`, getImage);
router.delete(`${image_endpoint}/:imageName`,deleteImage)
export default router;
