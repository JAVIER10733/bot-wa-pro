-- Tabla principal de planes con categorías
CREATE TABLE IF NOT EXISTS plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    category ENUM('subscription', 'vps', 'dedicated', 'whatsapp_bot', 'hosting', 'license', 'addon') NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    billing_cycle ENUM('monthly', 'yearly', 'one-time') DEFAULT 'monthly',
    currency VARCHAR(3) DEFAULT 'USD',
    features JSON,
    specs JSON,
    max_numbers INT DEFAULT 1,
    max_messages_day INT DEFAULT 500,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    discount_percent INT DEFAULT 0,
    cta_text VARCHAR(50) DEFAULT 'Comenzar',
    cta_link VARCHAR(255),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_active (is_active),
    INDEX idx_featured (is_featured),
    INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos de ejemplo para cada categoría
INSERT INTO plans (name, slug, category, description, price, billing_cycle, features, specs, is_featured, discount_percent, cta_text, cta_link, sort_order) VALUES
-- Suscripciones
('Starter', 'starter', 'subscription', 'Para proyectos pequeños. Incluye 1 servidor, métricas básicas.', 3.00, 'monthly', '["1 Servidor", "Métricas básicas", "Soporte email"]', '{"servers": 1, "metrics": "basic"}', FALSE, 0, 'Comenzar', 'register.html?plan=starter', 1),
('Básico', 'basic', 'subscription', 'Ideal para equipos pequeños. 5 servidores, acceso a API.', 10.00, 'monthly', '["5 Servidores", "Acceso API", "Historial 7 días"]', '{"servers": 5, "api": true, "history_days": 7}', FALSE, 0, 'Comenzar', 'register.html?plan=basic', 2),
('Pro', 'pro', 'subscription', 'Soporte 24/7, múltiples servidores, facturación avanzada.', 80.00, 'monthly', '["Soporte 24/7", "Servidores ilimitados", "Facturación avanzada"]', '{"support": "24/7", "billing": "advanced"}', FALSE, 0, 'Comenzar', 'register.html?plan=pro', 3),
('Business', 'business', 'subscription', 'Todo incluido para empresas en crecimiento.', 199.00, 'monthly', '["50 Servidores", "Monitoreo avanzado", "SLA 99.9%"]', '{"servers": 50, "monitoring": "advanced", "sla": "99.9"}', TRUE, 0, 'Comenzar', 'register.html?plan=business', 4),

-- VPS
('VPS Micro', 'vps-micro', 'vps', 'El plan más económico para despliegues y pruebas ligeras.', 7.99, 'monthly', '["Tráfico 1 TB", "IP Dedicada", "Acceso Root"]', '{"cpu": "1 Core", "ram": "2 GB", "storage": "40 GB SSD"}', FALSE, 0, 'Comprar', 'register.html?sku=VPS-MIC-001', 1),
('VPS Básico', 'vps-basic', 'vps', 'Servidor virtual privado ideal para proyectos pequeños.', 15.99, 'monthly', '["SSD Storage", "99.9% Uptime", "24/7 Support"]', '{"cpu": "2 Cores", "ram": "4 GB", "storage": "80 GB SSD"}', FALSE, 0, 'Comprar', 'register.html?sku=VPS-BAS-001', 2),
('VPS Avanzado', 'vps-advanced', 'vps', 'Servidor con mayor capacidad para aplicaciones exigentes.', 35.99, 'monthly', '["NVMe Storage", "99.99% Uptime", "Priority Support", "Free Backups"]', '{"cpu": "4 Cores", "ram": "8 GB", "storage": "160 GB NVMe"}', FALSE, 10, 'Comprar', 'register.html?sku=VPS-ADV-001', 3),

-- Bots WhatsApp
('Mini Chatbot', 'bot-mini', 'whatsapp_bot', 'Ideal para pequeños negocios y respuesta automática básica.', 29.00, 'monthly', '["Respuesta Automática (3 reglas)", "Integración Google Sheets", "Plantillas x5"]', '{"contacts": 500, "messages": "unlimited"}', FALSE, 0, 'Comenzar', 'register.html?sku=BOT-MINI-001', 1),
('Business Flow', 'bot-business', 'whatsapp_bot', 'Flujos conversacionales complejos para ventas y soporte.', 79.00, 'monthly', '["Flujos Ilimitados", "Integración CRM", "Multi-agente (5 usuarios)", "Métricas"]', '{"contacts": 5000, "messages": "unlimited", "agents": 5}', TRUE, 0, 'Comenzar', 'register.html?sku=BOT-BUS-001', 2);