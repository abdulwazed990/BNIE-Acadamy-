import { Bell, FileText, Download, Calendar, ArrowLeft, ChevronRight, Pin, AlertCircle, Search } from "lucide-react";
import { useState } from "react";

interface NoticesPageProps {
  onBackToHome: () => void;
  onNavigateToVerify: () => void;
}

export default function NoticesPage({ onBackToHome, onNavigateToVerify }: NoticesPageProps) {
  const [selectedFilter, setSelectedFilter] = useState("ALL");

  const notices = [
    {
      id: "N-2024-118",
      title: "Notice regarding 4-Year Diploma in Mechanical Engineering CGPA Scale 4.00 Record Verification",
      titleBn: "৪-বছর মেয়াদী ডিপ্লোমা ইন মেকানিক্যাল ইঞ্জিনিয়ারিং সিজিপিএ ৪.০০ রেকর্ড যাচাইকরণ সংক্রান্ত জরুরি বিজ্ঞপ্তি",
      date: "October 16, 2024",
      category: "Examinations",
      isPinned: true,
      summary: "All 23 mandatory subjects of 4-Year Mechanical Engineering technology are permanently synchronized with student registration numbers. Certificates and marks sheets must be verified via the official portal."
    },
    {
      id: "N-2024-114",
      title: "Academic Session 2024–2025 Online Admission Extension for Technical & Vocational Streams",
      titleBn: "২০২৪-২০২৫ শিক্ষাবর্ষে কারিগরি ও ভোকেশনাল কোর্সে অনলাইন ভর্তি সময়সীমা বৃদ্ধি",
      date: "October 10, 2024",
      category: "Admission",
      isPinned: true,
      summary: "Online admission applications for 1st and 2nd Shift Diploma in Engineering programs will remain open until the end of this month."
    },
    {
      id: "N-2024-109",
      title: "Schedule of Practical Workshop Exams & Industrial Attachment Oral Defense",
      titleBn: "ব্যবহারিক কর্মশালা পরীক্ষা ও শিল্প সংযুক্তি (ME-405) মৌখিক পরীক্ষার সময়সূচি",
      date: "September 28, 2024",
      category: "Examinations",
      isPinned: false,
      summary: "Students of 4th Year Mechanical and Electrical technology are advised to submit their industrial training completion logbook to the department office."
    },
    {
      id: "N-2024-102",
      title: "Issuance of Digitally Encrypted Mark Sheets & QR Verification Guidelines",
      titleBn: "ডিজিটাল কিউআর কোড সম্বলিত মার্কশিট ও সনদ যাচাইকরণ নির্দেশিকা",
      date: "September 15, 2024",
      category: "Verification",
      isPinned: false,
      summary: "Employers, embassies, and academic institutions can verify candidate credentials instantly by scanning the high-resolution QR on certificate documents."
    },
    {
      id: "N-2024-098",
      title: "Central Workshop Safety Protocol and Protective Equipment Compliance",
      titleBn: "কেন্দ্রীয় ওয়ার্কশপ নিরাপত্তা ও ব্যক্তিগত সুরক্ষাসামগ্রী (PPE) পরিধান নির্দেশিকা",
      date: "August 20, 2024",
      category: "Administration",
      isPinned: false,
      summary: "Mandatory apron, safety boots, and safety goggles guidelines inside machine shop, heat engine lab, and arc welding booths."
    }
  ];

  const filtered = notices.filter(
    (n) => selectedFilter === "ALL" || n.category === selectedFilter
  );

  return (
    <div className="min-h-screen bg-gray-50/70 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
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
            <span>Notices</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#006a4e] font-bold">Central Notices Board</span>
          </div>
        </div>

        {/* Page Banner */}
        <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-[#006a4e] rounded-full text-xs font-bold border border-emerald-200/80">
              <Bell className="w-3.5 h-3.5" />
              <span>Central Notice Board (কেন্দ্রীয় নোটিশ বোর্ড ও বিজ্ঞপ্তি)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Official Academic &amp; Examination Notices
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউটের (BNIE) পরীক্ষা, ভর্তি, ক্লাস রুটিন এবং প্রশাসনিক আদেশের সর্বশেষ অফিসিয়াল নোটিশ।
            </p>
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "Examinations", "Admission", "Verification", "Administration"].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedFilter === f
                  ? "bg-[#006a4e] text-white shadow-2xs"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {f === "ALL" ? "All Notices (সকল নোটিশ)" : f}
            </button>
          ))}
        </div>

        {/* Notice List */}
        <div className="space-y-4">
          {filtered.map((notice) => (
            <div
              key={notice.id}
              className={`bg-white rounded-2xl border p-6 transition-all space-y-3 ${
                notice.isPinned
                  ? "border-emerald-300 shadow-xs bg-emerald-50/20"
                  : "border-gray-200 shadow-2xs"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {notice.isPinned && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}
                  <span className="text-[10px] font-mono font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                    {notice.id}
                  </span>
                  <span className="text-[10px] font-bold text-[#006a4e] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {notice.category}
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {notice.date}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                {notice.title}
              </h3>
              <h4 className="text-xs text-gray-600 font-medium">
                {notice.titleBn}
              </h4>

              <p className="text-xs text-gray-600 leading-relaxed">
                {notice.summary}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
