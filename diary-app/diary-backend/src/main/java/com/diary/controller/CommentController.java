package com.diary.controller;

import com.diary.config.ApiResponse;
import com.diary.entity.Comment;
import com.diary.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class CommentController {
    private final CommentService commentService;

    private Long getCurrentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping("/{diaryId}")
    public ApiResponse<Comment> addComment(@PathVariable Long diaryId, @RequestBody Map<String, String> request) {
        try {
            Long userId = getCurrentUserId();
            String content = request.get("content");
            Comment comment = commentService.addComment(diaryId, userId, content);
            return ApiResponse.success(comment, "Comment added successfully");
        } catch (Exception e) {
            log.error("Add comment error: {}", e.getMessage());
            return ApiResponse.error(500, "Failed to add comment");
        }
    }

    @GetMapping("/{diaryId}")
    public ApiResponse<List<Comment>> getComments(@PathVariable Long diaryId) {
        try {
            List<Comment> comments = commentService.getComments(diaryId);
            return ApiResponse.success(comments);
        } catch (Exception e) {
            log.error("Get comments error: {}", e.getMessage());
            return ApiResponse.error(500, "Failed to get comments");
        }
    }

    @GetMapping("/{diaryId}/count")
    public ApiResponse<Long> getCommentCount(@PathVariable Long diaryId) {
        try {
            Long count = commentService.getCommentCount(diaryId);
            return ApiResponse.success(count);
        } catch (Exception e) {
            log.error("Get comment count error: {}", e.getMessage());
            return ApiResponse.error(500, "Failed to get comment count");
        }
    }

    @PutMapping("/{commentId}")
    public ApiResponse<Comment> updateComment(@PathVariable Long commentId, @RequestBody Map<String, String> request) {
        try {
            Long userId = getCurrentUserId();
            String content = request.get("content");
            Comment comment = commentService.updateComment(commentId, userId, content);
            return ApiResponse.success(comment, "Comment updated successfully");
        } catch (Exception e) {
            log.error("Update comment error: {}", e.getMessage());
            return ApiResponse.error(500, "Failed to update comment");
        }
    }

    @DeleteMapping("/{commentId}")
    public ApiResponse<String> deleteComment(@PathVariable Long commentId) {
        try {
            Long userId = getCurrentUserId();
            commentService.deleteComment(commentId, userId);
            return ApiResponse.success(null, "Comment deleted successfully");
        } catch (Exception e) {
            log.error("Delete comment error: {}", e.getMessage());
            return ApiResponse.error(500, "Failed to delete comment");
        }
    }
}
