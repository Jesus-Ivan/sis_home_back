import fs from "node:fs";
import { STORAGE_PATH } from "../config.js";
import path from "node:path";
import { __dirname } from "../../index.js";
import { BASE_URL, API_PORT } from "../config.js";
import { image_endpoint } from "../multer.config.js";
import { createHash } from "node:crypto";

export const createImage = (req, res) => {
  //console.log(req.file);
  let url = saveImage(req.file);
  //console.log(path);
  return res.status(200).json({ message: "Success", image: url });
};

export const getImage = (req, res) => {
  const imageName = req.params.imageName;
  const rutaImagen = path.resolve(STORAGE_PATH, imageName);

  res.sendFile(rutaImagen);
};

export const deleteImage = (req, res) => {
  try {
    //Obtenemos la ruta interna (dentro del server) de la imagen
    const rutaImagen = path.join(__dirname, STORAGE_PATH, req.params.imageName);
    //Revisamos si existe la imagen antes de borrarla
    if (fs.existsSync(rutaImagen.substring(6))) {
      //Eliminamos la imagen en caso de existir
      fs.rmSync(rutaImagen.substring(6));
    }
  } catch (error) {
    //Respuesta en caso de error
    return res.status(500).json({ message: error.message });
  }
  //Respuesta al cliente
  return res.status(200).json({ message: "Success" });
};

export const saveImage = (file) => {
  //Si no recibe ningun archivo, devolver null
  if (!file) return null;

  //Definimos marca de tiempo
  let timeStamp = Date.now().toString();

  //Crear nuevo nombre, hasheando la marca de tiempo
  let newName = hash(timeStamp) + path.extname(file.originalname);

  //Definir la nueva ruta (interna en el servidor) del archivo
  const newPath = `${STORAGE_PATH}${newName}`;
  //Renombrar el archivo
  fs.renameSync(file.path, newPath);
  //Generar la URL publica de la imagen
  const url = `${BASE_URL}${API_PORT}${image_endpoint}/${newName}`;
  return url;
};

function hash(string) {
  return createHash("sha256").update(string).digest("hex");
}
