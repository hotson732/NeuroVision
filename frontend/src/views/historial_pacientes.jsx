import React, { useState, useEffect } from "react";
import { 
  Container, Row, Col, Form, Button, Table, Modal, 
  Spinner, Alert, Badge, InputGroup, FormControl, Card 
} from "react-bootstrap";
import Menu from "../components/Nadbar";
import estudioService from "../services/estudioService";
import patientService from "../services/patientService";
import { useNavigate } from 'react-router-dom';

const Historial_pacientes = () => {
  const [estudios, setEstudios] = useState([]);
  const [filteredEstudios, setFilteredEstudios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editEstudioId, setEditEstudioId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSearchTerm, setFilterSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEstudio, setSelectedEstudio] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const navigate = useNavigate();

  // Form fields
  const [formData, setFormData] = useState({
    paciente_id: "",
    fecha_estudio: "",
    tipo_estudio: "",
    resultado: "",
    medico: "",
    observaciones: "",
    archivo_url: ""
  });

  // Cargar estudios y pacientes al montar el componente
  useEffect(() => {
    fetchEstudios();
    fetchPacientes();
    fetchEstadisticas();
  }, []);

  const fetchEstudios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await estudioService.getAllEstudios();
      setEstudios(data);
      setFilteredEstudios(data);
    } catch (err) {
      setError(`Error al cargar estudios: ${err.message}`);
      console.error("Error fetching estudios:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPacientes = async () => {
    try {
      const pacientesData = await patientService.getAllPatients();
      setPacientes(pacientesData);
    } catch (err) {
      console.error("Error fetching pacientes:", err);
    }
  };

  const fetchEstadisticas = async () => {
    try {
      const stats = await estudioService.getEstadisticas();
      setEstadisticas(stats);
    } catch (err) {
      console.error("Error fetching estadísticas:", err);
    }
  };

  const clearForm = () => {
    setFormData({
      paciente_id: "",
      fecha_estudio: "",
      tipo_estudio: "",
      resultado: "",
      medico: "",
      observaciones: "",
      archivo_url: ""
    });
    setEditEstudioId(null);
    setSelectedEstudio(null);
    setMessage("");
  };

  const validateForm = () => {
    if (!formData.paciente_id) {
      return "Seleccione un paciente";
    }
    if (!formData.fecha_estudio) {
      return "La fecha del estudio es obligatoria";
    }
    if (!formData.tipo_estudio.trim()) {
      return "El tipo de estudio es obligatorio";
    }
    if (!formData.resultado.trim()) {
      return "El resultado es obligatorio";
    }
    if (!formData.medico.trim()) {
      return "El médico responsable es obligatorio";
    }
    return null;
  };

  const handleSaveEstudio = async () => {
    const validationError = validateForm();
    if (validationError) {
      setMessage(validationError);
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      
      if (editEstudioId) {
        // Actualizar estudio existente
        await estudioService.updateEstudio(editEstudioId, formData);
        setMessage("✅ Estudio actualizado correctamente");
      } else {
        // Crear nuevo estudio
        await estudioService.createEstudio(formData);
        setMessage("✅ Estudio creado correctamente");
      }
      
      // Actualizar lista y estadísticas
      await fetchEstudios();
      await fetchEstadisticas();
      setShowModal(false);
      clearForm();
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(""), 3000);
      
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
      console.error("Error saving estudio:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEstudio = (estudio) => {
    setSelectedEstudio(estudio);
    setEditEstudioId(estudio.id_estudio);
    setFormData({
      paciente_id: estudio.paciente_id || "",
      fecha_estudio: estudio.fecha_estudio?.substring(0, 10) || "",
      tipo_estudio: estudio.tipo_estudio || "",
      resultado: estudio.resultado || "",
      medico: estudio.medico || "",
      observaciones: estudio.observaciones || "",
      archivo_url: estudio.archivo_url || ""
    });
    setShowModal(true);
  };

  const handleDeleteEstudio = async () => {
    if (!selectedEstudio) return;

    try {
      setLoading(true);
      await estudioService.deleteEstudio(selectedEstudio.id_estudio);
      setMessage("✅ Estudio eliminado correctamente");
      setShowDeleteModal(false);
      setSelectedEstudio(null);
      
      // Actualizar lista y estadísticas
      await fetchEstudios();
      await fetchEstadisticas();
      
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(`❌ Error: ${err.response?.data?.message || err.message}`);
      console.error("Error deleting estudio:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      await fetchEstudios();
      return;
    }

    try {
      setLoading(true);
      const results = await estudioService.searchEstudios(searchTerm);
      setFilteredEstudios(results);
    } catch (err) {
      setError(`Error en búsqueda: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!value.trim()) {
      setFilteredEstudios(estudios);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getResultadoBadge = (resultado) => {
    switch(resultado?.toLowerCase()) {
      case 'normal':
        return <Badge bg="success" pill>Normal</Badge>;
      case 'anormal':
        return <Badge bg="danger" pill>Anormal</Badge>;
      case 'pendiente':
        return <Badge bg="warning" pill>Pendiente</Badge>;
      case 'inconcluso':
        return <Badge bg="secondary" pill>Inconcluso</Badge>;
      default:
        return <Badge bg="info" pill>{resultado}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  const pageStyle = {
    backgroundColor: darkMode ? "#121212" : "#f8f9fa",
    color: darkMode ? "#ffffff" : "#000000",
    minHeight: "100vh",
    transition: "all 0.3s ease"
  };

  const cardStyle = {
    backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
    border: darkMode ? "1px solid #333" : "1px solid #dee2e6",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: darkMode ? "0 4px 6px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
  };

  const tableHeaderStyle = {
    backgroundColor: darkMode ? "#2c3e50" : "#0077b6",
    color: "white",
    position: "sticky",
    top: 0
  };

  const rowStyle = (index) => ({
    backgroundColor: index % 2 === 0 
      ? (darkMode ? "#2d2d2d" : "#f8f9fa") 
      : (darkMode ? "#1e1e1e" : "#ffffff"),
    transition: "background-color 0.3s ease"
  });

  const actionButtonStyle = {
    margin: "0 5px",
    padding: "5px 10px",
    fontSize: "0.875rem"
  };

  const studyTypes = [
    "Hemograma Completo",
    "Química Sanguínea",
    "Radiografía de Tórax",
    "Ecografía Abdominal",
    "Electrocardiograma",
    "Tomografía Computarizada",
    "Resonancia Magnética",
    "Endoscopia",
    "Colonoscopía",
    "Biopsia",
    "Ultrasonido",
    "Mamografía",
    "Densitometría Ósea",
    "Prueba de Esfuerzo"
  ];

  return (
    <div style={pageStyle}>
      <header>
        <Menu />
      </header>

      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="fw-bold" style={{ color: darkMode ? "#ffffff" : "#0077b6" }}>
                  Historial de Estudios Médicos
                </h1>
                <p className="text-muted">
                  Gestión completa de estudios y exámenes médicos
                </p>
              </div>
              <div className="d-flex gap-2">
                <Button 
                  variant={darkMode ? "outline-light" : "outline-primary"}
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? " Modo Claro" : " Modo Oscuro"}
                </Button>
                <Button 
                  variant="success"
                  onClick={fetchEstudios}
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : " Actualizar"}
                </Button>
              </div>
            </div>

            {/* ESTADÍSTICAS */}
            <Row className="mb-4">
              <Col md={3}>
                <div style={cardStyle} className="text-center">
                  <h5>Total Estudios</h5>
                  <h2 style={{ color: "#0077b6" }}>
                    {estadisticas?.total_estudios || estudios.length}
                  </h2>
                </div>
              </Col>
              <Col md={3}>
                <div style={cardStyle} className="text-center">
                  <h5>Estudios Normales</h5>
                  <h2 style={{ color: "#28a745" }}>
                    {estadisticas?.estudios_normales || 0}
                  </h2>
                </div>
              </Col>
              <Col md={3}>
                <div style={cardStyle} className="text-center">
                  <h5>Estudios Anormales</h5>
                  <h2 style={{ color: "#dc3545" }}>
                    {estadisticas?.estudios_anormales || 0}
                  </h2>
                </div>
              </Col>
              <Col md={3}>
                <div style={cardStyle} className="text-center">
                  <h5>Mostrando</h5>
                  <h2 style={{ color: "#17a2b8" }}>{filteredEstudios.length}</h2>
                </div>
              </Col>
            </Row>

            {message && (
              <Alert 
                variant={message.includes("✅") ? "success" : "danger"} 
                className="mt-3"
                onClose={() => setMessage("")}
                dismissible
              >
                {message}
              </Alert>
            )}
          </Col>
        </Row>

        {/* BARRA DE HERRAMIENTAS */}
        <Row className="mb-3">
          <Col>
            <div style={cardStyle}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-2">
                  <Button 
                    variant="primary"
                    onClick={() => {
                      clearForm();
                      setShowModal(true);
                    }}
                    disabled={loading}
                  >
                    <i className="bi bi-file-earmark-medical me-2"></i>
                    Nuevo Estudio
                  </Button>
                  <Button 
                    variant="warning"
                    onClick={() => setShowFilterModal(true)}
                    disabled={loading}
                  >
                    <i className="bi bi-funnel me-2"></i>
                    Filtros Avanzados
                  </Button>
                </div>
                
                <InputGroup style={{ width: "400px" }}>
                  <FormControl
                    placeholder="Buscar por paciente, estudio, médico..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                  <Button 
                    variant="outline-primary" 
                    onClick={handleSearch}
                    disabled={loading || !searchTerm.trim()}
                  >
                    <i className="bi bi-search"></i>
                  </Button>
                </InputGroup>
              </div>
            </div>
          </Col>
        </Row>

        {/* TABLA DE ESTUDIOS */}
        <Row>
          <Col>
            <div style={{ ...cardStyle, overflowX: "auto" }}>
              {loading && estudios.length === 0 ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" size="lg" />
                  <p className="mt-3">Cargando estudios...</p>
                </div>
              ) : (
                <>
                  <Table striped bordered hover responsive variant={darkMode ? "dark" : ""}>
                    <thead>
                      <tr style={tableHeaderStyle}>
                        <th>#</th>
                        <th>Paciente</th>
                        <th>Historia Clínica</th>
                        <th>Fecha Estudio</th>
                        <th>Tipo de Estudio</th>
                        <th>Resultado</th>
                        <th>Médico</th>
                        <th>Observaciones</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEstudios.map((estudio, index) => (
                        <tr key={estudio.id_estudio} style={rowStyle(index)}>
                          <td>{index + 1}</td>
                          <td>
                            <strong>
                              {estudio.paciente?.nombre} {estudio.paciente?.apellido}
                            </strong>
                          </td>
                          <td>
                            <code>{estudio.numero_historia_clinica}</code>
                          </td>
                          <td>
                            <small>{formatDate(estudio.fecha_estudio)}</small>
                          </td>
                          <td>{estudio.tipo_estudio}</td>
                          <td>
                            {getResultadoBadge(estudio.resultado)}
                          </td>
                          <td>{estudio.medico}</td>
                          <td style={{ maxWidth: "200px" }}>
                            <small className="text-truncate d-block">
                              {estudio.observaciones || "Sin observaciones"}
                            </small>
                          </td>
                          <td>
                            <div className="d-flex">
                              <Button
                                size="sm"
                                variant="outline-primary"
                                style={actionButtonStyle}
                                onClick={() => handleEditEstudio(estudio)}
                                disabled={loading}
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                style={actionButtonStyle}
                                onClick={() => {
                                  setSelectedEstudio(estudio);
                                  setShowDeleteModal(true);
                                }}
                                disabled={loading}
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                              {estudio.archivo_url && (
                                <Button
                                  size="sm"
                                  variant="outline-success"
                                  style={actionButtonStyle}
                                  onClick={() => window.open(estudio.archivo_url, '_blank')}
                                  title="Ver archivo adjunto"
                                >
                                  <i className="bi bi-file-earmark"></i>
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  
                  {filteredEstudios.length === 0 && !loading && (
                    <div className="text-center py-5">
                      <div className="mb-3">
                        <i className="bi bi-file-earmark-medical" style={{ fontSize: "3rem", color: "#6c757d" }}></i>
                      </div>
                      <h5>No se encontraron estudios</h5>
                      <p className="text-muted">
                        {searchTerm ? 
                          `No hay resultados para "${searchTerm}"` : 
                          "No hay estudios registrados"}
                      </p>
                      {!searchTerm && (
                        <Button 
                          variant="primary"
                          onClick={() => {
                            clearForm();
                            setShowModal(true);
                          }}
                        >
                          <i className="bi bi-file-earmark-medical me-2"></i>
                          Registrar primer estudio
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </Col>
        </Row>

        {/* MODAL REGISTRAR/EDITAR ESTUDIO */}
        <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          size="lg"
          centered
        >
          <Modal.Header closeButton style={darkMode ? { backgroundColor: "#343a40", color: "white" } : {}}>
            <Modal.Title>
              <i className="bi bi-file-earmark-medical me-2"></i>
              {editEstudioId ? "Editar Estudio" : "Nuevo Estudio Médico"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Paciente *</Form.Label>
                <Form.Select
                  name="paciente_id"
                  value={formData.paciente_id}
                  onChange={handleInputChange}
                  required
                  disabled={loading || !!editEstudioId}
                >
                  <option value="">Seleccionar paciente...</option>
                  {pacientes.map(paciente => (
                    <option key={paciente.id_paciente} value={paciente.id_paciente}>
                      {paciente.nombre} {paciente.apellido} - HC: {paciente.numero_historia_clinica}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha del Estudio *</Form.Label>
                    <Form.Control
                      type="date"
                      name="fecha_estudio"
                      value={formData.fecha_estudio}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de Estudio *</Form.Label>
                    <Form.Select
                      name="tipo_estudio"
                      value={formData.tipo_estudio}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    >
                      <option value="">Seleccionar tipo...</option>
                      {studyTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                      <option value="Otro">Otro</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Resultado *</Form.Label>
                    <Form.Select
                      name="resultado"
                      value={formData.resultado}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    >
                      <option value="">Seleccionar resultado...</option>
                      <option value="Normal">Normal</option>
                      <option value="Anormal">Anormal</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Inconcluso">Inconcluso</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Médico Responsable *</Form.Label>
                    <Form.Control
                      type="text"
                      name="medico"
                      value={formData.medico}
                      onChange={handleInputChange}
                      placeholder="Ej: Dr. Juan Pérez"
                      required
                      disabled={loading}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Observaciones</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleInputChange}
                  placeholder="Ingrese observaciones, hallazgos, recomendaciones..."
                  disabled={loading}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>URL de Archivo Adjunto (opcional)</Form.Label>
                <Form.Control
                  type="url"
                  name="archivo_url"
                  value={formData.archivo_url}
                  onChange={handleInputChange}
                  placeholder="https://ejemplo.com/archivo.pdf"
                  disabled={loading}
                />
                <Form.Text className="text-muted">
                  Enlace al archivo del estudio (PDF, imagen, etc.)
                </Form.Text>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer style={darkMode ? { backgroundColor: "#343a40" } : {}}>
            <Button 
              variant="secondary" 
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              variant={editEstudioId ? "warning" : "primary"} 
              onClick={handleSaveEstudio}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Guardando...
                </>
              ) : editEstudioId ? (
                "Actualizar Estudio"
              ) : (
                "Guardar Estudio"
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* MODAL CONFIRMAR ELIMINACIÓN */}
        <Modal 
          show={showDeleteModal} 
          onHide={() => setShowDeleteModal(false)}
          centered
        >
          <Modal.Header closeButton style={darkMode ? { backgroundColor: "#343a40", color: "white" } : {}}>
            <Modal.Title>
              <i className="bi bi-exclamation-triangle text-warning me-2"></i>
              Confirmar Eliminación
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <i className="bi bi-file-earmark-medical text-danger" style={{ fontSize: "3rem" }}></i>
              <h5 className="mt-3">¿Está seguro de eliminar este estudio?</h5>
              {selectedEstudio && (
                <p>
                  <strong>{selectedEstudio.tipo_estudio}</strong>
                  <br />
                  <small className="text-muted">
                    Paciente: {selectedEstudio.paciente?.nombre} {selectedEstudio.paciente?.apellido}<br />
                    Fecha: {formatDate(selectedEstudio.fecha_estudio)}
                  </small>
                </p>
              )}
              <div className="alert alert-warning mt-3">
                <i className="bi bi-info-circle me-2"></i>
                Esta acción no se puede deshacer. El estudio será eliminado permanentemente.
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer style={darkMode ? { backgroundColor: "#343a40" } : {}}>
            <Button 
              variant="secondary" 
              onClick={() => setShowDeleteModal(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteEstudio}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Eliminando...
                </>
              ) : (
                "Eliminar Definitivamente"
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* PIE DE PÁGINA */}
        <Row className="mt-4">
          <Col>
            <div className="text-center text-muted small">
              <p>
                Sistema de Gestión de Estudios Médicos | 
                Total: {estudios.length} estudios | 
                Mostrando: {filteredEstudios.length} | 
                {new Date().toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Historial_pacientes;