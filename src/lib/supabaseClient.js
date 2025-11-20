// Mock data - datos de prueba
let actividadesMock = [
  { id: 1, titulo: 'Inicio de Clases', fecha: '2025-01-15', hora: '08:00', tipo: 'todos', jornada: 'ambos', descripcion: 'Bienvenida e introducción al año escolar' },
  { id: 2, titulo: 'Reunión Docentes Plan Diario', fecha: '2025-01-20', hora: '14:00', tipo: 'docentes', jornada: 'diario', descripcion: 'Planificación trimestral' },
  { id: 3, titulo: 'Examen Parcial', fecha: '2025-02-10', hora: '09:00', tipo: 'alumnos', jornada: 'fin_de_semana', descripcion: 'Evaluación primer parcial' }
]

let usuariosMock = [
  { id: 1, codigo: 'DIR001', nombre: 'María González', email: 'director@liceotecpan.edu.gt', password: 'director123', rol: 'director', plan: 'ambos' },
  { id: 2, codigo: 'DOC001', nombre: 'José Román', email: 'jromanv@liceotecpan.edu.gt', password: 'docente123', rol: 'docente', plan: 'ambos' },
  { id: 3, codigo: 'DOC002', nombre: 'Pedro López', email: 'plopez@liceotecpan.edu.gt', password: 'docente123', rol: 'docente', plan: 'diario' },
  { id: 4, codigo: 'DOC003', nombre: 'María García', email: 'mgarcia@liceotecpan.edu.gt', password: 'docente123', rol: 'docente', plan: 'fin_de_semana' },
  { id: 5, codigo: 'ALU001', nombre: 'Carlos Pérez', email: 'alu001@liceotecpan.edu.gt', password: 'alumno123', rol: 'alumno', plan: 'diario' },
  { id: 6, codigo: 'ALU002', nombre: 'Ana Martínez', email: 'alu002@liceotecpan.edu.gt', password: 'alumno123', rol: 'alumno', plan: 'fin_de_semana' }
]

// Simular delay de red
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// ============== FUNCIONES DE ACTIVIDADES ==============

export async function getActividades() {
  await delay(500)
  return [...actividadesMock]
}

export async function crearActividad(actividad) {
  await delay(500)
  const nuevaActividad = {
    ...actividad,
    id: Math.max(...actividadesMock.map(a => a.id), 0) + 1
  }
  actividadesMock.push(nuevaActividad)
  return nuevaActividad
}

export async function actualizarActividad(id, actividad) {
  await delay(500)
  const index = actividadesMock.findIndex(a => a.id === id)
  if (index !== -1) {
    actividadesMock[index] = { ...actividadesMock[index], ...actividad }
    return actividadesMock[index]
  }
  throw new Error('Actividad no encontrada')
}

export async function eliminarActividad(id) {
  await delay(500)
  actividadesMock = actividadesMock.filter(a => a.id !== id)
  return { success: true }
}

// ============== FUNCIONES DE USUARIOS ==============

export async function getUsuarios() {
  await delay(500)
  // No devolver las contraseñas en la lista
  return usuariosMock.map(({ password, ...usuario }) => usuario)
}

export async function crearUsuario(usuario) {
  await delay(500)
  
  // Verificar si el email ya existe
  if (usuariosMock.some(u => u.email === usuario.email)) {
    throw new Error('El correo electrónico ya está registrado')
  }
  
  // Verificar si el código ya existe
  if (usuariosMock.some(u => u.codigo === usuario.codigo)) {
    throw new Error('El código personal ya está registrado')
  }
  
  const nuevoUsuario = {
    ...usuario,
    id: Math.max(...usuariosMock.map(u => u.id), 0) + 1
  }
  usuariosMock.push(nuevoUsuario)
  
  // No devolver la contraseña
  const { password, ...usuarioSinPassword } = nuevoUsuario
  return usuarioSinPassword
}

export async function actualizarUsuario(id, usuario) {
  await delay(500)
  const index = usuariosMock.findIndex(u => u.id === id)
  
  if (index === -1) {
    throw new Error('Usuario no encontrado')
  }
  
  // Verificar si el email ya existe en otro usuario
  if (usuario.email && usuariosMock.some(u => u.id !== id && u.email === usuario.email)) {
    throw new Error('El correo electrónico ya está registrado')
  }
  
  // Verificar si el código ya existe en otro usuario
  if (usuario.codigo && usuariosMock.some(u => u.id !== id && u.codigo === usuario.codigo)) {
    throw new Error('El código personal ya está registrado')
  }
  
  // Si no se proporciona password, mantener el anterior
  const datosActualizar = { ...usuario }
  if (!usuario.password || usuario.password === '') {
    delete datosActualizar.password
  }
  
  usuariosMock[index] = { ...usuariosMock[index], ...datosActualizar }
  
  // No devolver la contraseña
  const { password, ...usuarioSinPassword } = usuariosMock[index]
  return usuarioSinPassword
}

export async function eliminarUsuario(id) {
  await delay(500)
  
  // No permitir eliminar al director principal
  const usuario = usuariosMock.find(u => u.id === id)
  if (usuario && usuario.rol === 'director') {
    throw new Error('No se puede eliminar al director del sistema')
  }
  
  usuariosMock = usuariosMock.filter(u => u.id !== id)
  return { success: true }
}

// ============== FUNCIÓN DE LOGIN ==============

export async function loginUser(email, password, tipoEsperado) {
  await delay(800)
  
  const usuario = usuariosMock.find(
    u => u.email === email && u.password === password
  )

  if (!usuario) {
    throw new Error('Credenciales incorrectas')
  }

  if (usuario.rol !== tipoEsperado) {
    throw new Error(`Este usuario no tiene acceso como ${tipoEsperado}`)
  }

  // No devolver la contraseña
  const { password: _, ...usuarioSinPassword } = usuario
  return usuarioSinPassword
}