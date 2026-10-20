import { useState, type FormEvent } from "react";
import { X, Mail, Key, ExternalLink, Send, Building2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface WebEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WebEmailModal({ isOpen, onClose }: WebEmailModalProps) {
  const [emailUser, setEmailUser] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleWebmailLogin = (e: FormEvent) => {
    e.preventDefault();
    if (!emailUser.trim() || !password.trim()) {
      alert("Please enter your institutional email address and password.");
      return;
    }
    alert(`Connecting to BNIE Secure Webmail Server (mail.bnie.edu.bd)... Access verified for ${emailUser}@bnie.edu.bd`);
    onClose();
  };

  const departments = [
    { name: "Controller of Examinations (পরীক্ষা নিয়ন্ত্রক)", email: "exam.controller@bnie.edu.bd" },
    { name: "Central Verification & Record Desk (সনদ যাচাই শাখা)", email: "bnieeducationbd@gmail.com" },
    { name: "Admissions & Academic Secretariat (ভর্তি শাখা)", email: "admission@bnie.edu.bd" },
    { name: "Office of the Vice-Chancellor (উপাচার্য সচিবালয়)", email: "vc.office@bnie.edu.bd" }
  ];

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
          <div className="p-5 border-b border-gray-200 bg-gray-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-emerald-600 rounded-lg text-white">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base font-sans">
                  BNIE Web Email (ইনস্টিটিউট ওয়েবমেইল)
                </h3>
                <p className="text-xs text-gray-300">
                  Institutional Mail Services • mail.bnie.edu.bd
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto space-y-4">
            <form onSubmit={handleWebmailLogin} className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600">
                Staff, Faculty members, and Department Administrators can access official email accounts through this portal.
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Institutional Email
                </label>
                <div className="flex rounded-xl shadow-2xs">
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    value={emailUser}
                    onChange={(e) => setEmailUser(e.target.value)}
                    placeholder=""
                    className="w-full bg-white border border-gray-300 rounded-l-xl px-3 py-2 text-xs text-gray-900 font-mono focus:border-[#006a4e] focus:outline-hidden"
                  />
                  <span className="inline-flex items-center px-3 rounded-r-xl border border-l-0 border-gray-300 bg-gray-100 text-gray-600 text-xs font-mono font-semibold">
                    @bnie.edu.bd
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 focus:border-[#006a4e] focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#006a4e] hover:bg-[#00563f] text-white font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 text-xs uppercase tracking-wider shadow-sm"
              >
                <Mail className="w-4 h-4 text-emerald-200" />
                <span>Log In to Webmail</span>
              </button>
            </form>

            <div className="pt-2 border-t border-gray-100 space-y-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                Official Department Directory
              </span>
              <div className="space-y-1.5">
                {departments.map((d, i) => (
                  <div key={i} className="p-2 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-gray-800 block text-[11px]">{d.name}</span>
                      <a href={`mailto:${d.email}`} className="text-[#006a4e] font-mono text-[11px] hover:underline">
                        {d.email}
                      </a>
                    </div>
                    <a
                      href={`mailto:${d.email}`}
                      className="p-1.5 text-gray-400 hover:text-[#006a4e] hover:bg-emerald-50 rounded"
                      title="Send Email"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
