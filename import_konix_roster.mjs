import fs from 'fs';
import path from 'path';

const csvRaw = `รหัสพนักงาน,ชื่อ-นามสกุล,แผนก,ตำแหน่ง,ยืนยันเข้าร่วม
500,อนันต์  เกษแก้ว,Digitization & MRP System,Assistant Manager - IT,1
1212,นัฐวุฒิ  รักดนตรี,Digitization & MRP System,Senior Officer - IT,1
1310,สิรวิชญ์  จานเงิน,Digitization & MRP System,Officer - IT,1
6027,จักรพันธ์ นิธิณัฐนันท์,Digitization & MRP System,Internship,1
6028,รพีภัทร วงษ์สุวรรณ,Digitization & MRP System,Internship,1
895,อารีลักษณ์  บัวคอม,Finance,Accountant,1
937,รุจี  ทรัพย์สกุล,Finance,Senior Manager II - Account & Finance,1
497,เบ็ญจมาศ  วรเรียน,HR & Admin,Senior Executive - HR & Admin,1
1280,โก๊ะ บี ซัม,HR & Admin,Managing Director,1
1313,จิณณพัต  พงษ์พันธ์,HR & Admin,Officer - Safety,1
1336,กนกพร  พันธุ์กระวี,HR & Admin,Officer -HR,1
6012,วิรดา เหมือนแจ่ม,HR & Admin,Maid,1
6020,ราตรี พันละออง,HR & Admin,Maid,1
6022,สุฑามาศ  มณฑา,HR & Admin,Maid,1
167,ดวงใจ  แสงพิทักษ์,ISO SYSTEM&FAI,Senior Assistant  Engineer - QA,1
457,ชยาภรณ์ ปัทมะนาวิน,ISO SYSTEM&FAI,Senior Office - QA,1
509,หทัยภัทร  เฉลิมพันธ์,ISO SYSTEM&FAI,Assistant Manager - QA,1
1317,สลิตา  แสงทอง,ISO SYSTEM&FAI,Engineer - QA,1
934,อธิคม  เมทะนี,Maintenance & Facility,Senior Engineer -  Facility,1
1179,วิรุจน์  ไกยนารถ,Maintenance & Facility,Supervisor - Repair & Preventive Maintenace,1
1303,มงคลชัย  สวัสดี,Maintenance & Facility,Technician - Maintenance,1
1315,วิหค  สมสวย,Maintenance & Facility,Senior Technician - Maintenance,1
417,ชาติสยาม  ศรีโกมลศิลป์,Manufacturing Engineer,General Manager,1
93,ณรงค์ฤทธิ์  พงษ์หิรัญ,Manufacturing Engineer,Senior Manager I - Manufacturing,1
37,วิทยา  รินทร์นายรักษ์,NPD,Assistant Manager - NPD,1
475,ประมินทร์  บุญเม่น,NPD,Engineer - NPD,1
860,ดำรงค์  อิ่มเอิบ,NPD,Engineer - NPD,1
1358,วิษนุ  เชื้อพุคง,NPI,Senior Engineer – NPI,1
1334,เฉลิมพล  ธนะปะละ,NPI,Manager - NPI,1
685,นภัทร  หงส์ไทร,NPI,Junior Officer - Coordinator,1
987,สุทธิชัย  ภาคีวร,NPI,Senior Technical Specialist,1
1047,ศิรินาถ  ศิริยานน,NPI,Clerk,1
1281,ศุภณัฐ  มาลิกุล,NPI,Engineer - New Production Introduction,1
1299,วัลลภ  วงษ์กล่อม,NPI,Engineer - Process,1
1302,บุญมา  หล่าเพีย,NPI,Senior Technician - NPI,1
577,พชร  สมรูป,Operation Production,Senior Manager II - Production,1
943,สุดารัตน์  สิทธิรส,Procurement,Manager-Supply Chain Management,1
1034,จิรัญญา  แก้วสา,Procurement,Senior Executive – Purchasing,1
1354,ปานกวี  หุ้นสวัสดิ์,Procurement,Officer - Purchasing,1
449,อัมพร  นุชแก้วฟ้า,Production - IM,Senior Officer,1
1061,รัตนพร  ชูทอง,Production - IM,Senior Operator,1
1086,สุกัญญา  นวมกระจ่าง,Production - IM,Senior Operator,1
1097,วิศวกร  พิลาสันต์,Production - IM,Line Leader - IM,1
1270,เดือนเพ็ญ  บุติมาลย์,Production - IM,Operator,1
1271,บุญยง  วงละคร,Production - IM,Operator,1
1294,สุรเกียรติ  วงจันทร์,Production - IM,Operator,1
1295,วนิชยา  อ่อนสี,Production - IM,Operator,1
1296,เรไร  พงษ์ศิลป์,Production - IM,Operator,1
1306,ฤทธิ์รงค์  ปิตะแสง,Production - IM,Operator,1
1307,ศิริพร  รุจิโภชน์,Production - IM,Operator,1
1318,วีรพล  สำลี,Production - IM,Supervisor - IM Production,1
1322,สุภาพร  ผาสุขโสม,Production - IM,Operator,1
1324,ศิระ  กัณถาวร,Production - IM,Operator,1
1348,รพีพร  อ่อนประชา,Production - IM,Operator,1
1350,ภานุวัฒน์  พงษ์โสภณ,Production - IM,Operator,1
1351,บริสุทธิ์  จ่าแก้ว,Production - IM,Operator,1
1352,ชวนชม  เอ็มศรี,Production - IM,Operator,1
V-0306,ทวีพร ฉาบทับทิม,Production - IM,Operator,1
V-0494,จิราภรณ์ หว่างชื่น,Production - IM,Operator,1
V-0505,ศุภชัย กัญหาสูงเนิน,Production - IM,Operator,1
V-0369,กฤษาฎา วิชัยโย,Production - IM,Operator,1
V-0476,สุมินตรา วิชาจารย์,Production - IM,Operator,1
511,ปราณี  อุ่นเรือน,Production - TF,Senior Operator,1
122,ปรีชา  ปัญญาสาร,Production - TF,Senior Line Leader -TF,1
219,สมบุญ  บันเทิงจิตร,Production - TF,Operator,1
297,ปรีดาวรรณ  จันทร์แก้ว,Production - TF,Operator,1
567,อุมาพร  จุลหิรัญ,Production - TF,Operator,1
601,พนารัตน์  ตั้งจิตต์ประเสริฐ,Production - TF,Operator,1
636,มนตรี  ติ๊บหน่อ,Production - TF,Operator,1
660,จรุญ  เจนสาริกรณ์,Production - TF,Operator,1
729,มณีวรรณ  โพธิ์ศรี,Production - TF,Supervisor - TF Production,1
731,ประนอม  เจนไธสง,Production - TF,Senior Line Leader -TF,1
991,กัลยาภัสร์  จิระสิทธิ์เมธา,Production - TF,Operator,1
992,จีรภา  หลายแห่ง,Production - TF,Operator,1
945,สุภาษิต  เสือเหลือง,Production - TF,Operator,1
1051,จันทิณี  ทองไพบูลย์,Production - TF,Operator,1
1054,นุชจรี  บุญคง,Production - TF,Operator,1
1109,อนุศรา  แสงฤทธิ์,Production - TF,Operator,1
1110,สนธยา  เดชเสถียร,Production - TF,Operator,1
1111,จรูญ  จันที,Production - TF,Operator,1
1116,วีระพงษ์  รุ่งรัตน์,Production - TF,Machine Operator,1
1121,บุษรา  ไตรถาวร,Production - TF,Operator,1
1131,แก้ววิรัตน์  เรือนทอง,Production - TF,Operator,1
1134,พีระพงษ์  สุขเขียว,Production - TF,Technician - TF,1
1147,ชนกานต์  สาทก,Production - TF,Operator,1
1149,รัฐนันท์  นรรัตน์ขันธชัย,Production - TF,Operator,1
1150,ฐิตารีย์  ฉายศรีรุ่งศิริ,Production - TF,Operator,1
1156,สุรเดช  คามีศักดิ์,Production - TF,Line Leader - TF,1
1167,วสันต์  พันทุเรียน,Production - TF,Operator,1
1170,วัชรา  ศรีจันทร์,Production - TF,Operator,1
1187,วาสนา  กันเนียม,Production - TF,Operator,1
1194,เมตตา  ปิยะวงศ์,Production - TF,Operator,1
1196,มลฤดี  มั่นรอด,Production - TF,Operator,1
1204,มริษฏดา  บุญนิธี,Production - TF,Senior Operator,1
1205,นุชจรี  มณฑิราช,Production - TF,Operator,1
1206,พัชรี  ภิญโญทรัพย์,Production - TF,Operator,1
1209,สิทธิกร  แซ่โค้ว,Production - TF,Line Leader – TF,1
1218,พิมพ์พา  เพ็ชรประดิษฐ,Production - TF,Operator,1
1221,สุภาวดี  นิลสนธิ,Production - TF,Operator,1
1244,รุ่งทิพย์  แสวงดี,Production - TF,Operator,1
1245,ศรสวรรค์  โพธิ์กราน,Production - TF,Operator,1
1251,พฤหัส  นิยม,Production - TF,Assistant Line Leader - TF,1
1286,อทิติยา  แสงจันทร์,Production - TF,Operator,1
1287,ศราวุฒิ  ลีลาน้อย,Production - TF,Operator,1
1288,มัทนา  มากแสง,Production - TF,Operator,1
1289,สุนทร  วังงาม,Production - TF,Operator,1
1290,ธีรพัฒน์  เรียนงาม,Production - TF,Operator,1
1291,บุษยมาศ  เขียวดวงดี,Production - TF,Operator,1
1298,เอกอุ  โล่มณีรันต์,Production - TF,Line Leader - TF,1
1309,รุ่งอรุณ  มีพานทอง,Production - TF,Operator,1
1319,วันชาติ  พงษ์มุลี,Production - TF,Line Leader - TF,1
1326,ธนายุทธ  คำภูแสน,Production - TF,Operator,1
1327,นิพนธ์  พรหมพิลา,Production - TF,Operator,1
1330,สุภัทรา ดิษฐศิลป์,Production - TF,Operator,1
1331,พัชรี  ไพรสิงห์,Production - TF,Operator,1
1332,นันทพร  กุ่ยอ่อง,Production - TF,Operator,1
1335,พิมพิลา  ประดับเพชร,Production - TF,Supervisor-TF Production,1
1337,วรินยุพา       เชิดโชคชัย,Production - TF,Operator,1
1338,ศุภรักษ์     ศรีสวัสดิ์,Production - TF,Operator,1
1340,อัญชลี   พึ่งสิงห์,Production - TF,Operator,1
1341,รัตนาวดี  หัตถแสม,Production - TF,Operator,1
1342,ปรีชา   สามพันธ์,Production - TF,Operator,1
1343,วิชญพงษ์    ธรรมภารา,Production - TF,Operator,1
1344,วุฒิชัย   ยังเจริญ,Production - TF,Operator,1
1345,ชนัดดา   ศิริมงคล,Production - TF,Operator,1
1346,วิมลรัตน์   ศักดิ์สิทธิ์,Production - TF,Operator,1
1356,ปียะ  รัตโนดม,Production - TF,Supervisor-TF Production,1
1357,อนุวัฒน์  บริบูรณ์,Production - TF,Line Leader - TF,1
V-0210,นภัสกร พูลประเสริฐ,Production - TF,Operator,1
V-0276,นุตประวีณ์ อ้อยกลาง,Production - TF,Operator,1
V-0304,ณัฐพงษ์ ขวัญยืน,Production - TF,Operator,1
V0438,ปราณี เปี่ยมศิริ,Production - TF,Operator,1
V-0441,สาลีรัตน์ สุจริต,Production - TF,Operator,1
V-0453,ณธษา อินทร์สนอง,Production - TF,Operator,1
V-0490,นัชชา สมปาน,Production - TF,Operator,1
V-0515,พัทยา อุดมทนานุกูล,Production - TF,Operator,1
V-0539,วัลลภ นิยมทอง,Production - TF,Operator,1
V-0549,วรพิพัฒน์ คำสนวน,Production - TF,Operator,1
U-0503,อนุซิต บุญดี,Production - TF,Operator,1
V-0230,สุเมธ ชำนาญศิลป์,Production - TF,Operator,1
V-0382,ชลธิชา สามัคคี,Production - TF,Operator,1
V-0517,รัชชานนท์ สิ่วไทยสงค์,Production - TF,Operator,1
V-0519,ณัฐวุฒิ ภิญโญ,Production - TF,Operator,1
V-0520,ณัฐฐา ชอนขุนทด,Production - TF,Operator,1
V-0550,ฉัตรสุดา ศิลาดี,Production - TF,Operator,1
1005,กัญญดา  ทองสถิตย์วงศ์,Production Planning Control,Senior Officer - Production Planning Control,1
192,คมสันต์  บุญเกิด,Production Planning Control,Manager - Section Prodution Planing Control,1
586,สุกฤตา  ยวงการ,Production Planning Control,Assistant Manager - Production Planning & Control,1
43,ต้องจิต  พงษ์รักษ์,Production Planning Control,Senior Officer - Production Coordinator,1
948,สุนทร  ภาสุรกาญจน์,QA,Senior Manager II - QA,1
956,รังสรรค์  กุลสวัสดิ์,QA-IM,Senior Supervisor - QA,1
1128,ศรีสุดา  บัวบาน,QA-IM,Inspector - QC,1
1148,พรรณนา  แจ้งแย้ม,QA-IM,Leader-QC,1
1279,ธนธัช  ธนะอิทธินันท์,QA-IM,Engineer-QA,1
377,ดลยา  นาคตระกูล,QA-TF / WS,Senior Leader - QC,1
669,วาสนา ชัยศิริ,QA-TF / WS,Senior Leader - QC,1
953,ชญาณ์นันท์  บุญเชิญ,QA-TF / WS,Inspector - QC,1
1050,วราภรณ์  พูลประเสริฐ,QA-TF / WS,Inspector - QC,1
1273,กันยารัตน์  โสมาบุตร,QA-TF / WS,Senior Engineer - QA,1
613,บำรุง  เลิศลอยกุลชัย,Sales,Assistant Manager - Key Account Management,1
983,พิชญา  สิทธีอมร,Sales,Assistant Manager - Project Management,1
1059,สุภัทตรา  มัครมย์,Sales,Executive - Customer Survice,1
1113,สาโรจน์  สังข์เจริญ,Sales,Senior Manager I - Sales,1
1264,ปิยอร  วรปัญญาภรณ์,Sales,Manager - Sales & Business Development (HDD),1
1301,ณัฐพล  ไพจิตร,Sales,Business Development Manager - Automotive,1
994,ไชยยัณห์  หลายแห่ง,Tooling,Technician - Tooling Maintenace,1
441,นนทกร  มากคิด,Tooling,Senior Technician - Machinist,1
1062,สาธิต  เถื่อนถ้ำ,Tooling,Technical Assistant - Machinist,1
1284,วิทย์เทวา  นวดข้าว,Tooling,Technician - Tooling,1
1355,รุ่งโรจน์  แก้วจันทร์,Tooling,Technician - Tooling,1
205,เนืองนิตร  ปรีชา,Tooling,Operator,1
620,พินาคาพานิ  พาริมิ,Tooling,Manager - Tooling,1
1041,ยงยุทธ์  อินสุชาติ,Tooling,Senior Technician - Tooling Maintenance,1
1095,วิษนุกรณ์  สนิทนัย,Tooling,Technician - Tooling Maintenace,1
1201,ชินวัฒน์  อุ่นขาว,Tooling,Senior Technician - Tooling Draftman,1
209,ภีระ  อรรคศรีวร,Tooling,Engineer - TF Tooling,1
351,สุรชัย  พิริยะอนันตกุล,Tooling,Senior Technician - Machinist,1
387,อมรศักดิ์  ศรีระแก้ว,Warehouse & Logistic,Senior Operator,1
949,สมจิตร  พึ่งรื่นรมย์,Warehouse & Logistic,STOREKEEPER,1
1,ธีรพล  ใจปราณี,HR & Admin,คนขับรถสาย อยุธยา,1
2,ศักย์ชัย  ด่านประไฟศิลป์,HR & Admin,คนขับรถผู้บริหาร,1
1359,คฑาวุธ  จอสูงเนิน,Production - IM,Senior Technician - IM Production,1`;

