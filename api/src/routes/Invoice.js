import { Router } from "express";
import upload from "../config/multer.js";
import { 
  uploadInvoice, 
  updateInvoiceStatus, 
  getAllInvoices 
} from "../controllers/invoiceController.js";

const router = Router();

//Ruta para subir y registrar la factura (Usamos el middleware de Multer)
router.post("/upload", upload.single("invoice"), uploadInvoice);

//Ruta unificada para actualizar el estado (éxito o error)
router.put("/status/:id", updateInvoiceStatus);

//Ruta para listar el historial de facturas
router.get("/", getAllInvoices);

export default router;