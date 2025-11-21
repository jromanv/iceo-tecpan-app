'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { getActividades, crearActividad, actualizarActividad, eliminarActividad, getUsuarios, crearUsuario } from '@/lib/supabaseClient'

export default function DashboardDirector() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [actividades, setActividades] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [actividadEditando, setActividadEditando] = useState(null)
  const [jornadaVista, setJornadaVista] = useState('ambos')
  const [guardando, setGuardando] = useState(false)
  const [seccionActiva, setSeccionActiva] = useState('calendario')
  
  // Estados para usuarios
  const [mostrarFormularioUsuario, setMostrarFormularioUsuario] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [filtroRol, setFiltroRol] = useState('todos')
  const [filtroPlan, setFiltroPlan] = useState('todos')
  
  const [formData, setFormData] = useState({
    titulo: '',
    fecha: '',
    hora: '',
    tipo: 'todos',
    jornada: 'ambos',
    descripcion: ''
  })

  const [formUsuario, setFormUsuario] = useState({
    codigo: '',
    nombre: '',
    email: '',
    password: '',
    rol: 'alumno',
    plan: 'diario'
  })

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated')
    if (!isAuth) {
      router.push('/login/director')
      return
    }

    const nombre = localStorage.getItem('userName') || ''
    setUserName(nombre)

    cargarDatos()
  }, [router])

  const cargarDatos = async () => {
    setLoading(true)
    try {
      console.log('🔄 Iniciando carga de datos...')
      
      // Cargar actividades
      try {
        const dataActividades = await getActividades()
        console.log('✅ Actividades cargadas:', dataActividades)
        setActividades(dataActividades)
      } catch (error) {
        console.error('❌ Error al cargar actividades:', error)
        alert('Error al cargar las actividades. Por favor revisa la consola.')
      }

      // Cargar usuarios (independiente)
      try {
        const dataUsuarios = await getUsuarios()
        console.log('✅ Usuarios cargados:', dataUsuarios)
        setUsuarios(dataUsuarios)
      } catch (error) {
        console.error('❌ Error al cargar usuarios:', error)
      }

    } catch (error) {
      console.error('Error general al cargar datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    
    try {
      if (actividadEditando) {
        await actualizarActividad(actividadEditando.id, formData)
        setActividades(actividades.map(act => 
          act.id === actividadEditando.id 
            ? { ...formData, id: act.id }
            : act
        ))
        alert('Actividad actualizada correctamente')
      } else {
        const nuevaActividad = await crearActividad(formData)
        setActividades([...actividades, nuevaActividad])
        alert('Actividad creada correctamente')
      }
      
      setFormData({
        titulo: '',
        fecha: '',
        hora: '',
        tipo: 'todos',
        jornada: 'ambos',
        descripcion: ''
      })
      setMostrarFormulario(false)
      setActividadEditando(null)
    } catch (error) {
      console.error('Error al guardar actividad:', error)
      alert('Error al guardar la actividad')
    } finally {
      setGuardando(false)
    }
  }

  const handleSubmitUsuario = async (e) => {
    e.preventDefault()
    setGuardando(true)
    
    try {
      if (usuarioEditando) {
        // await actualizarUsuario(usuarioEditando.id, formUsuario)
        alert('Función de actualizar usuario pendiente de implementar')
      } else {
        const nuevoUsuario = await crearUsuario(formUsuario)
        setUsuarios([...usuarios, nuevoUsuario])
        alert('Usuario creado correctamente')
      }
      
      setFormUsuario({
        codigo: '',
        nombre: '',
        email: '',
        password: '',
        rol: 'alumno',
        plan: 'diario'
      })
      setMostrarFormularioUsuario(false)
      setUsuarioEditando(null)
    } catch (error) {
      console.error('Error al guardar usuario:', error)
      alert('Error al guardar el usuario')
    } finally {
      setGuardando(false)
    }
  }

  const handleEditar = (actividad) => {
    setFormData({
      titulo: actividad.titulo,
      fecha: actividad.fecha,
      hora: actividad.hora,
      tipo: actividad.tipo,
      jornada: actividad.jornada,
      descripcion: actividad.descripcion || ''
    })
    setActividadEditando(actividad)
    setMostrarFormulario(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEditarUsuario = (usuario) => {
    setFormUsuario({
      codigo: usuario.codigo,
      nombre: usuario.nombre,
      email: usuario.email,
      password: '',
      rol: usuario.rol,
      plan: usuario.plan
    })
    setUsuarioEditando(usuario)
    setMostrarFormularioUsuario(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta actividad?')) return
    
    try {
      await eliminarActividad(id)
      setActividades(actividades.filter(act => act.id !== id))
      alert('Actividad eliminada correctamente')
    } catch (error) {
      console.error('Error al eliminar actividad:', error)
      alert('Error al eliminar la actividad')
    }
  }

  const handleEliminarUsuario = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return
    
    try {
      // await eliminarUsuario(id)
      alert('Función de eliminar usuario pendiente de implementar')
      // setUsuarios(usuarios.filter(user => user.id !== id))
      // alert('Usuario eliminado correctamente')
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      alert('Error al eliminar el usuario')
    }
  }

  const getTipoColor = (tipo) => {
    switch(tipo) {
      case 'todos': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'docentes': return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'alumnos': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getJornadaColor = (jornada) => {
    switch(jornada) {
      case 'diario': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'fin_de_semana': return 'bg-cyan-100 text-cyan-800 border-cyan-200'
      case 'ambos': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTipoTexto = (tipo) => {
    switch(tipo) {
      case 'todos': return 'Todos'
      case 'docentes': return 'Docentes'
      case 'alumnos': return 'Alumnos'
      default: return tipo
    }
  }

  const getJornadaTexto = (jornada) => {
    switch(jornada) {
      case 'diario': return 'Plan Diario'
      case 'fin_de_semana': return 'Fin de Semana'
      case 'ambos': return 'Ambas Jornadas'
      default: return jornada
    }
  }

  const actividadesFiltradas = jornadaVista === 'ambos' 
    ? actividades 
    : actividades.filter(act => act.jornada === jornadaVista || act.jornada === 'ambos')

  const usuariosFiltrados = usuarios.filter(user => {
    const cumpleRol = filtroRol === 'todos' || user.rol === filtroRol
    const cumplePlan = filtroPlan === 'todos' || user.plan === filtroPlan
    return cumpleRol && cumplePlan
  })

  const renderContenido = () => {
    switch(seccionActiva) {
      case 'calendario':
        return renderCalendario()
      case 'usuarios':
        return renderUsuarios()
      case 'horarios':
        return renderProximamente('Horarios')
      case 'configuracion':
        return renderConfiguracion()
      default:
        return renderProximamente('Esta sección')
    }
  }

  const renderProximamente = (titulo) => (
    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
      <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{titulo}</h3>
      <p className="text-gray-600">Esta funcionalidad estará disponible próximamente</p>
    </div>
  )

  const renderConfiguracion = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Configuración del Sistema</h2>
      
      <div className="space-y-6">
        {/* Información del sistema */}
        <div className="border-2 border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Información General</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Nombre de la institución:</span>
              <span className="font-semibold">Liceo Tecpán</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Versión del sistema:</span>
              <span className="font-semibold">1.0 - Beta</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total de usuarios:</span>
              <span className="font-semibold">{usuarios.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total de actividades:</span>
              <span className="font-semibold">{actividades.length}</span>
            </div>
          </div>
        </div>

        {/* Configuración de notificaciones */}
        <div className="border-2 border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Notificaciones</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5 rounded text-[#570020]" defaultChecked />
              <span className="text-sm">Alertas de actividades próximas (7 días antes)</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-5 h-5 rounded text-[#570020]" defaultChecked />
              <span className="text-sm">Notificar creación de nuevas actividades</span>
            </label>
          </div>
        </div>

        {/* Información de soporte */}
        <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Soporte Técnico</h3>
          <p className="text-sm text-gray-600 mb-3">
            Para reportar problemas o solicitar nuevas funcionalidades, contacta al administrador del sistema.
          </p>
          <button className="bg-[#570020] text-white px-6 py-2 rounded-lg hover:bg-[#6d0028] transition text-sm font-semibold">
            Contactar Soporte
          </button>
        </div>
      </div>
    </div>
  )

  const renderUsuarios = () => (
    <>
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 border-l-4 border-[#570020]">
        <h2 className="text-lg font-bold text-gray-800">Gestión de Usuarios</h2>
        <p className="text-sm text-gray-600">Administra docentes y alumnos del sistema</p>
      </div>

      {/* Filtros y botón crear */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex gap-2">
          <select
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#570020] focus:border-transparent"
          >
            <option value="todos">Todos los roles</option>
            <option value="docente">Docentes</option>
            <option value="alumno">Alumnos</option>
          </select>

          <select
            value={filtroPlan}
            onChange={(e) => setFiltroPlan(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#570020] focus:border-transparent"
          >
            <option value="todos">Todos los planes</option>
            <option value="diario">Plan Diario</option>
            <option value="fin_de_semana">Fin de Semana</option>
            <option value="ambos">Ambos</option>
          </select>
        </div>

        <button
          onClick={() => {
            setMostrarFormularioUsuario(!mostrarFormularioUsuario)
            setUsuarioEditando(null)
            setFormUsuario({
              codigo: '',
              nombre: '',
              email: '',
              password: '',
              rol: 'alumno',
              plan: 'diario'
            })
          }}
          className="bg-[#570020] text-white px-6 py-3 rounded-xl hover:bg-[#6d0028] transition font-semibold flex items-center gap-2 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Usuario
        </button>
      </div>

      {/* Formulario de usuario */}
      {mostrarFormularioUsuario && (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-[#570020]">
          <h3 className="text-xl font-bold text-[#570020] mb-6">
            {usuarioEditando ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h3>
          
          <form onSubmit={handleSubmitUsuario} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Código Personal *
                </label>
                <input
                  type="text"
                  value={formUsuario.codigo}
                  onChange={(e) => setFormUsuario({...formUsuario, codigo: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#570020] focus:border-transparent transition"
                  placeholder="Ej: DOC001 o ALU001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={formUsuario.nombre}
                  onChange={(e) => setFormUsuario({...formUsuario, nombre: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#570020] focus:border-transparent transition"
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  value={formUsuario.email}
                  onChange={(e) => setFormUsuario({...formUsuario, email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#570020] focus:border-transparent transition"
                  placeholder="usuario@liceotecpan.edu.gt"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contraseña {usuarioEditando && '(Dejar vacío para mantener)'}
                </label>
                <input
                  type="password"
                  value={formUsuario.password}
                  onChange={(e) => setFormUsuario({...formUsuario, password: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#570020] focus:border-transparent transition"
                  placeholder="••••••••"
                  required={!usuarioEditando}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rol *
                </label>
                <select
                  value={formUsuario.rol}
                  onChange={(e) => setFormUsuario({...formUsuario, rol: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#570020] focus:border-transparent transition"
                  required
                >
                  <option value="alumno">Alumno</option>
                  <option value="docente">Docente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Plan / Jornada *
                </label>
                <select
                  value={formUsuario.plan}
                  onChange={(e) => setFormUsuario({...formUsuario, plan: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#570020] focus:border-transparent transition"
                  required
                >
                  <option value="diario">Plan Diario</option>
                  <option value="fin_de_semana">Fin de Semana</option>
                  <option value="ambos">Ambos (solo docentes)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={guardando}
                className="bg-[#570020] text-white px-8 py-3 rounded-xl hover:bg-[#6d0028] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {guardando ? 'Guardando...' : (usuarioEditando ? 'Guardar Cambios' : 'Crear Usuario')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMostrarFormularioUsuario(false)
                  setUsuarioEditando(null)
                }}
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-300 transition font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#570020] text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Código</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Correo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Rol</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Plan</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No hay usuarios registrados con estos filtros
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-mono">{usuario.codigo}</td>
                    <td className="px-6 py-4 text-sm font-semibold">{usuario.nombre}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{usuario.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        usuario.rol === 'docente' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {usuario.rol === 'docente' ? 'Docente' : 'Alumno'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getJornadaColor(usuario.plan)}`}>
                        {getJornadaTexto(usuario.plan)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditarUsuario(usuario)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Editar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => handleEliminarUsuario(usuario.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Eliminar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )

 const renderCalendario = () => (
  <>
    {/* Bienvenida compacta */}
    <div className="bg-white rounded-xl shadow-md p-4 mb-6 border-l-4 border-[#570020]">
      <h2 className="text-lg font-bold text-gray-800">Bienvenido/a, {userName}</h2>
      <p className="text-sm text-gray-600">Gestión de actividades escolares</p>
    </div>

    {/* Filtros y botón crear */}
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
      <div className="bg-white rounded-xl shadow-md p-2 inline-flex gap-2">
        <button
          onClick={() => setJornadaVista('ambos')}
          className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
            jornadaVista === 'ambos'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Ver Ambos
        </button>
        <button
          onClick={() => setJornadaVista('diario')}
          className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
            jornadaVista === 'diario'
              ? 'bg-orange-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Plan Diario
        </button>
        <button
          onClick={() => setJornadaVista('fin_de_semana')}
          className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
            jornadaVista === 'fin_de_semana'
              ? 'bg-cyan-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Fin de Semana
        </button>
      </div>

      <button
        onClick={() => {
          setMostrarFormulario(!mostrarFormulario)
          setActividadEditando(null)
          setFormData({
            titulo: '',
            fecha: '',
            hora: '',
            tipo: 'todos',
            jornada: 'ambos',
            descripcion: ''
          })
        }}
        className="bg-[#570020] text-white px-6 py-3 rounded-xl hover:bg-[#6d0028] transition font-semibold flex items-center gap-2 shadow-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Nueva Actividad
      </button>
    </div>

    {/* Formulario */}
    {mostrarFormulario && (
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border-2 border-[#570020]">
        <h3 className="text-xl font-bold text-[#570020] mb-6">
          {actividadEditando ? 'Editar Actividad' : 'Nueva Actividad'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título de la Actividad *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#570020] focus:border-transparent transition"
                placeholder="Ej: Inicio de Clases"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Para quién es *
              </label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#570020] focus:border-transparent transition"
                required
              >
                <option value="todos">Para Todos</option>
                <option value="docentes">Solo Docentes</option>
                <option value="alumnos">Solo Alumnos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Jornada / Plan *
              </label>
              <select
                value={formData.jornada}
                onChange={(e) => setFormData({...formData, jornada: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#570020] focus:border-transparent transition"
                required
              >
                <option value="ambos">Ambas Jornadas</option>
                <option value="diario">Solo Plan Diario</option>
                <option value="fin_de_semana">Solo Fin de Semana</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fecha *
              </label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#570020] focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hora *
              </label>
              <input
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({...formData, hora: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#570020] focus:border-transparent transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#570020] focus:border-transparent transition"
              rows="3"
              placeholder="Descripción opcional de la actividad"
            ></textarea>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={guardando}
              className="bg-[#570020] text-white px-8 py-3 rounded-xl hover:bg-[#6d0028] transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {guardando ? 'Guardando...' : (actividadEditando ? 'Guardar Cambios' : 'Crear Actividad')}
            </button>
            <button
              type="button"
              onClick={() => {
                setMostrarFormulario(false)
                setActividadEditando(null)
              }}
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-300 transition font-semibold"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    )}

    {/* Lista de actividades */}
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">
        Actividades Registradas ({actividadesFiltradas.length})
      </h3>
      
      {actividadesFiltradas.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-500 font-medium">No hay actividades registradas para esta jornada</p>
        </div>
      ) : (
        <div className="space-y-4">
          {actividadesFiltradas
            .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
            .map((actividad) => (
            <div key={actividad.id} className="border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg transition hover:border-[#570020]">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h4 className="text-lg font-bold text-gray-800">{actividad.titulo}</h4>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${getTipoColor(actividad.tipo)}`}>
                      {getTipoTexto(actividad.tipo)}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${getJornadaColor(actividad.jornada)}`}>
                      {getJornadaTexto(actividad.jornada)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(actividad.fecha + 'T00:00:00').toLocaleDateString('es-GT', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {actividad.hora}
                    </span>
                  </div>
                  
                  {actividad.descripcion && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{actividad.descripcion}</p>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEditar(actividad)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Editar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => handleEliminar(actividad.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Eliminar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </>
)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#570020] mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Cargando panel de director...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Panel de Director" userType="Director" />
      
      <div className="flex">
        <Sidebar 
          userType="director" 
          activeSection={seccionActiva}
          onSectionChange={setSeccionActiva}
        />
        
        <main className="flex-1 p-6 pt-20">
          {renderContenido()}
        </main>
      </div>
    </div>
  )
}