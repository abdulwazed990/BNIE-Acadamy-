import { useState, type FormEvent } from "react";
import { X, LogIn, User, Key, ShieldCheck, CheckCircle2, FileText, Download, Calendar, Award, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Logo from "./Logo";

interface OsapsLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAdmin: () => void;
  onNavigateToVerify: () => void;
}

export default function OsapsLoginModal({
  isOpen,
  onClose,
  onNavigateToAdmin,
  onNavigateToVerify
}: OsapsLoginModalProps) {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (!studentId.trim() || !password.trim()) {
      setError("Please enter your Student ID / Roll and Password / DOB.");
      return;
    }
    setError("");
    setIsLoggedIn(true);
  };

  const handleDemoStudent = () => {
    setStudentId("ME77412");
    setPassword("2003-08-20");
    setError("");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setStudentId("");
    setPassword("");
    setError("");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-md w-full max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Modal Header */}
          <div className="p-5 border-b border-gray-200 bg-[#006a4e] text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-white/10 rounded-lg text-white">
                <LogIn className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base font-sans">
                  OSAPS Student Portal
                </h3>
                <p className="text-xs text-emerald-100">
                  Online Student Access Portal System • BNIE
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-4">
            {isLoggedIn ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-[#006a4e] flex items-center justify-center text-[#006a4e] font-bold text-lg font-mono">
                    MR
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900">
                      Mahfuzur Rahman Shuvo
                    </h4>
                    <p className="text-[11px] text-gray-600 font-medium">
                      Diploma in Mechanical Engineering
                    </p>
                    <span className="text-[10px] font-mono font-bold text-[#006a4e] bg-white px-2 py-0.5 rounded border border-emerald-200">
                      Roll: ME77412 • Reg: 1703849201
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Academic Session</span>
                    <span className="font-bold text-gray-900">2020–2024</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Current Status</span>
                    <span className="font-bold text-emerald-700">Enrolled / Passed</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Latest CGPA</span>
                    <span className="font-black text-[#006a4e] text-sm">3.88 / 4.00</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-gray-500 block text-[10px] uppercase font-bold">Total Subjects</span>
                    <span className="font-bold text-gray-900">23 Subjects</span>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToVerify();
                    }}
                    className="w-full bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    <span>View Official Mark Sheet &amp; QR Certificate</span>
                  </button>

                  <button
                    onClick={() => {
                      alert("Admit Card Download: Fall Semester 2024 Exam Admit Card downloaded successfully.");
                    }}
                    className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-xs font-bold py-2.5 px-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4 text-emerald-700" />
                    <span>Download Exam Admit Card (PDF)</span>
                  </button>
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={handleLogout}
                    className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
                  >
                    Sign Out from Portal
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 text-xs text-gray-600">
                  Access your course registrations, admit cards, fee receipts, and term results through the centralized OSAPS portal.
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    Student ID or Roll Number
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder=""
                      className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 font-mono font-medium focus:border-[#006a4e] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    Password / Date of Birth (YYYY-MM-DD)
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs text-gray-900 font-medium focus:border-[#006a4e] focus:outline-hidden"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#006a4e] hover:bg-[#00563f] text-white font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 text-xs uppercase tracking-wider shadow-sm"
                >
                  <LogIn className="w-4 h-4 text-emerald-200" />
                  <span>Secure Student Login</span>
                </button>

                <div className="pt-2 text-center border-t border-gray-100 space-y-2">
                  <button
                    type="button"
                    onClick={handleDemoStudent}
                    className="text-xs text-[#006a4e] hover:underline font-bold cursor-pointer block mx-auto"
                  >
                    Quick Try: Load Demo Enrolled Student
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToAdmin();
                    }}
                    className="text-[11px] text-gray-500 hover:text-gray-900 font-medium cursor-pointer block mx-auto"
                  >
                    Faculty / Administrative Staff Login →
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <span className="text-[10px] text-gray-500 font-mono">
              Encryption: TLS 1.3 / 256-Bit SSL
            </span>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
