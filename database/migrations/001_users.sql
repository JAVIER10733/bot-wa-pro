-- database/migrations/001_create_users_table.sql

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
    INDEX `idx_email`  (`email`),
    INDEX `idx_role`   (`role`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin por defecto (contraseña: Admin1234!)
INSERT INTO `users` (`name`, `email`, `password`, `role`, `status`) VALUES
('Administrador', 'admin@botwa.pro', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active');