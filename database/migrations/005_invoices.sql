-- database/migrations/005_create_invoices_table.sql
-- Requiere: 001_create_users_table.sql, 004_create_payments_table.sql

CREATE TABLE IF NOT EXISTS `invoices` (
    `id`          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id`     INT UNSIGNED NOT NULL,
    `payment_id`  INT UNSIGNED NOT NULL,
    `number`      VARCHAR(50) NOT NULL UNIQUE,
    `total`       DECIMAL(10,2) NOT NULL,
    `tax`         DECIMAL(10,2) DEFAULT 0.00,
    `subtotal`    DECIMAL(10,2) DEFAULT 0.00,
    `currency`    VARCHAR(3) DEFAULT 'USD',
    `status`      ENUM('draft','issued','paid','cancelled') DEFAULT 'issued',
    `pdf_path`    VARCHAR(255) DEFAULT NULL,
    `notes`       TEXT DEFAULT NULL,
    `issued_at`   DATETIME DEFAULT CURRENT_TIMESTAMP,
    `created_at`  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`)    REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`payment_id`) REFERENCES `payments`(`id`),
    INDEX `idx_user_id`    (`user_id`),
    INDEX `idx_number`     (`number`),
    INDEX `idx_status`     (`status`),
    INDEX `idx_issued_at`  (`issued_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;