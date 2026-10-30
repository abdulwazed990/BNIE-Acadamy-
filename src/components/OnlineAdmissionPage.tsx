import { useState, type FormEvent } from "react";
import { 
  UserPlus, CheckCircle2, Award, Calendar, DollarSign, Send, ArrowRight, 
  ArrowLeft, ChevronRight, FileText, Printer, Building2, Phone, Mail, User, ShieldCheck, RefreshCw 
} from "lucide-react";
import { motion } from "motion/react";
import Logo from "./Logo";

interface OnlineAdmissionPageProps {
  onBackToHome: () => void;
  onNavigateToCourses: () => void;
  initialProgram?: string;
}

interface SubmittedApplication {
  appNo: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  program: string;
  shift: string;
  sscRoll: string;
  sscReg: string;
  sscBoard: string;
  sscYear: string;
  sscGpa: string;
  submissionDate: string;
}

export default function OnlineAdmissionPage({
  onBackToHome,
  onNavigateToCourses,
  initialProgram = "mech_4y"
}: OnlineAdmissionPageProps) {
  const [selectedProgram, setSelectedProgram] = useState(initialProgram);
  const [fullName, setFullName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("male");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [preferredShift, setPreferredShift] = useState("1st_morning");
  
  const [sscRoll, setSscRoll] = useState("");
  const [sscReg, setSscReg] = useState("");
  const [sscBoard, setSscBoard] = useState("Dhaka");
  const [sscYear, setSscYear] = useState(new Date().getFullYear().toString());
  const [sscGpa, setSscGpa] = useState("");

  // Dynamic list of passing years for SSC / equivalent from current year+1 down to 1971 (Bangladesh national education records)
  const availablePassingYears = Array.from(
    { length: new Date().getFullYear() - 1970 + 2 },
    (_, i) => (new Date().getFullYear() + 1 - i).toString()
  );

  const [submittedApp, setSubmittedApp] = useState<SubmittedApplication | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const programsMap: Record<string, string> = {
    // Honours
    "CSE-HON": "B.Sc. (Honours) in Computer Science & Engineering (৪ বছর মেয়াদী অনার্স - সিএসই)",
    "BBA-HON": "Bachelor of Business Administration (৪ বছর মেয়াদী অনার্স - বিবিএ)",
    "ENG-HON": "B.A. (Honours) in English (৪ বছর মেয়াদী অনার্স - ইংরেজি)",
    "ECON-HON": "B.S.S. (Honours) in Economics (৪ বছর মেয়াদী অনার্স - অর্থনীতি)",
    // Degree Pass
    "BA-PASS": "Bachelor of Arts (৩ বছর মেয়াদী ডিগ্রি পাস - বি.এ)",
    "BSS-PASS": "Bachelor of Social Science (৩ বছর মেয়াদী ডিগ্রি পাস - বি.এস.এস)",
    "BSC-PASS": "Bachelor of Science (৩ বছর মেয়াদী ডিগ্রি পাস - বি.এসসি)",
    "BBS-PASS": "Bachelor of Business Studies (৩ বছর মেয়াদী ডিগ্রি পাস - বি.বি.এস)",
    // Masters
    "MBA-GEN": "Master of Business Administration (স্নাতকোত্তর মাস্টার্স - এমবিএ)",
    "MCSE-ADV": "M.Sc. in Computer Science & Engineering (স্নাতকোত্তর মাস্টার্স - এম.এসসি সিএসই)",
    "MA-ENG": "Master of Arts in English (স্নাতকোত্তর মাস্টার্স - এম.এ ইংরেজি)",
    // Diploma & Vocational
    mech_4y: "4-Year Diploma in Mechanical Engineering (মেকানিক্যাল ইঞ্জিনিয়ারিং - ৪ বছর)",
    elec_4y: "4-Year Diploma in Electrical Engineering (ইলেকট্রিক্যাল ইঞ্জিনিয়ারিং - ৪ বছর)",
    electr_4y: "4-Year Diploma in Electronics Technology (ইলেকট্রনিক্স টেকনোলজি - ৪ বছর)",
    civil_4y: "4-Year Diploma in Civil Engineering (সিভিল ইঞ্জিনিয়ারিং - ৪ বছর)",
    comp_4y: "4-Year Diploma in Computer Technology (কম্পিউটার টেকনোলজি - ৪ বছর)",
    acm_2y: "Diploma in Air Condition & Maintenance (রেফ্রিজারেশন ও এয়ার কন্ডিশন)",
    ssc_voc: "Secondary School Certificate (SSC) Vocational (এসএসসি ভোকেশনাল)",
    hsc_voc: "Higher Secondary Certificate (HSC) Vocational (এইচএসসি ভোকেশনাল)"
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !sscGpa.trim()) {
      alert("অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর এবং পূর্ববর্তী জিপিএ সঠিকভাবে পূরণ করুন।");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const appNo = `BNIE-ADM-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const newApp: SubmittedApplication = {
        appNo,
        fullName,
        fatherName,
        motherName,
        dob,
        gender,
        phone,
        email,
        address,
        program: programsMap[selectedProgram] || selectedProgram,
        shift: preferredShift === "1st_morning" ? "1st Shift (Morning: 8:00 AM - 1:30 PM)" : "2nd Shift (Day: 2:00 PM - 7:30 PM)",
        sscRoll,
        sscReg,
        sscBoard,
        sscYear,
        sscGpa,
        submissionDate: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        })
      };

      try {
        const existing = JSON.parse(localStorage.getItem("bnie_admission_applications") || "[]");
        existing.unshift(newApp);
        localStorage.setItem("bnie_admission_applications", JSON.stringify(existing));
      } catch (err) {
        console.error("Failed to store admission record locally", err);
      }

      setSubmittedApp(newApp);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 400);
  };

  const handleResetForm = () => {
    setSubmittedApp(null);
    setFullName("");
    setFatherName("");
    setMotherName("");
    setDob("");
    setPhone("");
    setEmail("");
    setAddress("");
    setSscRoll("");
    setSscReg("");
    setSscGpa("");
  };

  return (
    <div className="min-h-screen bg-gray-50/70 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4 no-print">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Home Portal (মূল পাতায় ফিরুন)</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span>Home</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span>Admissions</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#006a4e] font-bold">Online Admission Desk</span>
          </div>
        </div>

        {/* Admission Form or Official Confirmation Slip */}
        {!submittedApp ? (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-[#006a4e] rounded-full text-xs font-bold border border-emerald-200/80">
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Central Admission Desk • Session 2024–2025</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Online Admission Application (অনলাইন ভর্তি আবেদন)
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউটের ৪ বছর মেয়াদী অনার্স, ৩ বছর মেয়াদী ডিগ্রি (পাস), স্নাতকোত্তর (মাস্টার্স), ডিপ্লোমা ইন ইঞ্জিনিয়ারিং ও ভোকেশনাল কোর্সে ভর্তির জন্য নির্ধারিত ফরমটি নির্ভুলভাবে পূরণ করুন।
                </p>
              </div>
            </div>

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-8">
              
              {/* STEP 1: Program Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <span className="w-6 h-6 rounded-full bg-[#006a4e] text-white text-xs font-bold flex items-center justify-center">1</span>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    Select Program &amp; Shift (কোর্স ও শিফট নির্বাচন)
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">
                      Applied Technology / Program *
                    </label>
                    <select
                      value={selectedProgram}
                      onChange={(e) => setSelectedProgram(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]"
                    >
                      <optgroup label="৪ বছর মেয়াদী স্নাতক সম্মান (Honours Programs)">
                        <option value="CSE-HON">B.Sc. (Honours) in Computer Science &amp; Engineering (CSE)</option>
                        <option value="BBA-HON">Bachelor of Business Administration (BBA Honours)</option>
                        <option value="ENG-HON">B.A. (Honours) in English Literature &amp; Language</option>
                        <option value="ECON-HON">B.S.S. (Honours) in Economics</option>
                      </optgroup>
                      
                      <optgroup label="৩ বছর মেয়াদী স্নাতক ডিগ্রি পাস (Degree Pass)">
                        <option value="BA-PASS">Bachelor of Arts (B.A. Pass - ৩ বছর)</option>
                        <option value="BSS-PASS">Bachelor of Social Science (B.S.S. Pass - ৩ বছর)</option>
                        <option value="BSC-PASS">Bachelor of Science (B.Sc. Pass - ৩ বছর)</option>
                        <option value="BBS-PASS">Bachelor of Business Studies (B.B.S. Pass - ৩ বছর)</option>
                      </optgroup>

                      <optgroup label="স্নাতকোত্তর মাস্টার্স প্রোগ্রাম (Masters Programs)">
                        <option value="MBA-GEN">Master of Business Administration (M.B.A.)</option>
                        <option value="MCSE-ADV">M.Sc. in Computer Science &amp; Engineering</option>
                        <option value="MA-ENG">Master of Arts (M.A.) in English</option>
                      </optgroup>

                      <optgroup label="৪ বছর মেয়াদী পলিটেকনিক ডিপ্লোমা (Diploma in Engineering)">
                        <option value="mech_4y">Mechanical Engineering (4-Year Diploma - CGPA 4.00)</option>
                        <option value="elec_4y">Electrical Engineering (4-Year Diploma - CGPA 4.00)</option>
                        <option value="electr_4y">Electronics Technology (4-Year Diploma - CGPA 4.00)</option>
                        <option value="civil_4y">Civil Engineering (4-Year Diploma - CGPA 4.00)</option>
                        <option value="comp_4y">Computer Technology (4-Year Diploma - CGPA 4.00)</option>
                        <option value="acm_2y">Air Condition &amp; Maintenance (Specialized Diploma)</option>
                      </optgroup>

                      <optgroup label="ভোকেশনাল শিক্ষাক্রম (Vocational Programs)">
                        <option value="ssc_voc">SSC Vocational (Secondary Technical)</option>
                        <option value="hsc_voc">HSC Vocational &amp; Technical</option>
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">
                      Preferred Shift *
                    </label>
                    <select
                      value={preferredShift}
                      onChange={(e) => setPreferredShift(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]"
                    >
                      <option value="1st_morning">1st Shift (Morning: 8:00 AM - 1:30 PM)</option>
                      <option value="2nd_day">2nd Shift (Day: 2:00 PM - 7:30 PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* STEP 2: Candidate Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <span className="w-6 h-6 rounded-full bg-[#006a4e] text-white text-xs font-bold flex items-center justify-center">2</span>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    Applicant Information (প্রার্থীর ব্যক্তিগত বিবরণ)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 md:col-span-3">
                    <label className="text-xs font-bold text-gray-700 block mb-1">Full Name (English in BLOCK LETTERS) *</label>
                    <input
                      type="text"
                      required
                      placeholder=""
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm uppercase font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Father's Name *</label>
                    <input
                      type="text"
                      required
                      placeholder=""
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Mother's Name *</label>
                    <input
                      type="text"
                      required
                      placeholder=""
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Gender *</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm"
                    >
                      <option value="male">Male (পুরুষ)</option>
                      <option value="female">Female (মহিলা)</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Mobile Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder=""
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder=""
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2 md:col-span-3">
                    <label className="text-xs font-bold text-gray-700 block mb-1">Present &amp; Permanent Address *</label>
                    <input
                      type="text"
                      required
                      placeholder=""
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* STEP 3: Previous Academic Qualification */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <span className="w-6 h-6 rounded-full bg-[#006a4e] text-white text-xs font-bold flex items-center justify-center">3</span>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    Previous Academic Record (SSC / Dakhil / Equivalent)
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Roll Number</label>
                    <input
                      type="text"
                      required
                      placeholder=""
                      value={sscRoll}
                      onChange={(e) => setSscRoll(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Registration No</label>
                    <input
                      type="text"
                      required
                      placeholder=""
                      value={sscReg}
                      onChange={(e) => setSscReg(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Board</label>
                    <select
                      value={sscBoard}
                      onChange={(e) => setSscBoard(e.target.value)}
                      className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                    >
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Technical">BTEB / Technical</option>
                      <option value="Madrasah">Madrasah</option>
                      <option value="Comilla">Comilla</option>
                      <option value="Jessore">Jessore</option>
                      <option value="Barisal">Barisal</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Dinajpur">Dinajpur</option>
                      <option value="Mymensingh">Mymensingh</option>
                      <option value="BOU">Bangladesh Open University (BOU)</option>
                      <option value="Other">Other / Historical Board</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Passing Year</label>
                    <select
                      value={sscYear}
                      onChange={(e) => setSscYear(e.target.value)}
                      className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                    >
                      {availablePassingYears.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Obtained GPA *</label>
                    <input
                      type="text"
                      required
                      placeholder=""
                      value={sscGpa}
                      onChange={(e) => setSscGpa(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-[#006a4e]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={onNavigateToCourses}
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  View All Programs &amp; Fees
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#006a4e] hover:bg-[#005a42] text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing Application...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Application (আবেদনপত্র জমা দিন)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* OFFICIAL APPLICATION SLIP CONFIRMATION */
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-10 space-y-6 print:border-none print:shadow-none">
            {/* Action Bar (No Print) */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 no-print">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Application Successfully Registered &amp; Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#006a4e] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-[#005a42] shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Admission Slip</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  New Application
                </button>
              </div>
            </div>

            {/* Official Slip Printable Layout */}
            <div className="border-2 border-gray-800 p-6 sm:p-8 rounded-xl space-y-6 bg-white relative">
              {/* Slip Header */}
              <div className="flex items-center justify-between border-b-2 border-gray-800 pb-4 text-center">
                <Logo size={64} className="shrink-0" />
                <div className="flex-1 px-4 text-center">
                  <h2 className="text-xl sm:text-2xl font-black text-gray-950 uppercase tracking-tight font-sans">
                    Bangladesh National Institute of Education
                  </h2>
                  <p className="text-xs font-semibold text-[#006a4e] uppercase tracking-wide">
                    Central Admission Secretariat • Academic Session 2024–2025
                  </p>
                  <span className="inline-block mt-1 px-3 py-0.5 bg-gray-900 text-white text-[11px] font-bold uppercase tracking-widest rounded-sm">
                    Official Candidate Admission Confirmation Slip
                  </span>
                </div>
                <div className="w-16 h-16 border border-dashed border-gray-400 rounded flex items-center justify-center text-[10px] text-gray-400 font-mono text-center">
                  Candidate Photo
                </div>
              </div>

              {/* Application Serial Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-gray-50 border border-gray-300 rounded-lg text-xs">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 block uppercase">Application Serial No:</span>
                  <span className="font-mono font-extrabold text-sm text-[#006a4e]">{submittedApp.appNo}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 block uppercase">Registration Date:</span>
                  <span className="font-semibold text-gray-900">{submittedApp.submissionDate}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-500 block uppercase">Desk Status:</span>
                  <span className="font-bold text-emerald-700 uppercase">Provisional Eligibility Verified</span>
                </div>
              </div>

              {/* Data Table */}
              <div className="space-y-4 text-xs">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-200 bg-gray-50/50">
                        <td className="p-2.5 font-bold text-gray-700 w-1/3">Applicant's Full Name:</td>
                        <td className="p-2.5 font-extrabold text-gray-950 uppercase">{submittedApp.fullName}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2.5 font-bold text-gray-700">Father's Name:</td>
                        <td className="p-2.5 text-gray-900 uppercase">{submittedApp.fatherName || "—"}</td>
                      </tr>
                      <tr className="border-b border-gray-200 bg-gray-50/50">
                        <td className="p-2.5 font-bold text-gray-700">Mother's Name:</td>
                        <td className="p-2.5 text-gray-900 uppercase">{submittedApp.motherName || "—"}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2.5 font-bold text-gray-700">Applied Technology / Stream:</td>
                        <td className="p-2.5 font-extrabold text-[#006a4e]">{submittedApp.program}</td>
                      </tr>
                      <tr className="border-b border-gray-200 bg-gray-50/50">
                        <td className="p-2.5 font-bold text-gray-700">Class Shift:</td>
                        <td className="p-2.5 text-gray-900">{submittedApp.shift}</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="p-2.5 font-bold text-gray-700">Contact Mobile &amp; Email:</td>
                        <td className="p-2.5 text-gray-900 font-mono">{submittedApp.phone} {submittedApp.email && `| ${submittedApp.email}`}</td>
                      </tr>
                      <tr className="border-b border-gray-200 bg-gray-50/50">
                        <td className="p-2.5 font-bold text-gray-700">Address:</td>
                        <td className="p-2.5 text-gray-900">{submittedApp.address || "—"}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-gray-700">SSC Roll / Reg / Board / GPA:</td>
                        <td className="p-2.5 font-semibold text-gray-900 font-mono">
                          Roll: {submittedApp.sscRoll || "N/A"} | Reg: {submittedApp.sscReg || "N/A"} | {submittedApp.sscBoard} Board | GPA: {submittedApp.sscGpa} / 5.00 ({submittedApp.sscYear})
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Verification Notice */}
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 space-y-1">
                  <strong>নির্দেশনাবলী (Important Instructions):</strong>
                  <p>
                    ১. এই ভর্তি আবেদন স্লিপটি প্রিন্ট করে মূল মার্কশিট, প্রশংসাপত্র ও ৪ কপি পাসপোর্ট সাইজ ছবিসহ নির্ধারিত তারিখের মধ্যে ইনস্টিটিউটের ভর্তি শাখায় উপস্থিত হতে হবে।
                  </p>
                  <p>
                    ২. মেকানিক্যাল ইঞ্জিনিয়ারিং ও অন্যান্য ডিপ্লোমা প্রোগ্রামে ভর্তির আসন সংখ্যা সীমিত।
                  </p>
                </div>
              </div>

              {/* Signatures */}
              <div className="pt-10 flex justify-between items-end text-center text-xs">
                <div>
                  <div className="w-40 border-t border-gray-600 pt-1 font-semibold text-gray-700">
                    Applicant's Signature
                  </div>
                </div>
                <div>
                  <div className="w-48 border-t border-gray-600 pt-1 font-bold text-[#006a4e]">
                    Admission Convener / Registrar<br/>
                    <span className="text-[10px] text-gray-500 font-normal">BNIE Central Admission Desk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
