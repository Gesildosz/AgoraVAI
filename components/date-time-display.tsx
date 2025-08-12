"use client"

import { useState, useEffect } from "react"

export default function DateTimeDisplay() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const formattedDate = currentDateTime.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const formattedTime = currentDateTime.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="text-center font-medium text-gray-700 dark:text-gray-300">
      {/* Alinhado em uma única linha horizontalmente para todos os tamanhos de tela */}
      <div className="flex flex-row items-center justify-center gap-2 sm:gap-4">
        {/* Fontes menores para telas pequenas, escalando para cima */}
        <p className="text-sm sm:text-base md:text-xl lg:text-2xl font-semibold whitespace-nowrap">{formattedDate}</p>
        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-700 dark:text-blue-300 whitespace-nowrap">
          {formattedTime}
        </p>
      </div>
    </div>
  )
}
