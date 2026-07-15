import { Sequelize } from "sequelize";
import dotenv from "dotenv";

import invoiceModel from "./models/Invoice.js";

dotenv.config();

const { DB_USER, DB_PASSWORD, DB_HOST, DATABASE, DATABASE_URL, DB_PORT } =
  process.env;

// 1. Definimos la URL local por si no existe la de producción
const DB_LOCAL = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DATABASE}`;

// 2. Elegimos qué URL usar
const targetURL = DATABASE_URL || DB_LOCAL;

// 3. Creamos la instancia única de Sequelize
const sequelize = new Sequelize(targetURL, {
  logging: false,
  native: false,
  dialectOptions: DATABASE_URL
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {}, // Si es BD local, no enviamos opciones de SSL
});

// 4. Inyectamos la conexión (sequelize) a todos los modelos
invoiceModel(sequelize);

// 5. En sequelize.models están todos los modelos importados
const { Invoice } = sequelize.models;


// Exportamos los modelos y la conexión al estilo ES Modules
export { Invoice, sequelize as conn };