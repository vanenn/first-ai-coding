// 应用状态
let currentUser = null;
let currentEditingDiaryId = null;
let allDiaries = [];
let allSquareDiaries = [];

// 工具函数
const utils = {
    formatDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    },

    formatShortDate(date) {
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${d.getFullYear()}-${month}-${day}`;
    },

    formatTime(date) {
        const d = new Date(date);
        return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    },

    truncateText(text, length = 100) {
        return text && text.length > length ? text.substring(0, length) + '...' : text;
    },

    getMoodEmoji(mood) {
        const moods = {
            'happy': '😊',
            'sad': '😢',
            'angry': '😠',
            'excited': '🤩',
            'calm': '😌'
        };
        return moods[mood] || '😊';
    },

    getWeatherEmoji(weather) {
        const weathers = {
            'sunny': '☀️',
            'cloudy': '⛅',
            'rainy': '🌧️',
            'snow': '❄️'
        };
        return weathers[weather] || '☁️';
    }
};

// DOM 元素缓存
const dom = {
    loginPage: document.getElementById('loginPage'),
    mainPage: document.getElementById('mainPage'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    loginError: document.getElementById('loginError'),
    registerError: document.getElementById('registerError'),

    newDiaryBtn: document.getElementById('newDiaryBtn'),
    diaryModal: document.getElementById('diaryModal'),
    diaryForm: document.getElementById('diaryForm'),
    cancelBtn: document.getElementById('cancelBtn'),
    modalTitle: document.getElementById('modalTitle'),

    diaryTitle: document.getElementById('diaryTitle'),
    diaryDate: document.getElementById('diaryDate'),
    diaryContent: document.getElementById('diaryContent'),
    diaryMood: document.getElementById('diaryMood'),
    diaryWeather: document.getElementById('diaryWeather'),
    diaryLocation: document.getElementById('diaryLocation'),
    diaryTags: document.getElementById('diaryTags'),
    diaryImage: document.getElementById('diaryImage'),
    diaryVisibility: document.getElementById('diaryVisibility'),

    diariesContainer: document.getElementById('diariesContainer'),
    emptyState: document.getElementById('emptyState'),

    userAvatar: document.getElementById('userAvatar'),
    profileBtn: document.getElementById('profileBtn'),
    logoutBtn: document.getElementById('logoutBtn'),

    profileModal: document.getElementById('profileModal'),
    profileForm: document.getElementById('profileForm'),
    profileUsername: document.getElementById('profileUsername'),
    profileEmail: document.getElementById('profileEmail'),
    profileNickname: document.getElementById('profileNickname'),
    profileAvatar: document.getElementById('profileAvatar'),
    profileAvatarImg: document.getElementById('profileAvatarImg'),
    cancelProfileBtn: document.getElementById('cancelProfileBtn'),

    viewModal: document.getElementById('viewModal'),
    viewContent: document.getElementById('viewContent'),
    editBtn: document.getElementById('editBtn'),
    deleteBtn: document.getElementById('deleteBtn'),

    monthPicker: document.getElementById('monthPicker'),
    resetFilterBtn: document.getElementById('resetFilterBtn'),
    searchInput: document.getElementById('searchInput'),

    // 广场页面
    squarePage: document.getElementById('squarePage'),
    squareDiariesContainer: document.getElementById('squareDiariesContainer'),
    squareEmptyState: document.getElementById('squareEmptyState'),
    pageTabBtns: document.querySelectorAll('.page-tab-btn'),
    sortBtns: document.querySelectorAll('.sort-btn'),

    tabBtns: document.querySelectorAll('.tab-btn'),
    moodTags: document.querySelectorAll('.mood-tag'),
};

// 初始化应用
function initApp() {
    checkAuthStatus();
    setupEventListeners();
}

// 检查认证状态
function checkAuthStatus() {
    const token = api.getToken();
    if (token) {
        loadMainPage();
    } else {
        showLoginPage();
    }
}

// 显示登录页
function showLoginPage() {
    dom.loginPage.style.display = 'block';
    dom.mainPage.style.display = 'none';
}

// 显示主页面
async function loadMainPage() {
    dom.loginPage.style.display = 'none';
    dom.mainPage.style.display = 'grid';

    // 验证 token 是否有效
    const profileResult = await api.getProfile();
    if (profileResult.code !== 200) {
        // Token 无效，返回登录页
        api.clearToken();
        showLoginPage();
        return;
    }

    currentUser = profileResult.data;
    dom.userAvatar.src = currentUser.avatar;
    loadDiaries();
    setTodayDate();
}

// 设置事件监听
function setupEventListeners() {
    // 页面标签切换（我的日记 vs 广场）
    dom.pageTabBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            dom.pageTabBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const pageType = e.target.dataset.page;
            if (pageType === 'diary') {
                document.querySelector('#mainPage > aside').style.display = 'block';
                document.querySelector('#mainPage > main').style.display = 'grid';
                dom.squarePage.style.display = 'none';
                loadDiaries();
            } else if (pageType === 'square') {
                document.querySelector('#mainPage > aside').style.display = 'none';
                document.querySelector('#mainPage > main').style.display = 'none';
                dom.squarePage.style.display = 'grid';
                loadSquareDiaries('time');
            }
        });
    });

    // 广场排序切换
    dom.sortBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            dom.sortBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const sortType = e.target.dataset.sort;
            loadSquareDiaries(sortType);
        });
    });

    // 标签页切换
    dom.tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            dom.tabBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            const tabName = e.target.dataset.tab;
            document.getElementById(`${tabName}Form`).classList.add('active');
        });
    });

    // 登录表单
    dom.loginForm.addEventListener('submit', handleLogin);

    // 注册表单
    dom.registerForm.addEventListener('submit', handleRegister);

    // 日记相关
    dom.newDiaryBtn.addEventListener('click', openNewDiaryModal);
    dom.diaryForm.addEventListener('submit', handleSaveDiary);
    dom.cancelBtn.addEventListener('click', closeDiaryModal);
    document.querySelector('#diaryModal .modal-close').addEventListener('click', closeDiaryModal);

    // 个人资料
    dom.profileBtn.addEventListener('click', openProfileModal);
    dom.profileForm.addEventListener('submit', handleUpdateProfile);
    dom.cancelProfileBtn.addEventListener('click', closeProfileModal);
    document.querySelector('#profileModal .modal-close').addEventListener('click', closeProfileModal);

    // 查看日记
    document.querySelector('#viewModal .modal-close').addEventListener('click', closeViewModal);
    dom.editBtn.addEventListener('click', editCurrentDiary);
    dom.deleteBtn.addEventListener('click', deleteCurrentDiary);

    // 菜单控制
    dom.userAvatar.addEventListener('click', function (e) {
        e.stopPropagation();
        const userMenu = document.querySelector('.user-menu');
        userMenu.classList.toggle('active');
    });

    // 点击页面其他地方关闭菜单
    document.addEventListener('click', function (e) {
        const userMenu = document.querySelector('.user-menu');
        if (!e.target.closest('.header-right')) {
            userMenu.classList.remove('active');
        }
    });

    // 菜单项点击后关闭菜单
    dom.profileBtn.addEventListener('click', function () {
        document.querySelector('.user-menu').classList.remove('active');
    });

    // 登出
    dom.logoutBtn.addEventListener('click', handleLogout);

    // 筛选
    dom.monthPicker.addEventListener('change', filterByMonth);
    dom.resetFilterBtn.addEventListener('click', resetFilter);
    dom.moodTags.forEach(tag => {
        tag.addEventListener('click', filterByMood);
    });

    // 搜索
    dom.searchInput.addEventListener('input', handleSearch);
}

// 登录处理
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        dom.loginError.textContent = '请输入用户名和密码';
        return;
    }

    const result = await api.login(username, password);
    if (result.code === 200) {
        currentUser = result.data;
        api.setToken(result.data.token);
        loadMainPage();
    } else {
        dom.loginError.textContent = result.message || '登录失败';
    }
}

// 注册处理
async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const nickname = document.getElementById('registerNickname').value;

    if (!username || !email || !password || !confirmPassword) {
        dom.registerError.textContent = '请填写所有必填项';
        return;
    }

    if (password !== confirmPassword) {
        dom.registerError.textContent = '两次输入的密码不一致';
        return;
    }

    const result = await api.register(username, email, password, nickname);
    if (result.code === 200) {
        currentUser = result.data;
        api.setToken(result.data.token);
        loadMainPage();
    } else {
        dom.registerError.textContent = result.message || '注册失败';
    }
}
// 打开新建日记模态框
function openNewDiaryModal() {
    currentEditingDiaryId = null;
    dom.modalTitle.textContent = '新建日记';
    dom.diaryForm.reset();
    setTodayDate();
    dom.diaryModal.classList.add('active');
}

// 关闭日记模态框
function closeDiaryModal() {
    dom.diaryModal.classList.remove('active');
}

// 设置今天日期
function setTodayDate() {
    const today = new Date();
    dom.diaryDate.valueAsDate = today;
}

// 保存日记
async function handleSaveDiary(e) {
    e.preventDefault();

    const diaryData = {
        title: dom.diaryTitle.value,
        content: dom.diaryContent.value,
        mood: dom.diaryMood.value,
        weather: dom.diaryWeather.value,
        location: dom.diaryLocation.value,
        tags: dom.diaryTags.value,
        imageUrl: dom.diaryImage.value,
        visibility: dom.diaryVisibility.value,
    };

    let result;
    if (currentEditingDiaryId) {
        result = await api.updateDiary(currentEditingDiaryId, diaryData);
    } else {
        result = await api.createDiary(diaryData);
    }

    if (result.code === 200) {
        closeDiaryModal();
        loadDiaries();
    } else {
        alert('保存失败: ' + result.message);
    }
}

// 加载日记列表
async function loadDiaries() {
    const result = await api.getDiaries();
    if (result.code === 200) {
        allDiaries = result.data || [];
        renderDiaries(allDiaries);
    }
}

// 渲染日记列表
function renderDiaries(diaries) {
    dom.diariesContainer.innerHTML = '';

    if (diaries.length === 0) {
        dom.emptyState.style.display = 'block';
        return;
    }

    dom.emptyState.style.display = 'none';

    diaries.forEach(diary => {
        const card = createDiaryCard(diary);
        dom.diariesContainer.appendChild(card);
    });
}

// 创建日记卡片
function createDiaryCard(diary) {
    const card = document.createElement('div');
    card.className = 'diary-card';
    card.style.cursor = 'pointer';

    const imageHtml = diary.imageUrl ?
        `<img src="${diary.imageUrl}" alt="日记图片" class="diary-image" onerror="this.style.display='none'">` :
        '';

    card.innerHTML = `
        ${imageHtml}
        <div class="diary-body">
            <div class="diary-date">${utils.formatDate(diary.createdAt)}</div>
            <div class="diary-title">${diary.title}</div>
            <div class="diary-excerpt">${utils.truncateText(diary.content, 100)}</div>
            <div class="diary-meta">
                ${diary.mood ? `<span class="meta-item">${utils.getMoodEmoji(diary.mood)}</span>` : ''}
                ${diary.weather ? `<span class="meta-item">${utils.getWeatherEmoji(diary.weather)}</span>` : ''}
                ${diary.location ? `<span class="meta-item">📍 ${diary.location}</span>` : ''}
            </div>
            <div class="diary-footer">
                <div class="diary-mood">${diary.mood ? utils.getMoodEmoji(diary.mood) : '😊'}</div>
                <div class="diary-actions">
                    <button class="edit-btn" data-id="${diary.id}">编辑</button>
                    <button class="delete-btn" data-id="${diary.id}">删除</button>
                </div>
            </div>
        </div>
    `;

    card.addEventListener('click', (e) => {
        if (!e.target.closest('.diary-actions button')) {
            viewDiary(diary.id);
        }
    });

    card.querySelector('.edit-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        editDiary(diary.id);
    });

    card.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('确定删除这篇日记吗？')) {
            deleteDiary(diary.id);
        }
    });

    return card;
}

// 编辑日记
async function editDiary(id) {
    const result = await api.getDiaryById(id);
    if (result.code === 200) {
        const diary = result.data;
        currentEditingDiaryId = id;
        dom.modalTitle.textContent = '编辑日记';
        dom.diaryTitle.value = diary.title;
        dom.diaryContent.value = diary.content;
        dom.diaryMood.value = diary.mood || '';
        dom.diaryWeather.value = diary.weather || '';
        dom.diaryLocation.value = diary.location || '';
        dom.diaryTags.value = diary.tags || '';
        dom.diaryImage.value = diary.imageUrl || '';
        dom.diaryDate.valueAsDate = new Date(diary.createdAt);
        dom.diaryModal.classList.add('active');
    }
}

// 查看日记详情
async function viewDiary(id) {
    const result = await api.getDiaryById(id);
    if (result.code === 200) {
        const diary = result.data;
        currentEditingDiaryId = id;

        let tagsHtml = '';
        if (diary.tags) {
            tagsHtml = diary.tags.split(',').map(tag =>
                `<span class="meta-item">#${tag.trim()}</span>`
            ).join('');
        }

        const imageHtml = diary.imageUrl ?
            `<img src="${diary.imageUrl}" alt="日记图片" onerror="this.style.display='none'">` : '';

        dom.viewContent.innerHTML = `
            <h2>${diary.title}</h2>
            <div class="detail-meta">
                <span>📅 ${utils.formatDate(diary.createdAt)}</span>
                ${diary.mood ? `<span>${utils.getMoodEmoji(diary.mood)} ${diary.mood}</span>` : ''}
                ${diary.weather ? `<span>${utils.getWeatherEmoji(diary.weather)} ${diary.weather}</span>` : ''}
                ${diary.location ? `<span>📍 ${diary.location}</span>` : ''}
            </div>
            <div>
                ${tagsHtml}
            </div>
            ${imageHtml}
            <div>${diary.content}</div>
            
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;">
            
            <div class="comments-section">
                <h3>评论</h3>
                <div id="commentsList" class="comments-list">
                    <!-- 评论将动态插入这里 -->
                </div>
                <div class="comment-input-area">
                    <textarea id="commentInput" placeholder="写下你的评论..." rows="3"></textarea>
                    <button id="submitCommentBtn" class="btn btn-primary">发表评论</button>
                </div>
            </div>
        `;

        // 只有当前用户自己的日记才能编辑和删除
        const isOwner = diary.userId === currentUser.id;
        dom.editBtn.style.display = isOwner ? 'inline-block' : 'none';
        dom.deleteBtn.style.display = isOwner ? 'inline-block' : 'none';

        // 加载评论
        await loadComments(id);

        // 绑定提交评论事件
        document.getElementById('submitCommentBtn').addEventListener('click', async () => {
            const commentText = document.getElementById('commentInput').value.trim();
            if (!commentText) {
                alert('请输入评论内容');
                return;
            }
            await submitComment(id, commentText);
        });

        dom.viewModal.classList.add('active');
    }
}

