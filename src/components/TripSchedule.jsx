import React, { useState } from 'react';
import itineraryMapImg from '../assets/itinerary_map.jpg';
import itineraryDetailsImg from '../assets/itinerary_details.jpg';
import {
  RouteIcon,
  ClockIcon,
  MapPinIcon,
  ZoomInIcon,
  FileTextIcon,
  BusIcon,
  UtensilsIcon,
  TrophyIcon,
  SparklesIcon,
  CheckCircleIcon,
  ChevronRightIcon,
} from './ui/Icons';

export default function TripSchedule({ onNavigateTab }) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [activeModalImg, setActiveModalImg] = useState(null);

  const day1Events = [
    {
      time: '06:00 น.',
      title: 'พร้อมกัน ณ จุดรวมพล',
      location: 'บริษัท คอนิกซ์ (ไทยแลนด์) จำกัด',
      category: 'bus',
      tag: 'จุดเริ่มต้น',
      tagColor: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20',
      desc: 'รถบัสและรถพยาบาลเข้าประจำจุดเตรียมความพร้อมก่อนออกเดินทาง',
    },
    {
      time: '07:00 น.',
      title: 'ตรวจเช็คสภาพรถ & แอลกอฮอล์พนักงานขับรถ',
      location: 'จุดตรวจรถประจำทาง',
      category: 'check',
      tag: 'มาตรฐานความปลอดภัย',
      tagColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
      desc: 'เจ้าหน้าที่ตรวจสภาพรถ เป่าแอลกอฮอล์พนักงานขับรถทุกคัน และตรวจสอบความเรียบร้อยบนรถ',
    },
    {
      time: '07:00 – 08:00 น.',
      title: 'สแกน QR Code เช็คชื่อ / รับอาหารเช้า',
      location: 'จุดลงทะเบียนด้านหน้า',
      category: 'food',
      tag: 'สแกน QR ประจำตัว',
      tagColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
      desc: 'พนักงานแสดงบัตรดิจิทัล QR Pass ในสมาร์ทโฟน เพื่อให้ทีมงานสแกนเช็คชื่อและรับอาหารเช้า',
      actionLabel: 'เปิดบัตรดิจิทัลสแกน',
      actionTab: 'pass',
    },
    {
      time: '08:00 – 09:00 น.',
      title: 'ออกเดินทางจาก KoniX มุ่งสู่นครนายก',
      location: 'บนรถบัสประจำคัน (ขึ้นรถคันตนเองเท่านั้น)',
      category: 'bus',
      tag: 'แจกสายริสแบนด์',
      tagColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
      desc: 'ทีมงาน Staff ประจำรถแนะนำตัว ดูแลตลอดทริป 2 วัน 1 คืน และแจกสายริสแบนด์ประจำทีมสี',
    },
    {
      time: '09:00 – 09:30 น.',
      title: 'แวะจุดพักรถ ปตท. (PTT)',
      location: 'สถานีบริการน้ำมัน ปตท. ระหว่างเส้นทาง',
      category: 'pin',
      tag: 'พักรถ 30 นาที',
      tagColor: 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border-zinc-500/20',
      desc: 'แวะพักรถ เข้าห้องน้ำ และซื้อเครื่องดื่มหรือของว่างตามอัธยาศัย',
    },
    {
      time: '10:30 – 11:30 น.',
      title: 'รับประทานอาหารกลางวัน',
      location: 'ร้านครัวสาริกา นครนายก',
      category: 'food',
      tag: 'อาหาร 5 อย่าง (8 ท่าน/โต๊ะ)',
      tagColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
      desc: 'รับประทานอาหารกลางวันเซ็ต 5 อย่างพร้อมข้าวสวย (จัดที่นั่ง 8 ท่านต่อโต๊ะ)',
    },
    {
      time: '11:50 – 12:30 น.',
      title: 'เดินทางถึงที่พัก โรงแรมสีดา รีสอร์ท',
      location: 'โรงแรมสีดา รีสอร์ท นครนายก',
      category: 'pin',
      tag: 'ต้อนรับคณะเดินทาง',
      tagColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
      desc: 'เดินทางถึงที่พักและรับการต้อนรับจากเจ้าหน้าที่โรงแรมสีดา รีสอร์ท',
    },
    {
      time: '12:30 – 15:00 น.',
      title: 'กิจกรรม Team Building ประจำปี',
      location: 'ห้องประชุม / ลานกิจกรรม โรงแรมสีดา',
      category: 'trophy',
      tag: 'ภารกิจข้ามสายงาน',
      tagColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
      desc: 'กิจกรรมหัวข้อ "ภารกิจข้ามสายงาน ขับเคลื่อน สู่เป้าหมายเดียวกัน" มอบรางวัลผู้ชนะบัตรเล่นเกมส์ในรีสอร์ท และสรุปผลการเรียนรู้ร่วมกัน',
      actionLabel: 'ดูตารางคะแนน 10 สี',
      actionTab: 'leaderboard',
    },
    {
      time: '15:00 – 18:00 น.',
      title: 'รับกุญแจเข้าที่พัก & พักผ่อนตามอัธยาศัย',
      location: 'อาคารห้องพัก โรงแรมสีดา',
      category: 'check',
      tag: 'พักผ่อน / เตรียมตัวงานเย็น',
      tagColor: 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border-zinc-500/20',
      desc: 'รับกุญแจเข้าห้องพัก พักผ่อนกับกิจกรรมภายในรีสอร์ท และเตรียมตัวสำหรับงานเลี้ยงช่วงค่ำ',
    },
    {
      time: '18:00 – 19:00 น.',
      title: 'ถ่ายรูป Photo Booth ปริ้นรูปฟรี 2 ชั่วโมง',
      location: 'บริเวณหน้าห้องจัดเลี้ยง',
      category: 'sparkle',
      tag: 'บริการปริ้นรูปฟรี 2 ชม.',
      tagColor: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20',
      desc: 'ร่วมถ่ายภาพที่ระลึกบริเวณหน้างาน พร้อมบริการปริ้นรูปถ่ายฟรี 2 ชั่วโมง',
    },
    {
      time: '19:00 – 19:30 น.',
      title: 'MC กล่าวต้อนรับ / รับประทานอาหารค่ำ / ดนตรีช่วงที่ 1',
      location: 'เวทีห้องจัดเลี้ยงหลัก',
      category: 'food',
      tag: 'เปิดงานเลี้ยงช่วงค่ำ',
      tagColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
      desc: 'พิธีกรกล่าวต้อนรับเข้าสู่งานเลี้ยง รับประทานอาหารค่ำ และรับชมดนตรีสดช่วงที่ 1',
    },
    {
      time: '19:30 – 20:00 น.',
      title: 'ประธานกล่าวเปิดงาน & ถ่ายภาพร่วมกัน',
      location: 'เวทีหลัก',
      category: 'trophy',
      tag: 'VNT จับแจก 5 รางวัล',
      tagColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
      desc: 'ประธานกล่าวเปิดงาน ถ่ายภาพที่ระลึกร่วมกัน และกิจกรรมบนเวทีโดย VNT จับแจก 5 รางวัลพิเศษ',
    },
    {
      time: '20:00 – 21:00 น.',
      title: 'การแสดงดนตรีช่วงที่ 2 & บริการของว่าง',
      location: 'ห้องจัดเลี้ยง',
      category: 'sparkle',
      tag: 'VNT แจกถั่ว & กับแกล้ม',
      tagColor: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20',
      desc: 'รับชมการแสดงดนตรีต่อเนื่อง พร้อมทีมงาน VNT บริการแจกถั่วและกับแกล้มตลอดช่วงกิจกรรม',
    },
    {
      time: '21:00 – 21:30 น.',
      title: 'จับรางวัล Lucky Draw & ประกาศผลผู้โชคดี',
      location: 'เวทีหลัก',
      category: 'trophy',
      tag: 'Lucky Draw ประจำปี',
      tagColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
      desc: 'ช่วงจับรางวัล Lucky Draw ประกาศผลบนเวที และ MC กล่าวขอบคุณผู้บริหารและคณะผู้จัดงาน',
    },
    {
      time: '21:30 – 23:00 น.',
      title: 'ดนตรีวาไรตี้ & สันทนาการช่วงดึก',
      location: 'เวทีหลัก',
      category: 'sparkle',
      tag: 'ดนตรีวาไรตี้',
      tagColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
      desc: 'สนุกสนานกับการแสดงดนตรีวาไรตี้จนถึงเวลาปิดงานเลี้ยงเวลา 23:00 น.',
    },
    {
      time: '23:00 น.',
      title: 'ปิดงานเลี้ยง & พักผ่อนตามอัธยาศัย',
      location: 'โรงแรมสีดา รีสอร์ท',
      category: 'check',
      tag: 'จบกิจกรรมวันที่ 1',
      tagColor: 'bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border-zinc-500/20',
      desc: 'จบงานเลี้ยงช่วงค่ำ เดินทางกลับห้องพักเพื่อพักผ่อนสำหรับกำหนดการวันรุ่งขึ้น',
    },
  ];

  const day2Events = [
    {
      time: '06:00 – 08:00 น.',
      title: 'รับประทานอาหารเช้า ณ ห้องอาหารรีสอร์ท',
      location: 'ห้องอาหาร โรงแรมสีดา รีสอร์ท',
      category: 'food',
      tag: 'มื้อเช้าที่พัก',
      tagColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
      desc: 'รับประทานอาหารเช้าร้อนๆ และเครื่องดื่มบำรุงร่างกาย แก้อาการอ่อนเพลีย',
    },
    {
      time: '09:30 น.',
      title: 'คืนกุญแจห้องพัก',
      location: 'จุดรับคืนกุญแจ โรงแรมสีดา',
      category: 'check',
      tag: 'คืนกุญแจห้องพัก',
      tagColor: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20',
      desc: 'ตรวจสอบสัมภาระภายในห้องพักและส่งคืนกุญแจห้องพักแก่เจ้าหน้าที่',
    },
    {
      time: '10:00 น.',
      title: 'Check-out ห้องพัก พร้อมออกเดินทาง',
      location: 'โรงแรมสีดา รีสอร์ท (กม. 0)',
      category: 'bus',
      tag: 'Departure Check-out',
      tagColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
      desc: 'เช็คเอาท์ออกจากที่พัก นำกระเป๋าสัมภาระขึ้นรถบัสประจำคันและออกเดินทาง',
    },
    {
      time: '10:10 – 11:00 น.',
      title: 'รับประทานอาหารกลางวัน ร้านครัวชายน้ำ',
      location: 'ร้านอาหารครัวชายน้ำ นครนายก',
      category: 'food',
      tag: 'อาหาร 5 อย่าง (8 ท่าน/โต๊ะ)',
      tagColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
      desc: 'รับประทานอาหารกลางวันเซ็ต 5 อย่างพร้อมข้าวสวย (จัดที่นั่ง 8 ท่านต่อโต๊ะ)',
    },
    {
      time: '11:10 – 12:00 น.',
      title: 'พักชมวิวธรรมชาติ & จิบกาแฟ',
      location: 'ร้านภูตะลึง คาเฟ่ (Viewpoint)',
      category: 'pin',
      tag: 'จุดชมวิว & คาเฟ่',
      tagColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
      desc: 'พักผ่อนชมวิวภูเขา ถ่ายภาพที่ระลึก และเลือกสั่งเครื่องดื่มหรือของว่างที่ร้านภูตะลึง คาเฟ่',
    },
    {
      time: '13:00 – 14:00 น.',
      title: 'แวะซื้อของฝากจังหวัดนครนายก',
      location: 'ร้านของฝากสราญรมย์',
      category: 'sparkle',
      tag: 'จุดแวะซื้อของฝาก',
      tagColor: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20',
      desc: 'แวะเลือกซื้อผลไม้แปรรูป ขนม และของฝากขึ้นชื่อจังหวัดนครนายกที่ร้านสราญรมย์',
    },
    {
      time: '16:00 น.',
      title: 'เดินทางถึงบริษัท คอนิกซ์ (ไทยแลนด์) จำกัด',
      location: 'บริษัท คอนิกซ์ (ไทยแลนด์) จำกัด',
      category: 'check',
      tag: 'ถึงจุดหมายโดยสวัสดิภาพ',
      tagColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      desc: 'คณะเดินทางกลับถึงบริษัท คอนิกซ์ (ไทยแลนด์) จำกัด โดยสวัสดิภาพ',
    },
  ];

  const renderCategoryIcon = (category) => {
    switch (category) {
      case 'bus':
        return <BusIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'food':
        return <UtensilsIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />;
      case 'trophy':
        return <TrophyIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />;
      case 'sparkle':
        return <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600 dark:text-sky-400" />;
      case 'check':
        return <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-600 dark:text-zinc-400" />;
    }
  };

  const currentEvents = selectedDay === 1 ? day1Events : day2Events;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-2 sm:py-6 space-y-4 sm:space-y-6">
      
      {/* 1. Header Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900 dark:bg-zinc-900 border border-zinc-800 p-4 sm:p-8 text-white shadow-lg">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <RouteIcon className="w-3.5 h-3.5" />
              <span>MEET THE JUNGLE</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold font-mono tabular-nums bg-zinc-800 text-zinc-300 border border-zinc-700">
              <ClockIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>25–26 ธ.ค. 2569 (2 วัน 1 คืน)</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight leading-tight text-zinc-50">
            กำหนดการเดินทางและตารางกิจกรรม
          </h2>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-zinc-800 text-xs sm:text-sm text-zinc-300">
            <div>
              <span className="font-bold text-white">บริษัท คอนิกซ์ (ไทยแลนด์) จำกัด</span>
              <span className="text-zinc-400 text-[11px] sm:text-xs block">
                KoniX (Thailand) Co., Ltd. • เส้นทาง: กรุงเทพฯ – โรงแรมสีดา รีสอร์ท นครนายก
              </span>
            </div>
            <div className="text-left sm:text-right text-[11px] sm:text-xs text-zinc-400">
              <span className="text-emerald-400 font-semibold">บริหารการจัดงาน:</span> บจก. วีเอ็นที ออร์แกไนเซอร์ อีเว้นท์
            </div>
          </div>
        </div>
      </div>

      {/* 2. Route Map & Official Document Preview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Infographic Map Card */}
        <button
          type="button"
          onClick={() => setActiveModalImg(itineraryMapImg)}
          className="group text-left cursor-pointer overflow-hidden rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 p-3 hover:border-emerald-500/50 transition-all duration-200 shadow-xs hover:shadow-md flex items-center gap-3.5 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative border border-zinc-200/60 dark:border-zinc-700">
            <img 
              src={itineraryMapImg} 
              alt="แผนที่เส้นทาง Meet the Jungle" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
            <div className="absolute inset-0 bg-zinc-950/35 flex items-center justify-center text-white">
              <ZoomInIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
              แผนผังเส้นทาง
            </span>
            <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">
              แผนที่จุดแวะพัก ไป–กลับ
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
              ปตท. • ครัวสาริกา • โรงแรมสีดา • ภูตะลึง • สราญรมย์
            </p>
            <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-zinc-900 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
              <span>แตะเพื่อดูภาพขยาย</span>
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </span>
          </div>
        </button>

        {/* Detailed Document Card */}
        <button
          type="button"
          onClick={() => setActiveModalImg(itineraryDetailsImg)}
          className="group text-left cursor-pointer overflow-hidden rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 p-3 hover:border-emerald-500/50 transition-all duration-200 shadow-xs hover:shadow-md flex items-center gap-3.5 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative border border-zinc-200/60 dark:border-zinc-700">
            <img 
              src={itineraryDetailsImg} 
              alt="เอกสารกำหนดการฉบับเต็ม" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
            <div className="absolute inset-0 bg-zinc-950/35 flex items-center justify-center text-white">
              <FileTextIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
              เอกสารทางการ
            </span>
            <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">
              ใบกำหนดการเดินทาง 2 วัน 1 คืน
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
              รายละเอียดเวลาและเงื่อนไขการเดินทางฉบับเต็ม
            </p>
            <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-zinc-900 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
              <span>แตะเพื่อดูเอกสารต้นฉบับ</span>
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </span>
          </div>
        </button>
      </div>

      {/* 3. Day 1 / Day 2 Segmented Controller */}
      <div className="flex items-center justify-center p-1 bg-zinc-200/70 dark:bg-zinc-900 rounded-xl max-w-md mx-auto border border-zinc-300/60 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setSelectedDay(1)}
          className={`flex-1 py-2 sm:py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer ${
            selectedDay === 1
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
            D1
          </span>
          <span>25 ธ.ค. 69 (ขาไป)</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedDay(2)}
          className={`flex-1 py-2 sm:py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer ${
            selectedDay === 2
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
            D2
          </span>
          <span>26 ธ.ค. 69 (ขากลับ)</span>
        </button>
      </div>

      {/* 4. Interactive Timeline Feed */}
      <div className="space-y-3 sm:space-y-4 relative before:absolute before:inset-0 before:left-5 sm:before:left-6 before:w-px before:bg-zinc-200 dark:before:bg-zinc-800 before:-z-0">
        {currentEvents.map((item, idx) => (
          <div 
            key={idx}
            className="relative z-10 flex items-start gap-3 sm:gap-4 group"
          >
            {/* Timeline Vector Icon Node */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-center justify-center group-hover:border-emerald-500/60 transition-colors">
              {renderCategoryIcon(item.category)}
            </div>

            {/* Event Content Card */}
            <div className="flex-1 bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/90 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-2xl p-3.5 sm:p-5 shadow-xs transition-all duration-200 min-w-0">
              
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <span className="inline-flex items-center gap-1.5 font-mono tabular-nums text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md">
                  <ClockIcon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.time}</span>
                </span>

                <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border truncate max-w-[190px] ${item.tagColor}`}>
                  {item.tag}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 mt-2 leading-snug">
                {item.title}
              </h3>

              <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1 truncate">
                <MapPinIcon className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                <span className="truncate">{item.location}</span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                {item.desc}
              </p>

              {item.actionLabel && onNavigateTab && (
                <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80">
                  <button
                    type="button"
                    onClick={() => onNavigateTab(item.actionTab)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <span>{item.actionLabel}</span>
                    <ChevronRightIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

            </div>
          </div>
        ))}
      </div>

      {/* 5. Lightbox Modal for Original Image Zoom */}
      {activeModalImg && (
        <div 
          onClick={() => setActiveModalImg(null)}
          className="fixed inset-0 z-50 bg-zinc-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 cursor-zoom-out"
        >
          <div className="relative max-w-3xl max-h-[92vh] overflow-auto rounded-2xl bg-zinc-900 p-2 border border-zinc-700 shadow-2xl">
            <button
              type="button"
              onClick={() => setActiveModalImg(null)}
              aria-label="ปิดหน้าต่างขยายภาพ"
              className="absolute top-3 right-3 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-900/90 text-white flex items-center justify-center text-sm font-bold border border-zinc-700 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              ✕
            </button>
            <img 
              src={activeModalImg} 
              alt="ภาพกำหนดการขยายใหญ่" 
              className="w-full h-auto rounded-xl object-contain max-h-[88vh]"
            />
          </div>
        </div>
      )}

    </div>
  );
}
