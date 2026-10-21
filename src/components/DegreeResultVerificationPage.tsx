import { useState, useEffect, FormEvent } from "react";
import { Student, Category } from "../types";
import { 
  GraduationCap, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  RotateCcw, 
  Download,
  Landmark,
  Layers,
  FileCheck2,
  FileText,
  Eye,
  Check
} from "lucide-react";
import Logo from "./Logo";
import { motion } from "motion/react";
import { QRCodeCanvas } from "qrcode.react";
import { PASSPORT_AVATARS } from "../data/defaultStudents";

interface DegreeResultVerificationPageProps {
  students: Student[];
  isDbLoading?: boolean;
  onBackToHome: () => void;
  onNavigateToAdmin?: () => void;
  onNavigateToSscHscVerify?: () => void;
}

export type ExamType = "Degree Pass" | "Honours" | "Masters";

export interface PeriodOption {
  value: string;
  label: string;
  index: number;
}

export const EXAM_TYPE_PERIODS: Record<ExamType, PeriodOption[]> = {
  "Degree Pass": [
    { value: "Year 1", label: "Year 1 (First Year)", index: 1 },
    { value: "Year 2", label: "Year 2 (Second Year)", index: 2 },
    { value: "Year 3", label: "Year 3 (Third / Final Year)", index: 3 }
  ],
  "Honours": [
    { value: "Semester 1", label: "Semester 1", index: 1 },
    { value: "Semester 2", label: "Semester 2", index: 2 },
    { value: "Semester 3", label: "Semester 3", index: 3 },
    { value: "Semester 4", label: "Semester 4", index: 4 },
    { value: "Semester 5", label: "Semester 5", index: 5 },
    { value: "Semester 6", label: "Semester 6", index: 6 },
    { value: "Semester 7", label: "Semester 7", index: 7 },
    { value: "Semester 8", label: "Semester 8 (Final)", index: 8 }
  ],
  "Masters": [
    { value: "Semester 1", label: "Semester 1", index: 1 },
    { value: "Semester 2", label: "Semester 2", index: 2 },
    { value: "Semester 3", label: "Semester 3", index: 3 },
    { value: "Semester 4", label: "Semester 4 (Final)", index: 4 }
  ]
};

