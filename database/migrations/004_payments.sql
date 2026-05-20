-- database/migrations/004_create_payments_table.sql
-- Requiere: 001_create_users_table.sql, 002_create_plans_table.sql

CREATE TABLE IF NOT EXISTS `payments` (
    `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id`      INT UNSIGNED NOT NULL,
    `plan_id`      INT UNSIGNED NOT NULL,
    `amount`       DECIMAL(10,2) NOT NULL,
    `method`       ENUM('paypal','stripe','transferencia') NOT NULL,
    `status`       ENUM('pending','completed','failed','refunded') DEFAULT 'pending',
    `external_ref` VARCHAR(255) DEFAULT NULL,
    `notes`        TEXT DEFAULT NULL,
    `confirmed_at` DATETIME DEFAULT NULL,
    `created_at`   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`),
    INDEX `idx_user_id`    (`user_id`),
    INDEX `idx_plan_id`    (`plan_id`),
    INDEX `idx_status`     (`status`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de suscripciones (ligada a pagos)
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
    FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`),
    INDEX `idx_status`   (`status`),
    INDEX `idx_ends_at`  (`ends_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;