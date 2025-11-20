import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './views/login'
import Upload_images from './views/upload_images';
import Historial_pacientes from './views/historial_pacientes';
import Registro_pacientes from './views/registro_pacientes';
import Registro_usuarios from './views/registro_usuarios';
import Formato_imagen from './views/formato_imagen';
import Analisis_imagen from './views/analisis_imagen'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Upload_images" element={<Upload_images />} />
        <Route path="/Historial_pacientes" element={<Historial_pacientes />} />
         <Route path="/Registro_pacientes" element={<Registro_pacientes />} />
         <Route path="/Registro_usuarios" element={<Registro_usuarios />} />
         <Route path="/Formato_imagen" element={<Formato_imagen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
