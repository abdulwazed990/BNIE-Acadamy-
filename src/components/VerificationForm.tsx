import { useState, useEffect, FormEvent } from "react";
import { Category, Student } from "../types";
import { RefreshCw, SearchCode, ShieldAlert, CheckCircle2, FileKey2 } from "lucide-react";
import { motion } from "motion/react";

interface VerificationFormProps {
  students: Student[];
  onVerifySuccess: (student: Student) => void;
  isDbLoading?: boolean;
}

interface Captcha {
  num1: number;
  num2: number;
  operation: "+" | "-";
  result: number;
}

export default function VerificationForm({ students, onVerifySuccess, isDbLoading = false }: VerificationFormProps) {
  // Input fields
  const [category, setCategory] = useState<Category>(Category.SSC);
  const [rollNumber, setRollNumber] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  // Token-based verification state
  const [isTokenLoaded, setIsTokenLoaded] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [tokenStudentName, setTokenStudentName] = useState("");

  // Captcha state
  const [captcha, setCaptcha] = useState<Captcha>({ num1: 10, num2: 5, operation: "+", result: 15 });
  const [captchaError, setCaptchaError] = useState("");
  const [searchError, setSearchError] = useState("");

  // Generate random Math Captcha
  const generateCaptcha = () => {
    const isAddition = Math.random() > 0.5;
    let n1 = 0;
    let n2 = 0;
    let res = 0;
    let op: "+" | "-" = "+";

    if (isAddition) {
      n1 = Math.floor(Math.random() * 15) + 5; // 5 to 19
      n2 = Math.floor(Math.random() * 10) + 1; // 1 to 10
      res = n1 + n2;
      op = "+";
    } else {
      n1 = Math.floor(Math.random() * 15) + 10; // 10 to 24
      n2 = Math.floor(Math.random() * 9) + 1; // 1 to 9
      res = n1 - n2;
      op = "-";
    }

    setCaptcha({ num1: n1, num2: n2, operation: op, result: res });
    setCaptchaAnswer("");
    setCaptchaError("");
  };

  // Generate math captcha on mount only to prevent resetting the user's input/equation during database background sync
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Handle URL tokens when students database or loading state changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") || params.get("id");

    if (token) {
      // If the database is still loading, wait and don't evaluate error yet
      if (isDbLoading) {
        return;
      }

      const matched = students.find(
        (s) => s.secureToken === token || s.id === token
      );

      if (matched) {
        setCategory(matched.category);
        setRollNumber(matched.rollNumber);
        setRegistrationNumber(matched.registrationNumber);
        setTokenStudentName(matched.name);
        setIsTokenLoaded(true);
        setTokenError("");
        
        // AUTO-VERIFY: Instantly bypass the form & math captcha for valid URL tokens to avoid unnecessary warning boxes
        onVerifySuccess(matched);
      } else {
        setTokenError("Certificate Not Found: The scanned verification token is invalid, expired, or has been canceled.");
        setIsTokenLoaded(false);
      }
    } else {
      setIsTokenLoaded(false);
      setTokenError("");
    }
  }, [students, isDbLoading]);

  // Real-time category matching: as soon as they type Roll & Registration, auto-select Category
  useEffect(() => {
    if (rollNumber.trim() && registrationNumber.trim()) {
      const cleanRoll = rollNumber.trim();
      const cleanReg = registrationNumber.trim();
      const matched = students.find(
        (s) =>
          s.rollNumber.trim() === cleanRoll &&
          s.registrationNumber.trim() === cleanReg
      );
      if (matched && matched.category !== category) {
        setCategory(matched.category);
      }
    }
  }, [rollNumber, registrationNumber, students, category]);

  const clearToken = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("token");
    url.searchParams.delete("id");
    window.history.replaceState({}, document.title, url.toString());

    setCategory(Category.SSC);
    setRollNumber("");
    setRegistrationNumber("");
    setTokenStudentName("");
    setIsTokenLoaded(false);
    setTokenError("");
    setSearchError("");
    setCaptchaAnswer("");
    generateCaptcha();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setCaptchaError("");
    setSearchError("");

    // 1. Verify Captcha
    const parsedAnswer = parseInt(captchaAnswer.trim(), 10);
    if (isNaN(parsedAnswer) || parsedAnswer !== captcha.result) {
      setCaptchaError("Your Captcha Is Not Correct.");
      generateCaptcha();
      return;
    }

    // 2. Search Student Record
    const cleanRoll = rollNumber.trim();
    const cleanReg = registrationNumber.trim();

    // Check with selected category first
    let matched = students.find(
      (s) =>
        s.rollNumber.trim() === cleanRoll &&
        s.registrationNumber.trim() === cleanReg &&
        s.category === category
    );

    // If not found with the selected category, search globally by Roll & Reg across all categories
    if (!matched) {
      const matchedAnyCategory = students.find(
        (s) =>
          s.rollNumber.trim() === cleanRoll &&
          s.registrationNumber.trim() === cleanReg
      );
      if (matchedAnyCategory) {
        setCategory(matchedAnyCategory.category);
        matched = matchedAnyCategory;
      }
    }

    if (matched) {
      onVerifySuccess(matched);
    } else {
      setSearchError(
        `No Record Found. Please verify the Roll Number, Registration Number and make sure you have selected the correct Category.`
      );
      generateCaptcha(); // Refresh captcha on failure
    }
  };

  if (tokenError) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 no-print animate-fade-in">
        <div className="bg-white rounded-2xl border-2 border-red-200 shadow-xl overflow-hidden">
          {/* Header Ribbon */}
          <div className="bg-[#f42a41] text-white p-5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-white/10">
                <ShieldAlert className="w-5 h-5 text-red-200" />
              </div>
              <div>
                <h3 className="font-bold font-sans text-base md:text-lg">Security Exception Triggered</h3>
                <p className="text-[11px] text-red-100">National Credentials Security Framework</p>
              </div>
            </div>
            <span className="text-[9px] bg-white text-red-600 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Verification Failed
            </span>
          </div>

          <div className="p-6 md:p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-[#f42a41]">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h4 className="text-base font-extrabold text-gray-900 uppercase">Certificate Not Found</h4>
              <p className="text-xs text-red-600 leading-relaxed font-bold">
                {tokenError}
              </p>
              <p className="text-[11px] text-gray-500 font-normal leading-normal">
                This verification URL contains an invalid, manipulated, or expired secure token hash. Valid student QR verification links are permanently stored and digitally signed.
              </p>
            </div>

            <div className="border-t border-gray-150 pt-5 flex justify-center">
              <button
                type="button"
                onClick={clearToken}
                className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:shadow"
              >
                Enter Registration Credentials Manually
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 no-print">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#006a4e] to-emerald-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-white/10">
              <FileKey2 className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold font-sans text-base md:text-lg">Certificate Verification Console</h3>
              <p className="text-[11px] text-emerald-100">National Education Database Verification Interface</p>
            </div>
          </div>
          <span className="text-[10px] bg-red-600/90 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            SECURE PORTAL
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          
          {/* Secure Token Preloaded Info Panel */}
          {isTokenLoaded && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start space-x-3 text-left">
              <div className="p-1.5 rounded-lg bg-[#006a4e]/10 text-[#006a4e] shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-[11px] font-bold text-[#006a4e] uppercase tracking-wider block">
                  🔓 Secure Verification Token Loaded Successfully
                </span>
                <p className="text-xs text-gray-700 leading-relaxed">
                  The official record for candidate <strong className="text-gray-950 font-extrabold">{tokenStudentName}</strong> has been dynamically preloaded. 
                </p>
                <p className="text-[10px] text-gray-500 font-medium">
                  Direct database fields are locked for security integrity. Complete the simple math security verification below to instantly view the official transcript report.
                </p>
              </div>
              <button
                type="button"
                onClick={clearToken}
                className="text-[10px] bg-white hover:bg-red-50 text-[#f42a41] border border-red-200 px-2 py-1 rounded-md font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
              >
                Reset Form
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Category selection */}
            <div className="md:col-span-12">
              <label htmlFor="exam-category-select" className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                Exam Category <span className="text-[#f42a41]">*</span>
              </label>
              <div className="relative">
                <select
                  id="exam-category-select"
                  disabled={isTokenLoaded}
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value as Category);
                    setSearchError("");
                  }}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-sm text-gray-950 font-bold focus:outline-hidden focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer transition-all shadow-3xs"
                >
                  <option value={Category.SSC}>Secondary School Certificate (SSC)</option>
                  <option value={Category.HSC}>Higher Secondary Certificate (HSC)</option>
                  <option value={Category.DIPLOMA}>Diploma</option>
                </select>
              </div>
            </div>

            {/* Roll Number input */}
            <div className="md:col-span-6">
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                Roll Number <span className="text-[#f42a41]">*</span>
              </label>
              <input
                type="text"
                required
                disabled={isTokenLoaded}
                placeholder="e.g. 102938"
                value={rollNumber}
                onChange={(e) => {
                  setRollNumber(e.target.value.replace(/\D/g, ""));
                  setSearchError("");
                }}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed font-semibold font-mono"
              />
            </div>

            {/* Registration Number input */}
            <div className="md:col-span-6">
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                Registration Number <span className="text-[#f42a41]">*</span>
              </label>
              <input
                type="text"
                required
                disabled={isTokenLoaded}
                placeholder="e.g. 2019384756"
                value={registrationNumber}
                onChange={(e) => {
                  setRegistrationNumber(e.target.value.replace(/\D/g, ""));
                  setSearchError("");
                }}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e] disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed font-semibold font-mono"
              />
            </div>

            {/* Security Verification Math Captcha */}
            <div className="md:col-span-12 border-t border-gray-150 pt-6">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-gray-900 uppercase tracking-wider block">
                    Security Verification <span className="text-[#f42a41]">*</span>
                  </span>
                  <p className="text-xs text-gray-500 font-normal">
                    Solve the simple equation to prove you are an authorized investigator.
                  </p>
                </div>

                <div className="flex items-center space-x-3 bg-white border border-gray-200 px-4 py-2.5 rounded-xl">
                  <span className="font-mono font-bold text-base md:text-lg text-gray-800 tracking-wider">
                    {captcha.num1} {captcha.operation} {captcha.num2} =
                  </span>
                  
                  <input
                    type="text"
                    required
                    placeholder="?"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value.trim())}
                    className="w-16 text-center font-mono font-bold text-base border-b-2 border-gray-300 focus:border-[#006a4e] focus:outline-hidden bg-transparent py-0.5 text-gray-900"
                  />

                  <button
                    type="button"
                    onClick={generateCaptcha}
                    title="Refresh Captcha"
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-[#006a4e] transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Captcha Error Message */}
              {captchaError && (
                <div className="mt-2.5 flex items-center space-x-2 text-[#f42a41] bg-red-50 px-3.5 py-2 rounded-lg border border-red-100 text-xs font-bold">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{captchaError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Search Result Failure Message */}
          {searchError && (
            <div className="flex items-start space-x-2 text-red-700 bg-red-50 px-4 py-3.5 rounded-xl border border-red-200 text-xs leading-relaxed font-semibold">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#f42a41]" />
              <span>{searchError}</span>
            </div>
          )}

          {/* Verification Button */}
          <button
            type="submit"
            className="w-full bg-[#006a4e] hover:bg-[#00563f] text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center space-x-2 uppercase text-sm tracking-wider"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>Verify Certificate</span>
          </button>
        </form>

        {/* Step-by-Step Instructions */}
        <div className="bg-gray-50 border-t border-gray-150 p-6 md:p-8">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">
            Certificate Verification Process
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h5 className="text-xs font-bold text-gray-900">Select Stream Category</h5>
                <p className="text-[11px] text-gray-500 mt-1 font-normal">
                  Choose between Secondary School (SSC), Higher Secondary (HSC), or Diploma qualifications depending on the certificate level.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h5 className="text-xs font-bold text-gray-900">Enter Student Credentials</h5>
                <p className="text-[11px] text-gray-500 mt-1 font-normal">
                  Provide the unique Roll and Registration number from the printed paper. For proper security, complete the Math Captcha query.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h5 className="text-xs font-bold text-gray-900">Render Transcript Report</h5>
                <p className="text-[11px] text-gray-500 mt-1 font-normal">
                  Our core registry pulls up the candidate dossier, generating a verified watermark, dynamic QR verification code, and instant print/PDF downloads.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
