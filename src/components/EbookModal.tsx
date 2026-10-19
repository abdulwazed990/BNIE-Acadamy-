import { useState } from "react";
import { X, Tablet, BookOpen, Download, Search, FileText, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface EbookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EbookModal({ isOpen, onClose }: EbookModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");

  if (!isOpen) return null;

  const textbooks = [
    {
      code: "ME-101",
      title: "Engineering Drawing & CAD Principles",
      dept: "mechanical",
      author: "BNIE Mechanical Technical Faculty",
      edition: "2024 Revised Edition",
      pages: "312 Pages",
      size: "14.2 MB"
    },
    {
      code: "ME-206",
      title: "Thermodynamics & Heat Engines",
      dept: "mechanical",
      author: "Prof. K. A. Rahman & Board Experts",
      edition: "5th Edition",
      pages: "420 Pages",
      size: "18.5 MB"
    },
    {
      code: "ME-301",
      title: "Fluid Mechanics & Hydraulic Machinery",
      dept: "mechanical",
      author: "Technical Curriculum Board",
      edition: "Latest Edition",
      pages: "380 Pages",
      size: "16.8 MB"
    },
    {
      code: "66811",
      title: "Basic Electronics & Semiconductor Devices",
      dept: "electronics",
      author: "Engr. M. Haque & Dr. S. Ahmed",
      edition: "4th National Edition",
      pages: "290 Pages",
      size: "12.4 MB"
    },
    {
      code: "66822",
      title: "Digital Electronics & Logic Circuits",
      dept: "electronics",
      author: "Digital Systems Committee",
      edition: "3rd Edition",
      pages: "340 Pages",
      size: "15.1 MB"
    },
    {
      code: "66711",
      title: "Electrical Circuits & Network Analysis",
      dept: "electrical",
      author: "Power Engineering Faculty",
      edition: "Standard Edition",
      pages: "360 Pages",
      size: "17.0 MB"
    },
    {
      code: "ACM-101",
      title: "Refrigeration Principles & HVAC Servicing",
      dept: "acm",
      author: "Cooling & Thermal Diagnostics Panel",
      edition: "2nd Edition",
      pages: "275 Pages",
      size: "11.6 MB"
    },
    {
      code: "GEN-102",
      title: "Engineering Mathematics-I (Calculus & Vectors)",
      dept: "general",
      author: "Mathematics Board BNIE",
      edition: "Standard Academic Text",
      pages: "450 Pages",
      size: "19.2 MB"
    }
  ];

  const filtered = textbooks.filter((book) => {
    const matchDept = selectedDept === "all" || book.dept === selectedDept;
    const matchSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchDept && matchSearch;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Modal Header */}
          <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-emerald-100 rounded-lg text-[#006a4e]">
                <Tablet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900 font-sans">
                  BNIE Digital Library &amp; Ebook (ই-বুক লাইব্রেরি)
                </h3>
                <p className="text-xs text-gray-500">
                  Open Digital Textbooks for Diploma, HSC &amp; Technical Programs
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="p-4 bg-white border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search subject code, title or author..."
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-gray-900 focus:border-[#006a4e] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {[
                { id: "all", label: "All" },
                { id: "mechanical", label: "Mechanical" },
                { id: "electronics", label: "Electronics" },
                { id: "electrical", label: "Electrical" },
                { id: "general", label: "General" }
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDept(d.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                    selectedDept === d.id
                      ? "bg-[#006a4e] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Body: Book List */}
          <div className="p-6 overflow-y-auto space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-xs">
                No digital textbooks matched your search criteria.
              </div>
            ) : (
              filtered.map((b) => (
                <div
                  key={b.code}
                  className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-[#006a4e]/40 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold bg-emerald-50 text-[#006a4e] px-2 py-0.5 rounded border border-emerald-200">
                        {b.code}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {b.edition} • {b.pages}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 leading-snug">
                      {b.title}
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Author: {b.author}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        alert(`Opening online reader for: ${b.title} (${b.code})`);
                      }}
                      className="inline-flex items-center space-x-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Read Online</span>
                    </button>
                    <button
                      onClick={() => {
                        alert(`Downloading complete PDF for: ${b.title} (${b.size})`);
                      }}
                      className="inline-flex items-center space-x-1 bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <span className="text-[11px] text-gray-500">
              Open Educational Resources (OER) • Free for All Students
            </span>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
