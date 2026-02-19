# 📚 快速参考指南

## 目录结构速查

```
diary-app/
├── 📄 README.md              # 项目介绍和基本说明
├── 📄 DEPLOYMENT.md          # 完整的部署指南
├── 📄 QUICK_REFERENCE.md     # 本文件
├── 📄 init.sql               # 数据库初始化脚本
├── ⚙️ start.bat              # Windows启动脚本
├── ⚙️ start.sh               # Linux/Mac启动脚本
│
├── 📁 diary-backend/         # Spring Boot后端
│   ├── pom.xml              # Maven依赖配置
│   ├── 📁 src/main/java/com/diary/
│   │   ├── DiaryApplication.java      # 主启动类
│   │   ├── 📁 config/
│   │   │   ├── ApiResponse.java       # API响应格式
│   │   │   ├── SecurityConfig.java    # Spring Security配置
│   │   │   └── JwtAuthenticationFilter.java  # JWT过滤器
│   │   ├── 📁 entity/
│   │   │   ├── User.java              # 用户实体
│   │   │   └── Diary.java             # 日记实体
│   │   ├── 📁 repository/
│   │   │   ├── UserRepository.java    # 用户数据访问
│   │   │   └── DiaryRepository.java   # 日记数据访问
│   │   ├── 📁 service/
│   │   │   ├── UserService.java       # 用户业务逻辑
│   │   │   ├── DiaryService.java      # 日记业务逻辑
│   │   │   └── JwtService.java        # JWT令牌管理
│   │   └── 📁 controller/
│   │       ├── AuthController.java    # 认证API端点
│   │       └── DiaryController.java   # 日记API端点
│   └── 📁 src/main/resources/
│       └── application.yml            # 应用配置文件
│
└── 📁 diary-frontend/        # HTML/JavaScript前端
    ├── 📄 index.html        # 主页面结构
    ├── 📁 css/
    │   └── style.css        # 样式表
    └── 📁 js/
        ├── api.js           # API客户端
        └── app.js           # 应用逻辑
```

## 快速启动命令

### Windows
```cmd
:: 方法1: 双击运行批处理脚本
start.bat

:: 方法2: 手动启动后端
cd diary-backend
mvn spring-boot:run

:: 方法3: 在另一个终端启动前端
cd diary-frontend
python -m http.server 3000
```

### Linux/Mac
```bash
# 方法1: 运行启动脚本
chmod +x start.sh
./start.sh

# 方法2: 手动启动
cd diary-backend
mvn spring-boot:run

# 新终端：
cd diary-frontend
python -m http.server 3000
```

## API端点速查表

| 方法 | 端点 | 说明 | 需要Token |
|------|------|------|----------|
| POST | `/auth/register` | 注册用户 | ❌ |
| POST | `/auth/login` | 用户登录 | ❌ |
| GET | `/auth/profile` | 获取个人信息 | ✅ |
| PUT | `/auth/profile` | 更新个人信息 | ✅ |
| POST | `/diaries` | 创建日记 | ✅ |
| GET | `/diaries` | 获取所有日记 | ✅ |
| GET | `/diaries/{id}` | 获取单条日记 | ✅ |
| GET | `/diaries/month` | 按月份查询 | ✅ |
| GET | `/diaries/date` | 按日期查询 | ✅ |
| PUT | `/diaries/{id}` | 更新日记 | ✅ |
| DELETE | `/diaries/{id}` | 删除日记 | ✅ |

## 数据库表字段说明

### users表
```
id          - 用户ID (主键)
username    - 用户名 (唯一)
password    - 密码 (BCrypt加密)
email       - 邮箱 (唯一)
nickname    - 昵称
avatar      - 头像URL
created_at  - 创建时间
updated_at  - 更新时间
```

### diaries表
```
id          - 日记ID (主键)
user_id     - 用户ID (外键)
title       - 标题
content     - 内容
mood        - 心情 (happy/sad/angry/excited/calm)
weather     - 天气 (sunny/cloudy/rainy/snow)
location    - 位置
tags        - 标签 (逗号分隔)
image_url   - 图片URL
created_at  - 创建时间
updated_at  - 更新时间
```

## 常用配置修改

### 修改数据库连接
文件：`diary-backend/src/main/resources/application.yml`
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/diary_db?useSSL=false&serverTimezone=UTC
    username: root
    password: your_password  # 改这里
```

### 修改JWT密钥
文件：`diary-backend/src/main/resources/application.yml`
```yaml
jwt:
  secret: diary-app-secret-key-change-in-production  # 改这里（生产环境必须）
  expiration: 86400000  # 令牌有效期（毫秒）
