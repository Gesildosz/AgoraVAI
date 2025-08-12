-- Creating time records table for punch in/out tracking
CREATE TABLE IF NOT EXISTS time_records (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    record_type VARCHAR(20) NOT NULL CHECK (record_type IN ('entrada', 'saida', 'pausa_inicio', 'pausa_fim')),
    record_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE time_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON time_records;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON time_records
    FOR ALL USING (auth.role() = 'authenticated');

-- Create indexes for better performance on queries
-- Removido índice com expressão de data para evitar erro IMMUTABLE
CREATE INDEX IF NOT EXISTS idx_time_records_employee_time 
ON time_records(employee_id, record_time);

CREATE INDEX IF NOT EXISTS idx_time_records_type 
ON time_records(record_type);
