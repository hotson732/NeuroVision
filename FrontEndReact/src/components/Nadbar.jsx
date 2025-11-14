import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

function Menu() {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        // Aquí puedes agregar lógica para cerrar sesión
        navigate('/');
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
                                Usuario:Edson
                            </Dropdown.Header>
                            <Dropdown.Divider style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                            
                            {/* Dropdown Items con navegación */}
                            <Dropdown.Item 
                                style={{ color: 'white' }}
                                onClick={() => handleNavigation('/Registro_pacientes')}
                            >
                                Registro
                            </Dropdown.Item>
                            
                            <Dropdown.Item 
                                style={{ color: 'white' }}
                                onClick={() => handleNavigation('/Historial_pacientes')}
                            >
                                Historial de pacientes
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