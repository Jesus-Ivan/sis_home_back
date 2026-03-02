import fs from "node:fs";
import { STORAGE_PATH } from "../config.js";
import path from "node:path";
import { __dirname } from "../../index.js";
import { BASE_URL, API_PORT } from "../config.js";
import { image_endpoint } from "../multer.config.js";
import { createHash } from "node:crypto";

export const createImageProducto = (req, res) => {
  try {
    let url = saveImage(req.file, STORAGE_PATH);
    return res.status(200).json({ message: "Success", image: url });
  } catch (error) {
    //Respuesta en caso de error
    return res.status(500).json({ message: error.message });
  }
};

export const getImageProducto = (req, res) => {
  const imageName = req.params.imageName;
  const rutaImagen = path.resolve(STORAGE_PATH, imageName);

  res.sendFile(rutaImagen);
};

export const deleteImageProducto = (req, res) => {
  //Obtener el nombre de la imagen
  const imageName = req.params.imageName;
  try {
    //Eliminar la imagen
    deleteImage(STORAGE_PATH, imageName);
    //Respuesta al cliente
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    //Respuesta en caso de error
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Crea una imagen en el servidor. Con ayuda del middleware de multer.\
 * En la carpeta "src\public\storage\images\movimientos"
 * @param {image} req
 * @param {*} res
 */
export const createImageMov = (req, res) => {
  try {
    let url = saveImage(req.file, STORAGE_PATH + "movimientos/", "/movimiento");
    return res.status(200).json({ message: "Success", image: url });
  } catch (error) {
    //Respuesta en caso de error
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Obtiene una imagen correspondiente a un movimiento
 * @param {imageName} req
 * @param {*} res
 */
export const getImageMov = (req, res) => {
  const imageName = req.params.imageName;
  const rutaImagen = path.resolve(STORAGE_PATH + "movimientos/", imageName);

  res.sendFile(rutaImagen);
};

export const deleteImageMov = (req, res) => {
  //Obtener el nombre de la imagen
  const imageName = req.params.imageName;
  try {
    //Eliminar la imagen
    deleteImage(STORAGE_PATH + "movimientos/", imageName);
    //Respuesta al cliente
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    //Respuesta en caso de error
    return res.status(500).json({ message: error.message });
  }
};

/**
 *
 * @param {*} file
 * @param {string} internalDestinationPath Carpeta interna en la que se va a guardar el archivo en el servidor
 * @param {string} routeSubfix Ruta publica (url) de la imagen. Concatenada con: image_endpoint
 * @returns
 */
export const saveImage = (file, internalDestinationPath, routeSubfix = "") => {
  //Si no recibe ningun archivo, devolver null
  if (!file) return null;

  //Definimos marca de tiempo
  let timeStamp = Date.now().toString();

  //Crear nuevo nombre, hasheando la marca de tiempo
  let newName = hash(timeStamp) + path.extname(file.originalname);

  //Definir la nueva ruta (interna en el servidor) del archivo
  const newPath = `${internalDestinationPath}${newName}`;
  //Renombrar el archivo
  fs.renameSync(file.path, newPath);
  //Generar la URL publica de la imagen
  const url = `${BASE_URL}${API_PORT}${
    image_endpoint + routeSubfix
  }/${newName}`;
  return url;
};

function hash(string) {
  return createHash("sha256").update(string).digest("hex");
}

/**
 *
 * @param {string} internalSourcePath Carpeta interna en la que se guardó el archivo en el servidor
 * @param {string} imageName Nombre de la imagen, provista en la Url
 * @returns
 */
export const deleteImage = (internalSourcePath, imageName) => {
  //Obtenemos la ruta interna (dentro del server) de la imagen
  const rutaImagen = path.resolve(internalSourcePath, imageName);
  //Revisamos si existe la imagen antes de borrarla
  if (fs.existsSync(rutaImagen)) {
    //Eliminamos la imagen en caso de existir
    fs.rmSync(rutaImagen);
  }
};
