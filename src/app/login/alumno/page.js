'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { loginUser } from '@/lib/supabaseClient'

export default function LoginAlumno() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Hacer login y obtener datos del usuario desde la BD
      const usuario = await loginUser(formData.email, formData.password, 'alumno')
      
      // Guardar datos en localStorage
      localStorage.setItem('userEmail', usuario.email)
      localStorage.setItem('userPlan', usuario.plan) // Plan viene de la BD
      localStorage.setItem('userName', usuario.nombre)
      localStorage.setItem('userType', 'alumno')
      localStorage.setItem('isAuthenticated', 'true')
      
      // Redirigir al dashboard
      router.push('/dashboard/alumno')
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header title="Acceso Alumnos" />
      
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
            <p className="text-gray-600">Portal de Alumnos</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico *
              </label>
              <input
                type="email"
                placeholder="alumno@liceotecpan.edu.gt"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña *
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-indigo-600 hover:underline">
              ← Volver al inicio
            </a>
          </div>

          {/* Datos de prueba */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 font-semibold mb-2">Datos de prueba:</p>
            <p className="text-xs text-gray-600">📚 Plan Diario: alu001@liceotecpan.edu.gt</p>
            <p className="text-xs text-gray-600">📅 Fin de Semana: alu002@liceotecpan.edu.gt</p>
            <p className="text-xs text-gray-600">🔑 Contraseña: alumno123</p>
            <p className="text-xs text-indigo-600 mt-2 italic">* El plan se detecta automáticamente</p>
          </div>
        </div>
      </div>
    </div>
  )
}