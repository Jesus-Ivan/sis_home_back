import { Sequelize, DataTypes, Model } from "sequelize";
import {
  DATABASE,
  DB_HOST,
  DB_PORT,
  DB_USER,
  USER_PASSWORD,
} from "../config.js";

import { Movimiento } from "../model/Movimiento.model.js";
//Iniciando conexion a la BD con Sequelize (ORM)
const sequelize = new Sequelize(DATABASE, DB_USER, USER_PASSWORD, {
  host: "localhost",
  dialect: "mysql",
  DB_PORT,
});

export class Cliente extends Model {}

Cliente.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    apodo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contra: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Cliente",
  }
);

Cliente.hasMany(Movimiento, {
  foreignKey: "clienteId", // La clave foránea en la tabla Movimientos
  as: "movimientos", // Alias para la relación
});
//module.exports = Cliente;

// async function testConection() {
//   try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// }

// testConection();
