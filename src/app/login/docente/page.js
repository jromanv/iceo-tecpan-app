'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { loginUser } from '@/lib/supabaseClient'

export default function LoginDocente() {
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
      const usuario = await loginUser(formData.email, formData.password, 'docente')
      
      // Guardar datos en localStorage
      localStorage.setItem('userEmail', usuario.email)
      localStorage.setItem('userPlan', usuario.plan) // Plan viene de la BD (diario/fin_de_semana/ambos)
      localStorage.setItem('userName', usuario.nombre)
      localStorage.setItem('userType', 'docente')
      localStorage.setItem('isAuthenticated', 'true')
      
      // Redirigir al dashboard
      router.push('/dashboard/docente')
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header title="Acceso Docentes" />
      
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
            <p className="text-gray-600">Portal de Docentes</p>
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
                placeholder="docente@liceotecpan.edu.gt"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-green-600 hover:underline">
              ← Volver al inicio
            </a>
          </div>

          {/* Datos de prueba */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 font-semibold mb-2">Datos de prueba:</p>
            <p className="text-xs text-gray-600">🔄 Ambas: jromanv@liceotecpan.edu.gt</p>
            <p className="text-xs text-gray-600">📚 Diario: plopez@liceotecpan.edu.gt</p>
            <p className="text-xs text-gray-600">📅 Fin de Semana: mgarcia@liceotecpan.edu.gt</p>
            <p className="text-xs text-gray-600">🔑 Contraseña: docente123</p>
            <p className="text-xs text-green-600 mt-2 italic">* La jornada se detecta automáticamente</p>
          </div>
        </div>
      </div>
    </div>
  )
}