// 当前日记编辑（从查看页面）
function editCurrentDiary() {
    if (currentEditingDiaryId) {
        dom.viewModal.classList.remove('active');
        editDiary(currentEditingDiaryId);
    }
}

// 当前日记删除（从查看页面）
async function deleteCurrentDiary() {
    if (confirm('确定删除这篇日记吗？')) {
        const result = await api.deleteDiary(currentEditingDiaryId);
        if (result.code === 200) {
            dom.viewModal.classList.remove('active');
            loadDiaries();
        }
    }
}

// 删除日记
async function deleteDiary(id) {
    const result = await api.deleteDiary(id);
    if (result.code === 200) {
        loadDiaries();
    }
}

// 关闭查看模态框
function closeViewModal() {
    dom.viewModal.classList.remove('active');
}

// 打开个人资料弹窗
function openProfileModal() {
    dom.profileUsername.value = currentUser.username || '';
    dom.profileEmail.value = currentUser.email || '';
    dom.profileNickname.value = currentUser.nickname || '';
    dom.profileAvatar.value = currentUser.avatar || '';
    dom.profileAvatarImg.src = currentUser.avatar || '';
    dom.profileModal.classList.add('active');
}

// 关闭个人资料弹窗
function closeProfileModal() {
    dom.profileModal.classList.remove('active');
}

