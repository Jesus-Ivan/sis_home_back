import { pool } from "../db.js";


export const getPing = async (req, res) => {
  const result = await pool.query("SELECT 1+1 AS result;");
  //para extraer la informarcion directamente, la query devuelve un array
  //const [result]= await pool.query("SELECT 1+1 AS result;");
  //const result [0]= await pool.query("SELECT 1+1 AS result;");
  res.json(result);
};
