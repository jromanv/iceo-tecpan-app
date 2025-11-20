'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import CalendarioMensual from '@/components/CalendarioMensual'
import { getActividades } from '@/lib/supabaseClient'

export default function DashboardAlumno() {
  const router = useRouter()
  const [userPlan, setUserPlan] = useState('diario')
  const [userName, setUserName] = useState('')
  const [actividades, setActividades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated')
    if (!isAuth) {
      router.push('/login/alumno')
      return
    }

    const plan = localStorage.getItem('userPlan') || 'diario'
    const nombre = localStorage.getItem('userName') || ''
    
    setUserPlan(plan)
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

  const handleCerrarSesion = () => {
    localStorage.clear()
    router.push('/')
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

  const actividadesProximas = obtenerActividadesProximas()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header title="Portal de Alumno" userType="Alumno" />
      
      <div className="container mx-auto px-4 py-6">
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

        {/* Botón cerrar sesión */}
        <div className="mt-6 text-center">
          <button 
            onClick={handleCerrarSesion}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition font-semibold shadow-lg"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}