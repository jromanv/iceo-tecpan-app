import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header elegante */}
      <div className="bg-[#570020] text-white py-6 shadow-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4">
            {/* Logo */}
            <img 
              src="/logo-liceo.png" 
              alt="Liceo Tecpán" 
              className="w-16 h-16 md:w-20 md:h-20 object-contain bg-white rounded-full p-2"
            />
            <div className="text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold">Liceo Tecpán</h1>
              <p className="text-sm md:text-base text-gray-200">Sistema de Gestión Educativa</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-12 md:py-20 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full">
          {/* Logo en tarjeta */}
          <div className="text-center mb-10">            
            <h1 className="text-3xl md:text-4xl font-bold text-[#570020] mb-3">
              Liceo Tecpán
            </h1>
            <p className="text-gray-600 text-lg">
              Portal de Acceso
            </p>
          </div>
          
          {/* Botones de acceso */}
          <div className="space-y-4">
            <Link href="/login/director">
              <button className="w-full bg-[#570020] text-white py-4 rounded-xl hover:bg-[#6d0028] transition font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Acceso Director
              </button>
            </Link>

            <Link href="/login/docente">
              <button className="w-full bg-emerald-600 text-white py-4 rounded-xl hover:bg-emerald-700 transition font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Acceso Docentes
              </button>
            </Link>
            
            <Link href="/login/alumno">
              <button className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Acceso Alumnos
              </button>
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500">
              Versión 1.0 - Beta
            </p>
            <p className="text-xs text-gray-400 mt-1">
              © {new Date().getFullYear()} Liceo Tecpán
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}