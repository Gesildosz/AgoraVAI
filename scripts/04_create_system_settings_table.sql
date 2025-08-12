-- Creating system settings table for configurable parameters
CREATE TABLE IF NOT EXISTS system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('daily_work_hours', '8', 'Horas de trabalho padrão por dia'),
('break_duration_minutes', '60', 'Duração padrão do intervalo em minutos'),
('overtime_threshold', '8', 'Limite de horas antes de considerar hora extra'),
('max_login_attempts', '3', 'Máximo de tentativas de login antes de mostrar esqueci senha')
ON CONFLICT (setting_key) DO NOTHING;
