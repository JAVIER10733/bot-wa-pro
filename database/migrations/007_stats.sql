-- database/migrations/007_create_stats_table.sql
-- Requiere: 001_create_users_table.sql, 003_create_bots_table.sql

-- Estadísticas diarias por bot
CREATE TABLE IF NOT EXISTS `bot_stats` (
    `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `bot_id`         INT UNSIGNED NOT NULL,
    `user_id`        INT UNSIGNED NOT NULL,
    `date`           DATE NOT NULL,
    `messages_sent`  INT DEFAULT 0,
    `messages_recv`  INT DEFAULT 0,
    `errors`         INT DEFAULT 0,
    `uptime_minutes` INT DEFAULT 0,
    `created_at`     DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`bot_id`)  REFERENCES `bots`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_bot_date` (`bot_id`, `date`),
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_date`    (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Estadísticas globales de la plataforma (para el admin)
CREATE TABLE IF NOT EXISTS `platform_stats` (
    `id`               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `date`             DATE NOT NULL UNIQUE,
    `total_users`      INT DEFAULT 0,
    `new_users`        INT DEFAULT 0,
    `active_bots`      INT DEFAULT 0,
    `total_messages`   BIGINT DEFAULT 0,
    `total_revenue`    DECIMAL(10,2) DEFAULT 0.00,
    `new_payments`     INT DEFAULT 0,
    `open_tickets`     INT DEFAULT 0,
    `created_at`       DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Logs de actividad del sistema
CREATE TABLE IF NOT EXISTS `activity_logs` (
    `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id`    INT UNSIGNED DEFAULT NULL,
    `action`     VARCHAR(100) NOT NULL,
    `entity`     VARCHAR(50) DEFAULT NULL,
    `entity_id`  INT UNSIGNED DEFAULT NULL,
    `ip_address` VARCHAR(45) DEFAULT NULL,
    `user_agent` VARCHAR(255) DEFAULT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    INDEX `idx_user_id`   (`user_id`),
    INDEX `idx_action`    (`action`),
    INDEX `idx_created_at`(`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;