const BUS_NAMES = [
  'รถบัสคันที่ 1 (ทะเบียน 30-1122)',
  'รถบัสคันที่ 2 (ทะเบียน 30-3344)',
  'รถบัสคันที่ 3 (ทะเบียน 30-5566)',
  'รถบัสคันที่ 4 (ทะเบียน 30-7788)',
  'รถบัสคันที่ 5 (ทะเบียน 30-9900)',
];

const TEAM_COLOR_KEYS = [
  'red', 'blue', 'green', 'yellow', 'pink',
  'orange', 'purple', 'cyan', 'mint', 'gold'
];

const lines = csvRaw.trim().split('\n').slice(1);
const participants = [];

// Keep track of unique IDs
const seen = new Set();

lines.forEach((line, index) => {
  const parts = line.split(',');
  if (parts.length >= 2) {
    const empId = parts[0].trim();
    const name = parts[1].trim().replace(/\s+/g, ' ');
    const dept = parts[2] ? parts[2].trim() : '';
    const position = parts[3] ? parts[3].trim() : '';

    if (!empId || seen.has(empId)) return;
    seen.add(empId);

    // Balanced distribution among 5 buses & 10 team colors
    const busNumber = BUS_NAMES[participants.length % BUS_NAMES.length];
    const teamColor = TEAM_COLOR_KEYS[participants.length % TEAM_COLOR_KEYS.length];

    participants.push({
      id: empId,
      name,
      department: dept,
      position: position,
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
    });
  }
});

console.log(`Parsed ${participants.length} employees from KoniX roster.`);

// Save to data/database.json
const dbPath = path.resolve('data', 'database.json');
fs.writeFileSync(dbPath, JSON.stringify(participants, null, 2), 'utf8');
console.log(`Updated ${dbPath} successfully.`);

// Also update src/utils/mockData.js to have the official roster as fallback
const mockDataPath = path.resolve('src', 'utils', 'mockData.js');
let mockContent = fs.readFileSync(mockDataPath, 'utf8');

// Replace SEED_PARTICIPANTS array
const replacement = `export const SEED_PARTICIPANTS = ${JSON.stringify(participants, null, 2)};`;
mockContent = mockContent.replace(/export const SEED_PARTICIPANTS = \[[\s\S]*?\];/, replacement);
fs.writeFileSync(mockDataPath, mockContent, 'utf8');
console.log(`Updated ${mockDataPath} with ${participants.length} real participants.`);
