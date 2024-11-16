import { pool } from "../db.js";

export const getProductos = async (req, res) => {
  //Obtenemos el query param
  const producto = req.query.producto;

  let rows;

  try {
    if (producto != "") {
      //consulta exacta por codigo de barra
      const [exact_result] = await pool.query(
        "SELECT * FROM productos WHERE codigo_barras = ? LIMIT 5;",
        producto
      );
      //consulta por nombres
      const [partial_result] = await pool.query(
        "SELECT * FROM productos WHERE producto like '%" +
          producto +
          "%' ORDER BY producto LIMIT 50;"
      );

      //Si hay coincidencia exacta
      if (exact_result.length > 0) {
        rows = exact_result;
      } else {
        rows = partial_result;
      }
    } else {
      const [all_result] = await pool.query(
        "SELECT * FROM productos ORDER BY producto LIMIT 50;"
      );

      rows = all_result;
    }

    res.json({ response: "success", results: rows });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProducto = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM productos WHERE id = ? ", [
      req.params.id,
    ]);
    if (rows.length <= 0)
      return res.status(404).json({
        message: "Producto no encontrado",
      });

    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createProducto = async (req, res) => {
  const {
    producto,
    nombre2,
    precio_compra,
    precio_venta,
    codigo_barras,
    observaciones,
  } = req.body;

  try {
    const [rows] = await pool.query(
      "INSERT INTO productos (producto, nombre2, precio_compra, precio_venta, codigo_barras, observaciones) VALUES (?,?,?,?,?,?)",
      [
        producto,
        nombre2,
        precio_compra,
        precio_venta,
        codigo_barras,
        observaciones,
      ]
    );
    res.send({
      id: rows.insertId,
      producto,
      nombre2,
      precio_compra,
      precio_venta,
      codigo_barras,
      observaciones,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateProducto = async (req, res) => {
  const { id } = req.params;
  const {
    producto,
    nombre2,
    precio_compra,
    precio_venta,
    codigo_barras,
    observaciones,
  } = req.body;

  try {
    const [result] = await pool.query(
      "UPDATE productos SET producto = ?, nombre2 = ?, precio_compra = ?, precio_venta = ?, codigo_barras = ?, observaciones = ? WHERE id = ?",
      [
        producto,
        nombre2,
        precio_compra,
        precio_venta,
        codigo_barras,
        observaciones,
        id,
      ]
    );
    if (result.affectedRows <= 0) {
      return res
        .status(404)
        .json({ message: "Producto no actualizado (id no valido)" });
    }
    const [rows] = await pool.query("SELECT * FROM productos WHERE id = ?;", [
      id,
    ]);
    res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    //Al hacer la consulta delete, el objeto devuelto se concoce como "result"
    const [result] = await pool.query("DELETE FROM productos WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows <= 0) {
      return res.status(404).json({
        message: "No se encontro el producto",
      });
    }
    //Podemos enviar un estatus de "OK" pero sin contenido al cliente con el: res.sendStatus(204)
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
