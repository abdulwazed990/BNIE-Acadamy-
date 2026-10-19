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
  generateDefaultSemesterResults 
} from "../data/degreeProgramsCatalog";
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
  X
} from "lucide-react";
import { PASSPORT_AVATARS } from "../data/defaultStudents";

interface DegreeStudentFormProps {
  initialLevel?: "Degree Pass" | "Honours" | "Masters";
  existingStudent?: Student | null;
  onSaveStudent: (student: Student) => Promise<void> | void;
  onCancel: () => void;
  onSwitchToSchoolSystem?: (category: Category) => void;
}

export default function DegreeStudentForm({
  initialLevel = "Honours",
  existingStudent = null,
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
  const [session, setSession] = useState(existingStudent?.session || "2020-2021");
  const [currentPeriod, setCurrentPeriod] = useState(
    existingStudent?.currentSemesterOrYear || (academicLevel === "Degree Pass" ? "3rd Year (Final)" : academicLevel === "Masters" ? "4th Semester (Final)" : "8th Semester (Final)")
  );
  const [rollNumber, setRollNumber] = useState(existingStudent?.rollNumber || "");
  const [registrationNumber, setRegistrationNumber] = useState(existingStudent?.registrationNumber || "");
  const [studentId, setStudentId] = useState(existingStudent?.id || `BNIE-DEG-${Math.floor(100000 + Math.random() * 900000)}`);
  const [certificateSerial, setCertificateSerial] = useState(
    existingStudent?.certificateSerialNumber || `BNIE-${academicLevel === "Degree Pass" ? "DEG" : academicLevel.toUpperCase().slice(0, 3)}-2024-${Math.floor(10000 + Math.random() * 90000)}`
  );
  const [passingYear, setPassingYear] = useState(existingStudent?.passingYear || "2024");
  const [issueDate, setIssueDate] = useState(existingStudent?.issueDate || "2024-07-15");
  const [resultStatus, setResultStatus] = useState(existingStudent?.resultStatus || "First Class");
  const [photoUrl, setPhotoUrl] = useState(existingStudent?.photoUrl || PASSPORT_AVATARS.male1);
  const [dob, setDob] = useState(existingStudent?.dob || "2001-08-14");

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
      setCertificateSerial(`BNIE-${newLevel === "Degree Pass" ? "DEG" : newLevel.toUpperCase().slice(0, 3)}-2024-${Math.floor(10000 + Math.random() * 90000)}`);
      setSemesters(generateDefaultSemesterResults(p));
    }
  };

  // Sync when program changes
  const handleProgramChange = (code: string) => {
    setSelectedProgramCode(code);
    const p = DEGREE_PROGRAMS_CATALOG.find((item) => item.code === code);
    if (p) {
      setDepartment(p.department);
      setMajorSubject(p.majorSubjects[0] || "");
      setSemesters(generateDefaultSemesterResults(p));
    }
  };

  // Calculate CGPA dynamically from semesters
  const calculatedCgpa = calculateDegreeCgpa(semesters);

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
    if (!certificateSerial.trim()) {
      setErrorMessage("Student Certificate Number is required.");
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
        issueDate: issueDate,
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
        semesterResults: semesters
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
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Department of English"
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
                  onChange={(e) => setMajorSubject(e.target.value)}
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
                    placeholder="Enter custom major subject name"
                    onChange={(e) => setMajorSubject(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs text-gray-900"
                  />
                )}
              </div>
            </div>
          </div>
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

              {/* Numbers Grid: Student ID, Roll, Reg, Certificate, Session, Passing Year */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                    Student ID <span className="text-[#006a4e]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder=""
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                    Roll Number <span className="text-[#006a4e]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder=""
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                    Registration Number <span className="text-[#006a4e]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder=""
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                    Certificate Number <span className="text-[#006a4e]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={certificateSerial}
                    onChange={(e) => setCertificateSerial(e.target.value)}
                    placeholder=""
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                    Academic Session <span className="text-[#006a4e]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    placeholder=""
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                    Passing Year <span className="text-[#006a4e]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={passingYear}
                    onChange={(e) => setPassingYear(e.target.value)}
                    placeholder=""
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                    Semester / Academic Year <span className="text-[#006a4e]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={currentPeriod}
                    onChange={(e) => setCurrentPeriod(e.target.value)}
                    placeholder=""
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-black uppercase tracking-wider block">
                    Certificate Issue Date
                  </label>
                  <input
                    type="date"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
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
                              <th className="py-2 px-2.5">Code</th>
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
                                <td className="py-2 px-2.5">
                                  <input
                                    type="text"
                                    value={sub.subjectCode || ""}
                                    onChange={(e) => handleUpdateSubject(semIdx, subIdx, "subjectCode", e.target.value)}
                                    placeholder="Code"
                                    className="w-24 bg-white border border-gray-300 rounded px-2 py-1 text-xs font-mono font-bold text-gray-900"
                                  />
                                </td>
                                <td className="py-2 px-2.5">
                                  <input
                                    type="text"
                                    value={sub.subjectName}
                                    onChange={(e) => handleUpdateSubject(semIdx, subIdx, "subjectName", e.target.value)}
                                    placeholder="Course Title"
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
