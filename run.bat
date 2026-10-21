@echo off
chcp 65001 >nul
title Endy - Trợ lý an toàn cho trẻ em
echo =======================================================
echo     ENDY - LÁ CHẮN AN TOÀN CỦA CÁC BẠN NHỎ 🛡️
echo =======================================================
echo Đang khởi động ứng dụng web...

where node >nul 2>nul
if %errorlevel% equ 0 (
    echo Khởi chạy máy chủ Node.js...
    node server.js
) else (
    echo Đang mở trực tiếp tệp index.html trong trình duyệt...
    start "" "index.html"
)
pause
