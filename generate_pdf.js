const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fontkit = require('fontkit');

async function createInfographicPDF() {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // Load Thai Fonts from Windows
  const fontRegularBytes = fs.readFileSync('C:\\Windows\\Fonts\\tahoma.ttf');
  const fontBoldBytes = fs.readFileSync('C:\\Windows\\Fonts\\tahomabd.ttf');
  
  const thaiFont = await pdfDoc.embedFont(fontRegularBytes);
  const thaiFontBold = await pdfDoc.embedFont(fontBoldBytes);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // A4 Size in points: 595.28 x 841.89
  const width = 595.28;
  const height = 841.89;
  const page = pdfDoc.addPage([width, height]);

  // Colors
  const bgDark = rgb(11/255, 15/255, 25/255);
  const cardBg = rgb(17/255, 24/255, 39/255);
  const subCardBg = rgb(24/255, 33/255, 52/255);
  const cardBorder = rgb(31/255, 41/255, 55/255);
  const amber = rgb(245/255, 158/255, 11/255);
  const amberLight = rgb(251/255, 191/255, 36/255);
  const textWhite = rgb(1, 1, 1);
  const textMuted = rgb(148/255, 163/255, 184/255);
  const textLight = rgb(203/255, 213/255, 225/255);
  const emerald = rgb(16/255, 185/255, 129/255);
  const cyan = rgb(6/255, 182/255, 212/255);
  const purple = rgb(168/255, 85/255, 247/255);
  const indigo = rgb(99/255, 102/255, 241/255);
  const rose = rgb(244/255, 63/255, 94/255);

  // Fill Background
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: bgDark,
  });

  const marginX = 28;
  const contentWidth = width - (marginX * 2);

  // --- HEADER SECTION ---
  let curY = height - 28;
  const headerHeight = 78;

  page.drawRectangle({
    x: marginX,
    y: curY - headerHeight,
    width: contentWidth,
    height: headerHeight,
    color: rgb(15/255, 23/255, 42/255),
    borderColor: indigo,
    borderWidth: 1.5,
  });

  // Badge Pill
  page.drawRectangle({
    x: marginX + 16,
    y: curY - 22,
    width: 250,
    height: 14,
    color: rgb(35/255, 28/255, 15/255),
    borderColor: amber,
    borderWidth: 0.8,
  });
  page.drawText('ระบบจัดการงานทัวร์ & สันทนาการ • INFOGRAPHIC SPEC', {
    x: marginX + 22,
    y: curY - 19,
    size: 7.5,
    font: thaiFontBold,
    color: amberLight,
  });

  // Title
  page.drawText('TOUR & EVENT APPLICATION', {
    x: marginX + 16,
    y: curY - 44,
    size: 19,
    font: helveticaBold,
    color: textWhite,
  });

  // Subtitle
  page.drawText('ระบบฐานข้อมูลบัตร QR 10 สี • ตรวจสอบขึ้นรถ • สแกนรับอาหาร • เกมกิจกรรมตอบคำถาม & ประกวดชุด • สุ่มรางวัลช้าๆ ขึ้นจอใหญ่', {
    x: marginX + 16,
    y: curY - 64,
    size: 8.5,
    font: thaiFont,
    color: textMuted,
  });

  curY -= (headerHeight + 14);

  // --- SECTION 1: 4 PILLARS ---
  page.drawRectangle({
    x: marginX,
    y: curY - 18,
    width: 20,
    height: 18,
    color: amber,
  });
  page.drawText('1', {
    x: marginX + 6,
    y: curY - 14,
    size: 11,
    font: helveticaBold,
    color: bgDark,
  });
  page.drawText('4 เสาหลักของระบบ (Core Architecture)', {
    x: marginX + 26,
    y: curY - 10,
    size: 12,
    font: thaiFontBold,
    color: textWhite,
  });
  page.drawText('เชื่อมโยงข้อมูลผู้ร่วมงานตั้งแต่เช็คชื่อเช้าจนถึงเวทีจับรางวัลค่ำ', {
    x: marginX + 26,
    y: curY - 20,
    size: 8,
    font: thaiFont,
    color: textMuted,
  });

  curY -= 28;

  const pillarW = (contentWidth - (3 * 8)) / 4;
  const pillarH = 92;

  const pillars = [
    {
      num: 'PILLAR 01',
      title: 'Digital Tour Pass',
      sub: 'บัตรดิจิทัลบนมือถือ',
      color: amber,
      items: ['ID & QR Code ประจำตัว', 'สังกัดทีม 1 ใน 10 สี', 'เลขรถคันที่ต้องขึ้น', 'สถานะรับอาหาร (กันรับซ้ำ)'],
    },
    {
      num: 'PILLAR 02',
      title: 'Interactive Games',
      sub: 'กิจกรรมตอบคำถาม & แข่งขัน',
      color: emerald,
      items: ['ตอบคำถามเชาวน์สะสมแต้ม', 'แชร์แรงบันดาลใจชุดใส่ทัวร์', 'เช็คชื่อแข่งชุดรอบค่ำ (Yes/No)', 'สแกนรับคะแนนกับสตาฟ'],
    },
    {
      num: 'PILLAR 03',
      title: 'Staff Scanner',
      sub: 'เครื่องมือสตาฟผ่านมือถือ',
      color: cyan,
      items: ['โหมดแจกอาหาร (กันรับซ้ำ)', 'โหมดสแกนเพิ่มแต้มให้ทีมสี', 'สแกนผ่านกล้องมือถือทันที', 'ตรวจสอบสิทธิ์ผู้ร่วมงาน'],
    },
    {
      num: 'PILLAR 04',
      title: 'Projector Stage',
      sub: 'จอโปรเจกเตอร์งานเลี้ยง',
      color: purple,
      items: ['สรุปคะแนนสด 10 สี Real-time', 'สุ่มรายชื่อช้าๆ ขึ้นจอใหญ่', 'ลุ้นระทึกพร้อม Sound & FX', 'กรองตามแต้ม / ผู้แข่งชุด'],
    },
  ];

  pillars.forEach((p, idx) => {
    const px = marginX + (idx * (pillarW + 8));
    page.drawRectangle({
      x: px,
      y: curY - pillarH,
      width: pillarW,
      height: pillarH,
      color: cardBg,
      borderColor: cardBorder,
      borderWidth: 1,
    });
    // Top colored indicator line
    page.drawRectangle({
      x: px,
      y: curY - 2,
      width: pillarW,
      height: 2,
      color: p.color,
    });
    page.drawText(p.num, {
      x: px + 8,
      y: curY - 14,
      size: 7,
      font: helveticaBold,
      color: p.color,
    });
    page.drawText(p.title, {
      x: px + 8,
      y: curY - 26,
      size: 9.5,
      font: helveticaBold,
      color: textWhite,
    });
    page.drawText(p.sub, {
      x: px + 8,
      y: curY - 37,
      size: 7.5,
      font: thaiFont,
      color: textMuted,
    });

    p.items.forEach((it, i) => {
      page.drawText('• ' + it, {
        x: px + 8,
        y: curY - 50 - (i * 10),
        size: 7,
        font: thaiFont,
        color: textLight,
      });
    });
  });

  curY -= (pillarH + 14);

  // --- SECTION 2: TIMELINE STEPS ---
  page.drawRectangle({
    x: marginX,
    y: curY - 18,
    width: 20,
    height: 18,
    color: indigo,
  });
  page.drawText('2', {
    x: marginX + 6,
    y: curY - 14,
    size: 11,
    font: helveticaBold,
    color: textWhite,
  });
  page.drawText('ลำดับขั้นตอนการทำงานตลอดวัน (Tour Operations Timeline)', {
    x: marginX + 26,
    y: curY - 10,
    size: 12,
    font: thaiFontBold,
    color: textWhite,
  });
  page.drawText('จากเช้าขึ้นรถ สู่กิจกรรมกลางวัน จนถึงงานเลี้ยงจับรางวัลค่ำคืน', {
    x: marginX + 26,
    y: curY - 20,
    size: 8,
    font: thaiFont,
    color: textMuted,
  });

  curY -= 26;

  const stepW = (contentWidth - (4 * 6)) / 5;
  const stepH = 58;

  const steps = [
    { tag: 'STEP 01 • เช้า', title: 'เช็คชื่อ & ขึ้นรถ', desc: 'เปิดดูบัตรดิจิทัล ตรวจเลขรถคันที่ต้องขึ้น และสีประจำตัว', color: indigo },
    { tag: 'STEP 02 • มื้อเที่ยง', title: 'สแกนรับอาหาร', desc: 'ยื่น QR ให้สตาฟสแกนจ่ายอาหาร ระบบบันทึกเวลาและล็อกป้องกันรับซ้ำ', color: cyan },
    { tag: 'STEP 03 • ระหว่างทาง', title: 'เกม & ประกวดชุด', desc: 'ตอบ Quiz สะสมแต้ม, เล่าแรงบันดาลใจชุด และกดยืนยันแข่งรอบค่ำ', color: emerald },
    { tag: 'STEP 04 • สันทนาการ', title: 'สแกนรับแต้มทีมสี', desc: 'ผู้ชนะเกมยื่น QR ให้สตาฟสแกน แต้มไหลเข้ายอดรวมของสีทันที', color: amber },
    { tag: 'STEP 05 • งานเลี้ยงค่ำ', title: 'สุ่มรางวัลช้าๆ ขึ้นจอ', desc: 'ฉายจอโปรเจกเตอร์ สรุปผู้ชนะ 10 สี และสุ่มรายชื่อช้าๆ จับรางวัลใหญ่', color: rose },
  ];

  steps.forEach((s, idx) => {
    const sx = marginX + (idx * (stepW + 6));
    page.drawRectangle({
      x: sx,
      y: curY - stepH,
      width: stepW,
      height: stepH,
      color: subCardBg,
      borderColor: cardBorder,
      borderWidth: 1,
    });
    page.drawRectangle({
      x: sx,
      y: curY - 2,
      width: stepW,
      height: 2,
      color: s.color,
    });
    page.drawText(s.tag, {
      x: sx + 6,
      y: curY - 12,
      size: 6.5,
      font: thaiFontBold,
      color: s.color,
    });
    page.drawText(s.title, {
      x: sx + 6,
      y: curY - 23,
      size: 8.5,
      font: thaiFontBold,
      color: textWhite,
    });
    page.drawText(s.desc, {
      x: sx + 6,
      y: curY - 35,
      size: 6.5,
      font: thaiFont,
      color: textMuted,
      lineHeight: 8.5,
      maxWidth: stepW - 12,
    });
  });

  curY -= (stepH + 14);

  // --- SECTION 3: PASS MOCKUP & 10 COLORS + QUESTIONS ---
  const leftW = contentWidth * 0.44;
  const rightW = contentWidth - leftW - 12;
  const midH = 224;

  // LEFT: Digital Pass Mockup
  page.drawRectangle({
    x: marginX,
    y: curY - midH,
    width: leftW,
    height: midH,
    color: cardBg,
    borderColor: amber,
    borderWidth: 1.2,
  });

  page.drawText('🪪 บัตรประจำตัวดิจิทัล (Digital Pass)', {
    x: marginX + 12,
    y: curY - 18,
    size: 10.5,
    font: thaiFontBold,
    color: textWhite,
  });

  // User Header Inside Card
  page.drawRectangle({
    x: marginX + 10,
    y: curY - 58,
    width: leftW - 20,
    height: 34,
    color: subCardBg,
  });
  page.drawText('EVENT PASS 2026', {
    x: marginX + 16,
    y: curY - 36,
    size: 6.5,
    font: helveticaBold,
    color: textMuted,
  });
  page.drawText('สมชาย ใจดีเจริญ', {
    x: marginX + 16,
    y: curY - 48,
    size: 11,
    font: thaiFontBold,
    color: textWhite,
  });
  page.drawText('ID: TOUR-088', {
    x: marginX + 16,
    y: curY - 56,
    size: 7.5,
    font: helveticaBold,
    color: amberLight,
  });

  // Team Yellow Tag
  page.drawRectangle({
    x: marginX + leftW - 74,
    y: curY - 48,
    width: 60,
    height: 16,
    color: amber,
  });
  page.drawText('ทีมสีเหลือง', {
    x: marginX + leftW - 66,
    y: curY - 37,
    size: 8,
    font: thaiFontBold,
    color: bgDark,
  });

  // Two status boxes: Bus & Food
  const boxW = (leftW - 28) / 2;
  page.drawRectangle({
    x: marginX + 10,
    y: curY - 100,
    width: boxW,
    height: 36,
    color: subCardBg,
    borderColor: cardBorder,
    borderWidth: 0.8,
  });
  page.drawText('รถบัสคันที่', { x: marginX + 16, y: curY - 74, size: 7, font: thaiFont, color: textMuted });
  page.drawText('คันที่ 2', { x: marginX + 16, y: curY - 88, size: 11, font: thaiFontBold, color: amberLight });
  page.drawText('ทะเบียน 30-8899', { x: marginX + 16, y: curY - 96, size: 6.5, font: thaiFont, color: textMuted });

  page.drawRectangle({
    x: marginX + 18 + boxW,
    y: curY - 100,
    width: boxW,
    height: 36,
    color: subCardBg,
    borderColor: cardBorder,
    borderWidth: 0.8,
  });
  page.drawText('สิทธิ์รับอาหาร', { x: marginX + 24 + boxW, y: curY - 74, size: 7, font: thaiFont, color: textMuted });
  page.drawText('✓ รับแล้ว', { x: marginX + 24 + boxW, y: curY - 88, size: 10, font: thaiFontBold, color: emerald });
  page.drawText('12:15 น. (กันรับซ้ำ)', { x: marginX + 24 + boxW, y: curY - 96, size: 6.5, font: thaiFont, color: textMuted });

  // White QR Code Mockup Box
  const qrBoxSize = 88;
  const qrX = marginX + (leftW - qrBoxSize) / 2;
  const qrY = curY - 198;

  page.drawRectangle({
    x: qrX,
    y: qrY,
    width: qrBoxSize,
    height: qrBoxSize,
    color: rgb(1, 1, 1),
  });

  // Simulated QR Corner Finders
  const drawCornerFinder = (cx, cy) => {
    page.drawRectangle({ x: cx, y: cy, width: 22, height: 22, color: bgDark });
    page.drawRectangle({ x: cx + 3, y: cy + 3, width: 16, height: 16, color: rgb(1, 1, 1) });
    page.drawRectangle({ x: cx + 6, y: cy + 6, width: 10, height: 10, color: bgDark });
  };
  drawCornerFinder(qrX + 6, qrY + qrBoxSize - 28);
  drawCornerFinder(qrX + qrBoxSize - 28, qrY + qrBoxSize - 28);
  drawCornerFinder(qrX + 6, qrY + 6);

  // Some interior QR random blocks
  page.drawRectangle({ x: qrX + 34, y: qrY + 40, width: 20, height: 8, color: bgDark });
  page.drawRectangle({ x: qrX + 38, y: qrY + 54, width: 16, height: 16, color: bgDark });
  page.drawRectangle({ x: qrX + 58, y: qrY + 20, width: 14, height: 26, color: bgDark });
  page.drawRectangle({ x: qrX + 36, y: qrY + 14, width: 16, height: 8, color: bgDark });

  page.drawText('ยื่น QR ให้สตาฟสแกนเพื่อรับอาหาร และรับคะแนนเกม', {
    x: marginX + 16,
    y: curY - 215,
    size: 7,
    font: thaiFont,
    color: textMuted,
  });

  // RIGHT: 10 COLORS & 3 QUESTIONS
  const rx = marginX + leftW + 12;

  // Box 1: 10 Colors
  page.drawRectangle({
    x: rx,
    y: curY - 96,
    width: rightW,
    height: 96,
    color: cardBg,
    borderColor: cardBorder,
    borderWidth: 1,
  });
  page.drawText('🎨 การแบ่งทีมแข่งขัน 10 สี (10 Teams)', {
    x: rx + 12,
    y: curY - 16,
    size: 10,
    font: thaiFontBold,
    color: textWhite,
  });
  page.drawText('ระบบคำนวณและสะสมคะแนนอัตโนมัติ', {
    x: rx + 12,
    y: curY - 26,
    size: 7,
    font: thaiFont,
    color: textMuted,
  });

  const colorList = [
    { name: '1. แดง', c: rgb(239/255, 68/255, 68/255) },
    { name: '2. น้ำเงิน', c: rgb(59/255, 130/255, 246/255) },
    { name: '3. เขียว', c: rgb(16/255, 185/255, 129/255) },
    { name: '4. เหลือง', c: rgb(234/255, 179/255, 8/255) },
    { name: '5. ส้ม', c: rgb(249/255, 115/255, 22/255) },
    { name: '6. ม่วง', c: rgb(168/255, 85/255, 247/255) },
    { name: '7. ชมพู', c: rgb(236/255, 72/255, 153/255) },
    { name: '8. ฟ้า', c: rgb(6/255, 182/255, 212/255) },
    { name: '9. มิ้นต์', c: rgb(20/255, 184/255, 166/255) },
    { name: '10. ทอง', c: rgb(245/255, 158/255, 11/255) },
  ];

  const colPillW = (rightW - 32) / 5;
  colorList.forEach((col, idx) => {
    const row = Math.floor(idx / 5);
    const colIdx = idx % 5;
    const cpx = rx + 10 + (colIdx * (colPillW + 3));
    const cpy = curY - 56 - (row * 24);

    page.drawRectangle({
      x: cpx,
      y: cpy,
      width: colPillW,
      height: 18,
      color: subCardBg,
      borderColor: cardBorder,
      borderWidth: 0.6,
    });
    // Color dot
    page.drawCircle({
      x: cpx + 6,
      y: cpy + 9,
      size: 3.5,
      color: col.c,
    });
    page.drawText(col.name, {
      x: cpx + 12,
      y: cpy + 5,
      size: 6.5,
      font: thaiFontBold,
      color: textWhite,
    });
  });

  // Box 2: 3 Questions & Activities
  page.drawRectangle({
    x: rx,
    y: curY - midH,
    width: rightW,
    height: midH - 104,
    color: cardBg,
    borderColor: cardBorder,
    borderWidth: 1,
  });
  page.drawText('📝 3 กิจกรรมคำถาม & การสะสมคะแนน', {
    x: rx + 12,
    y: curY - 118,
    size: 10,
    font: thaiFontBold,
    color: textWhite,
  });

  const qItems = [
    { tag: 'ข้อ 1', title: 'เกมตอบคำถาม (Quiz):', desc: 'ตอบคำถามเชาวน์หรือสันทนาการเพื่อเก็บคะแนนสะสมเข้าทีมสี', c: indigo },
    { tag: 'ข้อ 2', title: 'คำถามประกวดชุด & แรงบันดาลใจ:', desc: 'พิมพ์บอกเล่าความหมายและคอนเซปต์ของชุดที่สวมใส่ เพื่อนำไปโชว์บนเวที', c: rose },
    { tag: 'ข้อ 3', title: 'คำถามปิดท้าย (ยืนยันประกวดชุดเย็น):', desc: 'เลือกยืนยัน (เข้าร่วม / ไม่เข้าร่วม) เพื่อสร้างรายชื่อผู้เข้าประกวดรอบตัดสิน', c: amber },
  ];

  qItems.forEach((q, idx) => {
    const qy = curY - 146 - (idx * 23);
    page.drawRectangle({
      x: rx + 12,
      y: qy - 2,
      width: 24,
      height: 13,
      color: subCardBg,
      borderColor: q.c,
      borderWidth: 0.8,
    });
    page.drawText(q.tag, { x: rx + 15, y: qy + 1, size: 6.5, font: thaiFontBold, color: q.c });
    page.drawText(q.title, { x: rx + 40, y: qy + 1, size: 7.5, font: thaiFontBold, color: textWhite });
    page.drawText(q.desc, { x: rx + 40, y: qy - 8, size: 6.5, font: thaiFont, color: textMuted });
  });

  curY -= (midH + 12);

  // --- SECTION 4: PROJECTOR STAGE & SLOW-SPIN RAFFLE ---
  const raffleH = 100;
  page.drawRectangle({
    x: marginX,
    y: curY - raffleH,
    width: contentWidth,
    height: raffleH,
    color: rgb(26/255, 18/255, 42/255),
    borderColor: amber,
    borderWidth: 1.5,
  });

  page.drawRectangle({
    x: marginX + 14,
    y: curY - 18,
    width: 140,
    height: 13,
    color: rgb(45/255, 30/255, 10/255),
    borderColor: amber,
    borderWidth: 0.8,
  });
  page.drawText('PROJECTOR BIG SCREEN FEATURE', {
    x: marginX + 18,
    y: curY - 15,
    size: 6.5,
    font: helveticaBold,
    color: amberLight,
  });

  page.drawText('🎬 ระบบสุ่มจับรางวัลช้าๆ ขึ้นจอใหญ่ (Dramatic Slow-Spin Raffle)', {
    x: marginX + 160,
    y: curY - 16,
    size: 10.5,
    font: thaiFontBold,
    color: textWhite,
  });
  page.drawText('สร้างความตื่นเต้นด้วยเอฟเฟกต์หมุนสลับชื่ออย่างรวดเร็ว แล้วค่อยๆ ชะลอความเร็ว (Deceleration) ทีละจังหวะจนหยุดที่ชื่อผู้ชนะ', {
    x: marginX + 14,
    y: curY - 29,
    size: 7.5,
    font: thaiFont,
    color: textLight,
  });

  // 3 Raffle Steps Cards
  const rStepW = (contentWidth - 28 - 16) / 3;
  const rSteps = [
    { title: '01. สลับชื่อเร็ว', sub: 'Fast Rolling (3-4 วิ)', anim: '[ สลับชื่ออย่างรวดเร็ว... ]', desc: 'สลับรายชื่อผู้มีสิทธิ์ทั้งหมดเร็วๆ บนจอโปรเจกเตอร์', c: textMuted },
    { title: '02. ค่อยๆ ชะลอช้าลง', sub: 'Suspense Deceleration', anim: '... ติ๊ก ... ติ๊ก ... ติ๊ก ...', desc: 'รายชื่อชะลอช้าลงทีละคน บิ้วอารมณ์ลุ้นระทึกของคนทั้งงาน', c: amberLight },
    { title: '03. เผยโฉมผู้ชนะ!', sub: 'Winner & Confetti', anim: '🎉 วราภรณ์ สายบุญ (สีฟ้า)', desc: 'จุดพลุกระดาษฉลอง และตัดชื่อผู้ได้รับรางวัลออก ป้องกันซ้ำ', c: emerald },
  ];

  rSteps.forEach((rs, idx) => {
    const rxPos = marginX + 14 + (idx * (rStepW + 8));
    const ryPos = curY - 92;

    page.drawRectangle({
      x: rxPos,
      y: ryPos,
      width: rStepW,
      height: 56,
      color: bgDark,
      borderColor: cardBorder,
      borderWidth: 1,
    });
    page.drawText(rs.title, { x: rxPos + 8, y: ryPos + 44, size: 8.5, font: thaiFontBold, color: rs.c });
    page.drawText(rs.sub, { x: rxPos + 8, y: ryPos + 34, size: 6.5, font: thaiFont, color: textMuted });

    page.drawRectangle({
      x: rxPos + 6,
      y: ryPos + 18,
      width: rStepW - 12,
      height: 14,
      color: subCardBg,
    });
    page.drawText(rs.anim, { x: rxPos + 10, y: ryPos + 22, size: 7, font: thaiFontBold, color: rs.c });
    page.drawText(rs.desc, { x: rxPos + 8, y: ryPos + 6, size: 6, font: thaiFont, color: textMuted });
  });

  // Footer bar
  page.drawText('Tour & Event Operations Architecture • 2026 Production Edition', {
    x: marginX,
    y: 12,
    size: 7,
    font: helveticaBold,
    color: textMuted,
  });
  page.drawText('Integrated Cross-Device System: Mobile Pass, Staff QR Scanner, and Projector Big Screen', {
    x: width - marginX - 280,
    y: 12,
    size: 7,
    font: thaiFont,
    color: textMuted,
  });

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.join(__dirname, 'Tour_Event_App_Infographic.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log(`PDF created successfully at: ${outputPath}`);
}

createInfographicPDF().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