// 更新个人资料
async function handleUpdateProfile(e) {
    e.preventDefault();

    const updateData = {
        nickname: dom.profileNickname.value,
        avatar: dom.profileAvatar.value,
    };

    const result = await api.updateProfile(updateData);
    if (result.code === 200) {
        currentUser = result.data;
        dom.userAvatar.src = currentUser.avatar;
        closeProfileModal();
    } else {
        alert('更新失败: ' + result.message);
    }
}

// 登出
function handleLogout() {
    api.clearToken();
    currentUser = null;
    showLoginPage();
    dom.loginForm.reset();
    dom.registerForm.reset();
    dom.loginError.textContent = '';
    dom.registerError.textContent = '';
}

// 按月份筛选
async function filterByMonth(e) {
    const monthValue = e.target.value;
    if (!monthValue) return;

    const [year, month] = monthValue.split('-');
    const result = await api.getDiariesByMonth(parseInt(year), parseInt(month));

    if (result.code === 200) {
        renderDiaries(result.data || []);
    }
}

// 重置筛选
function resetFilter() {
    dom.monthPicker.value = '';
    dom.searchInput.value = '';
    document.querySelectorAll('.mood-tag.active').forEach(tag => {
        tag.classList.remove('active');
    });
    renderDiaries(allDiaries);
}

