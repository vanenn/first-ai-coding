USE diary_db;

DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS diaries;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    nickname VARCHAR(255),
    avatar VARCHAR(255),
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE diaries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT,
    mood VARCHAR(255),
    weather VARCHAR(255),
    location VARCHAR(255),
    tags VARCHAR(255),
    image_url VARCHAR(255),
    visibility VARCHAR(20) DEFAULT 'PUBLIC' NOT NULL,
    views BIGINT DEFAULT 0 NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6),
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE likes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    diary_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    UNIQUE KEY uk_diary_user (diary_id, user_id),
    FOREIGN KEY (diary_id) REFERENCES diaries(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    diary_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6),
    FOREIGN KEY (diary_id) REFERENCES diaries(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建索引以提高查询性能
CREATE INDEX idx_diaries_user_id ON diaries(user_id);
CREATE INDEX idx_diaries_visibility ON diaries(visibility);
CREATE INDEX idx_diaries_created_at ON diaries(created_at);
CREATE INDEX idx_likes_diary_id ON likes(diary_id);
CREATE INDEX idx_comments_diary_id ON comments(diary_id);
