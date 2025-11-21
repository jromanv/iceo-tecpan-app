import { supabase } from './supabase'

// ================================================
// FUNCIONES DE AUTENTICACIÓN
// ================================================

/**
 * Función de login - Autentica al usuario y verifica su rol
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña en texto plano
 * @param {string} userType - Tipo de usuario esperado (director/docente/alumno)
 * @returns {Object} Datos del usuario autenticado
 */
export async function loginUser(email, password, userType) {
  try {
    console.log('🔐 Intentando login:', email, userType)
    
    // 1. Buscar el usuario en la base de datos por email
    const { data: usuario, error: dbError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single()

    if (dbError || !usuario) {
      console.error('❌ Usuario no encontrado:', dbError)
      throw new Error('Credenciales incorrectas')
    }

    console.log('✅ Usuario encontrado:', usuario.nombre)

    // 2. Verificar que el rol coincida
    if (usuario.rol !== userType) {
      console.error('❌ Rol incorrecto. Esperado:', userType, 'Recibido:', usuario.rol)
      throw new Error('No tienes permisos para acceder a este portal')
    }

    // 3. Verificar la contraseña usando pgcrypto de PostgreSQL
    const { data: passwordCheck, error: passwordError } = await supabase
      .rpc('verify_password', {
        user_email: email,
        user_password: password
      })

    if (passwordError) {
      console.error('❌ Error al verificar contraseña:', passwordError)
      throw new Error('Credenciales incorrectas')
    }

    if (!passwordCheck) {
      console.error('❌ Contraseña incorrecta')
      throw new Error('Credenciales incorrectas')
    }

    console.log('✅ Login exitoso para:', usuario.nombre)

    // 4. Retornar los datos del usuario (sin el hash de contraseña)
    return {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol,
      plan: usuario.plan
    }

  } catch (error) {
    console.error('❌ Error en login:', error)
    throw error
  }
}

// ================================================
// FUNCIONES PARA ACTIVIDADES
// ================================================

/**
 * Obtener todas las actividades
 * @returns {Array} Lista de actividades ordenadas por fecha
 */
export async function getActividades() {
  try {
    console.log('📅 Obteniendo actividades...')
    
    const { data, error } = await supabase
      .from('actividades')
      .select('*')
      .order('fecha', { ascending: true })
      .order('hora', { ascending: true })

    if (error) {
      console.error('❌ Error al obtener actividades:', error)
      throw new Error('Error al cargar las actividades')
    }

    console.log('✅ Actividades obtenidas:', data?.length || 0)
    return data || []
  } catch (error) {
    console.error('❌ Error en getActividades:', error)
    throw error
  }
}

/**
 * Crear una nueva actividad
 * @param {Object} actividadData - Datos de la actividad
 * @returns {Object} Actividad creada
 */
export async function crearActividad(actividadData) {
  try {
    console.log('➕ Creando actividad:', actividadData.titulo)
    
    const { data, error } = await supabase
      .from('actividades')
      .insert([
        {
          titulo: actividadData.titulo,
          fecha: actividadData.fecha,
          hora: actividadData.hora,
          tipo: actividadData.tipo,
          jornada: actividadData.jornada,
          descripcion: actividadData.descripcion || ''
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('❌ Error al crear actividad:', error)
      throw new Error('Error al crear la actividad')
    }

    console.log('✅ Actividad creada:', data.id)
    return data
  } catch (error) {
    console.error('❌ Error en crearActividad:', error)
    throw error
  }
}

/**
 * Actualizar una actividad existente
 * @param {string} id - ID de la actividad
 * @param {Object} actividadData - Nuevos datos de la actividad
 * @returns {Object} Actividad actualizada
 */
export async function actualizarActividad(id, actividadData) {
  try {
    console.log('✏️ Actualizando actividad:', id)
    
    const { data, error } = await supabase
      .from('actividades')
      .update({
        titulo: actividadData.titulo,
        fecha: actividadData.fecha,
        hora: actividadData.hora,
        tipo: actividadData.tipo,
        jornada: actividadData.jornada,
        descripcion: actividadData.descripcion || ''
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('❌ Error al actualizar actividad:', error)
      throw new Error('Error al actualizar la actividad')
    }

    console.log('✅ Actividad actualizada:', data.id)
    return data
  } catch (error) {
    console.error('❌ Error en actualizarActividad:', error)
    throw error
  }
}

/**
 * Eliminar una actividad
 * @param {string} id - ID de la actividad a eliminar
 * @returns {boolean} true si se eliminó correctamente
 */
export async function eliminarActividad(id) {
  try {
    console.log('🗑️ Eliminando actividad:', id)
    
    const { error } = await supabase
      .from('actividades')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('❌ Error al eliminar actividad:', error)
      throw new Error('Error al eliminar la actividad')
    }

    console.log('✅ Actividad eliminada:', id)
    return true
  } catch (error) {
    console.error('❌ Error en eliminarActividad:', error)
    throw error
  }
}

// ================================================
// FUNCIONES PARA USUARIOS (PARA USO FUTURO)
// ================================================

/**
 * Obtener todos los usuarios (solo para directores)
 * @returns {Array} Lista de usuarios
 */
export async function getUsuarios() {
  try {
    console.log('👥 Obteniendo usuarios...')
    
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, email, nombre, rol, plan, created_at')
      .order('nombre', { ascending: true })

    if (error) {
      console.error('❌ Error al obtener usuarios:', error)
      throw new Error('Error al cargar los usuarios')
    }

    console.log('✅ Usuarios obtenidos:', data?.length || 0)
    return data || []
  } catch (error) {
    console.error('❌ Error en getUsuarios:', error)
    throw error
  }
}

/**
 * Crear un nuevo usuario (para registro futuro)
 * @param {Object} userData - Datos del usuario
 * @returns {Object} Usuario creado
 */
export async function crearUsuario(userData) {
  try {
    console.log('➕ Creando usuario:', userData.email)
    
    // Verificar que la función verify_password existe antes de crear usuario
    // porque usaremos la misma lógica para hashear
    const { data, error } = await supabase
      .rpc('create_user_with_password', {
        user_email: userData.email,
        user_password: userData.password,
        user_nombre: userData.nombre,
        user_rol: userData.rol,
        user_plan: userData.plan
      })

    if (error) {
      console.error('❌ Error al crear usuario:', error)
      throw new Error('Error al crear el usuario')
    }

    console.log('✅ Usuario creado:', data)
    return data
  } catch (error) {
    console.error('❌ Error en crearUsuario:', error)
    throw error
  }
}