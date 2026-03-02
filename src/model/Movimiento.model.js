import { Sequelize, DataTypes, Model } from "sequelize";
import {
  DATABASE,
  DB_HOST,
  DB_PORT,
  DB_USER,
  USER_PASSWORD,
} from "../config.js";
import { Cliente } from "../model/Cliente.model.js";
//Iniciando conexion a la BD con Sequelize (ORM)
export const sequelize = new Sequelize(DATABASE, DB_USER, USER_PASSWORD, {
  host: "localhost",
  dialect: "mysql",
  DB_PORT,
});

export class Movimiento extends Model {}

Movimiento.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    ClienteId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    concepto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    img_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: "1",
      allowNull: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Movimiento",
  }
);
