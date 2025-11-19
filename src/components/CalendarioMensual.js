'use client'
import { useState, useEffect } from 'react'

export default function CalendarioMensual({ actividades, userType }) {
  const [mesActual, setMesActual] = useState(new Date())
  const [vistaMovil, setVistaMovil] = useState(false)

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setVistaMovil(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Filtrar actividades según el tipo de usuario
  const actividadesFiltradas = actividades.filter(act => {
    if (act.tipo === 'todos') return true
    if (userType === 'alumno' && act.tipo === 'alumnos') return true
    if (userType === 'docente' && act.tipo === 'docentes') return true
    return false
  })

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  const diasSemanaCompleto = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

  // Obtener primer y último día del mes
  const primerDiaMes = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1)
  const ultimoDiaMes = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0)
  
  // Ajustar para que Lunes sea el primer día (0)
  let primerDiaSemana = primerDiaMes.getDay() - 1
  if (primerDiaSemana === -1) primerDiaSemana = 6

  const diasEnMes = ultimoDiaMes.getDate()

  // Navegar entre meses
  const mesAnterior = () => {
    setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1))
  }

  const mesSiguiente = () => {
    setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1))
  }

  const irHoy = () => {
    setMesActual(new Date())
  }

  // Obtener actividades de un día específico
  const getActividadesDia = (dia) => {
    const fechaBuscar = `${mesActual.getFullYear()}-${String(mesActual.getMonth() + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
    return actividadesFiltradas.filter(act => act.fecha === fechaBuscar)
  }

  // Obtener todas las actividades del mes
  const getActividadesMes = () => {
    return actividadesFiltradas
      .filter(act => {
        const fechaAct = new Date(act.fecha + 'T00:00:00')
        return fechaAct.getMonth() === mesActual.getMonth() && 
               fechaAct.getFullYear() === mesActual.getFullYear()
      })
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
  }

  const getTipoColor = (tipo) => {
    switch(tipo) {
      case 'todos': return 'bg-blue-500'
      case 'docentes': return 'bg-green-500'
      case 'alumnos': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getTipoBorde = (tipo) => {
    switch(tipo) {
      case 'todos': return 'border-blue-500'
      case 'docentes': return 'border-green-500'
      case 'alumnos': return 'border-purple-500'
      default: return 'border-gray-500'
    }
  }

  const getTipoTexto = (tipo) => {
    switch(tipo) {
      case 'todos': return 'General'
      case 'docentes': return 'Docentes'
      case 'alumnos': return 'Alumnos'
      default: return tipo
    }
  }

  // Verificar si es el día actual
  const esHoy = (dia) => {
    const hoy = new Date()
    return hoy.getDate() === dia && 
           hoy.getMonth() === mesActual.getMonth() && 
           hoy.getFullYear() === mesActual.getFullYear()
  }

  // Crear array de días para el calendario
  const dias = []
  
  // Días vacíos al inicio
  for (let i = 0; i < primerDiaSemana; i++) {
    dias.push(null)
  }
  
  // Días del mes
  for (let dia = 1; dia <= diasEnMes; dia++) {
    dias.push(dia)
  }

  // VISTA MÓVIL - Lista de actividades
  if (vistaMovil) {
    const actividadesMes = getActividadesMes()
    
    return (
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header con navegación */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={mesAnterior}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="text-center">
              <h2 className="text-xl font-bold">
                {meses[mesActual.getMonth()]}
              </h2>
              <p className="text-sm opacity-90">{mesActual.getFullYear()}</p>
            </div>

            <button
              onClick={mesSiguiente}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <button
            onClick={irHoy}
            className="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg transition text-sm font-semibold"
          >
            📅 Ir a Hoy
          </button>
        </div>

        {/* Lista de actividades */}
        <div className="p-4">
          {actividadesMes.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 font-medium">No hay actividades este mes</p>
            </div>
          ) : (
            <div className="space-y-3">
              {actividadesMes.map((actividad) => {
                const fecha = new Date(actividad.fecha + 'T00:00:00')
                const diaSemana = diasSemanaCompleto[fecha.getDay() === 0 ? 6 : fecha.getDay() - 1]
                
                return (
                  <div
                    key={actividad.id}
                    className={`border-l-4 ${getTipoBorde(actividad.tipo)} bg-gray-50 rounded-r-lg p-4 shadow-sm`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800 text-lg flex-1">
                        {actividad.titulo}
                      </h3>
                      <span className={`${getTipoColor(actividad.tipo)} text-white text-xs px-2 py-1 rounded-full font-semibold ml-2`}>
                        {getTipoTexto(actividad.tipo)}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center text-gray-600 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">{diaSemana}, {fecha.getDate()} de {meses[fecha.getMonth()]}</span>
                      </div>

                      <div className="flex items-center text-gray-600 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{actividad.hora}</span>
                      </div>
                    </div>

                    {actividad.descripcion && (
                      <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                        {actividad.descripcion}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Leyenda */}
        <div className="p-4 bg-gray-50 border-t space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-700">Actividades Generales</span>
          </div>
          {userType === 'docente' && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-xs text-gray-700">Solo Docentes</span>
            </div>
          )}
          {userType === 'alumno' && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-gray-700">Solo Alumnos</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // VISTA DESKTOP/TABLET - Cuadrícula
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header con navegación */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={mesAnterior}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {meses[mesActual.getMonth()]} {mesActual.getFullYear()}
          </h2>
          <button
            onClick={irHoy}
            className="text-sm text-indigo-600 hover:underline mt-1"
          >
            Ir a hoy
          </button>
        </div>

        <button
          onClick={mesSiguiente}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {diasSemanaCompleto.map((dia) => (
          <div key={dia} className="text-center font-bold text-gray-700 py-2 bg-indigo-100 rounded">
            {dia}
          </div>
        ))}
      </div>

      {/* Cuadrícula de días */}
      <div className="grid grid-cols-7 gap-2">
        {dias.map((dia, index) => {
          if (dia === null) {
            return <div key={`empty-${index}`} className="min-h-[120px] bg-gray-50 rounded"></div>
          }

          const actividadesDia = getActividadesDia(dia)
          const hayActividades = actividadesDia.length > 0

          return (
            <div
              key={dia}
              className={`min-h-[120px] border-2 rounded-lg p-2 transition ${
                esHoy(dia) 
                  ? 'border-indigo-600 bg-indigo-50' 
                  : hayActividades 
                    ? 'border-gray-300 bg-white hover:shadow-md' 
                    : 'border-gray-200 bg-gray-50'
              }`}
            >
              {/* Número del día */}
              <div className={`text-right font-bold mb-1 ${
                esHoy(dia) ? 'text-indigo-600 text-lg' : 'text-gray-700'
              }`}>
                {dia}
              </div>

              {/* Actividades del día */}
              <div className="space-y-1">
                {actividadesDia.map((actividad) => (
                  <div
                    key={actividad.id}
                    className={`${getTipoColor(actividad.tipo)} text-white text-xs p-1.5 rounded shadow-sm cursor-pointer hover:opacity-80 transition`}
                    title={`${actividad.hora} - ${actividad.descripcion || ''}`}
                  >
                    <div className="font-semibold truncate">{actividad.hora}</div>
                    <div className="truncate">{actividad.titulo}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Leyenda */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center items-center pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-700">Actividades Generales</span>
        </div>
        {userType === 'docente' && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-700">Solo Docentes</span>
          </div>
        )}
        {userType === 'alumno' && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-sm text-gray-700">Solo Alumnos</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-indigo-600 rounded"></div>
          <span className="text-sm text-gray-700">Día actual</span>
        </div>
      </div>

      {/* Nota informativa */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
        <p className="text-sm text-gray-600">
          <strong>Nota:</strong> Pasa el cursor sobre las actividades para ver más detalles
        </p>
      </div>
    </div>
  )
}