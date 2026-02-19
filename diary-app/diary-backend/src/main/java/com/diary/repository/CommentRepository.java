package com.diary.repository;

import com.diary.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByDiaryIdOrderByCreatedAtDesc(Long diaryId);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.diaryId = :diaryId")
    Long countCommentsByDiaryId(@Param("diaryId") Long diaryId);
}
