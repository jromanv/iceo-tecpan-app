export default function CalendarioActividades({ actividades, userType }) {
  // Filtrar actividades según el tipo de usuario
  const actividadesFiltradas = actividades.filter(act => {
    if (act.tipo === 'todos') return true
    if (userType === 'alumno' && act.tipo === 'alumnos') return true
    if (userType === 'docente' && act.tipo === 'docentes') return true
    return false
  })

  const getTipoColor = (tipo) => {
    switch(tipo) {
      case 'todos': return 'border-l-blue-500 bg-blue-50'
      case 'docentes': return 'border-l-green-500 bg-green-50'
      case 'alumnos': return 'border-l-purple-500 bg-purple-50'
      default: return 'border-l-gray-500 bg-gray-50'
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

  // Agrupar actividades por mes
  const actividadesPorMes = actividadesFiltradas.reduce((acc, act) => {
    const fecha = new Date(act.fecha + 'T00:00:00')
    const mesAno = fecha.toLocaleDateString('es-GT', { month: 'long', year: 'numeric' })
    
    if (!acc[mesAno]) {
      acc[mesAno] = []
    }
    acc[mesAno].push(act)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {Object.keys(actividadesPorMes).length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600">No hay actividades programadas</p>
        </div>
      ) : (
        Object.keys(actividadesPorMes)
          .sort((a, b) => {
            const [mesA, anoA] = a.split(' de ')
            const [mesB, anoB] = b.split(' de ')
            return new Date(anoA, getMesNumero(mesA)) - new Date(anoB, getMesNumero(mesB))
          })
          .map((mesAno) => (
          <div key={mesAno} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 capitalize">
              {mesAno}
            </h3>
            
            <div className="space-y-3">
              {actividadesPorMes[mesAno]
                .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                .map((actividad) => (
                <div 
                  key={actividad.id} 
                  className={`border-l-4 ${getTipoColor(actividad.tipo)} p-4 rounded-r-lg`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-800 mb-1">
                        {actividad.titulo}
                      </h4>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(actividad.fecha + 'T00:00:00').toLocaleDateString('es-GT', { 
                            weekday: 'long', 
                            day: 'numeric'
                          })}
                        </span>
                        
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {actividad.hora}
                        </span>
                      </div>
                      
                      {actividad.descripcion && (
                        <p className="text-sm text-gray-600 mb-2">{actividad.descripcion}</p>
                      )}
                      
                      <span className="inline-block text-xs font-semibold text-gray-600">
                        {getTipoTexto(actividad.tipo)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

// Función auxiliar para convertir nombre de mes a número
function getMesNumero(mes) {
  const meses = {
    'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3,
    'mayo': 4, 'junio': 5, 'julio': 6, 'agosto': 7,
    'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
  }
  return meses[mes.toLowerCase()] || 0
}