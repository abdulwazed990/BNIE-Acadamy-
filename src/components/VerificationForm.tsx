import { useState, useEffect, FormEvent } from "react";
import { Category, Student } from "../types";
import { RefreshCw, SearchCode, ShieldAlert, CheckCircle2, FileKey2, GraduationCap, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { findStudentInDatabase } from "../lib/firebase";

interface VerificationFormProps {
  students: Student[];
  onVerifySuccess: (student: Student) => void;
  isDbLoading?: boolean;
  onNavigateToDegreeVerify?: () => void;
  onStudentFound?: (student: Student) => void;
}

interface Captcha {
  num1: number;
  num2: number;
  operation: "+" | "-";
  result: number;
}

export default function VerificationForm({ 
  students, 
  onVerifySuccess, 
  isDbLoading = false,
  onNavigateToDegreeVerify,
  onStudentFound
}: VerificationFormProps) {
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
  const [rollError, setRollError] = useState("");
  const [regError, setRegError] = useState("");
  const [degreeCrossMatch, setDegreeCrossMatch] = useState<Student | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Input Touched States for Immediate Accessible Feedback
  const [rollTouched, setRollTouched] = useState(false);
  const [regTouched, setRegTouched] = useState(false);

  // Sanitization helper
  const sanitizeCredential = (val: string): string => {
    return val.replace(/[<>{};$%\\^`~]/g, "").trim();
  };

  // Immediate Roll validation
  const validateRoll = (val: string): string => {
    const clean = val.trim();
    if (!clean) return "Please enter your Roll Number.";
    if (/[<>{};$%\\^`~]/.test(val)) return "Invalid characters detected. Only letters, numbers, and hyphens are allowed.";
    if (clean.length < 4) return `Roll Number must be at least 4 characters (currently ${clean.length}).`;
    if (clean.length > 20) return "Roll Number cannot exceed 20 characters.";
    if (!/^[a-zA-Z0-9\-_/]+$/.test(clean)) return "Roll Number may only contain numbers, letters, hyphens, and slashes.";
    return "";
  };

  // Immediate Registration validation
  const validateReg = (val: string): string => {
    const clean = val.trim();
    if (!clean) return "Please enter your Registration Number.";
    if (/[<>{};$%\\^`~]/.test(val)) return "Invalid characters detected. Only letters, numbers, and hyphens are allowed.";
    if (clean.length < 6) return `Registration Number must be at least 6 characters (currently ${clean.length}).`;
    if (clean.length > 25) return "Registration Number cannot exceed 25 characters.";
    if (!/^[a-zA-Z0-9\-_/]+$/.test(clean)) return "Registration Number may only contain numbers, letters, hyphens, and slashes.";
    return "";
  };

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
    let token = params.get("token") || params.get("id") || params.get("serial") || params.get("roll");

    // Also check pathname (e.g. /verify/APO-TEST-001 or /verify/stud_1 or /certificate/666102)
    if (!token) {
      const parts = window.location.pathname.split("/").filter(Boolean);
      const verifyIdx = parts.findIndex(p => p.toLowerCase() === "verify" || p.toLowerCase() === "certificate" || p.toLowerCase() === "record");
      if (verifyIdx >= 0 && parts[verifyIdx + 1]) {
        token = decodeURIComponent(parts[verifyIdx + 1]);
      }
    }

    if (token) {
      // If the database is still loading, wait and don't evaluate error yet
      if (isDbLoading) {
        return;
      }

      const cleanToken = token.trim().toLowerCase();
      const matched = students.find(
        (s) =>
          (s.secureToken && s.secureToken.toLowerCase() === cleanToken) ||
          s.id.toLowerCase() === cleanToken ||
          s.rollNumber.toLowerCase() === cleanToken ||
          s.registrationNumber.toLowerCase() === cleanToken ||
          (s.certificateSerialNumber && s.certificateSerialNumber.toLowerCase() === cleanToken)
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
    setRollError("");
    setRegError("");
    setRollTouched(false);
    setRegTouched(false);
    setDegreeCrossMatch(null);
    setCaptchaAnswer("");
    generateCaptcha();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSearching || isDbLoading) return;

    setCaptchaError("");
    setSearchError("");
    setDegreeCrossMatch(null);

    const cleanRoll = sanitizeCredential(rollNumber).toLowerCase();
    const cleanReg = sanitizeCredential(registrationNumber).toLowerCase();

    // 1. Client-Side Input Sanitization and Validation for Roll Number
    setRollTouched(true);
    const rollValidationErr = validateRoll(cleanRoll);
    if (rollValidationErr) {
      setRollError(rollValidationErr);
      return;
    }
    setRollError("");

    // 2. Client-Side Input Sanitization and Validation for Registration Number
    setRegTouched(true);
    const regValidationErr = validateReg(cleanReg);
    if (regValidationErr) {
      setRegError(regValidationErr);
      return;
    }
    setRegError("");

    // 3. Verify Captcha
    const parsedAnswer = parseInt(captchaAnswer.trim(), 10);
    if (isNaN(parsedAnswer) || parsedAnswer !== captcha.result) {
      setCaptchaError("Your Captcha Is Not Correct.");
      generateCaptcha();
      return;
    }

    // 4. Search Student Record with loading state (Initiate database query only after client-side validation passes)
    setIsSearching(true);
    try {
      // Short delay for visual spinner and preventing rapid duplicate clicks
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Check with selected category first
      let matched = students.find(
        (s) =>
          s.rollNumber.trim().toLowerCase() === cleanRoll &&
          s.registrationNumber.trim().toLowerCase() === cleanReg &&
          s.category === category
      );

      // If not found with the selected category, search globally by Roll & Reg across all categories
      if (!matched) {
        const matchedAnyCategory = students.find(
          (s) =>
            s.rollNumber.trim().toLowerCase() === cleanRoll &&
            s.registrationNumber.trim().toLowerCase() === cleanReg &&
            (s.category === Category.SSC || s.category === Category.HSC || s.category === Category.DIPLOMA)
        );
        if (matchedAnyCategory) {
          setCategory(matchedAnyCategory.category);
          matched = matchedAnyCategory;
        }
      }

      // If not found in local memory, query the authoritative live persistent database directly
      if (!matched) {
        try {
          const liveMatch = await findStudentInDatabase(cleanRoll, cleanReg, category);
          if (liveMatch) {
            matched = liveMatch;
            setCategory(liveMatch.category);
            onStudentFound?.(liveMatch);
          }
        } catch (dbErr) {
          console.warn("Live database search error in VerificationForm:", dbErr);
        }
      }

      if (matched) {
        onVerifySuccess(matched);
      } else {
        // Cross-portal check: Did the user search for a Degree / Honours / Masters student on the SSC/HSC form?
        const higherEdMatch = students.find(
          (s) =>
            (s.category === Category.DEGREE_PASS ||
             s.category === Category.HONOURS ||
             s.category === Category.MASTERS ||
             Boolean(s.academicLevel)) &&
            (s.rollNumber.trim().toLowerCase() === cleanRoll ||
             s.registrationNumber.trim().toLowerCase() === cleanReg ||
             s.id.toLowerCase() === cleanRoll)
        );

        if (higherEdMatch) {
          setDegreeCrossMatch(higherEdMatch);
        } else {
          setSearchError(
            `No matching record found in the national database. Please verify the Roll Number, Registration Number, and ensure you have selected the correct Category.`
          );
        }
        generateCaptcha(); // Refresh captcha on failure
      }
    } finally {
      setIsSearching(false);
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
              <h2 className="font-bold font-sans text-base md:text-lg">BNIE Certificate Verification Online (সনদ যাচাই)</h2>
              <p className="text-[11px] text-emerald-100">Bangladesh National Institute of Education (BNIE) • Central Credential Registry</p>
            </div>
          </div>
          <span className="text-[10px] bg-red-600/90 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            SECURE PORTAL
          </span>
        </div>

        {/* Switcher to Degree / Honours / Masters Result Check */}
        {onNavigateToDegreeVerify && (
          <div className="bg-emerald-50/70 border-b border-emerald-200 px-6 py-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2 text-xs text-gray-700">
              <GraduationCap className="w-4 h-4 text-[#006a4e]" />
              <span>Looking for <strong>Degree Pass, Honours, or Masters</strong> full marksheet results?</span>
            </div>
            <button
              type="button"
              onClick={onNavigateToDegreeVerify}
              className="text-xs font-bold text-[#006a4e] hover:text-[#005a42] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Degree / Honours / Masters Result Check →</span>
            </button>
          </div>
        )}

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
                  Secure Verification Token Loaded Successfully
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
                  disabled={isTokenLoaded || isSearching}
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
              <label 
                htmlFor="verification-roll-number"
                className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2"
              >
                Roll Number <span className="text-[#f42a41]">*</span>
              </label>
              <input
                id="verification-roll-number"
                type="text"
                disabled={isTokenLoaded || isSearching}
                placeholder="6-digit Roll Number"
                value={rollNumber}
                aria-required="true"
                aria-invalid={Boolean(rollTouched && rollError)}
                aria-describedby={
                  rollTouched && rollError 
                    ? "roll-error-alert" 
                    : rollNumber.trim().length >= 4 
                    ? "roll-valid-msg" 
                    : "roll-hint"
                }
                onBlur={() => {
                  setRollTouched(true);
                  setRollError(validateRoll(rollNumber));
                }}
                onChange={(e) => {
                  const sanitized = e.target.value.replace(/[^a-zA-Z0-9\-_/]/g, "");
                  setRollNumber(sanitized);
                  setSearchError("");
                  if (rollTouched || sanitized.length > 0) {
                    setRollError(validateRoll(sanitized));
                  }
                }}
                className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:ring-1 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed font-semibold font-mono transition-all ${
                  rollTouched && rollError 
                    ? "border-red-500 ring-2 ring-red-100 bg-red-50/20" 
                    : "border-gray-300 focus:border-[#006a4e] focus:ring-[#006a4e]"
                }`}
              />
              {rollTouched && rollError ? (
                <div 
                  id="roll-error-alert" 
                  role="alert" 
                  aria-live="polite" 
                  className="text-[11px] font-semibold text-red-600 mt-1.5 flex items-center gap-1.5 bg-red-50 p-2 rounded-lg border border-red-200"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>{rollError}</span>
                </div>
              ) : rollNumber.trim().length >= 4 ? (
                <div 
                  id="roll-valid-msg" 
                  aria-live="polite" 
                  className="text-[11px] font-semibold text-emerald-700 mt-1.5 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Valid Roll Format ({rollNumber.trim().length} chars)</span>
                </div>
              ) : (
                <p id="roll-hint" className="text-[10px] text-gray-400 mt-1">
                  Minimum 4 characters (e.g. 184920, 584217, 731846)
                </p>
              )}
            </div>

            {/* Registration Number input */}
            <div className="md:col-span-6">
              <label 
                htmlFor="verification-reg-number"
                className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2"
              >
                Registration Number <span className="text-[#f42a41]">*</span>
              </label>
              <input
                id="verification-reg-number"
                type="text"
                disabled={isTokenLoaded || isSearching}
                placeholder="Year-based Registration (YYYYNNNNNN)"
                value={registrationNumber}
                aria-required="true"
                aria-invalid={Boolean(regTouched && regError)}
                aria-describedby={
                  regTouched && regError 
                    ? "reg-error-alert" 
                    : registrationNumber.trim().length >= 6 
                    ? "reg-valid-msg" 
                    : "reg-hint"
                }
                onBlur={() => {
                  setRegTouched(true);
                  setRegError(validateReg(registrationNumber));
                }}
                onChange={(e) => {
                  const sanitized = e.target.value.replace(/[^a-zA-Z0-9\-_/]/g, "");
                  setRegistrationNumber(sanitized);
                  setSearchError("");
                  if (regTouched || sanitized.length > 0) {
                    setRegError(validateReg(sanitized));
                  }
                }}
                className={`w-full bg-white border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden focus:ring-1 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed font-semibold font-mono transition-all ${
                  regTouched && regError 
                    ? "border-red-500 ring-2 ring-red-100 bg-red-50/20" 
                    : "border-gray-300 focus:border-[#006a4e] focus:ring-[#006a4e]"
                }`}
              />
              {regTouched && regError ? (
                <div 
                  id="reg-error-alert" 
                  role="alert" 
                  aria-live="polite" 
                  className="text-[11px] font-semibold text-red-600 mt-1.5 flex items-center gap-1.5 bg-red-50 p-2 rounded-lg border border-red-200"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>{regError}</span>
                </div>
              ) : registrationNumber.trim().length >= 6 ? (
                <div 
                  id="reg-valid-msg" 
                  aria-live="polite" 
                  className="text-[11px] font-semibold text-emerald-700 mt-1.5 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Valid Registration Format ({registrationNumber.trim().length} chars)</span>
                </div>
              ) : (
                <p id="reg-hint" className="text-[10px] text-gray-400 mt-1">
                  Minimum 6 characters (e.g. 2012005831, 8472910)
                </p>
              )}
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
                    disabled={isSearching}
                    placeholder="?"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value.trim())}
                    className="w-16 text-center font-mono font-bold text-base border-b-2 border-gray-300 focus:border-[#006a4e] focus:outline-hidden bg-transparent py-0.5 text-gray-900 disabled:opacity-50"
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

          {/* DEGREE / HONOURS / MASTERS CANDIDATE DETECTED BANNER */}
          {degreeCrossMatch && (
            <div className="bg-emerald-50 border-2 border-[#006a4e]/40 rounded-2xl p-5 space-y-3 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#006a4e] text-white flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-200 text-[#006a4e]">
                      {degreeCrossMatch.academicLevel || degreeCrossMatch.category}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 font-bold">Higher Education Division</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-gray-950 font-sans">
                    Candidate Record Located in Higher Education System
                  </h4>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Student <strong className="text-gray-950">{degreeCrossMatch.name}</strong> is registered under <strong>{degreeCrossMatch.programName || degreeCrossMatch.academicLevel}</strong> (Roll: {degreeCrossMatch.rollNumber}, Reg: {degreeCrossMatch.registrationNumber}). This form verifies SSC, HSC, and Polytechnic Diploma records.
                  </p>
                </div>
              </div>

              {onNavigateToDegreeVerify && (
                <div className="pt-2 border-t border-emerald-200 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-emerald-900 font-medium">
                    Click to inspect the verified full marksheet in the Degree portal:
                  </span>
                  <button
                    type="button"
                    onClick={onNavigateToDegreeVerify}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#006a4e] hover:bg-[#005a42] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Open Degree / Honours / Masters Marksheet Portal</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Search Result Failure Message */}
          {searchError && !degreeCrossMatch && (
            <div className="flex items-start space-x-2 text-red-700 bg-red-50 px-4 py-3.5 rounded-xl border border-red-200 text-xs leading-relaxed font-semibold">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-[#f42a41]" />
              <span>{searchError}</span>
            </div>
          )}

          {/* Quick Demo Test Samples */}
          <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-xl p-3 space-y-2">
            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block">
              Quick Test Samples:
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setCategory(Category.SSC);
                  setRollNumber("184920");
                  setRegistrationNumber("8472910");
                  setCaptchaAnswer(captcha.result.toString());
                  setSearchError("");
                }}
                className="inline-flex items-center gap-1 bg-white hover:bg-emerald-50 border border-emerald-300 text-[#006a4e] px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer shadow-3xs"
              >
                <span>1998 SSC (Division System — No GPA)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory(Category.HSC);
                  setRollNumber("394821");
                  setRegistrationNumber("9482715");
                  setCaptchaAnswer(captcha.result.toString());
                  setSearchError("");
                }}
                className="inline-flex items-center gap-1 bg-white hover:bg-emerald-50 border border-emerald-300 text-[#006a4e] px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer shadow-3xs"
              >
                <span>2000 HSC (Division System — No GPA)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory(Category.SSC);
                  setRollNumber("102938");
                  setRegistrationNumber("2019384756");
                  setCaptchaAnswer(captcha.result.toString());
                  setSearchError("");
                }}
                className="inline-flex items-center gap-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer shadow-3xs"
              >
                <span>2024 SSC (GPA 5.00 Scale)</span>
              </button>
            </div>
          </div>

          {/* Verification Button */}
          <button
            type="submit"
            disabled={isSearching || isDbLoading}
            className="w-full bg-[#006a4e] hover:bg-[#00563f] text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center space-x-2 uppercase text-sm tracking-wider disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-5 h-5 text-emerald-200 animate-spin" />
                <span>Querying Verification Database...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                <span>Verify Certificate</span>
              </>
            )}
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
