-- Creating employees table for badge authentication and employee data
CREATE TABLE IF NOT EXISTS employees (
    id BIGSERIAL PRIMARY KEY,
    badge_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    department VARCHAR(100),
    position VARCHAR(100),
    hire_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists before creating new one
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON employees;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON employees
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample employee for testing
INSERT INTO employees (badge_number, full_name, email, department, position, hire_date) 
VALUES ('123456', 'João Silva', 'joao.silva@empresa.com', 'TI', 'Desenvolvedor', '2024-01-15')
ON CONFLICT (badge_number) DO NOTHING;

-- Adding new employee "teste" with badge number 220001228
INSERT INTO employees (badge_number, full_name, email, department, position, hire_date) 
VALUES ('220001228', 'Teste', 'teste@empresa.com', 'Recursos Humanos', 'Analista', '2024-01-10')
ON CONFLICT (badge_number) DO NOTHING;
