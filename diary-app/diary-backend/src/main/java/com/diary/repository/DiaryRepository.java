package com.diary.repository;

import com.diary.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, Long> {
    List<Diary> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT d FROM Diary d WHERE d.userId = :userId AND YEAR(d.createdAt) = :year AND MONTH(d.createdAt) = :month ORDER BY d.createdAt DESC")
    List<Diary> findByUserIdAndMonth(@Param("userId") Long userId, @Param("year") int year, @Param("month") int month);
    
    @Query("SELECT d FROM Diary d WHERE d.userId = :userId AND DATE(d.createdAt) = DATE(:date) ORDER BY d.createdAt DESC")
    List<Diary> findByUserIdAndDate(@Param("userId") Long userId, @Param("date") LocalDateTime date);
    
    // 获取所有公开日记，按创建时间倒序
    @Query("SELECT d FROM Diary d WHERE d.visibility = 'PUBLIC' ORDER BY d.createdAt DESC")
    List<Diary> findPublicDiariesOrderByTime();
    
    // 获取所有公开日记，按浏览次数倒序
    @Query("SELECT d FROM Diary d WHERE d.visibility = 'PUBLIC' ORDER BY d.views DESC, d.createdAt DESC")
    List<Diary> findPublicDiariesOrderByViews();}