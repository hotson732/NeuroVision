import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, ProgressBar } from "react-bootstrap";
import Formato_imagen from "./formato_imagen";
import Menu from "../components/Nadbar";
import axios from 'axios';

const Upload_images = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPacientes, setLoadingPacientes] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [canGenerateAnalysis, setCanGenerateAnalysis] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

//generar analisis ia
const handleGenerateAnalysis = async () => {
  try {
    setLoading(true);

    const API_URL = 'http://127.0.0.1:8000/api';
  

    const payload = {
      id_paciente: formData.id_paciente,
      tipo_estudio: formData.tipo_estudio,
      fecha_estudio: formData.fecha_estudio,
      notas_medico: formData.notas_medico,
      image_url: uploadedImageUrl
    };
console.log("URL enviada al backend:", uploadedImageUrl);
    const response = await axios.post(`${API_URL}/generar-analisis`, payload, {
   
      responseType: 'blob'
    });

    // Descargar PDF
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'analisis_radiologico.pdf';
    link.click();

  } catch (error) {
    setMessage({ type: 'error', text: '❌ Error al generar el análisis' });
  } finally {
    setLoading(false);
  }
};




  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    id_paciente: "",
    tipo_estudio: "",
    fecha_estudio: "",
    notas_medico: ""
  });

  // Cargar pacientes al montar el componente
  useEffect(() => {
    cargarPacientes();
  }, []);

  // Actualizar vista previa cuando se seleccionan archivos
  useEffect(() => {
    if (selectedFiles.length > 0) {
      const file = selectedFiles[0];
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFiles]);

  // Función para cargar pacientes desde la API
  const cargarPacientes = async () => {
    try {
      setLoadingPacientes(true);
      const API_URL = 'http://127.0.0.1:8000/api';
      const response = await axios.get(`${API_URL}/pacientes`);
      
      if (response.data.success) {
        setPacientes(response.data.data);
        setMessage({ type: 'success', text: '✅ Pacientes cargados exitosamente' });
      } else {
        setMessage({ type: 'warning', text: '⚠️ No se pudieron cargar los pacientes' });
      }
    } catch (error) {
      console.error('Error cargando pacientes:', error);
      setMessage({ type: 'error', text: '❌ Error al cargar pacientes' });
      // Datos de ejemplo por si falla la API
      setPacientes([
        { id_paciente: '550e8400-e29b-41d4-a716-446655440000', nombre: 'Juan', apellido: 'Pérez', numero_historia_clinica: 'HC-001' },
        { id_paciente: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', nombre: 'María', apellido: 'González', numero_historia_clinica: 'HC-002' },
        { id_paciente: '6ba7b811-9dad-11d1-80b4-00c04fd430c9', nombre: 'Carlos', apellido: 'Rodríguez', numero_historia_clinica: 'HC-003' },
      ]);
    } finally {
      setLoadingPacientes(false);
    }
  };

  // Función para obtener el nombre completo del paciente seleccionado
  const getNombrePaciente = (idPaciente) => {
    const paciente = pacientes.find(p => p.id_paciente === idPaciente);
    return paciente ? `${paciente.nombre} ${paciente.apellido} (${paciente.numero_historia_clinica})` : '';
  };

  const handleFilesSubmit = (files) => {
    setSelectedFiles(files);
    setMessage({
      type: 'success',
      text: `✅ ${files.length} archivo(s) seleccionado(s)`
    });
    setModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpload = async () => {
    // Validación
    if (selectedFiles.length === 0) {
      setMessage({ type: 'error', text: '❌ Por favor, selecciona al menos una imagen' });
      return;
    }

    if (!formData.id_paciente || !formData.tipo_estudio || !formData.fecha_estudio) {
      setMessage({ type: 'error', text: '❌ Completa todos los campos obligatorios' });
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);
      setMessage({ type: 'info', text: 'Subiendo imagen a Google Drive...' });

      const file = selectedFiles[0];
      const formDataToSend = new FormData();
      
      // Agregar datos del formulario
      formDataToSend.append('image', file);
      formDataToSend.append('id_paciente', formData.id_paciente);
      formDataToSend.append('tipo_estudio', formData.tipo_estudio);
      formDataToSend.append('fecha_estudio', formData.fecha_estudio);
      
      if (formData.notas_medico) {
        formDataToSend.append('notas_medico', formData.notas_medico);
      }

      const API_URL = 'http://127.0.0.1:8000/api';
      const response = await axios.post(`${API_URL}/upload/drive`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      if (response.data.success) {
        const pacienteNombre = getNombrePaciente(formData.id_paciente);
        setUploadedImageUrl(response.data.data.preview_url);
        setCanGenerateAnalysis(true);

        setMessage({ 
          type: 'success', 
          text: `${response.data.message}\nPaciente: ${pacienteNombre}\nID Estudio: ${response.data.data.estudio.id_estudio}`
        });
        
        // Actualizar vista previa con URL de Google Drive
        if (response.data.data.preview_url) {
          setPreviewUrl(response.data.data.preview_url);
        }
        
        // Limpiar formulario (excepto paciente para facilidad)
        setSelectedFiles([]);
        setFormData(prev => ({
          ...prev,
          tipo_estudio: "",
          fecha_estudio: "",
          notas_medico: ""
        }));
        setUploadProgress(0);
      }

    } catch (error) {
    
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
        if (error.response.data?.errors) {
          const errors = error.response.data.errors;
          // Mostrar errores específicos
          if (errors.id_paciente) {
            errorMessage = `❌ Error en paciente: ${errors.id_paciente[0]}`;
          } else if (errors.image) {
            errorMessage = `❌ Error en imagen: ${errors.image[0]}`;
          }
        }
      } else if (error.request) {
        errorMessage = '❌ No se pudo conectar con el servidor';
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFiles([]);
    setPreviewUrl(null);
    setMessage({ type: '', text: '' });
  };

  // Función para recargar pacientes
  const handleRecargarPacientes = () => {
    cargarPacientes();
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
      <header>
        <Menu />
      </header>

      <Container className="py-4 d-flex justify-content-center">
        <div style={{ maxWidth: "1200px", width: "100%", marginTop: "2%" }}>
          
          {message.text && (
            <Alert variant={message.type === 'error' ? 'danger' : message.type === 'success' ? 'success' : 'info'}
                   onClose={() => setMessage({ type: '', text: '' })} dismissible>
              {message.text}
            </Alert>
          )}

          {loading && uploadProgress > 0 && (
            <div className="mb-3">
              <ProgressBar 
                now={uploadProgress} 
                label={`${uploadProgress}%`} 
                animated 
                variant="success"
              />
              <small className="text-muted d-block text-center mt-1">
                Subiendo a Google Drive...
              </small>
            </div>
          )}

          <Row className="justify-content-center">
            {/* IZQUIERDA: VISTA PREVIA */}
            <Col md={7} className="d-flex flex-column align-items-center">
              <div className="d-flex justify-content-between align-items-center w-100 mb-3">
                <h5 className="fw-bold mb-0">Vista Previa</h5>
                {selectedFiles.length > 0 && (
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={handleRemoveFile}
                    disabled={loading}
                  >
                    Quitar
                  </Button>
                )}
              </div>
              
              <div style={{
                width: "100%",
                maxWidth: "500px",
                height: "420px",
                backgroundColor: "#F0F0F0",
                borderRadius: "10px",
                border: "2px dashed #D8D8D8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: 'hidden',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onClick={() => !loading && setModalOpen(true)}>
                
                {loading ? (
                  <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Subiendo...</p>
                  </div>
                ) : previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Vista previa" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%',
                      objectFit: 'contain' 
                    }}
                  />
                ) : (
                  <div className="text-center text-muted">
                    <div style={{ fontSize: '3rem' }}>📁</div>
                    <p className="mt-2">Haz clic para seleccionar imagen</p>
                    <small>.JPG, .PNG, .DICOM</small>
                  </div>
                )}
              </div>
              
              <p className="mt-2 text-center">
                {selectedFiles.length > 0 ? (
                  <>
                    <strong>{selectedFiles[0].name}</strong>
                    <br />
                    <small className="text-muted">
                      Tamaño: {(selectedFiles[0].size / 1024 / 1024).toFixed(2)} MB
                    </small>
                  </>
                ) : (
                  <span className="text-muted">No hay archivos seleccionados</span>
                )}
              </p>
            </Col>

            {/* DERECHA: FORMULARIO */}
            <Col md={5} className="d-flex flex-column align-items-center">
              <h5 className="fw-bold mb-3 text-center">Datos para Análisis</h5>
              <Form className="w-100 d-flex flex-column align-items-center">
                
                {/* SELECTBOX DE PACIENTES */}
                <Form.Group className="mb-3 w-100" style={{ maxWidth: "400px" }}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Form.Label className="mb-0">Paciente *</Form.Label>
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      onClick={handleRecargarPacientes}
                      disabled={loadingPacientes || loading}
                    >
                      {loadingPacientes ? <Spinner size="sm" /> : '↻'}
                    </Button>
                  </div>
                  {loadingPacientes ? (
                    <div className="text-center">
                      <Spinner size="sm" /> Cargando pacientes...
                    </div>
                  ) : pacientes.length === 0 ? (
                    <Alert variant="warning" className="py-2">
                      No hay pacientes registrados
                    </Alert>
                  ) : (
                    <Form.Select
                      name="id_paciente"
                      value={formData.id_paciente}
                      onChange={handleInputChange}
                      className="input-neuro"
                      disabled={loading}
                      required
                    >
                      <option value="">Selecciona un paciente</option>
                      {pacientes.map((paciente) => (
                        <option key={paciente.id_paciente} value={paciente.id_paciente}>
                          {paciente.nombre} {paciente.apellido} - {paciente.numero_historia_clinica}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                  {formData.id_paciente && (
                    <small className="text-muted d-block mt-1">
                      Seleccionado: {getNombrePaciente(formData.id_paciente)}
                    </small>
                  )}
                </Form.Group>

                {/* TIPO DE ESTUDIO */}
                <Form.Group className="mb-3 w-100" style={{ maxWidth: "400px" }}>
                  <Form.Label>Tipo de Estudio *</Form.Label>
                  <Form.Select
                    name="tipo_estudio"
                    value={formData.tipo_estudio}
                    onChange={handleInputChange}
                    className="input-neuro"
                    disabled={loading}
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="Mamografía">Mamografía</option>
                    <option value="Radiografía">Radiografía</option>
                    <option value="Tomografía">Tomografía</option>
                    <option value="Resonancia Magnética">Resonancia Magnética</option>
                    <option value="Ecografía">Ecografía</option>
                    <option value="Angiografía">Angiografía</option>
                    <option value="Densitometría Ósea">Densitometría Ósea</option>
                    <option value="Otro">Otro</option>
                  </Form.Select>
                </Form.Group>

                {/* FECHA DEL ESTUDIO */}
                <Form.Group className="mb-3 w-100" style={{ maxWidth: "400px" }}>
                  <Form.Label>Fecha del Estudio *</Form.Label>
                  <Form.Control
                    type="date"
                    name="fecha_estudio"
                    value={formData.fecha_estudio}
                    onChange={handleInputChange}
                    className="input-neuro"
                    disabled={loading}
                    required
                  />
                </Form.Group>

                {/* NOTAS DEL MÉDICO */}
                <Form.Group className="mb-3 w-100" style={{ maxWidth: "400px" }}>
                  <Form.Label>Notas del Médico</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="notas_medico"
                    value={formData.notas_medico}
                    onChange={handleInputChange}
                    placeholder="Observaciones clínicas, síntomas, antecedentes..."
                    className="input-neuro"
                    disabled={loading}
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>

          {/* BOTONES */}
          <Row className="mt-5 justify-content-center">
            <Col md={4} className="d-flex justify-content-center mb-3">
              <Button
                onClick={() => setModalOpen(true)}
                disabled={loading}
                variant="primary"
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  padding: "14px",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: "600",
                }}
              >
                {selectedFiles.length > 0 ? "Cambiar Imagen" : "Seleccionar Imagen"}
              </Button>
            </Col>

            <Col md={4} className="d-flex justify-content-center mb-3">
              <Button
                onClick={handleUpload}
                disabled={loading || selectedFiles.length === 0 || !formData.id_paciente}
                variant="success"
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  padding: "14px",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: "600",
                }}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Subiendo...
                  </>
                ) : "Subir a Google Drive"}
              </Button>
            </Col>

            <Col md={4} className="d-flex justify-content-center mb-3">
              <Button
                variant="warning"
                 disabled={ loading || selectedFiles.length === 0 || !formData.id_paciente}
                onClick={handleGenerateAnalysis}
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  padding: "14px",
                  borderRadius: "10px",
                  border: "none",
                  fontWeight: "600",
                  opacity: 0.6,
                }}
              >
                 Generar Análisis IA
              </Button>
            </Col>
          </Row>

          {/* INFO ADICIONAL */}
          <Row className="mt-3">
            <Col>
              <Alert variant="info" className="text-center">
                <strong>Información:</strong> Para subir una imagen, primero selecciona un paciente, 
                luego el tipo de estudio, fecha y finalmente la imagen.
              </Alert>
            </Col>
          </Row>
        </div>
      </Container>

      {/* Modal para seleccionar imagen */}
      <Formato_imagen
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFilesSubmit}
      />

      <style jsx="true">{`
        .input-neuro {
          background: #fafafa;
          border: 1px solid #e0e0e0;
          padding: 12px;
          border-radius: 8px;
          font-size: 15px;
          width: 100%;
        }
        .input-neuro:focus {
          border-color: #0038ff;
          box-shadow: 0 0 5px rgba(0, 56, 255, 0.3);
        }
        .option-paciente {
          padding: 10px;
        }
      `}</style>
    </div>
  );
};

export default Upload_images;