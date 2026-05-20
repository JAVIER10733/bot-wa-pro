-- database/migrations/006_create_tickets_table.sql
-- Requiere: 001_create_users_table.sql

CREATE TABLE IF NOT EXISTS `tickets` (
    `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id`     INT UNSIGNED NOT NULL,
    `subject`     VARCHAR(200) NOT NULL,
    `message`     TEXT NOT NULL,
    `status`      ENUM('open','in_progress','closed') DEFAULT 'open',
    `priority`    ENUM('low','medium','high') DEFAULT 'medium',
    `category`    ENUM('tecnico','facturacion','general') DEFAULT 'general',
    `admin_reply` TEXT DEFAULT NULL,
    `replied_at`  DATETIME DEFAULT NULL,
    `closed_at`   DATETIME DEFAULT NULL,
    `created_at`  DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_user_id`   (`user_id`),
    INDEX `idx_status`    (`status`),
    INDEX `idx_priority`  (`priority`),
    INDEX `idx_created_at`(`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Respuestas de tickets (historial de conversación)
CREATE TABLE IF NOT EXISTS `ticket_replies` (
    `id`         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `ticket_id`  INT UNSIGNED NOT NULL,
    `user_id`    INT UNSIGNED NOT NULL,
    `message`    TEXT NOT NULL,
    `is_admin`   TINYINT(1) DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`)   REFERENCES `users`(`id`) ON DELETE CASCADE,
    INDEX `idx_ticket_id` (`ticket_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;