// 按心情筛选
function filterByMood(e) {
    e.target.classList.toggle('active');
    applyAllFilters();
}

// 应用所有筛选
function applyAllFilters() {
    let filtered = [...allDiaries];

    // 心情筛选
    const activeMoods = Array.from(document.querySelectorAll('.mood-tag.active'))
        .map(tag => tag.dataset.mood);

    if (activeMoods.length > 0) {
        filtered = filtered.filter(diary => activeMoods.includes(diary.mood));
    }

    // 搜索筛选
    const searchTerm = dom.searchInput.value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(diary =>
            diary.title.toLowerCase().includes(searchTerm) ||
            diary.content.toLowerCase().includes(searchTerm)
        );
    }

    renderDiaries(filtered);
}

// 搜索处理
function handleSearch() {
    applyAllFilters();
}

// 加载广场日记
async function loadSquareDiaries(sortType) {
    try {
        let result;
        if (sortType === 'likes') {
            result = await api.getPublicDiariesByViews();
        } else {
            result = await api.getPublicDiariesByTime();
        }

        if (result.code === 200) {
            allSquareDiaries = result.data || [];
            renderSquareDiaries(allSquareDiaries);
        }
    } catch (error) {
        console.error('Error loading square diaries:', error);
    }
}

// 渲染广场日记
function renderSquareDiaries(diaries) {
    dom.squareDiariesContainer.innerHTML = '';

    if (diaries.length === 0) {
        dom.squareEmptyState.style.display = 'block';
        return;
    }

    dom.squareEmptyState.style.display = 'none';

    diaries.forEach(diary => {
        const card = createSquareDiaryCard(diary);
        dom.squareDiariesContainer.appendChild(card);
    });
}

