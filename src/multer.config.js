import { STORAGE_PATH } from "./config.js";
//Importar multer
import multer from "multer";

//Crear middleware de multer (imagenes)
export const upload = multer({ dest: STORAGE_PATH });
export const uploadMovimiento = multer({ dest: STORAGE_PATH + "movimientos" });

//Crear endpont base para las rutas de las imagenes
export const image_endpoint = "/image";