```

### 修改应用端口
文件：`diary-backend/src/main/resources/application.yml`
```yaml
server:
  port: 8080  # 改这里
  servlet:
    context-path: /api
```

### 修改前端API基址
文件：`diary-frontend/js/api.js`
```javascript
const API_BASE_URL = 'http://localhost:8080/api';  // 改这里
```

## 环境变量配置（生产环境）

```bash
# MySQL配置
export SPRING_DATASOURCE_URL=jdbc:mysql://db.example.com:3306/diary_db
export SPRING_DATASOURCE_USERNAME=dbuser
export SPRING_DATASOURCE_PASSWORD=dbpassword

# JWT配置
export JWT_SECRET=your-super-secret-key-change-this
export JWT_EXPIRATION=86400000

# 应用配置
export SERVER_PORT=8080
export LOGGING_LEVEL_ROOT=INFO
```

## 常见问题快速解决

| 问题 | 解决方案 |
|------|--------|
| Maven命令找不到 | 检查`MAVEN_HOME`环境变量 |
| Java版本太低 | 下载JDK 17+ |
| 端口被占用 | 修改端口或关闭占用进程 |
| 数据库连接失败 | 检查MySQL是否运行，确认用户名密码 |
| 前端白屏 | 开启浏览器开发者工具(F12)查看错误 |
| CORS错误 | 后端CORS配置可能需要调整 |
| 无法登录 | 确认用户已注册，检查密码 |

## 开发技巧

### 查看后端日志
```bash
# 实时查看日志
tail -f logs/diary.log

# 查看最后100行
tail -n 100 logs/diary.log

# 搜索错误
grep ERROR logs/diary.log
```

### 清空数据库
```sql
USE diary_db;
DELETE FROM diaries;
DELETE FROM users;
ALTER TABLE diaries AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;
```

### 重置用户密码
```sql
-- 使用BCrypt加密的密码示例
UPDATE users SET password = '$2a$10$...' WHERE id = 1;
```

### 浏览器开发者工具快捷键
- Windows/Linux: `F12`
- Mac: `Cmd + Option + I`
- 查看Network标签调试API
- 查看Storage/Application标签看localStorage

### 调试JavaScript
在 `js/app.js` 添加console.log输出信息，在浏览器Console标签查看。

## 性能监控

### 查看MySQL查询慢日志
```bash
mysql -u root -p -e "SET GLOBAL slow_query_log = 'ON';"
tail -f /var/log/mysql/slow.log
```

### 查看Java内存使用
```bash
# 运行时指定JVM参数
java -Xmx2g -Xms1g -jar diary-backend-1.0.0.jar
```

### 前端性能检查
1. 打开浏览器F12
2. 切换到Performance标签
3. 点击record并操作页面
4. 分析性能瓶颈

## 备份恢复快速命令

```bash
# 备份数据库
mysqldump -u root -p diary_db > diary_backup.sql

# 恢复数据库
mysql -u root -p diary_db < diary_backup.sql

# 导出用户数据
SELECT * INTO OUTFILE '/tmp/users.csv' FIELDS TERMINATED BY ',' FROM users;

# 导出日记数据
SELECT * INTO OUTFILE '/tmp/diaries.csv' FIELDS TERMINATED BY ',' FROM diaries;
```

## 升级依赖

```bash
cd diary-backend

# 检查可更新的依赖
mvn versions:display-dependency-updates

# 检查可更新的插件
mvn versions:display-plugin-updates

# 更新到最新版本
mvn versions:use-latest-versions
```

## 构建优化

```bash
# 跳过测试快速构建
mvn clean package -DskipTests

# 并行构建
mvn clean package -T 1C

# 使用镜像加速（如阿里云）
mvn clean package -Dmaven.repo.local=/path/to/repo
```

## 发送HTTP请求示例（curl）

### 注册
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "123456",
    "nickname": "John"
  }'
```

### 登录
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "password": "123456"
  }'
```

### 获取所有日记
```bash
curl -X GET http://localhost:8080/api/diaries \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 创建日记
```bash
curl -X POST http://localhost:8080/api/diaries \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "今天很开心",
    "content": "记录内容",
    "mood": "happy",
    "weather": "sunny"
  }'
```

## 有用的资源链接

- [Spring Boot官网](https://spring.io/projects/spring-boot)
- [Spring Data JPA文档](https://spring.io/projects/spring-data-jpa)
- [JWT介绍](https://jwt.io/)
- [MySQL官网](https://www.mysql.com/)
- [MDN Web文档](https://developer.mozilla.org/)

---

💡 **提示**: 保留本文件方便快速查阅！
