package com.diary.controller;

import com.diary.config.ApiResponse;
import com.diary.entity.Diary;
import com.diary.repository.DiaryRepository;
import com.diary.service.DiaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/diaries")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class DiaryController {
    private final DiaryService diaryService;
    private final DiaryRepository diaryRepository;

    private Long getCurrentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping
    public ApiResponse<Diary> createDiary(@RequestBody Diary diary) {
        try {
            Long userId = getCurrentUserId();
            Diary created = diaryService.createDiary(userId, diary);
            return ApiResponse.success(created, "Diary created successfully");
        } catch (Exception e) {
            log.error("Create diary error: {}", e.getMessage());
            return ApiResponse.error(500, "Failed to create diary");
        }
    }

    @GetMapping
    public ApiResponse<List<Diary>> getUserDiaries() {
        try {
            Long userId = getCurrentUserId();
            List<Diary> diaries = diaryService.getUserDiaries(userId);
            return ApiResponse.success(diaries);
        } catch (Exception e) {
            log.error("Get diaries error: {}", e.getMessage());
            return ApiResponse.error(500, "Failed to get diaries");
        }
    }

    @GetMapping("/month")
    public ApiResponse<List<Diary>> getUserDiariesByMonth(
            @RequestParam int year,
            @RequestParam int month) {
        try {
            Long userId = getCurrentUserId();
            List<Diary> diaries = diaryService.getUserDiariesByMonth(userId, year, month);
            return ApiResponse.success(diaries);
        } catch (Exception e) {
            log.error("Get diaries by month error: {}", e.getMessage());
            return ApiResponse.error(500, "Failed to get diaries");
        }
    }

    @GetMapping("/date")
    public ApiResponse<List<Diary>> getUserDiariesByDate(@RequestParam String date) {
        try {
            Long userId = getCurrentUserId();
            LocalDateTime dateTime = LocalDateTime.parse(date);
            List<Diary> diaries = diaryService.getUserDiariesByDate(userId, dateTime);
            return ApiResponse.success(diaries);
        } catch (Exception e) {
            log.error("Get diaries by date error: {}", e.getMessage());
            return ApiResponse.error(500, "Failed to get diaries");
        }
    }

    @GetMapping("/{id}")
    public ApiResponse<Diary> getDiaryById(@PathVariable Long id) {
        try {
            Long userId = getCurrentUserId();
            Diary diary = diaryService.getDiaryById(id, userId)
                    .orElseThrow(() -> new RuntimeException("Diary not found"));
            return ApiResponse.success(diary);
        } catch (Exception e) {
            log.error("Get diary error: {}", e.getMessage());
            return ApiResponse.error(500, "Failed to get diary");
        }
    }

    @PutMapping("/{id}")
    public ApiResponse<Diary> updateDiary(@PathVariable Long id, @RequestBody Diary updateData) {
        try {
            Long userId = getCurrentUserId();
            Diary diary = diaryService.updateDiary(id, userId, updateData);
            return ApiResponse.success(diary, "Diary updated successfully");
        } catch (Exception e) {
            log.error("Update diary error: {}", e.getMessage());
            return ApiResponse.error(500, "Failed to update diary");
        }
    }

    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteDiary(@PathVariable Long id) {
        try {
            Long userId = getCurrentUserId();
            diaryService.deleteDiary(id, userId);
            return ApiResponse.success(null, "Diary deleted successfully");
        } catch (Exception e) {
            log.error("Delete diary error: {}", e.getMessage());
            return ApiResponse.error(500, "Failed to delete diary");
        }
    }

    @GetMapping("/public/timeline")
    public ApiResponse<List<Diary>> getPublicDiariesByTime() {
        try {
            List<Diary> diaries = diaryService.getPublicDiariesOrderByTime();
            return ApiResponse.success(diaries);
        } catch (Exception e) {
            log.error("Get public diaries error: {}", e.getMessage());
            return ApiResponse.error(500, "Failed to get public diaries");
        }
    }

    @GetMapping("/public/hot")
    public ApiResponse<List<Diary>> getPublicDiariesByViews() {
        try {
            List<Diary> diaries = diaryService.getPublicDiariesOrderByViews();
            return ApiResponse.success(diaries);
        } catch (Exception e) {
            log.error("Get public diaries by views error: {}", e.getMessage());
            return ApiResponse.error(500, "Failed to get public diaries");
        }
    }

    @PutMapping("/{id}/visibility")
    public ApiResponse<String> updateDiaryVisibility(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            Long userId = getCurrentUserId();
            String visibility = request.get("visibility");
            diaryService.updateDiaryVisibility(id, userId, visibility);
            return ApiResponse.success(null, "Visibility updated successfully");
        } catch (Exception e) {
            log.error("Update visibility error: {}", e.getMessage());
            return ApiResponse.error(500, "Failed to update visibility");
        }
    }

    @GetMapping("/{id}/view")
    public ApiResponse<Diary> viewPublicDiary(@PathVariable Long id) {
        try {
            Diary diary = diaryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Diary not found"));
            
            if (!"PUBLIC".equals(diary.getVisibility())) {
                Long userId = getCurrentUserId();
                if (!diary.getUserId().equals(userId)) {
                    throw new RuntimeException("Diary is not public");
                }
            }
            
            // 增加浏览次数
            diaryService.incrementDiaryViews(id);
            return ApiResponse.success(diary);
        } catch (Exception e) {
            log.error("View diary error: {}", e.getMessage());
            return ApiResponse.error(500, "Failed to view diary");
        }
    }
}
