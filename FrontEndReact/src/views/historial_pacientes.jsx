import React from "react";
import { useState } from "react";

const Historial_pacientes = () => {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [genero, setGenero] = useState("");
  const [historialMedico, setHistorialMedico] = useState("");

    return (
        <div className="registro-container">
            <h1>Registro de Pacientes</h1>  
        </div>
        );


}
export default Historial_pacientes;