package com.diary.repository;

import com.diary.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByDiaryIdAndUserId(Long diaryId, Long userId);

    List<Like> findByDiaryIdOrderByCreatedAtDesc(Long diaryId);

    @Query("SELECT COUNT(l) FROM Like l WHERE l.diaryId = :diaryId")
    Long countLikesByDiaryId(@Param("diaryId") Long diaryId);

    boolean existsByDiaryIdAndUserId(Long diaryId, Long userId);
}
