import React, { useState } from "react";
import Card from "../components/Card";
import "../css/style_login.css";
import logo from "../assets/logo.png";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!correo || !contrasena) {
      alert('Por favor completa todos los campos');
      return;
    }
   
    try {
      const res= await axios.post('http://127.0.0.1:8000/api/v1/login', {
        correo_electronico: correo,
        contrasena: contrasena
      });

      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      navigate('/Upload_images');

    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        const data = error.response.data;
        setMessage(data.message || (data.errors ? JSON.stringify(data.errors) : 'Error en login'));
      } else {
        setMessage('Error en la conexión al servidor');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <img src={logo} alt="NeuroVision" />
      </div>

      <Card className="card">
        <p className="bienvenido">Bienvenido</p>
        <h1>Iniciar Sesión</h1>
        {message && <div className="mensaje-error">{message}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Usuario (correo)"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="usuario"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena} 
            onChange={(e) => setContrasena(e.target.value)}
            className="contraseña"
          />

          <button type="submit" className="inicio">Iniciar Sesión</button>
          <button type="button" className="registrar" onClick={() => navigate('/Registro_usuarios')}>
            Registrarse
          </button>
        </form>
      </Card>
    </div>
  );
};

export default Login;