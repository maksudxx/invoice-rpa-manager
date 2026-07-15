import { Invoice } from "../db.js";

export const uploadInvoice = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se subió ningún archivo." });
    }

    const idParaAA = req.generatedInvoiceId;
    const nombreLimpio = req.originalInvoiceName;

    await Invoice.create({
      invoice_id: idParaAA,
      invoice_file_name: nombreLimpio,
      invoice_status: "PENDIENTE",
    });

    console.log(`Factura guardada en BD: ${nombreLimpio} con ID: ${idParaAA}`);

    return res.status(200).json({
      id: idParaAA,
      fileName: req.file.filename,
    });
  } catch (error) {
    console.error("Error al guardar la factura:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Cuerpo recibido de AA:", req.body);
    const { status, error_log } = req.body;
    const factura = await Invoice.findByPk(id);

    if (!factura) {
      return res
        .status(404)
        .json({ error: "No se encontró la factura con ese ID." });
    }

    //Armamos el objeto de actualización de forma dinámica
    const camposAActualizar = {
      invoice_status: status,
    };

    if (error_log) {
      camposAActualizar.invoice_error_log = error_log;
    }

    //Actualizamos el registro en la base de datos
    await factura.update(camposAActualizar);

    console.log(`[RPA] Factura ${id} actualizada. Estado: ${status}`);
    return res
      .status(200)
      .json({ message: "Estado actualizado con éxito.", id });
  } catch (error) {
    console.error("Error al actualizar el estado desde AA:", error);
    return res
      .status(500)
      .json({ error: "Error interno en el servidor al actualizar la BD" });
  }
};

export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      order: [["invoice_upload_date", "DESC"]],
    });
    return res.status(200).json(invoices);
  } catch (error) {
    return res.status(500).json({
      error: "Error al obtener las facturas.",
      details: error.message,
    });
  }
};
