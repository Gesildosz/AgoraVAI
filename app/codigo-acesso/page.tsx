"use client"

import type React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image" // Added Image import for JBS logo
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const LockKeyholeIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="16" r="1" />
    <rect x="3" y="10" width="18" height="12" rx="2" />
    <path d="m7 10 0-3a5 5 0 0 1 10 0v3" />
  </svg>
)

const ArrowLeftIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
)

const ShieldIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 13c0 5-3.5 7.5-8 10.5C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6-2 1.5.8 4 2 6 2a1 1 0 0 1 1 1z" />
  </svg>
)

const UserIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const CalendarIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
)

const IdCardIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="12" x="3" y="4" rx="2" />
    <circle cx="12" cy="10" r="2" />
    <path d="m7 16 10 0" />
  </svg>
)

const KeyIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="7.5" cy="15.5" r="5.5" />
    <path d="m21 2-9.6 9.6" />
    <path d="m15.5 7.5 3 3L22 7l-3-3" />
  </svg>
)

export default function CodigoAcessoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  const [badgeNumber, setBadgeNumber] = useState("")
  const [accessCode, setAccessCode] = useState("")
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  const [showVerificationForm, setShowVerificationForm] = useState(false)
  const [verificationData, setVerificationData] = useState({
    fullName: "",
    birthDate: "",
    badgeNumber: "",
    accessCode: "",
  })
  const [showSupportRequest, setShowSupportRequest] = useState(false)

  useEffect(() => {
    const crachaFromUrl = searchParams.get("cracha")
    const crachaFromStorage = typeof window !== "undefined" ? sessionStorage.getItem("badgeNumber") : null
    const finalCracha = crachaFromUrl || crachaFromStorage || ""
    setBadgeNumber(finalCracha)
  }, [searchParams])

  useEffect(() => {
    setVerificationData((prev) => ({
      ...prev,
      badgeNumber: badgeNumber,
    }))
  }, [badgeNumber])

  const getRegisteredEmployees = async () => {
    try {
      const { data: employees, error } = await supabase.from("employees").select("*").eq("status", "active")

      if (error) throw error
      return employees || []
    } catch (error) {
      console.error("Error fetching employees:", error)
      return []
    }
  }

  const getValidCodes = async () => {
    const staticCodes = {
      "220001228": "347568", // Admin code
    }

    const registeredEmployees = await getRegisteredEmployees()
    const dynamicCodes: { [key: string]: string } = {}

    registeredEmployees.forEach((employee: any) => {
      dynamicCodes[employee.badge_number] = employee.access_code
    })

    return { ...staticCodes, ...dynamicCodes }
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!accessCode.trim()) {
      setErrorMessage("Por favor, insira o código de acesso")
      return
    }

    console.log("Badge Number:", badgeNumber)
    console.log("Access Code:", accessCode)

    const validCodes = await getValidCodes()
    const expectedCode = validCodes[badgeNumber as keyof typeof validCodes]

    if (accessCode === expectedCode) {
      setErrorMessage("")
      setFailedAttempts(0)

      const registeredEmployees = await getRegisteredEmployees()
      const currentEmployee = registeredEmployees.find((emp: any) => emp.badge_number === badgeNumber)

      if (currentEmployee) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "currentEmployee",
            JSON.stringify({
              name: currentEmployee.full_name,
              badge: currentEmployee.badge_number,
              birthDate: currentEmployee.birth_date,
              supervisor: currentEmployee.supervisor,
              shift: currentEmployee.shift,
              shiftLeader: currentEmployee.shift_leader,
              accessCode: currentEmployee.access_code,
            }),
          )
        }
      } else if (badgeNumber === "220001228") {
        // Dados do admin para fallback
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "currentEmployee",
            JSON.stringify({
              name: "Administrador",
              badge: "220001228",
              birthDate: "1985-05-20",
              supervisor: "Sistema",
              shift: "Administrativo",
              shiftLeader: "N/A",
              accessCode: "347568",
            }),
          )
        }
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "currentUser",
          JSON.stringify({
            badgeNumber,
            isAdmin: badgeNumber === "220001228",
            loginTime: new Date().toISOString(),
            employeeData: currentEmployee || null,
          }),
        )
      }

      if (badgeNumber === "220001228") {
        router.push("/painel-administrativo")
      } else {
        router.push("/dashboard")
      }
    } else {
      const newFailedAttempts = failedAttempts + 1
      setFailedAttempts(newFailedAttempts)
      setErrorMessage(`Código inválido. Tentativa ${newFailedAttempts} de 3`)

      if (newFailedAttempts >= 3) {
        setShowVerificationForm(true)
        setErrorMessage("Muitas tentativas falharam. Complete a verificação abaixo.")
      }
    }
  }

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const registeredEmployees = getRegisteredEmployees()
    const registeredEmployee = registeredEmployees.find((emp: any) => emp.badge_number === badgeNumber)

    const staticData = {
      "220001228": {
        fullName: "Administrador",
        birthDate: "1985-05-20",
        accessCode: "347568",
      },
    }

    const expectedData = registeredEmployee
      ? {
          fullName: registeredEmployee.full_name,
          birthDate: registeredEmployee.birth_date,
          accessCode: registeredEmployee.access_code,
        }
      : staticData[badgeNumber as keyof typeof staticData]

    if (
      expectedData &&
      verificationData.fullName.toLowerCase() === expectedData.fullName.toLowerCase() &&
      verificationData.birthDate === expectedData.birthDate &&
      verificationData.badgeNumber === badgeNumber &&
      verificationData.accessCode === expectedData.accessCode
    ) {
      setShowSupportRequest(true)
      setErrorMessage("")
    } else {
      setErrorMessage("Dados de verificação incorretos. Tente novamente.")
    }
  }

  const handleAccessCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6) // Only numbers, max 6 digits
    setAccessCode(value)
  }

  const handleVerificationChange = (field: string, value: string) => {
    setVerificationData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (!badgeNumber) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
        <Card className="w-full max-w-md p-6 text-center">
          <CardContent>
            <p className="text-red-600 mb-4">Erro: Número do crachá não encontrado.</p>
            <Button onClick={() => router.push("/")} className="w-full">
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col min-h-screen items-center justify-between p-4 sm:p-6 md:p-8 
                    bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-blue-950 text-gray-900 dark:text-gray-100"
    >
      {/* Header */}
      <header className="w-full max-w-md flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-blue-700 dark:text-cyan-300 hover:text-blue-900 dark:hover:text-cyan-100"
        >
          <div className="w-4 h-4">
            <ArrowLeftIcon />
          </div>
          Voltar
        </Button>
        <div className="h-12 flex items-center justify-center">
          <Image src="/images/jbs-logo.png" alt="JBS Logo" width={96} height={48} className="object-contain" />
        </div>
        <div className="w-16"></div> {/* Spacer for centering */}
      </header>

      <main className="flex flex-col items-center justify-center flex-grow w-full max-w-md mx-auto space-y-8">
        {!showSupportRequest ? (
          <div className="relative w-full p-4 rounded-3xl shadow-lg">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-6 bg-gradient-to-r from-blue-800 to-cyan-600 rounded-b-lg z-10 shadow-md"></div>
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-700 rounded-full z-20 shadow-inner"></div>

            <Card
              className="w-full p-8 rounded-2xl shadow-2xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900
                           relative overflow-hidden card-border-draw"
              style={{ borderImage: "linear-gradient(45deg, #1e3a8a, #0891b2) 1", border: "4px solid" }}
            >
              {!showVerificationForm ? (
                <>
                  <CardHeader className="pb-6 text-center">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-cyan-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
                      <div className="w-10 h-10 text-blue-800">
                        <ShieldIcon />
                      </div>
                      Código de Acesso
                    </CardTitle>
                    <p className="text-sm text-blue-600 dark:text-cyan-400 mt-2">
                      Crachá: {badgeNumber} - Digite seu código de acesso
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-8 p-8 pt-0">
                    <form onSubmit={handleCodeSubmit} className="space-y-8">
                      <div className="space-y-3">
                        <Label
                          htmlFor="access-code"
                          className="text-base text-blue-800 dark:text-cyan-300 flex items-center gap-2"
                        >
                          <div className="w-5 h-5 text-cyan-600 dark:text-cyan-400">
                            <LockKeyholeIcon />
                          </div>
                          Código de Acesso
                        </Label>
                        <Input
                          id="access-code"
                          type="password"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="••••••"
                          value={accessCode}
                          onChange={handleAccessCodeChange}
                          className="h-14 text-center text-2xl tracking-widest border-2 border-cyan-300 dark:border-cyan-600 
                                   focus:ring-blue-800 focus:border-blue-800 bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-cyan-100"
                          maxLength={6}
                          required
                        />
                        {errorMessage && <p className="text-sm text-red-600 dark:text-red-400 mt-2">{errorMessage}</p>}
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-800 to-cyan-600 hover:from-blue-900 hover:to-cyan-700 text-white
                                 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                      >
                        <div className="w-5 h-5">
                          <LockKeyholeIcon />
                        </div>
                        Confirmar Acesso
                      </Button>
                    </form>
                  </CardContent>
                </>
              ) : (
                <>
                  <CardHeader className="pb-6 text-center">
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
                      <div className="w-8 h-8 text-orange-600">
                        <ShieldIcon />
                      </div>
                      Verificação de Cadastro
                    </CardTitle>
                    <p className="text-sm text-blue-600 dark:text-cyan-400 mt-2">
                      Complete todos os campos para verificação
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6 p-8 pt-0">
                    <form onSubmit={handleVerificationSubmit} className="space-y-6">
                      <div className="space-y-3">
                        <Label
                          htmlFor="full-name"
                          className="text-sm text-blue-800 dark:text-cyan-300 flex items-center gap-2"
                        >
                          <div className="w-4 h-4 text-cyan-600 dark:text-cyan-400">
                            <UserIcon />
                          </div>
                          Nome Completo
                        </Label>
                        <Input
                          id="full-name"
                          type="text"
                          placeholder="Digite seu nome completo"
                          value={verificationData.fullName}
                          onChange={(e) => handleVerificationChange("fullName", e.target.value)}
                          className="h-12 border-2 border-orange-300 dark:border-orange-600 focus:ring-orange-500 focus:border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="birth-date"
                          className="text-sm text-blue-800 dark:text-cyan-300 flex items-center gap-2"
                        >
                          <div className="w-4 h-4 text-cyan-600 dark:text-cyan-400">
                            <CalendarIcon />
                          </div>
                          Data de Nascimento
                        </Label>
                        <Input
                          id="birth-date"
                          type="date"
                          value={verificationData.birthDate}
                          onChange={(e) => handleVerificationChange("birthDate", e.target.value)}
                          className="h-12 border-2 border-orange-300 dark:border-orange-600 focus:ring-orange-500 focus:border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                          required
                        />
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="badge-verify"
                          className="text-sm text-blue-800 dark:text-cyan-300 flex items-center gap-2"
                        >
                          <div className="w-4 h-4 text-cyan-600 dark:text-cyan-400">
                            <IdCardIcon />
                          </div>
                          Número do Crachá
                        </Label>
                        <Input
                          id="badge-verify"
                          type="text"
                          value={verificationData.badgeNumber}
                          onChange={(e) => handleVerificationChange("badgeNumber", e.target.value)}
                          className="h-12 border-2 border-cyan-300 dark:border-cyan-600 focus:ring-blue-800 focus:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
                          readOnly
                        />
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="code-verify"
                          className="text-sm text-blue-800 dark:text-cyan-300 flex items-center gap-2"
                        >
                          <div className="w-4 h-4 text-cyan-600 dark:text-cyan-400">
                            <KeyIcon />
                          </div>
                          Código de Acesso
                        </Label>
                        <Input
                          id="code-verify"
                          type="password"
                          inputMode="numeric"
                          placeholder="••••••"
                          value={verificationData.accessCode}
                          onChange={(e) =>
                            handleVerificationChange("accessCode", e.target.value.replace(/\D/g, "").slice(0, 6))
                          }
                          className="h-12 text-center tracking-widest border-2 border-orange-300 dark:border-orange-600 
                                   focus:ring-orange-500 focus:border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                          maxLength={6}
                          required
                        />
                      </div>

                      {errorMessage && <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>}

                      <Button
                        type="submit"
                        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 text-white
                                 transition-all duration-300 shadow-lg"
                      >
                        Verificar Dados
                      </Button>
                    </form>
                  </CardContent>
                </>
              )}
            </Card>
          </div>
        ) : (
          <Card className="w-full max-w-md p-6 rounded-2xl shadow-2xl border-4 border-green-500 dark:border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
                <div className="w-8 h-8 text-green-600">
                  <ShieldIcon />
                </div>
                Verificação Enviada
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-blue-800 dark:text-cyan-300">
                Seus dados foram verificados com sucesso. Uma solicitação foi enviada para o suporte técnico.
              </p>
              <p className="text-sm text-blue-600 dark:text-cyan-400">
                Aguarde o contato da equipe de suporte para liberação do acesso.
              </p>
              <Button
                onClick={() => router.push("/")}
                className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
              >
                Voltar ao Início
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="w-full max-w-md text-center text-sm text-blue-700 dark:text-cyan-400 py-4">
        <p>&copy; {new Date().getFullYear()} JBS. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
