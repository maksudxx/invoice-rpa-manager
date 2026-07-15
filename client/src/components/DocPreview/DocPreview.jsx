import React, { useEffect, useState } from "react";
import { EyeOff, X, ArrowUpRight } from "lucide-react";

export const DocPreview = ({ file, onCancel, onUploadConfirm }) => {
  const [pdfUrl, setPdfUrl] = useState(null);

  // Generamos una URL temporal para el archivo cargado en memoria
  useEffect(() => {
    if (!file) {
      setPdfUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPdfUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs min-h-125 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Previsualización
          </h3>
          {file && (
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-slate-50"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {file && pdfUrl ? (
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-xl overflow-hidden h-87.5 bg-slate-100">
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0`}
                title="Preview PDF"
                className="w-full h-full"
              />
            </div>
            <p className="text-xs font-bold text-slate-700 truncate">
              {file.name}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 py-24 text-center">
            <EyeOff size={32} className="text-slate-300 mb-2" />
            <p className="text-xs font-medium max-w-50">
              No hay boletas en cola. Cargá un PDF para ver su contenido antes
              de procesar.
            </p>
          </div>
        )}
      </div>

      {file && (
        <button
          onClick={onUploadConfirm}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-all"
        >
          Enviar a Automation Anywhere
          <ArrowUpRight size={16} />
        </button>
      )}
    </div>
  );
};
