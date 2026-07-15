import React from "react";
import {
  ArrowUpDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  Info,
} from "lucide-react";

export const InvoiceTable = ({ data, sortField, sortOrder, onSort }) => {
  const statusStyles = {
    PENDIENTE: "bg-blue-50 text-blue-700 border-blue-200",
    PROCESADO: "bg-emerald-50 text-emerald-700 border-emerald-200",
    PROCESANDO: "bg-amber-50 text-amber-700 border-amber-200",
    "REQUIERE VALIDACIÓN": "bg-amber-50 text-amber-700 border-amber-200",
    ERROR: "bg-rose-50 text-rose-700 border-rose-200",
  };

  const statusIcons = {
    PENDIENTE: <Info size={14} />,
    PROCESADO: <CheckCircle2 size={14} />,
    PROCESANDO: <Clock size={14} />,
    "REQUIERE VALIDACIÓN": <AlertTriangle size={14} />,
    ERROR: <AlertCircle size={14} />,
  };

  const renderSortIcon = (field) => {
    if (sortField !== field)
      return (
        <ArrowUpDown
          size={14}
          className="text-slate-300 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
        />
      );
    return <ArrowUpDown size={14} className="text-blue-600 ml-1" />;
  };

  const formatInvoiceDate = (isoString) => {
    if (!isoString) return "-";

    try {
      const date = new Date(isoString);

      if (isNaN(date.getTime())) {
        return "-";
      }

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return "-";
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden w-full">
      {/* CABECERAs*/}
      <div className="hidden md:flex bg-slate-50 border-b border-slate-200 p-4 text-xs font-bold uppercase tracking-wider text-slate-400">
        <div
          onClick={() => onSort("invoice_id")}
          className="flex-1 flex items-center justify-center cursor-pointer group select-none hover:text-slate-700 transition-colors"
        >
          ID {renderSortIcon("invoice_id")}
        </div>
        <div
          onClick={() => onSort("invoice_file_name")}
          className="flex-2 flex items-center cursor-pointer group select-none hover:text-slate-700 transition-colors"
        >
          Nombre de Archivo {renderSortIcon("invoice_file_name")}
        </div>
        <div
          onClick={() => onSort("invoice_status")}
          className="flex-1 flex items-center justify-center cursor-pointer group select-none hover:text-slate-700 transition-colors"
        >
          Estado {renderSortIcon("invoice_status")}
        </div>
        <div className="flex-2 flex items-center justify-start">
          Log de Error
        </div>
        <div
          onClick={() => onSort("invoice_upload_date")}
          className="flex-1 flex items-center justify-center cursor-pointer group select-none hover:text-slate-700 transition-colors"
        >
          Fecha {renderSortIcon("invoice_upload_date")}
        </div>
      </div>

      {/* CUERPO */}
      <div className="divide-y divide-slate-100 flex flex-col">
        {data.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm font-medium">
            No se encontraron facturas.
          </div>
        ) : (
          data.map((factura) => (
            <div
              key={factura.invoice_id}
              className="flex flex-col md:flex-row items-stretch md:items-center p-4 gap-2 md:gap-0 hover:bg-slate-50/80 transition-all duration-150 text-sm"
            >
              {/* ID */}
              <div className="flex-1 md:text-center text-slate-600">
                <span className="md:hidden font-bold block text-xs text-slate-400 uppercase mb-0.5">
                  ID
                </span>
                #{factura.invoice_id}
              </div>

              {/* Archivo */}
              <div className="flex-2 text-slate-700 truncate font-semibold pr-4">
                <span className="md:hidden font-bold block text-xs text-slate-400 uppercase mb-0.5">
                  Archivo
                </span>
                {factura.invoice_file_name}
              </div>

              {/* Estado */}
              <div className="flex-1 md:flex md:justify-center items-center">
                <span className="md:hidden font-bold block text-xs text-slate-400 uppercase mb-1">
                  Estado
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border ${statusStyles[factura.invoice_status]}`}
                >
                  {statusIcons[factura.invoice_status]}
                  {factura.invoice_status}
                </span>
              </div>

              {/* Log de Error dinámico */}
              <div className="flex-2 text-slate-600 truncate pr-4">
                <span className="md:hidden font-bold block text-xs text-slate-400 uppercase mb-0.5">
                  Log de Error
                </span>
                {factura.invoice_status === "ERROR" ? (
                  <span className="text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded border border-rose-100 text-xs block text-wrap  text-center max-w-xs">
                    {factura.invoice_error_log}
                  </span>
                ) : (
                  <span className="block text-slate-400 italic text-center">
                    N/A
                  </span>
                )}
              </div>
              {/* Fecha */}
              <div className="flex-1 md:text-center text-slate-400">
                <span className="md:hidden font-bold block text-xs text-slate-400 uppercase mb-0.5">
                  Fecha
                </span>
                {factura && factura.invoice_upload_date
                  ? formatInvoiceDate(factura.invoice_upload_date)
                  : "-"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
