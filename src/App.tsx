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
import Logo from "./components/Logo";
import { Student } from "./types";
import { DEFAULT_STUDENTS } from "./data/defaultStudents";
import { ChevronRight, Home, ShieldCheck, Database, Award, ArrowLeft, Menu, X, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Navigation / Pages State: "home" | "verify" | "report" | "admin"
  const [currentPage, setCurrentPage] = useState<string>("home");
  

  
  // Database State - seeded with default students, persistent in localStorage
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

  // Track currently selected/verified student for the Report view
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Mobile menu control
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Synchronize student ledger changes to localStorage
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

  // CMS functions
  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
    alert(`Successfully registered candidate: ${newStudent.name}`);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    alert(`Successfully updated record for: ${updatedStudent.name}`);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const handleViewStudentFromAdmin = (student: Student) => {
    setSelectedStudent(student);
    handleNavigate("report");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans selection:bg-[#006a4e]/20 selection:text-[#006a4e] w-full max-w-full overflow-x-hidden print:min-w-0">
      
      {/* Webpage contents layout wrapper */}
      <div className="flex-1 flex flex-col">
        {/* Top Notification Bar (Gov Announcement Vibe, Hidden in Print) */}
        <div className="bg-[#f42a41] text-white text-[11px] md:text-xs py-2 px-4 text-center font-semibold tracking-wide flex items-center justify-center space-x-2 shrink-0 no-print">
        <span className="bg-white text-[#f42a41] font-extrabold text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider animate-pulse shrink-0">
          LATEST NEWS
        </span>
        <span className="truncate font-sans font-medium">
          Digital credentials ledger is now fully synced with regional polytechnic divisions. Perform online validation instantly.
        </span>
      </div>

      {/* Main Administrative Header Navigation Rail (Hidden in Print) */}
      <nav className="w-full bg-gray-50 border-b border-gray-200 py-3 px-4 no-print shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left Title Link */}
          <button 
            onClick={() => handleNavigate("home")}
            className="flex items-center space-x-3.5 text-left cursor-pointer group"
          >
            <Logo size={68} className="shadow-sm hover:scale-105 transition-transform" />
            <div>
              <span className="font-extrabold text-sm md:text-lg text-gray-950 uppercase tracking-tight block">
                BNIE Portal
              </span>
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
            <button
              onClick={() => handleNavigate("admin-login")}
              className={`text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors flex items-center space-x-1 ${
                currentPage.startsWith("admin") ? "text-[#006a4e]" : "text-gray-600 hover:text-[#006a4e]"
              }`}
            >
              <Database className="w-3.5 h-3.5 text-[#f42a41]" />
              <span>Admin Panel</span>
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
            <button
              onClick={() => handleNavigate("admin-login")}
              className="w-full text-left text-xs font-bold uppercase tracking-wider py-2 text-gray-700 hover:text-red-700 flex items-center space-x-2"
            >
              <Database className="w-4 h-4 text-[#f42a41]" />
              <span>Admin Panel</span>
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
