const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:8000/api',
  PATIENTS: {
    INDEX: '/pacientes',
    STORE: '/pacientes',
    SHOW: '/pacientes',
    UPDATE: '/pacientes',
    DESTROY: '/pacientes',
    SEARCH: '/pacientes/search'
  },
  ESTUDIOS: {
    INDEX: '/estudios',
    STORE: '/estudios',
    SHOW: '/estudios',
    UPDATE: '/estudios',
    DESTROY: '/estudios',
    SEARCH: '/estudios/buscar',
    ESTADISTICAS: '/estudios/estadisticas',
    BY_PACIENTE: '/estudios/paciente'
  }
};

export default API_CONFIG;