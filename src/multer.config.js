import { STORAGE_PATH } from "./config.js";
//Importar multer
import multer from "multer";

//Crear middleware de multer (imagenes)
const upload = multer({ dest: STORAGE_PATH });

//Crear endpont base para las rutas de las imagenes
export const image_endpoint = "/image";

export default upload

