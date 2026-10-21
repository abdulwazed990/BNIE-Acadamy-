import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { 
  Student, 
  Category, 
  Group, 
  Religion, 
  SemesterResult, 
  SubjectGrade, 
  getDiplomaGradePointFromMarks, 
  getDiplomaLetterGrade, 
  calculateDegreeCgpa,
  calculateSemesterGpa,
  generateSecureToken
} from "../types";
import { 
  DEGREE_PROGRAMS_CATALOG, 
  DegreeProgram, 
  getProgramsByLevel, 
  generateDefaultSemesterResults,
  getBbaAccountingCurriculum,
  getMbaAccountingCurriculum
} from "../data/degreeProgramsCatalog";
import { 
  generateAutomaticRollNumber,
  generateAutomaticRegistrationNumber,
  calculateAcademicTimeline,
  calculateSuggestedCertificateIssueDate,
  generateOfficialCertificateNumber,
  extractAdmissionYearFromSession
} from "../lib/academicNumberingService";
import { 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Building2, 
  Award, 
  Plus, 
  Trash2, 
  Upload, 
  Camera, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  ArrowLeft,
  Save,
  X,
  ShieldCheck,
  History,
  Lock,
  Unlock,
  RefreshCw
} from "lucide-react";
import { PASSPORT_AVATARS } from "../data/defaultStudents";

interface DegreeStudentFormProps {
  initialLevel?: "Degree Pass" | "Honours" | "Masters";
  existingStudent?: Student | null;
  allStudents?: Student[];
  onSaveStudent: (student: Student) => Promise<void> | void;
  onCancel: () => void;
  onSwitchToSchoolSystem?: (category: Category) => void;
}

