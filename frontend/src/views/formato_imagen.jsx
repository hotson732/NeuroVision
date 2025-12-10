import React, { useState, useEffect, useRef } from "react";

export default function Formato_imagen({ open, onClose, onSubmit, accept = "image/*,.dcm", multiple = true }) {
  const [files, setFiles] = useState([]);
  const [url, setUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setFiles([]);
      setUrl("");
      setDragging(false);
    }
  }, [open]);

  if (!open) return null;

  const handleFiles = (selected) => {
    const arr = Array.from(selected || []);
    if (arr.length === 0) return;
    setFiles(arr);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const onClickSelect = () => fileInputRef.current?.click();

  const handleFileChange = (e) => handleFiles(e.target.files);

  const handleImport = () => {
    if (files.length === 0 && !url) return;
    onSubmit && onSubmit(files, url || null);
    onClose && onClose();
  };

  const handleUrlUpload = () => {
    if (!url) return;
    // optionally fetch / validate URL here; pass to onSubmit as url param
    onSubmit && onSubmit([], url);
    onClose && onClose();
  };

  const container = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1400,
    padding: 20
  };

  const box = {
    width: 980,
    maxWidth: "98%",
    borderRadius: 18,
    background: "#e9e9e9",
    padding: 28,
    boxShadow: "0 14px 36px rgba(0,0,0,0.25)",
    color: "#222",
    boxSizing: "border-box"
  };

  const dropArea = {
    width: "100%",
    minHeight: 140,
    borderRadius: 8,
    border: "1px solid #d0d0d0",
    background: dragging ? "#f8f8f8" : "#f5f5f5",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 18,
    cursor: "pointer"
  };

  const small = { color: "#6b6b6b", fontSize: 13 };
  const linkStyle = { color: "#1e4bff", cursor: "pointer", textDecoration: "none", fontWeight: 600 };

  return (
    <div style={container} onClick={(e) => e.target === e.currentTarget && onClose && onClose()}>
      <div style={box} role="dialog" aria-modal="true" aria-label="Importar Archivo">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 34, fontWeight: 700 }}>Importar Archivo</h2>
          <button aria-label="Cerrar" onClick={onClose} style={{ background: "transparent", border: "none", fontSize: 22, cursor: "pointer", color: "#333" }}>✕</button>
        </div>

        <div style={{ height: 16 }} />

        <div
          style={dropArea}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={onClickSelect}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 8, background: "#4b4b4b", display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 20
          }}>↑</div>

          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
            <span style={small}>Arrastre y Suelte o</span>
            <span style={linkStyle} onClick={onClickSelect}>Seleccione Archivo</span>
          </div>

          <div style={{ height: 6 }} />
          <div style={{ color: "#9b9b9b", fontSize: 13 }}>DICOM</div>

          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        <div style={{ height: 16 }} />

        <hr style={{ border: "none", borderTop: "1px solid #d8d8d8", margin: "14px 0" }} />

        <div style={{ marginTop: 6 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Importar de un URL</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="text"
              placeholder="Agregar archivo URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #d0d0d0",
                background: "#f9f9f9",
                fontSize: 14
              }}
            />
            <button onClick={handleUrlUpload} style={{ background: "transparent", border: "none", color: "#1e4bff", fontWeight: 600, cursor: "pointer" }}>Subir</button>
          </div>
        </div>

        <div style={{ height: 18 }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 28, height: 28, borderRadius: 16, background: "#2f2f2f", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>?</div>
            <div style={{ fontSize: 15 }}>Ayuda</div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={onClose} style={{
              padding: "10px 18px",
              borderRadius: 8,
              border: "1px solid #cfcfcf",
              background: "#f3f3f3",
              cursor: "pointer",
              fontWeight: 600
            }}>
              Cancelar
            </button>

            <button onClick={handleImport} disabled={files.length === 0 && !url} style={{
              padding: "10px 18px",
              borderRadius: 8,
              border: "none",
              background: (files.length === 0 && !url) ? "#8aa0ff66" : "linear-gradient(90deg,#3048ff,#1f3be6)",
              color: "#fff",
              cursor: (files.length === 0 && !url) ? "not-allowed" : "pointer",
              fontWeight: 700
            }}>
              Importar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}