import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Send, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Clock, 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  HelpCircle,
  Building2,
  FileCheck2,
  Headphones
} from "lucide-react";
import Logo from "./Logo";

interface ComplaintsAndServicesProps {
  onBackToHome: () => void;
  onNavigateToVerify: () => void;
  onNavigateToHelp?: () => void;
}

export default function ComplaintsAndServices({
  onBackToHome,
  onNavigateToVerify,
  onNavigateToHelp
}: ComplaintsAndServicesProps) {
  const [complaintType, setComplaintType] = useState("verification_help");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [message, setMessage] = useState("");
  const [submittedTrackingId, setSubmittedTrackingId] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      alert("অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং অভিযোগের বিবরণ পূরণ করুন।");
      return;
    }
    const trackingCode = `BNIE-GRS-${Date.now().toString().slice(-6)}`;
    setSubmittedTrackingId(trackingCode);
  };

  const handleReset = () => {
    setSubmittedTrackingId(null);
    setName("");
    setPhone("");
    setEmail("");
    setRollNumber("");
    setRegistrationNumber("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50/60 py-10 no-print">
      <div className="max-w-5xl mx-auto px-4">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>হোমে ফিরে যান (Return to Home)</span>
          </button>

          <span className="text-[11px] font-semibold text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-2xs">
            অভিযোগ ও নাগরিক সেবা সেল • GRS & Citizen Services
          </span>
        </div>

        {/* Top Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-16 h-16 shrink-0 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-center p-2">
              <Headphones className="w-8 h-8 text-[#006a4e]" />
            </div>
            <div className="text-center sm:text-left space-y-1">
              <span className="text-[11px] font-bold text-[#006a4e] uppercase tracking-widest block">
                গ্রিভেন্স রিড্রেস সিস্টেম (GRS) ও হেল্পডেস্ক
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 font-sans tracking-tight">
                অভিযোগ ও নাগরিক সেবা (Complaints &amp; Student Services)
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl">
                বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউটের সেবা গ্রহণকারী শিক্ষার্থী, অভিভাবক ও সেবা প্রত্যাশীদের যে কোনো অভিযোগ, সনদ সংশোধন, ফলাফল যাচাই জটিলতা বা প্রশাসনিক সেবার জন্য সরাসরি আবেদন জমা দিন।
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Grid: Form on Left, Citizen Charter & Fast Helplines on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Complaint & Service Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5 flex items-center justify-between">
                <span>অনলাইন অভিযোগ / সেবা আবেদন ফরম</span>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                  সহজ দাখিল
                </span>
              </h2>

              {submittedTrackingId ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-[#006a4e]">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 font-sans">
                    আপনার আবেদনটি সফলভাবে গৃহীত হয়েছে!
                  </h3>
                  <p className="text-xs text-gray-600 max-w-md mx-auto">
                    আমাদের সেবাকেন্দ্র কর্তৃপক্ষ শীঘ্রই আপনার প্রদত্ত মোবাইল অথবা ইমেইলে যোগাযোগ করবে। পরবর্তী অনুসন্ধানের জন্য ট্র্যাকিং নম্বরটি সংরক্ষণ করুন:
                  </p>
                  <div className="bg-emerald-50 border-2 border-dashed border-[#006a4e] p-3 rounded-xl max-w-xs mx-auto">
                    <span className="text-xs text-gray-500 uppercase block font-semibold">ট্র্যাকিং কোড</span>
                    <span className="text-base font-black font-mono text-[#006a4e] tracking-wider">
                      {submittedTrackingId}
                    </span>
                  </div>
                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      onClick={handleReset}
                      className="bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-colors"
                    >
                      আরেকটি আবেদন দাখিল করুন
                    </button>
                    <button
                      onClick={onBackToHome}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-colors"
                    >
                      হোমে ফিরুন
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                      সেবা বা অভিযোগের বিষয় <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={complaintType}
                      onChange={(e) => setComplaintType(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:border-[#006a4e] focus:outline-hidden"
                    >
                      <option value="verification_help">অনলাইন সনদ যাচাই জটিলতা (Verification Assistance)</option>
                      <option value="name_correction">সনদ বা মার্কশিটে নাম/তথ্য সংশোধন (Correction in Certificate)</option>
                      <option value="duplicate_cert">ডুপ্লিকেট সনদ/মার্কশিট উত্তোলন (Duplicate Certificate/Marksheet)</option>
                      <option value="admission_query">অনলাইন ভর্তি ও রেজিস্ট্রেশন সহায়তা (Admission Assistance)</option>
                      <option value="academic_transcript">অফিসিয়াল একাডেমিক ট্রান্সক্রিপ্ট উত্তোলন (Transcript Request)</option>
                      <option value="other">অন্যান্য প্রশাসনিক সেবা বা অভিযোগ (Other Services)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                        আবেদনকারীর নাম <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder=""
                        className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:border-[#006a4e] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                        মোবাইল নম্বর <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder=""
                        className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:border-[#006a4e] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                        রোল নম্বর (যদি থাকে)
                      </label>
                      <input
                        type="text"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        placeholder=""
                        className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium font-mono focus:border-[#006a4e] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                        রেজিস্ট্রেশন নম্বর (যদি থাকে)
                      </label>
                      <input
                        type="text"
                        value={registrationNumber}
                        onChange={(e) => setRegistrationNumber(e.target.value)}
                        placeholder=""
                        className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium font-mono focus:border-[#006a4e] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                      ইমেইল ঠিকানা (ঐচ্ছিক)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=""
                      className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:border-[#006a4e] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                      অভিযোগ বা সেবার বিস্তারিত বিবরণ <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder=""
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs text-gray-900 font-medium focus:border-[#006a4e] focus:outline-hidden leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#006a4e] hover:bg-[#00563f] text-white font-bold py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 text-xs uppercase tracking-wider shadow-sm"
                  >
                    <Send className="w-4 h-4 text-emerald-200" />
                    <span>অভিযোগ / আবেদন দাখিল করুন (Submit Request)</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Citizen Charter & Direct Help Lines */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Citizen Charter Quick Guide */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2.5 flex items-center space-x-2">
                <FileCheck2 className="w-4 h-4 text-[#006a4e]" />
                <span>নাগরিক সেবা সনদ (Citizen Charter)</span>
              </h3>

              <div className="space-y-3 text-xs text-gray-700">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2.5">
                  <span className="font-bold text-[#006a4e] shrink-0">০১.</span>
                  <div>
                    <span className="font-bold text-gray-900 block">সনদ ও মার্কশিট অনলাইন যাচাইকরণ</span>
                    <span className="text-gray-500">তাত্ক্ষণিকভাবে সম্পূর্ণ বিনামূল্যে ২৪/৭ উন্মুক্ত।</span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2.5">
                  <span className="font-bold text-[#006a4e] shrink-0">০২.</span>
                  <div>
                    <span className="font-bold text-gray-900 block">নাম বা তথ্য সংশোধনী সেবা</span>
                    <span className="text-gray-500">প্রয়োজনীয় প্রমাণপত্র সহ আবেদন জমা দেওয়ার ৭-১০ কর্মদিবস।</span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2.5">
                  <span className="font-bold text-[#006a4e] shrink-0">০৩.</span>
                  <div>
                    <span className="font-bold text-gray-900 block">ডুপ্লিকেট সনদ প্রদান</span>
                    <span className="text-gray-500">থানার জিডি কপি ও পেপারের বিজ্ঞপ্তিসহ আবেদনের ১০ কর্মদিবস।</span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-2.5">
                  <span className="font-bold text-[#006a4e] shrink-0">০৪.</span>
                  <div>
                    <span className="font-bold text-gray-900 block">আন্তর্জাতিক সত্যায়ন সহায়তা (Embassy / WES)</span>
                    <span className="text-gray-500">সরাসরি কন্ট্রোলার শাখার মাধ্যমে দ্রুত সত্যায়ন সার্ভিস।</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Helpline & Contact Info */}
            <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-emerald-300" />
                <h4 className="font-bold text-sm uppercase tracking-wider">সরাসরি যোগাযোগ ও হেল্পলাইন</h4>
              </div>

              <div className="space-y-3 text-xs text-emerald-100">
                <div className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>হটলাইন: <strong>+880 1712-345678</strong> (সকাল ৯টা - বিকাল ৫টা)</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>অভিযোগ ইমেইল: <strong>grs.bnie@gmail.com</strong></span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>কর্মদিবস: রবিবার থেকে বৃহস্পতিবার (ছুটির দিন ব্যতিত)</span>
                </div>
                <div className="flex items-start space-x-2.5">
                  <Building2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>প্রশাসনিক সেল: সেকশন-৬, মিরপুর, ঢাকা-১২১৬, বাংলাদেশ</span>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-800">
                <button
                  type="button"
                  onClick={onNavigateToVerify}
                  className="w-full bg-white text-[#006a4e] hover:bg-emerald-50 text-xs font-bold py-2.5 px-3 rounded-xl transition-colors cursor-pointer text-center block"
                >
                  পরীক্ষার ফলাফল ও সনদ যাচাই পোর্টালে যান →
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
