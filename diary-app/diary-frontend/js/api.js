// API 配置
const API_BASE_URL = 'http://localhost:8080/api';

class ApiClient {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    getToken() {
        return localStorage.getItem('token');
    }

    clearToken() {
        localStorage.removeItem('token');
        this.token = null;
    }

    async request(method, endpoint, data = null) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options = {
            method,
            headers,
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('API Error:', error);
            return { code: 500, message: 'Network error', data: null };
        }
    }

    // 认证接口
    login(username, password) {
        return this.request('POST', '/auth/login', { username, password });
    }

    register(username, email, password, nickname) {
        return this.request('POST', '/auth/register', { username, email, password, nickname });
    }

    getProfile() {
        return this.request('GET', '/auth/profile');
    }

    updateProfile(data) {
        return this.request('PUT', '/auth/profile', data);
    }

    // 日记接口
    createDiary(diary) {
        return this.request('POST', '/diaries', diary);
    }

    getDiaries() {
        return this.request('GET', '/diaries');
    }

    getDiaryById(id) {
        return this.request('GET', `/diaries/${id}`);
    }

    getDiariesByMonth(year, month) {
        return this.request('GET', `/diaries/month?year=${year}&month=${month}`);
    }

    updateDiary(id, diary) {
        return this.request('PUT', `/diaries/${id}`, diary);
    }

    deleteDiary(id) {
        return this.request('DELETE', `/diaries/${id}`);
    }

    // 公开日记接口
    getPublicDiariesByTime() {
        return this.request('GET', '/diaries/public/timeline');
    }

    getPublicDiariesByViews() {
        return this.request('GET', '/diaries/public/hot');
    }

    viewDiary(id) {
        return this.request('GET', `/diaries/${id}/view`);
    }

    updateDiaryVisibility(id, visibility) {
        return this.request('PUT', `/diaries/${id}/visibility`, { visibility });
    }

    // 点赞接口
    likeDiary(diaryId) {
        return this.request('POST', `/likes/${diaryId}`);
    }

    unlikeDiary(diaryId) {
        return this.request('DELETE', `/likes/${diaryId}`);
    }

    getLikeCount(diaryId) {
        return this.request('GET', `/likes/${diaryId}/count`);
    }

    isLikedByUser(diaryId) {
        return this.request('GET', `/likes/${diaryId}/isLiked`);
    }

    // 评论接口
    addComment(diaryId, content) {
        return this.request('POST', `/comments/${diaryId}`, { content });
    }

    getComments(diaryId) {
        return this.request('GET', `/comments/${diaryId}`);
    }

    getCommentCount(diaryId) {
        return this.request('GET', `/comments/${diaryId}/count`);
    }

    updateComment(commentId, content) {
        return this.request('PUT', `/comments/${commentId}`, { content });
    }

    deleteComment(commentId) {
        return this.request('DELETE', `/comments/${commentId}`);
    }
}

const api = new ApiClient();
