import { Movimiento, sequelize } from "../model/Movimiento.model.js";
import { Transaction } from "sequelize";

/**
 * Crea Un nuevo movimiento de estado de cuenta
 * @param {ClienteId, concepto, monto, img_url, estado, fecha} req
 * @param {*} res
 */
export const crearMovimiento = async (req, res) => {
  //Deconstruir el objeto del request
  const { ClienteId, concepto, monto, img_url, estado, fecha } = req.body;
  try {
    //Comprobar que existe la tabla
    Movimiento.sync();
    //Crear transaccion
    const result = await sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      },
      async (t) => {
        //Crear el registro del movimiento
        const movimiento = await Movimiento.create(
          {
            ClienteId,
            concepto: concepto?.toUpperCase(),
            monto,
            img_url,
            estado,
            fecha,
          },
          { transaction: t },
        );
        //Obtener la sumatoria de todos los movimientos cuyo estado = '1'
        const suma = await obtenerSumaMovimientos(ClienteId, t);
        //Si la suma es 0
        if (suma == 0) {
          await actualizarEstadoMovimentos(ClienteId, t);
        }
        return { movimiento, suma };
      },
    );

    //Enviar resultado
    res.status(201).json({
      ok: true,
      status: 201,
      message: "Movimiento creado",
      movimiento: result.movimiento,
      sumaMovimientos: result.suma,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Obtiene los movimientos, del cliente segun el estado dado como Query Param
 * @param {id_cliente} req
 * @param {*} res
 */
export const obtenerMovimientos = async (req, res) => {
  //Deconstruir el objeto del request
  const id_cliente = req.params.id_cliente;
  //Obtener QueryParam (es el 'estado' de los movimientos)
  const estado = req.query.estado;

  const page = parseInt(req.query.page) || 0; // Página actual
  const size = parseInt(req.query.size) || 20; // Elementos por página

  try {
    //Si no existe la tabla en la BD, Crearla en base al modelo
    await Movimiento.sync();
    //Construir objeto base de condiciones para la consulta
    let conditions = { ClienteId: id_cliente };
    //si hay QueryParam, agregarlo a la consulta
    if (typeof estado === "string" || estado instanceof String) {
      conditions = { ...conditions, estado: estado };
    }
    //Hacer la consulta
    const { count, rows } = await Movimiento.findAndCountAll({
      limit: size,
      offset: page * size,
      where: conditions,
      order: [["createdAt", "DESC"]],
    });
    //Devolver respuesta
    res.status(200).json({
      ok: true,
      status: 200,
      count: count,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      movimientos: rows,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Solo actualiza: concepto, monto, img_url y fecha
 * @param {Request} req Contiene la nueva informacion del movimiento
 * @param {Response} res
 */
export const actualizarMovimiento = async (req, res) => {
  //Deconstruir el objeto del request
  const { id, ClienteId, concepto, monto, img_url, estado, fecha } = req.body;

  try {
    //Crear transaccion
    const result = await sequelize.transaction(
      {
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      },
      async (t) => {
        //Realizar la actualizacion de los datos
        await Movimiento.update(
          {
            concepto: concepto?.toUpperCase(),
            monto,
            img_url,
          },
          {
            where: { id: id },
            transaction: t,
          },
        );
        //Obtener el registro actualizado
        const new_row = await Movimiento.findByPk(id, {
          transaction: t,
        });
        //Obtener la sumatoria de todos los movimientos cuyo estado = '1'
        const suma = await obtenerSumaMovimientos(ClienteId, t);
        //Si la suma es 0
        if (suma == 0) {
          await actualizarEstadoMovimentos(ClienteId, t);
        }
        return { new_row, suma };
      },
    );
    //Enviar respuesta
    res.status(200).json({
      ok: true,
      status: 200,
      message: "movimiento actualizado",
      movimiento: result.new_row,
      sumaMovimientos: result.suma,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @param {String} ClienteId Es el id del cliente
 * @param {Transactionable.transaction} t Objeto de la transaccion en curso
 */
export const obtenerSumaMovimientos = async (ClienteId, t) => {
  //Obtener la sumatoria de todos los movimientos cuyo estado = '1'
  const suma = await Movimiento.sum("monto", {
    transaction: t,
    where: { ClienteId, estado: "1" },
  });
  return suma;
};

/**
 * @param {String} ClienteId Es el id del cliente
 * @param {Transactionable.transaction} t Objeto de la transaccion en curso
 */
async function actualizarEstadoMovimentos(ClienteId, t) {
  //Ocultar los conceptos restantes  cuyo estado = '1'
  const afected_rows = await Movimiento.update(
    {
      estado: "0",
    },
    {
      where: { ClienteId, estado: "1" },
      transaction: t,
    },
  );
  return afected_rows;
}
