'use client'
import { useState } from 'react'

export default function CalendarioMensual({ actividades, userType }) {
  const [mesActual, setMesActual] = useState(new Date())

  const obtenerDiasDelMes = (fecha) => {
    const año = fecha.getFullYear()
    const mes = fecha.getMonth()
    const primerDia = new Date(año, mes, 1)
    const ultimoDia = new Date(año, mes + 1, 0)
    const diasDelMes = []

    const diaSemanaInicio = primerDia.getDay()
    const diasSemanaAnteriores = diaSemanaInicio === 0 ? 6 : diaSemanaInicio - 1

    for (let i = diasSemanaAnteriores; i > 0; i--) {
      const diaAnterior = new Date(año, mes, -i + 1)
      diasDelMes.push({ fecha: diaAnterior, esDelMes: false })
    }

    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      diasDelMes.push({ fecha: new Date(año, mes, dia), esDelMes: true })
    }

    const totalDias = diasDelMes.length
    const diasFaltantes = totalDias % 7 === 0 ? 0 : 7 - (totalDias % 7)
    for (let i = 1; i <= diasFaltantes; i++) {
      diasDelMes.push({ fecha: new Date(año, mes + 1, i), esDelMes: false })
    }

    return diasDelMes
  }

  const mesAnterior = () => {
    setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() - 1))
  }

  const mesSiguiente = () => {
    setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + 1))
  }

  const obtenerActividadesDia = (fecha) => {
    const fechaStr = fecha.toISOString().split('T')[0]
    return actividades.filter(act => {
      if (act.fecha === fechaStr) {
        if (userType === 'director') return true
        if (userType === 'docente') return act.tipo === 'todos' || act.tipo === 'docentes'
        if (userType === 'alumno') return act.tipo === 'todos' || act.tipo === 'alumnos'
      }
      return false
    })
  }

  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
  const dias = obtenerDiasDelMes(mesActual)
  const nombreMes = mesActual.toLocaleDateString('es-GT', { month: 'long', year: 'numeric' })
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={mesAnterior}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h2 className="text-lg font-bold text-gray-800 capitalize">{nombreMes}</h2>

        <button
          onClick={mesSiguiente}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {diasSemana.map(dia => (
          <div key={dia} className="text-center text-xs font-bold text-gray-600 py-2">
            {dia}
          </div>
        ))}

        {dias.map((dia, index) => {
          const actividadesDia = obtenerActividadesDia(dia.fecha)
          const esHoy = dia.fecha.getTime() === hoy.getTime()

          return (
            <div
              key={index}
              className={`min-h-[70px] border rounded-lg p-1 transition ${
                !dia.esDelMes
                  ? 'bg-gray-50 text-gray-400'
                  : esHoy
                  ? 'bg-blue-100 border-blue-400'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className={`text-xs font-semibold mb-1 ${esHoy ? 'text-blue-700' : 'text-gray-700'}`}>
                {dia.fecha.getDate()}
              </div>
              <div className="space-y-1">
                {actividadesDia.slice(0, 2).map((act, i) => (
                  <div
                    key={i}
                    className="text-[10px] bg-[#570020] text-white px-1 py-0.5 rounded truncate"
                    title={act.titulo}
                  >
                    {act.titulo}
                  </div>
                ))}
                {actividadesDia.length > 2 && (
                  <div className="text-[9px] text-gray-500 font-semibold">
                    +{actividadesDia.length - 2} más
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}