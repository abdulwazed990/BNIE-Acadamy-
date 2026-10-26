import { useState, useEffect } from "react";
import { 
  AcademicProgramConfig, 
  SubjectGrade 
} from "../types";
import { 
  fetchAllAcademicPrograms, 
  saveAcademicProgram, 
  deleteAcademicProgram, 
  getLocalAcademicPrograms 
} from "../lib/academicProgramService";
import { 
  PROPOSED_BA_HISTORY_30_CATALOGUE, 
  getHistorical3YearHonoursHistoryPreset, 
  getDegreePassPreset 
} from "../data/baHistoryCatalogue";
import { 
  BookOpen, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  History, 
  Calendar, 
  Building2, 
  Layers, 
  Award, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function AcademicProgramAdminModule() {
  const [programs, setPrograms] = useState<AcademicProgramConfig[]>(getLocalAcademicPrograms);
  const [selectedProgramId, setSelectedProgramId] = useState<string>(
    programs[0]?.id || "prog-ba-hon-hist-1994"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ message: string; type: "success" | "error" | null }>({
    message: "",
    type: null
  });
  const [isSaving, setIsSaving] = useState(false);

  // Form states for creating / editing a program
  const currentProgram = programs.find((p) => p.id === selectedProgramId) || programs[0];

  const [institutionName, setInstitutionName] = useState("");
  const [affiliatedCollege, setAffiliatedCollege] = useState("");
  const [degreeType, setDegreeType] = useState<"Bachelor of Arts (B.A.) Honours" | "Bachelor of Arts (B.A.) Degree Pass" | "Other">("Bachelor of Arts (B.A.) Honours");
  const [examinationTitle, setExaminationTitle] = useState("");
  const [majorSubject, setMajorSubject] = useState("");
  const [academicSession, setAcademicSession] = useState("");
  const [examinationYear, setExaminationYear] = useState("");
  const [durationYears, setDurationYears] = useState(3);
  const [examinationStructure, setExaminationStructure] = useState<"Annual (3-Year)" | "Annual (2-Year)" | "Semester-based (4-Year / 8 Semesters)" | "Part-based">("Annual (3-Year)");
  const [syllabusVersion, setSyllabusVersion] = useState("");
  const [isSyllabusVerified, setIsSyllabusVerified] = useState(false);
  const [gradingMethod, setGradingMethod] = useState<"Division/Class" | "GPA/CGPA" | "Marks Only">("Division/Class");
  const [firstMinPercent, setFirstMinPercent] = useState(60);
  const [secondMinPercent, setSecondMinPercent] = useState(45);
  const [thirdMinPercent, setThirdMinPercent] = useState(36);
  const [passMinPercent, setPassMinPercent] = useState(36);
  const [starMinPercent, setStarMinPercent] = useState(75);
  const [resultPublicationDate, setResultPublicationDate] = useState("");
  const [status, setStatus] = useState<"Published" | "Draft" | "Pending Verification">("Published");
  const [subjects, setSubjects] = useState<SubjectGrade[]>([]);

  // Subject quick add modal / custom subject
  const [showSubjectCatalogueModal, setShowSubjectCatalogueModal] = useState(false);
  const [customSubjectCode, setCustomSubjectCode] = useState("");
  const [customSubjectTitle, setCustomSubjectTitle] = useState("");
  const [customSubjectYear, setCustomSubjectYear] = useState("First Year");
  const [customFullMarks, setCustomFullMarks] = useState(100);
  const [customPassMarks, setCustomPassMarks] = useState(36);
  const [customIsCompulsory, setCustomIsCompulsory] = useState(true);

  // Load programs from database on mount
  useEffect(() => {
    fetchAllAcademicPrograms().then((data) => {
      if (data && data.length > 0) {
        setPrograms(data);
        if (!data.some((p) => p.id === selectedProgramId)) {
          setSelectedProgramId(data[0].id);
        }
      }
    });
  }, []);

  // Sync form state when currentProgram changes
  useEffect(() => {
    if (currentProgram) {
      setInstitutionName(currentProgram.institutionName || "Bangladesh National Institute of Education (BNIE)");
      setAffiliatedCollege(currentProgram.affiliatedCollege || "");
      setDegreeType(currentProgram.degreeType || "Bachelor of Arts (B.A.) Honours");
      setExaminationTitle(
        currentProgram.examinationTitle ||
        (currentProgram.degreeType === "Bachelor of Arts (B.A.) Honours"
          ? "BACHELOR OF ARTS (B.A.) HONOURS EXAMINATION"
          : "BACHELOR OF ARTS (B.A.) DEGREE PASS EXAMINATION")
      );
      setMajorSubject(currentProgram.majorSubject || "History");
      setAcademicSession(currentProgram.academicSession || "1990-1991");
      setExaminationYear(currentProgram.examinationYear || "1994");
      setDurationYears(currentProgram.durationYears || 3);
      setExaminationStructure(currentProgram.examinationStructure || "Annual (3-Year)");
      setSyllabusVersion(currentProgram.syllabusVersion || "1990-1994 Historical Regulation");
      setIsSyllabusVerified(!!currentProgram.isSyllabusVerified);
      setGradingMethod(currentProgram.gradingMethod || "Division/Class");
      setFirstMinPercent(currentProgram.divisionThresholds?.firstClassOrDivisionMinPercent || 60);
      setSecondMinPercent(currentProgram.divisionThresholds?.secondClassOrDivisionMinPercent || 45);
      setThirdMinPercent(currentProgram.divisionThresholds?.thirdDivisionMinPercent || 36);
      setPassMinPercent(currentProgram.divisionThresholds?.minimumPassMarksPerPaper || 36);
      setStarMinPercent(currentProgram.divisionThresholds?.starMarksMinPercent || 75);
      setResultPublicationDate(currentProgram.resultPublicationDate || "1994-11-28");
      setStatus(currentProgram.status || "Published");
      setSubjects(currentProgram.subjects || []);
    }
  }, [currentProgram, selectedProgramId]);

  // Handle Degree Type switch: Strictly separate titles
  const handleDegreeTypeChange = (newType: "Bachelor of Arts (B.A.) Honours" | "Bachelor of Arts (B.A.) Degree Pass" | "Other") => {
    setDegreeType(newType);
    if (newType === "Bachelor of Arts (B.A.) Honours") {
      setExaminationTitle("BACHELOR OF ARTS (B.A.) HONOURS EXAMINATION");
      setPassMinPercent(36);
      setThirdMinPercent(36);
      if (subjects.length === 0) {
        setSubjects(getHistorical3YearHonoursHistoryPreset());
      }
    } else if (newType === "Bachelor of Arts (B.A.) Degree Pass") {
      setExaminationTitle("BACHELOR OF ARTS (B.A.) DEGREE PASS EXAMINATION");
      setPassMinPercent(33);
      setThirdMinPercent(33);
      if (subjects.length === 0 || subjects.some(s => s.subjectCode?.startsWith("HIS-"))) {
        setSubjects(getDegreePassPreset());
      }
    }
  };

  // Quick Preset Loader
  const handleLoadPreset = (presetType: "1994-honours" | "2000-honours" | "degree-pass" | "all-30-catalogue") => {
    if (presetType === "1994-honours") {
      setDegreeType("Bachelor of Arts (B.A.) Honours");
      setExaminationTitle("BACHELOR OF ARTS (B.A.) HONOURS EXAMINATION");
      setMajorSubject("History");
      setExaminationYear("1994");
      setAcademicSession("1990-1991");
      setDurationYears(3);
      setExaminationStructure("Annual (3-Year)");
      setGradingMethod("Division/Class");
      setFirstMinPercent(60);
      setSecondMinPercent(45);
      setThirdMinPercent(36);
      setPassMinPercent(36);
      setSyllabusVersion("1990-1994 Historical Regulation (Pending Verification)");
      setIsSyllabusVerified(false);
      setSubjects(getHistorical3YearHonoursHistoryPreset());
    } else if (presetType === "2000-honours") {
      setDegreeType("Bachelor of Arts (B.A.) Honours");
      setExaminationTitle("BACHELOR OF ARTS (B.A.) HONOURS EXAMINATION");
      setMajorSubject("History");
      setExaminationYear("2000");
      setAcademicSession("1996-1997");
      setDurationYears(3);
      setExaminationStructure("Annual (3-Year)");
      setGradingMethod("Division/Class");
      setFirstMinPercent(60);
      setSecondMinPercent(45);
      setThirdMinPercent(36);
      setPassMinPercent(36);
      setSyllabusVersion("1996-2000 Historical Regulation (Pending Verification)");
      setIsSyllabusVerified(false);
      setSubjects(getHistorical3YearHonoursHistoryPreset());
    } else if (presetType === "degree-pass") {
      setDegreeType("Bachelor of Arts (B.A.) Degree Pass");
      setExaminationTitle("BACHELOR OF ARTS (B.A.) DEGREE PASS EXAMINATION");
      setMajorSubject("Arts & Humanities (Principal & Subsidiary Structure)");
      setExaminationYear("1998");
      setAcademicSession("1995-1998");
      setDurationYears(3);
      setExaminationStructure("Annual (3-Year)");
      setGradingMethod("Division/Class");
      setFirstMinPercent(60);
      setSecondMinPercent(45);
      setThirdMinPercent(33);
      setPassMinPercent(33);
      setSyllabusVersion("B.A. Degree Pass 3-Year Regulation");
      setIsSyllabusVerified(true);
      setSubjects(getDegreePassPreset());
    } else if (presetType === "all-30-catalogue") {
      // Import the full proposed 30-subject catalogue
      const full30: SubjectGrade[] = PROPOSED_BA_HISTORY_30_CATALOGUE.map((item, idx) => ({
        id: `prop-${item.paperCode.toLowerCase()}-${idx}`,
        serialNo: (idx + 1).toString().padStart(2, "0"),
        displayOrder: idx + 1,
        subjectCode: item.paperCode,
        subjectName: item.subjectTitle,
        year: item.suggestedYear === "Elective / Open" ? "Third Year" : item.suggestedYear,
        fullMarks: item.defaultFullMarks,
        passMarks: item.defaultPassMarks,
        marks: 65,
        gradePoint: 0,
        isCompulsory: item.isCompulsory,
        paperType: item.groupType === "History Major" ? "Major / Honours" : "Allied / Subsidiary"
      }));
      setSubjects(full30);
      setIsSyllabusVerified(false);
      setSyllabusVersion("Proposed 30-Subject Catalogue (Pending Verification)");
    }
  };

  // Add individual subject from master 30-subject catalogue
  const handleAddFromCatalogue = (entry: typeof PROPOSED_BA_HISTORY_30_CATALOGUE[0]) => {
    if (subjects.some(s => s.subjectCode === entry.paperCode)) {
      setSaveStatus({
        message: `Paper "${entry.paperCode}" is already in the programme catalogue.`,
        type: "error"
      });
      return;
    }
    const newSub: SubjectGrade = {
      id: `sub-${entry.paperCode.toLowerCase()}-${Date.now()}`,
      serialNo: (subjects.length + 1).toString().padStart(2, "0"),
      displayOrder: subjects.length + 1,
      subjectCode: entry.paperCode,
      subjectName: entry.subjectTitle,
      year: entry.suggestedYear === "Elective / Open" ? "Third Year" : entry.suggestedYear,
      fullMarks: entry.defaultFullMarks,
      passMarks: entry.defaultPassMarks,
      marks: 60,
      gradePoint: 0,
      isCompulsory: entry.isCompulsory,
      paperType: entry.groupType === "History Major" ? "Major / Honours" : "Allied / Subsidiary"
    };
    setSubjects([...subjects, newSub]);
    setSaveStatus({
      message: `Added "${entry.subjectTitle}" to programme catalogue.`,
      type: "success"
    });
  };

  // Add custom paper
  const handleAddCustomSubject = () => {
    if (!customSubjectTitle.trim()) {
      setSaveStatus({ message: "Please provide a paper title.", type: "error" });
      return;
    }
    const newSub: SubjectGrade = {
      id: `custom-${Date.now()}`,
      serialNo: (subjects.length + 1).toString().padStart(2, "0"),
      displayOrder: subjects.length + 1,
      subjectCode: customSubjectCode.trim() || `PAP-${subjects.length + 1}`,
      subjectName: customSubjectTitle.trim(),
      year: customSubjectYear,
      fullMarks: customFullMarks,
      passMarks: customPassMarks,
      marks: 60,
      gradePoint: 0,
      isCompulsory: customIsCompulsory,
      paperType: degreeType === "Bachelor of Arts (B.A.) Honours" ? "Major / Honours" : "Allied / Subsidiary"
    };
    setSubjects([...subjects, newSub]);
    setCustomSubjectTitle("");
    setCustomSubjectCode("");
    setSaveStatus({ message: `Added "${newSub.subjectName}".`, type: "success" });
  };

  // Remove paper
  const handleRemoveSubject = (idx: number) => {
    const updated = subjects.filter((_, i) => i !== idx).map((s, i) => ({
      ...s,
      displayOrder: i + 1,
      serialNo: (i + 1).toString().padStart(2, "0")
    }));
    setSubjects(updated);
  };

  // Move paper up/down
  const handleMoveSubject = (idx: number, direction: "up" | "down") => {
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === subjects.length - 1)) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    const updated = [...subjects];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSubjects(updated.map((s, i) => ({
      ...s,
      displayOrder: i + 1,
      serialNo: (i + 1).toString().padStart(2, "0")
    })));
  };

  // Save Programme
  const handleSaveProgram = async () => {
    setIsSaving(true);
    setSaveStatus({ message: "", type: null });

    try {
      const progConfig: AcademicProgramConfig = {
        id: currentProgram ? currentProgram.id : `prog-${Date.now()}`,
        institutionName: institutionName.trim() || "Bangladesh National Institute of Education (BNIE)",
        affiliatedCollege: affiliatedCollege.trim(),
        degreeType,
        examinationTitle: examinationTitle.trim() || (degreeType === "Bachelor of Arts (B.A.) Honours" ? "BACHELOR OF ARTS (B.A.) HONOURS EXAMINATION" : "BACHELOR OF ARTS (B.A.) DEGREE PASS EXAMINATION"),
        majorSubject: majorSubject.trim() || "History",
        academicSession: academicSession.trim() || "1990-1991",
        examinationYear: examinationYear.trim() || "1994",
        durationYears: Number(durationYears) || 3,
        examinationStructure,
        syllabusVersion: syllabusVersion.trim() || "1990-1994 Regulation",
        isSyllabusVerified,
        gradingMethod,
        divisionThresholds: {
          firstClassOrDivisionMinPercent: Number(firstMinPercent) || 60,
          secondClassOrDivisionMinPercent: Number(secondMinPercent) || 45,
          thirdDivisionMinPercent: Number(thirdMinPercent) || 36,
          minimumPassMarksPerPaper: Number(passMinPercent) || 36,
          vivaMinPassMarks: 40,
          starMarksMinPercent: Number(starMinPercent) || 75
        },
        subjects,
        resultPublicationDate: resultPublicationDate.trim(),
        status,
        createdAt: currentProgram?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await saveAcademicProgram(progConfig);
      
      // Update local array
      const refreshed = getLocalAcademicPrograms();
      setPrograms(refreshed);
      setSelectedProgramId(progConfig.id);

      setSaveStatus({
        message: "Academic programme configuration and syllabus saved to database successfully.",
        type: "success"
      });
    } catch (e: any) {
      console.error("Save error:", e);
      setSaveStatus({
        message: `Failed to save programme configuration: ${e.message || "Unknown database error"}`,
        type: "error"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Create New Program Profile
  const handleCreateNewProgram = () => {
    const newId = `prog-${Date.now()}`;
    const newProg: AcademicProgramConfig = {
      id: newId,
      institutionName: "Bangladesh National Institute of Education (BNIE)",
      affiliatedCollege: "",
      degreeType: "Bachelor of Arts (B.A.) Honours",
      examinationTitle: "BACHELOR OF ARTS (B.A.) HONOURS EXAMINATION",
      majorSubject: "History",
      academicSession: "1990-1991",
      examinationYear: "1994",
      durationYears: 3,
      examinationStructure: "Annual (3-Year)",
      syllabusVersion: "New Historical Regulation (Pending Verification)",
      isSyllabusVerified: false,
      gradingMethod: "Division/Class",
      divisionThresholds: {
        firstClassOrDivisionMinPercent: 60,
        secondClassOrDivisionMinPercent: 45,
        thirdDivisionMinPercent: 36,
        minimumPassMarksPerPaper: 36,
        vivaMinPassMarks: 40,
        starMarksMinPercent: 75
      },
      subjects: getHistorical3YearHonoursHistoryPreset(),
      resultPublicationDate: "1994-11-28",
      status: "Draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [newProg, ...programs];
    setPrograms(updated);
    setSelectedProgramId(newId);
    setSaveStatus({ message: "Created new programme draft. Configure details and click Save.", type: "success" });
  };

  return (
    <div className="space-y-8 mb-12">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-[#006a4e] to-[#004d38] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase text-emerald-200 border border-white/20">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Academic Programme &amp; Historical Records Management</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-sans tracking-tight">
            Historical Examination Syllabuses &amp; Degree Management
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Manage distinct <strong>Bachelor of Arts (B.A.) Honours</strong> and <strong>Bachelor of Arts (B.A.) Degree Pass</strong> examination rules, 1990–2000 historical Division/Class thresholds, the proposed 30-subject BA History catalogue, and authentic marksheet regulations.
          </p>
        </div>
      </div>

      {/* Program Selector Tabs & Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Configured Programmes &amp; Historical Syllabuses
            </h4>
            <p className="text-xs text-gray-500">
              Select a programme to view or modify its examination title, subjects, full marks, and grading rules.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCreateNewProgram}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#006a4e] hover:bg-[#005a42] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Programme Profile</span>
          </button>
        </div>

        {/* Tab pills */}
        <div className="flex flex-wrap gap-2">
          {programs.map((prog) => {
            const isSelected = prog.id === selectedProgramId;
            const isHonours = prog.degreeType === "Bachelor of Arts (B.A.) Honours";
            return (
              <button
                key={prog.id}
                type="button"
                onClick={() => setSelectedProgramId(prog.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2.5 cursor-pointer border ${
                  isSelected
                    ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200"
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${isHonours ? "bg-amber-400" : "bg-emerald-400"}`} />
                <div className="min-w-0">
                  <div className="truncate max-w-[220px]">
                    {prog.degreeType} ({prog.examinationYear || "N/A"})
                  </div>
                  <div className="text-[10px] opacity-75 truncate">
                    {prog.majorSubject} · {prog.examinationStructure}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Configuration Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Core Institutional & Regulation Metadata (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-6">
            
            {/* Header with Verification Warning */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h4 className="text-base font-bold text-gray-950 font-sans">
                  Academic Regulation &amp; Examination Settings
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  ID: <code className="text-gray-700 font-mono text-[11px]">{currentProgram?.id}</code>
                </p>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isSyllabusVerified
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-amber-100 text-amber-900 border border-amber-300"
                }`}>
                  {isSyllabusVerified ? "Verified Syllabus" : "Pending Verification"}
                </span>
              </div>
            </div>

            {/* Quick Presets Bar */}
            <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3.5 space-y-2">
              <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider block">
                Load Historical Standard Preset:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleLoadPreset("1994-honours")}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  1994 B.A. Honours in History (3-Year)
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPreset("2000-honours")}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  2000 B.A. Honours in History (3-Year)
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPreset("degree-pass")}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  B.A. Degree Pass (3-Year)
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadPreset("all-30-catalogue")}
                  className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Proposed 30-Subject Catalogue
                </button>
              </div>
            </div>

            {/* Mandatory Academic Distinction: Honours vs Degree Pass */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Degree Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Degree Examination Type *
                  </label>
                  <select
                    value={degreeType}
                    onChange={(e) => handleDegreeTypeChange(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#006a4e] focus:outline-hidden"
                  >
                    <option value="Bachelor of Arts (B.A.) Honours">
                      Bachelor of Arts (B.A.) Honours
                    </option>
                    <option value="Bachelor of Arts (B.A.) Degree Pass">
                      Bachelor of Arts (B.A.) Degree Pass
                    </option>
                    <option value="Other">Other Degree</option>
                  </select>
                  <p className="text-[10px] text-gray-500">
                    Rule 1: Never display "Honours / Degree Pass" together on an individual marksheet.
                  </p>
                </div>

                {/* Examination Title Header Display */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Marksheet Title *
                  </label>
                  <input
                    type="text"
                    value={examinationTitle}
                    onChange={(e) => setExaminationTitle(e.target.value)}
                    placeholder="e.g. BACHELOR OF ARTS (B.A.) HONOURS EXAMINATION"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-extrabold text-gray-900 font-mono tracking-tight focus:ring-2 focus:ring-[#006a4e] focus:outline-hidden"
                  />
                  <p className="text-[10px] text-gray-500">
                    Printed at the exact top header of every student marksheet.
                  </p>
                </div>
              </div>

              {/* Institution and Affiliated College */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Institution / University *
                  </label>
                  <input
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-[#006a4e] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Affiliated College
                  </label>
                  <input
                    type="text"
                    value={affiliatedCollege}
                    onChange={(e) => setAffiliatedCollege(e.target.value)}
                    placeholder="e.g. Dhaka College / Constituent College"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-[#006a4e] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Major Subject and Academic Session */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Major Subject *
                  </label>
                  <input
                    type="text"
                    value={majorSubject}
                    onChange={(e) => setMajorSubject(e.target.value)}
                    placeholder="e.g. History"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#006a4e] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Academic Session *
                  </label>
                  <input
                    type="text"
                    value={academicSession}
                    onChange={(e) => setAcademicSession(e.target.value)}
                    placeholder="e.g. 1990-1991"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-[#006a4e] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Examination Year *
                  </label>
                  <input
                    type="text"
                    value={examinationYear}
                    onChange={(e) => setExaminationYear(e.target.value)}
                    placeholder="e.g. 1994 or 2000"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#006a4e] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Programme Duration and Examination Structure */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Programme Duration *
                  </label>
                  <select
                    value={durationYears}
                    onChange={(e) => setDurationYears(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-[#006a4e] focus:outline-hidden"
                  >
                    <option value={3}>3 Years (Historical 1990-2000 Regulation)</option>
                    <option value={4}>4 Years (Modern Integrated Honours)</option>
                    <option value={2}>2 Years (Older Pass Degree Structure)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Examination Structure *
                  </label>
                  <select
                    value={examinationStructure}
                    onChange={(e) => setExaminationStructure(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-[#006a4e] focus:outline-hidden"
                  >
                    <option value="Annual (3-Year)">Annual (First Year, Second Year, Third Year)</option>
                    <option value="Annual (2-Year)">Annual (First Year, Second Year)</option>
                    <option value="Semester-based (4-Year / 8 Semesters)">Semester-based (8 Semesters)</option>
                    <option value="Part-based">Part-based (Part I, Part II, Part III)</option>
                  </select>
                </div>
              </div>

              {/* Syllabus Version and Verification Flag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Syllabus Version Note
                  </label>
                  <input
                    type="text"
                    value={syllabusVersion}
                    onChange={(e) => setSyllabusVersion(e.target.value)}
                    placeholder="e.g. 1990-1994 Historical Regulation"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-[#006a4e] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Official Authenticity Status
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={isSyllabusVerified}
                      onChange={(e) => setIsSyllabusVerified(e.target.checked)}
                      className="w-4 h-4 text-[#006a4e] rounded border-gray-300 focus:ring-[#006a4e]"
                    />
                    <span className="text-xs font-semibold text-gray-800">
                      Officially Verified against University Ordinances
                    </span>
                  </label>
                  {!isSyllabusVerified && (
                    <span className="text-[10px] text-amber-700 font-semibold block">
                      Stamped as "Pending Verification" on academic documentation.
                    </span>
                  )}
                </div>
              </div>

              {/* Grading Method & Thresholds (Clause 2 & 8) */}
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-blue-700" />
                    <span>Grading Method &amp; Historical Classification Thresholds</span>
                  </span>
                  <select
                    value={gradingMethod}
                    onChange={(e) => setGradingMethod(e.target.value as any)}
                    className="bg-white border border-blue-300 rounded-lg px-2.5 py-1 text-xs font-bold text-blue-950 focus:outline-hidden"
                  >
                    <option value="Division/Class">Division / Class (Historical Marks %)</option>
                    <option value="GPA/CGPA">GPA / CGPA (Modern 4.00 Scale)</option>
                    <option value="Marks Only">Marks Only (No Letter/Division)</option>
                  </select>
                </div>

                {gradingMethod === "Division/Class" && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[11px] font-bold text-blue-900 block">First Class / Div (≥ %)</span>
                      <input
                        type="number"
                        value={firstMinPercent}
                        onChange={(e) => setFirstMinPercent(Number(e.target.value))}
                        className="w-full bg-white border border-blue-200 rounded-lg px-2.5 py-1.5 font-bold text-gray-900 mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-blue-900 block">Second Class / Div (≥ %)</span>
                      <input
                        type="number"
                        value={secondMinPercent}
                        onChange={(e) => setSecondMinPercent(Number(e.target.value))}
                        className="w-full bg-white border border-blue-200 rounded-lg px-2.5 py-1.5 font-bold text-gray-900 mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-blue-900 block">Third Div / Pass (≥ %)</span>
                      <input
                        type="number"
                        value={thirdMinPercent}
                        onChange={(e) => setThirdMinPercent(Number(e.target.value))}
                        className="w-full bg-white border border-blue-200 rounded-lg px-2.5 py-1.5 font-bold text-gray-900 mt-1"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-blue-900 block">Paper Pass Mark</span>
                      <input
                        type="number"
                        value={passMinPercent}
                        onChange={(e) => setPassMinPercent(Number(e.target.value))}
                        className="w-full bg-white border border-blue-200 rounded-lg px-2.5 py-1.5 font-bold text-gray-900 mt-1"
                      />
                    </div>
                  </div>
                )}

                <p className="text-[10px] text-blue-900/80 leading-relaxed">
                  Notice (Rule 8): For historical records using Division/Class, GPA and CGPA boxes are completely hidden from the marksheet rather than displayed as empty boxes.
                </p>
              </div>

              {/* Publication Date and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Result Publication Date
                  </label>
                  <input
                    type="date"
                    value={resultPublicationDate}
                    onChange={(e) => setResultPublicationDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-[#006a4e] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                    Programme Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#006a4e] focus:outline-hidden"
                  >
                    <option value="Published">Published (Public Results &amp; Marksheets Active)</option>
                    <option value="Draft">Draft (Administrative Review)</option>
                    <option value="Pending Verification">Pending Verification (Unauthenticated Syllabus)</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              {saveStatus.message && (
                <div className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                  saveStatus.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}>
                  {saveStatus.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                  <span>{saveStatus.message}</span>
                </div>
              )}
              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  onClick={handleSaveProgram}
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#006a4e] hover:bg-[#005a42] text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Saving to Database..." : "Save Programme to Database"}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Assigned Subjects Catalogue & 30-Subject Master Browser (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-gray-950 uppercase tracking-wide">
                  Assigned Syllabus Papers ({subjects.length})
                </h4>
                <p className="text-[11px] text-gray-500">
                  Total Full Marks: <span className="font-bold text-gray-900">{subjects.reduce((sum, s) => sum + (s.fullMarks || 100), 0)}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSubjectCatalogueModal(true)}
                className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Browse 30 Catalogue</span>
              </button>
            </div>

            {/* List of currently assigned papers */}
            <div className="max-h-[520px] overflow-y-auto space-y-2 pr-1">
              {subjects.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  No examination papers assigned yet. Click "Browse 30 Catalogue" or load a historical preset.
                </div>
              ) : (
                subjects.map((sub, idx) => (
                  <div
                    key={sub.id || idx}
                    className="p-3 bg-gray-50 hover:bg-gray-100/80 rounded-xl border border-gray-200 text-xs space-y-1.5 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-gray-200 rounded text-gray-800">
                          {sub.subjectCode || `PAP-${idx + 1}`}
                        </span>
                        <h5 className="font-bold text-gray-900 mt-0.5 leading-snug">
                          {sub.subjectName}
                        </h5>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveSubject(idx, "up")}
                          disabled={idx === 0}
                          className="p-1 hover:bg-gray-200 rounded text-gray-600 disabled:opacity-30 cursor-pointer"
                          title="Move Up"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveSubject(idx, "down")}
                          disabled={idx === subjects.length - 1}
                          className="p-1 hover:bg-gray-200 rounded text-gray-600 disabled:opacity-30 cursor-pointer"
                          title="Move Down"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubject(idx)}
                          className="p-1 hover:bg-red-100 rounded text-red-600 cursor-pointer"
                          title="Remove Paper"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-600 border-t border-gray-200/60 pt-1.5">
                      <span className="font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {sub.year || "Annual"}
                      </span>
                      <span>Full Marks: <strong className="text-gray-900">{sub.fullMarks || 100}</strong></span>
                      <span>Pass: <strong className="text-gray-900">{sub.passMarks || 36}</strong></span>
                      <span className={`px-1 rounded text-[10px] font-bold ${
                        sub.isCompulsory ? "text-amber-800 bg-amber-50" : "text-gray-500"
                      }`}>
                        {sub.isCompulsory ? "Compulsory" : "Elective"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Add Custom Paper Input */}
            <div className="pt-3 border-t border-gray-200 space-y-2">
              <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                Add Custom Paper:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Code (e.g. HIS-309)"
                  value={customSubjectCode}
                  onChange={(e) => setCustomSubjectCode(e.target.value)}
                  className="col-span-1 bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                />
                <input
                  type="text"
                  placeholder="Subject / Paper Title"
                  value={customSubjectTitle}
                  onChange={(e) => setCustomSubjectTitle(e.target.value)}
                  className="col-span-2 bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <select
                  value={customSubjectYear}
                  onChange={(e) => setCustomSubjectYear(e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-xs text-gray-800 font-medium"
                >
                  <option value="First Year">First Year</option>
                  <option value="Second Year">Second Year</option>
                  <option value="Third Year">Third Year</option>
                  <option value="Fourth Year">Fourth Year</option>
                </select>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-gray-500">Full:</span>
                  <input
                    type="number"
                    value={customFullMarks}
                    onChange={(e) => setCustomFullMarks(Number(e.target.value))}
                    className="w-14 bg-gray-50 border border-gray-300 rounded-lg px-1.5 py-1 text-xs font-bold text-center"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomSubject}
                  className="px-3 py-1 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Add Paper
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Modal: Complete 30-Subject BA History Catalogue Browser (Clause 4) */}
      <AnimatePresence>
        {showSubjectCatalogueModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-gray-200"
            >
              {/* Modal Header */}
              <div className="p-6 bg-[#006a4e] text-white flex items-center justify-between shrink-0">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider text-amber-200 mb-1">
                    Proposed 30-Subject Catalogue
                  </div>
                  <h3 className="text-xl font-bold font-sans">
                    Bachelor of Arts (B.A.) in History Master Subject Catalogue
                  </h3>
                  <p className="text-xs text-emerald-100 mt-1">
                    Critical historical requirement: This 30-subject catalogue is proposed for configuration. Click "Add to Programme" to assign specific papers to this syllabus.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSubjectCatalogueModal(false)}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Catalogue Table Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Academic Authenticity Notice:</strong> Do not automatically assign all 30 entries to every student. Historical 3-Year Honours programmes typically comprised 14 to 18 papers (1400–1800 marks) spanning Year 1, Year 2, and Year 3.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-3.5 py-2.5">#</th>
                        <th className="px-3 py-2.5">Code</th>
                        <th className="px-3.5 py-2.5">Subject / Paper Title</th>
                        <th className="px-3 py-2.5">Group</th>
                        <th className="px-3 py-2.5">Suggested Year</th>
                        <th className="px-3 py-2.5">Full</th>
                        <th className="px-3.5 py-2.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {PROPOSED_BA_HISTORY_30_CATALOGUE.map((entry) => {
                        const isAdded = subjects.some((s) => s.subjectCode === entry.paperCode);
                        return (
                          <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-3.5 py-2 font-mono text-[11px] text-gray-500 font-bold">
                              {entry.serialNo.toString().padStart(2, "0")}
                            </td>
                            <td className="px-3 py-2 font-mono font-bold text-gray-900">
                              {entry.paperCode}
                            </td>
                            <td className="px-3.5 py-2">
                              <span className="font-bold text-gray-900 block">{entry.subjectTitle}</span>
                              {entry.historicalNotes && (
                                <span className="text-[10px] text-gray-500 block">{entry.historicalNotes}</span>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                entry.groupType === "History Major"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}>
                                {entry.groupType}
                              </span>
                            </td>
                            <td className="px-3 py-2 font-medium text-gray-700">
                              {entry.suggestedYear}
                            </td>
                            <td className="px-3 py-2 font-mono font-bold text-gray-900">
                              {entry.defaultFullMarks}
                            </td>
                            <td className="px-3.5 py-2 text-right">
                              {isAdded ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Added
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleAddFromCatalogue(entry)}
                                  className="px-2.5 py-1 bg-[#006a4e] hover:bg-[#005a42] text-white rounded text-xs font-bold transition-colors cursor-pointer"
                                >
                                  + Add
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setShowSubjectCatalogueModal(false)}
                  className="px-5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Done Selecting
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
