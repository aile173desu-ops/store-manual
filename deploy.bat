@echo off
echo ========================================
echo   店舗マニュアル - デプロイ
echo ========================================
echo.
cd /d "%~dp0"
set PATH=C:\Program Files\GitHub CLI;%PATH%
git add -A
git commit -m "マニュアル更新 %date% %time%"
git push origin master
echo.
echo ========================================
echo   デプロイ完了！
echo   URL: https://aile173desu-ops.github.io/store-manual/
echo ========================================
pause
