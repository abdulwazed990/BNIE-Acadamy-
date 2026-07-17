import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import VocationalSpecialization from "./components/VocationalSpecialization";
import DiplomaStreams from "./components/DiplomaStreams";
import MissionAndServices from "./components/MissionAndServices";
import Contact from "./components/Contact";
import VerificationForm from "./components/VerificationForm";
import VerificationReport from "./components/VerificationReport";
import AdminPanel from "./components/AdminPanel";
import DiplomaCourses from "./components/DiplomaCourses";
import Specializations from "./components/Specializations";
import Logo from "./components/Logo";
import { Student } from "./types";
import { DEFAULT_STUDENTS } from "./data/defaultStudents";
import { 
  seedDatabaseIfEmpty, 
  addStudentToDb, 
  updateStudentInDb, 
  deleteStudentFromDb 
} from "./lib/firebase";
import { ChevronRight, Home, ShieldCheck, Database, Award, ArrowLeft, Menu, X, BookOpen, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Navigation / Pages State: "home" | "verify" | "report" | "admin"
  const [currentPage, setCurrentPage] = useState<string>("home");
  
  // Database Loading state
  const [isDbLoading, setIsDbLoading] = useState(true);
  
  // Database State - seeded with default students, persistent in localStorage as secondary backup
  const [students, setStudents] = useState<Student[]>(() => {
    let saved = localStorage.getItem("bnie_students");
    if (!saved) {
      saved = localStorage.getItem("bisd_students");
    }
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved students", e);
      }
    }
    return DEFAULT_STUDENTS;
  });

  // Load and sync with Cloud Firestore on mount
  useEffect(() => {
    async function syncCloudDatabase() {
      try {
        setIsDbLoading(true);
        const cloudStudents = await seedDatabaseIfEmpty();
        setStudents(cloudStudents);
      } catch (error) {
        console.error("Failed to sync cloud database. Fallback to local storage remains active.", error);
      } finally {
        setIsDbLoading(false);
      }
    }
    syncCloudDatabase();
  }, []);

  // Track currently selected/verified student for the Report view
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Mobile menu control
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Synchronize student ledger changes to localStorage as a robust hybrid/secondary backup
  useEffect(() => {
    localStorage.setItem("bnie_students", JSON.stringify(students));
  }, [students]);

  // Handle auto-routing for QR code scans
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("token") || params.get("id")) {
      setCurrentPage("verify");
    }
  }, []);

  // Handle route navigation smoothly
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  // Callback when student is successfully queried
  const handleVerifySuccess = (student: Student) => {
    setSelectedStudent(student);
    handleNavigate("report");
  };

  // CMS functions with automatic Firebase cloud saving
  const handleAddStudent = async (newStudent: Student) => {
    try {
      await addStudentToDb(newStudent);
      setStudents((prev) => [newStudent, ...prev]);
      alert(`Successfully registered candidate: ${newStudent.name}`);
    } catch (error) {
      console.error("Failed to save student to database:", error);
      alert("Error: Unable to save student to Cloud Database. Please check your network connection.");
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    try {
      await updateStudentInDb(updatedStudent);
      setStudents((prev) =>
        prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
      );
      alert(`Successfully updated record for: ${updatedStudent.name}`);
    } catch (error) {
      console.error("Failed to update student in database:", error);
      alert("Error: Unable to save updates to Cloud Database. Please check your network connection.");
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await deleteStudentFromDb(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete student from database:", error);
      alert("Error: Unable to delete student from Cloud Database. Please check your network connection.");
    }
  };


  const handleViewStudentFromAdmin = (student: Student) => {
    setSelectedStudent(student);
    handleNavigate("report");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans selection:bg-[#006a4e]/20 selection:text-[#006a4e] w-full max-w-full overflow-x-hidden print:min-w-0">
      
      {/* Webpage contents layout wrapper */}
      <div className="flex-1 flex flex-col">

      {/* Main Administrative Header Navigation Rail (Hidden in Print) */}
      <nav className="w-full bg-gray-50 border-b border-gray-200 py-3 px-4 no-print shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left Title Link */}
          <button 
            onClick={() => handleNavigate("home")}
            className="flex items-center space-x-3.5 text-left cursor-pointer group"
          >
            <Logo size={68} className="hover:scale-105 transition-transform" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm md:text-lg text-gray-950 uppercase tracking-tight block">
                  BNIE Portal
                </span>
                {isDbLoading ? (
                  <span className="inline-flex items-center gap-1 text-[9px] bg-amber-50 text-amber-700 border border-amber-200/60 px-1.5 py-0.5 rounded-sm font-bold normal-case font-mono tracking-normal">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Syncing...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-1.5 py-0.5 rounded-sm font-bold normal-case font-mono tracking-normal">
                    ● Cloud Live
                  </span>
                )}
              </div>
              <span className="text-[10px] md:text-xs text-gray-500 font-medium block">
                People's Republic of Bangladesh
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-5">
            <button
              onClick={() => handleNavigate("home")}
              className={`text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors flex items-center space-x-1 ${
                currentPage === "home" ? "text-[#006a4e]" : "text-gray-600 hover:text-[#006a4e]"
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => handleNavigate("specializations")}
              className={`text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors flex items-center space-x-1 ${
                currentPage === "specializations" ? "text-[#006a4e]" : "text-gray-600 hover:text-[#006a4e]"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>SSC/HSC Groups</span>
            </button>
            <button
              onClick={() => handleNavigate("courses")}
              className={`text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors flex items-center space-x-1 ${
                currentPage === "courses" ? "text-[#006a4e]" : "text-gray-600 hover:text-[#006a4e]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Diploma Courses</span>
            </button>
            <button
              onClick={() => handleNavigate("verify")}
              className={`text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors flex items-center space-x-1 ${
                currentPage === "verify" ? "text-[#006a4e]" : "text-gray-600 hover:text-[#006a4e]"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verify Certificate</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Slide-in Navigation (Hidden in Print) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-3 no-print overflow-hidden"
          >
            <button
              onClick={() => handleNavigate("home")}
              className="w-full text-left text-xs font-bold uppercase tracking-wider py-2 text-gray-700 hover:text-[#006a4e] flex items-center space-x-2"
            >
              <Home className="w-4 h-4 text-gray-400" />
              <span>Home</span>
            </button>
            <button
              onClick={() => handleNavigate("specializations")}
              className="w-full text-left text-xs font-bold uppercase tracking-wider py-2 text-gray-700 hover:text-[#006a4e] flex items-center space-x-2"
            >
              <Award className="w-4 h-4 text-[#006a4e]" />
              <span>SSC/HSC Groups</span>
            </button>
            <button
              onClick={() => handleNavigate("courses")}
              className="w-full text-left text-xs font-bold uppercase tracking-wider py-2 text-gray-700 hover:text-[#006a4e] flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4 text-[#006a4e]" />
              <span>Diploma Courses</span>
            </button>
            <button
              onClick={() => handleNavigate("verify")}
              className="w-full text-left text-xs font-bold uppercase tracking-wider py-2 text-[#006a4e] flex items-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#006a4e]" />
              <span>Verify Certificate</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Educational Banner Header */}
      <Header />

      {/* Page Content Body (Dynamic Router) */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          
          {/* HOME PAGE ROUTE */}
          {currentPage === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Hero onVerifyClick={() => handleNavigate("verify")} onCoursesClick={() => handleNavigate("courses")} />
              <VocationalSpecialization />
              <DiplomaStreams />
              <MissionAndServices />
              <Contact />
            </motion.div>
          )}

          {/* SPECIALIZATIONS PAGE ROUTE */}
          {currentPage === "specializations" && (
            <motion.div
              key="specializations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <Specializations
                onBackToHome={() => handleNavigate("home")}
              />
              <Contact />
            </motion.div>
          )}

          {/* DIPLOMA COURSES PAGE ROUTE */}
          {currentPage === "courses" && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <DiplomaCourses
                onBackToHome={() => handleNavigate("home")}
                onNavigateToVerify={() => handleNavigate("verify")}
              />
              <Contact />
            </motion.div>
          )}

          {/* VERIFY PAGE ROUTE */}
          {currentPage === "verify" && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="py-8 bg-gray-50/50">
                <VerificationForm 
                  students={students} 
                  onVerifySuccess={handleVerifySuccess} 
                  isDbLoading={isDbLoading}
                />
              </div>
              <Contact />
            </motion.div>
          )}

          {/* REPORT PAGE ROUTE */}
          {currentPage === "report" && selectedStudent && (
            <motion.div
              key="report"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <VerificationReport 
                student={selectedStudent} 
                onBack={() => {
                  // If we came from the admin dashboard, return to admin! Otherwise, return to verify.
                  // We can determine this by checking the last state or checking if they have admin state
                  // Let's default back to the verification page
                  handleNavigate("verify");
                }} 
              />
            </motion.div>
          )}

          {/* ADMIN CONSOLE ROUTE */}
          {currentPage === "admin-login" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* Back Button for Admin Page */}
              <div className="max-w-7xl mx-auto px-4 pt-6 no-print">
                <button
                  onClick={() => handleNavigate("home")}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-gray-500 hover:text-gray-900 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Home Portal</span>
                </button>
              </div>

              <AdminPanel
                students={students}
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
                onViewStudent={handleViewStudentFromAdmin}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Official Government footer */}
      <Footer onNavigate={handleNavigate} />
      </div>
    </div>
  );
}
