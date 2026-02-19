@echo off
REM 日记网站快速启动脚本

echo.
echo ========================================
echo    📔 日记网站启动脚本
echo ========================================
echo.

REM 检查Java
echo 正在检查Java环境...
java -version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Java, 请先安装JDK 17或更新版本
    pause
    exit /b 1
)

REM 检查MySQL
echo 正在检查MySQL...
mysql --version >nul 2>&1
if errorlevel 1 (
    echo 警告: 未找到MySQL, 请确保MySQL已安装并正在运行
)

REM 启动后端
echo.
echo 启动后端应用 (Spring Boot)...
echo 更多信息: http://localhost:8080
cd diary-backend
start "Diary Backend" cmd /k mvn spring-boot:run
cd ..

REM 等待后端启动
echo 等待后端启动...
timeout /t 10 /nobreak

REM 启动前端
echo.
echo 启动前端应用...
cd diary-frontend
echo 前端地址: http://localhost:3000
start "Diary Frontend" cmd /k python -m http.server 3000
cd ..

echo.
echo ========================================
echo ✅ 应用已启动!
echo ========================================
echo.
echo 📌 访问地址:
echo   前端: http://localhost:3000
echo   后端: http://localhost:8080
echo.
echo 📝 默认测试账户可在应用中注册
echo.
echo 按任意键退出...
pause

REM 清理
taskkill /FI "WINDOWTITLE eq Diary Backend" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Diary Frontend" /T /F >nul 2>&1
