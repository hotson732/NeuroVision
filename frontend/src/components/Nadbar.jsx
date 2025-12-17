import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

function Menu() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('Usuario');
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        // Obtener datos del usuario desde localStorage al cargar el componente
        const loadUserData = () => {
            try {
                // Obtener el string JSON del localStorage
                const userStr = localStorage.getItem('user');
                
                if (userStr) {
                    const userData = JSON.parse(userStr);
                    
                    // Mostrar nombre de usuario o nombre completo
                    if (userData.nombre_usuario) {
                        setUserName(userData.nombre_usuario);
                    } else if (userData.nombre) {
                        // Si no hay nombre_usuario, usar nombre
                        setUserName(userData.nombre);
                    }
                    
                    // Guardar email si existe
                    if (userData.correo_electronico) {
                        setUserEmail(userData.correo_electronico);
                    }
                }
            } catch (error) {
                console.error('Error al cargar datos del usuario:', error);
            }
        };

        loadUserData();
        
        // Escuchar cambios en localStorage (opcional, si se actualiza en otra pestaña)
        const handleStorageChange = (e) => {
            if (e.key === 'user') {
                loadUserData();
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        // Limpiar localStorage al cerrar sesión
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <Navbar 
            expand="lg"
            style={{ 
                backgroundColor: '#080D2D',
                minHeight: '60px'
            }}
        >
            <Container fluid style={{ padding: '0 5%' }}>
                {/* Logo a la izquierda */}
                <Navbar.Brand 
                    href="/Upload_images" 
                    style={{ 
                        flex: '1', 
                        marginLeft: '-7%',
                        paddingTop: '.5%'  
                    }}
                >
                    <img 
                        src={logo} 
                        alt="NeuroVision" 
                        style={{
                            width: '100%',
                            maxWidth: '250px',
                            height: '50px',       
                            objectFit: 'cover'
                        }}
                    />
                </Navbar.Brand>
                
                <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end' }}>
                    <Dropdown>
                        <Dropdown.Toggle 
                            variant="outline-light" 
                            id="dropdown-basic"
                            style={{
                                backgroundColor: 'transparent',
                                border: '1px solid rgba(255,255,255,0.3)',
                                color: 'white',
                                marginRight: '5%'
                            }}
                        >
                            <span style={{ fontSize: '25px', lineHeight: '1' }}>☰</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{ 
                            backgroundColor: '#080D2D', 
                            border: '1px solid rgba(255,255,255,0.2)',
                            right: '0',
                            left: 'auto'
                        }}>
                            <Dropdown.Header style={{ color: 'white' }}>
                                <div>Usuario: {userName}</div>
                                {userEmail && (
                                    <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '4px' }}>
                                        {userEmail}
                                    </div>
                                )}
                            </Dropdown.Header>
                            <Dropdown.Divider style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                            
                            {/* Dropdown Items con navegación */}
                            <Dropdown.Item 
                                style={{ color: 'white' }}
                                onClick={() => handleNavigation('/Registro_pacientes')}
                            >
                                Administracion de pacientes
                            </Dropdown.Item>
                            
                            <Dropdown.Item 
                                style={{ color: 'white' }}
                                onClick={() => handleNavigation('/Historial_pacientes')}
                            >
                                Historial de pacientes
                            </Dropdown.Item>
                            <Dropdown.Item 
                                style={{ color: 'white' }}
                                onClick={() => handleNavigation('/Upload_images')}
                            >
                                Subir imagenes
                            </Dropdown.Item>
                            <Dropdown.Divider style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                            
                            <Dropdown.Item 
                                style={{ color: '#ff6b6b' }}
                                onClick={handleLogout}
                            >
                                Cerrar Sesión
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Container>
        </Navbar>
    );
}

export default Menu;