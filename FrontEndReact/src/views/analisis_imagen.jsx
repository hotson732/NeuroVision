import React, { useEffect, useState } from "react";

export default function Analisis_imagen({ open, onClose, data }) {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!open) return;

    // TODO: Reemplazar con fetch al backend
    // const fetchAnalysis = async () => {
    //   setLoading(true);
    //   try {
    //     const res = await fetch("/api/analyze", {
    //       method: "POST",
    //       body: FormData con files
    //     });
    //     const result = await res.json();
    //     setAnalysisResult(result);
    //   } catch (err) {
    //     console.error(err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchAnalysis();

    return () => {
      setZoom(100);
      setBrightness(100);
      setPanX(0);
      setPanY(0);
    };
  }, [open]);

  if (!open) return null;

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPanX(e.clientX - dragStart.x);
      setPanY(e.clientY - dragStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setZoom(100);
    setBrightness(100);
    setPanX(0);
    setPanY(0);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1400,
        padding: 20
      }}
      onClick={(e) => e.target === e.currentTarget && onClose && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          width: 1100,
          maxWidth: "95%",
          maxHeight: "90vh",
          borderRadius: 20,
          background: "#e8e8e8",
          padding: 24,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          display: "flex",
          gap: 20,
          alignItems: "flex-start",
          overflowY: "auto"
        }}
      >
        {/* IZQUIERDA: Imagen con mapa de calor */}
        <div style={{ flex: 1, minWidth: 420 }}>
          {/* Imagen */}
          <div
            style={{
              width: "100%",
              height: 420,
              borderRadius: 16,
              background: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              position: "relative",
              cursor: isDragging ? "grabbing" : "grab"
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {loading ? (
              <span style={{ color: "#fff", fontSize: 16 }}>Procesando análisis...</span>
            ) : (
              <img
                src={data?.preview || "https://via.placeholder.com/600x600?text=Imagen+Análisis"}
                alt="Heatmap análisis"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `translate(${panX}px, ${panY}px) scale(${zoom / 100})`,
                  filter: `brightness(${brightness}%)`,
                  transition: isDragging ? "none" : "transform 0.2s ease",
                  userSelect: "none"
                }}
                draggable="false"
              />
            )}
          </div>

          {/* Herramientas inferiores */}
          <div
            style={{
              marginTop: 14,
              display: "flex",
              gap: 8,
              justifyContent: "flex-start",
              alignItems: "center",
              flexWrap: "wrap",
              background: "#f5f5f5",
              padding: 10,
              borderRadius: 10
            }}
          >
            <button
              onClick={() => setZoom(Math.min(zoom + 10, 200))}
              title="Zoom +"
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                border: "1px solid #bbb",
                background: "#fff",
                cursor: "pointer",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ⊕
            </button>

            <button
              onClick={() => setZoom(Math.max(zoom - 10, 50))}
              title="Zoom −"
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                border: "1px solid #bbb",
                background: "#fff",
                cursor: "pointer",
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ⊖
            </button>

            <button
              onClick={() => {}}
              title="Rotación"
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                border: "1px solid #bbb",
                background: "#fff",
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ↻
            </button>

            <button
              title="Medición"
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                border: "1px solid #bbb",
                background: "#fff",
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ✋
            </button>

            <input
              type="range"
              min="30"
              max="200"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              title="Brillo"
              style={{ width: 80, cursor: "pointer" }}
            />

            <button
              onClick={handleReset}
              title="Resetear"
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                border: "1px solid #bbb",
                background: "#fff",
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              ⟳
            </button>

            <div style={{ flex: 1 }} />

            <button
              onClick={() => console.log("Exportar archivo")}
              style={{
                padding: "10px 18px",
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(90deg, #3048ff, #1f3be6)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              📥 Exportar Archivo
            </button>
          </div>
        </div>

        {/* DERECHA: Resultados y métricas (vacíos esperando backend) */}
        <div style={{ width: 300, minWidth: 280, display: "flex", flexDirection: "column", gap: 12 }}>
          {loading ? (
            <div style={{ color: "#666", textAlign: "center", padding: 20 }}>Cargando análisis...</div>
          ) : (
            <>
              {/* Anomalías */}
              <div
                style={{
                  borderRadius: 10,
                  padding: 12,
                  background: "#d4d4d4",
                  border: "1px solid #bbb",
                  minHeight: 40,
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: "#333" }}>
                  Anomalías Detectadas: {analysisResult?.anomalias || "—"}
                </div>
              </div>

              {/* Métricas Clave */}
              <div
                style={{
                  borderRadius: 10,
                  padding: 12,
                  background: "#d4d4d4",
                  border: "1px solid #bbb",
                  minHeight: 60
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 6, color: "#333" }}>Métricas Clave:</div>
                <div style={{ fontSize: 11, color: "#444", lineHeight: 1.5 }}>
                  {analysisResult?.volumen ? `Volumen tumoral estimado ${analysisResult.volumen}` : "Esperando datos del backend..."}
                </div>
              </div>

              {/* Nivel de Confianza */}
              <div
                style={{
                  borderRadius: 10,
                  padding: 12,
                  background: "#d4d4d4",
                  border: "1px solid #bbb",
                  minHeight: 50
                }}
              >
                <div style={{ fontSize: 11, color: "#333" }}>
                  Nivel de Confianza del Análisis: <strong>{analysisResult?.confianza || "—"}</strong>
                </div>
              </div>

              {/* Diagnóstico */}
              <div
                style={{
                  borderRadius: 10,
                  padding: 12,
                  background: "#d4d4d4",
                  border: "1px solid #bbb",
                  minHeight: 50
                }}
              >
                <div style={{ fontSize: 11, color: "#333" }}>
                  Diagnóstico del Modelo: <strong>{analysisResult?.diagnostico || "—"}</strong>
                </div>
              </div>

              {/* Problemas Estructurales */}
              <div
                style={{
                  borderRadius: 10,
                  padding: 12,
                  background: "#d4d4d4",
                  border: "1px solid #bbb",
                  minHeight: 50
                }}
              >
                <div style={{ fontSize: 11, color: "#333" }}>
                  Problemas Estructurales: <strong>{analysisResult?.problemas || "—"}</strong>
                </div>
              </div>

              {/* Info del modelo */}
              <div style={{ fontSize: 10, color: "#666", textAlign: "center", marginTop: 4 }}>
                <div>Análisis generado con el modelo</div>
                <div style={{ fontWeight: 700 }}>{analysisResult?.modelo || "—"}</div>
              </div>

              {/* Disclaimer */}
              <div style={{ fontSize: 9, color: "#555", lineHeight: 1.4, textAlign: "center", marginTop: 8, padding: 10, borderRadius: 8, background: "#f0f0f0" }}>
                MediScan es un software de apoyo a la decisión clínica. El diagnóstico final y la responsabilidad recaen en el profesional médico cualificado.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}