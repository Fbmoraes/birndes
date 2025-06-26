@echo off
echo Preparando projeto para deploy no Vercel...

echo.
echo 1. Limpando arquivos desnecessarios...
if exist node_modules rmdir /s /q node_modules
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out

echo.
echo 2. Instalando dependencias...
npm install

echo.
echo 3. Testando build...
npm run build

echo.
echo 4. Limpando build de teste...
if exist .next rmdir /s /q .next

echo.
echo ✅ Projeto pronto para deploy!
echo.
echo Para fazer deploy:
echo   1. Via Vercel CLI: vercel
echo   2. Via GitHub: git push origin main
echo.
pause