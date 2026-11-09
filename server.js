import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial fallback mock data
const INITIAL_PARTICIPANTS = [
  { id: 'TOUR-001', name: 'สมชาย ใจดีเจริญ', teamColor: 'yellow', busNumber: 'รถบัสคันที่ 2 (ทะเบียน 30-3344)', foodClaimed: false, foodClaimedAt: null, score: 50, quizAnswered: false, quizScore: 0, costumeInspiration: 'ธีมทะเลสไตล์ฮาวาย ผสมผสานสีเหลืองสดใส', joinEveningContest: 'yes', wonPrize: false, wonPrizeName: null },
  { id: 'TOUR-002', name: 'วราภรณ์ สายบุญ', teamColor: 'cyan', busNumber: 'รถบัสคันที่ 1 (ทะเบียน 30-1122)', foodClaimed: true, foodClaimedAt: '2026-11-06T11:45:00.000Z', score: 80, quizAnswered: true, quizScore: 40, costumeInspiration: 'ชุดเดรสสีฟ้าคราม สื่อถึงท้องฟ้าและน้ำทะเล', joinEveningContest: 'yes', wonPrize: false, wonPrizeName: null },
  { id: 'TOUR-003', name: 'กิตติศักดิ์ พัฒนาการ', teamColor: 'red', busNumber: 'รถบัสคันที่ 1 (ทะเบียน 30-1122)', foodClaimed: false, foodClaimedAt: null, score: 40, quizAnswered: false, quizScore: 0, costumeInspiration: 'เสื้อเชิ้ตแดงแรงฤทธิ์ พร้อมแว่นกันแดดสุดเท่', joinEveningContest: 'no', wonPrize: false, wonPrizeName: null },
  { id: 'TOUR-004', name: 'ณิชาภัทร ศรีสุนทร', teamColor: 'pink', busNumber: 'รถบัสคันที่ 3 (ทะเบียน 30-5566)', foodClaimed: true, foodClaimedAt: '2026-11-06T11:50:12.000Z', score: 60, quizAnswered: true, quizScore: 50, costumeInspiration: 'ชุดวินเทจสีชมพูพาสเทล หวานและอบอุ่น', joinEveningContest: 'yes', wonPrize: false, wonPrizeName: null },
  { id: 'TOUR-005', name: 'ธีรเดช รัตนศิลป์', teamColor: 'blue', busNumber: 'รถบัสคันที่ 2 (ทะเบียน 30-3344)', foodClaimed: false, foodClaimedAt: null, score: 70, quizAnswered: false, quizScore: 0, costumeInspiration: 'สไตล์สปอร์ตแคชชวล คล่องตัวพร้อมลุย', joinEveningContest: 'yes', wonPrize: false, wonPrizeName: null },
  { id: 'TOUR-006', name: 'ปวีณา มณีโชติ', teamColor: 'green', busNumber: 'รถบัสคันที่ 3 (ทะเบียน 30-5566)', foodClaimed: false, foodClaimedAt: null, score: 90, quizAnswered: true, quizScore: 70, costumeInspiration: 'ชุดลายใบไม้ Tropical สดชื่นเข้ากับธรรมชาติ', joinEveningContest: 'yes', wonPrize: false, wonPrizeName: null },
  { id: 'TOUR-007', name: 'อภิสิทธิ์ วงศ์สวัสดิ์', teamColor: 'orange', busNumber: 'รถบัสคันที่ 4 (ทะเบียน 30-7788)', foodClaimed: true, foodClaimedAt: '2026-11-06T12:01:25.000Z', score: 45, quizAnswered: false, quizScore: 0, costumeInspiration: 'ธีมพระอาทิตย์อัสดง ส้มจี๊ดโดดเด่น', joinEveningContest: 'no', wonPrize: false, wonPrizeName: null },
  { id: 'TOUR-008', name: 'ชลธิชา พงษ์ไพโรจน์', teamColor: 'purple', busNumber: 'รถบัสคันที่ 4 (ทะเบียน 30-7788)', foodClaimed: false, foodClaimedAt: null, score: 85, quizAnswered: true, quizScore: 40, costumeInspiration: 'ชุดสีม่วงลาเวนเดอร์ โบฮีเมียนสุดเก๋', joinEveningContest: 'yes', wonPrize: false, wonPrizeName: null },
  { id: 'TOUR-009', name: 'ธนากร เลิศวิริยะ', teamColor: 'mint', busNumber: 'รถบัสคันที่ 5 (ทะเบียน 30-9900)', foodClaimed: false, foodClaimedAt: null, score: 65, quizAnswered: false, quizScore: 0, costumeInspiration: 'เสื้อเชิ้ตสีมิ้นต์พาสเทล สบายตา ผ่อนคลาย', joinEveningContest: 'yes', wonPrize: false, wonPrizeName: null },
  { id: 'TOUR-010', name: 'พรทิพย์ สุวรรณภูมิ', teamColor: 'gold', busNumber: 'รถบัสคันที่ 5 (ทะเบียน 30-9900)', foodClaimed: false, foodClaimedAt: null, score: 100, quizAnswered: true, quizScore: 70, costumeInspiration: 'ชุดระยิบระยับสีทองเฉิดฉาย เพื่อชัยชนะทีมสีทอง', joinEveningContest: 'yes', wonPrize: false, wonPrizeName: null },
  { id: 'TOUR-011', name: 'สุรชัย มั่นคงดี', teamColor: 'red', busNumber: 'รถบัสคันที่ 1 (ทะเบียน 30-1122)', foodClaimed: false, foodClaimedAt: null, score: 30, quizAnswered: false, quizScore: 0, costumeInspiration: '', joinEveningContest: 'no', wonPrize: false, wonPrizeName: null },
  { id: 'TOUR-012', name: 'กานดา ชัยชนะ', teamColor: 'blue', busNumber: 'รถบัสคันที่ 2 (ทะเบียน 30-3344)', foodClaimed: false, foodClaimedAt: null, score: 55, quizAnswered: false, quizScore: 0, costumeInspiration: 'ชุดกะลาสีเรือสีน้ำเงินเข้ม เข้ากับทัวร์ทะเล', joinEveningContest: 'yes', wonPrize: false, wonPrizeName: null },
  { id: 'TOUR-013', name: 'เอกภพ บวรเกียรติ', teamColor: 'green', busNumber: 'รถบัสคันที่ 3 (ทะเบียน 30-5566)', foodClaimed: true, foodClaimedAt: '2026-11-06T11:58:30.000Z', score: 75, quizAnswered: true, quizScore: 40, costumeInspiration: '', joinEveningContest: 'no', wonPrize: false, wonPrizeName: null },
  { id: 'TOUR-014', name: 'ศิริพร อนันตชัย', teamColor: 'yellow', busNumber: 'รถบัสคันที่ 2 (ทะเบียน 30-3344)', foodClaimed: false, foodClaimedAt: null, score: 60, quizAnswered: false, quizScore: 0, costumeInspiration: 'ชุดเดรสซันฟลาวเวอร์ ลายดอกทานตะวัน', joinEveningContest: 'yes', wonPrize: false, wonPrizeName: null },
  { id: 'TOUR-015', name: 'วีระยุทธ ก้องเกียรติ', teamColor: 'orange', busNumber: 'รถบัสคันที่ 4 (ทะเบียน 30-7788)', foodClaimed: false, foodClaimedAt: null, score: 40, quizAnswered: false, quizScore: 0, costumeInspiration: '', joinEveningContest: 'no', wonPrize: false, wonPrizeName: null },
  { id: 'TOUR-016', name: 'มยุรี รุ่งเรืองกิจ', teamColor: 'purple', busNumber: 'รถบัสคันที่ 4 (ทะเบียน 30-7788)', foodClaimed: false, foodClaimedAt: null, score: 95, quizAnswered: true, quizScore: 70, costumeInspiration: 'ชุดกลิตเตอร์สีม่วงเมทัลลิก โดดเด่นบนฟลอร์เต้นรำ', joinEveningContest: 'yes', wonPrize: false, wonPrizeName: null },
  { id: 'TOUR-017', name: 'พงศกร สันติสุข', teamColor: 'pink', busNumber: 'รถบัสคันที่ 3 (ทะเบียน 30-5566)', foodClaimed: false, foodClaimedAt: null, score: 35, quizAnswered: false, quizScore: 0, costumeInspiration: '', joinEveningContest: 'no', wonPrize: false, wonPrizeName: null },
  { id: 'TOUR-018', name: 'นันทนา เกียรติไพบูลย์', teamColor: 'cyan', busNumber: 'รถบัสคันที่ 1 (ทะเบียน 30-1122)', foodClaimed: false, foodClaimedAt: null, score: 70, quizAnswered: false, quizScore: 0, costumeInspiration: 'ชุดชาวเกาะฮาวายสีเทอร์ควอยซ์ ริมหาด', joinEveningContest: 'yes', wonPrize: false, wonPrizeName: null },
  { id: 'TOUR-019', name: 'เจษฎา ศักดิ์เจริญ', teamColor: 'mint', busNumber: 'รถบัสคันที่ 5 (ทะเบียน 30-9900)', foodClaimed: false, foodClaimedAt: null, score: 50, quizAnswered: false, quizScore: 0, costumeInspiration: '', joinEveningContest: 'no', wonPrize: false, wonPrizeName: null },
  { id: 'TOUR-020', name: 'อรทัย มงคลทรัพย์', teamColor: 'gold', busNumber: 'รถบัสคันที่ 5 (ทะเบียน 30-9900)', foodClaimed: false, foodClaimedAt: null, score: 80, quizAnswered: true, quizScore: 50, costumeInspiration: 'ชุดไทยประยุกต์สีทอง เรียบหรูดูสง่างาม', joinEveningContest: 'yes', wonPrize: false, wonPrizeName: null },
];

