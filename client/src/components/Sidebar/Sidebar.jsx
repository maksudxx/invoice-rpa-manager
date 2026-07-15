import React from "react";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  FileCode,
} from "lucide-react";

export const Sidebar = () => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", active: true },
    { icon: <FileText size={20} />, label: "Facturas", active: false },
    { icon: <FileCode size={20} />, label: "Modelos RPA", active: false },
    { icon: <Settings size={20} />, label: "Configuración", active: false },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white h-screen sticky top-0 border-r border-slate-200 p-5 justify-between">
      {/* Superior: App Brand */}
      <div className="space-y-8">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-blue-600 p-2 rounded-xl text-white font-black text-lg shadow-xs">
            PF
          </div>
          <span className="font-black text-xl tracking-tight text-slate-800">
            PROCESADOR DE FACTURAS
          </span>
        </div>

        {/* Links de Navegación */}
        <nav className="space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                item.active
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};
