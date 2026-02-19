package com.diary.service;

import com.diary.entity.Comment;
import com.diary.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;

    public Comment addComment(Long diaryId, Long userId, String content) {
        Comment comment = new Comment();
        comment.setDiaryId(diaryId);
        comment.setUserId(userId);
        comment.setContent(content);
        return commentRepository.save(comment);
    }

    public List<Comment> getComments(Long diaryId) {
        return commentRepository.findByDiaryIdOrderByCreatedAtDesc(diaryId);
    }

    public Long getCommentCount(Long diaryId) {
        return commentRepository.countCommentsByDiaryId(diaryId);
    }

    public Comment updateComment(Long commentId, Long userId, String content) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        comment.setContent(content);
        return commentRepository.save(comment);
    }

    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        
        if (!comment.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        commentRepository.delete(comment);
    }
}
