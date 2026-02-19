# 📔 日记网站 - Diary App

一个基于Spring Boot + HTML/JavaScript的现代化日记网站，提供卡片式布局，优雅的用户界面，轻松记录生活中的美好瞬间。

## 功能特性

✨ **用户系统**
- 用户注册和登录
- JWT令牌认证
- 个人资料管理

📝 **日记功能**
- 创建、编辑、删除日记
- 支持富文本内容
- 心情、天气、位置标签
- 图片上传支持
- 自动时间戳记录

🎨 **用户界面**
- 现代卡片式布局
- 响应式设计（桌面/平板/手机）
- 深色主题支持（可选）
- 平滑动画效果

🔍 **查询和筛选**
- 按月份筛选
- 按心情筛选
- 全文搜索
- 日期范围查询

## 项目结构

```
diary-app/
├── diary-backend/          # Spring Boot后端
│   ├── src/main/java/com/diary/
│   │   ├── config/         # 配置类（Security、JWT）
│   │   ├── entity/         # 数据实体
│   │   ├── repository/     # 数据访问层
│   │   ├── service/        # 业务逻辑层
│   │   ├── controller/     # API控制层
│   │   └── DiaryApplication.java
│   ├── src/main/resources/
│   │   └── application.yml # 应用配置
│   └── pom.xml            # Maven依赖
├── diary-frontend/         # HTML/JavaScript前端
│   ├── index.html         # 主页面
│   ├── css/
│   │   └── style.css      # 样式表
│   └── js/
│       ├── api.js         # API客户端
│       └── app.js         # 应用逻辑
└── README.md
```

## 技术栈

### 后端
- **Spring Boot 3.2.0** - 应用框架
- **Spring Data JPA** - 数据持久化
- **Spring Security** - 认证授权
- **JWT (JJWT)** - 令牌管理
- **MySQL 8.0** - 数据库

### 前端
- **HTML5** - 页面结构
- **CSS3** - 样式
- **Vanilla JavaScript** - 交互逻辑
- **Fetch API** - HTTP请求

## 快速开始

### 前置要求
- JDK 17+
- Maven 3.6+
- MySQL 8.0+
- 现代Web浏览器

### 后端启动

#### 1. 创建数据库
```sql
CREATE DATABASE diary_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE diary_db;
```

#### 2. 配置数据库连接
编辑 `diary-backend/src/main/resources/application.yml`：
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/diary_db?useSSL=false&serverTimezone=UTC
    username: root
    password: your_password  # 改为你的MySQL密码
```

#### 3. 编译和运行
```bash
cd diary-backend
mvn clean install
mvn spring-boot:run
```

后端将在 `http://localhost:8080` 启动

### 前端运行

#### 1. 启动本地服务器
```bash
cd diary-frontend
# 使用Python 3
python -m http.server 3000

# 或使用Node.js http-server
npx http-server -p 3000
```

#### 2. 访问应用
在浏览器打开 `http://localhost:3000`

## API 文档

### 认证接口

#### 注册
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john",
  "email": "john@example.com",
  "password": "123456",
  "nickname": "John"
}
```

#### 登录
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "john",
  "password": "123456"
}
```

#### 获取个人信息
```
GET /api/auth/profile
Authorization: Bearer {token}
```

#### 更新个人信息
```
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "nickname": "John Doe",
  "avatar": "https://example.com/avatar.jpg"
}
```

### 日记接口

#### 创建日记
```
POST /api/diaries
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "今天很开心",
  "content": "今天发生了很多有趣的事...",
  "mood": "happy",
  "weather": "sunny",
  "location": "公园",
  "tags": "开心,朋友,冒险",
  "imageUrl": "https://example.com/image.jpg"
}
```

#### 获取所有日记
```
GET /api/diaries
Authorization: Bearer {token}
```

#### 按月份查询
```
GET /api/diaries/month?year=2024&month=2
Authorization: Bearer {token}
```

#### 获取单条日记
```
GET /api/diaries/{id}
Authorization: Bearer {token}
```

#### 更新日记
```
PUT /api/diaries/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "更新的标题",
  "content": "更新的内容",
  "mood": "calm"
}
```

#### 删除日记
```
DELETE /api/diaries/{id}
Authorization: Bearer {token}
```

## 配置说明

### JWT配置
在 `application.yml` 中修改：
```yaml
jwt:
  secret: your-secret-key  # 生产环境必须改动
  expiration: 86400000     # 令牌过期时间（毫秒）
```

### CORS配置
后端已配置允许所有来源的CORS请求，生产环境应限制为特定域名：
```java
configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
```

## 使用说明

1. **注册账户** - 输入用户名、邮箱、密码注册
2. **编写日记** - 点击"新建日记"按钮
3. **记录心情** - 选择当前的心情、天气、位置
4. **添加标签** - 用逗号分隔多个标签
5. **上传图片** - 粘贴图片链接（支持任何在线图片URL）
6. **查看历史** - 在左侧按月份或心情筛选
7. **搜索日记** - 使用顶部搜索框快速查找

## 功能演示

### 卡片式布局
- 每条日记显示为精美的卡片
- 支持图片预览
- 心情和天气标签一目了然

### 完整的CRUD操作
- **创建** - 新建日记
- **读取** - 查看日记列表和详情
- **更新** - 编辑已有日记
- **删除** - 删除不需要的日记

### 智能筛选
- 按年月快速定位
- 按心情分类查看
- 全文搜索关键词

## 安全性

- JWT令牌认证确保只有授权用户可以访问
- 密码使用BCrypt加密存储
- 用户只能访问和修改自己的日记

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 开发说明

### 添加新字段
1. 修改 `Diary.java` 实体类
2. 在 `application.yml` 中配置 `ddl-auto: update`
3. 重启应用自动创建表

### 自定义样式
编辑 `diary-frontend/css/style.css` 中的CSS变量：
```css
:root {
    --primary-color: #7c3aed;
    --secondary-color: #ec4899;
    /* ... 更多变量 */
}
```

## 生产部署

### 后端打包
```bash
cd diary-backend
mvn clean package
java -jar target/diary-backend-1.0.0.jar
```

### 前端部署
```bash
# 构建静态资源
# 部署到Nginx或其他Web服务器
scp -r diary-frontend/* user@server:/var/www/diary/
```

## 故障排除

### 后端连接数据库失败
- 检查MySQL是否运行
- 验证数据库连接信息
- 检查防火墙设置

### 前端无法连接后端
- 确认后端运行在8080端口
- 检查CORS配置
- 查看浏览器控制台错误信息

### 登录失败
- 确认用户已注册
- 检查密码是否正确
- 查看后端日志

## 性能优化

- 数据库查询使用索引
- 前端使用本地存储缓存用户信息
- 图片使用懒加载
- CSS使用CSS变量动态主题

## 扩展功能建议

- [ ] 支持Markdown编辑
- [ ] 日记分享功能
- [ ] 评论和点赞
- [ ] 日记导出为PDF
- [ ] 黑暗模式
- [ ] 多语言支持
- [ ] 文件上传到服务器
- [ ] 日记统计和分析
- [ ] 实时同步多个设备

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！

## 联系方式

如有问题，请提交Issue或联系开发者。

---

享受使用日记网站，记录生活中的美好瞬间吧！🎉
