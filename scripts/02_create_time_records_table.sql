-- Creating time records table for punch in/out tracking
CREATE TABLE IF NOT EXISTS time_records (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    record_type VARCHAR(20) NOT NULL CHECK (record_type IN ('entrada', 'saida', 'pausa_inicio', 'pausa_fim')),
    record_time TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance on queries
CREATE INDEX IF NOT EXISTS idx_time_records_employee_date 
ON time_records(employee_id, DATE(record_time));

CREATE INDEX IF NOT EXISTS idx_time_records_type 
ON time_records(record_type);
