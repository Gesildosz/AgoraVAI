-- Add admin user to employees table
INSERT INTO employees (
    badge_number,
    full_name,
    email,
    department,
    position,
    hire_date,
    is_active,
    birth_date,
    phone
) VALUES (
    '220001228',
    'teste',
    'admin@empresa.com',
    'Administração',
    'Administrador do Sistema',
    '2020-01-01',
    true,
    '1985-05-20',
    '(11) 99999-9999'
) ON CONFLICT (badge_number) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    department = EXCLUDED.department,
    position = EXCLUDED.position,
    is_active = EXCLUDED.is_active,
    birth_date = EXCLUDED.birth_date,
    phone = EXCLUDED.phone;

-- Add admin access code
INSERT INTO access_codes (
    badge_number,
    access_code,
    is_admin,
    created_at,
    updated_at
) VALUES (
    '220001228',
    '347568',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (badge_number) DO UPDATE SET
    access_code = EXCLUDED.access_code,
    is_admin = EXCLUDED.is_admin,
    updated_at = CURRENT_TIMESTAMP;
