import { useState, useEffect, FormEvent } from "react";
import { Student, Category, SemesterResult } from "../types";
import { 
  GraduationCap, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  ArrowLeft, 
  Calendar, 
  RotateCcw, 
  Download,
  Layers,
  FileText,
  Eye,
  Check,
  Loader2
} from "lucide-react";
import Logo from "./Logo";
import { motion } from "motion/react";
import { QRCodeCanvas } from "qrcode.react";
import { PASSPORT_AVATARS } from "../data/defaultStudents";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { patchGetComputedStyle } from "../lib/colorUtils";
import { findStudentInDatabase } from "../lib/firebase";

interface DegreeResultVerificationPageProps {
  students: Student[];
  isDbLoading?: boolean;
  onBackToHome: () => void;
  onNavigateToAdmin?: () => void;
  onNavigateToSscHscVerify?: () => void;
  onStudentFound?: (student: Student) => void;
}

export type ExamType = "Degree Pass" | "Honours" | "Masters";

export interface PeriodOption {
  value: string;
  label: string;
  index: number;
}

export const EXAM_TYPE_PERIODS: Record<ExamType, PeriodOption[]> = {
  "Degree Pass": [
    { value: "ALL", label: "Complete 3-Year Academic Transcript (All Years)", index: 99 },
    { value: "Year 3", label: "Year 3 (Third / Final Year)", index: 3 },
    { value: "Year 2", label: "Year 2 (Second Year)", index: 2 },
    { value: "Year 1", label: "Year 1 (First Year)", index: 1 }
  ],
  "Honours": [
    { value: "ALL", label: "Complete Academic Transcript (All Years & Semesters)", index: 99 },
    { value: "Year 3", label: "3rd Year (Historical 3-Year Honours Final)", index: 93 },
    { value: "Year 2", label: "2nd Year (Historical 3-Year Honours)", index: 92 },
    { value: "Year 1", label: "1st Year (Historical 3-Year Honours)", index: 91 },
    { value: "Semester 8", label: "Semester 8 (Modern 4-Year Final)", index: 8 },
    { value: "Semester 7", label: "Semester 7", index: 7 },
    { value: "Semester 6", label: "Semester 6", index: 6 },
    { value: "Semester 5", label: "Semester 5", index: 5 },
    { value: "Semester 4", label: "Semester 4", index: 4 },
    { value: "Semester 3", label: "Semester 3", index: 3 },
    { value: "Semester 2", label: "Semester 2", index: 2 },
    { value: "Semester 1", label: "Semester 1", index: 1 }
  ],
  "Masters": [
    { value: "ALL", label: "Complete Academic Transcript (All Semesters)", index: 99 },
    { value: "Semester 4", label: "Semester 4 (Final)", index: 4 },
    { value: "Semester 3", label: "Semester 3", index: 3 },
    { value: "Semester 2", label: "Semester 2", index: 2 },
    { value: "Semester 1", label: "Semester 1", index: 1 }
  ]
};

