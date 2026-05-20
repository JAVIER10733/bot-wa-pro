-- database/migrations/003_create_bots_table.sql
-- Requiere: 001_create_users_table.sql

CREATE TABLE IF NOT EXISTS `bots` (
    `id`             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id`        INT UNSIGNED NOT NULL,
    `name`           VARCHAR(100) NOT NULL,
    `phone_number`   VARCHAR(20) NOT NULL,
    `status`         ENUM('active','inactive','paused','deleted') DEFAULT 'inactive',
    `messages_today` INT DEFAULT 0,
    `messages_total` BIGINT DEFAULT 0,
    `last_active`    DATETIME DEFAULT NULL,
    `created_at`     DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at`     DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_user_id`     (`user_id`),
    INDEX `idx_status`      (`status`),
    INDEX `idx_phone`       (`phone_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;