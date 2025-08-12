"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://your-supabase-url.supabase.co"
const supabaseKey = "your-supabase-key"
const supabase = createClient(supabaseUrl, supabaseKey)

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
)

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const LogOutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const TimerIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
)

const CalendarPlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <line x1="12" y1="15" x2="12" y2="19" />
    <line x1="10" y1="17" x2="14" y2="17" />
  </svg>
)

const BellIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

export default function DashboardPage() {
  const [hasMessages, setHasMessages] = useState(false)
  const [currentEmployee, setCurrentEmployee] = useState<any>(null)
  const [employeeHours, setEmployeeHours] = useState({ positive: 0, negative: 0, total: 0 })
  const [weeklyHours, setWeeklyHours] = useState<any[]>([])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const employeeData = sessionStorage.getItem("currentEmployee")
      if (employeeData) {
        const employee = JSON.parse(employeeData)
        setCurrentEmployee(employee)
        loadEmployeeHours(employee.badge)
      }
    }
  }, [])

  const loadEmployeeHours = async (badge: string) => {
    try {
      const { data: workSessions, error } = await supabase.from("work_sessions").select("*").eq("employee_id", badge)

      if (error) throw error

      const sessions = workSessions || []
      const positive = sessions
        .filter((session: any) => session.hours > 0)
        .reduce((sum: number, session: any) => sum + session.hours, 0)

      const negative = sessions
        .filter((session: any) => session.hours < 0)
        .reduce((sum: number, session: any) => sum + Math.abs(session.hours), 0)

      setEmployeeHours({
        positive,
        negative,
        total: positive - negative,
      })

      const monthlyData = processMonthlyData(sessions)
      setWeeklyHours(monthlyData)
    } catch (error) {
      console.error("Erro ao carregar horas:", error)
    }
  }

  const processWeeklyData = (entries: any[]) => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    const weeklyData = days.map((day) => ({ day, positive: 0, negative: 0 }))

    entries.forEach((entry) => {
      const entryDate = new Date(entry.date)
      const dayIndex = entryDate.getDay()

      if (entry.hours > 0) {
        weeklyData[dayIndex].positive += entry.hours
      } else {
        weeklyData[dayIndex].negative += Math.abs(entry.hours)
      }
    })

    return weeklyData
  }

  const processMonthlyData = (entries: any[]) => {
    const monthlyData = []
    const today = new Date()

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      const dayEntries = entries.filter((entry) => {
        const entryDate = new Date(entry.date)
        return entryDate.toDateString() === date.toDateString()
      })

      let positive = 0
      let negative = 0

      dayEntries.forEach((entry) => {
        if (entry.hours > 0) {
          positive += entry.hours
        } else {
          negative += Math.abs(entry.hours)
        }
      })

      monthlyData.push({
        day: date.getDate(),
        date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        positive,
        negative,
      })
    }

    return monthlyData
  }

  const formatHours = (hours: number) => {
    const h = Math.floor(Math.abs(hours))
    const m = Math.round((Math.abs(hours) - h) * 60)
    return `${h}h ${m.toString().padStart(2, "0")}m`
  }

  const currentTime = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const currentDate = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const todayDate = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  const hoursData =
    weeklyHours.length > 0
      ? weeklyHours
      : Array.from({ length: 30 }, (_, i) => {
          const date = new Date()
          date.setDate(date.getDate() - (29 - i))
          return {
            day: date.getDate(),
            date: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
            positive: Math.random() * 2 + Math.sin(i * 0.3) * 1.5 + 1,
            negative: Math.random() * 1.5 + Math.cos(i * 0.4) * 1 + 0.5,
          }
        })

  const LineChart = () => {
    const maxValue = Math.max(...hoursData.map((d) => Math.max(Math.abs(d.positive), Math.abs(d.negative)))) || 1
    const chartHeight = 220
    const chartWidth = 600
    const padding = 50

    const createSmoothPath = (points: any[]) => {
      if (points.length < 2) return ""

      let path = `M ${points[0].x} ${points[0].y}`

      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1]
        const curr = points[i]
        const next = points[i + 1] || curr

        const cp1x = prev.x + (curr.x - prev.x) * 0.3
        const cp1y = prev.y
        const cp2x = curr.x - (next.x - curr.x) * 0.3
        const cp2y = curr.y

        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`
      }

      return path
    }

    const positivePoints = hoursData.map((data, index) => {
      const x = (index / (hoursData.length - 1)) * (chartWidth - padding * 2) + padding
      const y = chartHeight - padding - (data.positive / maxValue) * (chartHeight - padding * 2)
      return { x, y, value: data.positive }
    })

    const negativePoints = hoursData.map((data, index) => {
      const x = (index / (hoursData.length - 1)) * (chartWidth - padding * 2) + padding
      const y = chartHeight - padding - (data.negative / maxValue) * (chartHeight - padding * 2)
      return { x, y, value: data.negative }
    })

    return (
      <div className="w-full bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg p-4 overflow-x-auto">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-semibold">
            Histórico Mensal de Horas (30 dias)
          </div>
        </div>

        <div className="flex items-center justify-center">
          <svg width={chartWidth} height={chartHeight} className="overflow-visible">
            <defs>
              <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.1" />
                <stop offset="100%" stopColor="rgb(6, 182, 212)" stopOpacity="0.1" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="positiveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(34, 197, 94)" />
                <stop offset="50%" stopColor="rgb(16, 185, 129)" />
                <stop offset="100%" stopColor="rgb(34, 197, 94)" />
              </linearGradient>
              <linearGradient id="negativeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(239, 68, 68)" />
                <stop offset="50%" stopColor="rgb(220, 38, 127)" />
                <stop offset="100%" stopColor="rgb(239, 68, 68)" />
              </linearGradient>
            </defs>

            <rect width="100%" height="100%" fill="url(#gridGradient)" rx="8" />

            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={ratio}
                x1={padding}
                y1={padding + ratio * (chartHeight - padding * 2)}
                x2={chartWidth - padding}
                y2={padding + ratio * (chartHeight - padding * 2)}
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.2"
                strokeDasharray="2,2"
              />
            ))}

            <path
              d={createSmoothPath(positivePoints)}
              fill="none"
              stroke="url(#positiveGradient)"
              strokeWidth="4"
              filter="url(#glow)"
              opacity="0.9"
            />

            <path
              d={createSmoothPath(negativePoints)}
              fill="none"
              stroke="url(#negativeGradient)"
              strokeWidth="4"
              filter="url(#glow)"
              opacity="0.9"
            />

            {positivePoints.map((point, index) => {
              if (index % 5 !== 0) return null
              return (
                <g key={`positive-${index}`}>
                  <circle cx={point.x} cy={point.y} r="5" fill="rgb(34, 197, 94)" stroke="white" strokeWidth="3" />
                  {point.value > 0 && (
                    <text
                      x={point.x}
                      y={point.y - 15}
                      textAnchor="middle"
                      fontSize="10"
                      fill="rgb(34, 197, 94)"
                      fontWeight="bold"
                    >
                      +{point.value.toFixed(1)}h
                    </text>
                  )}
                </g>
              )
            })}

            {hoursData.map((data, index) => {
              if (index % 5 !== 0) return null
              const x = (index / (hoursData.length - 1)) * (chartWidth - padding * 2) + padding
              return (
                <text
                  key={data.day}
                  x={x}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  fontSize="11"
                  fill="currentColor"
                  fontWeight="500"
                >
                  {data.date}
                </text>
              )
            })}
          </svg>
        </div>

        <div className="flex justify-center gap-8 mt-6">
          <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 px-3 py-2 rounded-full">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg"></div>
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Horas Extras</span>
          </div>
          <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 px-3 py-2 rounded-full">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 shadow-lg"></div>
            <span className="text-sm font-medium text-red-700 dark:text-red-300">Horas Devidas</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 md:p-8 bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-gray-100">
      <header className="w-full mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="h-12 flex items-center justify-center">
              <Image src="/images/jbs-logo.png" alt="JBS Logo" width={64} height={48} className="object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Banco de Horas</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="p-2" onClick={() => setHasMessages(!hasMessages)}>
              <BellIcon className={`w-5 h-5 ${hasMessages ? "text-red-500" : "text-green-500"}`} />
            </Button>
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                <LogOutIcon />
                Sair
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow space-y-6">
        <Card className="w-full shadow-sm border border-gray-200 bg-white dark:bg-gray-800 overflow-hidden">
          <CardHeader className="text-center pb-4 border-b border-gray-100 dark:border-gray-700">
            <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-200">Horário Atual</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4 py-6">
            {/* Ícone discreto */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>

            {/* Horário principal */}
            <div className="text-3xl font-mono font-semibold text-gray-900 dark:text-gray-100 mb-2">{currentTime}</div>
            <div className="text-gray-500 dark:text-gray-400 text-base mb-4">{currentDate}</div>

            {/* Status discreto */}
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Ativo
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ClockIcon />
                Histórico de Horas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <LineChart />
            </CardContent>
          </Card>

          <div className="space-y-4">
            {/* Header com gradiente */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <CalendarIcon />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Saldo de Horas</h3>
                    <p className="text-sm opacity-90">{todayDate}</p>
                  </div>
                </div>
                <Link href="/agendamento-folga">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <CalendarPlusIcon />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Card principal do saldo total */}
            <Card
              className={`shadow-xl border-0 ${
                employeeHours.total >= 0
                  ? "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30"
                  : "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30"
              }`}
            >
              <CardContent className="p-6">
                <div className="text-center space-y-3">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                      employeeHours.total >= 0
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200"
                    }`}
                  >
                    <TimerIcon />
                    <span className="text-sm font-medium">
                      {employeeHours.total >= 0 ? "Saldo Positivo" : "Saldo Negativo"}
                    </span>
                  </div>

                  <div
                    className={`text-4xl font-bold ${employeeHours.total >= 0 ? "text-emerald-600" : "text-red-600"}`}
                  >
                    {employeeHours.total >= 0 ? "+" : ""}
                    {formatHours(employeeHours.total)}
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {employeeHours.total >= 0 ? "Você tem horas extras disponíveis" : "Você possui débito de horas"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cards detalhados */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-full">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">EXTRAS</p>
                      <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                        {formatHours(employeeHours.positive)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 dark:bg-red-900/50 p-2 rounded-full">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-xs text-red-600 dark:text-red-400 font-medium">DEVIDAS</p>
                      <p className="text-lg font-bold text-red-700 dark:text-red-300">
                        {formatHours(employeeHours.negative)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Indicador visual de progresso */}
            <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Status do Mês</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      employeeHours.total >= 0
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                    }`}
                  >
                    {employeeHours.total >= 0 ? "Positivo" : "Negativo"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      employeeHours.total >= 0
                        ? "bg-gradient-to-r from-emerald-500 to-green-500"
                        : "bg-gradient-to-r from-red-500 to-rose-500"
                    }`}
                    style={{
                      width: `${Math.min(Math.abs(employeeHours.total) * 10, 100)}%`,
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="relative overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10"></div>
          <CardHeader className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <UserIcon />
              </div>
              Informações do Colaborador
            </CardTitle>
          </CardHeader>
          <CardContent className="relative p-6 space-y-4">
            {/* Avatar e Nome Principal */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {currentEmployee?.name
                  ? currentEmployee.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                  : "CO"}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  {currentEmployee?.name || "Colaborador"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Crachá: {currentEmployee?.badge || "------"}</p>
              </div>
            </div>

            {/* Cards de Informações */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <ClockIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Turno</p>
                    <p className="font-bold text-gray-800 dark:text-white">{currentEmployee?.shift || "------"}</p>
                  </div>
                </div>
              </div>

              <div className="group p-4 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10 rounded-xl border-l-4 border-cyan-500 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Supervisor</p>
                    <p className="font-bold text-gray-800 dark:text-white">{currentEmployee?.supervisor || "------"}</p>
                  </div>
                </div>
              </div>

              {currentEmployee?.leaderShift && (
                <div className="group p-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-xl border-l-4 border-purple-500 hover:shadow-lg transition-all duration-300 hover:scale-105 md:col-span-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Líder do Turno</p>
                      <p className="font-bold text-gray-800 dark:text-white">{currentEmployee.leaderShift}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Status Badge */}
            <div className="flex justify-center mt-6">
              <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-semibold shadow-lg">
                ✓ Colaborador Ativo
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="w-full text-center text-sm text-gray-600 dark:text-gray-400 py-4 mt-8">
        <p>&copy; {new Date().getFullYear()} JBS. Todos os direitos reservados.</p>
        <p>Sistema de Ponto - Versão 1.0.0</p>
      </footer>
    </div>
  )
}
