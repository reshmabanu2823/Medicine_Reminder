@echo off
echo Starting Medicine Reminder Application...
echo.

echo Step 1: Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm run dev"

echo Step 2: Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Step 3: Starting Frontend...
cd ..\frontend
start "Frontend Server" cmd /k "npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Make sure your MongoDB Atlas IP is whitelisted!
echo Current IP should be added to Atlas Network Access.
echo.
pause