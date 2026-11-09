import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { playSuccess, playFanfare, playWarning, playTick } from '../utils/soundEffects';

// 10 SPOT THE DIFFERENCE LEVELS
const LEVELS = [
  {
    id: 1,
    title: 'ด่าน 1: รถบัสนำเที่ยวริมหาด',
    subtitle: 'ทริปเดินทางวันแรก แดดสดใสริมชายหาด',
    icon: '🏖️',
    differences: [
      { id: 1, name: 'แว่นกันแดดของพระอาทิตย์', x: 82, y: 18, radius: 8, hint: 'สังเกตที่พระอาทิตย์บนท้องฟ้าด้านขวาบน' },
      { id: 2, name: 'ลูกมะพร้าวบนต้นมะพร้าว', x: 14, y: 35, radius: 8, hint: 'ดูที่ยอดต้นมะพร้าวด้านซ้าย' },
      { id: 3, name: 'นกนางนวลบินเหนือน้ำทะเล', x: 48, y: 20, radius: 7, hint: 'ดูนกที่บินอยู่เหนือน้ำทะเลตรงกลาง' },
      { id: 4, name: 'ธงสีประจำทีมหน้ารถบัส', x: 32, y: 52, radius: 7, hint: 'ดูธงสัญลักษณ์ที่ติดอยู่บนหลังคารถบัส' },
      { id: 5, name: 'ป้ายทะเบียนหน้ารถบัส', x: 63, y: 78, radius: 8, hint: 'สังเกตตัวเลขบนป้ายทะเบียนหน้ารถบัส' },
    ],
    renderA: () => (
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <circle cx="330" cy="55" r="32" fill="#ffb703" />
        <circle cx="330" cy="55" r="26" fill="#fb8500" />
        {/* Diff 1A: Glasses on Sun */}
        <rect x="316" y="50" width="12" height="7" rx="2" fill="#000" />
        <rect x="332" y="50" width="12" height="7" rx="2" fill="#000" />
        <line x1="326" y1="52" x2="333" y2="52" stroke="#000" strokeWidth="2" />
        <ellipse cx="200" cy="40" rx="35" ry="14" fill="#ffffff" opacity="0.85" />
        <ellipse cx="90" cy="60" rx="28" ry="12" fill="#ffffff" opacity="0.85" />
        {/* Diff 3A: 2 Birds */}
        <path d="M 185 60 Q 192 53 199 60 Q 206 53 213 60" fill="none" stroke="#333" strokeWidth="2" />
        <path d="M 170 75 Q 175 69 180 75 Q 185 69 190 75" fill="none" stroke="#333" strokeWidth="1.5" />
        <rect x="0" y="110" width="400" height="90" fill="#0077b6" />
        <path d="M 0 115 Q 50 110 100 115 T 200 115 T 300 115 T 400 115 L 400 140 L 0 140 Z" fill="#0096c7" opacity="0.7" />
        <path d="M 0 160 Q 150 145 400 170 L 400 300 L 0 300 Z" fill="#e9c46a" />
        <path d="M 50 250 Q 55 170 65 105" fill="none" stroke="#8d5b4c" strokeWidth="10" strokeLinecap="round" />
        <path d="M 65 105 Q 20 80 10 120" fill="none" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round" />
        <path d="M 65 105 Q 50 60 70 50" fill="none" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round" />
        <path d="M 65 105 Q 110 70 125 100" fill="none" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round" />
        <path d="M 65 105 Q 95 125 110 145" fill="none" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round" />
        {/* Diff 2A: 3 coconuts */}
        <circle cx="58" cy="108" r="5" fill="#583101" />
        <circle cx="68" cy="110" r="5" fill="#583101" />
        <circle cx="63" cy="116" r="5" fill="#583101" />
        <g transform="translate(110, 140)">
          {/* Diff 4A: Gold flag */}
          <polygon points="18,15 18,30 35,22" fill="#ffb703" stroke="#d4a373" strokeWidth="1" />
          <line x1="18" y1="15" x2="18" y2="35" stroke="#333" strokeWidth="2" />
          <rect x="20" y="30" width="180" height="75" rx="14" fill="#ffffff" stroke="#1d1d1f" strokeWidth="3" />
          <rect x="20" y="65" width="180" height="20" fill="#0071e3" />
          <rect x="35" y="38" width="28" height="22" rx="4" fill="#caf0f8" stroke="#1d1d1f" strokeWidth="1.5" />
          <rect x="70" y="38" width="28" height="22" rx="4" fill="#caf0f8" stroke="#1d1d1f" strokeWidth="1.5" />
          <rect x="105" y="38" width="28" height="22" rx="4" fill="#caf0f8" stroke="#1d1d1f" strokeWidth="1.5" />
          <rect x="140" y="38" width="38" height="22" rx="4" fill="#caf0f8" stroke="#1d1d1f" strokeWidth="1.5" />
          <circle cx="49" cy="48" r="6" fill="#f4a261" />
          <circle cx="84" cy="48" r="6" fill="#e76f51" />
          <circle cx="119" cy="48" r="6" fill="#2a9d8f" />
          <circle cx="55" cy="105" r="15" fill="#1d1d1f" />
          <circle cx="55" cy="105" r="7" fill="#adb5bd" />
          <circle cx="165" cy="105" r="15" fill="#1d1d1f" />
          <circle cx="165" cy="105" r="7" fill="#adb5bd" />
          {/* Diff 5A: BUS 02 */}
          <rect x="135" y="88" width="35" height="12" rx="2" fill="#ffea00" stroke="#000" strokeWidth="1" />
          <text x="139" y="97" fontSize="7" fontWeight="bold" fontFamily="monospace" fill="#000">BUS 02</text>
        </g>
      </svg>
    ),
    renderB: () => (
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <circle cx="330" cy="55" r="32" fill="#ffb703" />
        <circle cx="330" cy="55" r="26" fill="#fb8500" />
        {/* Diff 1B: No Sunglasses, Smiling Eyes */}
        <circle cx="322" cy="52" r="3" fill="#000" />
        <circle cx="338" cy="52" r="3" fill="#000" />
        <path d="M 324 62 Q 330 67 336 62" fill="none" stroke="#000" strokeWidth="2" />
        <ellipse cx="200" cy="40" rx="35" ry="14" fill="#ffffff" opacity="0.85" />
        <ellipse cx="90" cy="60" rx="28" ry="12" fill="#ffffff" opacity="0.85" />
        {/* Diff 3B: 1 Bird only */}
        <path d="M 185 60 Q 192 53 199 60 Q 206 53 213 60" fill="none" stroke="#333" strokeWidth="2" />
        <rect x="0" y="110" width="400" height="90" fill="#0077b6" />
        <path d="M 0 115 Q 50 110 100 115 T 200 115 T 300 115 T 400 115 L 400 140 L 0 140 Z" fill="#0096c7" opacity="0.7" />
        <path d="M 0 160 Q 150 145 400 170 L 400 300 L 0 300 Z" fill="#e9c46a" />
        <path d="M 50 250 Q 55 170 65 105" fill="none" stroke="#8d5b4c" strokeWidth="10" strokeLinecap="round" />
        <path d="M 65 105 Q 20 80 10 120" fill="none" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round" />
        <path d="M 65 105 Q 50 60 70 50" fill="none" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round" />
        <path d="M 65 105 Q 110 70 125 100" fill="none" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round" />
        <path d="M 65 105 Q 95 125 110 145" fill="none" stroke="#2d6a4f" strokeWidth="6" strokeLinecap="round" />
        {/* Diff 2B: 1 Coconut only */}
        <circle cx="63" cy="116" r="5" fill="#583101" />
        <g transform="translate(110, 140)">
          {/* Diff 4B: Red Flag */}
          <polygon points="18,15 18,30 35,22" fill="#e63946" stroke="#b7094c" strokeWidth="1" />
          <line x1="18" y1="15" x2="18" y2="35" stroke="#333" strokeWidth="2" />
          <rect x="20" y="30" width="180" height="75" rx="14" fill="#ffffff" stroke="#1d1d1f" strokeWidth="3" />
          <rect x="20" y="65" width="180" height="20" fill="#0071e3" />
          <rect x="35" y="38" width="28" height="22" rx="4" fill="#caf0f8" stroke="#1d1d1f" strokeWidth="1.5" />
          <rect x="70" y="38" width="28" height="22" rx="4" fill="#caf0f8" stroke="#1d1d1f" strokeWidth="1.5" />
          <rect x="105" y="38" width="28" height="22" rx="4" fill="#caf0f8" stroke="#1d1d1f" strokeWidth="1.5" />
          <rect x="140" y="38" width="38" height="22" rx="4" fill="#caf0f8" stroke="#1d1d1f" strokeWidth="1.5" />
          <circle cx="49" cy="48" r="6" fill="#f4a261" />
          <circle cx="84" cy="48" r="6" fill="#e76f51" />
          <circle cx="119" cy="48" r="6" fill="#2a9d8f" />
          <circle cx="55" cy="105" r="15" fill="#1d1d1f" />
          <circle cx="55" cy="105" r="7" fill="#adb5bd" />
          <circle cx="165" cy="105" r="15" fill="#1d1d1f" />
          <circle cx="165" cy="105" r="7" fill="#adb5bd" />
          {/* Diff 5B: TOUR 26 */}
          <rect x="135" y="88" width="35" height="12" rx="2" fill="#ffea00" stroke="#000" strokeWidth="1" />
          <text x="137" y="97" fontSize="7" fontWeight="bold" fontFamily="monospace" fill="#000">TOUR 26</text>
        </g>
      </svg>
    ),
  },

  {
    id: 2,
    title: 'ด่าน 2: เช็คอินล็อบบี้รีสอร์ท',
    subtitle: 'เคาน์เตอร์ต้อนรับ แสงไฟอบอุ่นและกระเป๋าเดินทาง',
    icon: '🏨',
    differences: [
      { id: 1, name: 'โคมไฟแชนเดอเลียร์เพดาน', x: 50, y: 15, radius: 8, hint: 'ดูโคมไฟระย้าตรงกลางเพดาน' },
      { id: 2, name: 'แจกันดอกไม้หน้าเคาน์เตอร์', x: 25, y: 55, radius: 8, hint: 'สังเกตดอกไม้บนโต๊ะต้อนรับซ้ายมือ' },
      { id: 3, name: 'กระเป๋าเดินทางสีแดง', x: 80, y: 75, radius: 8, hint: 'ดูกระเป๋าเดินทางที่วางมุมขวาล่าง' },
      { id: 4, name: 'เข็มนาฬิกาแขวนผนัง', x: 82, y: 25, radius: 7, hint: 'ดูเวลาบนนาฬิกาแขวนผนังด้านขวา' },
    ],
    renderA: () => (
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#fdf0ed" />
        <rect x="0" y="210" width="400" height="90" fill="#d4a373" />
        {/* Chandelier A (3 Bulbs) */}
        <line x1="200" y1="0" x2="200" y2="45" stroke="#4a4e69" strokeWidth="3" />
        <ellipse cx="200" cy="55" rx="35" ry="12" fill="#f4a261" />
        <circle cx="180" cy="65" r="6" fill="#ffe49e" />
        <circle cx="200" cy="68" r="6" fill="#ffe49e" />
        <circle cx="220" cy="65" r="6" fill="#ffe49e" />
        {/* Clock A (10:10) */}
        <circle cx="330" cy="75" r="24" fill="#ffffff" stroke="#222" strokeWidth="3" />
        <line x1="330" y1="75" x2="338" y2="65" stroke="#222" strokeWidth="2.5" />
        <line x1="330" y1="75" x2="322" y2="65" stroke="#222" strokeWidth="2.5" />
        {/* Reception Desk */}
        <rect x="60" y="150" width="280" height="75" rx="8" fill="#6b705c" />
        <rect x="75" y="160" width="250" height="15" fill="#a5a58d" />
        {/* Flower Vase A (Purple Flower) */}
        <rect x="95" y="145" width="20" height="25" rx="3" fill="#ffffff" />
        <circle cx="105" cy="138" r="8" fill="#af52de" />
        {/* Bell on Desk */}
        <path d="M 270 152 Q 280 140 290 152 Z" fill="#ffd166" />
        <circle cx="280" cy="140" r="3" fill="#d4a373" />
        {/* Luggage A (2 Bags: Red + Blue) */}
        <rect x="300" y="215" width="35" height="48" rx="6" fill="#e63946" stroke="#222" strokeWidth="2" />
        <rect x="310" y="205" width="15" height="10" rx="2" fill="none" stroke="#222" strokeWidth="2" />
        <rect x="338" y="225" width="28" height="38" rx="5" fill="#0071e3" stroke="#222" strokeWidth="2" />
      </svg>
    ),
    renderB: () => (
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#fdf0ed" />
        <rect x="0" y="210" width="400" height="90" fill="#d4a373" />
        {/* Chandelier B (1 Center Bulb only) */}
        <line x1="200" y1="0" x2="200" y2="45" stroke="#4a4e69" strokeWidth="3" />
        <ellipse cx="200" cy="55" rx="35" ry="12" fill="#f4a261" />
        <circle cx="200" cy="68" r="6" fill="#ffe49e" />
        {/* Clock B (3:00) */}
        <circle cx="330" cy="75" r="24" fill="#ffffff" stroke="#222" strokeWidth="3" />
        <line x1="330" y1="75" x2="344" y2="75" stroke="#222" strokeWidth="2.5" />
        <line x1="330" y1="75" x2="330" y2="60" stroke="#222" strokeWidth="2.5" />
        {/* Reception Desk */}
        <rect x="60" y="150" width="280" height="75" rx="8" fill="#6b705c" />
        <rect x="75" y="160" width="250" height="15" fill="#a5a58d" />
        {/* Flower Vase B (Yellow Flower) */}
        <rect x="95" y="145" width="20" height="25" rx="3" fill="#ffffff" />
        <circle cx="105" cy="138" r="8" fill="#ffcc00" />
        {/* Bell on Desk */}
        <path d="M 270 152 Q 280 140 290 152 Z" fill="#ffd166" />
        <circle cx="280" cy="140" r="3" fill="#d4a373" />
        {/* Luggage B (Only 1 Blue Bag, No Red Bag) */}
        <rect x="338" y="225" width="28" height="38" rx="5" fill="#0071e3" stroke="#222" strokeWidth="2" />
        <rect x="345" y="218" width="14" height="8" rx="2" fill="none" stroke="#222" strokeWidth="2" />
      </svg>
    ),
  },

  {
    id: 3,
    title: 'ด่าน 3: สปีดโบ๊ทดำน้ำปะการัง',
    subtitle: 'เรือเร็วแล่นผ่าเกลียวคลื่น โลมากระโดดทักทาย',
    icon: '🤿',
    differences: [
      { id: 1, name: 'โลมากระโดดเหนือน้ำ', x: 22, y: 40, radius: 8, hint: 'ดูสิ่งมีชีวิตกระโดดขึ้นเหนือน้ำซ้ายมือ' },
      { id: 2, name: 'สีของหน้ากากดำน้ำ', x: 58, y: 45, radius: 7, hint: 'ดูแว่นดำน้ำของคนที่นั่งบนเรือ' },
      { id: 3, name: 'แถบชูชีพบนตัวเรือ', x: 75, y: 62, radius: 7, hint: 'สังเกตห่วงชูชีพท้ายเรือ' },
      { id: 4, name: 'ก้อนเมฆรูปหัวใจ', x: 80, y: 15, radius: 8, hint: 'ดูก้อนเมฆบนฟ้าด้านขวาบน' },
    ],
    renderA: () => (
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <rect width="400" height="160" fill="#a2d2ff" />
        <rect x="0" y="160" width="400" height="140" fill="#0077b6" />
        {/* Cloud A (Normal Cloud) */}
        <ellipse cx="320" cy="45" rx="35" ry="15" fill="#ffffff" opacity="0.9" />
        {/* Dolphin A */}
        <path d="M 70 135 Q 90 95 110 130 Q 95 125 70 135 Z" fill="#468faf" stroke="#014f86" strokeWidth="1.5" />
        {/* Speedboat */}
        <polygon points="130,170 330,170 300,210 160,210" fill="#ffffff" stroke="#03045e" strokeWidth="3" />
        <rect x="180" y="150" width="100" height="20" rx="4" fill="#ffb703" />
        {/* Passenger Snorkel Mask A (Cyan) */}
        <circle cx="210" cy="140" r="10" fill="#f4a261" />
        <rect x="204" y="136" width="14" height="6" rx="2" fill="#00f5d4" />
        {/* Life Ring A (Orange with White Stripes) */}
        <circle cx="295" cy="188" r="12" fill="#fb5607" stroke="#ffffff" strokeWidth="3" />
        {/* Water Splash */}
        <path d="M 120 185 Q 110 170 130 175 Q 125 185 120 185 Z" fill="#ffffff" opacity="0.8" />
      </svg>
    ),
    renderB: () => (
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <rect width="400" height="160" fill="#a2d2ff" />
        <rect x="0" y="160" width="400" height="140" fill="#0077b6" />
        {/* Cloud B (Heart Shaped Cloud) */}
        <path d="M 320 50 A 10 10 0 0 0 310 40 A 10 10 0 0 0 320 30 A 10 10 0 0 0 330 40 Z" fill="#ffffff" opacity="0.9" transform="scale(1.5) translate(-105,-15)" />
        {/* Dolphin B (No Dolphin, Just Ripple) */}
        <ellipse cx="90" cy="140" rx="15" ry="4" fill="#ffffff" opacity="0.6" />
        {/* Speedboat */}
        <polygon points="130,170 330,170 300,210 160,210" fill="#ffffff" stroke="#03045e" strokeWidth="3" />
        <rect x="180" y="150" width="100" height="20" rx="4" fill="#ffb703" />
        {/* Passenger Snorkel Mask B (Pink) */}
        <circle cx="210" cy="140" r="10" fill="#f4a261" />
        <rect x="204" y="136" width="14" height="6" rx="2" fill="#ff006e" />
        {/* Life Ring B (Solid Yellow, No Stripe) */}
        <circle cx="295" cy="188" r="12" fill="#ffbe0b" stroke="#000" strokeWidth="1" />
        {/* Water Splash */}
        <path d="M 120 185 Q 110 170 130 175 Q 125 185 120 185 Z" fill="#ffffff" opacity="0.8" />
      </svg>
    ),
  },

  {
    id: 4,
    title: 'ด่าน 4: ปาร์ตี้ซีฟู้ดบุฟเฟต์',
    subtitle: 'กุ้งเผา ปูม้า และเครื่องดื่มเย็นฉ่ำริมสระ',
    icon: '🦞',
    differences: [
      { id: 1, name: 'ก้ามกุ้งมังกรบนจาน', x: 30, y: 48, radius: 8, hint: 'ดูก้ามกุ้งบนจานหลักด้านซ้าย' },
      { id: 2, name: 'หลอดดูดในแก้วเครื่องดื่ม', x: 82, y: 45, radius: 7, hint: 'ดูหลอดในแก้วน้ำแตงโมขวามือ' },
      { id: 3, name: 'หมวกเชฟทำอาหาร', x: 50, y: 18, radius: 7, hint: 'ดูหมวกของเชฟด้านหลัง' },
      { id: 4, name: 'ชิ้นมะนาวบนจานหอย', x: 52, y: 72, radius: 7, hint: 'ดูเลมอนหั่นซีกตรงกลางล่าง' },
    ],
    renderA: () => (
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#f8edeb" />
        {/* Chef A (Tall Chef Hat) */}
        <rect x="185" y="25" width="30" height="25" rx="3" fill="#ffffff" stroke="#333" strokeWidth="1.5" />
        <circle cx="200" cy="65" r="14" fill="#f4a261" />
        {/* Big Dining Table */}
        <ellipse cx="200" cy="180" rx="170" ry="70" fill="#ffffff" stroke="#ccc" strokeWidth="2" />
        {/* Seafood Plate A (Lobster with 2 Big Claws) */}
        <ellipse cx="120" cy="150" rx="45" ry="25" fill="#f1faee" stroke="#888" strokeWidth="1.5" />
        <ellipse cx="120" cy="150" rx="20" ry="12" fill="#e63946" />
        <circle cx="95" cy="142" r="8" fill="#e63946" />
        <circle cx="145" cy="142" r="8" fill="#e63946" />
        {/* Lemon Slice A */}
        <circle cx="210" cy="210" r="10" fill="#ffd166" stroke="#e09f3e" strokeWidth="2" />
        {/* Beverage Glass A (Green Straw) */}
        <rect x="315" y="125" width="22" height="40" rx="4" fill="#ff4d6d" opacity="0.85" />
        <line x1="326" y1="110" x2="338" y2="135" stroke="#38b000" strokeWidth="3" />
      </svg>
    ),
    renderB: () => (
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#f8edeb" />
        {/* Chef B (Bandana instead of Tall Hat) */}
        <rect x="185" y="45" width="30" height="10" rx="2" fill="#e63946" />
        <circle cx="200" cy="65" r="14" fill="#f4a261" />
        {/* Big Dining Table */}
        <ellipse cx="200" cy="180" rx="170" ry="70" fill="#ffffff" stroke="#ccc" strokeWidth="2" />
        {/* Seafood Plate B (Lobster with 1 Claw missing) */}
        <ellipse cx="120" cy="150" rx="45" ry="25" fill="#f1faee" stroke="#888" strokeWidth="1.5" />
        <ellipse cx="120" cy="150" rx="20" ry="12" fill="#e63946" />
        <circle cx="95" cy="142" r="8" fill="#e63946" />
        {/* Lemon Slice B (No Lemon, Just Green Herb) */}
        <path d="M 205 210 Q 212 202 220 210" stroke="#2d6a4f" strokeWidth="3" fill="none" />
        {/* Beverage Glass B (Yellow Straw) */}
        <rect x="315" y="125" width="22" height="40" rx="4" fill="#ff4d6d" opacity="0.85" />
        <line x1="326" y1="110" x2="338" y2="135" stroke="#ffb703" strokeWidth="3" />
      </svg>
    ),
  },

  {
    id: 5,
    title: 'ด่าน 5: ฐานผจญภัยซิปไลน์',
    subtitle: 'โหนสลิงข้ามยอดไม้ ท้าทายความกล้าในป่าเขา',
    icon: '🧗',
    differences: [
      { id: 1, name: 'สีหมวกนิรภัยคนโหนสลิง', x: 45, y: 35, radius: 8, hint: 'ดูหมวกกันน็อกของเพื่อนที่โหนสลิง' },
      { id: 2, name: 'นกเกาะบนกิ่งไม้ใหญ่', x: 85, y: 22, radius: 8, hint: 'สังเกตนกบนกิ่งไม้ทางขวาบน' },
      { id: 3, name: 'ธงสัญลักษณ์บนฐานปล่อยตัว', x: 15, y: 25, radius: 7, hint: 'ดูธงบนแท่นต้นไม้ซ้ายมือ' },
      { id: 4, name: 'กระเป๋าเป้สะพายหลัง', x: 42, y: 52, radius: 7, hint: 'ดูกระเป๋าเป้ของคนโหนสลิง' },
    ],
    renderA: () => (
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#d8f3dc" />
        <polygon points="0,220 120,100 240,240 380,80 400,260 0,300" fill="#2d6a4f" opacity="0.4" />
        {/* Tree Platform Left */}
        <rect x="10" y="80" width="50" height="220" fill="#582f0e" />
        <rect x="0" y="80" width="70" height="15" fill="#7f4f24" />
        {/* Flag A (Blue Flag) */}
        <polygon points="25,50 25,75 50,62" fill="#0071e3" />
        <line x1="25" y1="50" x2="25" y2="80" stroke="#000" strokeWidth="2" />
        {/* Zipline Wire */}
        <line x1="35" y1="85" x2="380" y2="190" stroke="#333" strokeWidth="3" />
        {/* Zipline Rider A (Orange Helmet) */}
        <circle cx="180" cy="115" r="10" fill="#fb8500" />
        <rect x="175" y="125" width="12" height="22" rx="3" fill="#264653" />
        {/* Backpack A (Yellow Bag) */}
        <rect x="166" y="127" width="8" height="14" rx="2" fill="#e9c46a" />
        {/* Tree Branch Right & Bird A */}
        <path d="M 350 70 Q 320 80 300 75" stroke="#582f0e" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="325" cy="68" rx="8" ry="5" fill="#e63946" />
      </svg>
    ),
    renderB: () => (
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#d8f3dc" />
        <polygon points="0,220 120,100 240,240 380,80 400,260 0,300" fill="#2d6a4f" opacity="0.4" />
        {/* Tree Platform Left */}
        <rect x="10" y="80" width="50" height="220" fill="#582f0e" />
        <rect x="0" y="80" width="70" height="15" fill="#7f4f24" />
        {/* Flag B (Green Flag) */}
        <polygon points="25,50 25,75 50,62" fill="#38b000" />
        <line x1="25" y1="50" x2="25" y2="80" stroke="#000" strokeWidth="2" />
        {/* Zipline Wire */}
        <line x1="35" y1="85" x2="380" y2="190" stroke="#333" strokeWidth="3" />
        {/* Zipline Rider B (Cyan Helmet) */}
        <circle cx="180" cy="115" r="10" fill="#00f5d4" />
        <rect x="175" y="125" width="12" height="22" rx="3" fill="#264653" />
        {/* Backpack B (No Bag) */}
        {/* Tree Branch Right (No Bird B) */}
        <path d="M 350 70 Q 320 80 300 75" stroke="#582f0e" strokeWidth="6" strokeLinecap="round" />
      </svg>
    ),
  },

  {
    id: 6,
    title: 'ด่าน 6: คาเฟ่ริมทะเลสุดชิลล์',
    subtitle: 'ลาเต้อาร์ตร้อน ขนมหวาน และมุมถ่ายรูปเช็คอิน',
    icon: '☕',
    differences: [
      { id: 1, name: 'ลายฟองนมในแก้วกาแฟ', x: 28, y: 58, radius: 8, hint: 'ดูรูปหัวใจ/ใบไม้บนฟองนมในแก้วกาแฟ' },
      { id: 2, name: 'สตรอว์เบอร์รีบนเค้ก', x: 68, y: 52, radius: 7, hint: 'ดูลูกสตรอว์เบอร์รีบนจานเค้ก' },
      { id: 3, name: 'แว่นกันแดดวางบนโต๊ะ', x: 48, y: 75, radius: 7, hint: 'ดูแว่นตากันแดดที่วางข้างแก้ว' },
      { id: 4, name: 'แถบสีร่มชายหาดนอกหน้าต่าง', x: 80, y: 22, radius: 8, hint: 'ดูร่มผ้าใบที่มองเห็นนอกหน้าต่าง' },
    ],
    renderA: () => (
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#faedcd" />
        <rect x="240" y="20" width="140" height="100" rx="8" fill="#a2d2ff" stroke="#fff" strokeWidth="6" />
        {/* Umbrella Outside A (Red & White) */}
        <path d="M 280 60 Q 310 30 340 60 Z" fill="#e63946" />
        <path d="M 295 60 Q 310 35 325 60 Z" fill="#ffffff" />
        {/* Wooden Cafe Table */}
        <rect x="0" y="130" width="400" height="170" fill="#d4a373" />
        {/* Coffee Cup A (Heart Latte Art) */}
        <circle cx="110" cy="180" r="38" fill="#ffffff" stroke="#ccc" strokeWidth="2" />
        <circle cx="110" cy="180" r="30" fill="#6f4e37" />
        <path d="M 110 185 A 6 6 0 0 1 100 175 A 6 6 0 0 1 110 170 A 6 6 0 0 1 120 175 A 6 6 0 0 1 110 185 Z" fill="#ffffff" />
        {/* Cake Slice A (With Red Strawberry) */}
        <polygon points="250,185 300,140 320,185" fill="#fefae0" stroke="#bc6c25" strokeWidth="2" />
        <circle cx="290" cy="155" r="7" fill="#d90429" />
        {/* Sunglasses A */}
        <rect x="180" y="220" width="16" height="10" rx="3" fill="#111" />
        <rect x="202" y="220" width="16" height="10" rx="3" fill="#111" />
        <line x1="195" y1="223" x2="203" y2="223" stroke="#111" strokeWidth="2" />
      </svg>
    ),
    renderB: () => (
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#faedcd" />
        <rect x="240" y="20" width="140" height="100" rx="8" fill="#a2d2ff" stroke="#fff" strokeWidth="6" />
        {/* Umbrella Outside B (Yellow & White) */}
        <path d="M 280 60 Q 310 30 340 60 Z" fill="#ffd166" />
        <path d="M 295 60 Q 310 35 325 60 Z" fill="#ffffff" />
        {/* Wooden Cafe Table */}
        <rect x="0" y="130" width="400" height="170" fill="#d4a373" />
        {/* Coffee Cup B (Plain Foam, No Latte Art) */}
        <circle cx="110" cy="180" r="38" fill="#ffffff" stroke="#ccc" strokeWidth="2" />
        <circle cx="110" cy="180" r="30" fill="#6f4e37" />
        <circle cx="110" cy="180" r="10" fill="#ffffff" opacity="0.4" />
        {/* Cake Slice B (With Cherry / Blue Berry) */}
        <polygon points="250,185 300,140 320,185" fill="#fefae0" stroke="#bc6c25" strokeWidth="2" />
        <circle cx="290" cy="155" r="7" fill="#3a0ca3" />
        {/* Sunglasses B (Missing) */}
      </svg>
    ),
  },

  {
    id: 7,
    title: 'ด่าน 7: ชมพระอาทิตย์ตกแหลมชมวิว',
    subtitle: 'แสงทไวไลท์สีทองประกาย ประภาคารและเรือใบ',
    icon: '🌅',
    differences: [
      { id: 1, name: 'ลำแสงไฟประภาคาร', x: 25, y: 35, radius: 8, hint: 'ดูลำแสงส่องจากยอดหอประภาคาร' },
      { id: 2, name: 'สีของใบเรือใบกลางทะเล', x: 68, y: 48, radius: 7, hint: 'ดูสีของเรือใบสีขาวสลับส้ม' },
      { id: 3, name: 'กล้องส่องทางไกลบนแหลม', x: 88, y: 70, radius: 7, hint: 'ดูกล้องส่องทางไกลมุมขวาล่าง' },
      { id: 4, name: 'ดวงดาวประกายแสงดวงแรก', x: 45, y: 15, radius: 7, hint: 'ดูประกายดาวบนท้องฟ้าข้างบน' },
    ],
    renderA: () => (
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <rect width="400" height="180" fill="#ff7b00" />
        <ellipse cx="200" cy="150" rx="55" ry="40" fill="#ffea00" />
        <rect x="0" y="170" width="400" height="130" fill="#7209b7" />
        {/* Star A */}
        <polygon points="180,30 183,38 192,38 185,44 187,52 180,47 173,52 175,44 168,38 177,38" fill="#ffffff" />
        {/* Lighthouse Left A (Beam of Light) */}
        <polygon points="60,60 85,60 95,200 50,200" fill="#ffffff" stroke="#222" strokeWidth="2" />
        <polygon points="85,65 240,40 240,80" fill="#ffea00" opacity="0.6" />
        {/* Sailboat A (Orange Stripe Sail) */}
        <polygon points="260,175 300,120 300,175" fill="#ffffff" stroke="#222" strokeWidth="1.5" />
        <polygon points="280,175 300,135 300,175" fill="#f72585" />
        <rect x="250" y="175" width="60" height="10" rx="3" fill="#4361ee" />
        {/* Binoculars A on Tripod */}
        <line x1="350" y1="210" x2="340" y2="245" stroke="#fff" strokeWidth="3" />
        <line x1="350" y1="210" x2="360" y2="245" stroke="#fff" strokeWidth="3" />
        <rect x="342" y="205" width="16" height="8" rx="2" fill="#222" />
      </svg>
    ),
    renderB: () => (
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <rect width="400" height="180" fill="#ff7b00" />
        <ellipse cx="200" cy="150" rx="55" ry="40" fill="#ffea00" />
        <rect x="0" y="170" width="400" height="130" fill="#7209b7" />
        {/* Star B (Missing) */}
        {/* Lighthouse Left B (No Light Beam) */}
        <polygon points="60,60 85,60 95,200 50,200" fill="#ffffff" stroke="#222" strokeWidth="2" />
        {/* Sailboat B (Solid White Sail) */}
        <polygon points="260,175 300,120 300,175" fill="#ffffff" stroke="#222" strokeWidth="1.5" />
        <rect x="250" y="175" width="60" height="10" rx="3" fill="#4361ee" />
        {/* Binoculars B (Missing) */}
      </svg>
    ),
  },

  {
    id: 8,
    title: 'ด่าน 8: ปาร์ตี้กาล่าดินเนอร์',
    subtitle: 'แสงไฟสปอตไลท์ ดนตรีสด และความสนุกสนาน',
    icon: '🎪',
    differences: [
      { id: 1, name: 'ไฟลูกดิสโก้บอลระยิบระยับ', x: 50, y: 15, radius: 8, hint: 'ดูลูกบอลดิสโก้ตรงกลางเพดานเวที' },
      { id: 2, name: 'สีสปอตไลท์ส่องลงเวที', x: 20, y: 35, radius: 8, hint: 'ดูลำแสงสปอตไลท์ด้านซ้าย' },
      { id: 3, name: 'โบว์หูกระต่ายของนักดนตรี', x: 62, y: 55, radius: 7, hint: 'ดูโบว์คอเสื้อของมือกีตาร์' },
      { id: 4, name: 'สายริบบิ้นเป่าฟองบนโต๊ะ', x: 80, y: 80, radius: 7, hint: 'ดูริบบิ้นปาร์ตี้มุมขวาล่าง' },
    ],
    renderA: () => (
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#10002b" />
        {/* Disco Ball A */}
        <line x1="200" y1="0" x2="200" y2="40" stroke="#fff" strokeWidth="2" />
        <circle cx="200" cy="50" r="18" fill="#e0aaff" stroke="#fff" strokeWidth="2" />
        <circle cx="196" cy="46" r="3" fill="#fff" />
        <circle cx="204" cy="54" r="3" fill="#fff" />
        {/* Spotlight A (Cyan Beam) */}
        <polygon points="40,20 160,220 80,220" fill="#4cc9f0" opacity="0.35" />
        {/* Stage */}
        <rect x="0" y="210" width="400" height="90" fill="#240046" />
        {/* Musician A (Red Bow Tie) */}
        <circle cx="250" cy="140" r="14" fill="#f4a261" />
        <polygon points="245,158 255,158 250,163" fill="#d90429" />
        <rect x="238" y="165" width="24" height="45" rx="4" fill="#3a0ca3" />
        {/* Party Ribbon A */}
        <path d="M 300 240 Q 320 220 340 250 Q 360 230 380 260" stroke="#f72585" strokeWidth="4" fill="none" />
      </svg>
    ),
    renderB: () => (
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#10002b" />
        {/* Disco Ball B (Dark/Turned Off) */}
        <line x1="200" y1="0" x2="200" y2="40" stroke="#888" strokeWidth="2" />
        <circle cx="200" cy="50" r="18" fill="#5a189a" stroke="#888" strokeWidth="1" />
        {/* Spotlight B (Yellow Beam) */}
        <polygon points="40,20 160,220 80,220" fill="#ffd166" opacity="0.35" />
        {/* Stage */}
        <rect x="0" y="210" width="400" height="90" fill="#240046" />
        {/* Musician B (Green Tie instead of Red Bow Tie) */}
        <circle cx="250" cy="140" r="14" fill="#f4a261" />
        <line x1="250" y1="156" x2="250" y2="175" stroke="#38b000" strokeWidth="4" />
        <rect x="238" y="165" width="24" height="45" rx="4" fill="#3a0ca3" />
        {/* Party Ribbon B (Missing) */}
      </svg>
    ),
  },

  {
    id: 9,
    title: 'ด่าน 9: ตลาดคนเดินช้อปปิ้งของฝาก',
    subtitle: 'โคมไฟหลากสี แผงขายขนมไทย และของที่ระลึก',
    icon: '🛍️',
    differences: [
      { id: 1, name: 'สีของโคมไฟหน้าร้าน', x: 25, y: 22, radius: 8, hint: 'ดูโคมไฟแขวนร้านค้าซ้ายบน' },
      { id: 2, name: 'พวงกุญแจช้างของฝาก', x: 75, y: 55, radius: 7, hint: 'ดูพวงกุญแจที่แขวนโชว์ฝั่งขวา' },
      { id: 3, name: 'ป้ายลดราคาของร้าน', x: 50, y: 40, radius: 7, hint: 'ดูป้ายข้อความหน้าร้านตรงกลาง' },
      { id: 4, name: 'ลูกโป่งสวรรค์ลอยฟ้า', x: 88, y: 18, radius: 8, hint: 'ดูลูกโป่งลอยบนฟ้าขวาบน' },
    ],
    renderA: () => (
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#2b2d42" />
        {/* Lantern A (Red Lantern) */}
        <circle cx="100" cy="65" r="16" fill="#e63946" stroke="#ffd166" strokeWidth="2" />
        <line x1="100" y1="20" x2="100" y2="50" stroke="#ffd166" strokeWidth="2" />
        {/* Balloon A */}
        <circle cx="350" cy="50" r="12" fill="#48cae4" />
        <line x1="350" y1="62" x2="350" y2="90" stroke="#ccc" strokeWidth="1" />
        {/* Shop Cart */}
        <rect x="50" y="120" width="300" height="150" fill="#8d99ae" rx="8" />
        <rect x="70" y="100" width="260" height="30" fill="#d90429" />
        {/* Discount Sign A ("SALE 50%") */}
        <rect x="170" y="110" width="60" height="20" rx="3" fill="#ffbe0b" />
        <text x="178" y="124" fontSize="9" fontWeight="bold" fill="#000">SALE 50%</text>
        {/* Elephant Keychain A */}
        <rect x="290" y="160" width="16" height="12" rx="3" fill="#4a4e69" />
        <circle cx="288" cy="164" r="5" fill="#4a4e69" />
      </svg>
    ),
    renderB: () => (
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#2b2d42" />
        {/* Lantern B (Yellow Lantern) */}
        <circle cx="100" cy="65" r="16" fill="#ffbe0b" stroke="#ffd166" strokeWidth="2" />
        <line x1="100" y1="20" x2="100" y2="50" stroke="#ffd166" strokeWidth="2" />
        {/* Balloon B (Missing) */}
        {/* Shop Cart */}
        <rect x="50" y="120" width="300" height="150" fill="#8d99ae" rx="8" />
        <rect x="70" y="100" width="260" height="30" fill="#d90429" />
        {/* Discount Sign B ("TOUR 2026") */}
        <rect x="170" y="110" width="60" height="20" rx="3" fill="#ffbe0b" />
        <text x="176" y="124" fontSize="8" fontWeight="bold" fill="#000">TOUR 2026</text>
        {/* Elephant Keychain B (Missing) */}
      </svg>
    ),
  },

  {
    id: 10,
    title: 'ด่าน 10: เวทีมอบถ้วยรางวัลแชมเปียน',
    subtitle: 'พิธีปิดสุดอลังการ มอบถ้วยทองคำและสายสะพายเกียรติยศ',
    icon: '🏆',
    differences: [
      { id: 1, name: 'ดาวบนถ้วยรางวัลทองคำ', x: 50, y: 40, radius: 8, hint: 'ดูประกายดาวบนถ้วยรางวัลตรงกลาง' },
      { id: 2, name: 'พลุกระดาษฉลองชัยสีรุ้ง', x: 20, y: 25, radius: 8, hint: 'ดูเศษพลุกระดาษโปรยด้านซ้าย' },
      { id: 3, name: 'สีแท่นรับรางวัลอันดับ 1', x: 50, y: 75, radius: 8, hint: 'ดูสีของโพเดียมตรงกลาง' },
      { id: 4, name: 'สายสะพายของแชมป์', x: 75, y: 55, radius: 7, hint: 'ดูสายสะพายของผู้ชนะทางขวา' },
    ],
    renderA: () => (
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#1b1b1e" />
        {/* Confetti A */}
        <circle cx="60" cy="50" r="4" fill="#ff006e" />
        <circle cx="80" cy="70" r="5" fill="#3a86ff" />
        <rect x="65" y="80" width="8" height="4" fill="#ffbe0b" transform="rotate(25 65 80)" />
        {/* Podium A (Gold Podium) */}
        <rect x="140" y="180" width="120" height="100" fill="#ffb703" stroke="#fff" strokeWidth="2" />
        <text x="190" y="240" fontSize="36" fontWeight="bold" fill="#000">1</text>
        {/* Grand Trophy A (With Star) */}
        <path d="M 180 80 L 220 80 L 210 130 L 190 130 Z" fill="#ffd166" stroke="#d4a373" strokeWidth="2" />
        <polygon points="200,90 203,98 212,98 205,103 207,112 200,107 193,112 195,103 188,98 197,98" fill="#d90429" />
        {/* Winner Person A (With Gold Sash) */}
        <circle cx="300" cy="130" r="14" fill="#f4a261" />
        <rect x="288" y="148" width="24" height="40" fill="#0071e3" rx="4" />
        <line x1="288" y1="150" x2="312" y2="185" stroke="#ffd166" strokeWidth="4" />
      </svg>
    ),
    renderB: () => (
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#1b1b1e" />
        {/* Confetti B (Missing) */}
        {/* Podium B (Silver Podium) */}
        <rect x="140" y="180" width="120" height="100" fill="#adb5bd" stroke="#fff" strokeWidth="2" />
        <text x="190" y="240" fontSize="36" fontWeight="bold" fill="#000">1</text>
        {/* Grand Trophy B (No Star) */}
        <path d="M 180 80 L 220 80 L 210 130 L 190 130 Z" fill="#ffd166" stroke="#d4a373" strokeWidth="2" />
        {/* Winner Person B (No Sash) */}
        <circle cx="300" cy="130" r="14" fill="#f4a261" />
        <rect x="288" y="148" width="24" height="40" fill="#0071e3" rx="4" />
      </svg>
    ),
  },
];

