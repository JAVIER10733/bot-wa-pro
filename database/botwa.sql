-- database/botwa.sql
-- BotWA Pro - Schema completo
-- Importar en phpMyAdmin sobre la base de datos botwa_pro

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- USUARIOS
-- ============================================
CREATE TABLE IF NOT EXISTS `users` (
    `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`         VARCHAR(100) NOT NULL,
    `email`        VARCHAR(150) NOT NULL UNIQUE,
    `password`     VARCHAR(255) NOT NULL,
    `role`         ENUM('admin','cliente') DEFAULT 'cliente',
    `status`       ENUM('active','inactive','banned') DEFAULT 'active',
    `avatar`       VARCHAR(255) DEFAULT NULL,
    `phone`        VARCHAR(20) DEFAULT NULL,
    `last_login`   DATETIME DEFAULT NULL,
    `created_at`   DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_email` (`email`),
    INDEX `idx_role`  (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- PLANES
-- ============================================
CREATE TABLE IF NOT EXISTS `plans` (
    `id`                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name`              VARCHAR(100) NOT NULL,
    `description`       TEXT DEFAULT NULL,
    `price`             DECIMAL(10,2) NOT NULL,
    `features`          JSON DEFAULT NULL,
    `max_numbers`       INT DEFAULT 1,
    `max_messages_day`  INT DEFAULT 500,
    `is_active`         TINYINT(1) DEFAULT 1,
    `created_at`        DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at`        DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- BOTS
-- ============================================
CREATE TABLE IF NOT EXISTS `bots` (
    `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id`        INT UNSIGNED NOT NULL,
    `name`           VARCHAR(100) NOT NULL,
    `phone_number`   VARCHAR(20) NOT NULL,
    `status`         ENUM('active','inactive','paused','deleted') DEFAULT 'inactive',
    `messages_today` INT DEFAULT 0,
    `last_active`    DATETIME DEFAULT NULL,
    `created_at`     DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at`     DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- PAGOS
-- ============================================
CREATE TABLE IF NOT EXISTS `payments` (
    `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id`      INT UNSIGNED NOT NULL,
    `plan_id`      INT UNSIGNED NOT NULL,
    `amount`       DECIMAL(10,2) NOT NULL,
    `method`       ENUM('paypal','stripe','transferencia') NOT NULL,
    `status`       ENUM('pending','completed','failed','refunded') DEFAULT 'pending',
    `external_ref` VARCHAR(255) DEFAULT NULL,
    `confirmed_at` DATETIME DEFAULT NULL,
    `created_at`   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`),
    INDEX `idx_user_id`  (`user_id`),
    INDEX `idx_status`   (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- SUSCRIPCIONES
-- ============================================
CREATE TABLE IF NOT EXISTS `subscriptions` (
    `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id`    INT UNSIGNED NOT NULL UNIQUE,
    `plan_id`    INT UNSIGNED NOT NULL,
    `payment_id` INT UNSIGNED NOT NULL,
    `status`     ENUM('active','expired','cancelled') DEFAULT 'active',
    `starts_at`  DATETIME NOT NULL,
    `ends_at`    DATETIME NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`)    REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`plan_id`)    REFERENCES `plans`(`id`),
    FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TICKETS DE SOPORTE
-- ============================================
CREATE TABLE IF NOT EXISTS `tickets` (
    `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id`    INT UNSIGNED NOT NULL,
    `subject`    VARCHAR(200) NOT NULL,
    `message`    TEXT NOT NULL,
    `status`     ENUM('open','in_progress','closed') DEFAULT 'open',
    `priority`   ENUM('low','medium','high') DEFAULT 'medium',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- FACTURAS
-- ============================================
CREATE TABLE IF NOT EXISTS `invoices` (
    `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id`     INT UNSIGNED NOT NULL,
    `payment_id`  INT UNSIGNED NOT NULL,
    `number`      VARCHAR(50) NOT NULL UNIQUE,
    `total`       DECIMAL(10,2) NOT NULL,
    `pdf_path`    VARCHAR(255) DEFAULT NULL,
    `created_at`  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`)    REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Admin por defecto (contraseña: Admin1234!)
INSERT INTO `users` (`name`, `email`, `password`, `role`, `status`) VALUES
('Administrador', 'admin@botwa.pro', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active'),
('Usuario Cliente', 'cliente@botwa.pro', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cliente', 'active');

-- Planes
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

SET FOREIGN_KEY_CHECKS = 1;