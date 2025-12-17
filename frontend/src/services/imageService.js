// services/imageService.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';
const AI_API_URL = 'https://tu-api-de-ia.com'; // Cambiar por tu API real

class ImageService {
  
  // 1. Subir imagen a Google Drive a través del backend
  async uploadToGoogleDrive(imageFile, estudioData) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('id_estudio', estudioData.id_estudio);
      formData.append('nombre_archivo', imageFile.name);
      formData.append('formato_imagen', imageFile.type.split('/')[1] || 'dcm');
      
      const response = await axios.post(`${API_BASE_URL}/upload/drive`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error subiendo a Google Drive:', error);
      throw error;
    }
  }
  
  // 2. Enviar a API de IA para análisis
  async analyzeWithAI(imageUrl, estudioData) {
    try {
      const response = await axios.post(`${AI_API_URL}/analyze`, {
        image_url: imageUrl,
        patient_id: estudioData.id_paciente,
        study_type: estudioData.tipo_estudio,
        metadata: {
          age: estudioData.edad_paciente,
          gender: estudioData.genero_paciente,
          symptoms: estudioData.notas_medico
        }
      }, {
        headers: {
          'Authorization': 'Bearer TU_API_KEY_IA' // Tu API key de IA
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error en análisis de IA:', error);
      throw error;
    }
  }
  
  // 3. Guardar estudio en base de datos
  async saveStudy(studyData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/estudios`, studyData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error guardando estudio:', error);
      throw error;
    }
  }
  
  // 4. Guardar diagnóstico
  async saveDiagnosis(diagnosisData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/diagnosticos`, diagnosisData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error guardando diagnóstico:', error);
      throw error;
    }
  }
  
  // 5. Generar reporte médico
  async generateReport(reportData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/reportes`, reportData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error generando reporte:', error);
      throw error;
    }
  }
  
  // 6. Obtener historial de análisis
  async getAnalysisHistory(patientId = null) {
    try {
      const params = patientId ? { paciente_id: patientId } : {};
      const response = await axios.get(`${API_BASE_URL}/estudios/historial`, {
        params,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      throw error;
    }
  }
  
  // 7. Simulación de análisis para desarrollo
  async simulateAIAnalysis(imageFile) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          analysis: {
            findings: [
              "No se observan masas sospechosas.",
              "La densidad mamaria es heterogénea.",
              "No hay signos de microcalcificaciones agrupadas.",
              "La arquitectura del tejido es simétrica."
            ],
            diagnosis: "Estudio dentro de límites normales",
            confidence: 0.92,
            recommendations: [
              "Control rutinario en 12 meses.",
              "Mantener hábitos saludables."
            ]
          }
        });
      }, 3000);
    });
  }
}

export default new ImageService();