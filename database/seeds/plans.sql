-- database/seeds/plans.sql
-- Seed para los planes de BotWA Pro

INSERT INTO `plans` (`name`, `description`, `price`, `features`, `max_numbers`, `max_messages_day`) VALUES
('Starter', 'Perfecto para empezar a automatizar WhatsApp', 15.00,
 '["1 número de WhatsApp","500 mensajes/día","API Baileys incluida","Soporte por email"]',
 1, 500),

('Pro', 'Para negocios en crecimiento', 35.00,
 '["3 números de WhatsApp","5000 mensajes/día","Multi-dispositivo","Anti-bloqueo avanzado","Soporte prioritario"]',
 3, 5000),

('Business', 'Solución completa sin límites', 75.00,
 '["Números ilimitados","Mensajes ilimitados","Servidor dedicado","CRM integrado","Soporte 24/7 WhatsApp"]',
 999, 999999);
