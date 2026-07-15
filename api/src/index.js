import express from "express";
import invoiceRoutes from "./routes/Invoice.js";

const app = express();

app.use(express.json());

app.use("/api/invoice", invoiceRoutes);

export default app;