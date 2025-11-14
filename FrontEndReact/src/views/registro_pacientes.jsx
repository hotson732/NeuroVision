import React from "react";
import { useState } from "react";

const Registro_pacientes = () => {
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
export default Registro_pacientes;