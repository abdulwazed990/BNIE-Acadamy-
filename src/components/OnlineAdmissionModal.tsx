import { useState, type FormEvent } from "react";
import { X, UserPlus, CheckCircle2, Award, Calendar, DollarSign, Send, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface OnlineAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCourses: () => void;
}

export default function OnlineAdmissionModal({
  isOpen,
  onClose,
  onNavigateToCourses
}: OnlineAdmissionModalProps) {
  const [selectedProgram, setSelectedProgram] = useState("mech_4y");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [previousGpa, setPreviousGpa] = useState("");
  const [preferredShift, setPreferredShift] = useState("1st_morning");
  const [submittedAppNo, setSubmittedAppNo] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !previousGpa.trim()) {
      alert("অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং পূর্ববর্তী জিপিএ পূরণ করুন।");
      return;
    }
    const appNumber = `BNIE-ADM-${Date.now().toString().slice(-6)}`;
    setSubmittedAppNo(appNumber);
  };

  const handleReset = () => {
    setSubmittedAppNo(null);
    setFullName("");
    setPhone("");
    setEmail("");
    setPreviousGpa("");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs no-print">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Modal Header */}
          <div className="p-5 border-b border-gray-200 bg-emerald-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-white/10 rounded-lg text-emerald-300">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base font-sans">
                  অনলাইন ভর্তি আবেদন (Online Admission)
                </h3>
                <p className="text-xs text-emerald-200">
                  Academic Session 2024–2025 • BNIE Central Admission Desk
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
            {submittedAppNo ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-[#006a4e]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 font-sans">
                  ভর্তি আবেদন সফলভাবে জমা হয়েছে!
                </h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  আপনার প্রাথমিক আবেদনটি গ্রহণ করা হয়েছে। একাডেমিক ভর্তি সেল থেকে শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।
                </p>
                <div className="bg-emerald-50 border-2 border-dashed border-[#006a4e] p-3.5 rounded-xl max-w-xs mx-auto">
                  <span className="text-[11px] text-gray-500 uppercase block font-semibold">আবেদন রেফারেন্স নম্বর</span>
                  <span className="text-lg font-black font-mono text-[#006a4e] tracking-wider">
                    {submittedAppNo}
                  </span>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={handleReset}
                    className="bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                  >
                    নতুন আবেদন করুন
                  </button>
                  <button
                    onClick={onClose}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                  >
                    সমাপ্ত করুন
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    কাঙ্ক্ষিত প্রোগ্রাম নির্বাচন করুন <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-xs text-gray-900 font-medium focus:border-[#006a4e] focus:outline-hidden"
                  >
                    <option value="mech_4y">Diploma in Mechanical Engineering (4 Years - 23 Subjects)</option>
                    <option value="elec_4y">Diploma in Electrical & Electronics Engineering (4 Years)</option>
                    <option value="et_4y">Diploma in Electronics Technology (4 Years - 23 Subjects)</option>
                    <option value="civil_4y">Diploma in Civil Engineering (4 Years)</option>
                    <option value="cse_4y">Diploma in Computer Engineering (4 Years)</option>
                    <option value="acm_2y">Diploma in Air Condition & Maintenance (2 Years)</option>
                    <option value="hsc_voc">HSC Vocational (2 Years - Science/General)</option>
                    <option value="ssc_voc">SSC Vocational Program</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                      শিক্ষার্থীর নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder=""
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:border-[#006a4e] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                      মোবাইল নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder=""
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:border-[#006a4e] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                      এসএসসি / সমমান জিপিএ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="2.00"
                      max="5.00"
                      required
                      value={previousGpa}
                      onChange={(e) => setPreviousGpa(e.target.value)}
                      placeholder=""
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:border-[#006a4e] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                      পছন্দের শিফট (Shift Preference)
                    </label>
                    <select
                      value={preferredShift}
                      onChange={(e) => setPreferredShift(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:border-[#006a4e] focus:outline-hidden"
                    >
                      <option value="1st_morning">১ম শিফট (সকাল ৮:০০ - দুপুর ১:৩০)</option>
                      <option value="2nd_day">২য় শিফট (দুপুর ২:০০ - সন্ধ্যা ৭:০০)</option>
                      <option value="weekend">উইকেন্ড / সান্ধ্যকালীন ব্যাচ (কর্মজীবীদের জন্য)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                    ইমেইল ঠিকানা (ঐচ্ছিক)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=""
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-900 font-medium focus:border-[#006a4e] focus:outline-hidden"
                  />
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#006a4e] shrink-0" />
                  <span>ন্যূনতম এসএসসি/সমমান পাস (বিজ্ঞান, মানবিক বা বাণিজ্য শাখা)। কোনো বয়সসীমা নেই।</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#006a4e] hover:bg-[#00563f] text-white font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 text-xs uppercase tracking-wider shadow-sm"
                >
                  <Send className="w-4 h-4 text-emerald-200" />
                  <span>ভর্তি আবেদন দাখিল করুন (Submit Application)</span>
                </button>
              </form>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                onNavigateToCourses();
              }}
              className="text-xs font-bold text-[#006a4e] hover:underline cursor-pointer"
            >
              কোর্স ফি ও সিলেবাস দেখুন →
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              বন্ধ করুন (Close)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
