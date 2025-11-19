// Este archivo estará listo para Supabase
// Por ahora contiene funciones simuladas

// TODO: Descomentar cuando tengamos Supabase configurado
// import { supabase } from './supabase'

// Función de login (simulada)
export async function loginUser(email, password, userType) {
  // TODO: Reemplazar con lógica real de Supabase
  
  // Por ahora simulamos la búsqueda en base de datos
  const usuariosPrueba = {
    'director@liceotecpan.edu.gt': { 
      password: 'director123', 
      rol: 'director', 
      plan: 'ambos',
      nombre: 'María González'
    },
    'jromanv@liceotecpan.edu.gt': { 
      password: 'docente123', 
      rol: 'docente', 
      plan: 'ambos',
      nombre: 'Juan Román'
    },
    'plopez@liceotecpan.edu.gt': { 
      password: 'docente123', 
      rol: 'docente', 
      plan: 'diario',
      nombre: 'Pedro López'
    },
    'mgarcia@liceotecpan.edu.gt': { 
      password: 'docente123', 
      rol: 'docente', 
      plan: 'fin_de_semana',
      nombre: 'María García'
    },
    'alu001@liceotecpan.edu.gt': { 
      password: 'alumno123', 
      rol: 'alumno', 
      plan: 'diario',
      nombre: 'Carlos Pérez'
    },
    'alu002@liceotecpan.edu.gt': { 
      password: 'alumno123', 
      rol: 'alumno', 
      plan: 'fin_de_semana',
      nombre: 'Ana Martínez'
    }
  }

  const usuario = usuariosPrueba[email]
  
  if (!usuario || usuario.password !== password || usuario.rol !== userType) {
    throw new Error('Credenciales incorrectas')
  }

  return {
    email,
    rol: usuario.rol,
    plan: usuario.plan,
    nombre: usuario.nombre
  }
}

// Función para obtener actividades (simulada)
export async function getActividades() {
  // TODO: Reemplazar con query real de Supabase
  
  return [
    {
      id: 1,
      titulo: 'Inicio de Clases',
      fecha: '2026-01-15',
      hora: '08:00',
      tipo: 'todos',
      jornada: 'diario',
      descripcion: 'Inicio del ciclo escolar 2026 - Plan Diario'
    },
    {
      id: 2,
      titulo: 'Reunión de Docentes',
      fecha: '2026-01-16',
      hora: '15:00',
      tipo: 'docentes',
      jornada: 'ambos',
      descripcion: 'Planificación del primer bimestre'
    },
    {
      id: 3,
      titulo: 'Inicio Fin de Semana',
      fecha: '2026-01-18',
      hora: '08:00',
      tipo: 'todos',
      jornada: 'fin_de_semana',
      descripcion: 'Inicio de clases Plan Fin de Semana'
    },
    {
      id: 4,
      titulo: 'Examen de Matemáticas',
      fecha: '2026-01-20',
      hora: '09:00',
      tipo: 'alumnos',
      jornada: 'diario',
      descripcion: 'Examen del primer bimestre - Plan Diario'
    },
    {
      id: 5,
      titulo: 'Taller de Computación',
      fecha: '2026-01-25',
      hora: '10:00',
      tipo: 'alumnos',
      jornada: 'fin_de_semana',
      descripcion: 'Taller práctico - Plan Fin de Semana'
    },
    {
      id: 6,
      titulo: 'Día de la Paz',
      fecha: '2026-01-30',
      hora: '08:00',
      tipo: 'todos',
      jornada: 'ambos',
      descripcion: 'Celebración para ambos planes'
    }
  ]
}

// Función para crear actividad (simulada)
export async function crearActividad(actividadData) {
  // TODO: Reemplazar con insert real de Supabase
  
  console.log('Crear actividad:', actividadData)
  return {
    ...actividadData,
    id: Date.now()
  }
}

// Función para actualizar actividad (simulada)
export async function actualizarActividad(id, actividadData) {
  // TODO: Reemplazar con update real de Supabase
  
  console.log('Actualizar actividad:', id, actividadData)
  return actividadData
}

// Función para eliminar actividad (simulada)
export async function eliminarActividad(id) {
  // TODO: Reemplazar con delete real de Supabase
  
  console.log('Eliminar actividad:', id)
  return true
}