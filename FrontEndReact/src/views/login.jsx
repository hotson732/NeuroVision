import React from "react";
import { useState } from "react";
import Card from "../components/Card";
import "../css/style_login.css";
import logo from "../assets/logo.png";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // Estado para errores
  const navigate = useNavigate();

  const handleSubmit = async (e) => { // 1. Convertimos la función a ASYNC
      e.preventDefault();
      setMessage(""); // Limpiar mensajes previos

      if (!email || !password) {
          alert('Por favor completa todos los campos');
          return;
      }

      try {
          // 2. Petición real a tu Backend Laravel
          const response = await fetch("http://localhost:8000/api/login", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Accept": "application/json"
              },
              body: JSON.stringify({ email, password })
          });

          const data = await response.json();

          // 3. Verificar si Laravel nos dejó entrar
          if (response.ok) {
              // Login Exitoso
              // Guardamos la llave (token) en el navegador
              localStorage.setItem("auth_token", data.access_token);
              localStorage.setItem("user_name", data.user.name); // Opcional: guardar nombre

              console.log("Login exitoso, token guardado");
              
              // 4. AHORA SÍ navegamos a la siguiente pantalla
              navigate('/Upload_images');
          } else {
              // Login Fallido (Contraseña mal o usuario no existe)
              setMessage("Error: " + (data.message || "Credenciales incorrectas"));
          }

      } catch (error) {
          console.error("Error de conexión:", error);
          setMessage("No se pudo conectar con el servidor");
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
              <form onSubmit={handleSubmit}>
                  <input
                      type="email" 
                      placeholder="Usuario"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="usuario"
                  />
                  <input
                      type="password"
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="contraseña"
                  />
               
                  {/* 5. Mostrar mensaje de error si falla */}
                  {message && <p style={{color: 'red', textAlign: 'center'}}>{message}</p>}

                  <button type="submit" className="inicio">Iniciar Sesión</button>
                  <button type="button" className="registrar" onClick={() => navigate('/Registro_usuarios')}>Registrarse</button>
              </form>
          </Card>
      </div>
  );
}
export default Login;