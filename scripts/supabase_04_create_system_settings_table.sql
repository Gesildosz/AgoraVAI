-- Creating system_settings table for configurable parameters
CREATE TABLE IF NOT EXISTS system_settings (
    id BIGSERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policy before creating new one to avoid duplicates
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON system_settings;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON system_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('daily_work_hours', '8', 'Horas de trabalho padrão por dia'),
('break_duration_minutes', '60', 'Duração padrão do intervalo em minutos'),
('overtime_threshold', '8', 'Limite de horas antes de considerar hora extra'),
('max_login_attempts', '3', 'Máximo de tentativas de login antes de mostrar esqueci senha')
ON CONFLICT (setting_key) DO NOTHING;
