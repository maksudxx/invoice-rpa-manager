import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueId = crypto.randomUUID();
    const nombreFisico = `${uniqueId}_${file.originalname}`;
    req.generatedInvoiceId = uniqueId;
    req.originalInvoiceName = file.originalname; 
    cb(null, nombreFisico);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|xml|csv|txt/;
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );

  if (extName) {
    cb(null, true);
  } else {
    cb(new Error("Error: Tipo de archivo no soportado"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
