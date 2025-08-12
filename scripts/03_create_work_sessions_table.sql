-- Creating work sessions table for calculated work periods
CREATE TABLE IF NOT EXISTS work_sessions (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    work_date DATE NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    break_duration_minutes INTEGER DEFAULT 0,
    total_hours DECIMAL(4,2),
    overtime_hours DECIMAL(4,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'em_andamento' CHECK (status IN ('em_andamento', 'completo', 'incompleto')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, work_date)
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_work_sessions_employee_date 
ON work_sessions(employee_id, work_date);