// 创建广场日记卡片
function createSquareDiaryCard(diary) {
    const card = document.createElement('div');
    card.className = 'diary-card square-diary-card';

    const imageHtml = diary.imageUrl ?
        `<img src="${diary.imageUrl}" alt="日记图片" class="diary-image" onerror="this.style.display='none'">` :
        '';

    card.innerHTML = `
        ${imageHtml}
        <div class="diary-body">
            <div class="diary-author">
                <img src="https://ui-avatars.com/api/?name=User&background=7c3aed&color=fff" alt="作者头像" class="author-avatar">
                <span class="author-name">${diary.user?.nickname || '匿名用户'}</span>
            </div>
            <div class="diary-date">${utils.formatDate(diary.createdAt)}</div>
            <div class="diary-title">${diary.title}</div>
            <div class="diary-excerpt">${utils.truncateText(diary.content, 100)}</div>
            <div class="diary-meta">
                ${diary.mood ? `<span class="meta-item">${utils.getMoodEmoji(diary.mood)}</span>` : ''}
                ${diary.weather ? `<span class="meta-item">${utils.getWeatherEmoji(diary.weather)}</span>` : ''}
                ${diary.location ? `<span class="meta-item">📍 ${diary.location}</span>` : ''}
            </div>
            <div class="diary-interactions">
                <button class="like-btn" data-id="${diary.id}" data-liked="false">
                    <span class="like-icon">❤️</span>
                    <span class="like-count">0</span>
                </button>
                <button class="comment-btn" data-id="${diary.id}">
                    <span class="comment-icon">💬</span>
                    <span class="comment-count">0</span>
                </button>
            </div>
        </div>
    `;

    card.addEventListener('click', (e) => {
        if (!e.target.closest('.diary-interactions button')) {
            viewPublicDiary(diary.id);
        }
    });

    const likeBtn = card.querySelector('.like-btn');
    const commentBtn = card.querySelector('.comment-btn');

    // 加载点赞数和状态
    loadLikeInfo(diary.id, likeBtn);

    // 加载评论数
    loadCommentCount(diary.id, commentBtn);

    likeBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await toggleLike(diary.id, likeBtn);
    });

    return card;
}

