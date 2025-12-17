import axios from 'axios';
import API_CONFIG from '../config/api.js';

// Crear instancia de axios
const apiEstudios = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para agregar token
apiEstudios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
apiEstudios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

const estudioService = {
  // Obtener todos los estudios
  getAllEstudios: async () => {
    try {
      const response = await apiEstudios.get(API_CONFIG.ESTUDIOS.INDEX);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching estudios:', error);
      throw error;
    }
  },

  // Obtener un estudio por ID
  getEstudioById: async (id) => {
    try {
      const response = await apiEstudios.get(`${API_CONFIG.ESTUDIOS.SHOW}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching estudio:', error);
      throw error;
    }
  },

  // Crear un nuevo estudio
  createEstudio: async (estudioData) => {
    try {
      const response = await apiEstudios.post(API_CONFIG.ESTUDIOS.STORE, estudioData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating estudio:', error);
      throw error;
    }
  },

  // Actualizar un estudio
  updateEstudio: async (id, estudioData) => {
    try {
      const response = await apiEstudios.put(`${API_CONFIG.ESTUDIOS.UPDATE}/${id}`, estudioData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating estudio:', error);
      throw error;
    }
  },

  // Eliminar un estudio
  deleteEstudio: async (id) => {
    try {
      const response = await apiEstudios.delete(`${API_CONFIG.ESTUDIOS.DESTROY}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting estudio:', error);
      throw error;
    }
  },

  // Buscar estudios
  searchEstudios: async (query) => {
    try {
      const response = await apiEstudios.get(API_CONFIG.ESTUDIOS.SEARCH, {
        params: { q: query }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error searching estudios:', error);
      throw error;
    }
  },

  // Obtener estudios por paciente
  getEstudiosByPaciente: async (pacienteId) => {
    try {
      const response = await apiEstudios.get(`${API_CONFIG.ESTUDIOS.BY_PACIENTE}/${pacienteId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching estudios by paciente:', error);
      throw error;
    }
  },

  // Obtener estadísticas
  getEstadisticas: async () => {
    try {
      const response = await apiEstudios.get(API_CONFIG.ESTUDIOS.ESTADISTICAS);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching estadísticas:', error);
      throw error;
    }
  }
};

export default estudioService;