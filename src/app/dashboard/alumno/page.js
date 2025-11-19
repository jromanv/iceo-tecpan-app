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
  // Verificar autenticación
  const isAuth = localStorage.getItem('isAuthenticated')
  if (!isAuth) {
    router.push('/login/alumno')
    return
  }

  // Obtener datos del usuario
  const plan = localStorage.getItem('userPlan') || 'diario'
  const nombre = localStorage.getItem('userName') || ''
  
  setUserPlan(plan)
  setUserName(nombre) // Ahora mostrará el nombre completo
  
  // Cargar actividades
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

  // Filtrar actividades por jornada del usuario
  const actividadesFiltradas = actividades.filter(act => 
    act.jornada === userPlan || act.jornada === 'ambos'
  )

  const getPlanNombre = (plan) => {
    if (plan === 'diario') return 'Plan Diario'
    if (plan === 'fin_de_semana') return 'Plan Fin de Semana'
    return plan
  }

  const handleCerrarSesion = () => {
    localStorage.removeItem('userPlan')
    localStorage.removeItem('userType')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('isAuthenticated')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Cargando actividades...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header title="Portal de Alumno" userType="Alumno" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Información del usuario */}
        <div className="mb-4 flex justify-center items-center gap-3">
          <span className="bg-white text-gray-700 px-4 py-2 rounded-full font-semibold shadow">
            👤 {userName}
          </span>
          <span className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg">
            {getPlanNombre(userPlan)}
          </span>
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Calendario de Actividades
          </h2>
          <p className="text-gray-600">
            Consulta las actividades de tu plan educativo
          </p>
        </div>

        <CalendarioMensual actividades={actividadesFiltradas} userType="alumno" />

        {/* Próximas actividades */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Próximas Actividades</h3>
          {actividadesFiltradas
            .filter(act => {
              const fechaAct = new Date(act.fecha + 'T00:00:00')
              const hoy = new Date()
              hoy.setHours(0, 0, 0, 0)
              return fechaAct >= hoy && (act.tipo === 'todos' || act.tipo === 'alumnos')
            })
            .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
            .slice(0, 5)
            .length === 0 ? (
            <p className="text-center text-gray-500 py-4">No hay actividades próximas</p>
          ) : (
            <div className="space-y-3">
              {actividadesFiltradas
                .filter(act => {
                  const fechaAct = new Date(act.fecha + 'T00:00:00')
                  const hoy = new Date()
                  hoy.setHours(0, 0, 0, 0)
                  return fechaAct >= hoy && (act.tipo === 'todos' || act.tipo === 'alumnos')
                })
                .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                .slice(0, 5)
                .map((act) => (
                  <div key={act.id} className="flex items-center p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{act.titulo}</p>
                      <p className="text-sm text-gray-600">
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

        {/* Estadísticas rápidas */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {actividadesFiltradas.length}
            </div>
            <div className="text-sm text-gray-600">Total Actividades</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {actividadesFiltradas.filter(act => {
                const fechaAct = new Date(act.fecha + 'T00:00:00')
                const hoy = new Date()
                hoy.setHours(0, 0, 0, 0)
                return fechaAct >= hoy
              }).length}
            </div>
            <div className="text-sm text-gray-600">Próximas</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {actividadesFiltradas.filter(act => act.tipo === 'alumnos').length}
            </div>
            <div className="text-sm text-gray-600">Solo para Alumnos</div>
          </div>
        </div>

        {/* Botón de cerrar sesión */}
        <div className="mt-8 text-center">
          <button 
            onClick={handleCerrarSesion}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold shadow-lg"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}