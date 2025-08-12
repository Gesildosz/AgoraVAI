-- Creating work sessions table for calculated work periods
CREATE TABLE IF NOT EXISTS work_sessions (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    work_date DATE NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    break_duration_minutes INTEGER DEFAULT 0,
    total_hours DECIMAL(4,2),
    overtime_hours DECIMAL(4,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'em_andamento' CHECK (status IN ('em_andamento', 'completo', 'incompleto')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(employee_id, work_date)
);

-- Enable Row Level Security
ALTER TABLE work_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policy before creating new one to avoid duplicate error
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON work_sessions;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON work_sessions
    FOR ALL USING (auth.role() = 'authenticated');

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_work_sessions_employee_date 
ON work_sessions(employee_id, work_date);