export default function DegreeResultVerificationPage({
  students,
  isDbLoading = false,
  onBackToHome,
  onNavigateToAdmin,
  onNavigateToSscHscVerify,
  onStudentFound
}: DegreeResultVerificationPageProps) {
  // Required search fields according to prompt specification
  const [studentIdInput, setStudentIdInput] = useState("");
  const [examType, setExamType] = useState<ExamType>("Honours");
  const [passingYear, setPassingYear] = useState("2024");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Semester 8");

  // Search Results State
  const [matchedStudent, setMatchedStudent] = useState<Student | null>(null);
  const [multiMatchStudents, setMultiMatchStudents] = useState<Student[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [crossPortalMatches, setCrossPortalMatches] = useState<Student[]>([]);
  const [autoSwitchNotice, setAutoSwitchNotice] = useState<string | null>(null);
  const [displayedEndpointPeriod, setDisplayedEndpointPeriod] = useState<string>("ALL");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [inputTouched, setInputTouched] = useState(false);

  // Client-side Sanitization and Validation Helper for Degree Credentials
  const sanitizeCredential = (val: string): string => {
    return val.replace(/[<>{};$%\\^`~]/g, "").trim();
  };

  const validateCredentialInput = (val: string): string => {
    const clean = val.trim();
    if (!clean) {
      return "Please enter a Student ID, Roll Number, or Registration Number.";
    }
    if (/[<>{};$%\\^`~]/.test(val)) {
      return "Prohibited characters detected. Please use only letters, numbers, hyphens, and spaces.";
    }
    if (clean.length < 4) {
      return `Credential identifier must be at least 4 characters (currently ${clean.length}).`;
    }
    if (clean.length > 30) {
      return "Credential identifier cannot exceed 30 characters.";
    }
    return "";
  };

  // Real-time format recognition hint helper
  const getFormatHint = (input: string): { type: "info" | "success" | "warning"; text: string } | null => {
    const trimmed = input.trim();
    if (!trimmed) return null;
    
    // Check for prohibited injection characters
    if (/[<>{};$%\\^`~]/.test(trimmed)) {
      return {
        type: "warning",
        text: "Special characters detected. Please use only letters, numbers, hyphens, and spaces."
      };
    }
    
    // 6-digit numeric roll number
    if (/^\d{6}$/.test(trimmed)) {
      return {
        type: "success",
        text: "Detected: 6-Digit Numeric Roll Number (e.g., 771001, 584217, 731846)"
      };
    }
    
    // 10-digit year-based registration number (YYYYNNNNNN)
    if (/^(19|20)\d{8}$/.test(trimmed)) {
      return {
        type: "success",
        text: `Detected: Year-Based Registration Number (Registration Year: ${trimmed.slice(0, 4)})`
      };
    }
    
    // Standard registration number
    if (/^\d{7,12}$/.test(trimmed)) {
      return {
        type: "info",
        text: "Detected: Numeric Registration Number"
      };
    }
    
    // Institutional prefix IDs (BNIE-..., ENG-..., BBA-..., MBA-..., BA-...)
    if (/^(bnie|eng|bba|mba|ba|bsc|mss|ma|act|his)-/i.test(trimmed)) {
      return {
        type: "success",
        text: "Detected: Institutional Student ID / Program Code"
      };
    }
    
    // Student Name query
    if (/^[a-zA-Z\s.]{3,}$/.test(trimmed)) {
      return {
        type: "info",
        text: "Detected: Candidate Name search query"
      };
    }
    
    return {
      type: "info",
      text: "Format: Student ID, Roll No (6 digits), or Registration No"
    };
  };

  // View mode toggle: standard on-screen vs print/PDF preview (compact subject codes)
  const [viewMode, setViewMode] = useState<"standard" | "compact_preview">("standard");

  // Dynamic available passing years: include "ALL", all distinct years from students, plus years 1971 - currentYear+1
  const availableYears = (() => {
    const studentYears = students.map((s) => s.passingYear).filter(Boolean);
    const standardYears = Array.from(
      { length: new Date().getFullYear() - 1970 + 2 },
      (_, i) => (new Date().getFullYear() + 1 - i).toString()
    );
    const unique = Array.from(new Set([...studentYears, ...standardYears])).sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
    return ["ALL", ...unique];
  })();

  // Whenever Exam Type changes, update default selected period
  const handleExamTypeChange = (newType: ExamType) => {
    setExamType(newType);
    const periods = EXAM_TYPE_PERIODS[newType];
    const defaultPeriod = periods[0]?.value || "ALL";
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
      setSelectedPeriod(periods[0]?.value || "ALL");
    }

    if (id && students.length > 0) {
      setStudentIdInput(id);
      performSearch(id, initialExam, yearParam || passingYear, periodParam || "ALL");
    }
  }, [students]);

  // Execute Search with Strict Validation, Multi-Record Disambiguation & Cross-Portal Detection
  const performSearch = async (
    queryId: string, 
    type: ExamType, 
    year: string, 
    period: string
  ) => {
    if (isSearching) return;
    const rawTrimmed = queryId.trim();
    const cleanId = sanitizeCredential(queryId).toLowerCase();
    
    // Reset transient feedback
    setCrossPortalMatches([]);
    setAutoSwitchNotice(null);

    // Client-Side Sanitization & Immediate Validation: Validate before starting search query
    setInputTouched(true);
    const valErr = validateCredentialInput(queryId);
    if (valErr) {
      setValidationError(valErr);
      setSearchError(valErr);
      setMatchedStudent(null);
      setMultiMatchStudents([]);
      setHasSearched(true);
      return; // STOP: Halt execution before initiating database or Firebase query
    }
    setValidationError("");

    setIsSearching(true);
    try {
      // Small asynchronous delay for visual spinner and preventing duplicate clicks
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Filter only Higher Education candidates (Degree Pass, Honours, Masters)
      const higherEdStudents = students.filter(
        (s) =>
          s.category === Category.DEGREE_PASS ||
          s.category === Category.HONOURS ||
          s.category === Category.MASTERS ||
          Boolean(s.academicLevel) ||
          Boolean(s.programCode)
      );

      const isMatchIdent = (s: Student) => {
        const matchId = s.id && s.id.toLowerCase().includes(cleanId);
        const matchRoll = s.rollNumber && s.rollNumber.toLowerCase().includes(cleanId);
        const matchReg = s.registrationNumber && s.registrationNumber.toLowerCase().includes(cleanId);
        const matchToken = s.secureToken && s.secureToken.toLowerCase() === cleanId;
        const matchCert = s.certificateSerialNumber && s.certificateSerialNumber.toLowerCase().includes(cleanId);
        const matchCert2 = s.certificateNumber && s.certificateNumber.toLowerCase().includes(cleanId);
        const matchRollSuffix = s.rollNumber && s.rollNumber.toLowerCase().endsWith(`-${cleanId}`);
        const matchRegSuffix = s.registrationNumber && s.registrationNumber.toLowerCase().endsWith(`-${cleanId}`);
        const matchName = s.name && s.name.toLowerCase().includes(cleanId);
        const matchMajor = s.majorSubject && s.majorSubject.toLowerCase().includes(cleanId);
        const matchSession = s.session && s.session.toLowerCase().includes(cleanId);
        return Boolean(matchId || matchRoll || matchReg || matchToken || matchCert || matchCert2 || matchRollSuffix || matchRegSuffix || matchName || matchMajor || matchSession);
      };

      const isMatchCat = (s: Student, t: ExamType) => {
        if (t === "Degree Pass") return s.category === Category.DEGREE_PASS || s.academicLevel === "Degree Pass";
        if (t === "Honours") return s.category === Category.HONOURS || s.academicLevel === "Honours";
        if (t === "Masters") return s.category === Category.MASTERS || s.academicLevel === "Masters";
        return true;
      };

      const isMatchYr = (s: Student, yr: string) => {
        if (!yr || yr === "ALL") return true;
        return s.passingYear === yr;
      };

      // Step 1: Matching identifier, category AND year
      let matches = higherEdStudents.filter((s) => isMatchIdent(s) && isMatchCat(s, type) && isMatchYr(s, year));

      // Step 2: If none found and a specific year was picked, look without the year filter
      if (matches.length === 0 && year !== "ALL") {
        matches = higherEdStudents.filter((s) => isMatchIdent(s) && isMatchCat(s, type));
      }

      // Step 3: If still none found under selected category, search across all higher ed qualifications
      if (matches.length === 0) {
        matches = higherEdStudents.filter((s) => isMatchIdent(s));
      }

      if (matches.length === 1) {
        const single = matches[0];
        setMatchedStudent(single);
        setMultiMatchStudents([]);
        setSearchError("");
        setDisplayedEndpointPeriod(period);

        // Detect if qualification auto-switched
        const actualLevel: ExamType = 
          single.category === Category.DEGREE_PASS || single.academicLevel === "Degree Pass"
            ? "Degree Pass"
            : single.category === Category.MASTERS || single.academicLevel === "Masters"
            ? "Masters"
            : "Honours";

        if (actualLevel !== type) {
          setAutoSwitchNotice(`Auto-detected qualification: ${actualLevel} (switched from ${type}).`);
          setExamType(actualLevel);
        }
      } else if (matches.length > 1) {
        setMatchedStudent(null);
        setMultiMatchStudents(matches);
        setSearchError("");
        setDisplayedEndpointPeriod(period);
      } else {
        // Step 4: Check live Firestore database directly if student was recently added from another device/window
        let liveStudent: Student | null = null;
        try {
          liveStudent = await findStudentInDatabase(cleanId, cleanId);
          if (liveStudent) {
            onStudentFound?.(liveStudent);
            const isHigherEd =
              liveStudent.category === Category.DEGREE_PASS ||
              liveStudent.category === Category.HONOURS ||
              liveStudent.category === Category.MASTERS ||
              Boolean(liveStudent.academicLevel);

            if (isHigherEd) {
              setMatchedStudent(liveStudent);
              setMultiMatchStudents([]);
              setSearchError("");
              setDisplayedEndpointPeriod(period);
              setHasSearched(true);
              return;
            }
          }
        } catch (dbErr) {
          console.warn("Live database query fallback failed in DegreeResultVerificationPage:", dbErr);
        }

        // Step 5: Cross-Portal Detection: Check if query matches an SSC, HSC or Diploma student
        const crossMatches = students.filter(
          (s) =>
            (s.category === Category.SSC ||
             s.category === Category.HSC ||
             s.category === Category.DIPLOMA) &&
            (s.rollNumber?.toLowerCase() === cleanId ||
             s.registrationNumber?.toLowerCase() === cleanId ||
             s.id?.toLowerCase() === cleanId ||
             (s.name?.toLowerCase().includes(cleanId) && cleanId.length > 3))
        );

        if (liveStudent && !crossMatches.some(s => s.id === liveStudent!.id)) {
          crossMatches.push(liveStudent);
        }

        setMatchedStudent(null);
        setMultiMatchStudents([]);
        if (crossMatches.length > 0) {
          setCrossPortalMatches(crossMatches);
          setSearchError("");
        } else {
          setSearchError(`No accredited record found matching "${rawTrimmed}" under ${type}${year !== "ALL" ? ` (${year})` : ""}.`);
        }
      }

      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectDisambiguatedStudent = (selected: Student) => {
    setMatchedStudent(selected);
    setMultiMatchStudents([]);
    setSearchError("");
    setDisplayedEndpointPeriod(selectedPeriod);
    if (selected.category === Category.DEGREE_PASS || selected.academicLevel === "Degree Pass") {
      setExamType("Degree Pass");
    } else if (selected.category === Category.MASTERS || selected.academicLevel === "Masters") {
      setExamType("Masters");
    } else {
      setExamType("Honours");
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    performSearch(studentIdInput, examType, passingYear, selectedPeriod);
  };

  const handleReset = () => {
    setStudentIdInput("");
    setInputTouched(false);
    setMatchedStudent(null);
    setMultiMatchStudents([]);
    setHasSearched(false);
    setSearchError("");
    setValidationError("");
    setCrossPortalMatches([]);
    setAutoSwitchNotice(null);
  };

  // Filter semesterResults according to selected academic period or synthesize from subjects
  const getEffectivePeriods = (student: Student, periodValue: string): SemesterResult[] => {
    // 1. If explicit semesterResults exist (common in modern modular/semester records)
    if (student.semesterResults && student.semesterResults.length > 0) {
      if (periodValue === "ALL") {
        return student.semesterResults;
      }
      if (periodValue.startsWith("Year") || periodValue.includes("Year")) {
        const numMatch = periodValue.match(/\d+/);
        const yNum = numMatch ? parseInt(numMatch[0], 10) : 1;
        const matched = student.semesterResults.filter(
          (s) =>
            s.semesterName.toLowerCase().includes(`year ${yNum}`) ||
            s.semesterName.toLowerCase().includes(`${yNum}st year`) ||
            s.semesterName.toLowerCase().includes(`${yNum}nd year`) ||
            s.semesterName.toLowerCase().includes(`${yNum}rd year`)
        );
        if (matched.length > 0) return matched;
        return student.semesterResults.slice(0, Math.min(yNum, student.semesterResults.length));
      }
      const numMatch = periodValue.match(/\d+/);
      const targetIndex = numMatch ? parseInt(numMatch[0], 10) : student.semesterResults.length;
      return student.semesterResults.slice(0, Math.min(targetIndex, student.semesterResults.length));
    }

    // 2. Synthesize periods from subjects array (for historical 3-Year B.A. Honours & Degree Pass records)
    if (student.subjects && student.subjects.length > 0) {
      const distinctYears = Array.from(new Set(student.subjects.map((s) => s.year).filter(Boolean)));
      if (distinctYears.length > 1) {
        const periods: SemesterResult[] = distinctYears.map((yr) => {
          const yearSubs = student.subjects!.filter((s) => s.year === yr);
          const fullSum = yearSubs.reduce((sum, s) => sum + (s.fullMarks || 100), 0);
          const marksSum = yearSubs.reduce((sum, s) => sum + (s.marks || 0), 0);
          return {
            semesterName: yr as string,
            semesterGpa: fullSum > 0 ? (marksSum / fullSum) * 4.0 : 0,
            totalCredits: yearSubs.reduce((sum, s) => sum + (s.credit || s.credits || 3), 0),
            publicationDate: student.resultPublicationDate || student.passingYear,
            subjects: yearSubs
          };
        });

        if (periodValue === "ALL") return periods;
        const filtered = periods.filter((p) => p.semesterName.toLowerCase().includes(periodValue.toLowerCase()));
        return filtered.length > 0 ? filtered : periods;
      }

      // Single block
      return [
        {
          semesterName: student.examinationTitle || (student.academicLevel ? `${student.academicLevel} Examination` : "Annual Examination"),
          semesterGpa: student.finalGpa || 0,
          totalCredits: student.subjects.reduce((sum, s) => sum + (s.credit || s.credits || 3), 0),
          publicationDate: student.resultPublicationDate || student.passingYear,
          subjects: student.subjects
        }
      ];
    }

    return [];
  };

  // Determine whether candidate is a historical record using Division/Class instead of GPA
  const isHistorical = matchedStudent?.gradingSystem === "GPA"
    ? false
    : Boolean(
        matchedStudent?.isHistoricalRecord ||
        matchedStudent?.gradingSystem === "Class" ||
        matchedStudent?.gradingSystem === "Division" ||
        (matchedStudent?.passingYear && parseInt(matchedStudent.passingYear, 10) <= 2000)
      );

  // Exact marksheet title without ever combining "Honours / Degree Pass"
  const getMarksheetTitle = () => {
    if (matchedStudent?.examinationTitle) {
      return matchedStudent.examinationTitle.toUpperCase();
    }
    const isDegreePass = examType === "Degree Pass" || matchedStudent?.category === Category.DEGREE_PASS || matchedStudent?.academicLevel === "Degree Pass";
    if (isDegreePass) {
      return "BACHELOR OF ARTS (B.A.) DEGREE PASS EXAMINATION";
    }
    const isHonours = examType === "Honours" || matchedStudent?.category === Category.HONOURS || matchedStudent?.academicLevel === "Honours";
    if (isHonours) {
      const major = matchedStudent?.majorSubject || "History";
      return `BACHELOR OF ARTS (B.A.) HONOURS EXAMINATION${major ? ` IN ${major.toUpperCase()}` : ""}`;
    }
    return "MASTER OF ARTS (M.A.) EXAMINATION";
  };

  // Calculate Cumulative Grade Point Average (CGPA) and Total Credits up to the selected period
  const calculateCgpaUpToPeriod = (filtered: SemesterResult[]) => {
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

  const filteredSemesters = matchedStudent ? getEffectivePeriods(matchedStudent, displayedEndpointPeriod) : [];
  const { cgpa: computedCgpa, totalCredits: computedTotalCredits } = matchedStudent 
    ? calculateCgpaUpToPeriod(filteredSemesters) 
    : { cgpa: 0, totalCredits: 0 };

  // Total full marks and total obtained marks calculations
  const totalFullMarks = matchedStudent?.totalFullMarks || (
    matchedStudent?.subjects?.reduce((sum, s) => sum + (s.fullMarks || 100), 0)
  ) || (filteredSemesters.reduce((sum, sem) => sum + sem.subjects.reduce((sSum, sub) => sSum + (sub.fullMarks || 100), 0), 0)) || 1600;

  const totalObtainedMarks = matchedStudent?.totalMarks || (
    matchedStudent?.subjects?.reduce((sum, s) => sum + (s.marks || 0), 0)
  ) || (filteredSemesters.reduce((sum, sem) => sum + sem.subjects.reduce((sSum, sub) => sSum + (sub.marks || 0), 0), 0)) || 0;

  const percentageValue = matchedStudent?.percentage || (totalFullMarks > 0 ? Math.round((totalObtainedMarks / totalFullMarks) * 1000) / 10 : 0);

  const currentPeriods = EXAM_TYPE_PERIODS[examType];

  // =========================================================================
  // TWO-PAGE A4 DIVISION LOGIC
  // =========================================================================
  // Total subjects count across all evaluated academic periods
  const totalSubjectsCount = filteredSemesters.reduce((sum, sem) => sum + sem.subjects.length, 0);

  // For historical records (1990-2000, 1994, 2000) or programmes with <= 20 subjects,
  // keep the entire transcript on ONE single, authentic, print-ready A4 sheet.
  // Two-page layout is only applied for large modular programmes with > 20 courses (e.g. 8-semester BBA/MBA).
  const isTwoPage = !isHistorical && (filteredSemesters.length > 3 || totalSubjectsCount > 20);
  const splitIndex = filteredSemesters.length <= 1 
    ? 1 
    : Math.ceil(filteredSemesters.length / 2);

  const page1Semesters = isTwoPage ? filteredSemesters.slice(0, splitIndex) : filteredSemesters;
  const page2Semesters = isTwoPage ? filteredSemesters.slice(splitIndex) : [];

  // Trigger browser direct print dialog
  const handlePrint = () => {
    window.print();
  };

  // High-fidelity Multi-Page A4 PDF Generator
  const handleDownloadPDF = async () => {
    const page1Element = document.getElementById("marksheet-page-1");
    if (!page1Element) {
      alert("Marksheet document not found!");
      return;
    }

    setIsGeneratingPdf(true);
    const restoreWindowStyles = patchGetComputedStyle(window);

    try {
      const renderScale = 2.5;

      // Render Page 1
      const canvas1 = await html2canvas(page1Element, {
        scale: renderScale,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 1024,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 5;
      const printableWidth = pdfWidth - margin * 2;
      const printableHeight = pdfHeight - margin * 2;

      // Add Page 1 to PDF
      const img1Data = canvas1.toDataURL("image/jpeg", 0.95);
      const ratio1 = canvas1.height / canvas1.width;
      let img1Height = printableWidth * ratio1;
      let img1Width = printableWidth;
      if (img1Height > printableHeight) {
        img1Height = printableHeight;
        img1Width = printableHeight / ratio1;
      }
      const x1 = margin + (printableWidth - img1Width) / 2;
      pdf.addImage(img1Data, "JPEG", x1, margin, img1Width, img1Height);

      // Render Page 2 if applicable
      const page2Element = document.getElementById("marksheet-page-2");
      if (isTwoPage && page2Element) {
        const canvas2 = await html2canvas(page2Element, {
          scale: renderScale,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: 1024,
        });

        const img2Data = canvas2.toDataURL("image/jpeg", 0.95);
        const ratio2 = canvas2.height / canvas2.width;
        let img2Height = printableWidth * ratio2;
        let img2Width = printableWidth;
        if (img2Height > printableHeight) {
          img2Height = printableHeight;
          img2Width = printableHeight / ratio2;
        }
        const x2 = margin + (printableWidth - img2Width) / 2;
        pdf.addPage();
        pdf.addImage(img2Data, "JPEG", x2, margin, img2Width, img2Height);
      }

      const cleanFileName = `BNIE-Marksheet-${matchedStudent?.rollNumber || matchedStudent?.id || "transcript"}.pdf`.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      pdf.save(cleanFileName);
    } catch (err) {
      console.error("PDF generation error, falling back to print:", err);
      window.print();
    } finally {
      restoreWindowStyles();
      setIsGeneratingPdf(false);
    }
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

      {/* Schema.org ItemPage Structured Data for Google Indexing & AI Search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemPage",
            "name": "BNIE Degree, Honours & Masters Result Check | Marksheet Verification",
            "alternateName": [
              "বিএনআইই ডিগ্রি ও অনার্স রেজাল্ট",
              "BNIE Degree Result",
              "BNIE Honours Result",
              "BNIE Masters Result",
              "BNIE Marksheet Verification"
            ],
            "description": "Online BNIE student result check and marksheet verification for Bachelor Degree, Honours, and Masters programs at Bangladesh National Institute of Education.",
            "url": "https://bnie.edu.bd/?page=degree-marksheet-result",
            "provider": {
              "@type": "EducationalOrganization",
              "name": "Bangladesh National Institute of Education (BNIE)",
              "url": "https://bnie.edu.bd/"
            }
          })
        }}
      />

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
                  BNIE Degree, Honours &amp; Masters — Marksheet Result Check
                </h1>
                <p className="text-xs text-gray-600">
                  বিএনআইই ডিগ্রি, অনার্স ও মাস্টার্স পরীক্ষার ফলাফল ও মার্কশিট যাচাইকরণ পোর্টাল • Two-Page Continuous A4 Portrait Marksheet &amp; Verified Official Transcript Portal
                </p>
              </div>
            </div>
          </div>

          {/* SEARCH FORM WITH THE 4 REQUIRED FIELDS */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Field 1: Student ID (also accepts Roll / Registration No) */}
              <div className="md:col-span-4 space-y-1">
                <label 
                  htmlFor="degree-student-credential-input" 
                  className="text-xs font-bold text-black uppercase tracking-wider block"
                >
                  1. Student ID <span className="text-[#006a4e]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="degree-student-credential-input"
                    type="text"
                    disabled={isSearching}
                    value={studentIdInput}
                    aria-required="true"
                    aria-invalid={Boolean(inputTouched && validationError)}
                    aria-describedby={
                      inputTouched && validationError 
                        ? "degree-credential-error-msg" 
                        : "degree-credential-hint-msg"
                    }
                    onBlur={() => {
                      setInputTouched(true);
                      setValidationError(validateCredentialInput(studentIdInput));
                    }}
                    onChange={(e) => {
                      const sanitized = e.target.value.replace(/[<>{};$%\\^`~]/g, "");
                      setStudentIdInput(sanitized);
                      if (inputTouched || sanitized.length > 0) {
                        setValidationError(validateCredentialInput(sanitized));
                      }
                    }}
                    placeholder="e.g. 771001, 2003829105, BNIE-BA-5001"
                    className={`w-full bg-gray-50/70 border rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:bg-white focus:outline-hidden transition-all disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed ${
                      inputTouched && validationError 
                        ? "border-red-500 ring-2 ring-red-100 bg-red-50/20" 
                        : "border-gray-300 focus:border-[#006a4e]"
                    }`}
                  />
                </div>
                {/* Real-time Accessible Format Feedback or Validation Error */}
                {inputTouched && validationError ? (
                  <div 
                    id="degree-credential-error-msg" 
                    role="alert" 
                    aria-live="polite" 
                    className="text-[11px] font-semibold text-red-600 flex items-center gap-1.5 mt-1 bg-red-50 p-2 rounded-lg border border-red-200"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                ) : (() => {
                  const hint = getFormatHint(studentIdInput);
                  if (hint) {
                    return (
                      <div 
                        id="degree-credential-hint-msg" 
                        aria-live="polite" 
                        className={`text-[10px] font-medium flex items-center gap-1 mt-1 ${
                          hint.type === "success" 
                            ? "text-emerald-700 font-semibold" 
                            : hint.type === "warning" 
                            ? "text-amber-700" 
                            : "text-gray-600"
                        }`}
                      >
                        {hint.type === "success" && <Check className="w-3 h-3 text-emerald-600 shrink-0" />}
                        {hint.type === "warning" && <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />}
                        <span>{hint.text}</span>
                      </div>
                    );
                  }
                  return (
                    <p id="degree-credential-hint-msg" className="text-[10px] text-gray-500 mt-1">
                      Minimum 4 characters (Student ID, Roll No, or Year-based Reg)
                    </p>
                  );
                })()}
              </div>

              {/* Field 2: Exam Type */}
              <div className="md:col-span-3 space-y-1">
                <label className="text-xs font-bold text-black uppercase tracking-wider block">
                  2. Exam Type <span className="text-[#006a4e]">*</span>
                </label>
                <select
                  disabled={isSearching}
                  value={examType}
                  onChange={(e) => handleExamTypeChange(e.target.value as ExamType)}
                  className="w-full bg-gray-50/70 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:bg-white focus:border-[#006a4e] focus:outline-hidden cursor-pointer disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  <option value="Honours">Bachelor of Arts (B.A.) Honours</option>
                  <option value="Degree Pass">Bachelor of Arts (B.A.) Degree Pass</option>
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
                  disabled={isSearching}
                  value={passingYear}
                  onChange={(e) => setPassingYear(e.target.value)}
                  className="w-full bg-gray-50/70 border border-gray-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-900 focus:bg-white focus:border-[#006a4e] focus:outline-hidden cursor-pointer disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr === "ALL" ? "All Passing Years (Any Year)" : yr}
                    </option>
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
                  disabled={isSearching}
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full bg-emerald-50/50 border border-emerald-300 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-900 focus:bg-white focus:border-[#006a4e] focus:outline-hidden cursor-pointer disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
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
                    ? "ALL (Complete 3-Year History) • Year 1 (1st Year) • Year 2 (Year 1 to 2) • Year 3 (Final Year)" 
                    : examType === "Honours" 
                    ? "ALL (Complete 4-Year History) • Semester 1 through 8 (Cumulative history up to selected semester)" 
                    : "ALL (Complete Master's History) • Semester 1 through 4 (Cumulative history up to selected semester)"}
                </span>
              </div>
              <span className="font-mono text-gray-500">4.00 CGPA Scale</span>
            </div>

            {/* Field 5: Search Full Marksheet button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              {hasSearched && (
                <button
                  type="button"
                  disabled={isSearching}
                  onClick={handleReset}
                  className="px-4 py-2.5 border border-gray-300 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-700 cursor-pointer transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Search</span>
                </button>
              )}

              <button
                type="submit"
                disabled={isSearching || isDbLoading}
                className="py-2.5 px-6 bg-[#006a4e] hover:bg-[#005a42] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 text-emerald-200 animate-spin" />
                    <span>Searching Academic Ledger...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search Full Marksheet</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* MULTI-RECORD MATCH DISAMBIGUATION LIST */}
        {hasSearched && multiMatchStudents.length > 1 && (
          <div className="bg-white rounded-3xl border-2 border-emerald-300 p-6 sm:p-8 space-y-4 shadow-sm no-print">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#006a4e] flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-gray-950 font-sans">
                  Multiple Academic Records Found ({multiMatchStudents.length})
                </h3>
                <p className="text-xs text-gray-600">
                  Multiple qualification records match your search query. Please select the specific record to view the verified two-page marksheet:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {multiMatchStudents.map((st) => (
                <div 
                  key={st.id}
                  className="p-4 rounded-2xl border border-gray-200 hover:border-[#006a4e] bg-gray-50/60 hover:bg-emerald-50/30 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#006a4e] border border-emerald-200">
                        {st.academicLevel || st.category}
                      </span>
                      <span className="text-[10px] font-mono text-gray-500">
                        Passing Year: <strong>{st.passingYear}</strong>
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-gray-950 font-sans">{st.name}</h4>
                      <p className="text-xs font-semibold text-gray-800">
                        {st.programName || (st.academicLevel ? `${st.academicLevel} Program` : st.category)}
                      </p>
                      {st.majorSubject && (
                        <p className="text-[11px] text-gray-600">
                          Major: <span className="font-semibold text-gray-900">{st.majorSubject}</span>
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-600 bg-white p-2 rounded-xl border border-gray-200">
                      <div><span className="text-gray-400">ID:</span> {st.id}</div>
                      <div><span className="text-gray-400">Roll:</span> {st.rollNumber}</div>
                      <div><span className="text-gray-400">Reg:</span> {st.registrationNumber}</div>
                      <div><span className="text-gray-400">Session:</span> {st.session}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectDisambiguatedStudent(st)}
                    className="w-full py-2 px-4 bg-[#006a4e] hover:bg-[#005a42] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View &amp; Print Full Marksheet</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* QUALIFICATION AUTO-SWITCH FEEDBACK BANNER */}
        {hasSearched && matchedStudent && autoSwitchNotice && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-2xs text-emerald-950 text-xs no-print">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-extrabold text-emerald-900">Program Qualification Auto-Matched</p>
                <p className="text-emerald-800 text-[11px]">{autoSwitchNotice}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-white font-mono text-[10px] font-bold text-[#006a4e] rounded-lg border border-emerald-200">
              Verified Candidate
            </span>
          </div>
        )}

        {/* CROSS-PORTAL DETECTED: FOUND IN SSC / HSC / DIPLOMA SYSTEM */}
        {hasSearched && crossPortalMatches.length > 0 && (
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-2 border-[#006a4e]/40 rounded-3xl p-6 sm:p-7 space-y-4 shadow-sm no-print">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#006a4e] text-white flex items-center justify-center shrink-0 shadow-xs">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#006a4e] bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Cross-Portal Record Found
                  </span>
                  <span className="text-xs font-mono text-gray-500 font-bold">School &amp; Polytechnic Division</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-gray-950 font-sans">
                  Candidate Found in SSC / HSC / Polytechnic Diploma System
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Your search query <strong className="font-mono text-gray-950">"{studentIdInput}"</strong> does not belong to the Higher Education (Degree / Honours / Masters) catalog, but was found in the <strong>SSC / HSC / Diploma Ledger</strong>:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {crossPortalMatches.map((cMatch) => (
                <div key={cMatch.id} className="p-3.5 bg-white rounded-xl border border-emerald-200 space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-[#006a4e]">
                      {cMatch.category}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">
                      Passing Year: <strong>{cMatch.passingYear}</strong>
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900">{cMatch.name}</h4>
                  <div className="text-[10px] font-mono text-gray-600 flex gap-4">
                    <span>Roll: <strong className="text-gray-900">{cMatch.rollNumber}</strong></span>
                    <span>Reg: <strong className="text-gray-900">{cMatch.registrationNumber}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-200/70">
              <span className="text-xs text-emerald-950 font-medium">
                Click below to open the dedicated School &amp; Diploma Marksheet Verification Portal:
              </span>
              {onNavigateToSscHscVerify && (
                <button
                  type="button"
                  onClick={onNavigateToSscHscVerify}
                  className="px-5 py-2.5 bg-[#006a4e] hover:bg-[#005a42] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                  <span>Open SSC / HSC / Diploma Verification Portal</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* SEARCH ERROR / NOT FOUND BANNER */}
        {hasSearched && !matchedStudent && multiMatchStudents.length === 0 && crossPortalMatches.length === 0 && (
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
                {/* Download PDF Button */}
                <button
                  type="button"
                  disabled={isGeneratingPdf}
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#006a4e] hover:bg-[#005a42] text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer disabled:opacity-60"
                  title="Download two-page A4 Marksheet PDF"
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating A4 PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>

                {/* Print Marksheet Button */}
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                  title="Direct Print (A4 Portrait)"
                >
                  <Printer className="w-4 h-4 text-gray-700" />
                  <span>Print Marksheet</span>
                </button>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* MARKSHEET PAGE 1                                                          */}
            {/* ========================================================================= */}
            <div 
              id="marksheet-page-1"
              className="marksheet-page-1 bg-white rounded-lg border-2 border-slate-800 shadow-md p-2 sm:p-2.5 relative overflow-hidden print:border-2 print:shadow-none print:p-1"
            >
              {/* Inner Official Academic Certificate Border */}
              <div className="border border-slate-700 rounded-sm p-4 sm:p-6 space-y-3.5 print:p-3 print:space-y-2.5 bg-white">
                
                {/* Sample Data Disclaimer Watermark */}
                {(!matchedStudent.isVerifiedAcademicRecord || matchedStudent.id.startsWith("BNIE-BA-") || matchedStudent.id.startsWith("BNIE-DEG-PASS-")) && (
                  <div className="border border-dashed border-amber-600/70 bg-amber-50/70 py-1 px-2.5 rounded-sm text-center">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-900">
                      SAMPLE DATA — NOT AN OFFICIAL ACADEMIC RECORD.
                    </span>
                  </div>
                )}

                {/* Institution Header & Letterhead */}
                <div className="border-b-2 border-slate-900 pb-3 text-center space-y-1.5">
                  <div className="flex items-center justify-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0">
                      <Logo size={56} />
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 block">
                        Autonomous Higher Education Council • Government of the People's Republic of Bangladesh
                      </span>
                      <h2 className="text-lg sm:text-2xl font-black text-slate-950 font-serif tracking-tight uppercase">
                        {matchedStudent.instituteName || "Bangladesh National Institute of Education (BNIE)"}
                      </h2>
                      <p className="text-[10px] sm:text-xs font-semibold text-slate-700">
                        Central Academic Examination &amp; Transcripts Division • Dhaka, Bangladesh
                      </p>
                    </div>
                  </div>

                  {/* Academic Marks Statement & Exact Examination Title Banner */}
                  <div className="border-y-2 border-slate-800 py-1.5 my-1 text-center space-y-0.5 bg-slate-50/60">
                    <h3 className="text-sm sm:text-lg font-serif font-black tracking-wider text-slate-950 uppercase">
                      {getMarksheetTitle()}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] font-serif font-bold text-slate-700 uppercase tracking-widest">
                      Academic Transcript &amp; Marks Certificate
                    </p>
                  </div>

                  {/* Header Metadata Sub-bar */}
                  <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-semibold text-slate-700">
                    <div>Student ID: <strong className="text-slate-950 font-mono">{matchedStudent.id}</strong></div>
                    <div>•</div>
                    <div>Examination Year: <strong className="text-slate-950 font-mono">{matchedStudent.passingYear || matchedStudent.examinationYear}</strong></div>
                    <div>•</div>
                    <div>Academic Session: <strong className="text-slate-950 font-mono">{matchedStudent.session}</strong></div>
                    <div>•</div>
                    <div className="font-mono text-slate-500">Scope: {displayedEndpointPeriod} {isTwoPage ? "(Page 1 of 2)" : "(Page 1 of 1)"}</div>
                    {!matchedStudent.isVerifiedAcademicRecord && (
                      <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[9px] rounded uppercase">
                        Pending Verification
                      </span>
                    )}
                  </div>
                </div>

                {/* Unified Candidate Particulars & Profile Photo (Clean, Authentic Academic Ledger Format) */}
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                  <div className="flex-1 border border-slate-700 rounded-sm overflow-hidden text-[11px] sm:text-xs bg-white">
                    <table className="w-full border-collapse">
                      <tbody>
                        <tr className="border-b border-slate-300">
                          <td className="w-28 sm:w-32 py-1 px-2.5 bg-slate-100 font-bold text-slate-700 uppercase text-[10px] border-r border-slate-300">Name of Candidate</td>
                          <td className="py-1 px-2.5 font-serif font-black text-slate-950 text-sm uppercase">{matchedStudent.name}</td>
                          <td className="w-28 sm:w-32 py-1 px-2.5 bg-slate-100 font-bold text-slate-700 uppercase text-[10px] border-x border-slate-300">Roll Number</td>
                          <td className="w-32 sm:w-36 py-1 px-2.5 font-mono font-black text-slate-950 text-sm">{matchedStudent.rollNumber}</td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td className="py-1 px-2.5 bg-slate-100 font-bold text-slate-700 uppercase text-[10px] border-r border-slate-300">Father's Name</td>
                          <td className="py-1 px-2.5 font-semibold text-slate-900">{matchedStudent.fatherName || "—"}</td>
                          <td className="py-1 px-2.5 bg-slate-100 font-bold text-slate-700 uppercase text-[10px] border-x border-slate-300">Registration No</td>
                          <td className="py-1 px-2.5 font-mono font-bold text-slate-950">{matchedStudent.registrationNumber}</td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td className="py-1 px-2.5 bg-slate-100 font-bold text-slate-700 uppercase text-[10px] border-r border-slate-300">Mother's Name</td>
                          <td className="py-1 px-2.5 font-semibold text-slate-900">{matchedStudent.motherName || "—"}</td>
                          <td className="py-1 px-2.5 bg-slate-100 font-bold text-slate-700 uppercase text-[10px] border-x border-slate-300">Academic Session</td>
                          <td className="py-1 px-2.5 font-mono font-semibold text-slate-950">{matchedStudent.session}</td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td className="py-1 px-2.5 bg-slate-100 font-bold text-slate-700 uppercase text-[10px] border-r border-slate-300">Degree &amp; Major</td>
                          <td className="py-1 px-2.5 font-bold text-slate-950">
                            {matchedStudent.degreeType || (examType === "Degree Pass" ? "Bachelor of Arts (B.A.) Degree Pass" : "Bachelor of Arts (B.A.) Honours")}
                            {matchedStudent.majorSubject && examType !== "Degree Pass" ? ` (${matchedStudent.majorSubject})` : ""}
                          </td>
                          <td className="py-1 px-2.5 bg-slate-100 font-bold text-slate-700 uppercase text-[10px] border-x border-slate-300">Examination Year</td>
                          <td className="py-1 px-2.5 font-mono font-semibold text-slate-950">{matchedStudent.passingYear || matchedStudent.examinationYear}</td>
                        </tr>
                        <tr className="border-b border-slate-300">
                          <td className="py-1 px-2.5 bg-slate-100 font-bold text-slate-700 uppercase text-[10px] border-r border-slate-300">Student ID</td>
                          <td className="py-1 px-2.5 font-mono font-black text-slate-950">{matchedStudent.id}</td>
                          <td className="py-1 px-2.5 bg-slate-100 font-bold text-slate-700 uppercase text-[10px] border-x border-slate-300">Course Duration</td>
                          <td className="py-1 px-2.5 font-semibold text-slate-950">{matchedStudent.courseDuration || (isHistorical ? "3 Years" : "4 Years")}</td>
                        </tr>
                        <tr>
                          <td className="py-1 px-2.5 bg-slate-100 font-bold text-slate-700 uppercase text-[10px] border-r border-slate-300">Evaluation Standard</td>
                          <td className="py-1 px-2.5 font-semibold text-slate-900">
                            {isHistorical ? "Marks, Percentage & Division/Class Regulations" : "Semester Modular Scale (4.00 CGPA)"}
                          </td>
                          <td className="py-1 px-2.5 bg-slate-100 font-bold text-slate-700 uppercase text-[10px] border-x border-slate-300">Result Standing</td>
                          <td className="py-1 px-2.5 font-bold text-slate-950">
                            <span className="font-serif uppercase tracking-wide">{matchedStudent.resultStatus || "Passed"}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Candidate Profile Photo (Official Passport Size Frame) */}
                  <div className="w-24 sm:w-28 shrink-0 border border-slate-700 rounded-sm bg-slate-50 p-1 flex flex-col items-center justify-between shadow-2xs">
                    <div className="w-full h-28 sm:h-32 border border-slate-300 rounded-xs overflow-hidden bg-white">
                      <img 
                        src={matchedStudent.photoUrl || (matchedStudent.gender === "Female" ? PASSPORT_AVATARS.female1 : PASSPORT_AVATARS.male1)} 
                        alt={matchedStudent.name}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = matchedStudent.gender === "Female" ? PASSPORT_AVATARS.female1 : PASSPORT_AVATARS.male1;
                        }}
                      />
                    </div>
                    <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-slate-600 block text-center mt-0.5">
                      Candidate Photo
                    </span>
                  </div>
                </div>

              {/* FIRST PORTION OF ACADEMIC RESULTS (PAGE 1) */}
              <div className="space-y-4">
                <div className="border-b border-slate-900 pb-1.5 flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-950">
                    Academic Paper Record ({isTwoPage ? `Part I • ${page1Semesters.length} Period${page1Semesters.length > 1 ? "s" : ""}` : `Complete Record • ${page1Semesters.length} Period${page1Semesters.length > 1 ? "s" : ""}`})
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-slate-600">
                    {isHistorical ? "Standard: Marks & Percentage System" : "Grading Scale: 4.00 Max"}
                  </span>
                </div>

                {page1Semesters.map((sem, sIdx) => {
                  const isTwoColumn = sem.subjects.length > 15;
                  const leftSubjects = isTwoColumn ? sem.subjects.slice(0, 15) : sem.subjects;
                  const rightSubjects = isTwoColumn ? sem.subjects.slice(15, 30) : [];
                    const semFullMarks = sem.subjects.reduce((sum, s) => sum + (s.fullMarks || 100), 0);
                    const semObtainedMarks = sem.subjects.reduce((sum, s) => sum + (s.marks || 0), 0);
                    const semPercent = semFullMarks > 0 ? Math.round((semObtainedMarks / semFullMarks) * 1000) / 10 : 0;

                    const renderTable = (subList: typeof sem.subjects, startOffset = 0) => (
                      <table className="w-full text-left text-xs border-collapse border border-slate-400 print-compact-table">
                        <thead>
                          <tr className="border-b border-slate-400 text-[10px] font-bold uppercase text-slate-900 bg-slate-100">
                            <th className="py-1 px-2 text-center w-8 border-r border-slate-300">SL</th>
                            <th className="py-1 px-2.5 w-24 border-r border-slate-300">Paper Code</th>
                            <th className="py-1 px-3 border-r border-slate-300">Subject / Paper Title</th>
                            {isHistorical ? (
                              <>
                                <th className="py-1 px-2 text-center w-20 border-r border-slate-300">Full Marks</th>
                                <th className="py-1 px-2 text-center w-24 border-r border-slate-300">Marks Obtained</th>
                                <th className="py-1 px-2.5 text-center w-20">Result</th>
                              </>
                            ) : (
                              <>
                                <th className="py-1 px-2 text-center w-16 border-r border-slate-300">Credit</th>
                                <th className="py-1 px-2 text-center w-16 border-r border-slate-300">Marks</th>
                                <th className="py-1 px-2 text-center w-20 border-r border-slate-300">Grade Point</th>
                                <th className="py-1 px-2 text-center w-20 border-r border-slate-300">Letter Grade</th>
                                <th className="py-1 px-2.5 text-center w-20">Result</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-[11px]">
                          {subList.map((sub, subIdx) => {
                            const displayIndex = startOffset + subIdx + 1;
                            const full = sub.fullMarks || 100;
                            const obtained = sub.marks ?? 0;
                            const isPass = sub.marks !== undefined ? obtained >= (sub.passMarks || (full >= 100 ? 36 : 18)) : true;

                            return (
                              <tr key={subIdx} className="hover:bg-slate-50/70">
                                <td className="py-1 px-2 text-center font-mono font-bold text-slate-700 border-r border-slate-200">
                                  {sub.serialNo || String(displayIndex).padStart(2, "0")}
                                </td>
                                <td className="py-1 px-2.5 font-mono font-bold text-slate-950 border-r border-slate-200">
                                  {sub.subjectCode || "—"}
                                </td>
                                <td className="py-1 px-3 font-medium text-slate-950 border-r border-slate-200">
                                  {sub.subjectName}
                                </td>
                                {isHistorical ? (
                                  <>
                                    <td className="py-1 px-2 text-center font-mono text-slate-700 border-r border-slate-200">
                                      {full}
                                    </td>
                                    <td className="py-1 px-2 text-center font-mono font-black text-slate-950 border-r border-slate-200">
                                      {sub.marks ?? "—"}
                                    </td>
                                    <td className="py-1 px-2.5 text-center font-bold text-[10px]">
                                      <span className={isPass ? "text-emerald-800" : "text-red-700"}>
                                        {isPass ? "Passed" : "Failed"}
                                      </span>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td className="py-1 px-2 text-center font-mono text-slate-700 border-r border-slate-200">
                                      {sub.credit || sub.credits || 3}
                                    </td>
                                    <td className="py-1 px-2 text-center font-mono font-semibold text-slate-900 border-r border-slate-200">
                                      {sub.marks ?? "—"}
                                    </td>
                                    <td className="py-1 px-2 text-center font-mono font-extrabold text-[#006a4e] border-r border-slate-200">
                                      {sub.gradePoint !== undefined ? sub.gradePoint.toFixed(2) : "0.00"}
                                    </td>
                                    <td className="py-1 px-2 text-center font-bold border-r border-slate-200">
                                      <span className="px-1.5 py-0.2 bg-emerald-50 rounded border border-emerald-200 text-[10px] text-emerald-900 print:border-none print:p-0 print:bg-transparent">
                                        {sub.letterGrade || (sub.gradePoint >= 4.0 ? "A+" : sub.gradePoint >= 3.75 ? "A" : sub.gradePoint >= 3.5 ? "A-" : sub.gradePoint >= 3.0 ? "B" : sub.gradePoint >= 2.0 ? "C" : "F")}
                                      </span>
                                    </td>
                                    <td className="py-1 px-2.5 text-center font-bold text-[10px]">
                                      <span className={sub.gradePoint >= 2.0 ? "text-emerald-800" : "text-red-700"}>
                                        {sub.gradePoint >= 2.0 ? "Passed" : "Failed"}
                                      </span>
                                    </td>
                                  </>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                        {isHistorical && (
                          <tfoot className="border-t-2 border-slate-400 bg-slate-50 font-bold text-[11px]">
                            <tr>
                              <td colSpan={3} className="py-1 px-3 text-right font-serif text-slate-800 uppercase text-[10px] border-r border-slate-300">
                                {sem.semesterName} Aggregate:
                              </td>
                              <td className="py-1 px-2 text-center font-mono text-slate-900 border-r border-slate-300">
                                {semFullMarks}
                              </td>
                              <td className="py-1 px-2 text-center font-mono font-black text-slate-950 border-r border-slate-300">
                                {semObtainedMarks}
                              </td>
                              <td className="py-1 px-2.5 text-center font-mono font-bold text-amber-800 text-[10px]">
                                {semPercent}%
                              </td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    );

                  return (
                    <div
                      key={sIdx}
                      className="semester-block bg-white border border-slate-600 rounded-sm overflow-hidden mb-2.5"
                    >
                      {/* Period Header */}
                      <div className="bg-slate-100 p-1.5 px-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-400 text-xs">
                        <div className="flex items-center gap-2">
                          <h5 className="font-bold text-[11px] uppercase tracking-wide text-slate-950 font-serif">
                            {sem.semesterName} {isHistorical ? "Examination" : "Courses"}
                          </h5>
                          {sem.publicationDate && (
                            <span className="text-[10px] text-slate-500 font-mono">
                              • Published: {sem.publicationDate}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {isHistorical ? (
                            <span className="text-[11px] font-semibold text-slate-700">
                              Papers: <strong className="text-slate-950 font-mono">{sem.subjects.length}</strong> • Full Marks: <strong className="text-slate-950 font-mono">{semFullMarks}</strong>
                            </span>
                          ) : (
                            <>
                              <span className="text-[11px] text-slate-600 font-medium">Period GPA:</span>
                              <span className="text-xs font-black font-mono text-[#006a4e] bg-white border border-slate-300 px-2 py-0.5 rounded-md">
                                {sem.semesterGpa.toFixed(2)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Subject Table (Single column or Two-column layout for 30-subject catalogue) */}
                      <div className="overflow-x-auto p-1.5">
                        {isTwoColumn ? (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            <div>
                              <div className="text-[10px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded mb-1 border border-slate-300">
                                Section A: Papers 01 — 15
                              </div>
                              {renderTable(leftSubjects, 0)}
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded mb-1 border border-slate-300">
                                Section B: Papers 16 — {sem.subjects.length}
                              </div>
                              {renderTable(rightSubjects, 15)}
                            </div>
                          </div>
                        ) : (
                          renderTable(sem.subjects, 0)
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* IF SINGLE PAGE: RENDER RESULT SUMMARY AND SIGNATURES RIGHT HERE ON PAGE 1 */}
              {!isTwoPage && (
                <div className="space-y-3 pt-1">
                  {/* CUMULATIVE SUMMARY BREAKDOWN BOX */}
                  <div className="bg-white border-2 border-slate-800 rounded-sm overflow-hidden text-xs">
                    <div className="bg-slate-100 py-1 px-3 border-b border-slate-400 font-serif font-black text-slate-950 uppercase tracking-wider text-center text-xs">
                      Final Academic Result &amp; Classification
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-300 text-center bg-white">
                      <div className="p-2 sm:p-2.5">
                        <span className="text-[10px] font-bold uppercase text-slate-500 block">Total Full Marks</span>
                        <span className="text-base font-black text-slate-950 font-mono">{totalFullMarks}</span>
                      </div>

                      <div className="p-2 sm:p-2.5">
                        <span className="text-[10px] font-bold uppercase text-slate-500 block">Total Marks Obtained</span>
                        <span className="text-base font-black text-slate-950 font-mono">{totalObtainedMarks}</span>
                      </div>

                      <div className="p-2 sm:p-2.5">
                        <span className="text-[10px] font-bold uppercase text-slate-500 block">Percentage of Marks</span>
                        <span className="text-base font-black text-amber-700 font-mono">{percentageValue}%</span>
                      </div>

                      <div className="p-2 sm:p-2.5 bg-amber-50/40">
                        <span className="text-[10px] font-bold uppercase text-slate-700 block">
                          {isHistorical ? "Result / Class Awarded" : "Cumulative CGPA"}
                        </span>
                        <span className="text-xs sm:text-sm font-black text-slate-950 font-serif block mt-0.5 uppercase tracking-wide">
                          {isHistorical 
                            ? (matchedStudent.resultStatus || (percentageValue >= 60 ? (examType === "Degree Pass" ? "First Division" : "First Class with Honours") : percentageValue >= 45 ? (examType === "Degree Pass" ? "Second Division" : "Second Class with Honours") : "Pass / Third Division"))
                            : computedCgpa.toFixed(2)
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* GRADING SCALE / HISTORICAL RULES REFERENCE BAR */}
                  <div className="p-2 bg-slate-50 border border-slate-400 rounded-sm text-[10px] text-slate-700 leading-relaxed">
                    {isHistorical ? (
                      <div>
                        <strong className="text-slate-950 font-serif uppercase tracking-wider mr-1.5">Historical Regulations (1990–2000):</strong>
                        {examType === "Degree Pass" ? (
                          <span>First Division (60.0% and above) • Second Division (45.0% to 59.9%) • Third Division (33.0% to 44.9%). Minimum 33 marks required per paper.</span>
                        ) : (
                          <span>First Class with Honours (60.0% and above) • Second Class with Honours (45.0% to 59.9%) • Third Class (36.0% to 44.9% or Pass Degree). Minimum qualifying mark per paper: 36%; Viva-Voce: 40%. Total Full Marks: 1600.</span>
                        )}
                        {!matchedStudent.isVerifiedAcademicRecord && (
                          <span className="block mt-0.5 font-semibold text-amber-900">
                            * Official syllabus &amp; paper codes subject to original university historical archive verification (Status: Pending Verification).
                          </span>
                        )}
                      </div>
                    ) : (
                      <div>
                        <strong className="text-slate-950 mr-1.5 font-serif uppercase tracking-wider">Institutional Grading Scale (4.00):</strong>
                        <span>A+ (4.00, 80%+), A (3.75, 75-79%), A- (3.50, 70-74%), B+ (3.25, 65-69%), B (3.00, 60-64%), B- (2.75, 55-59%), C+ (2.50, 50-54%), D (2.00, 40-49%), F (0.00, Fail).</span>
                      </div>
                    )}
                  </div>

                  {/* INSTITUTION SEAL AND AUTHORIZED SIGNATURES */}
                  <div className="pt-3 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 font-serif text-xs">
                        Bangladesh National Institute of Education
                      </div>
                      <p className="text-[9px] text-slate-500">
                        This official transcript was electronically generated and authenticated from the secure institutional ledger.
                      </p>
                      <p className="text-[9px] font-mono text-slate-500">
                        Document Ref: BNIE-{matchedStudent.passingYear || "1994"}-{matchedStudent.rollNumber}-{matchedStudent.registrationNumber}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center space-y-0.5">
                        <div className="w-32 border-b border-slate-600 pb-0.5 font-serif italic text-xs text-slate-900">
                          Controller of Exam
                        </div>
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider block">
                          Controller of Examinations
                        </span>
                      </div>

                      <div className="text-center space-y-0.5">
                        <div className="w-32 border-b border-slate-600 pb-0.5 font-serif italic text-xs text-slate-900">
                          Registrar &amp; Secretary
                        </div>
                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider block">
                          Registrar &amp; Secretary
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Page 1 Bottom Footer Indicator */}
              <div className="pt-2 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Central Academic Archive: BNIE-{matchedStudent.rollNumber}-{matchedStudent.passingYear}</span>
                <span className="font-bold text-slate-800">
                  {isTwoPage ? "Page 1 of 2 • Transcript continues on Page 2" : "Page 1 of 1 • End of Official Academic Transcript"}
                </span>
              </div>

              </div>
            </div>

            {/* ========================================================================= */}
            {/* MARKSHEET PAGE 2 (Continuation for Multi-period Records)                  */}
            {/* ========================================================================= */}
            {isTwoPage && (
              <div 
                id="marksheet-page-2"
                className="marksheet-page-2 bg-white rounded-lg border-2 border-slate-800 shadow-md p-2 sm:p-2.5 relative overflow-hidden print:border-2 print:shadow-none print:p-1"
              >
                {/* Inner Official Academic Certificate Border */}
                <div className="border border-slate-700 rounded-sm p-4 sm:p-6 space-y-3.5 print:p-3 print:space-y-2.5 bg-white">

                {/* Page 2 Minimalist Continuation Header */}
                <div className="border-b-2 border-slate-900 pb-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 shrink-0">
                      <Logo size={32} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-950 font-serif text-sm">
                        Bangladesh National Institute of Education (BNIE)
                      </h3>
                      <p className="text-[10px] text-slate-600 font-semibold">
                        Official Academic Transcript Continuation • <span className="text-slate-900 font-bold">Page 2 of 2</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-[10px] font-mono text-slate-700 bg-slate-50 p-1 px-2.5 rounded border border-slate-300">
                    <div><strong>Candidate:</strong> {matchedStudent.name}</div>
                    <div><strong>ID:</strong> {matchedStudent.id} • <strong>Roll:</strong> {matchedStudent.rollNumber}</div>
                  </div>
                </div>

                {/* SECOND PORTION OF ACADEMIC RESULTS (PAGE 2) */}
                <div className="space-y-4">
                  <div className="border-b border-slate-900 pb-1.5 flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-950">
                      Academic Paper Record (Part II • Continuation • {page2Semesters.length} Period{page2Semesters.length > 1 ? "s" : ""})
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-slate-600">
                      Evaluation Scope: {displayedEndpointPeriod}
                    </span>
                  </div>

                  {page2Semesters.map((sem, sIdx) => {
                    const isTwoColumn = sem.subjects.length > 15;
                    const leftSubjects = isTwoColumn ? sem.subjects.slice(0, 15) : sem.subjects;
                    const rightSubjects = isTwoColumn ? sem.subjects.slice(15, 30) : [];

                    const renderTable = (subList: typeof sem.subjects, startOffset = 0) => (
                      <table className="w-full text-left text-xs border-collapse print-compact-table">
                        <thead>
                          <tr className="border-b border-slate-200 text-[10px] font-bold uppercase text-slate-700 bg-slate-100">
                            <th className="py-1.5 px-2 text-center w-8">SL</th>
                            <th className="py-1.5 px-2.5">Paper Code</th>
                            <th className="py-1.5 px-3">Subject / Paper Title</th>
                            {isHistorical ? (
                              <>
                                <th className="py-1.5 px-2 text-center">Full Marks</th>
                                <th className="py-1.5 px-2 text-center">Marks Obtained</th>
                                <th className="py-1.5 px-2.5 text-center">Result</th>
                              </>
                            ) : (
                              <>
                                <th className="py-1.5 px-2 text-center">Credit</th>
                                <th className="py-1.5 px-2 text-center">Marks</th>
                                <th className="py-1.5 px-2 text-center">Grade Point</th>
                                <th className="py-1.5 px-2 text-center">Letter Grade</th>
                                <th className="py-1.5 px-2.5 text-center">Result</th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[11px]">
                          {subList.map((sub, subIdx) => {
                            const displayIndex = startOffset + subIdx + 1;
                            const full = sub.fullMarks || 100;
                            const obtained = sub.marks ?? 0;
                            const isPass = sub.marks !== undefined ? obtained >= (sub.passMarks || (full >= 100 ? 36 : 18)) : true;

                            return (
                              <tr key={subIdx} className="hover:bg-slate-50/60">
                                <td className="py-1.5 px-2 text-center font-mono font-bold text-slate-700">
                                  {sub.serialNo || String(displayIndex).padStart(2, "0")}
                                </td>
                                <td className="py-1.5 px-2.5 font-mono font-bold text-slate-950">
                                  {sub.subjectCode || "—"}
                                </td>
                                <td className="py-1.5 px-3 font-medium text-slate-950">
                                  {sub.subjectName}
                                </td>
                                {isHistorical ? (
                                  <>
                                    <td className="py-1.5 px-2 text-center font-mono text-slate-700">
                                      {full}
                                    </td>
                                    <td className="py-1.5 px-2 text-center font-mono font-black text-slate-950">
                                      {sub.marks ?? "—"}
                                    </td>
                                    <td className="py-1.5 px-2.5 text-center font-bold text-[10px]">
                                      <span className={isPass ? "text-emerald-800" : "text-red-700"}>
                                        {isPass ? "Passed" : "Failed"}
                                      </span>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td className="py-1.5 px-2 text-center font-mono text-slate-700">
                                      {sub.credit || sub.credits || 3}
                                    </td>
                                    <td className="py-1.5 px-2 text-center font-mono font-semibold text-slate-900">
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
                                    <td className="py-1.5 px-2.5 text-center font-bold text-[10px]">
                                      <span className={sub.gradePoint >= 2.0 ? "text-emerald-800" : "text-red-700"}>
                                        {sub.gradePoint >= 2.0 ? "Passed" : "Failed"}
                                      </span>
                                    </td>
                                  </>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    );

                    return (
                      <div
                        key={sIdx}
                        className="semester-block bg-white rounded-xl border border-slate-300 overflow-hidden shadow-2xs"
                      >
                        {/* Period Header */}
                        <div className="bg-slate-100 p-2.5 px-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-300 text-xs">
                          <div className="flex items-center gap-2">
                            <h5 className="font-extrabold text-[11px] uppercase tracking-wide text-slate-950 font-serif">
                              {sem.semesterName}
                            </h5>
                            {sem.publicationDate && (
                              <span className="text-[10px] text-slate-500 font-mono">
                                • Published: {sem.publicationDate}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {isHistorical ? (
                              <span className="text-xs font-bold text-slate-800">
                                Papers: <strong>{sem.subjects.length}</strong>
                              </span>
                            ) : (
                              <>
                                <span className="text-[11px] text-slate-600 font-medium">Period GPA:</span>
                                <span className="text-xs font-black font-mono text-[#006a4e] bg-white border border-slate-300 px-2 py-0.5 rounded-md">
                                  {sem.semesterGpa.toFixed(2)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Subject Table */}
                        <div className="overflow-x-auto p-2">
                          {isTwoColumn ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div>
                                <div className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-1 rounded mb-1.5 border border-amber-200">
                                  Section A: Papers 01 — 15
                                </div>
                                {renderTable(leftSubjects, 0)}
                              </div>
                              <div>
                                <div className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-1 rounded mb-1.5 border border-amber-200">
                                  Section B: Papers 16 — {sem.subjects.length}
                                </div>
                                {renderTable(rightSubjects, 15)}
                              </div>
                            </div>
                          ) : (
                            renderTable(sem.subjects, 0)
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CUMULATIVE SUMMARY BREAKDOWN BOX */}
                <div className="bg-slate-50 border-2 border-slate-900/40 rounded-xl p-4 space-y-3">
                  <div className="border-b border-slate-300 pb-1.5 flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 font-serif">
                      Cumulative Result Summary &amp; Degree Classification
                    </h4>
                    <span className="text-[10px] font-mono text-slate-600">
                      {isHistorical ? "Marks & Percentage Scale" : "Scale: 4.00 Max"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="text-[9px] font-bold uppercase text-slate-500 block">Total Full Marks</span>
                      <span className="text-base font-black text-slate-950 font-mono">{totalFullMarks}</span>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="text-[9px] font-bold uppercase text-slate-500 block">Total Marks Obtained</span>
                      <span className="text-base font-black text-slate-950 font-mono">{totalObtainedMarks}</span>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="text-[9px] font-bold uppercase text-slate-500 block">Calculated Percentage</span>
                      <span className="text-base font-black text-amber-700 font-mono">{percentageValue}%</span>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border-2 border-slate-900 shadow-2xs">
                      <span className="text-[9px] font-bold uppercase text-slate-700 block">
                        {isHistorical ? "Class / Division Awarded" : "Cumulative CGPA"}
                      </span>
                      <span className="text-sm sm:text-base font-black text-slate-950 font-serif block mt-0.5">
                        {isHistorical 
                          ? (matchedStudent.resultStatus || (percentageValue >= 60 ? (examType === "Degree Pass" ? "First Division" : "First Class with Honours") : percentageValue >= 45 ? (examType === "Degree Pass" ? "Second Division" : "Second Class with Honours") : "Pass / Third Division"))
                          : computedCgpa.toFixed(2)
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* GRADING SCALE REFERENCE BAR */}
                <div className="p-2.5 bg-slate-100 border border-slate-300 rounded-lg text-[9px] text-slate-700">
                  {isHistorical ? (
                    <div>
                      <strong className="text-slate-950 mr-1.5">Historical Regulations (1990–2000):</strong>
                      {examType === "Degree Pass" ? (
                        <span>First Division (60.0% and above) • Second Division (45.0% to 59.9%) • Third Division (33.0% to 44.9%). Minimum 33 marks required per paper.</span>
                      ) : (
                        <span>First Class (60.0% and above) • Second Class (45.0% to 59.9%) • Third Class (36.0% to 44.9% or Pass Degree). Star Marks awarded for 75.0% and above.</span>
                      )}
                      {!matchedStudent.isVerifiedAcademicRecord && (
                        <span className="block mt-1 font-semibold text-amber-900">
                          * Official syllabus &amp; paper codes subject to original university historical archive verification (Status: Pending Verification).
                        </span>
                      )}
                    </div>
                  ) : (
                    <div>
                      <strong className="text-slate-950 mr-1.5">Institutional Grading Scale (4.00):</strong>
                      <span>A+ (4.00, 80%+), A (3.75, 75-79%), A- (3.50, 70-74%), B+ (3.25, 65-69%), B (3.00, 60-64%), B- (2.75, 55-59%), C+ (2.50, 50-54%), D (2.00, 40-49%), F (0.00, Fail).</span>
                    </div>
                  )}
                </div>

                {/* INSTITUTION SEAL AND AUTHORIZED SIGNATURES */}
                <div className="pt-4 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-900 font-serif text-xs">
                      Bangladesh National Institute of Education
                    </div>
                    <p className="text-[9px] text-slate-500">
                      This official transcript was electronically generated and authenticated from the secure institutional ledger.
                    </p>
                    <p className="text-[9px] font-mono text-slate-400">
                      Document Ref: BNIE-{matchedStudent.passingYear || "1994"}-{matchedStudent.rollNumber}-{matchedStudent.registrationNumber}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center space-y-1">
                      <div className="w-32 border-b border-slate-600 pb-0.5 font-serif italic text-xs text-slate-900">
                        Controller of Exam
                      </div>
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider block">
                        Controller of Examinations
                      </span>
                    </div>

                    <div className="text-center space-y-1">
                      <div className="w-32 border-b border-slate-600 pb-0.5 font-serif italic text-xs text-slate-900">
                        Registrar &amp; Secretary
                      </div>
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider block">
                        Registrar &amp; Secretary
                      </span>
                    </div>
                  </div>
                </div>

                {/* Page 2 Bottom Footer Indicator */}
                <div className="pt-2 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Record Verified at bnie.edu.bd/degree-marksheet-result</span>
                  <span className="font-bold text-slate-800">
                    Page 2 of 2 • End of Official Transcript
                  </span>
                </div>

                </div>
              </div>
            )}

          </motion.div>
        )}

      </div>
    </div>
  );
}
