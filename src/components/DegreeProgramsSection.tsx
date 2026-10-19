import { useState } from "react";
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  FileText, 
  Landmark,
  Search,
  School
} from "lucide-react";
import { motion } from "motion/react";

interface DegreeProgramsSectionProps {
  onNavigateToDegreeVerify: () => void;
  onNavigateToAdmission: (programCode?: string) => void;
  onNavigateToFindProgram: () => void;
}

export default function DegreeProgramsSection({
  onNavigateToDegreeVerify,
  onNavigateToAdmission,
  onNavigateToFindProgram
}: DegreeProgramsSectionProps) {
  const [activeTab, setActiveTab] = useState<"honours" | "degree_pass" | "masters">("honours");

  return (
    <section className="py-14 bg-linear-to-b from-white via-emerald-50/20 to-white border-t border-gray-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 text-[#006a4e] text-xs font-bold px-3.5 py-1 rounded-full border border-emerald-200/90 uppercase tracking-wider shadow-2xs">
            <Landmark className="w-3.5 h-3.5" />
            <span>উচ্চশিক্ষা ও বিশ্ববিদ্যালয় পাঠ্যক্রম বিভাগ</span>
          </div>

          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-950 font-sans tracking-tight">
            স্নাতক ডিগ্রি (পাস), অনার্স ও মাস্টার্স প্রোগ্রাম
          </h3>
          
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-normal">
            বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউট (BNIE)-এর আওতাধীন ৩ বছর মেয়াদী ডিগ্রি (পাস), ৪ বছর মেয়াদী সম্মান (অনার্স) এবং স্নাতকোত্তর (মাস্টার্স) শিক্ষাক্রম। আধুনিক সিলেবাস, সেমিস্টারভিত্তিক মূল্যায়ন ও CGPA ৪.০০ স্কেলের পূর্ণাঙ্গ ডিজিটাল ট্রান্সক্রিপ্ট ব্যবস্থা।
          </p>
        </div>

        {/* Level Switcher Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 bg-gray-100 rounded-2xl border border-gray-200 gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("honours")}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "honours"
                  ? "bg-[#006a4e] text-white shadow-sm"
                  : "text-gray-700 hover:text-gray-950 hover:bg-gray-200/60"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>৪ বছর মেয়াদী অনার্স</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("degree_pass")}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "degree_pass"
                  ? "bg-[#006a4e] text-white shadow-sm"
                  : "text-gray-700 hover:text-gray-950 hover:bg-gray-200/60"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>৩ বছর মেয়াদী ডিগ্রি (পাস)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("masters")}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "masters"
                  ? "bg-[#006a4e] text-white shadow-sm"
                  : "text-gray-700 hover:text-gray-950 hover:bg-gray-200/60"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>স্নাতকোত্তর (মাস্টার্স)</span>
            </button>
          </div>
        </div>

        {/* TAB 1: HONOURS (৪ বছর মেয়াদী স্নাতক সম্মান) */}
        {activeTab === "honours" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Overview Card */}
            <div className="bg-white rounded-3xl border-2 border-emerald-600/30 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-gray-150">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#006a4e] border border-emerald-200 text-xs font-bold">
                    <span>৪ বছর মেয়াদী • ৮টি সেমিস্টার</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-gray-950 font-sans">
                    স্নাতক (সম্মান / অনার্স) কারিকুলাম — 4-Year Bachelor Honours
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    গ্রেডিং স্কেল: CGPA ৪.০০ • প্রতি সেমিস্টারে মিডটার্ম, ল্যাবরেটরি, প্রজেক্ট ও ফাইনাল পরীক্ষা
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={onNavigateToDegreeVerify}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#006a4e] hover:bg-[#005a42] text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>অনার্স মার্কশিট যাচাই</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateToAdmission("CSE-HON")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all border border-gray-300 cursor-pointer"
                  >
                    <span>অনলাইনে ভর্তি আবেদন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 4 Major Faculty Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                
                {/* 1. বিজ্ঞান ও প্রযুক্তি অনুষদ */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2.5">
                  <span className="text-[10px] font-mono font-bold text-[#006a4e] bg-white px-2 py-0.5 rounded border border-gray-200 block w-fit">
                    বিজ্ঞান ও প্রযুক্তি
                  </span>
                  <h5 className="font-extrabold text-sm text-gray-950 leading-snug">
                    বি.এসসি (অনার্স) সিএসই ও ইইই
                  </h5>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    সফটওয়্যার ইঞ্জিনিয়ারিং, কৃত্রিম বুদ্ধিমত্তা (AI), রোবোটিক্স, ভিএলএসআই ও আধুনিক নেটওয়ার্কিং ল্যাব।
                  </p>
                  <div className="text-[11px] font-bold text-gray-800 pt-1 border-t border-gray-200">
                    • মোট ১৬০ ক্রেডিট • ৮ সেমিস্টার
                  </div>
                </div>

                {/* 2. ব্যবসায় প্রশাসন অনুষদ */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2.5">
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-gray-200 block w-fit">
                    ব্যবসায় শিক্ষা
                  </span>
                  <h5 className="font-extrabold text-sm text-gray-950 leading-snug">
                    বিবিএ (BBA Honours)
                  </h5>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    ফিন্যান্স অ্যান্ড ব্যাংকিং, একাউন্টিং ইনফরমেশন সিস্টেম, মার্কেটিং স্ট্র্যাটেজি এবং হিউম্যান রিসোর্স ম্যানেজমেন্ট।
                  </p>
                  <div className="text-[11px] font-bold text-gray-800 pt-1 border-t border-gray-200">
                    • মোট ১২৬ ক্রেডিট • ইন্টার্নশিপ
                  </div>
                </div>

                {/* 3. কলা ও মানবিক অনুষদ */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2.5">
                  <span className="text-[10px] font-mono font-bold text-blue-800 bg-white px-2 py-0.5 rounded border border-gray-200 block w-fit">
                    কলা ও মানবিক
                  </span>
                  <h5 className="font-extrabold text-sm text-gray-950 leading-snug">
                    বি.এ (অনার্স) ইংরেজি ও বাংলা
                  </h5>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    আধুনিক ইংরেজি সাহিত্য, ভাষাতত্ত্ব, যোগাযোগ দক্ষতা, ধ্রুপদী বাংলা কবিতা, কথাসাহিত্য ও নাট্যতত্ত্ব।
                  </p>
                  <div className="text-[11px] font-bold text-gray-800 pt-1 border-t border-gray-200">
                    • মোট ১২০ ক্রেডিট • গবেষণা
                  </div>
                </div>

                {/* 4. সামাজিক বিজ্ঞান অনুষদ */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2.5">
                  <span className="text-[10px] font-mono font-bold text-purple-800 bg-white px-2 py-0.5 rounded border border-gray-200 block w-fit">
                    সামাজিক বিজ্ঞান
                  </span>
                  <h5 className="font-extrabold text-sm text-gray-950 leading-snug">
                    বি.এস.এস (অনার্স) অর্থনীতি ও রাজনীতি
                  </h5>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    ম্যাক্রো ও মাইক্রো ইকোনমিক্স, পাবলিক পলিসি, সমাজবিজ্ঞান, রাষ্ট্রচিন্তা ও আন্তর্জাতিক সম্পর্ক।
                  </p>
                  <div className="text-[11px] font-bold text-gray-800 pt-1 border-t border-gray-200">
                    • মোট ১২০ ক্রেডিট • ফিল্ডওয়ার্ক
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: DEGREE PASS (৩ বছর মেয়াদী স্নাতক পাস) */}
        {activeTab === "degree_pass" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl border-2 border-emerald-600/30 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-gray-150">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#006a4e] border border-emerald-200 text-xs font-bold">
                    <span>৩ বছর মেয়াদী • ৩টি বার্ষিক পরীক্ষা (Year 1, 2, 3)</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-gray-950 font-sans">
                    স্নাতক (ডিগ্রি পাস) কারিকুলাম — 3-Year Bachelor Degree Pass
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    গ্রেডিং স্কেল: CGPA ৪.০০ • ১ম বর্ষ, ২য় বর্ষ এবং ৩য় (চূড়ান্ত) বর্ষভিত্তিক পৃথক বার্ষিক ফলাফল ও ট্রান্সক্রিপ্ট
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={onNavigateToDegreeVerify}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#006a4e] hover:bg-[#005a42] text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>ডিগ্রি রেজাল্ট ও মার্কশিট যাচাই</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateToAdmission("BA-PASS")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all border border-gray-300 cursor-pointer"
                  >
                    <span>ডিগ্রিতে ভর্তি আবেদন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Degree Pass 4 Streams */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                
                {/* 1. B.A. Pass */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200 block w-fit">
                    BA-PASS
                  </span>
                  <h5 className="font-extrabold text-sm text-gray-950 leading-snug">
                    বি.এ পাস (Bachelor of Arts)
                  </h5>
                  <p className="text-xs text-gray-600">
                    বাংলা সাহিত্য, ইংরেজি ভাষা, বাংলাদেশের অভ্যুদয়ের ইতিহাস, দর্শন ও ইসলামিক স্টাডিজ।
                  </p>
                  <div className="text-[11px] text-[#006a4e] font-bold">৩ শিক্ষাবর্ষ • ৯টি মূল পত্র</div>
                </div>

                {/* 2. B.S.S. Pass */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200 block w-fit">
                    BSS-PASS
                  </span>
                  <h5 className="font-extrabold text-sm text-gray-950 leading-snug">
                    বি.এস.এস পাস (Bachelor of Social Science)
                  </h5>
                  <p className="text-xs text-gray-600">
                    রাষ্ট্রবিজ্ঞান, অর্থনীতি, সমাজবিজ্ঞান, সমাজকর্ম, লোকপ্রশাসন ও মাঠপর্যায়ের জরিপ।
                  </p>
                  <div className="text-[11px] text-[#006a4e] font-bold">৩ শিক্ষাবর্ষ • ৯টি মূল পত্র</div>
                </div>

                {/* 3. B.Sc. Pass */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200 block w-fit">
                    BSC-PASS
                  </span>
                  <h5 className="font-extrabold text-sm text-gray-950 leading-snug">
                    বি.এসসি পাস (Bachelor of Science)
                  </h5>
                  <p className="text-xs text-gray-600">
                    পদার্থবিজ্ঞান, রসায়নবিজ্ঞান, গণিত, উদ্ভিদবিজ্ঞান, প্রাণিবিজ্ঞান ও ব্যবহারিক ল্যাব।
                  </p>
                  <div className="text-[11px] text-[#006a4e] font-bold">৩ শিক্ষাবর্ষ • ল্যাব ও ব্যবহারিক</div>
                </div>

                {/* 4. B.B.S. Pass */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200 block w-fit">
                    BBS-PASS
                  </span>
                  <h5 className="font-extrabold text-sm text-gray-950 leading-snug">
                    বি.বি.এস পাস (Business Studies)
                  </h5>
                  <p className="text-xs text-gray-600">
                    হিসাববিজ্ঞান, ব্যবসায় পরিচিতি, ব্যবস্থাপনা, বিপণন ও ব্যবসায়িক গণিত।
                  </p>
                  <div className="text-[11px] text-[#006a4e] font-bold">৩ শিক্ষাবর্ষ • হিসাব ও বাণিজ্য</div>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: MASTERS (স্নাতকোত্তর মাস্টার্স) */}
        {activeTab === "masters" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl border-2 border-emerald-600/30 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-gray-150">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#006a4e] border border-emerald-200 text-xs font-bold">
                    <span>১ থেকে ২ বছর মেয়াদী • ৪টি সেমিস্টার</span>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-gray-950 font-sans">
                    স্নাতকোত্তর (মাস্টার্স) প্রোগ্রাম — Postgraduate Masters
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    গ্রেডিং স্কেল: CGPA ৪.০০ • উচ্চতর গবেষণা, থিসিস সন্দর্ভ, কর্পোরেট লিডারশিপ ও ভাইভা-ভয়েস
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={onNavigateToDegreeVerify}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#006a4e] hover:bg-[#005a42] text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>মাস্টার্স রেজাল্ট যাচাই</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigateToAdmission("MBA-GEN")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all border border-gray-300 cursor-pointer"
                  >
                    <span>মাস্টার্সে ভর্তি আবেদন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Masters 4 Disciplines */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                
                {/* 1. MBA */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200 block w-fit">
                    MBA-GEN
                  </span>
                  <h5 className="font-extrabold text-sm text-gray-950 leading-snug">
                    মাস্টার অব বিজনেস অ্যাডমিনিস্ট্রেশন (MBA)
                  </h5>
                  <p className="text-xs text-gray-600">
                    কর্পোরেট কৌশল, ফিন্যান্সিয়াল মডেলিং, আন্তর্জাতিক ট্রেড ও এক্সিকিউটিভ লিডারশিপ প্রজেক্ট।
                  </p>
                  <div className="text-[11px] text-[#006a4e] font-bold">৬০ ক্রেডিট • থিসিস ও ডিফেন্স</div>
                </div>

                {/* 2. M.Sc. CSE */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200 block w-fit">
                    MCSE-ADV
                  </span>
                  <h5 className="font-extrabold text-sm text-gray-950 leading-snug">
                    এম.এসসি ইন কম্পিউটার সায়েন্স (M.Sc CSE)
                  </h5>
                  <p className="text-xs text-gray-600">
                    মেশিন লার্নিং, ক্লাউড কম্পিউটিং, সাইবার ডিফেন্স, বিগ ডাটা আর্কিটেকচার ও গবেষণামূলক সন্দর্ভ।
                  </p>
                  <div className="text-[11px] text-[#006a4e] font-bold">৪৮ ক্রেডিট • গবেষণা প্রকাশনা</div>
                </div>

                {/* 3. M.A. English */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200 block w-fit">
                    MA-ENG
                  </span>
                  <h5 className="font-extrabold text-sm text-gray-950 leading-snug">
                    এম.এ ইন ইংলিশ (M.A. English)
                  </h5>
                  <p className="text-xs text-gray-600">
                    পোস্ট-কলোনিয়াল সাহিত্য, অ্যাপ্লায়েড লিঙ্গুইস্টিকস, ক্রিটিক্যাল থিওরি ও ডিসার্টেশন।
                  </p>
                  <div className="text-[11px] text-[#006a4e] font-bold">৩৬-৪৮ ক্রেডিট • ডিসার্টেশন</div>
                </div>

                {/* 4. M.S.S. Economics */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200 block w-fit">
                    MSS-ECON
                  </span>
                  <h5 className="font-extrabold text-sm text-gray-950 leading-snug">
                    এম.এস.এস ইন ইকোনমিক্স (MSS Economics)
                  </h5>
                  <p className="text-xs text-gray-600">
                    উন্নয়ন অর্থনীতি, ইকোনোমেট্রিক্স, পাবলিক ফিন্যান্স, পলিসি অ্যানালাইসিস ও জাতীয় ডাটা অ্যানালিটিক্স।
                  </p>
                  <div className="text-[11px] text-[#006a4e] font-bold">৩৬-৪৮ ক্রেডিট • পলিসি পেপার</div>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* Bottom Fast Links */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={onNavigateToFindProgram}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#006a4e] hover:text-[#005a42] hover:underline cursor-pointer"
          >
            <span>সকল ২০টি ডিগ্রি, অনার্স ও মাস্টার্স প্রোগ্রামের বিস্তারিত তালিকা ও সিলেবাস দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
