-- Tabela para códigos de acesso dos colaboradores
CREATE TABLE IF NOT EXISTS access_codes (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    access_code VARCHAR(10) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Índices para performance
    UNIQUE(employee_id),
    INDEX idx_access_codes_employee_id (employee_id),
    INDEX idx_access_codes_code (access_code)
);

-- Inserir códigos de acesso para os colaboradores existentes
INSERT INTO access_codes (employee_id, access_code) VALUES
(1, '1234'), -- João Silva (crachá 123456)
(2, '5678'); -- teste (crachá 220001228)

-- Comentários para documentação
COMMENT ON TABLE access_codes IS 'Códigos de acesso dos colaboradores para autenticação em duas etapas';
COMMENT ON COLUMN access_codes.access_code IS 'Código numérico de 4 dígitos para acesso ao sistema';
COMMENT ON COLUMN access_codes.is_active IS 'Indica se o código está ativo e pode ser usado';
