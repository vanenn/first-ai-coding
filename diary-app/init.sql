-- 数据库初始化脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS diary_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE diary_db;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    nickname VARCHAR(100),
    avatar VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建日记表
CREATE TABLE IF NOT EXISTS diaries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT,
    mood VARCHAR(50),
    weather VARCHAR(50),
    location VARCHAR(200),
    tags VARCHAR(500),
    image_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建索引以优化查询性能
CREATE INDEX idx_user_created ON diaries(user_id, created_at);
CREATE INDEX idx_user_mood ON diaries(user_id, mood);

-- 可选：插入演示数据
-- INSERT INTO users (username, password, email, nickname, avatar) VALUES
-- ('demo', '$2a$10$...', 'demo@example.com', '演示用户', 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo');
