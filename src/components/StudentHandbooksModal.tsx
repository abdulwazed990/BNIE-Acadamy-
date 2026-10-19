import { X, BookOpen, Download, FileText, CheckCircle2, ChevronRight, Award } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface StudentHandbooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCourses: () => void;
}

export default function StudentHandbooksModal({
  isOpen,
  onClose,
  onNavigateToCourses
}: StudentHandbooksModalProps) {
  if (!isOpen) return null;

  const handbooks = [
    {
      title: "4-Year Diploma in Engineering Academic Policy",
      subtitle: "Mechanical, Electrical, Electronics, Civil & Computer Curriculum Bylaws",
      pages: "64 Pages",
      size: "3.4 MB",
      code: "BNIE-HB-DIP-2024",
      highlights: ["Credit calculation rules (Scale 4.00)", "Industrial attachment & internship requirements", "Semester retake & improvement bylaws"]
    },
    {
      title: "Student Code of Conduct & Academic Integrity",
      subtitle: "Campus Ethics, Workshop Safety, Laboratory Guidelines & Disciplinary Rules",
      pages: "28 Pages",
      size: "1.8 MB",
      code: "BNIE-HB-ETH-2024",
      highlights: ["Workshop dress code & protective equipment", "Classroom attendance threshold (75% minimum)", "Examination hall rules and anti-plagiarism guidelines"]
    },
    {
      title: "Grading System & Examination Assessment Handbook",
      subtitle: "Continuous Assessment, Practical Marking, Final Examination & CGPA Formula",
      pages: "36 Pages",
      size: "2.1 MB",
      code: "BNIE-HB-GRD-2024",
      highlights: ["Theory 60% and Practical 40% distribution", "A+ (4.00) to F (0.00) grade point boundaries", "Certificate verification and transcript generation steps"]
    },
    {
      title: "SSC & HSC Vocational Curriculum Guideline",
      subtitle: "General Science, Humanities, Business Studies & Vocational Specializations",
      pages: "44 Pages",
      size: "2.7 MB",
      code: "BNIE-HB-VOC-2024",
      highlights: ["National skill standard certification", "Practical workshop hours & tool handling", "Board examination passing criteria"]
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Modal Header */}
          <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-emerald-100 rounded-lg text-[#006a4e]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900 font-sans">
                  Student Handbooks (শিক্ষার্থী নির্দেশিকা)
                </h3>
                <p className="text-xs text-gray-500">
                  Official Academic Guidelines, Regulations &amp; Syllabi
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

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-4">
            <p className="text-xs text-gray-600 leading-relaxed">
              বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউটের (BNIE) সকল শিক্ষার্থী, শিক্ষক ও অভিভাবকদের জন্য প্রাতিষ্ঠানিক নীতিমালা, পরীক্ষা পদ্ধতি এবং পাঠ্যক্রমের অফিসিয়াল হ্যান্ডবুক নিচে উন্মুক্ত রয়েছে:
            </p>

            <div className="space-y-3">
              {handbooks.map((hb) => (
                <div
                  key={hb.code}
                  className="p-4 rounded-xl border border-gray-200 bg-white hover:border-[#006a4e]/40 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold bg-emerald-50 text-[#006a4e] px-2 py-0.5 rounded border border-emerald-200">
                        {hb.code}
                      </span>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {hb.pages} • {hb.size}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 leading-snug">
                      {hb.title}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {hb.subtitle}
                    </p>
                    <div className="pt-1 flex flex-wrap gap-1.5 text-[10px] text-gray-500">
                      {hb.highlights.map((h, i) => (
                        <span key={i} className="inline-flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                          <CheckCircle2 className="w-2.5 h-2.5 text-[#006a4e]" /> {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      alert(`Downloading official PDF for: ${hb.title}\nDoc Ref: ${hb.code}`);
                    }}
                    className="shrink-0 inline-flex items-center space-x-1.5 bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer self-start sm:self-center"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                onNavigateToCourses();
              }}
              className="text-xs font-bold text-[#006a4e] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore 45+ Diploma Curriculums</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              বন্ধ করুন (Close)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