// 查看公开日记
async function viewPublicDiary(diaryId) {
    try {
        const result = await api.viewDiary(diaryId);
        if (result.code === 200) {
            const diary = result.data;
            currentEditingDiaryId = diaryId;

            let tagsHtml = '';
            if (diary.tags) {
                tagsHtml = diary.tags.split(',').map(tag =>
                    `<span class="meta-item">#${tag.trim()}</span>`
                ).join('');
            }

            const imageHtml = diary.imageUrl ?
                `<img src="${diary.imageUrl}" alt="日记图片" onerror="this.style.display='none'">` : '';

            dom.viewContent.innerHTML = `
                <h2>${diary.title}</h2>
                <div class="detail-meta">
                    <span>📅 ${utils.formatDate(diary.createdAt)}</span>
                    ${diary.mood ? `<span>${utils.getMoodEmoji(diary.mood)} ${diary.mood}</span>` : ''}
                    ${diary.weather ? `<span>${utils.getWeatherEmoji(diary.weather)} ${diary.weather}</span>` : ''}
                    ${diary.location ? `<span>📍 ${diary.location}</span>` : ''}
                </div>
                <div>
                    ${tagsHtml}
                </div>
                ${imageHtml}
                <div>${diary.content}</div>
                
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;">
                
                <div class="comments-section">
                    <h3>评论</h3>
                    <div id="commentsList" class="comments-list">
                        <!-- 评论将动态插入这里 -->
                    </div>
                    <div class="comment-input-area">
                        <textarea id="commentInput" placeholder="写下你的评论..." rows="3"></textarea>
                        <button id="submitCommentBtn" class="btn btn-primary">发表评论</button>
                    </div>
                </div>
            `;

            // 隐藏编辑和删除按钮（广场中看别人的日记不能编辑）
            dom.editBtn.style.display = 'none';
            dom.deleteBtn.style.display = 'none';

            // 加载评论
            await loadComments(diaryId);

            // 绑定提交评论事件
            document.getElementById('submitCommentBtn').addEventListener('click', async () => {
                const commentText = document.getElementById('commentInput').value.trim();
                if (!commentText) {
                    alert('请输入评论内容');
                    return;
                }
                await submitComment(diaryId, commentText);
            });

            dom.viewModal.classList.add('active');
        }
    } catch (error) {
        console.error('Error viewing diary:', error);
    }
}

