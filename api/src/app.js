import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";

// Importamos las rutas y la conexión a la base de datos
import routes from "./index.js";
import "./db.js";

const server = express();

server.use(express.urlencoded({ extended: true, limit: "50mb" }));
server.use(express.json({ limit: "50mb" }));
server.use(cookieParser());
server.use(morgan("dev"));

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET, POST, OPTIONS, PUT, DELETE",
  allowedHeaders:
    "Origin, X-Requested-With, Content-Type, Accept, token, Authorization",
  optionsSuccessStatus: 200,
};
server.use(cors(corsOptions));

// Rutas principales
server.use("/", routes);

// Endware para atrapar errores (Manejador global)
server.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

export default server;
