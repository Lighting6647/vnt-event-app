# Tour & Event Management App 2026 🚌✨
### ระบบจัดการงานทัวร์ สันทนาการ 10 สี บัตรดิจิทัล QR Pass และสุ่มรางวัลบนเวที
**พัฒนาสำหรับ บริษัท วีเอ็นที ออร์แกไนเซอร์ อีเว้นท์ จำกัด (VNT Event Organizer Co., Ltd.)**

---

## 🌟 ฟีเจอร์หลัก (Key Features)

1. **บัตรประจำตัวดิจิทัล (Digital Pass & QR Code)**
   - แสดงข้อมูลผู้ร่วมเดินทาง รหัสพนักงาน หมายเลขรถบัส (เช่น รถบัสคันที่ 2 ทะเบียน 30-3344)
   - สีประจำทีม และ QR Code ส่วนตัวสำหรับสแกนรับอาหาร / รับแต้ม
   - ปรับขนาดตัวอักษรใหญ่ คมชัดพิเศษ เหมาะกับหน้าจอสมาร์ทโฟน iPhone / Android

2. **ระบบสแกนสตาฟฟ์ (Staff Scanner & Check-in)**
   - สแกน QR Code ผ่านกล้องมือถือของทีมงานแบบเรียลไทม์
   - บันทึกสถานะการรับอาหารกล่อง ป้องกันการรับซ้ำทันที
   - แจกคะแนนพิเศษรายบุคคล และคะแนนสะสมเข้าทีมสี

3. **ตารางคะแนนรวม 10 สี (Olympic-Style Live Scoreboard)**
   - โพเดียม 3 อันดับแรก (เหรียญทอง, เงิน, ทองแดง)
   - ตารางคะแนนรวม 10 สี พร้อม Progress Bar แสดงระยะห่างของคะแนน
   - รองรับการอัปเดตคะแนนสดแบบ Real-time

4. **กิจกรรมบนรถบัส (Bus Activities & Games)**
   - **เกมทายเพลงฮิต 3 วินาที (Dash MV Feature)**: สุ่มเพลงฮิต T-Pop / สตริง พร้อมระบบเล่นเสียงจริงและปุ่มเฉลย
   - **เกมตอบคำถามชิงรางวัล (Bus Quiz)**: คำถามชวนคิดระหว่างเดินทางบนรถบัส
   - **ส่งชื่อเข้าประกวดชุดแฟนซีค่ำคืนนี้ (Gala Costume Contest)**: ส่งรูปและชื่อชุดลุ้นรางวัลบนเวที

5. **เกมจับผิดภาพ 10 ด่าน (Spot The Difference 10 Levels)**
   - ภาพสถานที่ท่องเที่ยวและกิจกรรมทัวร์ 10 ด่าน พร้อมระบบจับเวลาและสถิติคะแนน

6. **ระบบสุ่มรางวัลช้าๆ บนเวที (Slow-Spin Keynote Lucky Draw)**
   - เอฟเฟกต์หมุนสุ่มชื่อผู้โชคดีแบบช้าๆ ตื่นเต้นสไตล์เวทีใหญ่ Keynote
   - พลุเฉลิมฉลอง Confetti และบันทึกประวัติผู้ได้รับรางวัล

7. **ศูนย์ควบคุมสตาฟฟ์และแอดมิน (Admin Console)**
   - ระบบล็อกความปลอดภัยด้วยรหัสผ่าน (Passcode Protected)
   - จัดการฐานข้อมูลผู้เข้าร่วมงาน (เพิ่ม, แก้ไข, ลบ, ค้นหา, ส่งออกข้อมูล)

---

## 🚀 วิธีการติดตั้งและเริ่มใช้งาน (Getting Started)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รันในโหมด Development (Vite Dev Server)
```bash
npm run dev
```

### 3. สร้าง Production Bundle
```bash
npm run build
```

### 4. รัน Production Server (API + Web Frontend)
```bash
node server.js
# หรือดับเบิลคลิกไฟล์ start_app.bat บน Windows
```
เปิดบราวเซอร์ที่: `http://localhost:3001`

---

## 🛠 เทคโนโลยีที่ใช้ (Tech Stack)
- **Frontend**: React 19, Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Backend API**: Node.js, Express, Local JSON Persistent Database
- **Tooling**: Vite 6, Cloudflare Tunnel
- **Design Standard**: Apple Human Interface Guidelines (Dark Mode Luxury Theme)

---

© 2026 VNT Event Organizer Co., Ltd. All Rights Reserved.
