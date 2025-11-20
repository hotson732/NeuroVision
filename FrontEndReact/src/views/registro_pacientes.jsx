import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Table, Modal, Dropdown } from "react-bootstrap";
import Menu from "../components/Nadbar";
import { v4 as uuidv4 } from 'uuid';

const Registro_pacientes = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editPatientId, setEditPatientId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState("");

  // Form fields
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "",
    bloodType: "",
    phone: "",
    email: "",
    recordNumber: "",
    allergies: "",
    chronic: "",
    medications: "",
    registrationDate: new Date().toISOString().split('T')[0]
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("patients_db");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setPatients(parsedData);
        setFilteredPatients(parsedData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
  }, []);

  // Save data to localStorage whenever patients change
  useEffect(() => {
    localStorage.setItem("patients_db", JSON.stringify(patients));
  }, [patients]);

  const clearForm = () => {
    setFormData({
      fullName: "",
      dob: "",
      gender: "",
      bloodType: "",
      phone: "",
      email: "",
      recordNumber: "",
      allergies: "",
      chronic: "",
      medications: "",
      registrationDate: new Date().toISOString().split('T')[0]
    });
    setEditPatientId(null);
    setMessage("");
  };

  const validatePatient = (data) => {
    if (!data.fullName.trim()) {
      return "El nombre completo es obligatorio.";
    }
    
    try {
      const dobDate = new Date(data.dob);
      const today = new Date();
      if (dobDate > today) {
        return "La fecha de nacimiento no puede ser futura.";
      }
    } catch (error) {
      return "Formato de fecha inválido (YYYY-MM-DD).";
    }
    
    if (!data.gender) {
      return "Debe seleccionar un género.";
    }
    
    if (!data.bloodType) {
      return "Debe seleccionar tipo de sangre.";
    }
    
    if (data.phone && (!data.phone.match(/^\d+$/) || data.phone.length !== 10)) {
      return "El teléfono debe tener 10 dígitos.";
    }
    
    return null;
  };

  const handleSavePatient = () => {
    const error = validatePatient(formData);
    if (error) {
      setMessage(error);
      return;
    }

    if (editPatientId) {
      // Edit existing patient
      setPatients(prevPatients =>
        prevPatients.map(patient =>
          patient.id === editPatientId
            ? { ...patient, ...formData }
            : patient
        )
      );
      setEditPatientId(null);
    } else {
      // Add new patient
      const newPatient = {
        id: uuidv4(),
        ...formData
      };
      setPatients(prevPatients => [...prevPatients, newPatient]);
    }

    setFilteredPatients(patients);
    setShowModal(false);
    clearForm();
    setMessage("");
  };

  const handleEdit = () => {
    const patient = patients.find(p => p.recordNumber === searchTerm);
    if (!patient) {
      setMessage("Expediente no encontrado");
      return;
    }

    setEditPatientId(patient.id);
    setFormData({
      fullName: patient.fullName || "",
      dob: patient.dob || "",
      gender: patient.gender || "",
      bloodType: patient.bloodType || "",
      phone: patient.phone || "",
      email: patient.email || "",
      recordNumber: patient.recordNumber || "",
      allergies: patient.allergies || "",
      chronic: patient.chronic || "",
      medications: patient.medications || "",
      registrationDate: patient.registrationDate || new Date().toISOString().split('T')[0]
    });
    
    setShowEditModal(false);
    setShowModal(true);
    setSearchTerm("");
  };

  const handleDelete = () => {
    const patient = patients.find(p => p.recordNumber === searchTerm);
    if (!patient) {
      setMessage("No encontrado");
      return;
    }

    setPatients(prevPatients => prevPatients.filter(p => p.recordNumber !== searchTerm));
    setFilteredPatients(prev => prev.filter(p => p.recordNumber !== searchTerm));
    setShowDeleteModal(false);
    setSearchTerm("");
  };

  const handleFilter = () => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient =>
        patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.recordNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
    setShowFilterModal(false);
    setSearchTerm("");
  };

  const handleShowAll = () => {
    setFilteredPatients(patients);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleMenuAction = (action) => {
    switch (action) {
      case "register":
        clearForm();
        setShowModal(true);
        break;
      case "edit":
        setShowEditModal(true);
        break;
      case "delete":
        setShowDeleteModal(true);
        break;
      case "filter":
        setShowFilterModal(true);
        break;
      case "showAll":
        handleShowAll();
        break;
      case "toggleTheme":
        toggleTheme();
        break;
      default:
        break;
    }
  };

  const pageStyle = {
    backgroundColor: darkMode ? "#121212" : "#ffffff",
    color: darkMode ? "#ffffff" : "#000000",
    minHeight: "100vh"
  };

  const tableHeaderStyle = {
    backgroundColor: "#0077b6",
    color: "white"
  };

  const rowStyle = (index) => ({
    backgroundColor: index % 2 === 0 
      ? (darkMode ? "#1e1e1e" : "#e3f2fd") 
      : (darkMode ? "#2d2d2d" : "#bbdefb")
  });

  return (
    <div style={pageStyle}>
      {/* MENÚ SUPERIOR */}
      <header>
        <Menu />
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="fw-bold" style={{ color: "#0077b6" }}>
                REGISTRO DE PACIENTES
              </h1>
              
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-actions">
                  Acciones
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleMenuAction("register")}>
                    Registrar nuevo paciente
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleMenuAction("edit")}>
                    Editar paciente
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleMenuAction("delete")}>
                    Eliminar paciente
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleMenuAction("filter")}>
                    Filtrar pacientes
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleMenuAction("showAll")}>
                    Mostrar todos
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => handleMenuAction("toggleTheme")}>
                    {darkMode ? "Modo claro" : "Modo oscuro"}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            
            {message && (
              <div className="alert alert-danger mt-3" role="alert">
                {message}
              </div>
            )}
          </Col>
        </Row>

        {/* TABLA DE PACIENTES */}
        <Row>
          <Col>
            <div style={{ overflowX: "auto" }}>
              <Table striped bordered hover responsive variant={darkMode ? "dark" : "light"}>
                <thead>
                  <tr style={tableHeaderStyle}>
                    <th>Expediente</th>
                    <th>Nombre</th>
                    <th>F Nacimiento</th>
                    <th>Género</th>
                    <th>Tipo de sangre</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Alergias</th>
                    <th>Enfermedades</th>
                    <th>Medicamentos</th>
                    <th>F Registro</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient, index) => (
                    <tr key={patient.id} style={rowStyle(index)}>
                      <td>{patient.recordNumber}</td>
                      <td>{patient.fullName}</td>
                      <td>{patient.dob}</td>
                      <td>{patient.gender}</td>
                      <td>{patient.bloodType}</td>
                      <td>{patient.phone}</td>
                      <td>{patient.email}</td>
                      <td>{patient.allergies}</td>
                      <td>{patient.chronic}</td>
                      <td>{patient.medications}</td>
                      <td>{patient.registrationDate}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {filteredPatients.length === 0 && (
                <div className="text-center py-4">
                  <p>No se encontraron pacientes</p>
                </div>
              )}
            </div>
          </Col>
        </Row>

        {/* MODAL REGISTRAR/EDITAR PACIENTE */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {editPatientId ? "Editar paciente" : "Registrar nuevo paciente"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre completo *</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha de nacimiento (YYYY-MM-DD) *</Form.Label>
                    <Form.Control
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Género *</Form.Label>
                    <Form.Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo de sangre *</Form.Label>
                    <Form.Select
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar...</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10 dígitos"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Expediente</Form.Label>
                <Form.Control
                  type="text"
                  name="recordNumber"
                  value={formData.recordNumber}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Alergias</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Enfermedades crónicas</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="chronic"
                  value={formData.chronic}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Medicamentos</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="medications"
                  value={formData.medications}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Fecha de registro</Form.Label>
                <Form.Control
                  type="date"
                  name="registrationDate"
                  value={formData.registrationDate}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSavePatient}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* MODAL EDITAR (BUSCAR) */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Editar paciente</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Expediente</Form.Label>
              <Form.Control
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ingrese el número de expediente"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleEdit}>
              Buscar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* MODAL ELIMINAR */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Eliminar paciente</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Expediente</Form.Label>
              <Form.Control
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ingrese el número de expediente"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* MODAL FILTRAR */}
        <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Filtrar pacientes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Buscar por nombre o expediente</Form.Label>
              <Form.Control
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ingrese nombre o expediente"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowFilterModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleFilter}>
              Aplicar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default Registro_pacientes;