export default function DegreeResultVerificationPage({
  students,
  isDbLoading = false,
  onBackToHome,
  onNavigateToAdmin,
  onNavigateToSscHscVerify
}: DegreeResultVerificationPageProps) {
  // Required search fields according to prompt specification
  const [studentIdInput, setStudentIdInput] = useState("");
  const [examType, setExamType] = useState<ExamType>("Honours");
  const [passingYear, setPassingYear] = useState("2024");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Semester 8");

  // Search Results State
  const [matchedStudent, setMatchedStudent] = useState<Student | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [displayedEndpointPeriod, setDisplayedEndpointPeriod] = useState<string>("Semester 8");

  // View mode toggle: standard on-screen vs print/PDF preview (compact subject codes)
  const [viewMode, setViewMode] = useState<"standard" | "compact_preview">("standard");

  // Whenever Exam Type changes, update default selected period
  const handleExamTypeChange = (newType: ExamType) => {
    setExamType(newType);
    const periods = EXAM_TYPE_PERIODS[newType];
    const defaultPeriod = periods[periods.length - 1].value;
    setSelectedPeriod(defaultPeriod);
  };

  // Handle URL query parameters for direct links (e.g. ?id=...&exam=...&year=...&period=...)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || params.get("studentId") || params.get("roll") || params.get("token") || params.get("reg");
    const examParam = params.get("exam") || params.get("type");
    const yearParam = params.get("year");
    const periodParam = params.get("period");

    let initialExam: ExamType = "Honours";
    if (examParam) {
      if (examParam.toLowerCase().includes("pass") || examParam.toLowerCase().includes("degree")) {
        initialExam = "Degree Pass";
      } else if (examParam.toLowerCase().includes("master")) {
        initialExam = "Masters";
      } else if (examParam.toLowerCase().includes("honour")) {
        initialExam = "Honours";
      }
      setExamType(initialExam);
    }

    if (yearParam) {
      setPassingYear(yearParam);
    }

    if (periodParam) {
      setSelectedPeriod(periodParam);
    } else {
      const periods = EXAM_TYPE_PERIODS[initialExam];
      setSelectedPeriod(periods[periods.length - 1].value);
    }

    if (id && students.length > 0) {
      setStudentIdInput(id);
      performSearch(id, initialExam, yearParam || passingYear, periodParam || (EXAM_TYPE_PERIODS[initialExam][EXAM_TYPE_PERIODS[initialExam].length - 1].value));
    }
  }, [students]);

  // Execute Search
  const performSearch = (
    queryId: string, 
    type: ExamType, 
    year: string, 
    period: string
  ) => {
    const cleanId = queryId.trim().toLowerCase();
    if (!cleanId) {
      setSearchError("Please enter a Student ID, Roll Number, or Registration Number.");
      setMatchedStudent(null);
      setHasSearched(true);
      return;
    }

    // Filter only Higher Education candidates (Degree Pass, Honours, Masters)
    const higherEdStudents = students.filter(
      (s) =>
        s.category === Category.DEGREE_PASS ||
        s.category === Category.HONOURS ||
        s.category === Category.MASTERS ||
        Boolean(s.academicLevel) ||
        Boolean(s.programCode)
    );

    // Primary search matching ID/Roll/Reg AND Exam Type
    let found = higherEdStudents.find((s) => {
      const matchId = s.id && s.id.toLowerCase() === cleanId;
      const matchRoll = s.rollNumber && s.rollNumber.toLowerCase() === cleanId;
      const matchReg = s.registrationNumber && s.registrationNumber.toLowerCase() === cleanId;
      const matchToken = s.secureToken && s.secureToken.toLowerCase() === cleanId;
      const matchCert = s.certificateSerialNumber && s.certificateSerialNumber.toLowerCase() === cleanId;
      const matchCert2 = s.certificateNumber && s.certificateNumber.toLowerCase() === cleanId;

      // Allow searching by exact mixed numeric suffix (e.g. "5837", "7294", "4168", "846291")
      const matchRollSuffix = s.rollNumber && s.rollNumber.toLowerCase().endsWith(`-${cleanId}`);
      const matchRegSuffix = s.registrationNumber && s.registrationNumber.toLowerCase().endsWith(`-${cleanId}`);

      const matchesIdentifier = matchId || matchRoll || matchReg || matchToken || matchCert || matchCert2 || matchRollSuffix || matchRegSuffix;
      if (!matchesIdentifier) return false;

      // Check category/academicLevel
      if (type === "Degree Pass") {
        return s.category === Category.DEGREE_PASS || s.academicLevel === "Degree Pass";
      } else if (type === "Honours") {
        return s.category === Category.HONOURS || s.academicLevel === "Honours";
      } else if (type === "Masters") {
        return s.category === Category.MASTERS || s.academicLevel === "Masters";
      }
      return true;
    });

    // Fallback: If not found under exact type, look for candidate across any higher education type
    if (!found) {
      found = higherEdStudents.find((s) => {
        const matchId = s.id && s.id.toLowerCase() === cleanId;
        const matchRoll = s.rollNumber && s.rollNumber.toLowerCase() === cleanId;
        const matchReg = s.registrationNumber && s.registrationNumber.toLowerCase() === cleanId;
        const matchToken = s.secureToken && s.secureToken.toLowerCase() === cleanId;
        const matchCert = s.certificateSerialNumber && s.certificateSerialNumber.toLowerCase() === cleanId;
        const matchCert2 = s.certificateNumber && s.certificateNumber.toLowerCase() === cleanId;
        const matchRollSuffix = s.rollNumber && s.rollNumber.toLowerCase().endsWith(`-${cleanId}`);
        const matchRegSuffix = s.registrationNumber && s.registrationNumber.toLowerCase().endsWith(`-${cleanId}`);
        return matchId || matchRoll || matchReg || matchToken || matchCert || matchCert2 || matchRollSuffix || matchRegSuffix;
      });
      if (found) {
        if (found.category === Category.DEGREE_PASS || found.academicLevel === "Degree Pass") {
          setExamType("Degree Pass");
        } else if (found.category === Category.MASTERS || found.academicLevel === "Masters") {
          setExamType("Masters");
        } else {
          setExamType("Honours");
        }
      }
    }

    if (found) {
      setMatchedStudent(found);
      setSearchError("");
      setDisplayedEndpointPeriod(period);
    } else {
      setMatchedStudent(null);
      setSearchError(`No accredited record found matching "${queryId}" under ${type} (${year}).`);
    }

    setHasSearched(true);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    performSearch(studentIdInput, examType, passingYear, selectedPeriod);
  };

  const handleReset = () => {
    setStudentIdInput("");
    setMatchedStudent(null);
    setHasSearched(false);
    setSearchError("");
  };

  // Filter semesterResults according to selected academic period
  const getFilteredSemesterResults = (student: Student, periodValue: string) => {
    if (!student.semesterResults || student.semesterResults.length === 0) {
      return [];
    }

    let targetIndex = 8;
    if (examType === "Degree Pass") {
      if (periodValue === "Year 1") targetIndex = 1;
      else if (periodValue === "Year 2") targetIndex = 2;
      else targetIndex = 3;
    } else if (examType === "Masters") {
      if (periodValue === "Semester 1") targetIndex = 1;
      else if (periodValue === "Semester 2") targetIndex = 2;
      else if (periodValue === "Semester 3") targetIndex = 3;
      else targetIndex = 4;
    } else {
      // Honours (Semester 1 to 8)
      const numMatch = periodValue.match(/\d+/);
      targetIndex = numMatch ? parseInt(numMatch[0], 10) : 8;
    }

    return student.semesterResults.slice(0, targetIndex);
  };

  // Calculate Cumulative Grade Point Average (CGPA) and Total Credits up to the selected period
  const calculateCgpaUpToPeriod = (filtered: typeof matchedStudent.semesterResults) => {
    if (!filtered || filtered.length === 0) {
      return { cgpa: matchedStudent?.finalGpa || 3.75, totalCredits: 0 };
    }

    let totalWeightedPoints = 0;
    let totalCredits = 0;

    for (const sem of filtered) {
      for (const sub of sem.subjects) {
        const credits = sub.credit || sub.credits || 3;
        totalWeightedPoints += (sub.gradePoint || 0) * credits;
        totalCredits += credits;
      }
    }

    const cgpa = totalCredits > 0 
      ? Math.min(4.00, Math.round((totalWeightedPoints / totalCredits) * 100) / 100) 
      : (matchedStudent?.finalGpa || 3.75);

    return { cgpa, totalCredits };
  };

  const filteredSemesters = matchedStudent ? getFilteredSemesterResults(matchedStudent, displayedEndpointPeriod) : [];
  const { cgpa: computedCgpa, totalCredits: computedTotalCredits } = matchedStudent 
    ? calculateCgpaUpToPeriod(filteredSemesters) 
    : { cgpa: 0, totalCredits: 0 };

  const currentPeriods = EXAM_TYPE_PERIODS[examType];

  // =========================================================================
  // TWO-PAGE A4 DIVISION LOGIC
  // =========================================================================
  // Display the complete final result across exactly 2 consecutive A4 portrait pages.
  // Page 1: Student/institution details + first portion of academic results.
  // Page 2: Remaining academic results + final CGPA + status + seals & signatures.
  const isTwoPage = filteredSemesters.length > 1;
  const splitIndex = filteredSemesters.length <= 1 
    ? 1 
    : filteredSemesters.length === 3 
    ? 2 
    : Math.ceil(filteredSemesters.length / 2);

  const page1Semesters = filteredSemesters.slice(0, splitIndex);
  const page2Semesters = filteredSemesters.slice(splitIndex);

  // Trigger print with advice
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50/70 py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Print-specific stylesheet ensuring exact 2-Page A4 Portrait division */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 6mm 8mm 6mm 8mm;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
            font-size: 10px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .marksheet-page-1 {
            page-break-after: always !important;
            break-after: page !important;
            box-sizing: border-box !important;
            padding: 8px 12px !important;
            margin: 0 !important;
            border: 1px solid #374151 !important;
            border-radius: 6px !important;
            box-shadow: none !important;
          }
          .marksheet-page-2 {
            page-break-before: always !important;
            break-before: page !important;
            box-sizing: border-box !important;
            padding: 8px 12px !important;
            margin-top: 0 !important;
            border: 1px solid #374151 !important;
            border-radius: 6px !important;
            box-shadow: none !important;
          }
          /* Hide full subject names in print to save space with compact subject codes */
          .print-hide-title {
            display: none !important;
          }
          /* Prevent any individual table row or semester block from breaking awkwardly */
          tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .semester-block {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-bottom: 3px !important;
          }
          .print-compact-table {
            font-size: 8.5px !important;
            line-height: 1.15 !important;
          }
          .print-compact-table th, 
          .print-compact-table td {
            padding: 1.5px 3px !important;
          }
        }
      `}</style>

      <div className="max-w-5xl mx-auto space-y-6">

        {/* Top Navigation & Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs no-print">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-black hover:bg-gray-100 px-3 py-2 rounded-xl border border-gray-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-black" />
            <span>Return to Home Portal</span>
          </button>

          <div className="flex items-center gap-2">
            {onNavigateToSscHscVerify && (
              <button
                type="button"
                onClick={onNavigateToSscHscVerify}
                className="text-xs font-bold text-gray-700 hover:text-[#006a4e] bg-gray-100 hover:bg-emerald-50 border border-gray-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Go to SSC / HSC / Diploma Result Check
              </button>
            )}
            {onNavigateToAdmin && (
              <button
                type="button"
                onClick={onNavigateToAdmin}
                className="text-xs font-bold text-[#006a4e] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-xl transition-colors cursor-pointer"
              >
                Admin Portal
              </button>
            )}
          </div>
        </div>

        {/* Main Search Panel Header */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6 no-print">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#006a4e] shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#006a4e] block">
                  Higher Education Division • National Academic Ledger
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-gray-950 font-sans tracking-tight">
                  Degree / Honours / Masters — Full Marksheet Result Check
                </h1>
                <p className="text-xs text-gray-600">
                  Two-Page Continuous A4 Portrait Marksheet &amp; Verified Official Transcript Portal
                </p>
              </div>
            </div>
          </div>

          {/* SEARCH FORM WITH THE 4 REQUIRED FIELDS */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Field 1: Student ID (also accepts Roll / Registration No) */}
              <div className="md:col-span-4 space-y-1">
                <label className="text-xs font-bold text-black uppercase tracking-wider block">
                  1. Student ID <span className="text-[#006a4e]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={studentIdInput}
                    onChange={(e) => setStudentIdInput(e.target.value)}
                    placeholder=""
                    className="w-full bg-gray-50/70 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:bg-white focus:border-[#006a4e] focus:outline-hidden"
                  />
                </div>
                <span className="text-[10px] text-gray-500">Student ID, Roll No, or Registration No</span>
              </div>

              {/* Field 2: Exam Type */}
              <div className="md:col-span-3 space-y-1">
                <label className="text-xs font-bold text-black uppercase tracking-wider block">
                  2. Exam Type <span className="text-[#006a4e]">*</span>
                </label>
                <select
                  value={examType}
                  onChange={(e) => handleExamTypeChange(e.target.value as ExamType)}
                  className="w-full bg-gray-50/70 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:bg-white focus:border-[#006a4e] focus:outline-hidden cursor-pointer"
                >
                  <option value="Honours">Honours (4-Year)</option>
                  <option value="Degree Pass">Degree Pass (3-Year)</option>
                  <option value="Masters">Masters (Postgraduate)</option>
                </select>
                <span className="text-[10px] text-gray-500">Select qualification level</span>
              </div>

              {/* Field 3: Passing Year */}
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-black uppercase tracking-wider block">
                  3. Passing Year <span className="text-[#006a4e]">*</span>
                </label>
                <select
                  value={passingYear}
                  onChange={(e) => setPassingYear(e.target.value)}
                  className="w-full bg-gray-50/70 border border-gray-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-900 focus:bg-white focus:border-[#006a4e] focus:outline-hidden cursor-pointer"
                >
                  {["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"].map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
                <span className="text-[10px] text-gray-500">Year of Exam / Degree</span>
              </div>

              {/* Field 4: Academic Period / Semester (Dynamic) */}
              <div className="md:col-span-3 space-y-1">
                <label className="text-xs font-bold text-black uppercase tracking-wider block">
                  4. Academic Period <span className="text-[#006a4e]">*</span>
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full bg-emerald-50/50 border border-emerald-300 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-900 focus:bg-white focus:border-[#006a4e] focus:outline-hidden cursor-pointer"
                >
                  {currentPeriods.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-emerald-800 font-medium">Dynamic period selection</span>
              </div>

            </div>

            {/* Quick Helper Banner for Period Mapping */}
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-[11px] text-gray-600 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#006a4e]" />
                <span className="font-semibold text-gray-900">Period Retrieval Mode:</span>
                <span>
                  {examType === "Degree Pass" 
                    ? "Year 1 (1st Year Only) • Year 2 (Year 1 to 2) • Year 3 (Complete 3-Year History)" 
                    : examType === "Honours" 
                    ? "Semester 1 through 8 (Retrieves cumulative history up to selected semester)" 
                    : "Semester 1 through 4 (Retrieves cumulative history up to selected semester)"}
                </span>
              </div>
              <span className="font-mono text-gray-500">4.00 CGPA Scale</span>
            </div>

            {/* Field 5: Search Full Marksheet button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              {hasSearched && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 border border-gray-300 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-700 cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Search</span>
                </button>
              )}

              <button
                type="submit"
                disabled={isDbLoading}
                className="py-2.5 px-6 bg-[#006a4e] hover:bg-[#005a42] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Search className="w-4 h-4" />
                <span>Search Full Marksheet</span>
              </button>
            </div>

          </form>
        </div>

        {/* SEARCH ERROR / NOT FOUND BANNER */}
        {hasSearched && !matchedStudent && (
          <div className="bg-white rounded-2xl border-2 border-red-200 p-8 text-center space-y-3 shadow-xs no-print">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-red-950 font-sans">
              No matching student record found.
            </h3>
            <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
              {searchError || `We could not find an accredited ${examType} record matching "${studentIdInput}". Please check the Student ID, Roll Number, or Registration Number and try again.`}
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Try Another Search
              </button>
              {onNavigateToSscHscVerify && (
                <button
                  type="button"
                  onClick={onNavigateToSscHscVerify}
                  className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#006a4e] border border-emerald-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Try SSC / HSC / Diploma Search
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TWO-PAGE CONTINUOUS A4 OFFICIAL MARKSHEET DISPLAY                         */}
        {/* ========================================================================= */}
        {matchedStudent && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Top Verification Status & Print / PDF Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 p-4 rounded-2xl no-print">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#006a4e] shrink-0" />
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#006a4e] block">
                    Certificate Verification Status: Verified Authentic
                  </span>
                  <span className="text-[11px] text-gray-600">
                    Official Central Ledger Archive • Evaluated Period: {displayedEndpointPeriod} • Two-Page A4 Continuous Marksheet
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Download PDF Button Only */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#006a4e] hover:bg-[#005a42] text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer"
                  title="Download two-page A4 Marksheet PDF"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* MARKSHEET PAGE 1 OF 2                                                     */}
            {/* ========================================================================= */}
            <div 
              id="marksheet-page-1"
              className="marksheet-page-1 bg-white rounded-3xl border-2 border-gray-300 shadow-md p-6 sm:p-8 space-y-5"
            >
              {/* Institution Header & Letterhead */}
              <div className="border-b-2 border-gray-900 pb-4 text-center space-y-1.5">
                <div className="flex items-center justify-center gap-3 sm:gap-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0">
                    <Logo size={60} />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#006a4e] block">
                      গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত স্বায়ত্তশাসিত উচ্চশিক্ষা পরিষদ
                    </span>
                    <h2 className="text-lg sm:text-2xl font-black text-gray-950 font-sans tracking-tight">
                      Bangladesh National Institute of Education (BNIE)
                    </h2>
                    <p className="text-[11px] sm:text-xs font-semibold text-gray-700">
                      Central Academic Examination &amp; Transcripts Division • Dhaka, Bangladesh
                    </p>
                  </div>
                </div>

                {/* Marksheet Title according to Exam Type */}
                <div className="inline-block px-4 py-1 bg-gray-950 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xs">
                  {examType === "Degree Pass" 
                    ? `OFFICIAL ACADEMIC TRANSCRIPT & FULL MARKSHEET — DEGREE PASS (3-YEAR)` 
                    : examType === "Masters" 
                    ? `OFFICIAL ACADEMIC TRANSCRIPT & FULL MARKSHEET — MASTERS DEGREE PROGRAM` 
                    : `OFFICIAL ACADEMIC TRANSCRIPT & FULL MARKSHEET — HONOURS (4-YEAR)`}
                </div>
                <div className="text-[10px] font-mono text-gray-500">
                  Record Evaluation Endpoint: {displayedEndpointPeriod} • Page 1 of {isTwoPage ? "2" : "1"}
                </div>
              </div>

              {/* Student Personal Profile Details & Passport Photo & QR Grid */}
              <div className="grid grid-cols-12 gap-3.5 bg-gray-50/90 p-4 rounded-xl border border-gray-200">
                
                {/* Passport Photo */}
                <div className="col-span-12 sm:col-span-3 flex flex-col items-center justify-center space-y-1">
                  <div className="relative w-24 h-32 rounded-lg border-2 border-[#006a4e] overflow-hidden bg-white shadow-2xs flex items-center justify-center">
                    <img
                      src={matchedStudent.photoUrl || PASSPORT_AVATARS.male1}
                      alt={matchedStudent.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1 bg-[#006a4e] text-white p-0.5 rounded-full shadow-2xs">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  </div>
                  <span className="text-[8px] font-mono font-bold text-gray-500 uppercase tracking-wider">
                    Official Photo
                  </span>
                </div>

                {/* Candidate Information */}
                <div className="col-span-12 sm:col-span-6 space-y-2 text-xs">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">Candidate Full Name</span>
                    <h3 className="text-base sm:text-lg font-black text-gray-950 font-sans leading-tight">{matchedStudent.name}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                    <div>
                      <span className="text-gray-500">Father:</span>{" "}
                      <span className="font-bold text-gray-900">{matchedStudent.fatherName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Mother:</span>{" "}
                      <span className="font-bold text-gray-900">{matchedStudent.motherName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Program:</span>{" "}
                      <span className="font-bold text-gray-900">{matchedStudent.programName || matchedStudent.category}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Department:</span>{" "}
                      <span className="font-bold text-gray-900">{matchedStudent.department || "Faculty of Higher Education"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Major Subject:</span>{" "}
                      <span className="font-bold text-[#006a4e]">{matchedStudent.majorSubject || "General Core"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Session:</span>{" "}
                      <span className="font-bold text-gray-900">{matchedStudent.session}</span>
                    </div>
                  </div>
                </div>

                {/* QR Code and Quick Verification Badge */}
                <div className="col-span-12 sm:col-span-3 flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-gray-200 space-y-1.5">
                  <div className="p-1 border border-gray-200 rounded-lg bg-white">
                    <QRCodeCanvas
                      value={typeof window !== "undefined" ? window.location.href : `https://bnie.edu.bd/degree-marksheet-result?id=${matchedStudent.id}`}
                      size={76}
                      style={{ width: "70px", height: "70px" }}
                      bgColor="#ffffff"
                      fgColor="#006a4e"
                      level="H"
                    />
                  </div>
                  <span className="text-[8px] font-mono text-gray-400 uppercase tracking-widest text-center font-bold">
                    Scan for Central Verification
                  </span>
                  <div className="w-full text-center pt-0.5 border-t border-gray-150">
                    <span className="text-[8px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded block">
                      Status: {matchedStudent.resultStatus || "Passed"}
                    </span>
                  </div>
                </div>

              </div>

              {/* Institutional Registration & Identifiers Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-gray-50 p-3 rounded-xl border border-gray-200 text-[11px]">
                <div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Student ID</span>
                  <span className="font-mono font-bold text-gray-950">{matchedStudent.id}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Roll Number</span>
                  <span className="font-mono font-bold text-gray-950">{matchedStudent.rollNumber}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Registration No</span>
                  <span className="font-mono font-bold text-gray-950">{matchedStudent.registrationNumber}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Academic Session</span>
                  <span className="font-semibold text-gray-950">{matchedStudent.session}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Admission Year</span>
                  <span className="font-semibold text-gray-950">{matchedStudent.admissionYear || matchedStudent.session?.split("-")[0] || "2020"}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Course Duration</span>
                  <span className="font-semibold text-gray-950">{matchedStudent.courseDuration || (examType === "Degree Pass" ? "3 Years" : examType === "Masters" ? "2 Years" : "4 Years")}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Expected Completion</span>
                  <span className="font-semibold text-gray-950">{matchedStudent.expectedCompletionYear || matchedStudent.passingYear}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Passing / Exam Year</span>
                  <span className="font-semibold text-gray-950">{matchedStudent.passingYear || matchedStudent.examinationYear}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Result Publication Date</span>
                  <span className="font-semibold text-[#006a4e]">{matchedStudent.resultPublicationDate || (matchedStudent.semesterResults?.[matchedStudent.semesterResults.length - 1]?.publicationDate) || "2024-05-20"}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Certificate Status</span>
                  <span className="font-bold text-emerald-800">
                    {matchedStudent.certificateStatus || (matchedStudent.certificateSerialNumber ? "Issued" : "Pending")}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Certificate Number</span>
                  <span className="font-mono font-bold text-gray-950">
                    {(matchedStudent.certificateStatus === "Pending" || matchedStudent.certificateStatus === "Eligible for Issue") && !matchedStudent.certificateNumber && !matchedStudent.certificateSerialNumber
                      ? <span className="text-amber-700 italic font-sans font-medium text-[10px]">Pending Senate Issuance</span>
                      : matchedStudent.certificateNumber || matchedStudent.certificateSerialNumber || "Pending"
                    }
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase block">Certificate Issue Date</span>
                  <span className="font-semibold text-gray-950">
                    {matchedStudent.certificateStatus === "Pending" && !matchedStudent.certificateIssueDate && !matchedStudent.issueDate
                      ? <span className="text-gray-400 italic font-normal text-[10px]">Not yet issued</span>
                      : matchedStudent.certificateIssueDate || matchedStudent.issueDate || "Under Review"
                    }
                  </span>
                </div>
              </div>

              {/* FIRST PORTION OF ACADEMIC RESULTS (PAGE 1) */}
              <div className="space-y-4">
                <div className="border-b border-gray-900 pb-1.5 flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#006a4e]" />
                    <span>Academic History Record (Part I • {page1Semesters.length} Period{page1Semesters.length > 1 ? "s" : ""})</span>
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-gray-600">
                    Grading Scale: 4.00 Max
                  </span>
                </div>

                {page1Semesters.map((sem, sIdx) => (
                  <div
                    key={sIdx}
                    className="semester-block bg-white rounded-xl border border-gray-300 overflow-hidden shadow-2xs"
                  >
                    {/* Semester Header with GPA */}
                    <div className="bg-gray-100 p-2.5 px-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-gray-300 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#006a4e]" />
                        <h5 className="font-extrabold text-[11px] uppercase tracking-wide text-black">
                          {sem.semesterName}
                        </h5>
                        {sem.publicationDate && (
                          <span className="text-[10px] text-gray-500 font-mono">
                            • Published: {sem.publicationDate}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-600 font-medium">
                          Period GPA:
                        </span>
                        <span className="text-xs font-black font-mono text-[#006a4e] bg-white border border-gray-300 px-2 py-0.5 rounded-md">
                          {sem.semesterGpa.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Compact Subject Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse print-compact-table">
                        <thead>
                          <tr className="border-b border-gray-200 text-[10px] font-bold uppercase text-gray-600 bg-gray-50">
                            <th className="py-1.5 px-2 text-center w-8">SL</th>
                            <th className="py-1.5 px-3">Subject Code</th>
                            <th className="py-1.5 px-3">Course Title / Subject Name</th>
                            <th className="py-1.5 px-2 text-center">Credit</th>
                            <th className="py-1.5 px-2 text-center">Marks</th>
                            <th className="py-1.5 px-2 text-center">Grade Point</th>
                            <th className="py-1.5 px-2 text-center">Letter Grade</th>
                            <th className="py-1.5 px-3 text-center">Result</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-[11px]">
                          {sem.subjects.map((sub, subIdx) => (
                            <tr key={subIdx} className="hover:bg-gray-50/50">
                              <td className="py-1.5 px-2 text-center font-mono font-bold text-gray-700">
                                {sub.serialNo || (sub.displayOrder ? String(sub.displayOrder).padStart(2, "0") : String(subIdx + 1).padStart(2, "0"))}
                              </td>
                              <td className="py-1.5 px-3 font-mono font-bold text-gray-950">
                                {sub.subjectCode || "N/A"}
                              </td>
                              <td className="py-1.5 px-3 font-medium text-gray-950">
                                {sub.subjectName}
                              </td>
                              <td className="py-1.5 px-2 text-center font-mono text-gray-700">
                                {sub.credit || sub.credits || 3}
                              </td>
                              <td className="py-1.5 px-2 text-center font-mono font-semibold text-gray-900">
                                {sub.marks ?? "—"}
                              </td>
                              <td className="py-1.5 px-2 text-center font-mono font-extrabold text-[#006a4e]">
                                {sub.gradePoint !== undefined ? sub.gradePoint.toFixed(2) : "0.00"}
                              </td>
                              <td className="py-1.5 px-2 text-center font-bold">
                                <span className="px-1.5 py-0.2 bg-emerald-50 rounded border border-emerald-200 text-[10px] text-emerald-900 print:border-none print:p-0 print:bg-transparent">
                                  {sub.letterGrade || (sub.gradePoint >= 4.0 ? "A+" : sub.gradePoint >= 3.75 ? "A" : sub.gradePoint >= 3.5 ? "A-" : sub.gradePoint >= 3.0 ? "B" : sub.gradePoint >= 2.0 ? "C" : "F")}
                                </span>
                              </td>
                              <td className="py-1.5 px-3 text-center font-bold text-[10px]">
                                <span className={sub.gradePoint >= 2.0 ? "text-emerald-800" : "text-red-700"}>
                                  {sub.gradePoint >= 2.0 ? "Passed" : "Failed"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>

              {/* Page 1 Bottom Footer Indicator */}
              <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                <span>Security Ledger: BNIE-{matchedStudent.rollNumber}-{matchedStudent.passingYear}</span>
                <span className="font-bold text-[#006a4e]">
                  {isTwoPage ? "Page 1 of 2 • Transcript continues on Page 2 ➔" : "Page 1 of 1 • End of Official Transcript"}
                </span>
              </div>

            </div>

            {/* ========================================================================= */}
            {/* MARKSHEET PAGE 2 OF 2 (Continuous Continuation on Next Page)             */}
            {/* ========================================================================= */}
            {isTwoPage && (
              <div 
                id="marksheet-page-2"
                className="marksheet-page-2 bg-white rounded-3xl border-2 border-gray-300 shadow-md p-6 sm:p-8 space-y-5"
              >
                
                {/* Page 2 Minimalist Continuation Header (Saves space without repeating full photo/details) */}
                <div className="border-b-2 border-gray-900 pb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 shrink-0">
                      <Logo size={36} />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-950 font-sans text-sm">
                        Bangladesh National Institute of Education (BNIE)
                      </h3>
                      <p className="text-[10px] text-gray-600 font-semibold">
                        Official Academic Transcript Continuation • <span className="text-[#006a4e] font-bold">Page 2 of 2</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-[10px] font-mono text-gray-700 bg-gray-50 p-1.5 px-2.5 rounded-lg border border-gray-200">
                    <div><strong>Candidate:</strong> {matchedStudent.name}</div>
                    <div><strong>ID:</strong> {matchedStudent.id} • <strong>Roll:</strong> {matchedStudent.rollNumber}</div>
                  </div>
                </div>

                {/* SECOND PORTION OF ACADEMIC RESULTS (PAGE 2) */}
                <div className="space-y-4">
                  <div className="border-b border-gray-900 pb-1.5 flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#006a4e]" />
                      <span>Academic History Record (Part II • Continuation • {page2Semesters.length} Period{page2Semesters.length > 1 ? "s" : ""})</span>
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-gray-600">
                      Evaluation Endpoint: {displayedEndpointPeriod}
                    </span>
                  </div>

                  {page2Semesters.map((sem, sIdx) => (
                    <div
                      key={sIdx}
                      className="semester-block bg-white rounded-xl border border-gray-300 overflow-hidden shadow-2xs"
                    >
                      {/* Semester Header with GPA */}
                      <div className="bg-gray-100 p-2.5 px-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-gray-300 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#006a4e]" />
                          <h5 className="font-extrabold text-[11px] uppercase tracking-wide text-black">
                            {sem.semesterName}
                          </h5>
                          {sem.publicationDate && (
                            <span className="text-[10px] text-gray-500 font-mono">
                              • Published: {sem.publicationDate}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-gray-600 font-medium">
                            Period GPA:
                          </span>
                          <span className="text-xs font-black font-mono text-[#006a4e] bg-white border border-gray-300 px-2 py-0.5 rounded-md">
                            {sem.semesterGpa.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Compact Subject Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse print-compact-table">
                          <thead>
                            <tr className="border-b border-gray-200 text-[10px] font-bold uppercase text-gray-600 bg-gray-50">
                              <th className="py-1.5 px-2 text-center w-8">SL</th>
                              <th className="py-1.5 px-3">Subject Code</th>
                              <th className="py-1.5 px-3">Course Title / Subject Name</th>
                              <th className="py-1.5 px-2 text-center">Credit</th>
                              <th className="py-1.5 px-2 text-center">Marks</th>
                              <th className="py-1.5 px-2 text-center">Grade Point</th>
                              <th className="py-1.5 px-2 text-center">Letter Grade</th>
                              <th className="py-1.5 px-3 text-center">Result</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-[11px]">
                            {sem.subjects.map((sub, subIdx) => (
                              <tr key={subIdx} className="hover:bg-gray-50/50">
                                <td className="py-1.5 px-2 text-center font-mono font-bold text-gray-700">
                                  {sub.serialNo || (sub.displayOrder ? String(sub.displayOrder).padStart(2, "0") : String(subIdx + 1).padStart(2, "0"))}
                                </td>
                                <td className="py-1.5 px-3 font-mono font-bold text-gray-950">
                                  {sub.subjectCode || "N/A"}
                                </td>
                                <td className="py-1.5 px-3 font-medium text-gray-950">
                                  {sub.subjectName}
                                </td>
                                <td className="py-1.5 px-2 text-center font-mono text-gray-700">
                                  {sub.credit || sub.credits || 3}
                                </td>
                                <td className="py-1.5 px-2 text-center font-mono font-semibold text-gray-900">
                                  {sub.marks ?? "—"}
                                </td>
                                <td className="py-1.5 px-2 text-center font-mono font-extrabold text-[#006a4e]">
                                  {sub.gradePoint !== undefined ? sub.gradePoint.toFixed(2) : "0.00"}
                                </td>
                                <td className="py-1.5 px-2 text-center font-bold">
                                  <span className="px-1.5 py-0.2 bg-emerald-50 rounded border border-emerald-200 text-[10px] text-emerald-900 print:border-none print:p-0 print:bg-transparent">
                                    {sub.letterGrade || (sub.gradePoint >= 4.0 ? "A+" : sub.gradePoint >= 3.75 ? "A" : sub.gradePoint >= 3.5 ? "A-" : sub.gradePoint >= 3.0 ? "B" : sub.gradePoint >= 2.0 ? "C" : "F")}
                                  </span>
                                </td>
                                <td className="py-1.5 px-3 text-center font-bold text-[10px]">
                                  <span className={sub.gradePoint >= 2.0 ? "text-emerald-800" : "text-red-700"}>
                                    {sub.gradePoint >= 2.0 ? "Passed" : "Failed"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CUMULATIVE SUMMARY BREAKDOWN BOX */}
                <div className="bg-emerald-50/70 border-2 border-[#006a4e]/30 rounded-xl p-4 space-y-3">
                  <div className="border-b border-emerald-200 pb-1.5 flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#006a4e] flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Cumulative Academic Achievement &amp; Final Result Evaluation</span>
                    </h4>
                    <span className="text-[10px] font-mono text-gray-600">Scale: 4.00 Max</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                      <span className="text-[9px] font-bold uppercase text-gray-500 block">Periods Evaluated</span>
                      <span className="text-base font-black text-gray-950 font-mono">{filteredSemesters.length} Completed</span>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                      <span className="text-[9px] font-bold uppercase text-gray-500 block">Total Credits Completed</span>
                      <span className="text-base font-black text-gray-950 font-mono">{computedTotalCredits || (filteredSemesters.length * 16)} Credits</span>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border-2 border-[#006a4e] shadow-2xs">
                      <span className="text-[9px] font-bold uppercase text-[#006a4e] block">Cumulative CGPA (Max: 4.00)</span>
                      <span className="text-xl font-black text-[#006a4e] font-mono">{computedCgpa.toFixed(2)}</span>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-emerald-200">
                      <span className="text-[9px] font-bold uppercase text-gray-500 block">Official Result Status</span>
                      <span className="text-xs font-black text-emerald-800 uppercase block mt-1">
                        {matchedStudent.resultStatus || "Passed"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* GRADING SCALE REFERENCE BAR */}
                <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-[9px] text-gray-600">
                  <span className="font-bold text-gray-900 mr-2">Institutional Grading Scale (4.00):</span>
                  <span>A+ (4.00, 80%+), A (3.75, 75-79%), A- (3.50, 70-74%), B+ (3.25, 65-69%), B (3.00, 60-64%), B- (2.75, 55-59%), C+ (2.50, 50-54%), D (2.00, 40-49%), F (0.00, Fail).</span>
                </div>

                {/* INSTITUTION SEAL AND AUTHORIZED SIGNATURES */}
                <div className="pt-5 border-t-2 border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 font-bold text-gray-800">
                      <Landmark className="w-3.5 h-3.5 text-[#006a4e]" />
                      <span>Bangladesh National Institute of Education</span>
                    </div>
                    <p className="text-[9px] text-gray-500">
                      This official transcript was electronically generated and authenticated from the secure institutional ledger.
                    </p>
                    <p className="text-[9px] font-mono text-gray-400">
                      Security Fingerprint: BNIE-{matchedStudent.rollNumber}-{matchedStudent.passingYear}-{matchedStudent.secureToken?.slice(0, 8) || "SEC400"}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center space-y-1">
                      <div className="w-28 border-b border-gray-500 pb-0.5 font-serif italic text-xs text-gray-800">
                        Controller of Exam
                      </div>
                      <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wider block">
                        Controller of Examinations
                      </span>
                    </div>

                    <div className="text-center space-y-1">
                      <div className="w-28 border-b border-gray-500 pb-0.5 font-serif italic text-xs text-gray-800">
                        Registrar &amp; Secretary
                      </div>
                      <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wider block">
                        Registrar &amp; Secretary
                      </span>
                    </div>
                  </div>
                </div>

                {/* Page 2 Bottom Footer Indicator */}
                <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                  <span>Record Verified at bnie.edu.bd/degree-marksheet-result</span>
                  <span className="font-bold text-[#006a4e]">
                    Page 2 of 2 • End of Official Transcript
                  </span>
                </div>

              </div>
            )}

          </motion.div>
        )}

      </div>
    </div>
  );
}
