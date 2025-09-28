-- employees table
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    role VARCHAR(50) DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO employees (name, email, role)
VALUES ('Admin User', 'admin@wfh.com', 'admin')
ON CONFLICT (email) DO NOTHING;
