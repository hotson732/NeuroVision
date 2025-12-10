import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

const Registro_usuarios = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    apellidoMaterno: "",
    email: "",
    usuario: "",
    contraseña: "",
    confirmarContraseña: "",
    pais: "",
    estado: "",
    ciudad: "",
    direccion: "",
    codigoPostal: "",
    numeroLicencia: "",
    aceptarTerminos: false,
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [availability, setAvailability] = useState({
    usuario: { checking: false, available: true, message: "" },
    email: { checking: false, available: true, message: "" },
    licencia: { checking: false, available: true, message: "" }
  });

  // Función para verificar disponibilidad
  const checkAvailability = async (type, value) => {
    if (!value.trim()) return;
    
    setAvailability(prev => ({
      ...prev,
      [type]: { ...prev[type], checking: true }
    }));

    try {
      const response = await authService.checkAvailability(type, value);
      setAvailability(prev => ({
        ...prev,
        [type]: {
          checking: false,
          available: response.available,
          message: response.message
        }
      }));
    } catch (err) {
      console.error(`Error checking ${type}:`, err);
      setAvailability(prev => ({
        ...prev,
        [type]: { checking: false, available: true, message: "" }
      }));
    }
  };

  // Debounce para verificaciones
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.usuario.trim()) {
        checkAvailability('usuario', formData.usuario);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.usuario]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.email.trim() && /\S+@\S+\.\S+/.test(formData.email)) {
        checkAvailability('email', formData.email);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.email]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.numeroLicencia.trim()) {
        checkAvailability('licencia', formData.numeroLicencia);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.numeroLicencia]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'contraseña') {
      validatePasswordStrength(value);
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (serverError) {
      setServerError("");
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
    let isValid = true;

    // Validación de campos obligatorios
    if (!formData.nombre.trim()) {
      newErrors.nombre = "Nombre es requerido";
      isValid = false;
    }
    
    if (!formData.apellido.trim()) {
      newErrors.apellido = "Apellido es requerido";
      isValid = false;
    }

    // Validación disponibilidad
    if (!availability.usuario.available) {
      newErrors.usuario = availability.usuario.message;
      isValid = false;
    }

    if (!availability.email.available) {
      newErrors.email = availability.email.message;
      isValid = false;
    }

    if (!availability.licencia.available) {
      newErrors.numeroLicencia = availability.licencia.message;
      isValid = false;
    }

    // Validación email
    if (!formData.email.trim()) {
      newErrors.email = "Email es requerido";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email no válido";
      isValid = false;
    }

    // Validación usuario
    if (!formData.usuario.trim()) {
      newErrors.usuario = "Usuario es requerido";
      isValid = false;
    }

    // Validación contraseña
    if (!formData.contraseña) {
      newErrors.contraseña = "Contraseña es requerida";
      isValid = false;
    } else if (formData.contraseña.length < 8) {
      newErrors.contraseña = "La contraseña debe tener al menos 8 caracteres";
      isValid = false;
    } else if (passwordStrength < 3) {
      newErrors.contraseña = "La contraseña debe incluir mayúsculas, números y caracteres especiales";
      isValid = false;
    }

    // Validación confirmar contraseña
    if (formData.contraseña !== formData.confirmarContraseña) {
      newErrors.confirmarContraseña = "Las contraseñas no coinciden";
      isValid = false;
    }

    // Validación número de licencia
    if (!formData.numeroLicencia.trim()) {
      newErrors.numeroLicencia = "Número de licencia es requerido";
      isValid = false;
    }

    // Validación términos
    if (!formData.aceptarTerminos) {
      newErrors.aceptarTerminos = "Debes aceptar los términos y condiciones";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError("");

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Preparar payload según lo que espera Laravel
      const payload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        pais: formData.pais || null,
        direccion: formData.direccion || null,
        ciudad: formData.ciudad || null,
        estado: formData.estado || null,
        codigo_postal: formData.codigoPostal || null,
        numero_licencia: formData.numeroLicencia,
        email: formData.email,
        usuario: formData.usuario,
        contrasena: formData.contraseña,
        contrasena_confirmation: formData.confirmarContraseña,
        aceptar_terminos: formData.aceptarTerminos ? 1 : 0
      };

      const response = await authService.register(payload);

      if (response.success) {
        // Guardar datos de autenticación
        authService.setAuthData(response.token, response.user);
        
        alert('Registro exitoso');
        navigate('/Upload_images');
      } else {
        setServerError(response.message || 'Error en el registro');
      }
    } catch (err) {
      console.error('Error en registro:', err);
      
      if (err.response && err.response.status === 422) {
        const backendErrors = err.response.data.errors;
        const fieldMap = {
          'nombre': 'nombre',
          'apellido': 'apellido',
          'apellido_materno': 'apellidoMaterno',
          'pais': 'pais',
          'direccion': 'direccion',
          'ciudad': 'ciudad',
          'estado': 'estado',
          'codigo_postal': 'codigoPostal',
          'numero_licencia': 'numeroLicencia',
          'email': 'email',
          'usuario': 'usuario',
          'contrasena': 'contraseña',
          'contrasena_confirmation': 'confirmarContraseña',
          'aceptar_terminos': 'aceptarTerminos'
        };

        const newErrors = {};
        Object.keys(backendErrors).forEach(key => {
          const mapped = fieldMap[key] || key;
          if (backendErrors[key] && backendErrors[key][0]) {
            newErrors[mapped] = backendErrors[key][0];
          }
        });
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length > 0) {
          setServerError('Por favor, corrige los errores en el formulario');
        }
      } else if (err.response && err.response.data && err.response.data.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError('Error al conectar con el servidor. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
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

  const inputStyle = {
    backgroundColor: "var(--input-bg, #F5F5F5)",
    border: "1px solid var(--input-border, #CFCFCF)",
    borderRadius: "var(--radius-input, 12px)",
    padding: "14px 16px",
    fontSize: "15px",
    height: "48px",
    color: "var(--text-primary, #2F2F2F)"
  };

  const inputErrorStyle = {
    ...inputStyle,
    borderColor: "#dc3545"
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "var(--bg-page, #D0D0D0)",
      fontFamily: "var(--font-family, 'Montserrat', 'Poppins', system-ui, sans-serif)"
    }}>
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
                    style={errors.nombre ? inputErrorStyle : inputStyle}
                    disabled={isSubmitting}
                  />
                  {errors.nombre && <div className="text-danger small mt-1">{errors.nombre}</div>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    name="apellido"
                    placeholder="Apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    style={errors.apellido ? inputErrorStyle : inputStyle}
                    disabled={isSubmitting}
                  />
                  {errors.apellido && <div className="text-danger small mt-1">{errors.apellido}</div>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    name="apellidoMaterno"
                    placeholder="Apellido Materno (Opcional)"
                    value={formData.apellidoMaterno}
                    onChange={handleChange}
                    style={inputStyle}
                    disabled={isSubmitting}
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
                  Dirección
                </h6>

                <Form.Group className="mb-3">
                  <Form.Select
                    name="pais"
                    value={formData.pais}
                    onChange={handleChange}
                    style={inputStyle}
                    disabled={isSubmitting}
                  >
                    <option value="">Seleccione País (Opcional)</option>
                    <option value="MX">México</option>
                    <option value="US">Estados Unidos</option>
                    <option value="ES">España</option>
                    <option value="AR">Argentina</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    name="direccion"
                    placeholder="Dirección (Opcional)"
                    value={formData.direccion}
                    onChange={handleChange}
                    style={inputStyle}
                    disabled={isSubmitting}
                  />
                </Form.Group>

                <Row className="g-3">
                  <Col>
                    <Form.Group>
                      <Form.Control
                        name="ciudad"
                        placeholder="Ciudad (Opcional)"
                        value={formData.ciudad}
                        onChange={handleChange}
                        style={inputStyle}
                        disabled={isSubmitting}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Control
                        name="estado"
                        placeholder="Estado (Opcional)"
                        value={formData.estado}
                        onChange={handleChange}
                        style={inputStyle}
                        disabled={isSubmitting}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Control
                        name="codigoPostal"
                        placeholder="Código Postal (Opcional)"
                        value={formData.codigoPostal}
                        onChange={handleChange}
                        style={inputStyle}
                        disabled={isSubmitting}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </Col>

            {/* COLUMNA DERECHA */}
            <Col md={6}>
              {/* LOGO */}
              <div className="text-end mb-4">
                <img 
                  src="/logo.png" 
                  alt="NeuroVision" 
                  style={{ 
                    width: '100%',
                    maxWidth: '250px',
                    height: '50px',       
                    objectFit: 'cover' 
                  }} 
                />
              </div>

              {/* Error del servidor */}
              {serverError && (
                <div className="alert alert-danger" role="alert">
                  {serverError}
                </div>
              )}

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
                    style={errors.numeroLicencia ? inputErrorStyle : inputStyle}
                    disabled={isSubmitting}
                  />
                  {availability.licencia.checking && (
                    <small className="text-muted">Verificando disponibilidad...</small>
                  )}
                  {!availability.licencia.checking && availability.licencia.message && (
                    <small className={availability.licencia.available ? "text-success" : "text-danger"}>
                      {availability.licencia.message}
                    </small>
                  )}
                  {errors.numeroLicencia && <div className="text-danger small mt-1">{errors.numeroLicencia}</div>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    name="email"
                    type="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={handleChange}
                    style={errors.email ? inputErrorStyle : inputStyle}
                    disabled={isSubmitting}
                  />
                  {availability.email.checking && (
                    <small className="text-muted">Verificando disponibilidad...</small>
                  )}
                  {!availability.email.checking && availability.email.message && (
                    <small className={availability.email.available ? "text-success" : "text-danger"}>
                      {availability.email.message}
                    </small>
                  )}
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
                    style={errors.usuario ? inputErrorStyle : inputStyle}
                    disabled={isSubmitting}
                  />
                  {availability.usuario.checking && (
                    <small className="text-muted">Verificando disponibilidad...</small>
                  )}
                  {!availability.usuario.checking && availability.usuario.message && (
                    <small className={availability.usuario.available ? "text-success" : "text-danger"}>
                      {availability.usuario.message}
                    </small>
                  )}
                  {errors.usuario && <div className="text-danger small mt-1">{errors.usuario}</div>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    name="contraseña"
                    type="password"
                    placeholder="Contraseña"
                    value={formData.contraseña}
                    onChange={handleChange}
                    style={errors.contraseña ? inputErrorStyle : inputStyle}
                    disabled={isSubmitting}
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
                    style={errors.confirmarContraseña ? inputErrorStyle : inputStyle}
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                    id="aceptar-terminos"
                  />
                  <Form.Label htmlFor="aceptar-terminos" style={{ margin: 0, marginLeft: "10px", cursor: "pointer" }}>
                    Aceptar Términos y Condiciones
                  </Form.Label>
                </div>
                {errors.aceptarTerminos && <div className="text-danger small mt-1">{errors.aceptarTerminos}</div>}
              </Form.Group>

              {/* BOTONES */}
              <div className="d-flex justify-content-end gap-3">
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate('/')} 
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  style={{
                    padding: "12px 32px",
                    borderRadius: "12px",
                    backgroundColor: "var(--primary, #2F43FF)",
                    border: "none",
                    fontWeight: "600",
                    background: "linear-gradient(135deg, var(--primary, #2F43FF) 0%, var(--primary-hover, #2438E0) 100%)"
                  }}
                >
                  {isSubmitting ? 'Registrando...' : 'Registrarse'}
                </Button>
              </div>
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
};

export default Registro_usuarios;