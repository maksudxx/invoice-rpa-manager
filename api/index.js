import dotenv from "dotenv";
import server from "./src/app.js"
import { conn } from "./src/db.js";
dotenv.config();

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await conn.sync({ alter: true });
    server.listen(PORT, () => {
      console.log(`Servidor levantado exitosamente en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error inicializando el servidor:", error);
  }
}

startServer();
