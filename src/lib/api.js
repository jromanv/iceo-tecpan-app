// src/lib/api.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Función helper para manejar respuestas
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Error en la petición');
  }
  
  return data;
};

// Función helper para obtener headers con token
const getHeaders = () => {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// ============================================
// AUTENTICACIÓN
// ============================================

export const loginUser = async (email, password, userType) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, userType }),
  });

  const data = await handleResponse(response);
  
  // Guardar token en localStorage
  if (data.token) {
    localStorage.setItem('authToken', data.token);
  }
  
  return data.usuario;
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userPlan');
  localStorage.removeItem('userName');
  localStorage.removeItem('userType');
  localStorage.removeItem('isAuthenticated');
};

// ============================================
// ACTIVIDADES
// ============================================

export const getActividades = async () => {
  const response = await fetch(`${API_URL}/actividades`, {
    method: 'GET',
    headers: getHeaders(),
  });

  const data = await handleResponse(response);
  return data.actividades;
};

export const getActividadById = async (id) => {
  const response = await fetch(`${API_URL}/actividades/${id}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  const data = await handleResponse(response);
  return data.actividad;
};

export const crearActividad = async (actividadData) => {
  const response = await fetch(`${API_URL}/actividades`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(actividadData),
  });

  const data = await handleResponse(response);
  return data.actividad;
};

export const actualizarActividad = async (id, actividadData) => {
  const response = await fetch(`${API_URL}/actividades/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(actividadData),
  });

  const data = await handleResponse(response);
  return data.actividad;
};

export const eliminarActividad = async (id) => {
  const response = await fetch(`${API_URL}/actividades/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  return handleResponse(response);
};

// ============================================
// USUARIOS
// ============================================

export const getUsuarios = async () => {
  const response = await fetch(`${API_URL}/usuarios`, {
    method: 'GET',
    headers: getHeaders(),
  });

  const data = await handleResponse(response);
  return data.usuarios;
};

export const getUsuarioById = async (id) => {
  const response = await fetch(`${API_URL}/usuarios/${id}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  const data = await handleResponse(response);
  return data.usuario;
};