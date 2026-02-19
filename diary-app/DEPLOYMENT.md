# 日记网站部署指南

## 快速开始

### Windows用户
```bash
# 双击运行 start.bat
start.bat
```

### Mac/Linux用户
```bash
# 给脚本赋予执行权限
chmod +x start.sh

# 运行启动脚本
./start.sh
```

## 环境要求检查清单

- [ ] Java JDK 17+ 已安装
- [ ] Maven 3.6+ 已安装
- [ ] MySQL 8.0+ 已安装并运行
- [ ] Python 3+ 已安装（用于前端开发服务器）

## 手动启动步骤

### 1. 初始化数据库

首先，创建数据库并初始化表：

```bash
# 登录MySQL
mysql -u root -p

# 在MySQL命令行中执行
source init.sql
```

或者使用MySQL Workbench导入`init.sql`文件。

### 2. 配置后端

编辑 `diary-backend/src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/diary_db?useSSL=false&serverTimezone=UTC
    username: root
    password: 你的MySQL密码
```

### 3. 启动后端

```bash
cd diary-backend
mvn clean install
mvn spring-boot:run
```

输出应该包含：
```
Started DiaryApplication in X seconds
```

### 4. 启动前端

在新的终端窗口中：

```bash
cd diary-frontend

# 使用Python 3
python -m http.server 3000

# 或使用 Python 2
python -m SimpleHTTPServer 3000

# 或使用 Node.js (如果已安装)
npx http-server -p 3000
```

### 5. 访问应用

在浏览器打开：`http://localhost:3000`

## Docker部署（可选）

### 后端Docker化

创建 `diary-backend/Dockerfile`：

```dockerfile
FROM maven:3.8.1-openjdk-17 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:17-slim
WORKDIR /app
COPY --from=builder /app/target/diary-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

构建和运行：

```bash
# 构建镜像
docker build -t diary-api:latest diary-backend/

# 运行容器
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/diary_db \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=your_password \
  diary-api:latest
```

### 前端Docker化

创建 `diary-frontend/Dockerfile`：

```dockerfile
FROM nginx:latest
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

创建 `diary-frontend/nginx.conf`：

```nginx
events {
    worker_connections 1024;
}

http {
    server {
        listen 80;
        server_name _;
        
        root /usr/share/nginx/html;
        index index.html index.htm;
        
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        location /api {
            proxy_pass http://api:8080/api;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

构建和运行：

```bash
# 构建镜像
docker build -t diary-web:latest diary-frontend/

# 运行容器
docker run -p 3000:80 diary-web:latest
```

## Docker Compose一键启动

创建项目根目录的 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: diary_db
    ports:
      - "3306:3306"
    volumes:
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
      - mysql_data:/var/lib/mysql

  api:
    build: ./diary-backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/diary_db
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root
    depends_on:
      - mysql

  web:
    build: ./diary-frontend
    ports:
      - "3000:80"
    depends_on:
      - api

volumes:
  mysql_data:
```

启动所有服务：

```bash
docker-compose up -d
```

## 生产环境部署

### 后端生产打包

```bash
cd diary-backend
mvn clean package -DskipTests
```

生成的JAR文件位于 `target/diary-backend-1.0.0.jar`

### 在服务器上运行

```bash
# 后台运行
nohup java -jar diary-backend-1.0.0.jar > app.log 2>&1 &

# 使用systemd（推荐）
sudo systemctl start diary-app
sudo systemctl enable diary-app
```

创建 `/etc/systemd/system/diary-app.service`：

```ini
[Unit]
Description=Diary Application
After=network.target

[Service]
User=app
WorkingDirectory=/home/app/diary
ExecStart=/usr/bin/java -jar diary-backend-1.0.0.jar
Restart=always
RestartSec=10
StandardOutput=append:/var/log/diary-app.log
StandardError=append:/var/log/diary-app.log

[Install]
WantedBy=multi-user.target
```

### 前端生产部署

使用Nginx反向代理：

```nginx
upstream backend {
    server localhost:8080;
}

server {
    listen 80;
    server_name diary.example.com;
    
    root /var/www/diary;
    index index.html;
    
    # 解决SPA路由问题
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 代理API请求
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### SSL/HTTPS配置

使用Let's Encrypt获取免费证书：

```bash
# 安装certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot certonly --nginx -d diary.example.com

# 修改Nginx配置
listen 443 ssl;
ssl_certificate /etc/letsencrypt/live/diary.example.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/diary.example.com/privkey.pem;

# 自动更新证书
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## 故障排除

### 问题：后端无法连接数据库

**解决方案：**
1. 检查MySQL是否运行：`mysql -u root -p`
2. 检查数据库是否创建：`SHOW DATABASES;`
3. 检查application.yml中的连接字符串
4. 查看后端日志获取详细错误

### 问题：前端无法连接后端API

**解决方案：**
1. 确认后端运行在8080端口
2. 检查CORS配置是否正确
3. 在浏览器F12开发者工具中查看Network标签
4. 检查防火墙设置

### 问题：登录后自动退出登录

**解决方案：**
1. 检查JWT secret是否一致
2. 检查令牌过期时间配置
3. 清除浏览器localStorage：`localStorage.clear()`

### 问题：MySQL字符编码问题

**解决方案：**
```sql
ALTER DATABASE diary_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE diaries CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 性能优化建议

1. **数据库优化**
   - 为常用字段建立索引
   - 使用连接池
   - 定期维护表结构

2. **前端优化**
   - 启用gzip压缩
   - 使用CDN加速静态资源
   - 懒加载图片

3. **后端优化**
   - 使用Redis缓存
   - 实现分页查询
   - 优化数据库查询

## 监控和日志

### 后端日志

默认日志位置：应用运行目录的日志文件

修改日志级别 - `application.yml`：

```yaml
logging:
  level:
    root: WARN
    com.diary: DEBUG
  file:
    name: logs/diary.log
    max-size: 10MB
    max-history: 10
```

### 前端调试

在浏览器F12开发者工具中：
- Console标签查看错误
- Network标签查看API调用
- Storage标签查看localStorage数据

## 备份和恢复

### 数据库备份

```bash
# 导出数据库
mysqldump -u root -p diary_db > backup.sql

# 恢复数据库
mysql -u root -p diary_db < backup.sql
```

### 定期备份脚本

创建 `backup.sh`：

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u root -p diary_db > backups/diary_$DATE.sql

# 只保留最近7天的备份
find backups/ -name "diary_*.sql" -mtime +7 -delete
```

## 联系和支持

如有问题，请参考项目文档或提交Issue。

祝部署顺利！🚀