// 切换点赞状态
async function toggleLike(diaryId, likeBtn) {
    try {
        const isLiked = likeBtn.dataset.liked === 'true';

        if (isLiked) {
            const result = await api.unlikeDiary(diaryId);
            if (result.code === 200) {
                likeBtn.dataset.liked = 'false';
                likeBtn.classList.remove('liked');
            }
        } else {
            const result = await api.likeDiary(diaryId);
            if (result.code === 200) {
                likeBtn.dataset.liked = 'true';
                likeBtn.classList.add('liked');
            }
        }

        // 更新点赞数
        updateLikeCount(diaryId, likeBtn);
    } catch (error) {
        console.error('Error toggling like:', error);
    }
}
// 加载点赞信息（点赞数和点赞状态）
async function loadLikeInfo(diaryId, likeBtn) {
    try {
        const [countResult, likedResult] = await Promise.all([
            api.getLikeCount(diaryId),
            api.isLikedByUser(diaryId)
        ]);

        if (countResult.code === 200) {
            likeBtn.querySelector('.like-count').textContent = countResult.data || 0;
        }

        if (likedResult.code === 200 && likedResult.data) {
            likeBtn.dataset.liked = 'true';
            likeBtn.classList.add('liked');
        }
    } catch (error) {
        console.error('Error loading like info:', error);
    }
}

// 更新点赞数
async function updateLikeCount(diaryId, likeBtn) {
    try {
        const result = await api.getLikeCount(diaryId);
        if (result.code === 200) {
            likeBtn.querySelector('.like-count').textContent = result.data || 0;
        }
    } catch (error) {
        console.error('Error updating like count:', error);
    }
}

// 加载评论数
async function loadCommentCount(diaryId, commentBtn) {
    try {
        const result = await api.getCommentCount(diaryId);
        if (result.code === 200) {
            commentBtn.querySelector('.comment-count').textContent = result.data || 0;
        }
    } catch (error) {
        console.error('Error loading comment count:', error);
    }
}
async function loadComments(diaryId) {
    try {
        const result = await api.getComments(diaryId);
        const commentsList = document.getElementById('commentsList');

        if (result.code === 200 && result.data && result.data.length > 0) {
            const commentsHtml = result.data.map(comment => `
                <div class="comment-item">
                    <div class="comment-header">
                        <span class="comment-author">${comment.user?.nickname || '匿名用户'}</span>
                        <span class="comment-time">${utils.formatDate(comment.createdAt)}</span>
                        ${comment.userId === currentUser.id ? `<button class="btn-delete-comment" data-comment-id="${comment.id}">删除</button>` : ''}
                    </div>
                    <div class="comment-content">${comment.content}</div>
                </div>
            `).join('');

            commentsList.innerHTML = commentsHtml;

            // 绑定删除评论事件
            document.querySelectorAll('.btn-delete-comment').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    if (confirm('确定删除这条评论吗？')) {
                        const commentId = btn.dataset.commentId;
                        await deleteComment(commentId);
                    }
                });
            });
        } else {
            commentsList.innerHTML = '<p style="text-align: center; color: #999;">暂无评论</p>';
        }
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

// 提交评论
async function submitComment(diaryId, content) {
    try {
        const result = await api.addComment(diaryId, content);
        if (result.code === 200) {
            document.getElementById('commentInput').value = '';
            // 重新加载评论
            await loadComments(diaryId);
        } else {
            alert('评论失败: ' + result.message);
        }
    } catch (error) {
        console.error('Error submitting comment:', error);
        alert('评论出错');
    }
}

// 删除评论
async function deleteComment(commentId) {
    try {
        const result = await api.deleteComment(commentId);
        if (result.code === 200) {
            // 重新加载评论
            await loadComments(currentEditingDiaryId);
        } else {
            alert('删除失败: ' + result.message);
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        alert('删除出错');
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', initApp);