function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    saveDB(INITIAL_PARTICIPANTS);
    return INITIAL_PARTICIPANTS;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading DB file, resetting to initial', e);
    saveDB(INITIAL_PARTICIPANTS);
    return INITIAL_PARTICIPANTS;
  }
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// GET all participants
app.get('/api/participants', (req, res) => {
  const data = loadDB();
  res.json({ success: true, count: data.length, data });
});

// GET single participant by ID
app.get('/api/participants/:id', (req, res) => {
  const data = loadDB();
  const found = data.find(p => p.id.toUpperCase() === req.params.id.toUpperCase());
  if (!found) {
    return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลผู้ร่วมงานรหัสนี้' });
  }
  res.json({ success: true, data: found });
});

// POST claim food
app.post('/api/claim-food', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, message: 'กรุณาระบุรหัสผู้ร่วมงาน' });
  }

  const data = loadDB();
  const participant = data.find(p => p.id.toUpperCase() === id.toUpperCase());

  if (!participant) {
    return res.status(404).json({ success: false, message: 'ไม่พบรหัสผู้ร่วมงานในระบบ' });
  }

  // DUPLICATE CLAIM CHECK
  if (participant.foodClaimed) {
    const timeFormatted = new Date(participant.foodClaimedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    return res.status(409).json({
      success: false,
      alreadyClaimed: true,
      message: `❌ ผู้ร่วมงานท่านนี้ได้รับอาหารไปแล้วเมื่อเวลา ${timeFormatted} น. (ป้องกันการรับซ้ำ)`,
      participant,
    });
  }

  // Process claim
  participant.foodClaimed = true;
  participant.foodClaimedAt = new Date().toISOString();
  saveDB(data);

  res.json({
    success: true,
    message: `✅ รับอาหารสำเร็จเรียบร้อย (${participant.name} - ${participant.busNumber})`,
    participant,
  });
});

