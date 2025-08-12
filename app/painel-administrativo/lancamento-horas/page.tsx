"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { createClient } from "@supabase/supabase-js"

const ArrowLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7-7l-7 7 7 7" />
  </svg>
)

interface Employee {
  id: string
  full_name: string
  email: string
  department: string
  position: string
}

interface WorkSession {
  id: string
  employee_id: string
  work_date: string
  hours: number
  notes?: string
  created_at: string
  employee?: Employee
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function LancamentoHoras() {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [workSessions, setWorkSessions] = useState<WorkSession[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [editingRecord, setEditingRecord] = useState<string | null>(null)
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  const [formData, setFormData] = useState({
    work_date: new Date().toISOString().split("T")[0],
    hours: 0,
    hourType: "positive" as "positive" | "negative",
    notes: "",
  })

  useEffect(() => {
    fetchEmployees()
    fetchWorkSessions()
  }, [])

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

  const fetchEmployees = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("employees")
        .select("id, full_name, email, department, position")
        .eq("is_active", true)
        .order("full_name")

      if (error) {
        console.error("Erro ao buscar funcionários:", error)
        return
      }

      const employeesWithStringId =
        data?.map((emp) => ({
          ...emp,
          id: emp.id.toString(),
        })) || []

      setEmployees(employeesWithStringId)
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchWorkSessions = async () => {
    try {
      const { data, error } = await supabase
        .from("work_sessions")
        .select(`
          id,
          employee_id,
          work_date,
          total_hours,
          created_at,
          employees!inner (
            id,
            full_name,
            email,
            department,
            position
          )
        `)
        .order("created_at", { ascending: false })
        .limit(20)

      if (error) {
        console.error("Erro ao buscar registros:", error)
        return
      }

      const transformedSessions =
        data?.map((session) => ({
          id: session.id.toString(),
          employee_id: session.employee_id.toString(),
          work_date: session.work_date,
          hours: session.total_hours || 0,
          notes: "",
          created_at: session.created_at,
          employee: {
            id: session.employees.id.toString(),
            full_name: session.employees.full_name,
            email: session.employees.email,
            department: session.employees.department,
            position: session.employees.position,
          },
        })) || []

      setWorkSessions(transformedSessions)
    } catch (error) {
      console.error("Erro ao buscar registros:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEmployee || formData.hours === 0) return

    setIsLoading(true)
    try {
      const selectedEmp = employees.find((emp) => emp.id === selectedEmployee)
      const finalHours = formData.hourType === "negative" ? -formData.hours : formData.hours

      const { data, error } = await supabase
        .from("work_sessions")
        .insert({
          employee_id: Number.parseInt(selectedEmployee),
          work_date: formData.work_date,
          total_hours: finalHours,
          start_time: null,
          end_time: null,
          break_duration_minutes: 0,
          overtime_hours: finalHours > 8 ? finalHours - 8 : 0,
          status: "completed",
        })
        .select()

      if (error) {
        console.error("Erro ao salvar registro:", error)
        return
      }

      await fetchWorkSessions()

      setFormData({
        work_date: new Date().toISOString().split("T")[0],
        hours: 0,
        hourType: "positive",
        notes: "",
      })
      setSelectedEmployee("")
    } catch (error) {
      console.error("Erro ao salvar registro:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (recordId: string) => {
    if (!confirm("Tem certeza que deseja excluir este registro?")) return

    try {
      const { error } = await supabase.from("work_sessions").delete().eq("id", Number.parseInt(recordId))

      if (error) {
        console.error("Erro ao excluir registro:", error)
        return
      }

      await fetchWorkSessions()
    } catch (error) {
      console.error("Erro ao excluir registro:", error)
    }
  }

  const handleEdit = async (recordId: string, updatedData: Partial<WorkSession>) => {
    try {
      const { error } = await supabase
        .from("work_sessions")
        .update({
          total_hours: updatedData.hours,
          work_date: updatedData.work_date,
        })
        .eq("id", Number.parseInt(recordId))

      if (error) {
        console.error("Erro ao atualizar registro:", error)
        return
      }

      await fetchWorkSessions()
      setEditingRecord(null)
    } catch (error) {
      console.error("Erro ao atualizar registro:", error)
    }
  }

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredRecords = workSessions.filter(
    (record) =>
      !searchTerm ||
      record.employee?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employee?.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-950 dark:to-slate-900">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-blue-200 dark:border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo e Voltar */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/painel-administrativo")}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <ArrowLeftIcon />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Lançamento de Horas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Lance horas positivas ou negativas para os funcionários</p>
        </div>

        <Card className="mb-6 border-2 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <Input
              placeholder="Buscar funcionários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
            />
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-xl text-blue-700 dark:text-blue-300">Novo Lançamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Employee Selection */}
                <div className="space-y-2">
                  <Label htmlFor="employee" className="font-semibold text-gray-700 dark:text-gray-300">
                    Funcionário
                  </Label>
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger className="border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400">
                      <SelectValue placeholder="Selecione um funcionário" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredEmployees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          <div>
                            <div className="font-medium">{employee.full_name}</div>
                            <div className="text-sm text-gray-500">{employee.position}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="work_date" className="font-semibold text-gray-700 dark:text-gray-300">
                      Data
                    </Label>
                    <Input
                      id="work_date"
                      type="date"
                      value={formData.work_date}
                      onChange={(e) => setFormData({ ...formData, work_date: e.target.value })}
                      className="border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hourType" className="font-semibold text-gray-700 dark:text-gray-300">
                      Tipo de Lançamento
                    </Label>
                    <Select
                      value={formData.hourType}
                      onValueChange={(value: "positive" | "negative") => setFormData({ ...formData, hourType: value })}
                    >
                      <SelectTrigger className="border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="positive">
                          <span className="text-green-600">➕ Horas Positivas</span>
                        </SelectItem>
                        <SelectItem value="negative">
                          <span className="text-red-600">➖ Horas Negativas</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hours" className="font-semibold text-gray-700 dark:text-gray-300">
                    Quantidade de Horas
                  </Label>
                  <Input
                    id="hours"
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: Number.parseFloat(e.target.value) || 0 })}
                    placeholder="Ex: 8, 4.5, 2"
                    className="border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="font-semibold text-gray-700 dark:text-gray-300">
                    Observações
                  </Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Opcional"
                    className="border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                </div>

                {formData.hours > 0 && (
                  <div
                    className={`p-3 rounded border ${
                      formData.hourType === "positive"
                        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
                    }`}
                  >
                    <span className="font-medium">
                      {formData.hourType === "positive" ? "+" : "-"}
                      {formData.hours} horas ({formData.hourType === "positive" ? "Adição" : "Desconto"})
                    </span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !selectedEmployee || formData.hours === 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                >
                  {isLoading ? "Salvando..." : "Salvar Lançamento"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-xl text-blue-700 dark:text-blue-300">Lançamentos Recentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
              {filteredRecords.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum lançamento encontrado</p>
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <div key={record.id} className="p-4 border border-blue-200 dark:border-blue-800 rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{record.employee?.full_name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {record.employee?.position} • {record.employee?.department}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingRecord(record.id)}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(record.id)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Data:</span>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {new Date(record.work_date).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Horas:</span>
                        <div
                          className={`font-medium ${
                            record.hours > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {record.hours > 0 ? "+" : ""}
                          {record.hours}h
                        </div>
                      </div>
                    </div>

                    {record.notes && (
                      <div className="text-sm">
                        <span className="text-gray-500">Observações:</span>
                        <div className="mt-1 text-gray-700 dark:text-gray-300">{record.notes}</div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-blue-200 dark:border-gray-700 p-4 mt-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">© 2024 JBS - Sistema de Controle de Ponto</p>
        </div>
      </footer>
    </div>
  )
}
