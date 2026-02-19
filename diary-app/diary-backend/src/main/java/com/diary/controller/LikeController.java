package com.diary.controller;

import com.diary.config.ApiResponse;
import com.diary.service.LikeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/likes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class LikeController {
    private final LikeService likeService;

    private Long getCurrentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping("/{diaryId}")
    public ApiResponse<String> addLike(@PathVariable Long diaryId) {
        try {
            Long userId = getCurrentUserId();
            likeService.addLike(diaryId, userId);
            return ApiResponse.success(null, "Like added successfully");
        } catch (Exception e) {
            log.error("Add like error: {}", e.getMessage());
            return ApiResponse.error(500, e.getMessage());
        }
    }

    @DeleteMapping("/{diaryId}")
    public ApiResponse<String> removeLike(@PathVariable Long diaryId) {
        try {
            Long userId = getCurrentUserId();
            likeService.removeLike(diaryId, userId);
            return ApiResponse.success(null, "Like removed successfully");
        } catch (Exception e) {
            log.error("Remove like error: {}", e.getMessage());
            return ApiResponse.error(500, "Failed to remove like");
        }
    }

    @GetMapping("/{diaryId}/count")
    public ApiResponse<Long> getLikeCount(@PathVariable Long diaryId) {
        try {
            Long count = likeService.getLikeCount(diaryId);
            return ApiResponse.success(count);
        } catch (Exception e) {
            log.error("Get like count error: {}", e.getMessage());
            return ApiResponse.error(500, "Failed to get like count");
        }
    }

    @GetMapping("/{diaryId}/isLiked")
    public ApiResponse<Boolean> isLikedByUser(@PathVariable Long diaryId) {
        try {
            Long userId = getCurrentUserId();
            boolean isLiked = likeService.isLikedByUser(diaryId, userId);
            return ApiResponse.success(isLiked);
        } catch (Exception e) {
            log.error("Check like status error: {}", e.getMessage());
            return ApiResponse.error(500, "Failed to check like status");
        }
    }
}
