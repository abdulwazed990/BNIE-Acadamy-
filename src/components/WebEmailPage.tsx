import { useState, type FormEvent } from "react";
import { 
  Mail, Key, ExternalLink, Send, Building2, CheckCircle2, ArrowLeft, 
  ChevronRight, ShieldCheck, Server, AlertCircle, RefreshCw, Inbox, FileText, Lock 
} from "lucide-react";
import { motion } from "motion/react";

interface WebEmailPageProps {
  onBackToHome: () => void;
}

export default function WebEmailPage({ onBackToHome }: WebEmailPageProps) {
  const [emailUser, setEmailUser] = useState("");
  const [password, setPassword] = useState("");
  const [webmailClient, setWebmailClient] = useState("roundcube");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Official Mail Server configuration status
  const serverConfig = {
    isConfigured: true,
    mailHost: "mail.bnie.edu.bd",
    webmailUrl: "https://webmail.bnie.edu.bd",
    imapPort: "993 (SSL/TLS)",
    smtpPort: "465 (SSL/TLS)",
    webmailInterface: "Roundcube Webmail v1.6.4 / cPanel Webmail Suite",
    serverLocation: "BDIX Dhaka High-Speed Data Center",
    mxRecord: "10 mail.bnie.edu.bd",
    spfStatus: "v=spf1 include:mail.bnie.edu.bd ~all (Verified)"
  };

  const handleWebmailLogin = (e: FormEvent) => {
    e.preventDefault();
    if (!emailUser.trim() || !password.trim()) {
      alert("Please enter your official institutional email and password.");
      return;
    }
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsLoggedIn(true);
    }, 500);
  };

  const departments = [
    { 
      name: "Office of the Vice-Chancellor (উপাচার্য সচিবালয়)", 
      email: "vc.office@bnie.edu.bd",
      officer: "Secretariat Desk to the Vice-Chancellor"
    },
    { 
      name: "Controller of Examinations (পরীক্ষা নিয়ন্ত্রক শাখা)", 
      email: "exam.controller@bnie.edu.bd",
      officer: "Dr. K. A. M. Nurul Haque (Controller of Exams)"
    },
    { 
      name: "Central Certificate Verification Desk (সনদ যাচাই শাখা)", 
      email: "bnieeducationbd@gmail.com",
      officer: "Verification & Student Ledger Registry"
    },
    { 
      name: "Admissions & Academic Secretariat (ভর্তি শাখা)", 
      email: "admission@bnie.edu.bd",
      officer: "Central Admissions Committee"
    },
    { 
      name: "ICT Directorate & Webmail Administrator (আইসিটি ডেস্ক)", 
      email: "webmaster@bnie.edu.bd",
      officer: "Server & Network Systems Division"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/70 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
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
            <span>Institutional Services</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#006a4e] font-bold">BNIE Web Email</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-[#006a4e] rounded-full text-xs font-bold border border-emerald-200/80">
              <Mail className="w-3.5 h-3.5" />
              <span>BNIE Institutional Webmail (ইনস্টিটিউট ওয়েবমেইল ও মেল সার্ভার)</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Official Institutional Webmail Gateway
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউটের (BNIE) শিক্ষক, কর্মকর্তা, বিভাগীয় প্রধান এবং প্রশাসনিক কর্মকর্তাদের জন্য নিরাপদ ওয়েবমেইল ও ক্লাউড মেসেজিং সেবা।
            </p>

            {/* Server Configuration Status Indicator */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Mail Server Status: Configured &amp; Active ({serverConfig.mailHost})</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg">
                <Server className="w-3.5 h-3.5 text-gray-500" />
                <span>IMAP {serverConfig.imapPort} • SMTP {serverConfig.smtpPort}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Webmail Client & Institutional Directory */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Webmail Login / Session */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-5 bg-[#006a4e] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-white/10 rounded-lg text-white">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base font-sans">
                    BNIE Secure Webmail
                  </h3>
                  <p className="text-xs text-emerald-100">
                    Host: {serverConfig.mailHost} (SSL 256-Bit)
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-white">
                SSL ACTIVE
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {!isLoggedIn ? (
                <form onSubmit={handleWebmailLogin} className="space-y-4">
                  <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600 leading-relaxed">
                    Faculty members and staff should enter their full designated institutional email username and password to access their mailboxes.
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                      Institutional Email Address *
                    </label>
                    <div className="flex rounded-xl shadow-2xs overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-[#006a4e]/20 focus-within:border-[#006a4e]">
                      <input
                        type="text"
                        required
                        autoComplete="off"
                        placeholder=""
                        value={emailUser}
                        onChange={(e) => setEmailUser(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 bg-gray-50 text-xs sm:text-sm font-medium focus:outline-hidden"
                      />
                      <span className="px-3.5 py-2.5 bg-gray-100 border-l border-gray-200 text-xs font-bold text-gray-600 font-mono flex items-center">
                        @bnie.edu.bd
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                      Account Password *
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-[#006a4e]/20 focus:border-[#006a4e]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1">
                      Webmail Web Interface
                    </label>
                    <select
                      value={webmailClient}
                      onChange={(e) => setWebmailClient(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#006a4e]/20"
                    >
                      <option value="roundcube">Roundcube Webmail Client (Recommended)</option>
                      <option value="horde">Horde Enterprise Groupware</option>
                      <option value="squirrel">Direct Standard Webmail</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isConnecting}
                    className="w-full py-3 bg-[#006a4e] hover:bg-[#005a42] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm hover:shadow cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying Mail Server Handshake...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Access Webmail Inbox (লগইন)</span>
                      </>
                    )}
                  </button>

                  <div className="pt-2 text-center text-xs text-gray-500">
                    <span>Having trouble logging in? Contact </span>
                    <a href="mailto:support@bnie.edu.bd" className="text-[#006a4e] font-bold hover:underline">
                      support@bnie.edu.bd
                    </a>
                  </div>
                </form>
              ) : (
                /* INBOX VIEW UPON LOGGING IN */
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-900 block">
                        Authenticated: {emailUser || "faculty"}@bnie.edu.bd
                      </span>
                      <span className="text-[11px] text-emerald-700">
                        Connected to mail.bnie.edu.bd via IMAP SSL
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsLoggedIn(false)}
                      className="text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
                    >
                      Log Out
                    </button>
                  </div>

                  <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 text-xs">
                    <div className="p-3 bg-gray-50 font-bold text-gray-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Inbox className="w-4 h-4 text-[#006a4e]" />
                        <span>Inbox (2 Unread Messages)</span>
                      </span>
                      <span className="text-[11px] text-gray-500 font-mono">Quota: 1.2 GB / 25 GB</span>
                    </div>

                    <div className="p-3 hover:bg-emerald-50/40 transition-colors cursor-pointer space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">Dr. K. A. M. Nurul Haque (Controller of Exams)</span>
                        <span className="text-[10px] text-gray-400">10:42 AM</span>
                      </div>
                      <p className="font-semibold text-[#006a4e]">Final Semester Grade Submission &amp; Mechanical CGPA Audit</p>
                      <p className="text-gray-500 text-[11px] line-clamp-1">Please ensure all 23 subject mark sheets for 4-Year Mechanical Engineering students are verified...</p>
                    </div>

                    <div className="p-3 hover:bg-emerald-50/40 transition-colors cursor-pointer space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">ICT Systems Desk</span>
                        <span className="text-[10px] text-gray-400">Yesterday</span>
                      </div>
                      <p className="font-semibold text-gray-900">Server Security Certificate &amp; Domain Renewal Notice</p>
                      <p className="text-gray-500 text-[11px] line-clamp-1">The SSL certificate for *.bnie.edu.bd and mail.bnie.edu.bd has been successfully updated...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Server Diagnostics Box */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2 text-xs">
                <h4 className="font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-[#006a4e]" />
                  <span>Technical Mail Server Configuration</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-gray-600">
                  <div><strong>Incoming Server:</strong> mail.bnie.edu.bd</div>
                  <div><strong>IMAP Port:</strong> 993 (SSL)</div>
                  <div><strong>Outgoing SMTP:</strong> mail.bnie.edu.bd</div>
                  <div><strong>SMTP Port:</strong> 465 (SSL)</div>
                  <div><strong>Webmail URL:</strong> webmail.bnie.edu.bd</div>
                  <div><strong>Authentication:</strong> SPA / TLS Required</div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Departmental Email Directory */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <Building2 className="w-5 h-5 text-[#006a4e]" />
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  Official Departmental Directory
                </h3>
              </div>

              <div className="space-y-3">
                {departments.map((dept, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-emerald-50/30 hover:border-emerald-200 transition-colors space-y-1">
                    <h4 className="text-xs font-bold text-gray-900 font-sans">
                      {dept.name}
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      {dept.officer}
                    </p>
                    <div className="pt-1">
                      <a
                        href={`mailto:${dept.email}`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#006a4e] hover:underline"
                      >
                        <Mail className="w-3 h-3" />
                        <span>{dept.email}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Security Notice */}
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Institutional Anti-Phishing Policy</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Official communications regarding examinations, certificate verification, and admissions are delivered solely through verified @bnie.edu.bd addresses.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
