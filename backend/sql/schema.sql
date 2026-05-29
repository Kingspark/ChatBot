CREATE DATABASE IF NOT EXISTS chatbot_db CHARACTER
SET
    utf8mb4 COLLATE utf8mb4_unicode_ci;

USE chatbot_db;

CREATE TABLE
    IF NOT EXISTS conversations (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        role ENUM ('user', 'assistant') NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;