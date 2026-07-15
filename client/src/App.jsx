import React from "react";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { DashboardInvoices } from "./views/DashboardInvoices/DashboardInvoices";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-start">
      {/* Componente Sidebar de tu carpeta components */}
      <Sidebar />

      {/* Vista principal de tu carpeta views */}
      <main className="flex-1 min-w-0">
        <DashboardInvoices />
      </main>
    </div>
  );
}

export default App;