// POST award score to participant & team color
app.post('/api/add-score', (req, res) => {
  const { id, points, reason } = req.body;
  if (!id || points === undefined) {
    return res.status(400).json({ success: false, message: 'กรุณาระบุรหัสและคะแนน' });
  }

  const data = loadDB();

  // Check if id is a team color
  const teamMembers = data.filter(p => p.teamColor && p.teamColor.toLowerCase() === id.toLowerCase());
  if (teamMembers.length > 0) {
    teamMembers.forEach(p => {
      p.score = (p.score || 0) + Number(points);
    });
    saveDB(data);
    return res.json({
      success: true,
      message: `🎉 เพิ่มคะแนน +${points} ให้กับทุกคนในทีม ${id} สำเร็จ!`,
      updatedParticipants: data,
    });
  }

  const participant = data.find(p => p.id.toUpperCase() === id.toUpperCase());

  if (!participant) {
    return res.status(404).json({ success: false, message: 'ไม่พบรหัสผู้ร่วมงานในระบบ' });
  }

  participant.score = (participant.score || 0) + Number(points);
  saveDB(data);

  res.json({
    success: true,
    message: `🎉 เพิ่มคะแนน +${points} ให้กับ ${participant.name} (ทีม${participant.teamColor}) สำเร็จ!`,
    participant,
  });
});

