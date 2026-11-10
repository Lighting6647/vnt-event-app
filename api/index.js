import fs from 'fs';
import path from 'path';

// Fallback initial participants
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
  { id: 'TOUR-010', name: 'พรทิพย์ สุวรรณภูมิ', teamColor: 'gold', busNumber: 'รถบัสคันที่ 5 (ทะเบียน 30-9900)', foodClaimed: false, foodClaimedAt: null, score: 100, quizAnswered: true, quizScore: 70, costumeInspiration: 'ชุดระยิบระยับสีทองเฉิดฉาย เพื่อชัยชนะทีมสีทอง', joinEveningContest: 'yes', wonPrize: false, wonPrizeName: null }
];

// In Vercel serverless environment, writable directory is /tmp
const STORAGE_FILE = process.env.VERCEL ? '/tmp/database.json' : path.join(process.cwd(), 'data', 'database.json');

function getDB() {
  if (fs.existsSync(STORAGE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf8'));
    } catch {
      return INITIAL_PARTICIPANTS;
    }
  }
  // Try reading from data/database.json
  const localDb = path.join(process.cwd(), 'data', 'database.json');
  if (fs.existsSync(localDb)) {
    try {
      const data = JSON.parse(fs.readFileSync(localDb, 'utf8'));
      saveDB(data);
      return data;
    } catch {}
  }
  saveDB(INITIAL_PARTICIPANTS);
  return INITIAL_PARTICIPANTS;
}

function saveDB(data) {
  try {
    const dir = path.dirname(STORAGE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save to storage:', e);
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';
  const pathname = url.split('?')[0].replace('/api', '') || '/';

  // 1. GET /api/participants
  if (pathname === '/participants' && req.method === 'GET') {
    const data = getDB();
    return res.status(200).json({ success: true, count: data.length, data });
  }

  // 2. POST /api/claim-food
  if (pathname === '/claim-food' && req.method === 'POST') {
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ success: false, message: 'กรุณาระบุรหัส' });

    const data = getDB();
    const p = data.find(item => item.id.toUpperCase() === id.toUpperCase());
    if (!p) return res.status(404).json({ success: false, message: 'ไม่พบรหัสผู้ร่วมงาน' });

    if (p.foodClaimed) {
      const time = new Date(p.foodClaimedAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
      return res.status(409).json({
        success: false,
        alreadyClaimed: true,
        message: `ได้รับอาหารไปแล้วเมื่อ ${time} น.`,
        participant: p
      });
    }

    p.foodClaimed = true;
    p.foodClaimedAt = new Date().toISOString();
    saveDB(data);
    return res.status(200).json({
      success: true,
      message: `รับอาหารสำเร็จเรียบร้อย (${p.name})`,
      participant: p
    });
  }

  // 3. POST /api/add-score
  if (pathname === '/add-score' && req.method === 'POST') {
    const { id, points } = req.body || {};
    const data = getDB();

    const teamMembers = data.filter(p => p.teamColor && p.teamColor.toLowerCase() === id.toLowerCase());
    if (teamMembers.length > 0) {
      teamMembers.forEach(p => { p.score = (p.score || 0) + Number(points); });
      saveDB(data);
      return res.status(200).json({ success: true, message: `เพิ่มคะแนนทีม ${id} +${points}`, updatedParticipants: data });
    }

    const p = data.find(item => item.id.toUpperCase() === id.toUpperCase());
    if (!p) return res.status(404).json({ success: false, message: 'ไม่พบรหัสผู้ร่วมงาน' });
    p.score = (p.score || 0) + Number(points);
    saveDB(data);
    return res.status(200).json({ success: true, message: `เพิ่มคะแนน ${p.name} +${points}`, participant: p });
  }

  // 4. POST /api/participants (Add)
  if (pathname === '/participants' && req.method === 'POST') {
    const { name, teamColor, busNumber } = req.body || {};
    const data = getDB();
    const newNum = (data.length + 1).toString().padStart(3, '0');
    const newP = {
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
    data.push(newP);
    saveDB(data);
    return res.status(200).json({ success: true, message: 'เพิ่มผู้ร่วมงานใหม่สำเร็จ', participant: newP });
  }

  // 5. DELETE /api/participants/:id
  if (pathname.startsWith('/participants/') && req.method === 'DELETE') {
    const targetId = pathname.replace('/participants/', '').toUpperCase();
    let data = getDB();
    const idx = data.findIndex(p => p.id.toUpperCase() === targetId);
    if (idx === -1) return res.status(404).json({ success: false, message: 'ไม่พบรหัสผู้ร่วมงาน' });
    const removed = data[idx];
    data.splice(idx, 1);
    saveDB(data);
    return res.status(200).json({ success: true, message: `ลบรายชื่อ ${removed.name} สำเร็จ`, deletedId: targetId });
  }

  // 6. Default Server Info
  if (pathname === '/server-info') {
    return res.status(200).json({ success: true, vercel: true });
  }

  return res.status(200).json({ success: true, message: 'API ready' });
}