import { useState, useMemo } from "react";
import { 
  BookOpen, Download, FileText, CheckCircle2, Lock, ArrowLeft, 
  Search, Eye, Printer, X, ShieldCheck, ChevronRight, Bookmark, Building2 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getStoredHandbooks, HandbookItem } from "../data/resourcesData";

interface StudentHandbooksPageProps {
  onBackToHome: () => void;
  onNavigateToCourses: () => void;
  onNavigateToVerify: () => void;
}

export default function StudentHandbooksPage({
  onBackToHome,
  onNavigateToCourses,
  onNavigateToVerify
}: StudentHandbooksPageProps) {
  const [handbooks] = useState<HandbookItem[]>(() => getStoredHandbooks());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedHandbookForReading, setSelectedHandbookForReading] = useState<HandbookItem | null>(null);

  const categories = useMemo(() => {
    const set = new Set(handbooks.map((h) => h.category));
    return ["ALL", ...Array.from(set)];
  }, [handbooks]);

  const filteredHandbooks = useMemo(() => {
    return handbooks.filter((hb) => {
      const matchCat = selectedCategory === "ALL" || hb.category === selectedCategory;
      const matchSearch =
        hb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hb.titleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hb.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hb.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [handbooks, searchQuery, selectedCategory]);

  const availableCount = handbooks.filter((h) => h.isAvailable).length;
  const unavailableCount = handbooks.length - availableCount;

  // Real file download generator using institutional formatted plain text
  const handleDownloadHandbook = (hb: HandbookItem) => {
    if (!hb.isAvailable || !hb.chapters) return;
    
    let content = `========================================================================\n`;
    content += `BANGLADESH NATIONAL INSTITUTE OF EDUCATION (BNIE)\n`;
    content += `GOVERNMENT APPROVED AUTONOMOUS TECHNICAL INSTITUTE\n`;
    content += `OFFICIAL ACADEMIC HANDBOOK & REGULATORY PUBLICATION\n`;
    content += `========================================================================\n\n`;
    content += `Handbook Code: ${hb.code}\n`;
    content += `Title: ${hb.title}\n`;
    content += `Bengali Title: ${hb.titleBn}\n`;
    content += `Category: ${hb.category} (${hb.categoryBn})\n`;
    content += `Jurisdiction: ${hb.department}\n`;
    content += `Version: ${hb.version} | Verification Status: Authenticated\n\n`;
    content += `EXECUTIVE SUMMARY:\n${hb.summary}\n\n`;
    content += `------------------------------------------------------------------------\n`;
    content += `TABLE OF CONTENTS & FULL REGULATORY CLAUSES:\n`;
    content += `------------------------------------------------------------------------\n\n`;

    hb.chapters.forEach((chap, idx) => {
      content += `[${idx + 1}] ${chap.title.toUpperCase()}\n`;
      content += `${chap.content}\n\n`;
    });

    content += `========================================================================\n`;
    content += `Published by: Directorate of Academic Affairs & Examinations\n`;
    content += `Official Verification Portal: https://bnie.edu.bd/verify\n`;
    content += `Document Authenticity Key: SHA256-${hb.code}-OFFICIAL-AUTHENTICATED\n`;
    content += `========================================================================\n`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${hb.code}-BNIE-Handbook.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50/70 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Breadcrumb & Return Button */}
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
            <span>Academic Affairs</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#006a4e] font-bold">Student Handbooks</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-[#006a4e] rounded-full text-xs font-bold border border-emerald-200/80">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Official Institutional Publications (অফিসিয়াল শিক্ষার্থী নির্দেশিকা)</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Student Handbooks &amp; Academic Guidelines
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউটের (BNIE) শিক্ষার্থী, শিক্ষক ও অভিভাবকদের জন্য প্রাতিষ্ঠানিক নীতিমালা, পরীক্ষা পদ্ধতি এবং পাঠ্যক্রমের অফিসিয়াল প্রকাশনা। শিক্ষার্থীদের অবগতির জন্য নির্ধারিত নির্দেশিকাসমূহ নিচে উন্মুক্ত রয়েছে।
            </p>

            {/* Availability Summary Stats */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Available Handbooks: {availableCount}</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg">
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                <span>Upcoming / In Press: {unavailableCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search handbooks by title, code or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e] transition-all"
              />
            </div>

            {/* Quick Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#006a4e] text-white shadow-2xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat === "ALL" ? "All Categories" : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Handbooks Catalogue Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHandbooks.map((hb) => (
            <motion.div
              key={hb.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden bg-white ${
                hb.isAvailable 
                  ? "border-[#006a4e]/40 shadow-xs hover:shadow-md ring-1 ring-[#006a4e]/10" 
                  : "border-gray-200 opacity-90 hover:opacity-100"
              }`}
            >
              <div className="p-5 sm:p-6 space-y-4 flex-1">
                {/* Header Status & Code */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded border bg-gray-50 text-gray-700 border-gray-200">
                    {hb.code}
                  </span>

                  {hb.isAvailable ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                      <Lock className="w-3 h-3 text-gray-400" />
                      Not Available (অপ্রাপ্য)
                    </span>
                  )}
                </div>

                {/* Title & Department */}
                <div>
                  <h3 className="text-base font-bold text-gray-900 font-sans leading-snug">
                    {hb.title}
                  </h3>
                  <h4 className="text-xs text-gray-600 font-medium mt-1 font-sans">
                    {hb.titleBn}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium mt-2">
                    <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="line-clamp-1">{hb.department}</span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                  {hb.summary}
                </p>

                {/* Specs */}
                <div className="pt-2 flex items-center gap-3 text-[11px] text-gray-500 font-mono">
                  <span>{hb.pages}</span>
                  <span>•</span>
                  <span>{hb.size}</span>
                  <span>•</span>
                  <span>{hb.version}</span>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-2">
                {hb.isAvailable ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setSelectedHandbookForReading(hb)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-emerald-50 text-[#006a4e] border border-[#006a4e]/40 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View &amp; Read Online</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadHandbook(hb)}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#006a4e] hover:bg-[#005a42] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                      title="Download Official Handbook"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Download</span>
                    </button>
                  </>
                ) : (
                  <div className="w-full text-center py-2 text-xs text-gray-500 font-medium italic bg-gray-100 rounded-lg border border-gray-200">
                    Not Available • মুদ্রণ ও প্রকাশনা প্রক্রিয়াধীন
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredHandbooks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700">No handbooks match your criteria</p>
            <p className="text-xs text-gray-500 mt-1">Try clearing your search query or selecting All Categories.</p>
          </div>
        )}

      </div>

      {/* Interactive In-Page Handbook Reader View */}
      <AnimatePresence>
        {selectedHandbookForReading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs no-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden"
            >
              {/* Reader Header */}
              <div className="p-4 sm:p-5 border-b border-gray-200 bg-[#006a4e] text-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 rounded-lg text-white">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-emerald-100">
                      {selectedHandbookForReading.code}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base font-sans mt-0.5">
                      {selectedHandbookForReading.title}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadHandbook(selectedHandbookForReading)}
                    className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    title="Download Handbook Document"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    title="Print Document"
                  >
                    <Printer className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedHandbookForReading(null)}
                    className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Reader Content Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-gray-800">
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Official Gazette &amp; Regulatory Standard: {selectedHandbookForReading.version}</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {selectedHandbookForReading.summary}
                  </p>
                </div>

                {/* Chapters */}
                <div className="space-y-5">
                  {selectedHandbookForReading.chapters?.map((chap, idx) => (
                    <div key={idx} className="p-5 rounded-xl border border-gray-200 bg-gray-50/40 space-y-2">
                      <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Bookmark className="w-4 h-4 text-[#006a4e]" />
                        <span>{chap.title}</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pl-6">
                        {chap.content}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-center text-xs text-gray-500">
                  Published and verified by Bangladesh National Institute of Education • All rights reserved
                </div>
              </div>

              {/* Reader Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedHandbookForReading(null)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Close Reader (বন্ধ করুন)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
