@echo off
title Tour & Event Management App 2026
color 0A
echo ===================================================
echo     TOUR & EVENT MANAGEMENT APPLICATION 2026
echo     ระบบจัดการงานทัวร์ บัตร QR & สุ่มรางวัลช้าๆ
echo ===================================================
echo.
echo กำลังเริ่มต้นเซิร์ฟเวอร์...
echo เมื่อเปิดสำเร็จ สามารถเปิดใช้งานได้ที่:
echo   - บนคอมพิวเตอร์เครื่องนี้: http://localhost:3001
echo   - บนมือถือ (เชื่อมต่อ Wi-Fi เดียวกัน): http://192.168.1.135:3001
echo.
echo รหัสผ่านเข้าเมนู Admin: 2026 หรือ 1234
echo ===================================================
echo.
start http://localhost:3001
node server.js
pause
