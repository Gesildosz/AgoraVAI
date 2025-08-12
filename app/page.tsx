"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

export default function HomePage() {
  const router = useRouter()
  const [badgeNumber, setBadgeNumber] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!badgeNumber.trim()) {
      setErrorMessage("Por favor, insira o número do crachá")
      return
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem("badgeNumber", badgeNumber)
    }
    router.push("/codigo-acesso")
  }

  const handleBadgeNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "") // Remove all non-digit characters
    setBadgeNumber(value)
    setErrorMessage("") // Clear error when user starts typing
  }

  return (
    <div
      className="flex flex-col min-h-screen items-center justify-between p-4 sm:p-6 md:p-8 
                    bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-blue-950 text-gray-900 dark:text-gray-100"
    >
      <main className="flex flex-col items-center justify-center flex-grow w-full max-w-md mx-auto space-y-8 py-8">
        <div className="w-full text-center mb-8">
          <div className="h-20 flex items-center justify-center">
            <Image
              src="/images/jbs-logo.png"
              alt="JBS Logo"
              width={160}
              height={80}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Badge Number Input Section - Styled as a Badge with Cord and Gray Surround */}
        <div
          className="relative w-full p-4 rounded-3xl 
                     shadow-lg"
        >
          {/* Cordão do Crachá */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-6 bg-gradient-to-r from-blue-800 to-cyan-600 rounded-b-lg z-10 shadow-md"></div>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-700 rounded-full z-20 shadow-inner"></div>

          <Card
            className="w-full p-8 rounded-2xl shadow-2xl 
                       border-4 border-gradient-to-r from-blue-800 to-cyan-500 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900
                       relative overflow-hidden card-border-draw"
            style={{ borderImage: "linear-gradient(45deg, #1e3a8a, #0891b2) 1" }}
          >
            <CardHeader className="pb-6 text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-cyan-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
                <div className="w-10 h-10 text-blue-800">
                  <IdCardIcon />
                </div>
                Sistema de Ponto
              </CardTitle>
              <p className="text-sm text-blue-600 dark:text-cyan-400 mt-2">Insira o número do seu crachá</p>
            </CardHeader>

            <CardContent className="space-y-8 p-8 pt-0">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <Label
                    htmlFor="badge-number"
                    className="text-base text-blue-800 dark:text-cyan-300 flex items-center gap-2"
                  >
                    <div className="w-5 h-5 text-cyan-600 dark:text-cyan-400">
                      <IdCardIcon />
                    </div>
                    Número do Crachá
                  </Label>
                  <Input
                    id="badge-number"
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Ex: 123456"
                    value={badgeNumber}
                    onChange={handleBadgeNumberChange}
                    className="h-14 text-base border-2 border-cyan-300 dark:border-cyan-600 focus:ring-blue-800 focus:border-blue-800 
                               bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-cyan-100 placeholder:text-blue-400 dark:placeholder:text-cyan-500"
                    required
                  />
                </div>

                {errorMessage && <p className="text-sm text-red-600 dark:text-red-400 mt-2">{errorMessage}</p>}

                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-800 to-cyan-600 hover:from-blue-900 hover:to-cyan-700 text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                >
                  <div className="w-5 h-5">
                    <IdCardIcon />
                  </div>
                  Continuar
                </Button>
              </form>

              {/* Link para painel administrativo */}
              {/* Link para painel administrativo - OCULTO */}
              {/*
              <div className="text-center pt-4 border-t border-blue-200 dark:border-blue-700">
                <Link
                  href="/painel-administrativo"
                  className="text-sm text-blue-600 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-300 hover:underline transition-colors"
                >
                  Acesso Administrativo
                </Link>
              </div>
              */}
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="w-full text-center text-sm md:text-base text-blue-700 dark:text-cyan-400 py-4">
        <p>&copy; {new Date().getFullYear()} JBS. Todos os direitos reservados.</p>
        <p>Sistema de Ponto - Versão 1.0.0</p>
      </footer>
    </div>
  )
}
