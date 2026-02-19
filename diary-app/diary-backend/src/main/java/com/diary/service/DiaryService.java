package com.diary.service;

import com.diary.entity.Diary;
import com.diary.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DiaryService {
    private final DiaryRepository diaryRepository;

    public Diary createDiary(Long userId, Diary diary) {
        diary.setUserId(userId);
        return diaryRepository.save(diary);
    }

    public Optional<Diary> getDiaryById(Long id, Long userId) {
        Optional<Diary> diary = diaryRepository.findById(id);
        if (diary.isPresent() && diary.get().getUserId().equals(userId)) {
            return diary;
        }
        return Optional.empty();
    }

    public List<Diary> getUserDiaries(Long userId) {
        return diaryRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Diary> getUserDiariesByMonth(Long userId, int year, int month) {
        return diaryRepository.findByUserIdAndMonth(userId, year, month);
    }

    public List<Diary> getUserDiariesByDate(Long userId, LocalDateTime date) {
        return diaryRepository.findByUserIdAndDate(userId, date);
    }

    public Diary updateDiary(Long id, Long userId, Diary updateData) {
        Diary diary = diaryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diary not found"));
        
        if (!diary.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        if (updateData.getTitle() != null) {
            diary.setTitle(updateData.getTitle());
        }
        if (updateData.getContent() != null) {
            diary.setContent(updateData.getContent());
        }
        if (updateData.getMood() != null) {
            diary.setMood(updateData.getMood());
        }
        if (updateData.getWeather() != null) {
            diary.setWeather(updateData.getWeather());
        }
        if (updateData.getLocation() != null) {
            diary.setLocation(updateData.getLocation());
        }
        if (updateData.getTags() != null) {
            diary.setTags(updateData.getTags());
        }
        if (updateData.getImageUrl() != null) {
            diary.setImageUrl(updateData.getImageUrl());
        }
        if (updateData.getVisibility() != null) {
            diary.setVisibility(updateData.getVisibility());
        }

        return diaryRepository.save(diary);
    }

    public List<Diary> getPublicDiariesOrderByTime() {
        return diaryRepository.findPublicDiariesOrderByTime();
    }

    public List<Diary> getPublicDiariesOrderByViews() {
        return diaryRepository.findPublicDiariesOrderByViews();
    }

    public void incrementDiaryViews(Long diaryId) {
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new RuntimeException("Diary not found"));
        diary.setViews(diary.getViews() + 1);
        diaryRepository.save(diary);
    }

    public void updateDiaryVisibility(Long id, Long userId, String visibility) {
        Diary diary = diaryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diary not found"));
        
        if (!diary.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        diary.setVisibility(visibility);
        diaryRepository.save(diary);
    }

    public void deleteDiary(Long id, Long userId) {
        Diary diary = diaryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diary not found"));
        
        if (!diary.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        diaryRepository.delete(diary);
    }
}
