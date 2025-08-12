-- Tabela para códigos de acesso dos colaboradores
CREATE TABLE IF NOT EXISTS access_codes (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    access_code VARCHAR(10) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint para garantir unicidade por employee_id
    UNIQUE(employee_id)
);

-- Enable Row Level Security
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;

-- Drop existing policy before creating new one to avoid duplicate error
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON access_codes;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON access_codes
    FOR ALL USING (auth.role() = 'authenticated');

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_access_codes_employee_id ON access_codes(employee_id);
CREATE INDEX IF NOT EXISTS idx_access_codes_code ON access_codes(access_code);

-- Inserir códigos de acesso para os colaboradores existentes
INSERT INTO access_codes (employee_id, access_code) VALUES
(1, '1234'), -- João Silva (crachá 123456)
(2, '5678') -- teste (crachá 220001228)
ON CONFLICT (employee_id) DO NOTHING;
