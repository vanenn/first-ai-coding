package com.diary.service;

import com.diary.entity.Like;
import com.diary.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeService {
    private final LikeRepository likeRepository;

    public Like addLike(Long diaryId, Long userId) {
        // 检查是否已点赞
        if (likeRepository.existsByDiaryIdAndUserId(diaryId, userId)) {
            throw new RuntimeException("Already liked");
        }
        Like like = new Like();
        like.setDiaryId(diaryId);
        like.setUserId(userId);
        return likeRepository.save(like);
    }

    public void removeLike(Long diaryId, Long userId) {
        Optional<Like> like = likeRepository.findByDiaryIdAndUserId(diaryId, userId);
        if (like.isPresent()) {
            likeRepository.delete(like.get());
        }
    }

    public Long getLikeCount(Long diaryId) {
        return likeRepository.countLikesByDiaryId(diaryId);
    }

    public boolean isLikedByUser(Long diaryId, Long userId) {
        return likeRepository.existsByDiaryIdAndUserId(diaryId, userId);
    }
}
