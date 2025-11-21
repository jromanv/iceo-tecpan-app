'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import CalendarioMensual from '@/components/CalendarioMensual'
import { getActividades } from '@/lib/supabaseClient'

export default function DashboardAlumno() {
  const router = useRouter()
  const [userPlan, setUserPlan] = useState('diario')
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [actividades, setActividades] = useState([])
  const [loading, setLoading] = useState(true)
  const [seccionActiva, setSeccionActiva] = useState('calendario')

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated')
    if (!isAuth) {
      router.push('/login/alumno')
      return
    }

    const plan = localStorage.getItem('userPlan') || 'diario'
    const nombre = localStorage.getItem('userName') || ''
    const email = localStorage.getItem('userEmail') || ''
    
    setUserPlan(plan)
    setUserName(nombre)
    setUserEmail(email)

    cargarActividades()
  }, [router])

  const cargarActividades = async () => {
    try {
      setLoading(true)
      const data = await getActividades()
      setActividades(data)
    } catch (error) {
      console.error('Error al cargar actividades:', error)
    } finally {
      setLoading(false)
    }
  }

  const actividadesFiltradas = actividades.filter(act => {
    const esParaMi = act.tipo === 'todos' || act.tipo === 'alumnos'
    return esParaMi && (act.jornada === userPlan || act.jornada === 'ambos')
  })

  const getPlanNombre = (plan) => {
    if (plan === 'diario') return 'Plan Diario'
    if (plan === 'fin_de_semana') return 'Plan Fin de Semana'
    return plan
  }

  const obtenerActividadesProximas = () => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    
    const enSieteDias = new Date(hoy)
    enSieteDias.setDate(enSieteDias.getDate() + 7)

    return actividadesFiltradas
      .filter(act => {
        const fechaAct = new Date(act.fecha + 'T00:00:00')
        return fechaAct >= hoy && fechaAct <= enSieteDias
      })
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
  }

  const obtenerDiasRestantes = (fecha) => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const fechaAct = new Date(fecha + 'T00:00:00')
    const diferencia = Math.ceil((fechaAct - hoy) / (1000 * 60 * 60 * 24))
    return diferencia
  }

  const getColorAlerta = (dias) => {
    if (dias === 0) return 'bg-red-100 border-red-500 text-red-800'
    if (dias === 1) return 'bg-orange-100 border-orange-500 text-orange-800'
    if (dias <= 3) return 'bg-yellow-100 border-yellow-500 text-yellow-800'
    return 'bg-blue-100 border-blue-500 text-blue-800'
  }

  const getTextoAlerta = (dias) => {
    if (dias === 0) return 'HOY'
    if (dias === 1) return 'MAÑANA'
    return `EN ${dias} DÍAS`
  }

  const renderContenido = () => {
    switch(seccionActiva) {
      case 'calendario':
        return renderCalendario()
      case 'horario':
        return renderProximamente('Mi Horario')
      case 'perfil':
        return renderPerfil()
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

  const renderPerfil = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h2>
      
      <div className="space-y-6">
        {/* Información personal */}
        <div className="border-2 border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Información Personal</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo</label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                {userName}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico</label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                {userEmail}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Plan de Estudios</label>
              <div className="px-4 py-3 bg-blue-50 rounded-lg border border-blue-200 text-blue-800 font-semibold">
                {getPlanNombre(userPlan)}
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="border-2 border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Estadísticas</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{actividadesFiltradas.length}</div>
              <div className="text-sm text-gray-600 mt-1">Actividades Totales</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {actividadesFiltradas.filter(act => {
                  const fechaAct = new Date(act.fecha + 'T00:00:00')
                  const hoy = new Date()
                  hoy.setHours(0, 0, 0, 0)
                  return fechaAct >= hoy
                }).length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Próximas</div>
            </div>
          </div>
        </div>

        {/* Nota */}
        <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Nota</h3>
          <p className="text-sm text-gray-600">
            Para actualizar tu información personal o cambiar tu contraseña, contacta con la administración del centro educativo.
          </p>
        </div>
      </div>
    </div>
  )

  const renderCalendario = () => {
    const actividadesProximas = obtenerActividadesProximas()

    return (
      <>
        {/* Bienvenida compacta */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-4 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Bienvenido/a, {userName}</h2>
              <p className="text-sm text-gray-600">Calendario de actividades - {getPlanNombre(userPlan)}</p>
            </div>
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold text-sm border border-blue-200">
              {getPlanNombre(userPlan)}
            </span>
          </div>
        </div>

        {/* Alertas de actividades próximas */}
        {actividadesProximas.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-4 mb-4 border-l-4 border-yellow-500">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="font-bold text-gray-800">Actividades Próximas</h3>
            </div>
            <div className="space-y-2">
              {actividadesProximas.map((act) => {
                const diasRestantes = obtenerDiasRestantes(act.fecha)
                return (
                  <div
                    key={act.id}
                    className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${getColorAlerta(diasRestantes)}`}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{act.titulo}</p>
                      <p className="text-xs opacity-75">
                        {new Date(act.fecha + 'T00:00:00').toLocaleDateString('es-GT', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })} - {act.hora}
                      </p>
                    </div>
                    <span className="font-bold text-xs px-3 py-1 rounded-full bg-white/50">
                      {getTextoAlerta(diasRestantes)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Calendario */}
        <CalendarioMensual actividades={actividadesFiltradas} userType="alumno" />

        {/* Próximas actividades (lista completa) */}
        <div className="mt-4 bg-white rounded-xl shadow-lg p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Todas las Actividades Próximas</h3>
          {actividadesFiltradas
            .filter(act => {
              const fechaAct = new Date(act.fecha + 'T00:00:00')
              const hoy = new Date()
              hoy.setHours(0, 0, 0, 0)
              return fechaAct >= hoy
            })
            .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
            .slice(0, 5)
            .length === 0 ? (
            <p className="text-center text-gray-500 py-4">No hay actividades próximas</p>
          ) : (
            <div className="space-y-2">
              {actividadesFiltradas
                .filter(act => {
                  const fechaAct = new Date(act.fecha + 'T00:00:00')
                  const hoy = new Date()
                  hoy.setHours(0, 0, 0, 0)
                  return fechaAct >= hoy
                })
                .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                .slice(0, 5)
                .map((act) => (
                  <div key={act.id} className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition border border-blue-200">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-sm">{act.titulo}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(act.fecha + 'T00:00:00').toLocaleDateString('es-GT', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })} - {act.hora}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Cargando actividades...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header title="Portal de Alumno" userType="Alumno" />
      
      <div className="flex">
        <Sidebar 
          userType="alumno" 
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