// BONUS MINI-GAME: FAMILY SORT / WATER COLOR SORT PUZZLE
// (Modeled exactly after the user's uploaded screenshot!)
function FamilySortGame({ participant, onAddScore }) {
  // Bottle capacity: 4 units
  const INITIAL_BOTTLES = [
    ['red', 'red'],
    ['red', 'blue', 'blue'],
    ['blue'],
  ];

  const [bottles, setBottles] = useState(INITIAL_BOTTLES);
  const [selectedBottle, setSelectedBottle] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [isSorted, setIsSorted] = useState(false);
  const [levelNum, setLevelNum] = useState(2);

  const COLOR_MAP = {
    red: '#e63946',
    blue: '#0071e3',
    yellow: '#ffb703',
    green: '#2a9d8f',
  };

  const checkWin = (currentBottles) => {
    // Win if all non-empty bottles contain all same color and are complete
    const filled = currentBottles.filter(b => b.length > 0);
    const won = filled.every(b => b.every(c => c === b[0]));
    if (won && filled.length <= 2) {
      setIsSorted(true);
      playFanfare();
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch {}
      if (participant && onAddScore) {
        onAddScore(participant.id, 30);
      }
    }
  };

  const handleBottleClick = (idx) => {
    if (isSorted) return;
    playTick();

    if (selectedBottle === null) {
      // Pick source bottle if it has liquid
      if (bottles[idx].length > 0) {
        setSelectedBottle(idx);
      }
    } else if (selectedBottle === idx) {
      // Unselect
      setSelectedBottle(null);
    } else {
      // Attempt to pour from selectedBottle into idx
      const source = [...bottles[selectedBottle]];
      const target = [...bottles[idx]];

      if (target.length >= 4) {
        playWarning();
        setSelectedBottle(null);
        return;
      }

      const topColor = source[source.length - 1];
      if (target.length === 0 || target[target.length - 1] === topColor) {
        // Valid move!
        const newHistory = [...moveHistory, bottles.map(b => [...b])];
        setMoveHistory(newHistory);

        source.pop();
        target.push(topColor);

        const newBottles = bottles.map((b, i) => {
          if (i === selectedBottle) return source;
          if (i === idx) return target;
          return b;
        });

        setBottles(newBottles);
        setSelectedBottle(null);
        playSuccess();
        checkWin(newBottles);
      } else {
        playWarning();
        setSelectedBottle(null);
      }
    }
  };

  const handleUndo = () => {
    if (moveHistory.length === 0) return;
    const prev = moveHistory[moveHistory.length - 1];
    setBottles(prev);
    setMoveHistory(moveHistory.slice(0, -1));
    setSelectedBottle(null);
    setIsSorted(false);
  };

  const handleRestart = () => {
    setBottles(INITIAL_BOTTLES);
    setSelectedBottle(null);
    setMoveHistory([]);
    setIsSorted(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Cartoon Stage Header like user's screenshot */}
      <div className="relative rounded-[32px] overflow-hidden border border-black/10 dark:border-white/10 shadow-xl bg-gradient-to-b from-[#70d6ff] via-[#9bf6ff] to-[#a0c4ff] p-6 text-center select-none">
        
        {/* Top Game HUD Bar (Level, Avatar, Coins) */}
        <div className="flex items-center justify-between max-w-sm mx-auto bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-black/10 shadow-md">
          <div className="bg-[#ffb703] text-white px-3 py-1 rounded-xl text-xs font-bold shadow-sm">
            Level {levelNum}
          </div>
          <div className="w-10 h-10 rounded-full bg-[#f4a261] border-2 border-white flex items-center justify-center text-xl shadow-sm">
            👩
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1d1d1f] dark:text-white">
            <span>🪙 Coins</span>
            <span className="text-[#0071e3] font-mono">1000</span>
          </div>
        </div>

        {/* Sunny Garden Background Scene */}
        <div className="relative h-64 mt-4 flex items-end justify-center pb-8">
          {/* Garden Bush & Sunflowers */}
          <div className="absolute inset-0 flex items-center justify-between px-6 opacity-80 pointer-events-none">
            <span className="text-4xl animate-pulse">🌻</span>
            <span className="text-4xl animate-bounce">🌳</span>
            <span className="text-4xl">🌻</span>
          </div>

          {/* Wooden Bench */}
          <div className="absolute bottom-4 w-72 h-6 bg-[#fb8500] rounded-xl shadow-lg border-2 border-[#d4a373] flex justify-between px-6">
            <div className="w-3 h-5 bg-[#b05d00] mt-5 rounded-b"></div>
            <div className="w-3 h-5 bg-[#b05d00] mt-5 rounded-b"></div>
          </div>

          {/* 3 Glass Bottles */}
          <div className="relative z-10 flex items-end justify-center gap-6 mb-2">
            {bottles.map((stack, idx) => {
              const isSelected = selectedBottle === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleBottleClick(idx)}
                  className={`cursor-pointer transition-transform duration-200 ${
                    isSelected ? '-translate-y-5 scale-105' : 'hover:-translate-y-1'
                  }`}
                >
                  {/* Glass Bottle Outline */}
                  <div className="relative w-14 h-36 rounded-2xl border-4 border-white/90 bg-white/30 backdrop-blur-sm overflow-hidden flex flex-col-reverse p-1 shadow-md">
                    {/* Bottle Neck */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-3 bg-white/80 rounded-t border-2 border-white"></div>
                    
                    {/* Liquid layers */}
                    {stack.map((color, layerIdx) => (
                      <div
                        key={layerIdx}
                        className="w-full h-7 rounded-sm transition-all duration-300 shadow-inner"
                        style={{ backgroundColor: COLOR_MAP[color] || color }}
                      />
                    ))}
                  </div>

                  <div className="text-[10px] text-center font-bold text-[#222] mt-1">
                    ขวด {idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Victory Message */}
        {isSorted && (
          <div className="bg-white/90 dark:bg-[#1c1c1e]/90 p-4 rounded-2xl text-center space-y-1 my-2">
            <span className="text-2xl">🎉</span>
            <div className="text-sm font-bold text-[#34c759]">ยินดีด้วย! คุณแยกสีน้ำสำเร็จแล้ว!</div>
            <div className="text-xs text-[#86868b]">+30 แต้ม สะสมเข้าทีมสีของคุณ</div>
          </div>
        )}

        {/* Bottom Game Action Buttons (Undo, Restart, Hint) */}
        <div className="flex items-center justify-center gap-4 pt-3">
          <button
            onClick={handleUndo}
            disabled={moveHistory.length === 0}
            className="w-11 h-11 rounded-2xl bg-[#ffd166] hover:bg-[#ffb703] border-2 border-white shadow-md flex items-center justify-center text-lg active:scale-95 transition-transform disabled:opacity-40"
            title="ย้อนกลับ (Undo)"
          >
            ↩️
          </button>
          <button
            onClick={handleRestart}
            className="w-12 h-12 rounded-2xl bg-[#06d6a0] hover:bg-[#05b586] border-2 border-white shadow-lg flex items-center justify-center text-xl active:scale-95 transition-transform"
            title="เริ่มด่านใหม่ (Restart)"
          >
            🔄
          </button>
          <button
            onClick={() => alert('คำใบ้: แตะขวดแรกเพื่อยกขึ้น แล้วแตะขวดที่สองเพื่อเทสีที่มีสีเดียวกันลงไป!')}
            className="w-11 h-11 rounded-2xl bg-[#118ab2] hover:bg-[#0f7a9d] border-2 border-white shadow-md flex items-center justify-center text-lg active:scale-95 transition-transform"
            title="คำใบ้ (Hint)"
          >
            💡
          </button>
        </div>

      </div>

    </div>
  );
}

// MAIN COMPONENT EXPORT
export default function SpotTheDifference({ participant, onAddScore }) {
  const [activeMode, setActiveMode] = useState('diff'); // 'diff' (10 Levels) or 'sort' (Family Sort)
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [mobileBlinkTab, setMobileBlinkTab] = useState('A'); // 'A' or 'B' on mobile blink mode
  const [isBlinkMode, setIsBlinkMode] = useState(false);

  // Track found spots per level: { [levelId]: [foundSpotIds] }
  const [progress, setProgress] = useState(() => {
    const local = localStorage.getItem('tour_spot_diff_progress');
    return local ? JSON.parse(local) : {};
  });

  const [lastFeedback, setLastFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);

  const currentLevel = LEVELS[currentLevelIdx];
  const foundSpots = progress[currentLevel.id] || [];
  const isLevelCompleted = foundSpots.length === currentLevel.differences.length;

  const handleClickImage = (e, imgType) => {
    if (isLevelCompleted) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Generous touch tolerance for smartphone screens
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const hit = currentLevel.differences.find((d) => {
      if (foundSpots.includes(d.id)) return false;
      const dist = Math.hypot(clickX - d.x, clickY - d.y);
      const hitRadius = isMobile ? d.radius * 1.35 : d.radius;
      return dist <= hitRadius;
    });

    if (hit) {
      const nextFound = [...foundSpots, hit.id];
      const nextProgress = { ...progress, [currentLevel.id]: nextFound };
      setProgress(nextProgress);
      localStorage.setItem('tour_spot_diff_progress', JSON.stringify(nextProgress));

      playSuccess();
      setLastFeedback(`✓ ถูกต้อง! พบ "${hit.name}" (+10 แต้ม)`);

      // Award 10 points
      if (participant && onAddScore) {
        onAddScore(participant.id, 10);
      }

      // Check level clear
      if (nextFound.length === currentLevel.differences.length) {
        playFanfare();
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}
        if (participant && onAddScore) {
          onAddScore(participant.id, 20); // Bonus 20 points
        }
      }
    } else {
      playWarning();
      setLastFeedback('✕ ยังไม่ตรงจุด ลองสังเกตเปรียบเทียบดีๆ อีกครั้ง');
      setTimeout(() => setLastFeedback(''), 2000);
    }
  };

  const handleResetLevel = () => {
    const nextProgress = { ...progress, [currentLevel.id]: [] };
    setProgress(nextProgress);
    localStorage.setItem('tour_spot_diff_progress', JSON.stringify(nextProgress));
    setLastFeedback('');
    setShowHint(false);
  };

  const totalFoundAllLevels = Object.values(progress).reduce((acc, curr) => acc + curr.length, 0);
  const totalDifferencesAll = LEVELS.reduce((acc, lvl) => acc + lvl.differences.length, 0);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0071e3] dark:text-[#2997ff]">
              BUS OUTING GAMES • กิจกรรมเล่นบนรถ
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#ff9500]/10 text-[#ff9500]">
              10 ด่านครบชุด
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
            เกมจับผิดภาพ 10 ด่าน. <span className="text-[#86868b]">สะสมแต้มให้ทีมสี</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#6e6e73] dark:text-[#a1a1a6] mt-1">
            ภาพจำลองบรรยากาศทริปทัวร์ 10 สถานการณ์ • คลิกจุดที่ต่างกันบนภาพเพื่อรับแต้มสดเข้าทีม
          </p>
        </div>

        {/* Mode Switcher Pill */}
        <div className="inline-flex p-1 rounded-full bg-white dark:bg-[#161617] border border-black/10 dark:border-white/10 shadow-sm shrink-0">
          <button
            onClick={() => setActiveMode('diff')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeMode === 'diff'
                ? 'bg-[#0071e3] text-white shadow-sm'
                : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
          >
            <span>🔍</span>
            <span>จับผิดภาพ 10 ด่าน</span>
          </button>
          <button
            onClick={() => setActiveMode('sort')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeMode === 'sort'
                ? 'bg-[#0071e3] text-white shadow-sm'
                : 'text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
          >
            <span>🧪</span>
            <span>เกมเทสีลงขวด (Family Sort)</span>
          </button>
        </div>
      </div>

      {/* MODE 1: 10 SPOT THE DIFFERENCE LEVELS */}
      {activeMode === 'diff' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* 10 Level Selector Bar */}
          <div className="bg-white dark:bg-[#161617] border border-black/[0.08] dark:border-white/[0.08] rounded-[24px] p-3 sm:p-4 shadow-sm overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {LEVELS.map((lvl, idx) => {
                const isCurrent = idx === currentLevelIdx;
                const lvlSpots = progress[lvl.id] || [];
                const isDone = lvlSpots.length === lvl.differences.length;

                return (
                  <button
                    key={lvl.id}
                    onClick={() => {
                      setCurrentLevelIdx(idx);
                      setLastFeedback('');
                      setShowHint(false);
                      playTick();
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                      isCurrent
                        ? 'bg-[#0071e3] text-white shadow-sm scale-105'
                        : isDone
                        ? 'bg-[#34c759]/10 text-[#34c759] border border-[#34c759]/20'
                        : 'bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#6e6e73] dark:text-[#a1a1a6] hover:bg-black/5'
                    }`}
                  >
                    <span className="text-base">{lvl.icon}</span>
                    <span>ด่าน {lvl.id}</span>
                    {isDone && <span className="text-xs">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Level Info & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#161617] border border-black/[0.06] dark:border-white/[0.06] p-4 sm:p-5 rounded-2xl">
            <div>
              <div className="text-base sm:text-lg font-bold text-[#1d1d1f] dark:text-white flex items-center gap-2">
                <span className="text-xl">{currentLevel.icon}</span>
                <span>{currentLevel.title}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#86868b]">{currentLevel.subtitle}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3.5 py-1.5 rounded-xl bg-[#0071e3]/10 text-[#0071e3] dark:text-[#2997ff] text-xs sm:text-sm font-bold">
                พบแล้ว {foundSpots.length} / {currentLevel.differences.length} จุด
              </div>
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-3.5 py-1.5 rounded-xl bg-[#ff9500]/10 hover:bg-[#ff9500]/20 text-[#ff9500] text-xs sm:text-sm font-bold transition-colors"
              >
                💡 {showHint ? 'ซ่อนคำใบ้' : 'คำใบ้'}
              </button>
              <button
                onClick={handleResetLevel}
                className="px-3.5 py-1.5 rounded-xl bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b] hover:text-[#1d1d1f] text-xs sm:text-sm font-bold"
              >
                เริ่มด่านนี้ใหม่
              </button>
            </div>
          </div>

          {/* Hint Dropdown */}
          {showHint && (
            <div className="p-4 rounded-2xl bg-[#ff9500]/10 border border-[#ff9500]/20 text-xs sm:text-sm text-[#1d1d1f] dark:text-white space-y-1 animate-in fade-in">
              <span className="font-bold text-[#ff9500] block text-sm">💡 คำใบ้สำหรับด่านนี้:</span>
              <ul className="list-disc list-inside space-y-1 text-[#6e6e73] dark:text-[#d1d1d6] font-medium">
                {currentLevel.differences.map(d => (
                  <li key={d.id}>
                    {foundSpots.includes(d.id) ? (
                      <span className="line-through text-[#86868b]">{d.name} (พบแล้ว ✓)</span>
                    ) : (
                      <span>{d.hint}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Feedback Banner */}
          {lastFeedback && (
            <div className={`p-3.5 rounded-2xl text-xs font-semibold text-center transition-all ${
              lastFeedback.startsWith('✓')
                ? 'bg-[#34c759]/10 text-[#34c759] border border-[#34c759]/20'
                : 'bg-[#ff9500]/10 text-[#ff9500] border border-[#ff9500]/20'
            }`}>
              {lastFeedback}
            </div>
          )}

          {/* Level Complete Celebration */}
          {isLevelCompleted && (
            <div className="p-6 rounded-[28px] bg-gradient-to-r from-[#34c759]/15 to-[#0071e3]/15 border border-[#34c759]/30 text-center space-y-3">
              <span className="text-3xl block animate-bounce">🎉</span>
              <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-white">
                ยอดเยี่ยมมาก! คุณผ่าน {currentLevel.title} แล้ว!
              </h3>
              <p className="text-xs text-[#6e6e73] dark:text-[#a1a1a6]">
                ได้รับแต้มโบนัสพิเศษ +20 แต้ม รวมสะสมเข้าทีมสีของคุณ
              </p>
              {currentLevelIdx < LEVELS.length - 1 && (
                <button
                  onClick={() => {
                    setCurrentLevelIdx(currentLevelIdx + 1);
                    setLastFeedback('');
                    setShowHint(false);
                    playTick();
                  }}
                  className="px-6 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold shadow-sm"
                >
                  เล่นด่านถัดไป (ด่าน {currentLevelIdx + 2}) →
                </button>
              )}
            </div>
          )}

          {/* Mobile Comparison View Mode Switcher (Visible only on Smartphone) */}
          <div className="md:hidden flex items-center justify-between bg-white/80 dark:bg-[#161822]/80 p-2 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] shadow-sm backdrop-blur-md">
            <span className="text-[11px] text-[#86868b] font-medium pl-2">โหมดเล่นบนมือถือ:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsBlinkMode(false)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  !isBlinkMode
                    ? 'bg-[#0071e3] text-white shadow-sm'
                    : 'text-[#86868b]'
                }`}
              >
                👁️ เทียบ 2 ภาพ
              </button>
              <button
                onClick={() => setIsBlinkMode(true)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  isBlinkMode
                    ? 'bg-[#d4af37] text-black shadow-sm font-bold'
                    : 'text-[#86868b]'
                }`}
              >
                ⚡ สลับภาพ (Blink)
              </button>
            </div>
          </div>

          {/* If Mobile Blink Mode is Active */}
          {isBlinkMode ? (
            <div className="md:hidden bg-white dark:bg-[#161617] border border-black/[0.08] dark:border-white/[0.08] rounded-[28px] p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#0071e3] dark:text-[#2997ff]">
                  {mobileBlinkTab === 'A' ? 'ภาพที่ 1: ภาพต้นฉบับ' : 'ภาพที่ 2: ภาพจุดต่าง'}
                </span>
                <button
                  onClick={() => {
                    playTick();
                    setMobileBlinkTab(mobileBlinkTab === 'A' ? 'B' : 'A');
                  }}
                  className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f5d061] text-black font-extrabold text-xs shadow-md animate-pulse active:scale-95 transition-transform"
                >
                  ⚡ แตะเพื่อสลับภาพ ({mobileBlinkTab === 'A' ? '1 → 2' : '2 → 1'})
                </button>
              </div>

              <div
                onClick={(e) => handleClickImage(e, mobileBlinkTab)}
                className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-crosshair border border-black/[0.05] dark:border-white/[0.05] select-none shadow-inner"
              >
                {mobileBlinkTab === 'A' ? currentLevel.renderA() : currentLevel.renderB()}

                {/* Markers */}
                {foundSpots.map((spotId) => {
                  const spot = currentLevel.differences.find((d) => d.id === spotId);
                  if (!spot) return null;
                  return (
                    <div
                      key={spotId}
                      className="absolute rounded-full border-4 border-[#34c759] bg-[#34c759]/20 pointer-events-none animate-ping-once shadow-[0_0_12px_#34c759]"
                      style={{
                        left: `${spot.x}%`,
                        top: `${spot.y}%`,
                        width: `${spot.radius * 2.5}%`,
                        height: `${spot.radius * 2.5 * (4/3)}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <span className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-[#34c759] text-white text-[10px] font-bold flex items-center justify-center shadow">
                        ✓
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Standard Comparison Images Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Image A */}
              <div className="bg-white dark:bg-[#161617] border border-black/[0.08] dark:border-white/[0.08] rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#86868b]">
                  <span>ภาพที่ 1: ภาพต้นฉบับ (Original)</span>
                  <span className="text-[10px] bg-[#f5f5f7] dark:bg-[#1d1d1f] px-2.5 py-1 rounded-full">คลิกจุดที่ต่าง</span>
                </div>

                <div
                  onClick={(e) => handleClickImage(e, 'A')}
                  className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-crosshair border border-black/[0.05] dark:border-white/[0.05] select-none shadow-inner"
                >
                  {currentLevel.renderA()}

                  {/* Markers on Image A */}
                  {foundSpots.map((spotId) => {
                    const spot = currentLevel.differences.find((d) => d.id === spotId);
                    if (!spot) return null;
                    return (
                      <div
                        key={spotId}
                        className="absolute rounded-full border-4 border-[#34c759] bg-[#34c759]/20 pointer-events-none animate-ping-once shadow-[0_0_12px_#34c759]"
                        style={{
                          left: `${spot.x}%`,
                          top: `${spot.y}%`,
                          width: `${spot.radius * 2.5}%`,
                          height: `${spot.radius * 2.5 * (4/3)}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <span className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-[#34c759] text-white text-[10px] font-bold flex items-center justify-center shadow">
                          ✓
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Image B */}
              <div className="bg-white dark:bg-[#161617] border border-black/[0.08] dark:border-white/[0.08] rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#86868b]">
                  <span>ภาพที่ 2: ภาพจับผิด (Spot Area)</span>
                  <span className="text-[10px] bg-[#f5f5f7] dark:bg-[#1d1d1f] px-2.5 py-1 rounded-full">คลิกจุดที่ต่าง</span>
                </div>

                <div
                  onClick={(e) => handleClickImage(e, 'B')}
                  className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-crosshair border border-black/[0.05] dark:border-white/[0.05] select-none shadow-inner"
                >
                  {currentLevel.renderB()}

                  {/* Markers on Image B */}
                  {foundSpots.map((spotId) => {
                    const spot = currentLevel.differences.find((d) => d.id === spotId);
                    if (!spot) return null;
                    return (
                      <div
                        key={spotId}
                        className="absolute rounded-full border-4 border-[#34c759] bg-[#34c759]/20 pointer-events-none animate-ping-once shadow-[0_0_12px_#34c759]"
                        style={{
                          left: `${spot.x}%`,
                          top: `${spot.y}%`,
                          width: `${spot.radius * 2.5}%`,
                          height: `${spot.radius * 2.5 * (4/3)}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <span className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-[#34c759] text-white text-[10px] font-bold flex items-center justify-center shadow">
                          ✓
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* Overall Progress Banner */}
          <div className="bg-white dark:bg-[#161617] p-5 rounded-[24px] border border-black/[0.06] dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#86868b]">คะแนนสะสมรวมจากการเล่นเกมจับผิดภาพ</div>
              <div className="text-lg font-semibold text-[#1d1d1f] dark:text-white">
                ค้นพบแล้วรวม {totalFoundAllLevels} จาก {totalDifferencesAll} จุดทั่วทุกด่าน (+{totalFoundAllLevels * 10} แต้ม)
              </div>
            </div>
            <div className="w-full sm:w-48 bg-[#f5f5f7] dark:bg-[#2c2c2e] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0071e3] h-full transition-all duration-500 rounded-full"
                style={{ width: `${(totalFoundAllLevels / totalDifferencesAll) * 100}%` }}
              />
            </div>
          </div>

        </div>
      )}

      {/* MODE 2: FAMILY SORT (COLOR WATER SORT PUZZLE) */}
      {activeMode === 'sort' && (
        <div className="animate-in fade-in duration-300">
          <FamilySortGame
            participant={participant}
            onAddScore={onAddScore}
          />
        </div>
      )}

    </div>
  );
}
