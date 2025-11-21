'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import CalendarioMensual from '@/components/CalendarioMensual'
import { getActividades, logout } from '@/lib/api'

export default function DashboardAlumno() {
  const router = useRouter()
  const [userPlan, setUserPlan] = useState('diario')
  const [userName, setUserName] = useState('')
  const [actividades, setActividades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar autenticación
    const isAuth = localStorage.getItem('isAuthenticated')
    const token = localStorage.getItem('authToken')
    
    if (!isAuth || !token) {
      router.push('/login/alumno')
      return
    }

    // Obtener datos del usuario
    const plan = localStorage.getItem('userPlan') || 'diario'
    const nombre = localStorage.getItem('userName') || ''
    
    setUserPlan(plan)
    setUserName(nombre)
    
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
      if (error.message.includes('Token')) {
        handleCerrarSesion()
      } else {
        alert('Error al cargar actividades: ' + error.message)
      }
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
    logout()
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
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg">
              👤 {userName}
            </span>
            <span className="bg-white px-6 py-2 rounded-full font-semibold shadow-md text-indigo-700">
              📚 {getPlanNombre(userPlan)}
            </span>
          </div>
          <button
            onClick={handleCerrarSesion}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-semibold"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Calendario */}
        <CalendarioMensual 
          actividades={actividadesFiltradas}
          userType="alumno"
        />
      </div>
    </div>
  )
}