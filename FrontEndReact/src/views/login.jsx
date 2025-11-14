import React from "react";
import { useState } from "react";
import Card from "../components/Card";
import "../css/style_login.css";
import logo from "../assets/logo.png";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        
      
        if (!email || !password) {
            alert('Por favor completa todos los campos');
            return;
        }

      
        console.log('Login attempt:', { email, password });
        
       
        navigate('/Upload_images');
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
                 
                    <button type="submit" className="inicio" handleSubmit>Iniciar Sesión</button>
                    <button type="button" className="registrar" onClick={() => navigate('/Registro_usuarios')}>Registrarse</button>
                </form>
            </Card>
        </div>
    );
}
export default Login;