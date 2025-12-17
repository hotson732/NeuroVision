import React, { useState, useEffect } from "react";
import { 
  Container, Row, Col, Form, Button, Table, Modal, 
  Navbar, Nav, Spinner, Alert, Badge, InputGroup, FormControl 
} from "react-bootstrap";
import Menu from "../components/Nadbar";
import patientService from "../services/patientService";
import { useNavigate } from 'react-router-dom';

const Registro_pacientes = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editPatientId, setEditPatientId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSearchTerm, setFilterSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const navigate = useNavigate();

  // Form fields
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fecha_nacimiento: "",
    genero: "",
    numero_historia_clinica: "",
    antecedentes_medicos: "",
    creado_por: ""
  });

  // Cargar pacientes al montar el componente
  useEffect(() => {
    fetchPatients();
  }, []);

  // Obtener usuario logueado para creado_por
  const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
    return null;
  };

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientService.getAllPatients();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      setError(`Error al cargar pacientes: ${err.message}`);
      console.error("Error fetching patients:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      fecha_nacimiento: "",
      genero: "",
      numero_historia_clinica: "",
      antecedentes_medicos: "",
      creado_por: ""
    });
    setEditPatientId(null);
    setSelectedPatient(null);
    setMessage("");
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      return "El nombre es obligatorio";
    }
    if (!formData.apellido.trim()) {
      return "El apellido es obligatorio";
    }
    if (!formData.fecha_nacimiento) {
      return "La fecha de nacimiento es obligatoria";
    }
    if (!formData.genero) {
      return "El género es obligatorio";
    }
    if (!formData.numero_historia_clinica.trim()) {
      return "El número de historia clínica es obligatorio";
    }
    return null;
  };

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

 const handleSavePatient = async () => {
  const validationError = validateForm();
  if (validationError) {
    setMessage(validationError);
    return;
  }

  try {
    setLoading(true);
    setMessage("");
    
    // Preparar datos
    const patientData = { ...formData };
    
    // Generar UUID para el paciente si es nuevo
    if (!editPatientId) {
      patientData.id_paciente = generateUUID();
    }
    
    // ASIGNAR USUARIO CREADOR - CORRECCIÓN
    const currentUser = getCurrentUser();
    
    if (currentUser && currentUser.id) {
      // Usar la propiedad 'id' (que es el UUID del usuario)
      patientData.creado_por = currentUser.id;
    } else {
      // Si no hay usuario, usar un UUID por defecto (usuario administrador)
      patientData.creado_por = "dbaf62fd-3dc2-4cf2-90b6-0f606de365a8"; // Este es el mismo ID que tienes
    }
    
    // Verificación final
   
    
    if (editPatientId) {
      // Actualizar paciente existente
      await patientService.updatePatient(editPatientId, patientData);
      setMessage("✅ Paciente actualizado correctamente");
    } else {
      // Crear nuevo paciente
      await patientService.createPatient(patientData);
      setMessage("✅ Paciente creado correctamente");
    }
    
    // Actualizar lista
    await fetchPatients();
    setShowModal(false);
    clearForm();
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => setMessage(""), 3000);
    
  } catch (err) {
    setMessage(` Error: ${err.message}`);
    console.error(" Error detallado:", err);
  } finally {
    setLoading(false);
  }
};

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setEditPatientId(patient.id_paciente);
    setFormData({
      nombre: patient.nombre || "",
      apellido: patient.apellido || "",
      fecha_nacimiento: patient.fecha_nacimiento?.substring(0, 10) || "",
      genero: patient.genero || "",
      numero_historia_clinica: patient.numero_historia_clinica || "",
      antecedentes_medicos: patient.antecedentes_medicos || "",
      creado_por: patient.creado_por || ""
    });
    setShowEditModal(false);
    setShowModal(true);
  };

  const handleDeletePatient = async () => {
    if (!selectedPatient) return;

    try {
      setLoading(true);
      await patientService.deletePatient(selectedPatient.id_paciente);
      setMessage("✅ Paciente eliminado correctamente");
      setShowDeleteModal(false);
      setSelectedPatient(null);
      
      // Actualizar lista
      await fetchPatients();
      
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
      console.error("Error deleting patient:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (!filterSearchTerm.trim()) {
      setFilteredPatients(patients);
      setShowFilterModal(false);
      return;
    }

    const filtered = patients.filter(patient =>
      patient.nombre?.toLowerCase().includes(filterSearchTerm.toLowerCase()) ||
      patient.apellido?.toLowerCase().includes(filterSearchTerm.toLowerCase()) ||
      patient.numero_historia_clinica?.toLowerCase().includes(filterSearchTerm.toLowerCase())
    );
    
    setFilteredPatients(filtered);
    setShowFilterModal(false);
    setFilterSearchTerm("");
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
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient =>
        patient.nombre?.toLowerCase().includes(value.toLowerCase()) ||
        patient.apellido?.toLowerCase().includes(value.toLowerCase()) ||
        patient.numero_historia_clinica?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return "";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} años`;
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

  return (
    <div style={pageStyle}>
      {/* MENÚ SUPERIOR */}
      <header>
        <Menu />
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <Container fluid className="py-4">
        {/* ENCABEZADO Y ESTADÍSTICAS */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="fw-bold" style={{ color: darkMode ? "#ffffff" : "#0077b6" }}>
                   Registro de Pacientes
                </h1>
                <p className="text-muted">
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
                  onClick={fetchPatients}
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
                  <h5>Total Pacientes</h5>
                  <h2 style={{ color: "#0077b6" }}>{patients.length}</h2>
                </div>
              </Col>
              <Col md={3}>
                <div style={cardStyle} className="text-center">
                  <h5>Hombres</h5>
                  <h2 style={{ color: "#0077b6" }}>
                    {patients.filter(p => p.genero === 'Masculino').length}
                  </h2>
                </div>
              </Col>
              <Col md={3}>
                <div style={cardStyle} className="text-center">
                  <h5> Mujeres</h5>
                  <h2 style={{ color: "#e83e8c" }}>
                    {patients.filter(p => p.genero === 'Femenino').length}
                  </h2>
                </div>
              </Col>
              <Col md={3}>
                <div style={cardStyle} className="text-center">
                  <h5> Mostrando</h5>
                  <h2 style={{ color: "#28a745" }}>{filteredPatients.length}</h2>
                </div>
              </Col>
            </Row>

            {/* MENSAJES */}
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
                    <i className="bi bi-person-plus me-2"></i>
                    Nuevo Paciente
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
                
                <InputGroup style={{ width: "300px" }}>
                  <FormControl
                    placeholder="Buscar por nombre, apellido o historia clínica..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    disabled={loading}
                  />
                  <Button variant="outline-secondary">
                    <i className="bi bi-search"></i>
                  </Button>
                </InputGroup>
              </div>
            </div>
          </Col>
        </Row>

        {/* TABLA DE PACIENTES */}
        <Row>
          <Col>
            <div style={{ ...cardStyle, overflowX: "auto" }}>
              {loading && patients.length === 0 ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" size="lg" />
                  <p className="mt-3">Cargando pacientes...</p>
                </div>
              ) : (
                <>
                  <Table striped bordered hover responsive variant={darkMode ? "dark" : ""}>
                    <thead>
                      <tr style={tableHeaderStyle}>
                        <th>#</th>
                        <th>Nombre Completo</th>
                        <th>Edad</th>
                        <th>Género</th>
                        <th>Historia Clínica</th>
                        <th>Antecedentes</th>
                        <th>Fecha Registro</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map((patient, index) => (
                        <tr key={patient.id_paciente} style={rowStyle(index)}>
                          <td>{index + 1}</td>
                          <td>
                            <strong>{patient.nombre} {patient.apellido}</strong>
                          </td>
                          <td>{calculateAge(patient.fecha_nacimiento)}</td>
                          <td>
                            <Badge 
                              bg={patient.genero === 'Masculino' ? 'primary' : 'danger'}
                              pill
                            >
                              {patient.genero}
                            </Badge>
                          </td>
                          <td>
                            <code>{patient.numero_historia_clinica}</code>
                          </td>
                          <td style={{ maxWidth: "200px" }}>
                            <small className="text-truncate d-block">
                              {patient.antecedentes_medicos || "Sin antecedentes"}
                            </small>
                          </td>
                          <td>
                            <small>{formatDate(patient.fecha_creacion)}</small>
                          </td>
                          <td>
                            <div className="d-flex">
                              <Button
                                size="sm"
                                variant="outline-primary"
                                style={actionButtonStyle}
                                onClick={() => handleEditPatient(patient)}
                                disabled={loading}
                              >
                                <i className="bi bi-pencil"></i>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                style={actionButtonStyle}
                                onClick={() => {
                                  setSelectedPatient(patient);
                                  setShowDeleteModal(true);
                                }}
                                disabled={loading}
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-info"
                                style={actionButtonStyle}
                                onClick={() => {
                                  // Navegar a detalles del paciente
                                  navigate(`/paciente/${patient.id_paciente}`);
                                }}
                                disabled={loading}
                              >
                                <i className="bi bi-eye"></i>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  
                  {filteredPatients.length === 0 && !loading && (
                    <div className="text-center py-5">
                      <div className="mb-3">
                        <i className="bi bi-person-x" style={{ fontSize: "3rem", color: "#6c757d" }}></i>
                      </div>
                      <h5>No se encontraron pacientes</h5>
                      <p className="text-muted">
                        {searchTerm ? 
                          `No hay resultados para "${searchTerm}"` : 
                          "No hay pacientes registrados"}
                      </p>
                      {!searchTerm && (
                        <Button 
                          variant="primary"
                          onClick={() => {
                            clearForm();
                            setShowModal(true);
                          }}
                        >
                          <i className="bi bi-person-plus me-2"></i>
                          Registrar primer paciente
                        </Button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </Col>
        </Row>

        {/* MODAL REGISTRAR/EDITAR PACIENTE */}
        <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          size="lg"
          centered
        >
          <Modal.Header closeButton style={darkMode ? { backgroundColor: "#343a40", color: "white" } : {}}>
            <Modal.Title>
              <i className="bi bi-person me-2"></i>
              {editPatientId ? "Editar Paciente" : "Nuevo Paciente"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre *</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Ingrese el nombre"
                      required
                      disabled={loading}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Apellido *</Form.Label>
                    <Form.Control
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      placeholder="Ingrese el apellido"
                      required
                      disabled={loading}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha de Nacimiento *</Form.Label>
                    <Form.Control
                      type="date"
                      name="fecha_nacimiento"
                      value={formData.fecha_nacimiento}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                    {formData.fecha_nacimiento && (
                      <Form.Text className="text-muted">
                        Edad: {calculateAge(formData.fecha_nacimiento)}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Género *</Form.Label>
                    <Form.Select
                      name="genero"
                      value={formData.genero}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Número de Historia Clínica *</Form.Label>
                <Form.Control
                  type="text"
                  name="numero_historia_clinica"
                  value={formData.numero_historia_clinica}
                  onChange={handleInputChange}
                  placeholder="Ej: HC-2024-001"
                  required
                  disabled={loading || editPatientId}
                  readOnly={!!editPatientId}
                />
                {editPatientId && (
                  <Form.Text className="text-muted">
                    El número de historia clínica no se puede modificar
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Antecedentes Médicos</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="antecedentes_medicos"
                  value={formData.antecedentes_medicos}
                  onChange={handleInputChange}
                  placeholder="Ingrese alergias, enfermedades crónicas, medicamentos, etc."
                  disabled={loading}
                />
                <Form.Text className="text-muted">
                  Separe cada antecedente con punto y coma (;)
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
              variant={editPatientId ? "warning" : "primary"} 
              onClick={handleSavePatient}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Guardando...
                </>
              ) : editPatientId ? (
                "Actualizar Paciente"
              ) : (
                "Guardar Paciente"
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
              <i className="bi bi-person-x text-danger" style={{ fontSize: "3rem" }}></i>
              <h5 className="mt-3">¿Está seguro de eliminar este paciente?</h5>
              {selectedPatient && (
                <p>
                  <strong>{selectedPatient.nombre} {selectedPatient.apellido}</strong>
                  <br />
                  <small className="text-muted">
                    Historia clínica: {selectedPatient.numero_historia_clinica}
                  </small>
                </p>
              )}
              <div className="alert alert-warning mt-3">
                <i className="bi bi-info-circle me-2"></i>
                Esta acción no se puede deshacer. Se eliminarán todos los datos del paciente.
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
              onClick={handleDeletePatient}
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

        {/* MODAL FILTROS AVANZADOS */}
        <Modal 
          show={showFilterModal} 
          onHide={() => setShowFilterModal(false)}
          centered
        >
          <Modal.Header closeButton style={darkMode ? { backgroundColor: "#343a40", color: "white" } : {}}>
            <Modal.Title>
              <i className="bi bi-funnel me-2"></i>
              Filtros Avanzados
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Buscar texto</Form.Label>
                <Form.Control
                  type="text"
                  value={filterSearchTerm}
                  onChange={(e) => setFilterSearchTerm(e.target.value)}
                  placeholder="Buscar en todos los campos..."
                  disabled={loading}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Filtrar por género</Form.Label>
                <Form.Select
                  onChange={(e) => {
                    if (e.target.value) {
                      const filtered = patients.filter(p => p.genero === e.target.value);
                      setFilteredPatients(filtered);
                      setShowFilterModal(false);
                    }
                  }}
                  disabled={loading}
                >
                  <option value="">Todos los géneros</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer style={darkMode ? { backgroundColor: "#343a40" } : {}}>
            <Button 
              variant="secondary" 
              onClick={() => {
                setFilteredPatients(patients);
                setShowFilterModal(false);
              }}
              disabled={loading}
            >
              Mostrar Todos
            </Button>
            <Button 
              variant="primary" 
              onClick={handleFilter}
              disabled={loading || !filterSearchTerm.trim()}
            >
              Aplicar Filtros
            </Button>
          </Modal.Footer>
        </Modal>

        {/* PIE DE PÁGINA */}
        <Row className="mt-4">
          <Col>
            <div className="text-center text-muted small">
              <p>
                Sistema de Gestión de Pacientes | 
                Total: {patients.length} pacientes | 
                Mostrando: {filteredPatients.length} | 
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

export default Registro_pacientes;