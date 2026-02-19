#!/bin/bash

# 日记网站快速启动脚本

echo ""
echo "========================================"
echo "    📔 日记网站启动脚本"
echo "========================================"
echo ""

# 检查Java
echo "正在检查Java环境..."
if ! command -v java &> /dev/null; then
    echo "错误: 未找到Java, 请先安装JDK 17或更新版本"
    exit 1
fi

# 检查Maven
echo "正在检查Maven..."
if ! command -v mvn &> /dev/null; then
    echo "错误: 未找到Maven, 请先安装Maven"
    exit 1
fi

# 创建后端启动脚本
echo ""
echo "启动后端应用 (Spring Boot)..."
echo "更多信息: http://localhost:8080"

cd diary-backend
mvn spring-boot:run &
BACKEND_PID=$!
cd ..

# 等待后端启动
echo "等待后端启动..."
sleep 10

# 创建前端启动脚本
echo ""
echo "启动前端应用..."
cd diary-frontend

if command -v python3 &> /dev/null; then
    python3 -m http.server 3000 &
    FRONTEND_PID=$!
elif command -v python &> /dev/null; then
    python -m http.server 3000 &
    FRONTEND_PID=$!
else
    echo "警告: 未找到Python, 请手动启动前端"
    echo "命令: cd diary-frontend && python -m http.server 3000"
fi

cd ..

echo ""
echo "========================================"
echo "✅ 应用已启动!"
echo "========================================"
echo ""
echo "📌 访问地址:"
echo "   前端: http://localhost:3000"
echo "   后端: http://localhost:8080"
echo ""
echo "📝 默认测试账户可在应用中注册"
echo ""
echo "按 Ctrl+C 停止应用..."
echo ""

# 等待进程
wait
