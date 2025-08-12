"use client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
    />
  </svg>
)

const UserPlusIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
    />
  </svg>
)

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const HistoryIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const BarChart3Icon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
)

const MessageSquareIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
)

const HeadphonesIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
    />
  </svg>
)

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
)

const LogOutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
)

const UserCogIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
)

const AlertTriangleIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
    />
  </svg>
)

const ListIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
)

const CalendarCheckIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
  </svg>
)

export default function PainelAdministrativo() {
  const router = useRouter()
  const [currentDateTime, setCurrentDateTime] = useState(new Date())
  const [hasMessages, setHasMessages] = useState(false)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDateTime = (date: Date) => {
    const dateStr = date.toLocaleDateString("pt-BR")
    const timeStr = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
    return { dateStr, timeStr }
  }

  const { dateStr, timeStr } = formatDateTime(currentDateTime)

  const handleCardClick = (cardName: string) => {
    if (cardName === "Cadastro Funcionário") {
      router.push("/painel-administrativo/cadastro-colaborador")
    } else if (cardName === "Lista Funcionários") {
      router.push("/painel-administrativo/lista-funcionarios")
    } else if (cardName === "Lançamento Horas") {
      router.push("/painel-administrativo/lancamento-horas")
    } else if (cardName === "Gerenciar Folgas") {
      router.push("/painel-administrativo/gerenciar-folgas")
    } else {
      console.log(`Navegando para: ${cardName}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="h-12 flex items-center justify-center">
              <Image src="/images/jbs-logo.png" alt="JBS Logo" width={128} height={48} className="object-contain" />
            </div>
          </div>

          {/* Date and Time */}
          <div className="flex items-center gap-4 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                {dateStr}
              </p>
              <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                {timeStr}
              </p>
            </div>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Administrador</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">teste</p>
            </div>

            {/* Notification Bell */}
            <Button variant="ghost" size="sm" onClick={() => setHasMessages(!hasMessages)} className="relative p-2">
              <BellIcon />
              {hasMessages && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>}
            </Button>

            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <LogOutIcon />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Painel Administrativo</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie colaboradores, horas e configurações do sistema</p>
        </div>

        {/* Admin Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {/* Cadastro Funcionário */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300 dark:hover:border-blue-600"
            onClick={() => handleCardClick("Cadastro Funcionário")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <UsersIcon />
                Cadastro Funcionário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">Cadastrar novos colaboradores no sistema</p>
            </CardContent>
          </Card>

          {/* Lista Funcionários */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-cyan-300 dark:hover:border-cyan-600"
            onClick={() => handleCardClick("Lista Funcionários")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-cyan-700 dark:text-cyan-300">
                <ListIcon />
                Lista Funcionários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">Visualizar todos os funcionários cadastrados</p>
            </CardContent>
          </Card>

          {/* Cadastro ADM */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-purple-300 dark:hover:border-purple-600"
            onClick={() => handleCardClick("Cadastro ADM")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <UserCogIcon />
                Cadastro ADM
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gerenciar administradores do sistema</p>
            </CardContent>
          </Card>

          {/* Lançamento Horas */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-300 dark:hover:border-green-600"
            onClick={() => handleCardClick("Lançamento Horas")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-300">
                <ClockIcon />
                Lançamento Horas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lançar e ajustar horas dos colaboradores</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-teal-300 dark:hover:border-teal-600"
            onClick={() => handleCardClick("Gerenciar Folgas")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-teal-700 dark:text-teal-300">
                <CalendarCheckIcon />
                Gerenciar Folgas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">Aprovar e gerenciar solicitações de folga</p>
            </CardContent>
          </Card>

          {/* Histórico */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-orange-300 dark:hover:border-orange-600"
            onClick={() => handleCardClick("Histórico")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <HistoryIcon />
                Histórico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">Visualizar histórico de registros e ações</p>
            </CardContent>
          </Card>

          {/* Resumo Geral */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-indigo-300 dark:hover:border-indigo-600"
            onClick={() => handleCardClick("Resumo Geral")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                <BarChart3Icon />
                Resumo Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">Relatórios e estatísticas gerais</p>
            </CardContent>
          </Card>

          {/* Avisos Painel Colaborador */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-yellow-300 dark:hover:border-yellow-600"
            onClick={() => handleCardClick("Avisos Painel Colaborador")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                <MessageSquareIcon />
                Avisos Painel Colaborador
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gerenciar avisos para colaboradores</p>
            </CardContent>
          </Card>

          {/* Suporte */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-red-300 dark:hover:border-red-600"
            onClick={() => handleCardClick("Suporte")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-red-700 dark:text-red-300">
                <HeadphonesIcon />
                Suporte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">Central de suporte e solicitações</p>
            </CardContent>
          </Card>
        </div>

        {/* Painel de Aviso */}
        <Card className="border-2 border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <AlertTriangleIcon />
              Painel de Aviso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
              <div className="flex items-start gap-3">
                <CalendarIcon />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Manutenção Programada</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Sistema passará por manutenção no domingo das 02:00 às 06:00
                  </p>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Hoje • 14:30</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
              <div className="flex items-start gap-3">
                <UserPlusIcon />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Novos Colaboradores</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    5 novos colaboradores aguardando aprovação de cadastro
                  </p>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Ontem • 16:45</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
