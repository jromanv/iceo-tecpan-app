'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { getActividades, crearActividad, actualizarActividad, eliminarActividad } from '@/lib/supabaseClient'

export default function DashboardDirector() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [actividades, setActividades] = useState([])
  const [loading, setLoading] = useState(true)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [actividadEditando, setActividadEditando] = useState(null)
  const [jornadaVista, setJornadaVista] = useState('ambos')
  const [guardando, setGuardando] = useState(false)
  
  const [formData, setFormData] = useState({
    titulo: '',
    fecha: '',
    hora: '',
    tipo: 'todos',
    jornada: 'ambos',
    descripcion: ''
  })

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated')
    if (!isAuth) {
      router.push('/login/director')
      return
    }

    const nombre = localStorage.getItem('userName') || ''
    setUserName(nombre)

    cargarActividades()
  }, [router])

  const cargarActividades = async () => {
    try {
      setLoading(true)
      const data = await getActividades()
      setActividades(data)
    } catch (error) {
      console.error('Error al cargar actividades:', error)
      alert('Error al cargar actividades')
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

  const handleCerrarSesion = () => {
    localStorage.clear()
    router.push('/')
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
      
      <div className="container mx-auto px-4 py-6">
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

        {/* Botón cerrar sesión */}
        <div className="mt-8 text-center">
          <button 
            onClick={handleCerrarSesion}
            className="bg-[#570020] text-white px-8 py-3 rounded-xl hover:bg-[#6d0028] transition font-semibold shadow-lg"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}