// POST submit activity (quiz / costume / contest choice)
app.post('/api/submit-activity', (req, res) => {
  const { id, quizScore, costumeInspiration, joinEveningContest } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, message: 'กรุณาระบุรหัส' });
  }

  const data = loadDB();
  const participant = data.find(p => p.id.toUpperCase() === id.toUpperCase());

  if (!participant) {
    return res.status(404).json({ success: false, message: 'ไม่พบรหัสผู้ร่วมงาน' });
  }

  if (quizScore !== undefined) {
    participant.quizAnswered = true;
    participant.quizScore = (participant.quizScore || 0) + Number(quizScore);
    participant.score = (participant.score || 0) + Number(quizScore);
  }

  if (costumeInspiration !== undefined) {
    participant.costumeInspiration = costumeInspiration;
  }

  if (joinEveningContest !== undefined) {
    participant.joinEveningContest = joinEveningContest;
  }

  saveDB(data);
  res.json({ success: true, message: 'บันทึกข้อมูลกิจกรรมเรียบร้อยแล้ว', participant });
});

// POST award prize in lucky draw
app.post('/api/award-prize', (req, res) => {
  const { id, prizeName } = req.body;
  if (!id || !prizeName) {
    return res.status(400).json({ success: false, message: 'กรุณาระบุผู้ชนะและรางวัล' });
  }

  const data = loadDB();
  const participant = data.find(p => p.id.toUpperCase() === id.toUpperCase());

  if (!participant) {
    return res.status(404).json({ success: false, message: 'ไม่พบผู้ร่วมงาน' });
  }

  participant.wonPrize = true;
  participant.wonPrizeName = prizeName;
  saveDB(data);

  res.json({ success: true, message: `บันทึกรางวัล ${prizeName} ให้กับ ${participant.name} สำเร็จ`, participant });
});

// POST reset data
app.post('/api/reset-data', (req, res) => {
  const { mode } = req.body; // 'all' or 'food-only' or 'prizes-only'
  let data = loadDB();

  if (mode === 'all') {
    saveDB(INITIAL_PARTICIPANTS);
    return res.json({ success: true, message: 'รีเซ็ตข้อมูลทั้งหมดเป็นค่าเริ่มต้นเรียบร้อย' });
  }

  if (mode === 'food-only') {
    data.forEach(p => {
      p.foodClaimed = false;
      p.foodClaimedAt = null;
    });
    saveDB(data);
    return res.json({ success: true, message: 'รีเซ็ตสถานะการรับอาหารของทุกคนเรียบร้อย' });
  }

  if (mode === 'prizes-only') {
    data.forEach(p => {
      p.wonPrize = false;
      p.wonPrizeName = null;
    });
    saveDB(data);
    return res.json({ success: true, message: 'รีเซ็ตประวัติการจับรางวัลเรียบร้อย' });
  }

  res.status(400).json({ success: false, message: 'Invalid reset mode' });
});

// POST add new participant
app.post('/api/participants', (req, res) => {
  const { name, teamColor, busNumber } = req.body;
  if (!name || !teamColor || !busNumber) {
    return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  const data = loadDB();
  const newNum = (data.length + 1).toString().padStart(3, '0');
  const newParticipant = {
    id: `TOUR-${newNum}`,
    name,
    teamColor,
    busNumber,
    foodClaimed: false,
    foodClaimedAt: null,
    score: 0,
    quizAnswered: false,
    quizScore: 0,
    costumeInspiration: '',
    joinEveningContest: 'no',
    wonPrize: false,
    wonPrizeName: null,
  };

  data.push(newParticipant);
  saveDB(data);
  res.json({ success: true, message: 'เพิ่มผู้ร่วมงานใหม่สำเร็จ', participant: newParticipant });
});

// Serve frontend if dist exists
const DIST_PATH = path.join(__dirname, 'dist');
if (fs.existsSync(DIST_PATH)) {
  app.use(express.static(DIST_PATH));
  app.use((req, res) => {
    res.sendFile(path.join(DIST_PATH, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Tour & Event Backend API is running on http://localhost:${PORT}`);
});
