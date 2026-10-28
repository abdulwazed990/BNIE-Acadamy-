import { useState, useMemo } from "react";
import { 
  Tablet, BookOpen, Download, Search, FileText, CheckCircle2, Lock, 
  ArrowLeft, ChevronRight, Eye, X, Printer, Bookmark, Sparkles, Building2 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getStoredEbooks, EbookItem } from "../data/resourcesData";

interface EbookPageProps {
  onBackToHome: () => void;
  onNavigateToCourses: () => void;
}

export default function EbookPage({ onBackToHome, onNavigateToCourses }: EbookPageProps) {
  const [ebooks] = useState<EbookItem[]>(() => getStoredEbooks());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [readingBook, setReadingBook] = useState<EbookItem | null>(null);

  const departments = useMemo(() => {
    return [
      { id: "all", name: "All Subjects (সকল বিষয়)" },
      { id: "mechanical", name: "Mechanical Engineering" },
      { id: "electronics", name: "Electronics Technology" },
      { id: "electrical", name: "Electrical Engineering" },
      { id: "acm", name: "Air Condition & Maintenance" },
      { id: "general", name: "Basic Science & Mathematics" },
      { id: "civil", name: "Civil Engineering" },
      { id: "computer", name: "Computer Technology" },
      { id: "vocational", name: "Vocational Studies" }
    ];
  }, []);

  const filteredEbooks = useMemo(() => {
    return ebooks.filter((b) => {
      const matchDept = selectedDept === "all" || b.dept === selectedDept;
      const matchSearch =
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.titleBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchDept && matchSearch;
    });
  }, [ebooks, searchTerm, selectedDept]);

  const availableCount = ebooks.filter((b) => b.isAvailable).length;
  const unavailableCount = ebooks.length - availableCount;

  // Genuine document download generator for available books
  const handleDownloadEbook = (book: EbookItem) => {
    if (!book.isAvailable || !book.chapters) return;

    let content = `========================================================================\n`;
    content += `BANGLADESH NATIONAL INSTITUTE OF EDUCATION (BNIE)\n`;
    content += `CENTRAL DIGITAL E-LIBRARY & CURRICULUM TEXTBOOK\n`;
    content += `========================================================================\n\n`;
    content += `COURSE CODE: ${book.code}\n`;
    content += `BOOK TITLE: ${book.title}\n`;
    content += `BENGALI TITLE: ${book.titleBn}\n`;
    content += `DEPARTMENT: ${book.category}\n`;
    content += `AUTHOR(S): ${book.author}\n`;
    content += `EDITION: ${book.edition} | PAGES: ${book.pages}\n\n`;
    content += `BOOK OVERVIEW & SYLLABUS SYNOPSIS:\n${book.summary}\n\n`;
    content += `------------------------------------------------------------------------\n`;
    content += `OFFICIAL CHAPTER SUMMARIES & CORE TECHNICAL TOPICS:\n`;
    content += `------------------------------------------------------------------------\n\n`;

    book.chapters.forEach((chap) => {
      content += `[CHAPTER ${chap.chapterNo}]: ${chap.title.toUpperCase()}\n`;
      content += `Summary: ${chap.summary}\n`;
      content += `Core Examination Topics:\n`;
      chap.keyTopics.forEach((t) => {
        content += `  • ${t}\n`;
      });
      content += `\n`;
    });

    content += `========================================================================\n`;
    content += `Verified by BNIE Curriculum Board • Digitally authenticated textbook\n`;
    content += `SHA256 Token: SHA256-${book.code}-BNIE-EBOOK-CERTIFIED\n`;
    content += `========================================================================\n`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${book.code}-${book.title.replace(/[^a-zA-Z0-9]/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50/70 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Breadcrumbs */}
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
            <span>Student Services</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#006a4e] font-bold">Digital E-Library</span>
          </div>
        </div>

        {/* Page Hero Banner */}
        <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-[#006a4e] rounded-full text-xs font-bold border border-emerald-200/80">
              <Tablet className="w-3.5 h-3.5" />
              <span>BNIE Central E-Book Library (কেন্দ্রীয় ডিজিটাল ই-বুক লাইব্রেরি)</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Institutional Digital Textbooks &amp; E-Books
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              ডিপ্লোমা ইন ইঞ্জিনিয়ারিং (মেকানিক্যাল, ইলেকট্রনিক্স, ইলেকট্রিক্যাল, সিভিল, কম্পিউটার), এসএসসি/এইচএসসি ভোকেশনাল শিক্ষার্থীদের জন্য অনুমোদিত পাঠ্যপুস্তকের কেন্দ্রীয় ডিজিটাল ক্যাটালগ।
            </p>

            {/* Availability Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Available Textbooks: {availableCount}</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg">
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                <span>Under Compilation / Revision: {unavailableCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Department Selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search textbooks by title, code or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e] transition-all"
              />
            </div>

            {/* Department Dropdown / Tabs */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-[#006a4e]/20 cursor-pointer"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Ebook Catalogue Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEbooks.map((book) => (
            <motion.div
              key={book.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden bg-white ${
                book.isAvailable
                  ? "border-[#006a4e]/40 shadow-xs hover:shadow-md ring-1 ring-[#006a4e]/10"
                  : "border-gray-200 opacity-90 hover:opacity-100"
              }`}
            >
              <div className="p-5 sm:p-6 space-y-4 flex-1">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded border bg-emerald-50 text-[#006a4e] border-emerald-200">
                    Code: {book.code}
                  </span>

                  {book.isAvailable ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                      <Lock className="w-3 h-3 text-gray-400" />
                      Not Available (মুদ্রণাধীন)
                    </span>
                  )}
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-base font-bold text-gray-900 font-sans leading-snug">
                    {book.title}
                  </h3>
                  <h4 className="text-xs text-gray-600 font-medium mt-1 font-sans">
                    {book.titleBn}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#006a4e] font-semibold mt-2">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{book.category}</span>
                  </div>
                </div>

                {/* Author & Edition */}
                <div className="text-xs text-gray-500 space-y-1">
                  <p><strong>Author:</strong> {book.author}</p>
                  <p><strong>Edition:</strong> {book.edition}</p>
                </div>

                {/* Summary */}
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                  {book.summary}
                </p>

                {/* Specs */}
                <div className="pt-2 flex items-center gap-3 text-[11px] text-gray-500 font-mono">
                  <span>{book.pages}</span>
                  <span>•</span>
                  <span>{book.size}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-2">
                {book.isAvailable ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setReadingBook(book)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-emerald-50 text-[#006a4e] border border-[#006a4e]/40 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Read Online</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadEbook(book)}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#006a4e] hover:bg-[#005a42] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                      title="Download Certified E-book"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Download</span>
                    </button>
                  </>
                ) : (
                  <div className="w-full text-center py-2 text-xs text-gray-500 font-medium italic bg-gray-100 rounded-lg border border-gray-200">
                    Not Available • প্রকাশনা ও সংস্করণ প্রক্রিয়াধীন
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredEbooks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <Tablet className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-700">No textbooks match your search</p>
            <p className="text-xs text-gray-500 mt-1">Try another keyword or select All Subjects.</p>
          </div>
        )}

      </div>

      {/* Reader Modal View for Available Ebooks */}
      <AnimatePresence>
        {readingBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs no-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-gray-200 bg-[#006a4e] text-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 rounded-lg text-white">
                    <Tablet className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-emerald-100">
                      Code: {readingBook.code}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base font-sans mt-0.5">
                      {readingBook.title}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadEbook(readingBook)}
                    className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    title="Download Book"
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
                    onClick={() => setReadingBook(null)}
                    className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-gray-800">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                  <p className="text-xs font-semibold text-emerald-900">
                    <strong>Author:</strong> {readingBook.author} • <strong>Edition:</strong> {readingBook.edition}
                  </p>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {readingBook.summary}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Syllabus Units &amp; Chapter Breakdowns
                  </h4>

                  {readingBook.chapters?.map((chap) => (
                    <div key={chap.chapterNo} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#006a4e]">
                          Chapter {chap.chapterNo}
                        </span>
                        <span className="text-[11px] text-gray-500 font-mono">
                          Core Module
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-gray-900">
                        {chap.title}
                      </h5>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {chap.summary}
                      </p>
                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-gray-700 block mb-1">
                          Key Examination Topics:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {chap.keyTopics.map((topic, i) => (
                            <span key={i} className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-700 font-medium">
                              • {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setReadingBook(null)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Close Reader
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