export default function DegreeStudentForm({
  initialLevel = "Honours",
  existingStudent = null,
  allStudents = [],
  onSaveStudent,
  onCancel,
  onSwitchToSchoolSystem
}: DegreeStudentFormProps) {
  // Academic Level
  const [academicLevel, setAcademicLevel] = useState<"Degree Pass" | "Honours" | "Masters">(
    existingStudent?.academicLevel || initialLevel
  );

  // Available programs for current level
  const availablePrograms = getProgramsByLevel(academicLevel);

  // Selected Program
  const [selectedProgramCode, setSelectedProgramCode] = useState<string>(() => {
    if (existingStudent?.programCode) return existingStudent.programCode;
    return availablePrograms[0]?.code || "ENG-HON";
  });

  const currentProgram = DEGREE_PROGRAMS_CATALOG.find((p) => p.code === selectedProgramCode) || availablePrograms[0];

  // Core Form Fields
  const [name, setName] = useState(existingStudent?.name || "");
  const [fatherName, setFatherName] = useState(existingStudent?.fatherName || "");
  const [motherName, setMotherName] = useState(existingStudent?.motherName || "");
  const [department, setDepartment] = useState(existingStudent?.department || currentProgram?.department || "");
  const [majorSubject, setMajorSubject] = useState(existingStudent?.majorSubject || currentProgram?.majorSubjects[0] || "");
  const [session, setSession] = useState(existingStudent?.session || "2024-2025");
  const [currentPeriod, setCurrentPeriod] = useState(
    existingStudent?.currentSemesterOrYear || (academicLevel === "Degree Pass" ? "3rd Year (Final)" : academicLevel === "Masters" ? "4th Semester (Final)" : "8th Semester (Final)")
  );

  // Automatic Academic Timeline
  const initialTimeline = calculateAcademicTimeline({
    academicLevel: existingStudent?.academicLevel || initialLevel,
    programCode: existingStudent?.programCode || selectedProgramCode,
    session: existingStudent?.session || "2024-2025",
    manualAdmissionYear: existingStudent?.admissionYear
  });

  const [admissionYear, setAdmissionYear] = useState<string>(
    existingStudent?.admissionYear || initialTimeline.admissionYear
  );
  const [courseDuration, setCourseDuration] = useState<string>(
    existingStudent?.courseDuration || initialTimeline.courseDuration
  );
  const [expectedCompletionYear, setExpectedCompletionYear] = useState<string>(
    existingStudent?.expectedCompletionYear || initialTimeline.expectedCompletionYear
  );
  const [examinationYear, setExaminationYear] = useState<string>(
    existingStudent?.examinationYear || initialTimeline.examinationYear
  );
  const [passingYear, setPassingYear] = useState(existingStudent?.passingYear || initialTimeline.examinationYear);

  // Result Publication Date
  const [resultPublicationDate, setResultPublicationDate] = useState<string>(
    existingStudent?.resultPublicationDate || initialTimeline.suggestedPublicationDate
  );

  // Certificate Issuance & Number
  const [certificateStatus, setCertificateStatus] = useState<"Pending" | "Eligible for Issue" | "Issued">(
    existingStudent?.certificateStatus || (existingStudent?.certificateSerialNumber ? "Issued" : "Pending")
  );
  const [certificateIssueDate, setCertificateIssueDate] = useState<string>(
    existingStudent?.certificateIssueDate || existingStudent?.issueDate || initialTimeline.suggestedCertificateIssueDate
  );
  const [certificateSerial, setCertificateSerial] = useState(
    existingStudent?.certificateNumber || existingStudent?.certificateSerialNumber || ""
  );

  // Automatic Roll & Registration Numbers (Preserve existing students, generate unique sequential for new)
  const [rollNumber, setRollNumber] = useState<string>(() => {
    if (existingStudent?.rollNumber) return existingStudent.rollNumber;
    return generateAutomaticRollNumber({
      academicLevel,
      programCode: selectedProgramCode,
      session: existingStudent?.session || "2024-2025",
      admissionYear: initialTimeline.admissionYear,
      existingStudents: allStudents
    });
  });

  const [registrationNumber, setRegistrationNumber] = useState<string>(() => {
    if (existingStudent?.registrationNumber) return existingStudent.registrationNumber;
    return generateAutomaticRegistrationNumber({
      academicLevel,
      session: existingStudent?.session || "2024-2025",
      admissionYear: initialTimeline.admissionYear,
      existingStudents: allStudents
    });
  });

  // Manual Override states with audit safety
  const [isManualRollOverride, setIsManualRollOverride] = useState(false);
  const [isManualRegOverride, setIsManualRegOverride] = useState(false);
  const [auditLog, setAuditLog] = useState<Array<{ action: string; timestamp: string; details: string; changedBy?: string }>>(
    existingStudent?.auditLog || []
  );

  const [studentId, setStudentId] = useState(existingStudent?.id || `BNIE-DEG-${Math.floor(100000 + Math.random() * 900000)}`);
  const [issueDate, setIssueDate] = useState(existingStudent?.issueDate || initialTimeline.suggestedCertificateIssueDate);
  const [resultStatus, setResultStatus] = useState(existingStudent?.resultStatus || "First Class");
  const [photoUrl, setPhotoUrl] = useState(existingStudent?.photoUrl || PASSPORT_AVATARS.male1);
  const [dob, setDob] = useState(existingStudent?.dob || "2001-08-14");

  // Recalculate automatic numbers for new student when level, program or session changes
  const refreshAutoNumbers = (level = academicLevel, prog = selectedProgramCode, sess = session, admYr = admissionYear) => {
    if (existingStudent) return; // Never overwrite existing student's numbers
    if (!isManualRollOverride) {
      const newRoll = generateAutomaticRollNumber({
        academicLevel: level,
        programCode: prog,
        session: sess,
        admissionYear: admYr,
        existingStudents: allStudents
      });
      setRollNumber(newRoll);
    }
    if (!isManualRegOverride) {
      const newReg = generateAutomaticRegistrationNumber({
        academicLevel: level,
        session: sess,
        admissionYear: admYr,
        existingStudents: allStudents
      });
      setRegistrationNumber(newReg);
    }
  };

  // Semester / Year-wise Results
  const [semesters, setSemesters] = useState<SemesterResult[]>(() => {
    if (existingStudent?.semesterResults && existingStudent.semesterResults.length > 0) {
      return existingStudent.semesterResults;
    }
    if (currentProgram) {
      return generateDefaultSemesterResults(currentProgram);
    }
    return [];
  });

  // UI state
  const [expandedSemesters, setExpandedSemesters] = useState<Record<number, boolean>>({ 0: true, 1: true });
  const [showAuditLogModal, setShowAuditLogModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Sync program defaults when level changes
  const handleLevelChange = (newLevel: "Degree Pass" | "Honours" | "Masters") => {
    setAcademicLevel(newLevel);
    const progs = getProgramsByLevel(newLevel);
    if (progs.length > 0) {
      const p = progs[0];
      setSelectedProgramCode(p.code);
      setDepartment(p.department);
      setMajorSubject(p.majorSubjects[0] || "");
      setCurrentPeriod(newLevel === "Degree Pass" ? "3rd Year (Final)" : newLevel === "Masters" ? "4th Semester (Final)" : "8th Semester (Final)");
      
      const timeline = calculateAcademicTimeline({
        academicLevel: newLevel,
        programCode: p.code,
        session,
        manualAdmissionYear: admissionYear
      });
      setCourseDuration(timeline.courseDuration);
      setExpectedCompletionYear(timeline.expectedCompletionYear);
      setExaminationYear(timeline.examinationYear);
      setPassingYear(timeline.examinationYear);
      setResultPublicationDate(timeline.suggestedPublicationDate);
      setCertificateIssueDate(timeline.suggestedCertificateIssueDate);

      refreshAutoNumbers(newLevel, p.code, session, admissionYear);
      setSemesters(generateDefaultSemesterResults(p));
    }
  };

  // Sync when program changes
  const handleProgramChange = (code: string) => {
    setSelectedProgramCode(code);
    if (code === "MBA-ACC") {
      const mba = getMbaAccountingCurriculum();
      setDepartment(mba.department);
      setMajorSubject("Accounting");
      setCourseDuration("1 Year");
      setCurrentPeriod("2nd Semester (Final)");
      const timeline = calculateAcademicTimeline({
        academicLevel: "Masters",
        programCode: code,
        session,
        manualAdmissionYear: admissionYear,
        manualDurationYears: 1
      });
      setCourseDuration(timeline.courseDuration);
      setExpectedCompletionYear(timeline.expectedCompletionYear);
      setExaminationYear(timeline.examinationYear);
      setPassingYear(timeline.examinationYear);
      setResultPublicationDate(timeline.suggestedPublicationDate);
      setCertificateIssueDate(timeline.suggestedCertificateIssueDate);
      refreshAutoNumbers("Masters", code, session, admissionYear);
      setSemesters(generateDefaultSemesterResults(mba));
      return;
    }

    const p = DEGREE_PROGRAMS_CATALOG.find((item) => item.code === code);
    if (p) {
      setDepartment(p.department);
      const defaultMajor = p.majorSubjects[0] || "";
      setMajorSubject(defaultMajor);

      const timeline = calculateAcademicTimeline({
        academicLevel,
        programCode: code,
        session,
        manualAdmissionYear: admissionYear
      });
      setCourseDuration(timeline.courseDuration);
      setExpectedCompletionYear(timeline.expectedCompletionYear);
      setExaminationYear(timeline.examinationYear);

      refreshAutoNumbers(academicLevel, code, session, admissionYear);
      setSemesters(generateDefaultSemesterResults(p));
    }
  };

  // Handle Session or Admission Year change
  const handleSessionChange = (newSession: string) => {
    setSession(newSession);
    const adm = extractAdmissionYearFromSession(newSession);
    setAdmissionYear(adm);
    const timeline = calculateAcademicTimeline({
      academicLevel,
      programCode: selectedProgramCode,
      session: newSession,
      manualAdmissionYear: adm
    });
    setExpectedCompletionYear(timeline.expectedCompletionYear);
    setExaminationYear(timeline.examinationYear);
    setPassingYear(timeline.examinationYear);
    setResultPublicationDate(timeline.suggestedPublicationDate);
    setCertificateIssueDate(timeline.suggestedCertificateIssueDate);
    refreshAutoNumbers(academicLevel, selectedProgramCode, newSession, adm);
  };

  // Sync when major changes (automatically load official curriculum)
  const handleMajorChange = (newMajor: string) => {
    setMajorSubject(newMajor);
    const isAccounting = newMajor.toLowerCase().includes("accounting");
    if (isAccounting) {
      if (
        academicLevel === "Masters" ||
        selectedProgramCode.includes("MBA") ||
        currentProgram?.name.toLowerCase().includes("master of business")
      ) {
        const mba = getMbaAccountingCurriculum();
        setSelectedProgramCode(mba.code);
        setDepartment(mba.department);
        setCourseDuration("1 Year");
        setCurrentPeriod("2nd Semester (Final)");
        const timeline = calculateAcademicTimeline({
          academicLevel: "Masters",
          programCode: mba.code,
          session,
          manualAdmissionYear: admissionYear,
          manualDurationYears: 1
        });
        setCourseDuration(timeline.courseDuration);
        setExpectedCompletionYear(timeline.expectedCompletionYear);
        setExaminationYear(timeline.examinationYear);
        setPassingYear(timeline.examinationYear);
        setResultPublicationDate(timeline.suggestedPublicationDate);
        setCertificateIssueDate(timeline.suggestedCertificateIssueDate);
        refreshAutoNumbers("Masters", mba.code, session, admissionYear);
        setSemesters(generateDefaultSemesterResults(mba));
      } else if (
        selectedProgramCode.includes("BBA") ||
        currentProgram?.name.includes("Business Administration")
      ) {
        const bba = getBbaAccountingCurriculum();
        setSemesters(generateDefaultSemesterResults(bba));
      }
    }
  };

  // Explicit helper to load official BBA Accounting 126-Credit Curriculum
  const handleLoadBbaAccountingCurriculum = () => {
    const bba = getBbaAccountingCurriculum();
    setSelectedProgramCode(bba.code);
    setDepartment(bba.department);
    setMajorSubject("Accounting");
    setCurrentPeriod("8th Semester (Final)");
    setSemesters(generateDefaultSemesterResults(bba));
  };

  // Explicit helper to load official MBA in Accounting 48-Credit Curriculum (15 Subjects)
  const handleLoadMbaAccountingCurriculum = () => {
    const mba = getMbaAccountingCurriculum();
    setAcademicLevel("Masters");
    setSelectedProgramCode(mba.code);
    setDepartment(mba.department);
    setMajorSubject("Accounting");
    setCourseDuration("1 Year");
    setCurrentPeriod("2nd Semester (Final)");
    const timeline = calculateAcademicTimeline({
      academicLevel: "Masters",
      programCode: mba.code,
      session,
      manualAdmissionYear: admissionYear,
      manualDurationYears: 1
    });
    setCourseDuration(timeline.courseDuration);
    setExpectedCompletionYear(timeline.expectedCompletionYear);
    setExaminationYear(timeline.examinationYear);
    setPassingYear(timeline.examinationYear);
    setResultPublicationDate(timeline.suggestedPublicationDate);
    setCertificateIssueDate(timeline.suggestedCertificateIssueDate);
    refreshAutoNumbers("Masters", mba.code, session, admissionYear);
    setSemesters(generateDefaultSemesterResults(mba));
  };

  // Calculate CGPA dynamically from semesters
  const calculatedCgpa = calculateDegreeCgpa(semesters);

  // Calculate total program credits
  const totalProgramCredits = semesters.reduce(
    (sum, sem) => sum + sem.subjects.reduce((sSum, s) => sSum + (s.credit || 3), 0),
    0
  );

  // Toggle accordion for semester card
  const toggleSemester = (idx: number) => {
    setExpandedSemesters((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Add new semester/academic year
  const handleAddSemester = () => {
    const nextIdx = semesters.length + 1;
    const name = academicLevel === "Degree Pass" ? `${nextIdx}${nextIdx === 1 ? "st" : nextIdx === 2 ? "nd" : nextIdx === 3 ? "rd" : "th"} Year` : `${nextIdx}${nextIdx === 1 ? "st" : nextIdx === 2 ? "nd" : nextIdx === 3 ? "rd" : "th"} Semester`;
    const newSem: SemesterResult = {
      semesterName: name,
      semesterGpa: 3.50,
      totalCredits: 9,
      publicationDate: "2024-05-20",
      subjects: [
        {
          subjectCode: `${currentProgram?.code || "DEG"}-${nextIdx}01`,
          subjectName: `${currentProgram?.name || "Program"} Advanced Course`,
          credits: 3,
          marks: 78,
          gradePoint: 3.50,
          letterGrade: "A-",
          year: name
        }
      ]
    };
    setSemesters([...semesters, newSem]);
    setExpandedSemesters((prev) => ({ ...prev, [semesters.length]: true }));
  };

  // Delete a semester
  const handleDeleteSemester = (idx: number) => {
    if (semesters.length <= 1) {
      alert("At least one semester or academic year result is required.");
      return;
    }
    const updated = semesters.filter((_, i) => i !== idx);
    setSemesters(updated);
  };

  // Add subject inside a semester
  const handleAddSubjectToSemester = (semIdx: number) => {
    const sem = semesters[semIdx];
    const subIdx = sem.subjects.length + 1;
    const newSub: SubjectGrade = {
      subjectCode: `${currentProgram?.code || "CRS"}-${semIdx + 1}0${subIdx}`,
      subjectName: `New Course / Elective Paper ${subIdx}`,
      credits: 3,
      marks: 80,
      gradePoint: 4.00,
      letterGrade: "A+",
      year: sem.semesterName
    };
    const updatedSubjects = [...sem.subjects, newSub];
    const semGpa = calculateSemesterGpa(updatedSubjects);

    const updatedSemesters = [...semesters];
    updatedSemesters[semIdx] = {
      ...sem,
      subjects: updatedSubjects,
      semesterGpa: semGpa,
      totalCredits: updatedSubjects.reduce((sum, s) => sum + (s.credit || 3), 0)
    };
    setSemesters(updatedSemesters);
  };

  // Delete subject from semester
  const handleDeleteSubject = (semIdx: number, subIdx: number) => {
    const sem = semesters[semIdx];
    if (sem.subjects.length <= 1) {
      alert("Each semester/year must have at least one course.");
      return;
    }
    const updatedSubjects = sem.subjects.filter((_, i) => i !== subIdx);
    const semGpa = calculateSemesterGpa(updatedSubjects);

    const updatedSemesters = [...semesters];
    updatedSemesters[semIdx] = {
      ...sem,
      subjects: updatedSubjects,
      semesterGpa: semGpa,
      totalCredits: updatedSubjects.reduce((sum, s) => sum + (s.credit || 3), 0)
    };
    setSemesters(updatedSemesters);
  };

  // Update subject field
  const handleUpdateSubject = (semIdx: number, subIdx: number, field: keyof SubjectGrade, val: string | number) => {
    const sem = semesters[semIdx];
    const updatedSubjects = [...sem.subjects];
    const sub = { ...updatedSubjects[subIdx] };

    if (field === "marks") {
      let num = typeof val === "string" ? parseFloat(val) : val;
      if (isNaN(num)) num = 0;
      num = Math.max(0, Math.min(100, num));
      sub.marks = num;
      sub.gradePoint = getDiplomaGradePointFromMarks(num);
      sub.letterGrade = getDiplomaLetterGrade(sub.gradePoint);
    } else if (field === "gradePoint") {
      let gp = typeof val === "string" ? parseFloat(val) : val;
      if (isNaN(gp)) gp = 0;
      gp = Math.max(0, Math.min(4.00, gp));
      sub.gradePoint = gp;
      sub.letterGrade = getDiplomaLetterGrade(gp);
    } else if (field === "credit") {
      let cr = typeof val === "string" ? parseFloat(val) : val;
      if (isNaN(cr)) cr = 1;
      sub.credit = Math.max(0.5, Math.min(12, cr));
    } else if (field === "subjectName") {
      sub.subjectName = String(val);
    } else if (field === "subjectCode") {
      sub.subjectCode = String(val);
    }

    updatedSubjects[subIdx] = sub;
    const semGpa = calculateSemesterGpa(updatedSubjects);

    const updatedSemesters = [...semesters];
    updatedSemesters[semIdx] = {
      ...sem,
      subjects: updatedSubjects,
      semesterGpa: semGpa,
      totalCredits: updatedSubjects.reduce((sum, s) => sum + (s.credit || 3), 0)
    };
    setSemesters(updatedSemesters);
  };

  // Image Upload handler
  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file (JPG, PNG, WEBP).");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          // Compress to clean passport size
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let w = 180;
            let h = 240;
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, w, h);
              setPhotoUrl(canvas.toDataURL("image/jpeg", 0.8));
            }
          };
          img.src = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Required Field Validations
    if (!name.trim()) {
      setErrorMessage("Student Name is required.");
      return;
    }
    if (!fatherName.trim()) {
      setErrorMessage("Father's Name is required.");
      return;
    }
    if (!motherName.trim()) {
      setErrorMessage("Mother's Name is required.");
      return;
    }
    if (!rollNumber.trim()) {
      setErrorMessage("Student Roll Number is required.");
      return;
    }
    if (!registrationNumber.trim()) {
      setErrorMessage("Student Registration Number is required.");
      return;
    }
    if (certificateStatus === "Issued" && !certificateSerial.trim()) {
      setErrorMessage("Certificate Number is required when certificate status is 'Issued'. Click 'Generate' or enter the official number.");
      return;
    }
    if (!passingYear.trim()) {
      setErrorMessage("Passing Year is required.");
      return;
    }
    if (semesters.length === 0) {
      setErrorMessage("Please include at least one semester/academic year result.");
      return;
    }

    try {
      setIsSaving(true);

      // Flatten subjects for compatibility with existing verification reports
      const flattenedSubjects: SubjectGrade[] = [];
      for (const sem of semesters) {
        for (const s of sem.subjects) {
          flattenedSubjects.push({
            ...s,
            year: sem.semesterName
          });
        }
      }

      // Map academic level to Category enum
      const categoryEnum = 
        academicLevel === "Degree Pass" 
          ? Category.DEGREE_PASS 
          : academicLevel === "Honours" 
          ? Category.HONOURS 
          : Category.MASTERS;

      const finalGpaValue = calculatedCgpa;
      const totalMarksSum = flattenedSubjects.reduce((sum, s) => sum + (s.marks || 0), 0);

      const studentRecord: Student = {
        id: studentId.trim() || `student_deg_${Date.now()}`,
        category: categoryEnum,
        group: Group.GENERAL,
        religion: Religion.ISLAM,
        name: name.trim(),
        fatherName: fatherName.trim(),
        motherName: motherName.trim(),
        dob: dob,
        rollNumber: rollNumber.trim(),
        registrationNumber: registrationNumber.trim(),
        instituteName: "Bangladesh National Institute of Education (BNIE)",
        session: session.trim(),
        passingYear: passingYear.trim(),
        certificateSerialNumber: certificateSerial.trim(),
        issueDate: certificateIssueDate || issueDate,
        photoUrl: photoUrl,
        secureToken: existingStudent?.secureToken || generateSecureToken(),
        subjects: flattenedSubjects,
        finalGpa: finalGpaValue,
        totalMarks: totalMarksSum,

        // Higher Education specific fields
        academicLevel: academicLevel,
        programName: currentProgram?.name || "Higher Education Degree",
        programCode: currentProgram?.code || "DEG-01",
        department: department.trim(),
        majorSubject: majorSubject.trim(),
        currentSemesterOrYear: currentPeriod.trim(),
        resultStatus: resultStatus,
        maxGpa: 4.00,
        semesterResults: semesters,

        // Automatic Academic Numbering, Timeline & Certification Fields
        admissionYear: admissionYear.trim(),
        courseDuration: courseDuration.trim(),
        expectedCompletionYear: expectedCompletionYear.trim(),
        examinationYear: examinationYear.trim(),
        resultPublicationDate: resultPublicationDate.trim(),
        certificateIssueDate: certificateIssueDate.trim(),
        certificateNumber: certificateSerial.trim(),
        certificateStatus: certificateStatus,
        auditLog: auditLog
      };

      await onSaveStudent(studentRecord);
      setSuccessMessage(`Successfully saved ${academicLevel} student record for ${name}!`);
      setTimeout(() => {
        // give brief delay to show green banner before closing
        onCancel();
      }, 700);
    } catch (err) {
      console.error("Save failed:", err);
      setErrorMessage("Failed to save student record to database. Please check your network and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 sm:p-8 space-y-6">
      
      {/* Top Header & Qualification Category Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-gray-200 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-[#006a4e] border border-emerald-200 rounded-full text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4" />
              <span>Higher Education Student Enrollment</span>
            </span>
            <span className="text-xs font-mono font-bold text-gray-400">Scale: 4.00 CGPA</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-950 font-sans tracking-tight">
            {existingStudent ? "Edit Higher Education Record" : "Register Degree Pass / Honours / Masters Candidate"}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Create accredited student profiles with semester-wise mark sheets, department/major assignment, and tamper-proof verification records.
          </p>
        </div>

        {/* Close / Return Button */}
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer self-start md:self-auto"
        >
          <X className="w-4 h-4" />
          <span>Cancel</span>
        </button>
      </div>

      {/* Switcher to School System if needed */}
      {onSwitchToSchoolSystem && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-gray-600 font-medium">
            Need to register an SSC, HSC, or 4-Year Polytechnic Diploma student instead?
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onSwitchToSchoolSystem(Category.SSC)}
              className="px-2.5 py-1 bg-white border border-gray-300 rounded-md font-bold text-gray-800 hover:border-[#006a4e] hover:text-[#006a4e] cursor-pointer"
            >
              SSC Form
            </button>
            <button
              type="button"
              onClick={() => onSwitchToSchoolSystem(Category.HSC)}
              className="px-2.5 py-1 bg-white border border-gray-300 rounded-md font-bold text-gray-800 hover:border-[#006a4e] hover:text-[#006a4e] cursor-pointer"
            >
              HSC Form
            </button>
            <button
              type="button"
              onClick={() => onSwitchToSchoolSystem(Category.DIPLOMA)}
              className="px-2.5 py-1 bg-white border border-gray-300 rounded-md font-bold text-gray-800 hover:border-[#006a4e] hover:text-[#006a4e] cursor-pointer"
            >
              Diploma Form
            </button>
          </div>
        </div>
      )}

      {/* 3 Selectable Higher Education Categories */}
      <div className="space-y-2">
        <label className="text-xs font-extrabold uppercase tracking-wider text-black block">
          Select Academic Qualification Category <span className="text-[#006a4e]">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(["Honours", "Degree Pass", "Masters"] as const).map((level) => {
            const isSelected = academicLevel === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => handleLevelChange(level)}
                className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex items-start justify-between ${
                  isSelected
                    ? "border-[#006a4e] bg-emerald-50/40 shadow-xs"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60"
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-extrabold font-sans ${isSelected ? "text-[#006a4e]" : "text-black"}`}>
                      {level}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#006a4e] inline-block" />
                    )}
                  </div>
                  <span className="text-[11px] text-gray-500 block mt-0.5">
                    {level === "Honours" && "4-Year Bachelor (8 Semesters)"}
                    {level === "Degree Pass" && "3-Year Degree (Annual System)"}
                    {level === "Masters" && "1-2 Year Post-Graduate (2-4 Semesters)"}
                  </span>
                </div>

                <div className={`p-1.5 rounded-lg ${isSelected ? "bg-[#006a4e] text-white" : "bg-gray-100 text-gray-400"}`}>
                  <GraduationCap className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Success / Error Feedback Banners */}
      {errorMessage && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* SECTION 1: PROGRAM & ACADEMIC CATALOG ENROLLMENT */}
        <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-200 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
            <BookOpen className="w-4 h-4 text-[#006a4e]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-black">
              1. Academic Program &amp; Major Subject Selection (Configured Catalog)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Program Dropdown from Catalog */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                Academic Program <span className="text-[#006a4e]">*</span>
              </label>
              <select
                value={selectedProgramCode}
                onChange={(e) => handleProgramChange(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
              >
                {availablePrograms.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-gray-500 font-medium">
                {currentProgram?.duration} • {currentProgram?.structureType}
              </span>
            </div>

            {/* Department */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                Faculty / Department <span className="text-[#006a4e]">*</span>
              </label>
              <input
                type="text"
                required
                autoComplete="off"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder=""
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
              />
            </div>

            {/* Major Subject */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                Major Subject / Specialization <span className="text-[#006a4e]">*</span>
              </label>
              <div className="space-y-1.5">
                <select
                  value={majorSubject}
                  onChange={(e) => handleMajorChange(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                >
                  {currentProgram?.majorSubjects.map((maj) => (
                    <option key={maj} value={maj}>
                      {maj}
                    </option>
                  ))}
                  <option value="Custom">Other Specialization (Type below)</option>
                </select>
                {majorSubject === "Custom" && (
                  <input
                    type="text"
                    autoComplete="off"
                    placeholder=""
                    onChange={(e) => setMajorSubject(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-gray-900"
                  />
                )}
              </div>
            </div>
          </div>

          {/* MBA in Accounting Curriculum Active Notice */}
          {(academicLevel === "Masters" || selectedProgramCode.includes("MBA")) && majorSubject.toLowerCase().includes("accounting") && (
            <div className="mt-3 bg-emerald-50 border border-emerald-300/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-950">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#006a4e] shrink-0" />
                <span>
                  <strong>MBA in Accounting Default Curriculum:</strong> 1 Year • 2 Semesters • 15 Subjects (48 Credits) • 14 Core (3 Credits each) + Internship, Project Paper &amp; Defense (6 Credits) = <strong>48 Total Program Credits</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-300 text-[#006a4e]">
                  Current Credits: {totalProgramCredits} / 48
                </span>
                <button
                  type="button"
                  onClick={handleLoadMbaAccountingCurriculum}
                  className="bg-[#006a4e] text-white px-2.5 py-1 rounded-lg font-bold text-[11px] hover:bg-[#005a42] transition-colors cursor-pointer"
                >
                  Load Standard 48-Cr MBA Accounting Curriculum
                </button>
              </div>
            </div>
          )}

          {/* BBA in Accounting Curriculum Active Notice */}
          {academicLevel !== "Masters" && !selectedProgramCode.includes("MBA") && (selectedProgramCode.includes("BBA") || majorSubject.toLowerCase().includes("accounting")) && (
            <div className="mt-3 bg-emerald-50 border border-emerald-300/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-950">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#006a4e] shrink-0" />
                <span>
                  <strong>BBA in Accounting Default Curriculum:</strong> 8 Semesters • 40 Courses (120 Credits) + Combined Oral Exam (3 Credits) + Internship Project Paper (3 Credits) = <strong>126 Total Program Credits</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-300 text-[#006a4e]">
                  Current Credits: {totalProgramCredits} / 126
                </span>
                <button
                  type="button"
                  onClick={handleLoadBbaAccountingCurriculum}
                  className="bg-[#006a4e] text-white px-2.5 py-1 rounded-lg font-bold text-[11px] hover:bg-[#005a42] transition-colors cursor-pointer"
                >
                  Load Standard 126-Cr Curriculum
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: STUDENT BIOGRAPHICAL & REGISTRATION IDENTIFIERS */}
        <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-200 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
            <Building2 className="w-4 h-4 text-[#006a4e]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-black">
              2. Student Identity, Registration &amp; Examination Identifiers
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Student Passport Photo Ingestion */}
            <div className="md:col-span-1 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-gray-200 space-y-2.5 text-center">
              <span className="text-[10px] font-bold text-black uppercase tracking-wider">
                Passport Photograph (3:4)
              </span>
              <div className="w-24 h-32 rounded-xl border-2 border-[#006a4e] overflow-hidden bg-gray-100 shadow-2xs relative flex items-center justify-center">
                <img
                  src={photoUrl}
                  alt="Student Portrait"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1 w-full">
                <label className="inline-flex items-center justify-center gap-1.5 w-full px-2.5 py-1.5 bg-[#006a4e] hover:bg-[#005a42] text-white rounded-lg text-[11px] font-bold cursor-pointer transition-colors shadow-2xs">
                  <Upload className="w-3 h-3" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                <div className="flex justify-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPhotoUrl(PASSPORT_AVATARS.male1)}
                    className="text-[10px] text-gray-500 hover:text-black font-semibold"
                  >
                    Avatar 1
                  </button>
                  <span className="text-[10px] text-gray-300">•</span>
                  <button
                    type="button"
                    onClick={() => setPhotoUrl(PASSPORT_AVATARS.female1)}
                    className="text-[10px] text-gray-500 hover:text-black font-semibold"
                  >
                    Avatar 2
                  </button>
                </div>
              </div>
            </div>

            {/* Candidate & Guardian Names */}
            <div className="md:col-span-3 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                    Student Full Name <span className="text-[#006a4e]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder=""
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                    Father's Name <span className="text-[#006a4e]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder=""
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                    Mother's Name <span className="text-[#006a4e]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder=""
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Block A: Institutional Numbering (Roll, Registration, Student ID) */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-150 pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#006a4e]" />
                    <span className="text-xs font-black uppercase tracking-wider text-black">
                      Automatic Academic Numbering System
                    </span>
                  </div>
                  {!existingStudent && (
                    <button
                      type="button"
                      onClick={() => refreshAutoNumbers()}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#006a4e] border border-emerald-200 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                      title="Recalculate next sequential roll and registration number"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Refresh Counters</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Student ID */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                      Student ID <span className="text-[#006a4e]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder=""
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                    />
                  </div>

                  {/* Automatic Roll Number */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                        Roll Number <span className="text-[#006a4e]">*</span>
                      </label>
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {existingStudent ? "Saved" : "Sequential Auto"}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (!isManualRollOverride) {
                              const confirmManual = confirm("Enable manual Roll Number override? Any manual changes will be recorded in the audit log.");
                              if (confirmManual) {
                                setIsManualRollOverride(true);
                                setAuditLog((prev) => [
                                  ...prev,
                                  {
                                    action: "Manual Roll Override Enabled",
                                    timestamp: new Date().toISOString(),
                                    details: `Roll manual override enabled for student ${studentId}. Previous: ${rollNumber}`
                                  }
                                ]);
                              }
                            } else {
                              setIsManualRollOverride(false);
                            }
                          }}
                          className="text-[10px] text-gray-500 hover:text-black font-semibold flex items-center gap-0.5 ml-1"
                          title="Manual Roll Override"
                        >
                          {isManualRollOverride ? <Lock className="w-2.5 h-2.5 text-amber-600" /> : <Unlock className="w-2.5 h-2.5 text-gray-400" />}
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={rollNumber}
                      readOnly={!isManualRollOverride && Boolean(existingStudent)}
                      onChange={(e) => {
                        setRollNumber(e.target.value);
                        setAuditLog((prev) => [
                          ...prev,
                          {
                            action: "Roll Number Modified",
                            timestamp: new Date().toISOString(),
                            details: `Manual correction of Roll Number to: ${e.target.value}`
                          }
                        ]);
                      }}
                      placeholder=""
                      className={`w-full border rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-hidden ${
                        !isManualRollOverride && Boolean(existingStudent)
                          ? "bg-gray-100 border-gray-200 text-gray-700 cursor-not-allowed"
                          : "bg-white border-emerald-400 text-gray-900 focus:border-[#006a4e]"
                      }`}
                    />
                    <span className="text-[9px] text-gray-500 block">
                      Format: BNIE-[LEVEL]-[YY]-[SERIAL] (e.g. BNIE-HN-24-7294, BNIE-DG-24-5837, BNIE-MS-24-4168)
                    </span>
                  </div>

                  {/* Automatic Registration Number */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                        Registration Number <span className="text-[#006a4e]">*</span>
                      </label>
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {existingStudent ? "Preserved" : "Unique Auto"}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (!isManualRegOverride) {
                              const confirmManual = confirm("Enable manual Registration Number override? Any manual changes will be recorded in the audit log.");
                              if (confirmManual) {
                                setIsManualRegOverride(true);
                                setAuditLog((prev) => [
                                  ...prev,
                                  {
                                    action: "Manual Reg Override Enabled",
                                    timestamp: new Date().toISOString(),
                                    details: `Reg manual override enabled for student ${studentId}. Previous: ${registrationNumber}`
                                  }
                                ]);
                              }
                            } else {
                              setIsManualRegOverride(false);
                            }
                          }}
                          className="text-[10px] text-gray-500 hover:text-black font-semibold flex items-center gap-0.5 ml-1"
                          title="Manual Registration Override"
                        >
                          {isManualRegOverride ? <Lock className="w-2.5 h-2.5 text-amber-600" /> : <Unlock className="w-2.5 h-2.5 text-gray-400" />}
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={registrationNumber}
                      readOnly={!isManualRegOverride && Boolean(existingStudent)}
                      onChange={(e) => {
                        setRegistrationNumber(e.target.value);
                        setAuditLog((prev) => [
                          ...prev,
                          {
                            action: "Registration Number Modified",
                            timestamp: new Date().toISOString(),
                            details: `Manual correction of Registration Number to: ${e.target.value}`
                          }
                        ]);
                      }}
                      placeholder=""
                      className={`w-full border rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-hidden ${
                        !isManualRegOverride && Boolean(existingStudent)
                          ? "bg-gray-100 border-gray-200 text-gray-700 cursor-not-allowed"
                          : "bg-white border-emerald-400 text-gray-900 focus:border-[#006a4e]"
                      }`}
                    />
                    <span className="text-[9px] text-gray-500 block">
                      Format: BNIE-REG-[LEVEL]-[YYYY]-[SERIAL] (e.g. BNIE-REG-HN-2024-846291)
                    </span>
                  </div>
                </div>
              </div>

              {/* Block B: Academic Session & Timeline Progression */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center gap-2 border-b border-gray-150 pb-2">
                  <Calendar className="w-4 h-4 text-[#006a4e]" />
                  <span className="text-xs font-black uppercase tracking-wider text-black">
                    Academic Session, Timeline &amp; Progression Logic
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                      Academic Session <span className="text-[#006a4e]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={session}
                      onChange={(e) => handleSessionChange(e.target.value)}
                      placeholder=""
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                      Admission Year <span className="text-[#006a4e]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={admissionYear}
                      onChange={(e) => {
                        setAdmissionYear(e.target.value);
                        const durYears = parseInt(courseDuration, 10) || (academicLevel === "Degree Pass" ? 3 : academicLevel === "Masters" ? 2 : 4);
                        const admNum = parseInt(e.target.value, 10);
                        if (!isNaN(admNum)) {
                          setExpectedCompletionYear((admNum + durYears).toString());
                          setPassingYear((admNum + durYears).toString());
                          setExaminationYear((admNum + durYears).toString());
                        }
                      }}
                      placeholder=""
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                      Course Duration <span className="text-[#006a4e]">*</span>
                    </label>
                    <select
                      value={courseDuration}
                      onChange={(e) => {
                        setCourseDuration(e.target.value);
                        const durNum = parseInt(e.target.value, 10);
                        const admNum = parseInt(admissionYear, 10);
                        if (!isNaN(durNum) && !isNaN(admNum)) {
                          setExpectedCompletionYear((admNum + durNum).toString());
                          setPassingYear((admNum + durNum).toString());
                          setExaminationYear((admNum + durNum).toString());
                        }
                      }}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                    >
                      <option value="4 Years">4 Years (8 Semesters)</option>
                      <option value="3 Years">3 Years (Degree Pass)</option>
                      <option value="2 Years">2 Years (Masters/MBA)</option>
                      <option value="1 Year">1 Year (Executive Masters)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                      Expected Completion <span className="text-[#006a4e]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={expectedCompletionYear}
                      onChange={(e) => setExpectedCompletionYear(e.target.value)}
                      placeholder=""
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                      Examination Year <span className="text-[#006a4e]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={examinationYear}
                      onChange={(e) => setExaminationYear(e.target.value)}
                      placeholder=""
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                      Actual Passing Year <span className="text-[#006a4e]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={passingYear}
                      onChange={(e) => setPassingYear(e.target.value)}
                      placeholder=""
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                      Evaluated Period <span className="text-[#006a4e]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={currentPeriod}
                      onChange={(e) => setCurrentPeriod(e.target.value)}
                      placeholder=""
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                      Result Status
                    </label>
                    <select
                      value={resultStatus}
                      onChange={(e) => setResultStatus(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                    >
                      <option value="First Class">First Class</option>
                      <option value="Second Class">Second Class</option>
                      <option value="Graduated with Distinction">Graduated with Distinction</option>
                      <option value="Passed">Passed</option>
                      <option value="Promoted">Promoted</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Block C: Official Result Publication & Certificate Issuance Policy */}
              <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-150 pb-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#006a4e]" />
                    <span className="text-xs font-black uppercase tracking-wider text-black">
                      Official Result Publication &amp; Certificate Issuance Policy
                    </span>
                  </div>
                  {auditLog.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAuditLogModal(!showAuditLogModal)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      <History className="w-3 h-3 text-[#006a4e]" />
                      <span>Audit Log ({auditLog.length})</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Official Result Publication Date */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                      Result Publication Date <span className="text-[#006a4e]">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={resultPublicationDate}
                      onChange={(e) => {
                        setResultPublicationDate(e.target.value);
                        // Recalculate suggested certificate issue date (180 days policy)
                        const sugg = calculateSuggestedCertificateIssueDate(e.target.value, 180);
                        if (sugg) {
                          setCertificateIssueDate(sugg);
                          setIssueDate(sugg);
                        }
                      }}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                    />
                    <span className="text-[9px] text-gray-500 block">
                      Official publication date confirmed by Controller of Exam
                    </span>
                  </div>

                  {/* Certificate Status */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                      Certificate Status <span className="text-[#006a4e]">*</span>
                    </label>
                    <select
                      value={certificateStatus}
                      onChange={(e) => {
                        const newStatus = e.target.value as "Pending" | "Eligible for Issue" | "Issued";
                        setCertificateStatus(newStatus);
                        if (newStatus === "Issued" && !certificateSerial) {
                          const autoCert = generateOfficialCertificateNumber({
                            academicLevel,
                            programCode: selectedProgramCode,
                            passingYear,
                            existingStudents: allStudents
                          });
                          setCertificateSerial(autoCert);
                        }
                      }}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                    >
                      <option value="Pending">Pending (Under Convocational Review)</option>
                      <option value="Eligible for Issue">Eligible for Issue (Clearance Approved)</option>
                      <option value="Issued">Issued (Officially Sealed &amp; Delivered)</option>
                    </select>
                    <span className="text-[9px] text-gray-500 block">
                      Controls public display of certificate number on marksheet
                    </span>
                  </div>

                  {/* Certificate Number */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                        Certificate Number {certificateStatus === "Issued" && <span className="text-[#006a4e]">*</span>}
                      </label>
                      {certificateStatus === "Issued" && (
                        <button
                          type="button"
                          onClick={() => {
                            const newCert = generateOfficialCertificateNumber({
                              academicLevel,
                              programCode: selectedProgramCode,
                              passingYear,
                              existingStudents: allStudents
                            });
                            setCertificateSerial(newCert);
                          }}
                          className="text-[10px] text-[#006a4e] hover:underline font-bold"
                        >
                          Generate Official No
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      autoComplete="off"
                      value={certificateSerial}
                      disabled={certificateStatus !== "Issued"}
                      onChange={(e) => setCertificateSerial(e.target.value)}
                      placeholder=""
                      className={`w-full border rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-hidden ${
                        certificateStatus !== "Issued"
                          ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white border-gray-300 text-gray-900 focus:border-[#006a4e]"
                      }`}
                    />
                    <span className="text-[9px] text-gray-500 block">
                      {certificateStatus !== "Issued" ? "Enabled when status is 'Issued'" : "Format: BNIE-[PROG]-CERT-[YEAR]-[SEQ]"}
                    </span>
                  </div>
                </div>

                {/* Certificate Issue Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                      Certificate Issue Date {certificateStatus === "Issued" && <span className="text-[#006a4e]">*</span>}
                    </label>
                    <input
                      type="date"
                      value={certificateIssueDate}
                      onChange={(e) => {
                        setCertificateIssueDate(e.target.value);
                        setIssueDate(e.target.value);
                      }}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                    />
                    <span className="text-[9px] text-gray-500 block">
                      Calculated using 180-day policy from publication date
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                      Issuing Senate Authority
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="BNIE Academic Senate & Controller of Examinations"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 cursor-not-allowed"
                    />
                    <span className="text-[9px] text-gray-500 block">
                      Standard Central Senate Accreditation
                    </span>
                  </div>
                </div>

                {/* Audit Log expandable panel */}
                {showAuditLogModal && (
                  <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-1">
                      <span className="text-xs font-bold text-gray-900">Academic Numbering &amp; Data Audit Trail</span>
                      <button
                        type="button"
                        onClick={() => setShowAuditLogModal(false)}
                        className="text-xs text-gray-500 hover:text-black font-bold"
                      >
                        Close
                      </button>
                    </div>
                    {auditLog.length === 0 ? (
                      <p className="text-[11px] text-gray-500">No manual corrections recorded.</p>
                    ) : (
                      <div className="space-y-1 max-h-36 overflow-y-auto text-[10px]">
                        {auditLog.map((log, lIdx) => (
                          <div key={lIdx} className="bg-white p-1.5 rounded border border-gray-200">
                            <span className="font-bold text-[#006a4e]">{log.action}</span> • <span className="text-gray-400 font-mono">{log.timestamp.slice(0, 19).replace("T", " ")}</span>
                            <p className="text-gray-700">{log.details}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* SECTION 3: SEMESTER-WISE & YEAR-WISE RESULTS BUILDER */}
        <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#006a4e]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-black">
                  3. Semester-Wise / Year-Wise Results &amp; Transcript Records
                </h3>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Each semester or academic year calculates its GPA automatically on the 4.00 scale based on earned marks and course credits.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-right">
                <span className="text-[10px] text-gray-500 uppercase font-bold block">Final Cumulative CGPA</span>
                <span className="text-base font-black font-mono text-[#006a4e]">
                  {calculatedCgpa.toFixed(2)} / 4.00
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddSemester}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#006a4e] text-white rounded-xl text-xs font-bold hover:bg-[#005a42] transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add {academicLevel === "Degree Pass" ? "Year" : "Semester"}</span>
              </button>
            </div>
          </div>

          {/* List of Semesters / Academic Years */}
          <div className="space-y-4">
            {semesters.map((sem, semIdx) => {
              const isExpanded = expandedSemesters[semIdx] ?? true;
              return (
                <div
                  key={semIdx}
                  className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden"
                >
                  {/* Semester Card Top Bar */}
                  <div className="p-3.5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleSemester(semIdx)}
                        className="text-gray-500 hover:text-black cursor-pointer p-0.5"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <input
                        type="text"
                        value={sem.semesterName}
                        onChange={(e) => {
                          const updated = [...semesters];
                          updated[semIdx].semesterName = e.target.value;
                          setSemesters(updated);
                        }}
                        className="font-extrabold text-xs text-black bg-white border border-gray-300 rounded-lg px-2.5 py-1 focus:border-[#006a4e] focus:outline-hidden w-40"
                      />

                      <span className="text-[11px] font-mono text-gray-500">
                        ({sem.subjects.length} course{sem.subjects.length > 1 ? "s" : ""})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-gray-500 font-medium">Semester GPA:</span>
                        <span className="font-mono font-black text-[#006a4e] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {sem.semesterGpa.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-gray-500 font-medium">Date:</span>
                        <input
                          type="date"
                          value={sem.publicationDate || "2024-05-15"}
                          onChange={(e) => {
                            const updated = [...semesters];
                            updated[semIdx].publicationDate = e.target.value;
                            setSemesters(updated);
                          }}
                          className="bg-white border border-gray-300 rounded px-1.5 py-0.5 text-[11px] font-mono text-gray-700"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteSemester(semIdx)}
                        title="Delete this semester"
                        className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Course Subjects Table */}
                  {isExpanded && (
                    <div className="p-4 space-y-3">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-gray-200 text-[10px] font-bold uppercase text-gray-600 bg-gray-50/50">
                              <th className="py-2 px-2 text-center w-10">SL</th>
                              <th className="py-2 px-2.5 w-24">Code</th>
                              <th className="py-2 px-2.5">Course Title</th>
                              <th className="py-2 px-2.5 w-20 text-center">Credit</th>
                              <th className="py-2 px-2.5 w-20 text-center">Marks (100)</th>
                              <th className="py-2 px-2.5 w-20 text-center">GP (4.00)</th>
                              <th className="py-2 px-2.5 w-16 text-center">Grade</th>
                              <th className="py-2 px-1 text-right"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {sem.subjects.map((sub, subIdx) => (
                              <tr key={subIdx} className="hover:bg-gray-50/60">
                                <td className="py-2 px-2 text-center font-mono font-bold text-gray-500 text-[11px]">
                                  {sub.serialNo || (sub.displayOrder ? String(sub.displayOrder).padStart(2, "0") : String(subIdx + 1).padStart(2, "0"))}
                                </td>
                                <td className="py-2 px-2.5">
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    value={sub.subjectCode || ""}
                                    onChange={(e) => handleUpdateSubject(semIdx, subIdx, "subjectCode", e.target.value)}
                                    placeholder=""
                                    className="w-24 bg-white border border-gray-300 rounded px-2 py-1 text-xs font-mono font-bold text-gray-900"
                                  />
                                </td>
                                <td className="py-2 px-2.5">
                                  <input
                                    type="text"
                                    autoComplete="off"
                                    value={sub.subjectName}
                                    onChange={(e) => handleUpdateSubject(semIdx, subIdx, "subjectName", e.target.value)}
                                    placeholder=""
                                    className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-xs font-medium text-gray-900"
                                  />
                                </td>
                                <td className="py-2 px-2.5 text-center">
                                  <input
                                    type="number"
                                    step="0.5"
                                    min="0.5"
                                    max="12"
                                    value={sub.credit || 3}
                                    onChange={(e) => handleUpdateSubject(semIdx, subIdx, "credit", e.target.value)}
                                    className="w-14 bg-white border border-gray-300 rounded px-1.5 py-1 text-xs text-center font-mono font-bold text-gray-900"
                                  />
                                </td>
                                <td className="py-2 px-2.5 text-center">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={sub.marks ?? 80}
                                    onChange={(e) => handleUpdateSubject(semIdx, subIdx, "marks", e.target.value)}
                                    className="w-16 bg-white border border-gray-300 rounded px-1.5 py-1 text-xs text-center font-mono font-bold text-gray-900"
                                  />
                                </td>
                                <td className="py-2 px-2.5 text-center">
                                  <span className="font-mono font-extrabold text-[#006a4e]">
                                    {sub.gradePoint.toFixed(2)}
                                  </span>
                                </td>
                                <td className="py-2 px-2.5 text-center">
                                  <span className="inline-block px-1.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    {sub.letterGrade || getDiplomaLetterGrade(sub.gradePoint)}
                                  </span>
                                </td>
                                <td className="py-2 px-1 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSubject(semIdx, subIdx)}
                                    className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                                    title="Remove Course"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="pt-2 flex justify-between items-center">
                        <button
                          type="button"
                          onClick={() => handleAddSubjectToSemester(semIdx)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006a4e] hover:text-[#005a42] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Subject to {sem.semesterName}</span>
                        </button>

                        <div className="text-[11px] text-gray-500 font-mono">
                          Credits: {sem.subjects.reduce((sum, s) => sum + (s.credit || 3), 0)} Total
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-600">
              Final Earned Cumulative CGPA:
            </span>
            <span className="text-xl font-black font-mono text-[#006a4e] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
              {calculatedCgpa.toFixed(2)} / 4.00
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#006a4e] hover:bg-[#005a42] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving to Database..." : `Save ${academicLevel} Record`}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
