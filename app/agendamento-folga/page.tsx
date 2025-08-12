"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const dynamicConfig = "force-dynamic"
const runtimeConfig = "edge"

interface Employee {
  id: number
  full_name: string
  email: string
  department: string
  position: string
}

interface LeaveRequest {
  id: number
  employee_id: number
  employee_name: string
  start_date: string
  end_date: string
  leave_type: string
  reason: string
  status: "pending" | "approved" | "rejected"
  created_at: string
}

const AgendamentoFolgaPage: React.FC = () => {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [leaveType, setLeaveType] = useState<string>("")
  const [reason, setReason] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState<string>("")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleString("pt-BR"))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    loadEmployees()
    loadLeaveRequests()
  }, [mounted])

  const loadEmployees = async () => {
    try {
      setEmployees([
        { id: 1, full_name: "João Silva", email: "joao@empresa.com", department: "TI", position: "Desenvolvedor" },
        { id: 2, full_name: "Maria Santos", email: "maria@empresa.com", department: "RH", position: "Analista" },
        { id: 3, full_name: "Pedro Costa", email: "pedro@empresa.com", department: "Vendas", position: "Vendedor" },
        { id: 4, full_name: "Ana Oliveira", email: "ana@empresa.com", department: "Financeiro", position: "Contador" },
        {
          id: 5,
          full_name: "Carlos Mendes",
          email: "carlos@empresa.com",
          department: "Produção",
          position: "Operador",
        },
      ])
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error)
    }
  }

  const loadLeaveRequests = async () => {
    try {
      setLeaveRequests([
        {
          id: 1,
          employee_id: 1,
          employee_name: "João Silva",
          start_date: "2024-02-15",
          end_date: "2024-02-20",
          leave_type: "vacation",
          reason: "Férias programadas",
          status: "pending",
          created_at: "2024-01-15T10:00:00Z",
        },
        {
          id: 2,
          employee_id: 2,
          employee_name: "Maria Santos",
          start_date: "2024-02-10",
          end_date: "2024-02-12",
          leave_type: "sick",
          reason: "Consulta médica",
          status: "approved",
          created_at: "2024-01-10T14:30:00Z",
        },
      ])
    } catch (error) {
      console.error("Erro ao carregar solicitações:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEmployee || !startDate || !endDate || !leaveType) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    setLoading(true)
    try {
      const newRequest: LeaveRequest = {
        id: Date.now(),
        employee_id: Number.parseInt(selectedEmployee),
        employee_name: employees.find((emp) => emp.id === Number.parseInt(selectedEmployee))?.full_name || "",
        start_date: startDate,
        end_date: endDate,
        leave_type: leaveType,
        reason: reason,
        status: "pending",
        created_at: new Date().toISOString(),
      }

      setLeaveRequests((prev) => [newRequest, ...prev])
      setSelectedEmployee("")
      setStartDate("")
      setEndDate("")
      setLeaveType("")
      setReason("")
      alert("Solicitação de folga criada com sucesso!")
    } catch (error) {
      console.error("Erro ao criar solicitação:", error)
      alert("Erro ao criar solicitação de folga")
    } finally {
      setLoading(false)
    }
  }

  const updateRequestStatus = async (id: number, status: "approved" | "rejected") => {
    try {
      setLeaveRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status } : request)))
      alert(`Solicitação ${status === "approved" ? "aprovada" : "rejeitada"} com sucesso!`)
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      alert("Erro ao atualizar status da solicitação")
    }
  }

  const deleteRequest = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta solicitação?")) return

    try {
      setLeaveRequests((prev) => prev.filter((request) => request.id !== id))
      alert("Solicitação excluída com sucesso!")
    } catch (error) {
      console.error("Erro ao excluir solicitação:", error)
      alert("Erro ao excluir solicitação")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-100"
      case "rejected":
        return "text-red-600 bg-red-100"
      default:
        return "text-yellow-600 bg-yellow-100"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Aprovado"
      case "rejected":
        return "Rejeitado"
      default:
        return "Pendente"
    }
  }

  const getLeaveTypeText = (type: string) => {
    switch (type) {
      case "vacation":
        return "Férias"
      case "sick":
        return "Atestado Médico"
      case "personal":
        return "Folga Pessoal"
      case "emergency":
        return "Emergência"
      default:
        return type
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push("/painel-administrativo")}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Voltar</span>
            </button>

            <div className="flex items-center space-x-4">
              <img src="/generic-meat-logo.png" alt="JBS Logo" className="h-10" />
            </div>

            <div className="text-sm text-gray-600">{currentTime}</div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Agendamento de Folga</h1>
          <p className="text-gray-600">Gerencie solicitações de folga e férias dos funcionários</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Nova Solicitação de Folga</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="employee">Funcionário *</Label>
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um funcionário" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id.toString()}>
                          {employee.full_name} - {employee.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Data Início *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Data Fim *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="leaveType">Tipo de Folga *</Label>
                  <Select value={leaveType} onValueChange={setLeaveType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacation">Férias</SelectItem>
                      <SelectItem value="sick">Atestado Médico</SelectItem>
                      <SelectItem value="personal">Folga Pessoal</SelectItem>
                      <SelectItem value="emergency">Emergência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="reason">Motivo</Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Descreva o motivo da solicitação..."
                    rows={3}
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Criando..." : "Criar Solicitação"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Solicitações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {leaveRequests.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhuma solicitação encontrada</p>
                ) : (
                  leaveRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{request.employee_name}</h4>
                          <p className="text-sm text-gray-600">{getLeaveTypeText(request.leave_type)}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                        >
                          {getStatusText(request.status)}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600">
                        <p>
                          Período: {new Date(request.start_date).toLocaleDateString("pt-BR")} até{" "}
                          {new Date(request.end_date).toLocaleDateString("pt-BR")}
                        </p>
                        {request.reason && <p>Motivo: {request.reason}</p>}
                      </div>

                      {request.status === "pending" && (
                        <div className="flex space-x-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => updateRequestStatus(request.id, "approved")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => updateRequestStatus(request.id, "rejected")}
                          >
                            Rejeitar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteRequest(request.id)}>
                            Excluir
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-600 text-sm">© 2024 JBS - Sistema de Gestão de Funcionários</p>
        </div>
      </footer>
    </div>
  )
}

export default AgendamentoFolgaPage
