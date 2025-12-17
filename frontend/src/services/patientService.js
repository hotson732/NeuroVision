import axios from 'axios';
import API_CONFIG from '../config/api.js';
// Crear instancia de axios con la misma configuración que authService
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Error 401 - No autorizado (token expirado o inválido)
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
      
      // Error 403 - Prohibido (sin permisos)
      if (error.response.status === 403) {
        console.error('Acceso denegado:', error.response.data);
      }
      
      // Error 422 - Validación
      if (error.response.status === 422) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        throw new Error(errorMessages.join(', '));
      }
      
      // Otros errores
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          `Error ${error.response.status}: ${error.response.statusText}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      // Error de red o servidor no disponible
      throw new Error('Error de conexión con el servidor. Verifique que el servidor esté corriendo.');
    } else {
      // Error en la configuración de la petición
      throw new Error('Error en la configuración de la petición');
    }
  }
);

class PatientService {
  async getAllPatients() {
    try {
      const response = await api.get(API_CONFIG.PATIENTS.INDEX);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  }

  async getPatientById(id) {
    try {
      const response = await api.get(`${API_CONFIG.PATIENTS.SHOW}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching patient:', error);
      throw error;
    }
  }

 async createPatient(patientData) {
  try {
    // DEPURACIÓN: Ver qué datos llegan

    // NO sobrescribir creado_por - ya viene del componente
    // Solo generar id_paciente si no existe
    if (!patientData.id_paciente) {
      patientData.id_paciente = this.generateUUID();
    }
    
    
    const response = await api.post(API_CONFIG.PATIENTS.STORE, patientData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('❌ Error creating patient:', error);
    console.error('Detalles del error:', error.response?.data);
    throw error;
  }
}
generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

  async updatePatient(id, patientData) {
    try {
      const response = await api.put(`${API_CONFIG.PATIENTS.UPDATE}/${id}`, patientData);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  }

  async deletePatient(id) {
    try {
      const response = await api.delete(`${API_CONFIG.PATIENTS.DESTROY}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }
  }

  async searchPatients(searchTerm) {
    try {
      const response = await api.get(API_CONFIG.PATIENTS.SEARCH, {
        params: { q: searchTerm }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error searching patients:', error);
      throw error;
    }
  }

  // Método para verificar conexión
  async testConnection() {
    try {
      const response = await api.get('/test');
      return response.data;
    } catch (error) {
      console.error('Test connection failed:', error);
      throw error;
    }
  }
}

export default new PatientService();