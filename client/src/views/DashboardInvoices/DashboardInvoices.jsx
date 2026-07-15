import React, { useState, useEffect } from "react";
import { Header } from "../../components/Header/Header.jsx";
import { DocPreview } from "../../components/DocPreview/DocPreview.jsx";
import { FileUploader } from "../../components/FileUploader/FileUploader.jsx";
import { InvoiceTable } from "../../components/InvoiceTable/InvoiceTable.jsx";

const API_URL = "http://localhost:3001/api/invoice";

export const DashboardInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchInvoices = async () => {
    try {
      const response = await fetch(`${API_URL}/`);
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus =
      statusFilter === "TODOS" ||
      inv.invoice_status?.toLowerCase().includes(statusFilter.toLowerCase());
    const matchesSearch = inv.invoice_file_name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <Header
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        currentStatus={statusFilter}
      />
      <div className="flex flex-col md:flex-row p-6 gap-6 max-w-[1600px] mx-auto w-full">
        <div className="w-full md:w-2/3">
          <InvoiceTable data={filteredInvoices} />
        </div>
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <FileUploader
            onFileSelect={setUploadedFile}
            selectedFile={uploadedFile}
          />
          {uploadedFile && (
            <button
              onClick={async () => {
                setLoading(true);
                setLoading(false);
              }}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl"
            >
              {loading ? "Procesando..." : "Enviar a Automation Anywhere"}
            </button>
          )}
          <DocPreview
            file={uploadedFile}
            onCancel={() => setUploadedFile(null)}
          />
        </div>
      </div>
    </div>
  );
};
