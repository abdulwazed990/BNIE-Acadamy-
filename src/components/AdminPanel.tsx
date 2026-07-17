import { useState, FormEvent, ChangeEvent } from "react";
import { Category, Group, Religion, Student, SubjectGrade, calculateFinalGpa, getGradePointFromMarks, generateSecureToken } from "../types";
import { getFixedSubjectList, generateEmptySubjectGrades, getSubjectCode, getSubjectImage } from "../data/subjectLoader";
import { PASSPORT_AVATARS } from "../data/defaultStudents";
import Logo from "./Logo";
import { 
  Plus, Edit2, Trash2, Eye, ShieldCheck, LogOut, Search, User, Key, 
  Calendar, FileText, School, Clock, Upload, ArrowRight, Save, X, Image as ImageIcon
} from "lucide-react";
import { motion } from "motion/react";

interface AdminPanelProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onViewStudent: (student: Student) => void;
}

export default function AdminPanel({ 
  students, 
  onAddStudent, 
  onUpdateStudent, 
  onDeleteStudent,
  onViewStudent 
}: AdminPanelProps) {
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Dashboard Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "ALL">("ALL");

  // Add / Edit Form Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  // Form Fields
  const [formCategory, setFormCategory] = useState<Category>(Category.SSC);
  const [formGroup, setFormGroup] = useState<Group>(Group.SCIENCE);
  const [formReligion, setFormReligion] = useState<Religion>(Religion.ISLAM);
  const [formName, setFormName] = useState("");
  const [formFatherName, setFormFatherName] = useState("");
  const [formMotherName, setFormMotherName] = useState("");
  const [formDob, setFormDob] = useState("");
  const [formRoll, setFormRoll] = useState("");
  const [formReg, setFormReg] = useState("");
  const [formInstitute, setFormInstitute] = useState("");
  const [formSession, setFormSession] = useState("");
  const [formPassingYear, setFormPassingYear] = useState("");
  const [formCertificateSerial, setFormCertificateSerial] = useState("");
  const [formIssueDate, setFormIssueDate] = useState("");
  const [formPhoto, setFormPhoto] = useState(PASSPORT_AVATARS.male1);
  const [formSubjects, setFormSubjects] = useState<SubjectGrade[]>([]);

  // Quick Results Distribution Board States
  const [quickGpaInput, setQuickGpaInput] = useState("");
  const [quickMarksInput, setQuickMarksInput] = useState("");

  // Simple hardcoded admin credentials
  const ADMIN_CREDENTIALS = {
    username: "Sa7@kL3!",
    password: "Sa7@kL3!"
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (username.trim() === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid Username or Password.");
    }
  };

  // When changing category, group, or religion in the form, regenerate subject inputs
  const handleFormCategoryGroupReligionChange = (
    newCategory: Category,
    newGroup: Group,
    newReligion: Religion,
    currentSubjects: SubjectGrade[] = []
  ) => {
    // Determine the new required subject titles
    const requiredSubjectNames = getFixedSubjectList(newCategory, newGroup, newReligion);
    
    // Attempt to map existing grade points/marks to the new list to preserve what was entered
    const updatedSubjects: SubjectGrade[] = requiredSubjectNames.map((name) => {
      const match = currentSubjects.find((s) => s.subjectName === name);
      return {
        subjectName: name,
        subjectCode: getSubjectCode(name),
        marks: match && match.marks !== undefined ? match.marks : 85,
        gradePoint: match ? match.gradePoint : 5.0 // default to 5.0 (A+) if new subject
      };
    });

    setFormSubjects(updatedSubjects);
  };

  // Triggered when clicking "Add Student"
  const openAddModal = () => {
    setEditingStudentId(null);
    setFormCategory(Category.SSC);
    setFormGroup(Group.SCIENCE);
    setFormReligion(Religion.ISLAM);
    setFormName("");
    setFormFatherName("");
    setFormMotherName("");
    setFormDob("");
    setFormRoll("");
    setFormReg("");
    setFormInstitute("Bangladesh National Institute of Education");
    setFormSession("2022-2023");
    setFormPassingYear("2024");
    setFormCertificateSerial(`BNIE-SSC-2024-${Math.floor(Math.random() * 89999 + 10000)}`);
    setFormIssueDate("2024-06-20");
    setFormPhoto(PASSPORT_AVATARS.male1);
    setQuickGpaInput("");
    setQuickMarksInput("");
    
    const initialSubjects = generateEmptySubjectGrades(Category.SSC, Group.SCIENCE, Religion.ISLAM);
    setFormSubjects(initialSubjects);
    setIsFormOpen(true);
  };

  // Triggered when clicking "Edit"
  const openEditModal = (student: Student) => {
    setEditingStudentId(student.id);
    setFormCategory(student.category);
    setFormGroup(student.group);
    setFormReligion(student.religion);
    setFormName(student.name);
    setFormFatherName(student.fatherName);
    setFormMotherName(student.motherName);
    setFormDob(student.dob);
    setFormRoll(student.rollNumber);
    setFormReg(student.registrationNumber);
    setFormInstitute(student.instituteName);
    setFormSession(student.session);
    setFormPassingYear(student.passingYear);
    setFormCertificateSerial(student.certificateSerialNumber);
    setFormIssueDate(student.issueDate);
    setFormPhoto(student.photoUrl);
    setQuickGpaInput("");
    setQuickMarksInput("");
    
    // Ensure existing subjects have proper subjectCode and marks
    const mappedSubjects = student.subjects.map((sub) => ({
      subjectName: sub.subjectName,
      subjectCode: sub.subjectCode || getSubjectCode(sub.subjectName),
      marks: sub.marks !== undefined ? sub.marks : (sub.gradePoint >= 5.0 ? 85 : sub.gradePoint >= 4.0 ? 74 : sub.gradePoint >= 3.5 ? 64 : sub.gradePoint >= 3.0 ? 54 : sub.gradePoint >= 2.0 ? 44 : sub.gradePoint >= 1.0 ? 35 : 25),
      gradePoint: sub.gradePoint
    }));
    
    setFormSubjects(mappedSubjects);
    setIsFormOpen(true);
  };

  // Base64 Photo Uploader
  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save the student (Create or Update)
  const handleSaveStudent = (e: FormEvent) => {
    e.preventDefault();

    // Validate GPA entries
    for (const sub of formSubjects) {
      if (isNaN(sub.gradePoint) || sub.gradePoint < 0 || sub.gradePoint > 5.0) {
        alert(`Please enter a valid GPA for "${sub.subjectName}" (0.00 to 5.00).`);
        return;
      }
    }

    // Auto calculate CGPA and total marks
    const finalGpa = calculateFinalGpa(formSubjects);
    const totalMarks = formSubjects.reduce((sum, sub) => sum + (sub.marks || 0), 0);

    // Retrieve or generate a secure verification token for this student
    let secureToken = "";
    if (editingStudentId) {
      const originalStudent = students.find((s) => s.id === editingStudentId);
      secureToken = originalStudent?.secureToken || generateSecureToken();
    } else {
      secureToken = generateSecureToken();
    }

    const studentData: Student = {
      id: editingStudentId || `student_${Date.now()}`,
      category: formCategory,
      group: formGroup,
      religion: formReligion,
      name: formName.trim(),
      fatherName: formFatherName.trim(),
      motherName: formMotherName.trim(),
      dob: formDob,
      rollNumber: formRoll.trim(),
      registrationNumber: formReg.trim(),
      instituteName: formInstitute.trim(),
      session: formSession.trim(),
      passingYear: formPassingYear.trim(),
      certificateSerialNumber: formCertificateSerial.trim(),
      issueDate: formIssueDate,
      photoUrl: formPhoto,
      secureToken: secureToken,
      subjects: formSubjects,
      finalGpa: finalGpa,
      totalMarks: totalMarks
    };

    if (editingStudentId) {
      onUpdateStudent(studentData);
    } else {
      // Check if roll and reg already exist in the selected category to prevent duplicates
      const exists = students.some(
        (s) => 
          s.rollNumber === studentData.rollNumber && 
          s.registrationNumber === studentData.registrationNumber && 
          s.category === studentData.category
      );
      if (exists) {
        alert("A student with this Roll, Registration, and Category already exists!");
        return;
      }
      onAddStudent(studentData);
    }

    setIsFormOpen(false);
  };

  // Update a single subject's grade point and automatically update marks
  const handleSubjectGradeChange = (index: number, val: string) => {
    let parsed = parseFloat(val);
    if (val === "" || isNaN(parsed)) parsed = 0;
    if (parsed < 0) parsed = 0;
    if (parsed > 5.0) parsed = 5.0;
    
    const updated = [...formSubjects];
    let marks = updated[index].marks || 85;
    if (parsed >= 5.0) marks = 85;
    else if (parsed >= 4.0) marks = 74;
    else if (parsed >= 3.5) marks = 64;
    else if (parsed >= 3.0) marks = 54;
    else if (parsed >= 2.0) marks = 44;
    else if (parsed >= 1.0) marks = 35;
    else marks = 25;

    updated[index] = {
      ...updated[index],
      gradePoint: Math.round(parsed * 100) / 100,
      marks
    };
    setFormSubjects(updated);
  };

  // Update a single subject's marks in form state and automatically calculate GP
  const handleSubjectMarksChange = (index: number, val: string) => {
    let parsed = parseInt(val);
    if (isNaN(parsed) || val === "") parsed = 0;
    if (parsed < 0) parsed = 0;
    if (parsed > 100) parsed = 100;
    
    const updated = [...formSubjects];
    const gp = getGradePointFromMarks(parsed);
    updated[index] = {
      ...updated[index],
      marks: parsed,
      gradePoint: gp
    };
    setFormSubjects(updated);
  };

  // Automatic distribution of entered GPA/CGPA across all subjects
  const handleDistributeByGpa = () => {
    const totalGpa = parseFloat(quickGpaInput);
    if (isNaN(totalGpa) || totalGpa < 0 || totalGpa > 5.00) {
      alert("Please enter a valid Total GPA (0.00 to 5.00) to distribute.");
      return;
    }
    
    const numSubjects = formSubjects.length;
    if (numSubjects === 0) return;
    
    const totalPoints = totalGpa * numSubjects;
    let distributedPoints = Array(numSubjects).fill(totalGpa);
    
    // Add small realistic variation if totalGpa is not extremely high or low
    if (totalGpa > 1.0 && totalGpa < 5.0) {
      for (let i = 0; i < numSubjects; i++) {
        const offset = (i % 2 === 0 ? 1 : -1) * (0.5 + (i % 3) * 0.25);
        distributedPoints[i] = Math.max(1.0, Math.min(5.0, distributedPoints[i] + offset));
      }
    }
    
    // Adjust to make sure the sum is exactly totalPoints
    let currentSum = distributedPoints.reduce((a, b) => a + b, 0);
    let diff = totalPoints - currentSum;
    
    let iter = 0;
    while (Math.abs(diff) > 0.001 && iter < 100) {
      const step = diff / numSubjects;
      for (let i = 0; i < numSubjects; i++) {
        distributedPoints[i] = Math.max(0.0, Math.min(5.0, distributedPoints[i] + step));
      }
      currentSum = distributedPoints.reduce((a, b) => a + b, 0);
      diff = totalPoints - currentSum;
      iter++;
    }
    
    // Guarantee exact mathematical sum
    currentSum = distributedPoints.reduce((a, b) => a + b, 0);
    let finalDiff = totalPoints - currentSum;
    if (Math.abs(finalDiff) > 0.0001) {
      for (let i = 0; i < numSubjects; i++) {
        const potential = distributedPoints[i] + finalDiff;
        if (potential >= 0 && potential <= 5.0) {
          distributedPoints[i] = potential;
          break;
        }
      }
    }
    
    // Update form subjects
    const updated = formSubjects.map((sub, i) => {
      const gp = Math.round(distributedPoints[i] * 100) / 100;
      let marks = 85;
      if (gp >= 5.0) marks = 85;
      else if (gp >= 4.0) marks = 74;
      else if (gp >= 3.5) marks = 64;
      else if (gp >= 3.0) marks = 54;
      else if (gp >= 2.0) marks = 44;
      else if (gp >= 1.0) marks = 36;
      else marks = 25;
      
      return {
        ...sub,
        gradePoint: gp,
        marks
      };
    });
    
    setFormSubjects(updated);
  };

  // Automatic distribution of entered Total Marks across all subjects
  const handleDistributeByMarks = () => {
    const totalMarks = parseInt(quickMarksInput);
    const numSubjects = formSubjects.length;
    const maxPossibleMarks = numSubjects * 100;
    if (isNaN(totalMarks) || totalMarks < 0 || totalMarks > maxPossibleMarks) {
      alert(`Please enter a valid Total Marks (0 to ${maxPossibleMarks}) to distribute.`);
      return;
    }
    
    // Distribute marks so that sum of all marks is exactly totalMarks, and each mark is in [0, 100]
    let distributedMarks = Array(numSubjects).fill(Math.floor(totalMarks / numSubjects));
    let remainder = totalMarks % numSubjects;
    for (let i = 0; i < remainder; i++) {
      distributedMarks[i] += 1;
    }
    
    // Introduce some realistic variation (e.g., some subjects higher, some lower)
    if (totalMarks > numSubjects * 33 && totalMarks < numSubjects * 95) {
      for (let i = 0; i < numSubjects; i += 2) {
        if (i + 1 < numSubjects) {
          const spread = Math.min(12, Math.floor(Math.random() * 8) + 3);
          if (distributedMarks[i] + spread <= 100 && distributedMarks[i + 1] - spread >= 0) {
            distributedMarks[i] += spread;
            distributedMarks[i + 1] -= spread;
          }
        }
      }
    }
    
    // Update form subjects with calculated gradePoints based on marks
    const updated = formSubjects.map((sub, i) => {
      const mark = distributedMarks[i];
      const gp = getGradePointFromMarks(mark);
      return {
        ...sub,
        marks: mark,
        gradePoint: gp
      };
    });
    
    setFormSubjects(updated);
  };

  // Filters students based on search and category tab
  const filteredStudents = students.filter((s) => {
    const matchCategory = activeCategory === "ALL" || s.category === activeCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = 
      s.name.toLowerCase().includes(searchLower) ||
      s.rollNumber.includes(searchLower) ||
      s.registrationNumber.includes(searchLower) ||
      s.instituteName.toLowerCase().includes(searchLower);
    return matchCategory && matchSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 no-print">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#006a4e] text-white p-6 text-center space-y-2">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2 p-1 shadow-md">
              <Logo size={56} />
            </div>
            <h3 className="font-bold text-lg font-sans">Secure Administrative Login</h3>
            <p className="text-xs text-emerald-100">Bangladesh National Institute of Education CMS</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 space-y-4">

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-hidden focus:border-[#006a4e] text-gray-900"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-hidden focus:border-[#006a4e] text-gray-900"
                />
              </div>
            </div>

            {loginError && (
              <p className="text-xs text-red-600 font-semibold bg-red-50 p-2.5 rounded-lg border border-red-100">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#006a4e] hover:bg-[#00563f] text-white font-bold py-3 px-4 rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-2 text-sm uppercase tracking-wider"
            >
              <span>Authenticate Access</span>
              <ArrowRight className="w-4 h-4 text-emerald-200" />
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 no-print">
      
      {/* Top Admin Dashboard Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center space-x-3.5">
          <Logo size={56} className="shrink-0" />
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-950 font-sans tracking-tight">
              Administrative Control Panel
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Registered Core Candidates: <span className="font-bold text-[#006a4e]">{students.length}</span> records online.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={openAddModal}
            className="inline-flex items-center space-x-2 bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer border border-[#00563f]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Student</span>
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="inline-flex items-center space-x-1.5 border border-gray-200 bg-white text-gray-600 hover:text-red-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock Panel</span>
          </button>
        </div>
      </div>

      {/* Database Filtering & Search Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-6 shadow-xs space-y-4 mb-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { value: "ALL", label: "All Records" },
              { value: Category.SSC, label: "SSC Students" },
              { value: Category.HSC, label: "HSC Students" },
              { value: Category.DIPLOMA, label: "Diploma Students" }
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveCategory(tab.value as Category | "ALL")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === tab.value
                    ? "bg-[#006a4e]/10 text-[#006a4e] border border-[#006a4e]/20"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, roll, reg..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs text-gray-950 focus:bg-white focus:outline-hidden focus:border-[#006a4e]"
            />
          </div>
        </div>
      </div>

      {/* Students Card Grid */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500 space-y-2">
          <p className="font-bold text-gray-700">No Student Records Found</p>
          <p className="text-xs text-gray-400">Try modifying your category filters or search inputs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((stud) => (
            <motion.div
              key={stud.id}
              layout
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-gray-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={stud.photoUrl}
                      alt={stud.name}
                      className="w-12 h-14 bg-gray-100 rounded-md border border-gray-200 object-cover shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-gray-950 text-sm font-sans line-clamp-1">{stud.name}</h4>
                      <span className="inline-block text-[9px] font-bold bg-[#006a4e]/10 text-[#006a4e] px-1.5 py-0.5 rounded-md mt-0.5">
                        {stud.category} — {stud.group}
                      </span>
                    </div>
                  </div>
                  
                  {/* GPA Badge */}
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block uppercase font-semibold">GPA</span>
                    <span className="text-sm font-black font-mono text-[#006a4e]">
                      {stud.finalGpa.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-gray-100 my-3" />

                <div className="space-y-1.5 text-xs text-gray-550">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Roll:</span>
                    <span className="font-bold text-gray-800 font-mono">{stud.rollNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reg No:</span>
                    <span className="font-bold text-gray-800 font-mono">{stud.registrationNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Passing Year:</span>
                    <span className="font-bold text-gray-800 font-mono">{stud.passingYear}</span>
                  </div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-gray-400 shrink-0">Institute:</span>
                    <span className="font-medium text-gray-750 text-right leading-tight line-clamp-1">{stud.instituteName}</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 my-3" />

              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={() => onViewStudent(stud)}
                  title="View Report"
                  className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors cursor-pointer"
                >
                  <Eye className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => openEditModal(stud)}
                  title="Edit Student"
                  className="p-1.5 bg-gray-50 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${stud.name}'s record?`)) {
                      onDeleteStudent(stud.id);
                    }
                  }}
                  title="Delete Record"
                  className="p-1.5 bg-gray-50 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit Form Modal Dialog */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#006a4e] to-emerald-800 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <FileText className="w-5 h-5 text-emerald-200" />
                </div>
                <div>
                  <h3 className="font-bold text-base md:text-lg font-sans">
                    {editingStudentId ? "Modify Student Credential Record" : "Add New Student Registry"}
                  </h3>
                  <p className="text-[11px] text-emerald-100">Ensure values correspond with printed verification registers</p>
                </div>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scrollable Content */}
            <form onSubmit={handleSaveStudent} className="p-6 md:p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: Basic Information */}
              <div className="md:col-span-6 space-y-4">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">
                  1. Candidate General Demographics
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => {
                        const newCat = e.target.value as Category;
                        setFormCategory(newCat);
                        
                        // Default groups for categories
                        let newGroup = formGroup;
                        if (newCat === Category.DIPLOMA) {
                          newGroup = Group.ENGINEERING;
                          setFormGroup(Group.ENGINEERING);
                        } else if (formGroup === Group.ENGINEERING) {
                          newGroup = Group.SCIENCE;
                          setFormGroup(Group.SCIENCE);
                        }
                        
                        handleFormCategoryGroupReligionChange(newCat, newGroup, formReligion, formSubjects);
                      }}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:border-[#006a4e] text-gray-900 font-medium"
                    >
                      <option value={Category.SSC}>SSC Program</option>
                      <option value={Category.HSC}>HSC Program</option>
                      <option value={Category.DIPLOMA}>Diploma in Engineering</option>
                    </select>
                  </div>

                  {/* Group / Stream */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">Group / Stream</label>
                    {formCategory === Category.DIPLOMA ? (
                      <select
                        value={formGroup}
                        onChange={(e) => {
                          const newGroup = e.target.value as Group;
                          setFormGroup(newGroup);
                          handleFormCategoryGroupReligionChange(formCategory, newGroup, formReligion, formSubjects);
                        }}
                        className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:border-[#006a4e] text-gray-900 font-medium"
                      >
                        <option value={Group.ENGINEERING}>Engineering Streams</option>
                        <option value={Group.COMPUTER_TECHNOLOGY}>Computer Technology</option>
                      </select>
                    ) : (
                      <select
                        value={formGroup}
                        onChange={(e) => {
                          const newGroup = e.target.value as Group;
                          setFormGroup(newGroup);
                          handleFormCategoryGroupReligionChange(formCategory, newGroup, formReligion, formSubjects);
                        }}
                        className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:border-[#006a4e] text-gray-900 font-medium"
                      >
                        <option value={Group.SCIENCE}>Science Group</option>
                        <option value={Group.HUMANITIES}>Humanities Group</option>
                        <option value={Group.BUSINESS_STUDIES}>Business Studies Group</option>
                      </select>
                    )}
                  </div>

                  {/* Religion (Part 4 Request) */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
                      Religion Selection <span className="text-xs text-[#006a4e] font-bold">*</span>
                    </label>
                    <select
                      value={formReligion}
                      onChange={(e) => {
                        const newRel = e.target.value as Religion;
                        setFormReligion(newRel);
                        handleFormCategoryGroupReligionChange(formCategory, formGroup, newRel, formSubjects);
                      }}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:border-[#006a4e] text-gray-900 font-medium"
                    >
                      <option value={Religion.ISLAM}>Islam</option>
                      <option value={Religion.HINDUISM}>Hinduism</option>
                      <option value={Religion.BUDDHISM}>Buddhism</option>
                      <option value={Religion.CHRISTIANITY}>Christianity</option>
                    </select>
                  </div>

                  {/* DOB Calendar Picker */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">Date of Birth</label>
                    <input
                      type="date"
                      required
                      value={formDob}
                      onChange={(e) => setFormDob(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:border-[#006a4e] text-gray-900 font-medium"
                    />
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Candidate Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Candidate full name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs focus:border-[#006a4e] text-gray-900 font-medium"
                  />
                </div>

                {/* Parents Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">Father's Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Father's full name"
                      value={formFatherName}
                      onChange={(e) => setFormFatherName(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:border-[#006a4e] text-gray-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">Mother's Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Mother's full name"
                      value={formMotherName}
                      onChange={(e) => setFormMotherName(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:border-[#006a4e] text-gray-900 font-medium"
                    />
                  </div>
                </div>

                {/* Roll & Reg numbers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">Roll Number</label>
                    <input
                      type="text"
                      required
                      placeholder="6-digit Roll"
                      value={formRoll}
                      onChange={(e) => setFormRoll(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:border-[#006a4e] text-gray-900 font-medium font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">Registration Number</label>
                    <input
                      type="text"
                      required
                      placeholder="10-digit Reg No"
                      value={formReg}
                      onChange={(e) => setFormReg(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:border-[#006a4e] text-gray-900 font-medium font-mono"
                    />
                  </div>
                </div>

                {/* Institute & Session */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">Institute Name</label>
                    <input
                      type="text"
                      required
                      placeholder="School or College Name"
                      value={formInstitute}
                      onChange={(e) => setFormInstitute(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:border-[#006a4e] text-gray-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">Session</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2022-2023"
                      value={formSession}
                      onChange={(e) => setFormSession(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:border-[#006a4e] text-gray-900 font-medium font-mono"
                    />
                  </div>
                </div>

                {/* Passing Year & Certificate Serial */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">Passing Year</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2024"
                      value={formPassingYear}
                      onChange={(e) => setFormPassingYear(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:border-[#006a4e] text-gray-900 font-medium font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">Certificate Serial</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BNIE-SSC-2024-55102"
                      value={formCertificateSerial}
                      onChange={(e) => setFormCertificateSerial(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:border-[#006a4e] text-gray-900 font-medium font-mono"
                    />
                  </div>
                </div>

                {/* Issue Date */}
                <div>
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block mb-1">Issue Date</label>
                  <input
                    type="date"
                    required
                    value={formIssueDate}
                    onChange={(e) => setFormIssueDate(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:border-[#006a4e] text-gray-900 font-medium"
                  />
                </div>

                {/* Image Base64 Uploader */}
                <div className="space-y-2 border border-gray-250 p-4 rounded-xl">
                  <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">Passport Photo ID</span>
                  
                  <div className="flex items-center space-x-4">
                    <img
                      src={formPhoto}
                      alt="Form Preview"
                      className="w-14 h-16 object-cover bg-gray-100 border border-gray-200 rounded-md"
                    />
                    
                    <div className="space-y-1.5 flex-1">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full"
                        />
                        <button
                          type="button"
                          className="inline-flex items-center space-x-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Photo File</span>
                        </button>
                      </div>

                      {/* Avatar presets for easy developer experience */}
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => setFormPhoto(PASSPORT_AVATARS.male1)}
                          className="text-[10px] bg-sky-50 text-sky-700 hover:bg-sky-100 px-2 py-0.5 rounded-md border border-sky-100 font-medium"
                        >
                          Preset Boy
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormPhoto(PASSPORT_AVATARS.female1)}
                          className="text-[10px] bg-pink-50 text-pink-700 hover:bg-pink-100 px-2 py-0.5 rounded-md border border-pink-100 font-medium"
                        >
                          Preset Girl
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormPhoto(PASSPORT_AVATARS.male2)}
                          className="text-[10px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-100 font-medium"
                        >
                          Preset Boy 2
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Subject GPA & Marks inputs */}
              <div className="md:col-span-6 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    2. Subject Grade Point & Marks Registry
                  </h4>
                  <span className="text-[10px] text-gray-400 font-semibold font-mono">
                    Religion: <span className="text-[#006a4e]">{formReligion}</span>
                  </span>
                </div>

                {/* Quick Result Distribution Board */}
                <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                      Quick Result Distribution Board
                    </span>
                    <span className="text-[9px] bg-[#006a4e]/10 text-[#006a4e] px-1.5 py-0.5 rounded-full font-bold">
                      Auto-Populating Engine
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight">
                    Enter either a Total GPA or Total Marks to automatically distribute grade points and marks across all subjects mathematically.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {/* Distribute by GPA */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-600 block">Total GPA (0.00 - 5.00)</label>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          step="0.01"
                          min="0.00"
                          max="5.00"
                          placeholder="e.g. 4.59"
                          value={quickGpaInput}
                          onChange={(e) => setQuickGpaInput(e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs font-mono font-bold text-gray-850"
                        />
                        <button
                          type="button"
                          onClick={handleDistributeByGpa}
                          className="bg-[#006a4e] hover:bg-[#00563f] text-white px-2 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                    </div>

                    {/* Distribute by Marks */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-600 block">Total Marks (Max {formSubjects.length * 100})</label>
                      <div className="flex gap-1">
                        <input
                          type="number"
                          placeholder={`e.g. ${Math.round(formSubjects.length * 80)}`}
                          value={quickMarksInput}
                          onChange={(e) => setQuickMarksInput(e.target.value)}
                          className="w-full bg-white border border-gray-305 rounded-lg px-2 py-1 text-xs font-mono font-bold text-gray-850"
                        />
                        <button
                          type="button"
                          onClick={handleDistributeByMarks}
                          className="bg-[#006a4e] hover:bg-[#00563f] text-white px-2 py-1 rounded-lg text-[10px] font-bold shrink-0 transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* GPA & Marks inputs scroll list */}
                <div className="space-y-2 max-h-[42vh] overflow-y-auto pr-2">
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider px-3 pb-1 border-b border-gray-100">
                    <div className="col-span-6">Subject (Name & Code)</div>
                    <div className="col-span-2 text-center">Marks</div>
                    <div className="col-span-2 text-center">GPA</div>
                    <div className="col-span-2 text-center">Grade</div>
                  </div>
                  {formSubjects.map((sub, index) => {
                    const letterGrade = sub.gradePoint >= 5.0 ? "A+" :
                                       sub.gradePoint >= 4.0 ? "A" :
                                       sub.gradePoint >= 3.5 ? "A-" :
                                       sub.gradePoint >= 3.0 ? "B" :
                                       sub.gradePoint >= 2.0 ? "C" :
                                       sub.gradePoint >= 1.0 ? "D" : "F";
                    
                    const badgeColor = letterGrade === "A+" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                       letterGrade === "F" ? "bg-red-50 text-red-700 border-red-200" :
                                       "bg-gray-100 text-gray-700 border-gray-200";

                    return (
                      <div 
                        key={sub.subjectName}
                        className="bg-gray-50 border border-gray-100 p-2.5 rounded-xl grid grid-cols-12 gap-2 items-center hover:border-[#006a4e]/20 hover:bg-white hover:shadow-sm transition-all"
                      >
                        {/* Subject detail */}
                        <div className="col-span-6 pr-1 flex items-center space-x-2">
                          <img 
                            src={getSubjectImage(sub.subjectName)} 
                            alt={sub.subjectName} 
                            className="w-7 h-7 rounded-md object-cover bg-gray-150 shrink-0 border border-gray-200"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold text-gray-800 line-clamp-1">
                              {sub.subjectName}
                            </p>
                            <span className="text-[10px] font-mono text-gray-400 font-semibold">
                              Code: <span className="text-gray-600">{sub.subjectCode || getSubjectCode(sub.subjectName)}</span>
                            </span>
                          </div>
                        </div>

                        {/* Marks Input */}
                        <div className="col-span-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            required
                            value={sub.marks !== undefined ? sub.marks : ""}
                            onChange={(e) => handleSubjectMarksChange(index, e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-lg px-1 py-1 text-xs text-center font-bold font-mono focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] text-gray-900"
                            placeholder="Marks"
                          />
                        </div>

                        {/* GPA Input */}
                        <div className="col-span-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0.00"
                            max="5.00"
                            required
                            value={sub.gradePoint}
                            onChange={(e) => handleSubjectGradeChange(index, e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded-lg px-1 py-1 text-xs text-center font-bold font-mono focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] text-gray-900"
                          />
                        </div>

                        {/* Letter Grade */}
                        <div className="col-span-2 flex justify-center">
                          <span className={`text-[10px] font-black border px-2 py-0.5 rounded-md min-w-8 text-center shrink-0 ${badgeColor}`}>
                            {letterGrade}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dynamic GPA & Marks Estimation Board */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-[#006a4e]/5 border border-[#006a4e]/20 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block">Estimated GPA</span>
                      <span className="text-[9px] text-gray-400 font-normal block font-semibold">Auto-recalculated</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black font-mono text-[#006a4e]">
                        {calculateFinalGpa(formSubjects).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block">Total Marks</span>
                      <span className="text-[9px] text-gray-400 font-normal block font-semibold">Accumulated sum</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black font-mono text-amber-600">
                        {formSubjects.reduce((sum, sub) => sum + (sub.marks || 0), 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="md:col-span-12 border-t border-gray-200 pt-6 flex items-center justify-end space-x-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-white border border-gray-200 text-gray-600 hover:text-gray-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#006a4e] hover:bg-[#00563f] text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center space-x-2 border border-[#00563f]"
                >
                  <Save className="w-4 h-4 text-emerald-200" />
                  <span>{editingStudentId ? "Update Student" : "Register Student"}</span>
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
