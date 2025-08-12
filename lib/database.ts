import { createClient } from "@/lib/supabase/server"

export interface Employee {
  id: number
  badge_number: string
  full_name: string
  email?: string
  department?: string
  position?: string
  hire_date?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TimeRecord {
  id: number
  employee_id: number
  record_type: "entrada" | "saida" | "pausa_inicio" | "pausa_fim"
  record_time: string
  location?: string
  notes?: string
  created_at: string
}

export interface WorkSession {
  id: number
  employee_id: number
  work_date: string
  start_time?: string
  end_time?: string
  break_duration_minutes: number
  total_hours?: number
  overtime_hours: number
  status: "em_andamento" | "completo" | "incompleto"
  created_at: string
  updated_at: string
}

export interface AccessCode {
  id: number
  employee_id: number
  access_code: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Employee functions
export async function getEmployeeByBadge(badgeNumber: string): Promise<Employee | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("badge_number", badgeNumber)
    .eq("is_active", true)
    .single()

  if (error) {
    console.error("Error fetching employee:", error)
    return null
  }

  return data
}

export async function getEmployeeById(id: number): Promise<Employee | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("employees").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching employee:", error)
    return null
  }

  return data
}

// Access code functions
export async function validateAccessCode(employeeId: number, accessCode: string): Promise<boolean> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("access_codes")
    .select("*")
    .eq("employee_id", employeeId)
    .eq("access_code", accessCode)
    .eq("is_active", true)
    .single()

  if (error) {
    console.error("Error validating access code:", error)
    return false
  }

  return !!data
}

// Time record functions
export async function createTimeRecord(
  employeeId: number,
  recordType: TimeRecord["record_type"],
  location?: string,
  notes?: string,
): Promise<TimeRecord | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("time_records")
    .insert({
      employee_id: employeeId,
      record_type: recordType,
      record_time: new Date().toISOString(),
      location,
      notes,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating time record:", error)
    return null
  }

  return data
}

export async function getTimeRecordsByEmployee(employeeId: number, date?: string): Promise<TimeRecord[]> {
  const supabase = createClient()

  let query = supabase
    .from("time_records")
    .select("*")
    .eq("employee_id", employeeId)
    .order("record_time", { ascending: false })

  if (date) {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    query = query.gte("record_time", startOfDay.toISOString()).lte("record_time", endOfDay.toISOString())
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching time records:", error)
    return []
  }

  return data || []
}

// Work session functions
export async function getOrCreateWorkSession(employeeId: number, workDate: string): Promise<WorkSession | null> {
  const supabase = createClient()

  // Try to get existing session
  const { data: existing, error: fetchError } = await supabase
    .from("work_sessions")
    .select("*")
    .eq("employee_id", employeeId)
    .eq("work_date", workDate)
    .single()

  if (existing) {
    return existing
  }

  // Create new session if not found
  const { data, error } = await supabase
    .from("work_sessions")
    .insert({
      employee_id: employeeId,
      work_date: workDate,
      status: "em_andamento",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating work session:", error)
    return null
  }

  return data
}

export async function updateWorkSession(sessionId: number, updates: Partial<WorkSession>): Promise<WorkSession | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("work_sessions")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sessionId)
    .select()
    .single()

  if (error) {
    console.error("Error updating work session:", error)
    return null
  }

  return data
}
