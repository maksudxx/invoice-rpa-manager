import React, { useState } from "react";
import { UploadCloud } from "lucide-react";

export const FileUploader = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === "application/pdf") {
      onFileSelected(files[0]);
    } else {
      alert("Por favor, subí un archivo PDF válido.");
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0 && files[0].type === "application/pdf") {
      onFileSelect(files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 cursor-pointer
        ${
          isDragging
            ? "border-blue-500 bg-blue-50/50 scale-[1.01]"
            : "border-slate-300 bg-white hover:border-slate-400"
        }
      `}
    >
      <input
        type="file"
        id="file-dropzone"
        accept=".pdf"
        className="hidden"
        onChange={handleFileInput}
      />
      <label htmlFor="file-dropzone" className="cursor-pointer space-y-2 block">
        <div className="mx-auto w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 border border-slate-100">
          <UploadCloud
            size={24}
            className={isDragging ? "text-blue-500 animate-bounce" : ""}
          />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-700">
            Arrastrá tus facturas acá
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            o hacé click para explorar archivos
          </p>
        </div>
        <span className="inline-block text-[10px] font-bold tracking-wide uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
          Solo PDF hasta 10MB
        </span>
      </label>
    </div>
  );
};
