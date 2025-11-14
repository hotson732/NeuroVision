import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Registro_usuarios = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Datos Personales
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    
    // Dirección
    pais: "",
    direccion: "",
    ciudad: "",
    estado: "",
    codigoPostal: "",
    
    // Identificación
    numeroLicencia: "",
    email: "",
    
    // Perfil
    usuario: "",
    contraseña: "",
    confirmarContraseña: "",
    
    // Términos
    aceptarTerminos: false
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Validación en tiempo real para contraseña
    if (name === 'contraseña') {
      validatePasswordStrength(value);
    }

    // Limpiar errores cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validación de campos obligatorios
    if (!formData.nombre.trim()) newErrors.nombre = "Nombre es requerido";
    if (!formData.apellidoPaterno.trim()) newErrors.apellidoPaterno = "Apellido paterno es requerido";
    if (!formData.pais) newErrors.pais = "País es requerido";
    if (!formData.direccion.trim()) newErrors.direccion = "Dirección es requerida";
    if (!formData.ciudad.trim()) newErrors.ciudad = "Ciudad es requerida";
    if (!formData.estado) newErrors.estado = "Estado es requerido";
    if (!formData.codigoPostal.trim()) newErrors.codigoPostal = "Código postal es requerido";
    if (!formData.numeroLicencia.trim()) newErrors.numeroLicencia = "Número de licencia es requerido";
    
    // Validación email
    if (!formData.email.trim()) {
      newErrors.email = "Email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email no válido";
    }

    // Validación usuario
    if (!formData.usuario.trim()) newErrors.usuario = "Usuario es requerido";

    // Validación contraseña
    if (!formData.contraseña) {
      newErrors.contraseña = "Contraseña es requerida";
    } else if (formData.contraseña.length < 8) {
      newErrors.contraseña = "La contraseña debe tener al menos 8 caracteres";
    } else if (passwordStrength < 3) {
      newErrors.contraseña = "La contraseña debe incluir mayúsculas, números y caracteres especiales";
    }

    // Validación confirmar contraseña
    if (formData.contraseña !== formData.confirmarContraseña) {
      newErrors.confirmarContraseña = "Las contraseñas no coinciden";
    }

    // Validación términos
    if (!formData.aceptarTerminos) {
      newErrors.aceptarTerminos = "Debes aceptar los términos y condiciones";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Aquí iría la lógica de envío del formulario
      console.log("Formulario enviado:", formData);
      alert("Registro exitoso");
       navigate('/');
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: case 1: return "#ff4444";
      case 2: return "#ffaa00";
      case 3: return "#ffdd00";
      case 4: return "#00c851";
      default: return "#e0e0e0";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return "Muy débil";
      case 1: return "Débil";
      case 2: return "Regular";
      case 3: return "Buena";
      case 4: return "Fuerte";
      default: return "";
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "var(--bg-page, #D0D0D0)",
      fontFamily: "var(--font-family, 'Montserrat', 'Poppins', system-ui, sans-serif)"
    }}>

    

      {/* CONTENIDO PRINCIPAL */}
      <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: "calc(100vh - 80px)" }}>
        <Card style={{
          width: "100%",
          maxWidth: "1200px",
          backgroundColor: "var(--panel-bg, #E6E6E6)",
          borderRadius: "var(--radius-panel, 20px)",
          boxShadow: "var(--shadow-soft, 0 6px 18px rgba(0,0,0,0.06))",
          border: "none",
          padding: "48px 64px"
        }}>
          <Row className="g-5">
            {/* COLUMNA IZQUIERDA */}
            <Col md={6}>
              <h1 style={{
                fontSize: "38px",
                fontWeight: "700",
                color: "var(--text-primary, #2F2F2F)",
                marginBottom: "40px"
              }}>
                Registrarse
              </h1>

              {/* DATOS PERSONALES */}
              <div className="mb-4">
                <h6 style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "var(--text-primary, #2F2F2F)",
                  marginBottom: "20px"
                }}>
                  Datos Personales *
                </h6>
                
                <Form.Group className="mb-3">
                  <Form.Control
                    name="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    style={inputStyle}
                    aria-required="true"
                  />
                  {errors.nombre && <div className="text-danger small mt-1">{errors.nombre}</div>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    name="apellidoPaterno"
                    placeholder="Apellido Paterno"
                    value={formData.apellidoPaterno}
                    onChange={handleChange}
                    style={inputStyle}
                    aria-required="true"
                  />
                  {errors.apellidoPaterno && <div className="text-danger small mt-1">{errors.apellidoPaterno}</div>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    name="apellidoMaterno"
                    placeholder="Apellido Materno"
                    value={formData.apellidoMaterno}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </Form.Group>
              </div>

              {/* DIRECCIÓN */}
              <div>
                <h6 style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "var(--text-primary, #2F2F2F)",
                  marginBottom: "20px"
                }}>
                  Dirección *
                </h6>

                <Form.Group className="mb-3">
                  <Form.Select
                    name="pais"
                    value={formData.pais}
                    onChange={handleChange}
                    style={inputStyle}
                    aria-required="true"
                  >
                    <option value="">Seleccione País</option>
                    <option value="mx">México</option>
                    <option value="us">Estados Unidos</option>
                    <option value="es">España</option>
                    <option value="ar">Argentina</option>
                  </Form.Select>
                  {errors.pais && <div className="text-danger small mt-1">{errors.pais}</div>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    name="direccion"
                    placeholder="Dirección (Calle y Número)"
                    value={formData.direccion}
                    onChange={handleChange}
                    style={inputStyle}
                    aria-required="true"
                  />
                  {errors.direccion && <div className="text-danger small mt-1">{errors.direccion}</div>}
                </Form.Group>

                <Row className="g-3">
                  <Col>
                    <Form.Group>
                      <Form.Control
                        name="ciudad"
                        placeholder="Ciudad"
                        value={formData.ciudad}
                        onChange={handleChange}
                        style={inputStyle}
                        aria-required="true"
                      />
                      {errors.ciudad && <div className="text-danger small mt-1">{errors.ciudad}</div>}
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Select
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        style={inputStyle}
                        aria-required="true"
                      >
                        <option value="">Estado</option>
                        <option value="cdmx">CDMX</option>
                        <option value="edomex">Estado de México</option>
                        <option value="jal">Jalisco</option>
                        <option value="nl">Nuevo León</option>
                      </Form.Select>
                      {errors.estado && <div className="text-danger small mt-1">{errors.estado}</div>}
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Control
                        name="codigoPostal"
                        placeholder="C.P."
                        value={formData.codigoPostal}
                        onChange={handleChange}
                        style={inputStyle}
                        aria-required="true"
                      />
                      {errors.codigoPostal && <div className="text-danger small mt-1">{errors.codigoPostal}</div>}
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Col>

            {/* COLUMNA DERECHA */}
            <Col md={6}>
              {/* LOGO */}
              <div className="text-end mb-4">
                <img src="/logo.png" alt="NeuroVision" style={{ width: '100%',
                            maxWidth: '250px',
                            height: '50px',       
                            objectFit: 'cover' }} />
                
              </div>

              {/* IDENTIFICACIÓN */}
              <div className="mb-4">
                <h6 style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "var(--text-primary, #2F2F2F)",
                  marginBottom: "20px"
                }}>
                  Identificación *
                </h6>

                <Form.Group className="mb-3">
                  <Form.Control
                    name="numeroLicencia"
                    placeholder="Número de Licencia"
                    value={formData.numeroLicencia}
                    onChange={handleChange}
                    style={inputStyle}
                    aria-required="true"
                  />
                  {errors.numeroLicencia && <div className="text-danger small mt-1">{errors.numeroLicencia}</div>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    name="email"
                    type="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={handleChange}
                    style={inputStyle}
                    aria-required="true"
                  />
                  {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                </Form.Group>
              </div>

              {/* PERFIL */}
              <div className="mb-4">
                <h6 style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "var(--text-primary, #2F2F2F)",
                  marginBottom: "20px"
                }}>
                  Perfil *
                </h6>

                <Form.Group className="mb-3">
                  <Form.Control
                    name="usuario"
                    placeholder="Usuario"
                    value={formData.usuario}
                    onChange={handleChange}
                    style={inputStyle}
                    aria-required="true"
                  />
                  {errors.usuario && <div className="text-danger small mt-1">{errors.usuario}</div>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    name="contraseña"
                    type="password"
                    placeholder="Contraseña"
                    value={formData.contraseña}
                    onChange={handleChange}
                    style={inputStyle}
                    aria-required="true"
                  />
                  {formData.contraseña && (
                    <div className="mt-2">
                      <div style={{
                        height: "4px",
                        backgroundColor: getPasswordStrengthColor(),
                        borderRadius: "2px",
                        marginBottom: "4px"
                      }} />
                      <small style={{ color: getPasswordStrengthColor() }}>
                        {getPasswordStrengthText()}
                      </small>
                    </div>
                  )}
                  {errors.contraseña && <div className="text-danger small mt-1">{errors.contraseña}</div>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    name="confirmarContraseña"
                    type="password"
                    placeholder="Confirmar Contraseña"
                    value={formData.confirmarContraseña}
                    onChange={handleChange}
                    style={inputStyle}
                    aria-required="true"
                  />
                  {errors.confirmarContraseña && <div className="text-danger small mt-1">{errors.confirmarContraseña}</div>}
                </Form.Group>
              </div>

              {/* CHECKBOX TÉRMINOS */}
              <Form.Group className="mb-4">
                <div className="d-flex align-items-center">
                  <Form.Check
                    name="aceptarTerminos"
                    checked={formData.aceptarTerminos}
                    onChange={handleChange}
                    style={{
                      width: "47px",
                      height: "52px",
                      backgroundColor: formData.aceptarTerminos ? "var(--checkbox-bg, #000000)" : "white",
                      border: "2px solid var(--checkbox-bg, #000000)",
                
                      cursor: "pointer"
                    }}
                    aria-required="true"
                  />
                  <Form.Label style={{ margin: 0, cursor: "pointer" }}>
                    Aceptar Términos y Condiciones
                  </Form.Label>
                </div>
                {errors.aceptarTerminos && <div className="text-danger small mt-1">{errors.aceptarTerminos}</div>}
              </Form.Group>

              {/* BOTONES */}
              <div className="d-flex justify-content-end gap-3">
                <Button
                  variant="outline-secondary"
                 
                  style={{
                    padding: "12px 32px",
                    borderRadius: "12px",
                    border: "2px solid var(--secondary, #BDBDBD)",
                    color: "var(--text-primary, #2F2F2F)",
                    fontWeight: "600"
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSubmit}
                  style={{
                    padding: "12px 32px",
                    borderRadius: "12px",
                    backgroundColor: "var(--primary, #2F43FF)",
                    border: "none",
                    fontWeight: "600",
                    background: "linear-gradient(135deg, var(--primary, #2F43FF) 0%, var(--primary-hover, #2438E0) 100%)"
                  }}
                >
                  Registrarse
                </Button>
              </div>
            </Col>
          </Row>
        </Card>
      </Container>

      <style jsx>{`
        :root {
          --bg-page: #D0D0D0;
          --panel-bg: #E6E6E6;
          --text-primary: #2F2F2F;
          --text-muted: #6D6D6D;
          --input-border: #CFCFCF;
          --input-bg: #F5F5F5;
          --primary: #2F43FF;
          --primary-hover: #2438E0;
          --secondary: #BDBDBD;
          --checkbox-bg: #000000;
          --radius-panel: 20px;
          --radius-input: 12px;
          --shadow-soft: 0 6px 18px rgba(0,0,0,0.06);
          --font-family: 'Montserrat', 'Poppins', system-ui, sans-serif;
        }
      `}</style>
    </div>
  );
};

// Estilo consistente para inputs
const inputStyle = {
  backgroundColor: "var(--input-bg, #F5F5F5)",
  border: "1px solid var(--input-border, #CFCFCF)",
  borderRadius: "var(--radius-input, 12px)",
  padding: "14px 16px",
  fontSize: "15px",
  height: "48px",
  color: "var(--text-primary, #2F2F2F)"
};

export default Registro_usuarios;