"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase"

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12,19 5,12 12,5" />
  </svg>
)

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="20,6 9,17 4,12" />
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
)

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
)

export default function GerenciarFolgasPage() {
  const [leaveRequests, setLeaveRequests] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("todos")

  useEffect(() => {
    loadLeaveRequests()
  }, [])

  const loadLeaveRequests = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("leave_requests")
        .select(`
          *,
          employees (
            full_name,
            badge_number
          )
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Erro ao carregar solicitações:", error)
        return
      }

      // Transform data to match expected format
      const requestsFormatted =
        data?.map((req) => ({
          id: req.id,
          employeeName: req.employees?.full_name || "N/A",
          employeeId: req.employees?.badge_number || "N/A",
          date: new Date(req.leave_date).toLocaleDateString("pt-BR"),
          requestDate: new Date(req.created_at).toLocaleDateString("pt-BR"),
          hoursUsed: `${req.hours_used}h`,
          reason: req.reason,
          status: req.status,
        })) || []

      setLeaveRequests(requestsFormatted)
    } catch (error) {
      console.error("Erro ao carregar solicitações:", error)
    }
  }

  const updateRequestStatus = async (requestId: number, newStatus: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("leave_requests").update({ status: newStatus }).eq("id", requestId)

      if (error) {
        console.error("Erro ao atualizar status:", error)
        return
      }

      // Reload the requests
      loadLeaveRequests()
    } catch (error) {
      console.error("Erro:", error)
    }
  }

  const filteredRequests = leaveRequests.filter((request) => {
    const matchesSearch =
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || request.employeeId.includes(searchTerm)
    const matchesFilter = filterStatus === "todos" || request.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aprovado":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20"
      case "pendente":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20"
      case "recusado":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20"
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "aprovado":
        return <CheckIcon className="w-4 h-4" />
      case "pendente":
        return <ClockIcon className="w-4 h-4" />
      case "recusado":
        return <XIcon className="w-4 h-4" />
      default:
        return <CalendarIcon className="w-4 h-4" />
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6 md:p-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="w-full mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/painel-administrativo">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-blue-200 hover:bg-blue-50"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Voltar
              </Button>
            </Link>
            <div className="h-12 flex items-center justify-center">
              <Image src="/images/jbs-logo.png" alt="JBS Logo" width={64} height={48} className="object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Gerenciar Folgas
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Solicitações de Folga Compensatória</p>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou crachá..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-blue-200"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-md border border-blue-200 bg-white/80 backdrop-blur-sm"
          >
            <option value="todos">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="aprovado">Aprovado</option>
            <option value="recusado">Recusado</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{leaveRequests.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {leaveRequests.filter((r) => r.status === "pendente").length}
            </div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {leaveRequests.filter((r) => r.status === "aprovado").length}
            </div>
            <div className="text-sm text-gray-600">Aprovadas</div>
          </CardContent>
        </Card>
        <Card className="bg-white/80 backdrop-blur-sm border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {leaveRequests.filter((r) => r.status === "recusado").length}
            </div>
            <div className="text-sm text-gray-600">Recusadas</div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <Card
              key={request.id}
              className="bg-white/80 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{request.employeeName}</h3>
                        <p className="text-sm text-gray-600">Crachá: {request.employeeId}</p>
                      </div>
                      <div
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}
                      >
                        {getStatusIcon(request.status)}
                        <span className="capitalize">{request.status}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Data da Folga:</span>
                        <p className="font-medium">{request.date}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Solicitado em:</span>
                        <p className="font-medium">{request.requestDate}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Horas:</span>
                        <p className="font-medium">{request.hoursUsed}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Motivo:</span>
                      <p className="font-medium">{request.reason}</p>
                    </div>
                  </div>

                  {request.status === "pendente" && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => updateRequestStatus(request.id, "aprovado")}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <CheckIcon className="w-4 h-4 mr-1" />
                        Aprovar
                      </Button>
                      <Button
                        onClick={() => updateRequestStatus(request.id, "recusado")}
                        variant="destructive"
                        size="sm"
                      >
                        <XIcon className="w-4 h-4 mr-1" />
                        Recusar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardContent className="p-12 text-center">
              <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma solicitação encontrada</h3>
              <p className="text-gray-500">Não há solicitações de folga que correspondam aos filtros selecionados.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
