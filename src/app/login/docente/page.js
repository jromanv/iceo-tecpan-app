'use client'
import { useState } from 'react'
import { loginUser } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { loginUser } from '@/lib/api'

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
    // Hacer login con el backend
    const usuario = await loginUser(formData.email, formData.password, 'docente')
    
    // Guardar datos en localStorage
    localStorage.setItem('userEmail', usuario.email)
    localStorage.setItem('userPlan', usuario.plan)
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header title="Acceso para Docentes" />
      
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Portal de Docente</h2>
            <p className="text-gray-600 mt-2">Ingresa con tus credenciales institucionales</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Correo Institucional
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="docente@liceotecpan.edu.gt"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-green-600 hover:text-green-700 font-semibold">
              ← Volver al inicio
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}