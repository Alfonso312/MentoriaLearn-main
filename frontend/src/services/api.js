import axios from 'axios';

const API_URL = 'http://localhost:8080';
const AUTH_URL = 'http://localhost:8080/auth';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const authApi = axios.create({
    baseURL: AUTH_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const estudianteService = {
    getAll: () => api.get('/api/estudiantes'),
    getById: (id) => api.get(`/api/estudiantes/${id}`),
    create: (data) => api.post('/api/estudiantes', data),
    update: (id, data) => api.put(`/api/estudiantes/${id}`, data),
    delete: (id) => api.delete(`/api/estudiantes/${id}`),
};

export const authService = {
    login: (credentials) => authApi.post('/login', credentials),
    register: (userData) => authApi.post('/register', userData),
    checkAuth: () => authApi.get('/check'),
    getUsersByRole: (role) => authApi.get(`/users/${role}`),
};

export const contactoService = {
    enviarMensaje: (data) => api.post('/api/contacto', data),
    getAll: () => api.get('/api/contacto'),
    getById: (id) => api.get(`/api/contacto/${id}`),
    delete: (id) => api.delete(`/api/contacto/${id}`),
};

export const inscripcionService = {
    getAll: () => api.get('/inscripciones'),
    create: (data) => api.post('/inscripciones', data),
    delete: (id) => api.delete(`/inscripciones/${id}`),
    update: (id, data) => api.put(`/inscripciones/${id}`, data),
};

export const cursoService = {
    getAll: () => api.get('/cursos'),
};

export default api; 