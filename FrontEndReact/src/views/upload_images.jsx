import React, { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import Formato_imagen from "./formato_imagen";
import Analisis_imagen from "./analisis_imagen";
import Menu from "../components/Nadbar";

const Upload_images = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAnalisisOpen, setModalAnalisisOpen] = useState(false);

  const handleFilesSubmit = (files, url) => {
    // Solo log, sin guardar nada
    console.log("Archivos seleccionados:", files);
    console.log("URL (si aplica):", url);
    // Cierra el modal de formato
    setModalOpen(false);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <header>
        <Menu />
      </header>

      <Container className="py-4 d-flex justify-content-center">
        <div 
          style={{ 
            maxWidth: "1200px", 
            width: "100%",
            marginTop: "2%"
          }}
        >
          <Row className="justify-content-center">
            {/* IZQUIERDA: VISTA PREVIA */}
            <Col md={7} className="d-flex flex-column align-items-center">
              <h5 className="fw-bold mb-3 text-center">Vista Previa</h5>

              <div
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  height: "420px",
                  backgroundColor: "#F0F0F0",
                  borderRadius: "10px",
                  border: "1px solid #D8D8D8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <span className="text-muted">Área de vista previa</span>
              </div>

              <p className="mt-2 text-muted text-center">.DICOM</p>
            </Col>

            {/* DERECHA: FORMULARIO */}
            <Col md={5} className="d-flex flex-column align-items-center">
              <h5 className="fw-bold mb-3 text-center">Datos para Análisis</h5>

              <Form className="w-100 d-flex flex-column align-items-center">
                <Form.Group className="mb-3 w-100" style={{ maxWidth: "400px" }}>
                  <Form.Control
                    placeholder="ID Paciente"
                    className="input-neuro"
                  />
                </Form.Group>

                <Form.Group className="mb-3 w-100" style={{ maxWidth: "400px" }}>
                  <Form.Control
                    placeholder="Nombre Paciente"
                    className="input-neuro"
                  />
                </Form.Group>

                <Form.Group className="mb-3 w-100" style={{ maxWidth: "400px" }}>
                  <Form.Control
                    placeholder="Tipo de Estudio"
                    className="input-neuro"
                  />
                </Form.Group>

                <Form.Group className="mb-3 w-100" style={{ maxWidth: "400px" }}>
                  <Form.Control
                    type="date"
                    className="input-neuro"
                  />
                </Form.Group>

                <Form.Group className="mb-3 w-100" style={{ maxWidth: "400px" }}>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Notas del Médico"
                    className="input-neuro"
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>

          {/* BOTONES */}
          <Row className="mt-5 justify-content-center">
            <Col md={4} className="d-flex justify-content-center mb-3">
              <Button
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  padding: "14px",
                  backgroundColor: "#0038FF",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: "600",
                }}
                onClick={() => setModalOpen(true)}
              >
                Subir Imagen
              </Button>
            </Col>

            <Col md={4} className="d-flex justify-content-center mb-3">
              <Button
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  padding: "14px",
                  backgroundColor: "#2ECC71",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: "600",
                }}
                onClick={() => setModalAnalisisOpen(true)}
              >
                Generar Análisis
              </Button>
            </Col>

            <Col md={4} className="d-flex justify-content-center mb-3">
              <Button
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  padding: "14px",
                  backgroundColor: "#D4A017",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: "600",
                }}
              >
                Historial de Análisis
              </Button>
            </Col>
          </Row>
        </div>
      </Container>

      {/* Modal de formato de imagen */}
      <Formato_imagen
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFilesSubmit}
      />

      {/* Modal de análisis */}
      <Analisis_imagen
        open={modalAnalisisOpen}
        onClose={() => setModalAnalisisOpen(false)}
        data={null}
      />

      <style jsx>{`
        .input-neuro {
          background: #fafafa;
          border: 1px solid #e0e0e0;
          padding: 12px;
          border-radius: 8px;
          font-size: 15px;
          width: 100%;
        }

        .input-neuro:focus {
          border-color: #0038ff !important;
          box-shadow: 0 0 5px rgba(0, 56, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Upload_images;