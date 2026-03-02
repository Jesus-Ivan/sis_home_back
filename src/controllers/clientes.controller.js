import { Op, Sequelize } from "sequelize";
import { Cliente } from "../model/Cliente.model.js";
import { Movimiento } from "../model/Movimiento.model.js";
import { obtenerSumaMovimientos } from "./movimientos.controller.js";

/**
 * Obtiene todos los clientes
 * Y agrega la suma de todos sus movimientos activos
 */
export const getClientes = async (req, res) => {
  //Obtener el estado del cliente (Obtenido del QueryParam)
  const estado = req.query.estado;
  const nombre = req.query.nombre;
  const apodo = req.query.apodo;
  //Construir objeto base de opciones para la consulta
  let options = {
    // 1. Seleccionar los atributos del Cliente y el cálculo de la suma
    attributes: [
      "id",
      "nombre",
      "apodo",
      "estado",
      "contra",
      // Calcular la suma del monto de los movimientos
      [
        Sequelize.fn("SUM", Sequelize.col("movimientos.monto")),
        "sumaTotalMovimientos",
      ],
    ],
    // 2. Incluir el modelo Movimiento para el JOIN
    include: [
      {
        model: Movimiento,
        as: "movimientos",
        attributes: [], // No necesitamos los atributos de Movimiento directamente en la salida
        where: {
          estado: "1", // Filtramos solo los movimientos con estado "1"
        },
        required: false, // Utilizamos LEFT JOIN (opcional) para incluir clientes sin movimientos pendientes
      },
    ],
    // 4. Agrupar los resultados por el ID del Cliente
    group: ["Cliente.id", "Cliente.nombre", "Cliente.apodo", "Cliente.estado"], // Incluye todos los atributos no agregados del SELECT
    // 5. Opcional: ordenar por el ID del Cliente
    order: [["apodo", "ASC"]],
  };
  //Definir el objeto de las condiciones del where de la consulta
  let whereOptions = {};

  //si hay QueryParam (estado), agregarlo a la consulta
  if (typeof estado === "string" || estado instanceof String) {
    whereOptions = { ...whereOptions, estado: estado };
  }
  //si hay QueryParam (nombre y apodo)
  if (
    (typeof nombre === "string" || nombre instanceof String) &&
    (typeof apodo === "string" || apodo instanceof String)
  ) {
    //Agregar ambas condiciones dentro de la clausula OR WHERE
    whereOptions = {
      ...whereOptions,
      [Op.or]: [
        { nombre: { [Op.like]: "%" + nombre + "%" } },
        { apodo: { [Op.like]: "%" + apodo + "%" } },
      ],
    };
  } else if (typeof nombre === "string" || nombre instanceof String) {
    //Si solo hay QueryParam (nombre)

    //Agregar la condicion del nombre dentro de la clausula OR WHERE
    whereOptions = {
      ...whereOptions,
      [Op.or]: [{ nombre: { [Op.like]: "%" + nombre + "%" } }],
    };
  } else if (typeof apodo === "string" || apodo instanceof String) {
    //Si solo hay QueryParam (apodo)

    //Agregar la condicion del apodo dentro de la clausula OR WHERE
    whereOptions = {
      ...whereOptions,
      [Op.or]: [{ apodo: { [Op.like]: "%" + apodo + "%" } }],
    };
  }

  //Consulta final
  options = {
    ...options,
    where: whereOptions,
  };

  try {
    //Si no existe la tabla en la BD, Crearla en base al modelo
    await Cliente.sync();
    //Obtiene todos los registros de clientes
    const result = await Cliente.findAll(options);
    //Enviar resultado
    res.status(200).json({
      ok: true,
      status: 200,
      count: result.length,
      list: result,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Obtiene los datos de 1 cliente en base a su ID y la suma de sus movimientos activos
 */
export const cliente = async (req, res) => {
  //Obtener el id del cliente
  const id = req.params.id;

  try {
    //Verificar si la tabla existe
    await Cliente.sync();
    //Realizar la consulta asincrona
    const result = await Cliente.findAll({
      where: { id: id },
      limit: 1,
    });

    const suma_mov = await obtenerSumaMovimientos(id, null);

    //Enviar resultado
    res.status(200).json({
      ok: true,
      status: 200,
      result: result,
      sumaMovimientos: suma_mov,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Recibe la informacion formato JSON para crear al cliente.\
 * Nombre: opcional (string)\
 * Apodo: requerido (string)\
 * Contra: opcional (string)\
 * Estado: requerido (string)
 */
export const crearCliente = async (req, res) => {
  //Deconstruir objeto del request
  const { nombre, apodo, contra, estado } = req.body;

  try {
    //Si no existe la tabla en la BD, Crearla en base al modelo
    await Cliente.sync();
    //Crear el registro del cliente en la BD
    const result = await Cliente.create({
      nombre: nombre?.toUpperCase(),
      apodo: apodo.toUpperCase(),
      contra: contra,
      estado: estado.toUpperCase(),
    });
    //Enviar resultado
    res.status(201).json({
      ok: true,
      status: 201,
      message: "cliente creado",
      customer: result,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Actualiza los valores del cliente
 * @param {nombre, apodo, contra, estado} req
 * @param {*} res
 */
export const actualizarCliente = async (req, res) => {
  //Deconstruir el objeto del request
  const { nombre, apodo, contra } = req.body;

  try {
    //Si no existe la tabla en la BD, Crearla en base al modelo
    await Cliente.sync();

    //Realizar la actualizacion de los datos
    await Cliente.update(
      {
        nombre: nombre?.toUpperCase(),
        apodo: apodo.toUpperCase(),
        contra: contra,
      },
      {
        where: { id: req.params.id },
      },
    );
    //Devolver el registro actualizado
    const new_row = await Cliente.findByPk(req.params.id);

    //Enviar respuesta
    res.status(200).json({
      ok: true,
      status: 200,
      message: "cliente actualizado",
      customer: new_row,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Actualiza el estado del cliente, segun la informacion dada en el request body
 * @param {estado} req
 * @param {*} res
 */
export const actualizarEstado = async (req, res) => {
  //Deconstruir el objeto del request
  const { estado } = req.body;

  console.log(estado, req.params.id);

  try {
    //Si no existe la tabla en la BD, Crearla en base al modelo
    await Cliente.sync();

    //Realizar la actualizacion de los datos
    await Cliente.update(
      {
        estado: estado.toUpperCase(),
      },
      {
        where: { id: req.params.id },
      },
    );

    //Enviar respuesta
    res.status(200).json({
      ok: true,
      status: 200,
      message: "estado actualizado",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
