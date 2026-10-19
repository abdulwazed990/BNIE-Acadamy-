import { useState, useMemo } from "react";
import { 
  Search, BookOpen, GraduationCap, Clock, Award, ArrowRight, ArrowLeft, 
  ChevronRight, CheckCircle2, ShieldCheck, Wrench, Cpu, Zap, Building2, Laptop 
} from "lucide-react";
import { motion } from "motion/react";

interface FindProgramPageProps {
  onBackToHome: () => void;
  onNavigateToAdmission: (programCode?: string) => void;
  onNavigateToVerify: () => void;
}

export default function FindProgramPage({
  onBackToHome,
  onNavigateToAdmission,
  onNavigateToVerify
}: FindProgramPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const programs = [
    {
      id: "mech_4y",
      code: "DIP-MECH-4Y",
      name: "Diploma in Mechanical Engineering",
      nameBn: "ডিপ্লোমা ইন মেকানিক্যাল ইঞ্জিনিয়ারিং",
      level: "diploma_4y",
      levelName: "4-Year Diploma in Engineering",
      duration: "4 Years (8 Semesters)",
      resultSystem: "CGPA (Scale 4.00)",
      totalSubjects: "23 Mandatory Subjects (Year 1: 6, Year 2: 6, Year 3: 6, Year 4: 5)",
      description: "Comprehensive 4-year technical program covering Machine Design, Thermodynamics, Fluid Mechanics, Strength of Materials, Power Plants, and 6-month Industrial Attachment.",
      eligibility: "Minimum SSC / Dakhil / Equivalent pass with Mathematics/Science.",
      highlights: [
        "23 permanent curriculum subjects directly linked to Student ID & QR Verification",
        "Result System: CGPA on 4.00 scale (never GPA 5.00)",
        "Fully accredited under Government Gazette & Ministry norms"
      ],
      icon: Wrench,
      badgeColor: "bg-emerald-50 text-[#006a4e] border-emerald-200"
    },
    {
      id: "elec_4y",
      code: "DIP-ELEC-4Y",
      name: "Diploma in Electrical Engineering",
      nameBn: "ডিপ্লোমা ইন ইলেকট্রিক্যাল ইঞ্জিনিয়ারিং",
      level: "diploma_4y",
      levelName: "4-Year Diploma in Engineering",
      duration: "4 Years (8 Semesters)",
      resultSystem: "CGPA (Scale 4.00)",
      totalSubjects: "Core Electrical Circuits, Power Systems & Machine Labs",
      description: "Focuses on AC/DC machines, transmission, distribution, high voltage engineering, and industrial power automation.",
      eligibility: "Minimum SSC / Dakhil / Equivalent pass.",
      highlights: ["Grid substation practice", "PLC automation", "Industrial attachment"],
      icon: Zap,
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      id: "electr_4y",
      code: "DIP-ELECTR-4Y",
      name: "Diploma in Electronics Technology",
      nameBn: "ডিপ্লোমা ইন ইলেকট্রনিক্স টেকনোলজি",
      level: "diploma_4y",
      levelName: "4-Year Diploma in Engineering",
      duration: "4 Years (8 Semesters)",
      resultSystem: "CGPA (Scale 4.00)",
      totalSubjects: "Semiconductors, Microprocessors & Telecommunications",
      description: "Advanced embedded electronics, digital signal processing, instrumentation, and wireless communication.",
      eligibility: "Minimum SSC / Dakhil / Equivalent pass.",
      highlights: ["Microcontroller programming", "PCB design", "Biomedical equipment basics"],
      icon: Cpu,
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200"
    },
    {
      id: "civil_4y",
      code: "DIP-CIVIL-4Y",
      name: "Diploma in Civil Engineering",
      nameBn: "ডিপ্লোমা ইন সিভিল ইঞ্জিনিয়ারিং",
      level: "diploma_4y",
      levelName: "4-Year Diploma in Engineering",
      duration: "4 Years (8 Semesters)",
      resultSystem: "CGPA (Scale 4.00)",
      totalSubjects: "Structural Analysis, Surveying, RCC Design & Geotechnics",
      description: "Modern surveying with Total Station & GPS, concrete technology, transportation, estimating, and site management.",
      eligibility: "Minimum SSC / Dakhil / Equivalent pass.",
      highlights: ["Total Station practicals", "AutoCAD Civil drafting", "Material quality testing"],
      icon: Building2,
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200"
    },
    {
      id: "comp_4y",
      code: "DIP-COMP-4Y",
      name: "Diploma in Computer Technology",
      nameBn: "ডিপ্লোমা ইন কম্পিউটার টেকনোলজি",
      level: "diploma_4y",
      levelName: "4-Year Diploma in Engineering",
      duration: "4 Years (8 Semesters)",
      resultSystem: "CGPA (Scale 4.00)",
      totalSubjects: "Software Engineering, Networking, Database & Cyber Security",
      description: "Practical curriculum encompassing full-stack web architectures, Python/C++, network routing, and server administration.",
      eligibility: "Minimum SSC / Dakhil / Equivalent pass.",
      highlights: ["Hands-on Cisco networking", "Database architecture", "Cloud systems"],
      icon: Laptop,
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200"
    },
    {
      id: "acm_2y",
      code: "DIP-ACM-2Y",
      name: "Diploma in Air Condition & Maintenance",
      nameBn: "ডিপ্লোমা ইন এয়ার কন্ডিশন অ্যান্ড মেইনটেন্যান্স",
      level: "diploma_short",
      levelName: "Specialized Diploma",
      duration: "1 to 2 Years",
      resultSystem: "CGPA (Scale 4.00)",
      totalSubjects: "Refrigeration Systems, Chiller Plants & HVAC Servicing",
      description: "Hands-on diagnostic training for commercial chillers, central air conditioning plants, and cold storages.",
      eligibility: "Minimum SSC / Dakhil / Equivalent pass.",
      highlights: ["Industrial chiller servicing", "Inverter diagnostics", "HVAC duct layout"],
      icon: Wrench,
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200"
    },
    {
      id: "ssc_voc",
      code: "SSC-VOC",
      name: "Secondary School Certificate (SSC) Vocational",
      nameBn: "এসএসসি ভোকেশনাল শিক্ষাক্রম",
      level: "vocational",
      levelName: "Vocational Secondary",
      duration: "2 Years",
      resultSystem: "GPA (Scale 5.00)",
      totalSubjects: "General Core Subjects + Trade Practical & Theory",
      description: "Dual track secondary education offering National Skill Standards combined with formal SSC certificate.",
      eligibility: "Class 8 / JSC / JDC / Equivalent pass.",
      highlights: ["Trade certificate + SSC certificate", "Practical workshop hours", "National skill standard"],
      icon: Award,
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200"
    },
    {
      id: "hsc_voc",
      code: "HSC-VOC",
      name: "Higher Secondary Certificate (HSC) Vocational",
      nameBn: "এইচএসসি ভোকেশনাল ও টেকনিক্যাল",
      level: "vocational",
      levelName: "Vocational Higher Secondary",
      duration: "2 Years",
      resultSystem: "GPA (Scale 5.00)",
      totalSubjects: "Physics, Chemistry, Math/Comp + Specialized Trade",
      description: "Equips students with direct higher technical eligibility for B.Sc. Engineering and university admissions.",
      eligibility: "SSC / SSC Vocational / Dakhil pass.",
      highlights: ["Direct pathway to Engineering universities", "Advanced trade expertise", "Board examinations"],
      icon: Award,
      badgeColor: "bg-pink-50 text-pink-700 border-pink-200"
    },
    // ==================== 4-YEAR HONOURS PROGRAMS ====================
    {
      id: "cse_hon",
      code: "CSE-HON",
      name: "B.Sc. (Honours) in Computer Science & Engineering",
      nameBn: "বি.এসসি (সম্মান/অনার্স) কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং",
      level: "honours",
      levelName: "৪ বছর মেয়াদী অনার্স (Honours)",
      duration: "4 Years (8 Semesters)",
      resultSystem: "CGPA (Scale 4.00)",
      totalSubjects: "১৬০ ক্রেডিট • সফটওয়্যার, এআই, মেশিন লার্নিং, ডাটাবেস ও ফাইনাল থিসিস",
      description: "আন্তর্জাতিক মানের ৪ বছর মেয়াদী কম্পিউটার সায়েন্স ও সফটওয়্যার ইঞ্জিনিয়ারিং কারিকুলাম। আর্টিফিশিয়াল ইন্টেলিজেন্স, ক্লাউড কম্পিউটিং এবং ইন্ডাস্ট্রিয়াল প্রজেক্ট অন্তর্ভুক্ত।",
      eligibility: "এইচএসসি / আলিম / ডিপ্লোমা ইন ইঞ্জিনিয়ারিং পাস (গণিত/বিজ্ঞান সহ)।",
      highlights: ["৮টি সেমিস্টারভিত্তিক মূল্যায়ন", "সেমিস্টার CGPA ৪.০০ স্কেল", "ক্যাপস্টোন প্রজেক্ট ও ইন্টার্নশিপ"],
      icon: Laptop,
      badgeColor: "bg-emerald-50 text-[#006a4e] border-emerald-200"
    },
    {
      id: "bba_hon",
      code: "BBA-HON",
      name: "Bachelor of Business Administration (BBA Honours)",
      nameBn: "ব্যাচেলর অব বিজনেস অ্যাডমিনিস্ট্রেশন (বিবিএ অনার্স)",
      level: "honours",
      levelName: "৪ বছর মেয়াদী অনার্স (Honours)",
      duration: "4 Years (8 Semesters)",
      resultSystem: "CGPA (Scale 4.00)",
      totalSubjects: "১২৬ ক্রেডিট • ফাইন্যান্স, ব্যাংকিং, একাউন্টিং, ম্যানেজমেন্ট ও মার্কেটিং",
      description: "কর্পোরেট ব্যবসা পরিচালনা, ফাইন্যান্সিয়াল অ্যানালিটিক্স, ইনভেস্টমেন্ট ব্যাংকিং ও সাপ্লাই চেইন ম্যানেজমেন্টের আধুনিক ব্যাচেলর প্রোগ্রাম।",
      eligibility: "এইচএসসি / আলিম / সমমান পাস (যেকোনো বিভাগ)।",
      highlights: ["কর্পোরেট ইন্টার্নশিপ", "কেস স্টাডি ও বিজনেস সিমুলেশন", "৮ সেমিস্টার ট্রান্সক্রিপ্ট"],
      icon: Award,
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      id: "eng_hon",
      code: "ENG-HON",
      name: "B.A. (Honours) in English Language & Literature",
      nameBn: "বি.এ (সম্মান/অনার্স) ইংরেজি ভাষা ও সাহিত্য",
      level: "honours",
      levelName: "৪ বছর মেয়াদী অনার্স (Honours)",
      duration: "4 Years (8 Semesters)",
      resultSystem: "CGPA (Scale 4.00)",
      totalSubjects: "১২০ ক্রেডিট • ক্লাসিক্যাল ও মডার্ন লিটারেচার, লিঙ্গুইস্টিকস ও ক্রিয়েটিভ রাইটিং",
      description: "ইংরেজি সাহিত্য, তুলনামূলক সাহিত্যতত্ত্ব, প্রয়োগভিত্তিক ভাষাতত্ত্ব ও আন্তর্জাতিক যোগাযোগ দক্ষতার চার বছর মেয়াদী সম্মান ডিগ্রি।",
      eligibility: "এইচএসসি / আলিম / সমমান পাস।",
      highlights: ["গবেষণামূলক সন্দর্ভ", "লিঙ্গুইস্টিকস ল্যাব", "আন্তর্জাতিক কর্মসংস্থান উপযোগী"],
      icon: BookOpen,
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200"
    },
    {
      id: "econ_hon",
      code: "ECON-HON",
      name: "B.S.S. (Honours) in Economics",
      nameBn: "বি.এস.এস (সম্মান/অনার্স) অর্থনীতি",
      level: "honours",
      levelName: "৪ বছর মেয়াদী অনার্স (Honours)",
      duration: "4 Years (8 Semesters)",
      resultSystem: "CGPA (Scale 4.00)",
      totalSubjects: "১২০ ক্রেডিট • মাইক্রো, ম্যাক্রো, ইকোনোমেট্রিক্স, ব্যাংকিং ও পলিসি",
      description: "উন্নয়ন অর্থনীতি, সরকারি পলিসি বিশ্লেষণ, আন্তর্জাতিক অর্থসংস্থান ও ব্যাংকিং খাতের উপযোগী তাত্ত্বিক ও ব্যবহারিক উচ্চশিক্ষা।",
      eligibility: "এইচএসসি / আলিম / সমমান পাস।",
      highlights: ["ডাটা অ্যানালিটিক্স ও এসটিএটিএ", "পলিসি রিসার্চ পেপার", "বিসিএস ও ব্যাংকিং প্রস্তুতি"],
      icon: Award,
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200"
    },
    // ==================== 3-YEAR DEGREE PASS PROGRAMS ====================
    {
      id: "ba_pass",
      code: "BA-PASS",
      name: "Bachelor of Arts (B.A. Pass)",
      nameBn: "স্নাতক (পাস) বি.এ",
      level: "degree_pass",
      levelName: "৩ বছর মেয়াদী ডিগ্রি পাস (Degree Pass)",
      duration: "3 Years (Annual Year 1, 2, 3)",
      resultSystem: "CGPA (Scale 4.00)",
      totalSubjects: "৯টি মূল পত্র (প্রতি শিক্ষাবর্ষে ৩টি পত্র) • বাংলা, ইংরেজি ও ইতিহাস",
      description: "জাতীয় পাঠ্যক্রম অনুসারী ৩ বছর মেয়াদী ডিগ্রি পাস কোর্স। প্রতি শিক্ষাবর্ষ শেষে আলাদা বার্ষিক পরীক্ষা ও ফলাফল প্রকাশ।",
      eligibility: "এইচএসসি / আলিম / ডিপ্লোমা পাস।",
      highlights: ["১ম, ২য় ও ৩য় বর্ষভিত্তিক আলাদা রেজাল্ট", "সিজিপিএ ৪.০০ স্কেল", "সরকারি চাকরির আবেদনযোগ্য"],
      icon: BookOpen,
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200"
    },
    {
      id: "bss_pass",
      code: "BSS-PASS",
      name: "Bachelor of Social Science (B.S.S. Pass)",
      nameBn: "স্নাতক (পাস) বি.এস.এস সামাজিক বিজ্ঞান",
      level: "degree_pass",
      levelName: "৩ বছর মেয়াদী ডিগ্রি পাস (Degree Pass)",
      duration: "3 Years (Annual Year 1, 2, 3)",
      resultSystem: "CGPA (Scale 4.00)",
      totalSubjects: "৯টি পত্র • রাষ্ট্রবিজ্ঞান, অর্থনীতি, সমাজবিজ্ঞান ও সমাজকর্ম",
      description: "সামাজিক গবেষণা, জনকল্যাণ, রাষ্ট্রীয় শাসনব্যবস্থা ও প্রশাসনিক রূপরেখার ৩ বছর মেয়াদী স্নাতক পাঠ্যক্রম।",
      eligibility: "এইচএসসি / আলিম / সমমান পাস।",
      highlights: ["বার্ষিক পরীক্ষা মূল্যায়ন", "৩য় বর্ষে পূর্ণাঙ্গ কমপ্রিহেনসিভ রেজাল্ট", "সরকারি স্বীকৃতি"],
      icon: Award,
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200"
    },
    {
      id: "bsc_pass",
      code: "BSC-PASS",
      name: "Bachelor of Science (B.Sc. Pass)",
      nameBn: "স্নাতক (পাস) বি.এসসি সাধারণ বিজ্ঞান",
      level: "degree_pass",
      levelName: "৩ বছর মেয়াদী ডিগ্রি পাস (Degree Pass)",
      duration: "3 Years (Annual Year 1, 2, 3)",
      resultSystem: "CGPA (Scale 4.00)",
      totalSubjects: "পদার্থ, রসায়ন, গণিত, কম্পিউটার সায়েন্স ও ব্যবহারিক ল্যাব",
      description: "বিজ্ঞান অনুষদের ৩ বছর মেয়াদী সাধারণ ডিগ্রি প্রোগ্রাম। বিজ্ঞান গবেষণা ও শিক্ষকতা পেশায় অত্যন্ত কার্যকর।",
      eligibility: "এইচএসসি / আলিম বিজ্ঞান পাস।",
      highlights: ["ব্যবহারিক ল্যাব পরীক্ষা", "বার্ষিক অগ্রগতি রিপোর্ট", "সিজিপিএ ৪.০০ স্কেল"],
      icon: Award,
      badgeColor: "bg-sky-50 text-sky-800 border-sky-200"
    },
    // ==================== MASTERS PROGRAMS ====================
    {
      id: "mba_gen",
      code: "MBA-GEN",
      name: "Master of Business Administration (M.B.A.)",
      nameBn: "মাস্টার অব বিজনেস অ্যাডমিনিস্ট্রেশন (এমবিএ)",
      level: "masters",
      levelName: "স্নাতকোত্তর মাস্টার্স (Masters)",
      duration: "1 to 2 Years (4 Semesters)",
      resultSystem: "CGPA (Scale 4.00)",
      totalSubjects: "৬০ ক্রেডিট • অ্যাডভান্সড ম্যানেজমেন্ট, স্ট্র্যাটেজিক লিডারশিপ ও থিসিস",
      description: "কর্পোরেট কর্মকর্তা, ব্যাংকার ও নির্বাহীদের জন্য ১-২ বছর মেয়াদী প্রফেশনাল ও রেগুলার এমবিএ ডিগ্রি।",
      eligibility: "স্নাতক ডিগ্রি (পাস) অথবা ৪ বছর মেয়াদী অনার্স পাস।",
      highlights: ["উচ্চতর গবেষণা ও থিসিস ডিফেন্স", "সেমিস্টারভিত্তিক সিজিপিএ ৪.০০", "জাতীয় ও আন্তর্জাতিক মানসম্পন্ন"],
      icon: Award,
      badgeColor: "bg-rose-50 text-rose-800 border-rose-200"
    },
    {
      id: "mcse_adv",
      code: "MCSE-ADV",
      name: "M.Sc. in Computer Science & Engineering",
      nameBn: "এম.এসসি ইন কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং",
      level: "masters",
      levelName: "স্নাতকোত্তর মাস্টার্স (Masters)",
      duration: "1.5 to 2 Years (4 Semesters)",
      resultSystem: "CGPA (Scale 4.00)",
      totalSubjects: "৪৮ ক্রেডিট • এআই রিসার্চ, ক্লাউড আর্কিটেকচার, সাইবার সিকিউরিটি ও থিসিস",
      description: "উন্নত প্রযুক্তি, কৃত্রিম বুদ্ধিমত্তা ও সফটওয়্যার প্রকৌশল গবেষণার পোস্টগ্রাজুয়েট মাস্টার্স ডিগ্রি।",
      eligibility: "বি.এসসি ইন সিএসই / সিভিল / ইলেকট্রিক্যাল অথবা সমমান ডিগ্রি পাস।",
      highlights: ["গবেষণাপত্র প্রকাশনা", "উন্নত ল্যাবরেটরি রিসার্চ", "সেমিস্টার মূল্যায়ন"],
      icon: Laptop,
      badgeColor: "bg-emerald-50 text-[#006a4e] border-emerald-200"
    }
  ];

  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      const matchLevel = selectedLevel === "all" || p.level === selectedLevel;
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchLevel && matchSearch;
    });
  }, [programs, searchQuery, selectedLevel]);

  return (
    <div className="min-h-screen bg-gray-50/70 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Home Portal (মূল পাতায় ফিরুন)</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span>Home</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span>Academic Programs</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#006a4e] font-bold">Find Program</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-[#006a4e] rounded-full text-xs font-bold border border-emerald-200/80">
              <Search className="w-3.5 h-3.5" />
              <span>Academic Program Directory (প্রোগ্রাম অনুসন্ধান ও বিবরণ)</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Find Academic &amp; Technical Programs
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউটের (BNIE) ৪-বছর মেয়াদী স্নাতক (সম্মান/অনার্স), ৩-বছর মেয়াদী ডিগ্রি (পাস), স্নাতকোত্তর (মাস্টার্স), ৪-বছর ডিপ্লোমা ইন ইঞ্জিনিয়ারিং এবং কারিগরি ভোকেশনাল কোর্সের পূর্ণাঙ্গ পাঠ্যক্রম ও বিবরণ।
            </p>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="প্রোগ্রামের নাম, ডিগ্রি বা কোড দিয়ে খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e] transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {[
                { id: "all", name: "সকল প্রোগ্রাম (All)" },
                { id: "honours", name: "অনার্স (Honours 4Y)" },
                { id: "degree_pass", name: "ডিগ্রি পাস (Degree 3Y)" },
                { id: "masters", name: "মাস্টার্স (Masters)" },
                { id: "diploma_4y", name: "ডিপ্লোমা (Diploma 4Y)" },
                { id: "vocational", name: "ভোকেশনাল (Vocational)" }
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setSelectedLevel(lvl.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    selectedLevel === lvl.id
                      ? "bg-[#006a4e] text-white shadow-2xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {lvl.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPrograms.map((prog) => {
            const Icon = prog.icon;
            return (
              <motion.div
                key={prog.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-200/90 hover:border-[#006a4e]/40 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#006a4e] flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${prog.badgeColor}`}>
                          {prog.code}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 font-sans leading-tight mt-1">
                          {prog.name}
                        </h3>
                        <h4 className="text-xs text-gray-600 font-medium">
                          {prog.nameBn}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {prog.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                    <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">Duration</span>
                      <span className="font-semibold text-gray-800">{prog.duration}</span>
                    </div>
                    <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 block uppercase">Grading Scale</span>
                      <span className="font-semibold text-gray-800">{prog.resultSystem}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs text-gray-700 space-y-1.5">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#006a4e]" />
                      <span>Curriculum &amp; Verification Highlights:</span>
                    </div>
                    <ul className="space-y-1 pl-4 list-disc text-gray-600 text-[11px]">
                      {prog.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-gray-100 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onNavigateToAdmission(prog.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#006a4e] hover:bg-[#005a42] text-white rounded-xl text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
                  >
                    <span>Apply Online (ভর্তি আবেদন)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={onNavigateToVerify}
                    className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Verify Results
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
