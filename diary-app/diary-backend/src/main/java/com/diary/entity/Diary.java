package com.diary.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "diaries")
public class Diary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "LONGTEXT")
    private String content;

    @Column
    private String mood;

    @Column
    private String weather;

    @Column
    private String location;

    @Column
    private String tags;

    @Column
    private String imageUrl;

    @Column(nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'PUBLIC'")
    private String visibility = "PUBLIC"; // PUBLIC 或 PRIVATE

    @Column(nullable = false, columnDefinition = "BIGINT DEFAULT 0")
    private Long views = 0L; // 浏览次数

    @Column(nullable = false)
    private java.time.LocalDateTime createdAt;

    @Column
    private java.time.LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
        updatedAt = java.time.LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }
}
