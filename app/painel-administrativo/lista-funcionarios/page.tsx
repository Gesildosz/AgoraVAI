"use client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { createClient } from "@/lib/supabase"

// Ícones SVG
const ArrowLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
)

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
)

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

export default function ListaFuncionarios() {
  const router = useRouter()
  const [funcionarios, setFuncionarios] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  useEffect(() => {
    loadFuncionarios()
  }, [])

  const loadFuncionarios = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("employees").select("*").eq("status", "active").order("full_name")

      if (error) {
        console.error("Erro ao carregar funcionários:", error)
        return
      }

      // Transform data to match expected format
      const funcionariosFormatados =
        data?.map((emp) => ({
          id: emp.id,
          nomeCompleto: emp.full_name,
          numeroCracha: emp.badge_number,
          dataNascimento: new Date(emp.birth_date).toLocaleDateString("pt-BR"),
          supervisor: emp.supervisor,
          turno: emp.shift,
          liderTurno: emp.shift_leader,
          codigoAcesso: emp.access_code,
        })) || []

      setFuncionarios(funcionariosFormatados)
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error)
    }
  }

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

  // Filtrar funcionários baseado na busca
  const funcionariosFiltrados = funcionarios.filter(
    (funcionario) =>
      funcionario.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.numeroCracha.includes(searchTerm) ||
      funcionario.codigoAcesso.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEdit = (id: number) => {
    console.log(`Editando funcionário ID: ${id}`)
    // Aqui você pode navegar para uma página de edição
  }

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este funcionário?")) {
      try {
        const supabase = createClient()
        const { error } = await supabase.from("employees").update({ status: "inactive" }).eq("id", id)

        if (error) {
          console.error("Erro ao excluir funcionário:", error)
          alert("Erro ao excluir funcionário. Tente novamente.")
          return
        }

        // Reload the list
        loadFuncionarios()
      } catch (error) {
        console.error("Erro:", error)
        alert("Erro ao excluir funcionário. Tente novamente.")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Lista de Funcionários
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Visualize e gerencie todos os funcionários cadastrados</p>
        </div>

        {/* Barra de Busca */}
        <Card className="mb-6 border-2 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nome, crachá ou código de acesso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-300 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Funcionários */}
        <div className="grid gap-4">
          {funcionariosFiltrados.length === 0 ? (
            <Card className="border-2 border-gray-200 dark:border-gray-700">
              <CardContent className="p-8 text-center">
                <UserIcon className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm
                    ? "Nenhum funcionário encontrado com os critérios de busca."
                    : "Nenhum funcionário cadastrado ainda. Use o formulário de cadastro para adicionar funcionários."}
                </p>
                {!searchTerm && funcionarios.length === 0 && (
                  <Button
                    onClick={() => router.push("/painel-administrativo/cadastro-colaborador")}
                    className="mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                  >
                    Cadastrar Primeiro Funcionário
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            funcionariosFiltrados.map((funcionario) => (
              <Card
                key={funcionario.id}
                className="border-2 border-blue-200 dark:border-blue-800 hover:border-cyan-300 dark:hover:border-cyan-600 transition-colors"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                        <UserIcon className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-blue-700 dark:text-blue-300">{funcionario.nomeCompleto}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Crachá: {funcionario.numeroCracha}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(funcionario.id)}
                        className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(funcionario.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Data de Nascimento:</span>
                      <p className="text-gray-600 dark:text-gray-400">{funcionario.dataNascimento}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Supervisor:</span>
                      <p className="text-gray-600 dark:text-gray-400">{funcionario.supervisor}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Turno:</span>
                      <p className="text-gray-600 dark:text-gray-400">{funcionario.turno}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Líder do Turno:</span>
                      <p className="text-gray-600 dark:text-gray-400">{funcionario.liderTurno}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Código de Acesso:</span>
                      <p className="text-gray-600 dark:text-gray-400 font-mono">{funcionario.codigoAcesso}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Estatísticas */}
        <Card className="mt-6 border-2 border-cyan-200 dark:border-cyan-800">
          <CardHeader>
            <CardTitle className="text-cyan-700 dark:text-cyan-300">Estatísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{funcionarios.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Funcionários</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {funcionarios.filter((f) => f.turno === "Manhã").length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Turno Manhã</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {funcionarios.filter((f) => f.turno === "Tarde").length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Turno Tarde</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {funcionarios.filter((f) => f.turno === "Noite").length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Turno Noite</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-blue-200 dark:border-gray-700 p-4 mt-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">© 2024 JBS - Sistema de Controle de Ponto</p>
        </div>
      </footer>
    </div>
  )
}
