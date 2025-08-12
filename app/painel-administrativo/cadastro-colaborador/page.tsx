"use client"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { createClient } from "@/lib/supabase"

const ArrowLeftIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7-7l-7 7 7 7" />
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

const SaveIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

export default function CadastroColaborador() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    numeroCracha: "",
    dataNascimento: "",
    supervisor: "",
    turno: "",
    liderTurno: "",
    codigoAcesso: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const supabase = createClient()

      const novoFuncionario = {
        full_name: formData.nomeCompleto,
        badge_number: formData.numeroCracha,
        birth_date: formData.dataNascimento,
        supervisor: formData.supervisor === "welton-andrade" ? "Welton Andrade" : "Arle Batista",
        shift: formData.turno.charAt(0).toUpperCase() + formData.turno.slice(1),
        shift_leader:
          {
            "gesildo-silva": "Gesildo Silva",
            "osmar-pereira": "Osmar Pereira",
            "edvaldo-oliveira": "Edvaldo Oliveira",
            "rimundo-ferreira": "Rimundo Ferreira",
          }[formData.liderTurno] || formData.liderTurno,
        access_code: formData.codigoAcesso,
        status: "active",
      }

      const { error } = await supabase.from("employees").insert([novoFuncionario])

      if (error) {
        console.error("Erro ao cadastrar funcionário:", error)
        alert("Erro ao cadastrar colaborador. Tente novamente.")
        return
      }

      alert("Colaborador cadastrado com sucesso!")
      router.push("/painel-administrativo/lista-funcionarios")
    } catch (error) {
      console.error("Erro:", error)
      alert("Erro ao cadastrar colaborador. Tente novamente.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b-4 border-gradient-to-r from-blue-600 to-cyan-600 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/painel-administrativo")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            >
              <ArrowLeftIcon />
              Voltar ao Painel
            </Button>
          </div>

          <div className="h-12 flex items-center justify-center">
            <Image src="/images/jbs-logo.png" alt="JBS Logo" width={128} height={48} className="object-contain" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-3">
              <UserPlusIcon />
              Cadastro de Colaborador
            </CardTitle>
            <p className="text-blue-100">Preencha os dados do novo colaborador</p>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome Completo */}
              <div className="space-y-2">
                <Label htmlFor="nomeCompleto" className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Nome Completo *
                </Label>
                <Input
                  id="nomeCompleto"
                  type="text"
                  value={formData.nomeCompleto}
                  onChange={(e) => handleInputChange("nomeCompleto", e.target.value)}
                  placeholder="Digite o nome completo do colaborador"
                  className="h-12 text-lg border-2 border-blue-200 focus:border-blue-500 dark:border-blue-700 dark:focus:border-blue-400"
                  required
                />
              </div>

              {/* Número Crachá */}
              <div className="space-y-2">
                <Label htmlFor="numeroCracha" className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Número do Crachá *
                </Label>
                <Input
                  id="numeroCracha"
                  type="text"
                  value={formData.numeroCracha}
                  onChange={(e) => handleInputChange("numeroCracha", e.target.value)}
                  placeholder="Digite o número do crachá"
                  className="h-12 text-lg border-2 border-blue-200 focus:border-blue-500 dark:border-blue-700 dark:focus:border-blue-400"
                  required
                />
              </div>

              {/* Data de Nascimento */}
              <div className="space-y-2">
                <Label htmlFor="dataNascimento" className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Data de Nascimento *
                </Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => handleInputChange("dataNascimento", e.target.value)}
                  className="h-12 text-lg border-2 border-blue-200 focus:border-blue-500 dark:border-blue-700 dark:focus:border-blue-400"
                  required
                />
              </div>

              {/* Supervisor */}
              <div className="space-y-2">
                <Label htmlFor="supervisor" className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Supervisor *
                </Label>
                <Select value={formData.supervisor} onValueChange={(value) => handleInputChange("supervisor", value)}>
                  <SelectTrigger className="h-12 text-lg border-2 border-blue-200 focus:border-blue-500 dark:border-blue-700 dark:focus:border-blue-400">
                    <SelectValue placeholder="Selecione o supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welton-andrade">Welton Andrade</SelectItem>
                    <SelectItem value="arle-batista">Arle Batista</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Turno */}
              <div className="space-y-2">
                <Label htmlFor="turno" className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Turno *
                </Label>
                <Select value={formData.turno} onValueChange={(value) => handleInputChange("turno", value)}>
                  <SelectTrigger className="h-12 text-lg border-2 border-blue-200 focus:border-blue-500 dark:border-blue-700 dark:focus:border-blue-400">
                    <SelectValue placeholder="Selecione o turno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manha">Manhã</SelectItem>
                    <SelectItem value="tarde">Tarde</SelectItem>
                    <SelectItem value="noite">Noite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Líder Turno */}
              <div className="space-y-2">
                <Label htmlFor="liderTurno" className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Líder do Turno *
                </Label>
                <Select value={formData.liderTurno} onValueChange={(value) => handleInputChange("liderTurno", value)}>
                  <SelectTrigger className="h-12 text-lg border-2 border-blue-200 focus:border-blue-500 dark:border-blue-700 dark:focus:border-blue-400">
                    <SelectValue placeholder="Selecione o líder do turno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gesildo-silva">Gesildo Silva</SelectItem>
                    <SelectItem value="osmar-pereira">Osmar Pereira</SelectItem>
                    <SelectItem value="edvaldo-oliveira">Edvaldo Oliveira</SelectItem>
                    <SelectItem value="rimundo-ferreira">Rimundo Ferreira</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Código de Acesso */}
              <div className="space-y-2">
                <Label htmlFor="codigoAcesso" className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Código de Acesso *
                </Label>
                <Input
                  id="codigoAcesso"
                  type="text"
                  value={formData.codigoAcesso}
                  onChange={(e) => handleInputChange("codigoAcesso", e.target.value)}
                  placeholder="Digite o código de acesso (4-6 dígitos)"
                  className="h-12 text-lg border-2 border-blue-200 focus:border-blue-500 dark:border-blue-700 dark:focus:border-blue-400"
                  maxLength={6}
                  required
                />
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/painel-administrativo")}
                  className="flex-1 h-12 text-lg border-2 border-gray-300 hover:border-gray-400"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 text-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white flex items-center gap-2"
                >
                  <SaveIcon />
                  Cadastrar Colaborador
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 mt-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">© 2024 JBS - Sistema de Ponto Eletrônico</p>
        </div>
      </footer>
    </div>
  )
}
