import { BookOpen, FileText, Download, ArrowLeft, ChevronRight, Award, ExternalLink, Calendar, Search } from "lucide-react";
import { useState } from "react";

interface ResearchPublicationsPageProps {
  onBackToHome: () => void;
  onNavigateToEbooks: () => void;
}

export default function ResearchPublicationsPage({ onBackToHome, onNavigateToEbooks }: ResearchPublicationsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const researchPapers = [
    {
      title: "Optimization of Thermodynamic Heat Rate in Combined Cycle Gas Turbines in Bangladesh",
      journal: "BNIE Journal of Engineering Science & Technology (BJEST)",
      volume: "Vol. 14, Issue 2, pp. 45-58, 2024",
      authors: "Dr. M. K. Rahman, Engr. Tanvir Ahmed (Dept. of Mechanical Engineering)",
      doi: "10.5281/bnie.jest.2024.1402",
      category: "Mechanical & Energy Systems",
      date: "August 2024"
    },
    {
      title: "Implementation of Microgrid Automation & Smart Inverters for Industrial Textile Plants",
      journal: "Bangladesh Technical Research Review",
      volume: "Vol. 9, Issue 1, pp. 112-124, 2024",
      authors: "Prof. S. R. Chowdhury & Faculty Research Board (Dept. of Electrical)",
      doi: "10.5281/bnie.jest.2024.0901",
      category: "Electrical & Renewable Power",
      date: "July 2024"
    },
    {
      title: "Competency-Based Technical & Vocational Education in 4IR: Curriculum Alignment Study",
      journal: "Journal of Vocational Pedagogy & Technology Transfer",
      volume: "Special Issue on National Skills Standard, 2024",
      authors: "Curriculum Research Directorate, BNIE",
      doi: "10.5281/bnie.jest.2024.0811",
      category: "Technical Education Policy",
      date: "May 2024"
    },
    {
      title: "Structural Compressive Strength Assessment of Low-Carbon Fly Ash Geopolymer Concrete",
      journal: "Civil & Materials Engineering Bulletin",
      volume: "Vol. 6, Issue 3, pp. 88-102, 2023",
      authors: "Engr. N. Islam & Structural Testing Laboratory",
      doi: "10.5281/bnie.jest.2023.0603",
      category: "Civil & Material Science",
      date: "November 2023"
    }
  ];

  const filtered = researchPapers.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/70 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
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
            <span>Academic Wing</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#006a4e] font-bold">Research &amp; Publications</span>
          </div>
        </div>

        {/* Page Banner */}
        <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-[#006a4e] rounded-full text-xs font-bold border border-emerald-200/80">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Directorate of Research &amp; Publications (গবেষণা ও প্রকাশনা উইং)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Research Papers, Journals &amp; Monographs
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউটের শিক্ষক ও গবেষকগণের উদ্ভাবনী প্রকৌশল গবেষণা, জার্নাল প্রকাশনা ও জাতীয় কারিগরি উন্নয়ন সমীক্ষা।
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onNavigateToEbooks}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-[#006a4e] border border-emerald-200 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <span>Browse Digital E-Books Catalogue →</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search research papers by title, author or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-[#006a4e]/20"
            />
          </div>
        </div>

        {/* Papers List */}
        <div className="space-y-4">
          {filtered.map((paper, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:border-[#006a4e]/40 transition-all space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold bg-emerald-50 text-[#006a4e] px-2 py-0.5 rounded border border-emerald-200">
                  {paper.category}
                </span>
                <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {paper.date}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                {paper.title}
              </h3>

              <p className="text-xs text-gray-600">
                <strong>Authors:</strong> {paper.authors}
              </p>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
                <span><strong>Publication:</strong> {paper.journal} • {paper.volume}</span>
                <span className="font-mono text-[11px]">DOI: {paper.doi}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
