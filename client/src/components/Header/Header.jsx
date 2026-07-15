import React from "react";
import { Search, Filter, Plus } from "lucide-react";

export const Header = ({ onSearchChange, onStatusChange, currentStatus }) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full bg-white border-b border-slate-200 p-6">
      <div>
        <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-800">
          Facturas Recibidas
        </h1>
        <p className="text-xs md:text-sm text-slate-400 font-medium">
          Monitoreo, filtros y auditoría de comprobantes.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Input de Búsqueda */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full sm:w-60 pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
          />
        </div>

        {/* Select de Estados */}
        <div className="relative">
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <select
            value={currentStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full sm:w-48 pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-slate-600 appearance-none cursor-pointer"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="PROCESANDO">Procesando</option>
            <option value="PROCESADO">Procesado</option>
            <option value="REQUIERE VALIDACIÓN">Requiere validación</option>
            <option value="ERROR">Error</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            ▼
          </div>
        </div>
      </div>
    </header>
  );
};
