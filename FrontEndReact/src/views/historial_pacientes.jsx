import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Table, Modal, Dropdown, Alert } from "react-bootstrap";
import Menu from "../components/Nadbar";

const Historial_pacientes = () => {
  const [studies, setStudies] = useState([]);
  const [filteredStudies, setFilteredStudies] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studyToDelete, setStudyToDelete] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ show: false, message: "" });

  // Filtros
  const [filters, setFilters] = useState({
    recordNumber: "",
    studyType: "",
    fromDate: "",
    toDate: ""
  });

  // Form data para nuevo estudio
  const [formData, setFormData] = useState({
    recordNumber: "",
    date: "",
    type: "",
    result: "",
    doctor: ""
  });

  // Colores para modo oscuro/claro
  const colors = {
    dark: {
      bg: "#0d1b2a",
      card: "#1b263b",
      text: "#e0e1dd",
      button: "#1e6091"
    },
    light: {
      bg: "#f0f4f8",
      card: "white",
      text: "black",
      button: "#0077b6"
    }
  };

  const currentColors = darkMode ? colors.dark : colors.light;

  // Cargar datos del localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("estudios_db");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setStudies(parsedData);
        setFilteredStudies(parsedData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
  }, []);

  // Guardar datos en localStorage
  useEffect(() => {
    localStorage.setItem("estudios_db", JSON.stringify(studies));
  }, [studies]);

  const clearForm = () => {
    setFormData({
      recordNumber: "",
      date: "",
      type: "",
      result: "",
      doctor: ""
    });
  };

  const clearFilters = () => {
    setFilters({
      recordNumber: "",
      studyType: "",
      fromDate: "",
      toDate: ""
    });
    setFilteredStudies(studies);
  };

  const applyFilters = () => {
    const { recordNumber, studyType, fromDate, toDate } = filters;
    
    const filtered = studies.filter(study => {
      const matchesRecord = !recordNumber || 
        study.recordNumber.toLowerCase().includes(recordNumber.toLowerCase());
      const matchesType = !studyType || 
        study.type.toLowerCase().includes(studyType.toLowerCase());
      const matchesFromDate = !fromDate || study.date >= fromDate;
      const matchesToDate = !toDate || study.date <= toDate;

      return matchesRecord && matchesType && matchesFromDate && matchesToDate;
    });

    setFilteredStudies(filtered);
    setShowFilterModal(false);
  };

  const handleAddStudy = () => {
    const { recordNumber, date, type, result, doctor } = formData;
    
    if (!recordNumber || !date || !type || !result || !doctor) {
      setSnackbar({ show: true, message: "Completa todos los campos" });
      return;
    }

    const newStudy = {
      recordNumber,
      date,
      type,
      result,
      doctor
    };

    setStudies(prev => [...prev, newStudy]);
    setFilteredStudies(prev => [...prev, newStudy]);
    setShowAddModal(false);
    clearForm();
    setSnackbar({ show: true, message: "Estudio agregado exitosamente" });
  };

  const handleDeleteStudy = () => {
    if (!studyToDelete) return;

    const updatedStudies = studies.filter(study => 
      !(study.recordNumber === studyToDelete.recordNumber && 
        study.date === studyToDelete.date && 
        study.type === studyToDelete.type)
    );

    setStudies(updatedStudies);
    setFilteredStudies(updatedStudies);
    setShowDeleteModal(false);
    setStudyToDelete(null);
    setSnackbar({ show: true, message: "Estudio eliminado exitosamente" });
  };

  const openDeleteConfirm = (study) => {
    setStudyToDelete(study);
    setShowDeleteModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const pageStyle = {
    backgroundColor: currentColors.bg,
    color: currentColors.text,
    minHeight: "100vh",
    padding: "20px 0"
  };

  const cardStyle = {
    backgroundColor: currentColors.card,
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  };

  const tableHeaderStyle = {
    backgroundColor: darkMode ? "#123047" : "#90a4ae",
    color: "white"
  };

  const rowStyle = (index) => ({
    backgroundColor: index % 2 === 0 
      ? (darkMode ? "#1e1e1e" : "#f8f9fa") 
      : (darkMode ? "#2d2d2d" : "#ffffff")
  });

  return (
    <div style={pageStyle}>
      {/* MENÚ SUPERIOR */}
      <header>
        <Menu />
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <Container fluid>
        {/* HEADER */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="fw-bold" style={{ color: "#0077b6" }}>
                HISTORIAL DE ESTUDIOS MÉDICOS
              </h1>
              
              <Dropdown>
                <Dropdown.Toggle 
                  variant="primary" 
                  id="dropdown-actions"
                  style={{ backgroundColor: currentColors.button, border: "none" }}
                >
                  Acciones
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ backgroundColor: currentColors.card }}>
                  <Dropdown.Item 
                    onClick={() => setShowAddModal(true)}
                    style={{ color: currentColors.text }}
                  >
                    Añadir estudio
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={() => setShowFilterModal(true)}
                    style={{ color: currentColors.text }}
                  >
                    Aplicar filtros
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={clearFilters}
                    style={{ color: currentColors.text }}
                  >
                    Mostrar todo
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item 
                    onClick={toggleTheme}
                    style={{ color: currentColors.text }}
                  >
                    {darkMode ? "Modo claro" : "Modo oscuro"}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
        </Row>

        {/* TABLA DE ESTUDIOS */}
        <Row>
          <Col>
            <Card style={cardStyle}>
              <Card.Body>
                <div style={{ overflowX: "auto" }}>
                  <Table striped bordered hover responsive variant={darkMode ? "dark" : "light"}>
                    <thead>
                      <tr style={tableHeaderStyle}>
                        <th>Número de expediente</th>
                        <th>Fecha del estudio</th>
                        <th>Tipo de estudio</th>
                        <th>Resultado</th>
                        <th>Médico responsable</th>
                        <th>Eliminar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudies.map((study, index) => (
                        <tr key={`${study.recordNumber}-${study.date}-${study.type}`} style={rowStyle(index)}>
                          <td>{study.recordNumber}</td>
                          <td>{study.date}</td>
                          <td>{study.type}</td>
                          <td>{study.result}</td>
                          <td>{study.doctor}</td>
                          <td className="text-center">
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => openDeleteConfirm(study)}
                            >
                              🗑️
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {filteredStudies.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            No hay estudios médicos registrados
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* MODAL AÑADIR ESTUDIO */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
          <Modal.Header closeButton style={cardStyle}>
            <Modal.Title style={{ color: currentColors.text }}>
              Añadir nuevo estudio
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={cardStyle}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Número de expediente *</Form.Label>
                <Form.Control
                  type="text"
                  name="recordNumber"
                  value={formData.recordNumber}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Fecha del estudio *</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tipo de estudio *</Form.Label>
                <Form.Control
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Resultado *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="result"
                  value={formData.result}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Médico responsable *</Form.Label>
                <Form.Control
                  type="text"
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer style={cardStyle}>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              onClick={handleAddStudy}
              style={{ backgroundColor: currentColors.button, border: "none" }}
            >
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* MODAL FILTROS */}
        <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
          <Modal.Header closeButton style={cardStyle}>
            <Modal.Title style={{ color: currentColors.text }}>
              Aplicar filtros
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={cardStyle}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Número de expediente</Form.Label>
                <Form.Control
                  type="text"
                  name="recordNumber"
                  value={filters.recordNumber}
                  onChange={handleFilterChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tipo de estudio</Form.Label>
                <Form.Control
                  type="text"
                  name="studyType"
                  value={filters.studyType}
                  onChange={handleFilterChange}
                />
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Desde</Form.Label>
                    <Form.Control
                      type="date"
                      name="fromDate"
                      value={filters.fromDate}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Hasta</Form.Label>
                    <Form.Control
                      type="date"
                      name="toDate"
                      value={filters.toDate}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer style={cardStyle}>
            <Button variant="secondary" onClick={() => setShowFilterModal(false)}>
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              onClick={applyFilters}
              style={{ backgroundColor: currentColors.button, border: "none" }}
            >
              Aplicar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* MODAL CONFIRMAR ELIMINACIÓN */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton style={cardStyle}>
            <Modal.Title style={{ color: currentColors.text }}>
              Confirmar eliminación
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={cardStyle}>
            <p style={{ color: currentColors.text }}>
              ¿Deseas eliminar el estudio del expediente {studyToDelete?.recordNumber}?
            </p>
          </Modal.Body>
          <Modal.Footer style={cardStyle}>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteStudy}>
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* SNACKBAR */}
        {snackbar.show && (
          <Alert 
            variant={snackbar.message.includes("éxito") ? "success" : "danger"}
            className="position-fixed top-0 end-0 m-3"
            style={{ zIndex: 1050 }}
            onClose={() => setSnackbar({ show: false, message: "" })}
            dismissible
          >
            {snackbar.message}
          </Alert>
        )}
      </Container>
    </div>
  );
};

export default Historial_pacientes;