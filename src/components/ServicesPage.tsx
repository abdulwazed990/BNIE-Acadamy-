import { ShieldCheck, BookOpen, Award, FileCheck2, Landmark, HelpCircle, ArrowLeft, ArrowRight, CheckCircle2, Clock, FileText, Send } from "lucide-react";

interface ServicesPageProps {
  onBackToHome: () => void;
  onNavigateToVerify: () => void;
  onNavigateToCourses: () => void;
  onNavigateToSpecializations: () => void;
  onNavigateToHelp: () => void;
}

export default function ServicesPage({
  onBackToHome,
  onNavigateToVerify,
  onNavigateToCourses,
  onNavigateToSpecializations,
  onNavigateToHelp,
}: ServicesPageProps) {
  const SERVICES_LIST = [
    {
      id: "verification",
      title: "Online Certificate Verification Service",
      bengaliTitle: "অনলাইন সার্টিফিকেট যাচাইকরণ সেবা",
      icon: ShieldCheck,
      badge: "Public & Instant",
      description:
        "Centralized digital verification for SSC, HSC, Vocational, and Diploma certificates. Provides instantaneous authentication against institutional ledgers for corporate recruiters, educational institutes, and foreign embassies.",
      features: [
        "Instant dual-factor validation (Roll & Registration Number)",
        "Cryptographic QR code integration on printed documents",
        "Official subject-wise marksheet & GPA transcript view",
        "Tamper-proof digital ledger backed by secure cloud storage"
      ],
      actionText: "Verify Certificate Now",
      action: onNavigateToVerify,
      primaryAction: true
    },
    {
      id: "diploma-programs",
      title: "2-Year & 1-Year Polytechnic Diploma Programs",
      bengaliTitle: "ডিপ্লোমা ইঞ্জিনিয়ারিং ও ভোকেশনাল কারিকুলাম",
      icon: BookOpen,
      badge: "Technical Engineering",
      description:
        "Accredited professional and technical diploma curriculums designed to train competent technicians in high-demand industry domains including HVAC, Electrical, Civil, and Mechanical technologies.",
      features: [
        "Air Condition and Maintenance (2-Year Diploma — 13 technical subjects)",
        "Electrical & Electronics Engineering (Code 667)",
        "Industry-aligned practical workshops and laboratory training",
        "Scale 4.00 transcript certification recognized for employment"
      ],
      actionText: "Browse Diploma Courses",
      action: onNavigateToCourses,
      primaryAction: false
    },
    {
      id: "vocational-groups",
      title: "Secondary & Higher Secondary Vocational Groups",
      bengaliTitle: "এসএসসি ও এইচএসসি সমমানের কোর্সসমূহ",
      icon: Award,
      badge: "Scale 5.00",
      description:
        "Curated academic curriculums corresponding to national board standards across Science, Business Studies, Humanities, and Technical Vocational trades.",
      features: [
        "Curriculum matching national secondary education benchmarks",
        "Scale 5.00 GPA evaluation and subject-wise grade sheets",
        "Religion and optional subject configurations (Islam, Hindu, Buddhist, Christian)",
        "Official government recognized certification"
      ],
      actionText: "View SSC/HSC Groups",
      action: onNavigateToSpecializations,
      primaryAction: false
    },
    {
      id: "transcript-issuance",
      title: "Official Academic Transcripts & Attestation",
      bengaliTitle: "অফিসিয়াল একাডেমিক ট্রান্সক্রিপ্ট ও সত্যায়ন",
      icon: FileCheck2,
      badge: "Embassy / WES",
      description:
        "Issuance of official sealed transcripts, English proficiency statements, and verification letters tailored for foreign university admissions, WES evaluation, and embassy visa processing.",
      features: [
        "Sealed confidential transcript copies for international universities",
        "Direct verification liaison for global credential evaluators",
        "English format certified grade statements",
        "Courier delivery options across Bangladesh and overseas"
      ],
      actionText: "Request Transcript Assistance",
      action: onNavigateToHelp,
      primaryAction: false
    },
    {
      id: "duplicate-certificate",
      title: "Duplicate Certificate & Mark Sheet Issuance",
      bengaliTitle: "ডুপ্লিকেট সার্টিফিকেট ও মার্কশিট সেবা",
      icon: FileText,
      badge: "Lost & Damaged Records",
      description:
        "Expedited administrative replacement for lost, destroyed, or damaged certificates and mark sheets with official endorsement.",
      features: [
        "Police GD and newspaper cutting verification workflow",
        "Certified reissue with official seal and signature",
        "Typographical data correction (spelling, parent name, session)",
        "Standard processing timeline within 7–10 working days"
      ],
      actionText: "Apply via Help Center",
      action: onNavigateToHelp,
      primaryAction: false
    },
    {
      id: "institutional-screening",
      title: "Institutional & Bulk Verification Desk",
      bengaliTitle: "প্রতিষ্ঠানিক ও কর্পোরেট যাচাইকরণ ডেস্ক",
      icon: Landmark,
      badge: "Corporate & Govt",
      description:
        "Specialized verification channel for government ministries, human resource divisions, overseas recruitment agencies, and background screening firms.",
      features: [
        "Priority batch processing for multi-candidate verification",
        "Official institutional verification dispatch letters",
        "Dedicated verification liaison officer",
        "Direct email authentication via bnieeducationbd@gmail.com"
      ],
      actionText: "Contact Institutional Desk",
      action: onNavigateToHelp,
      primaryAction: false
    }
  ];

  return (
    <div className="py-10 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Top Breadcrumb */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-150 pb-4">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Home Portal</span>
        </button>
        <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
          BNIE Official Services Registry
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#006a4e]/10 via-emerald-50/40 to-white border border-[#006a4e]/20 rounded-2xl p-6 sm:p-10 mb-10 shadow-2xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#006a4e] text-white mb-3">
            National Educational Services
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight">
            Institutional Services &amp; Educational Registry
          </h1>
          <p className="text-xs sm:text-sm text-gray-650 mt-2 leading-relaxed">
            The Bangladesh National Institute of Education provides a comprehensive suite of academic validation, technical training certification, and student record administration services nationwide.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {SERVICES_LIST.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-[#006a4e]/10 text-[#006a4e]">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md">
                    {service.badge}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-gray-900 leading-snug">
                  {service.title}
                </h2>
                <p className="text-xs text-[#006a4e] font-medium mt-0.5 mb-3">
                  {service.bengaliTitle}
                </p>

                <p className="text-xs text-gray-650 leading-relaxed mb-4">
                  {service.description}
                </p>

                <div className="space-y-2 mb-6 border-t border-gray-100 pt-3">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#006a4e] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={service.action}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    service.primaryAction
                      ? "bg-[#006a4e] hover:bg-[#005a42] text-white shadow-sm"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200"
                  }`}
                >
                  <span>{service.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Operational Highlights */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-2xl font-black text-[#006a4e]">100% Digital</p>
            <p className="text-xs font-bold text-gray-900">Instant Verification</p>
            <p className="text-[11px] text-gray-500">Accessible 24/7 globally without login barrier</p>
          </div>
          <div className="space-y-1 sm:border-x sm:border-gray-200 sm:px-4">
            <p className="text-2xl font-black text-[#006a4e]">Scale 5.00 &amp; 4.00</p>
            <p className="text-xs font-bold text-gray-900">National Standard Transcript</p>
            <p className="text-[11px] text-gray-500">Dual grading scale support for SSC, HSC &amp; Diploma</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-black text-[#006a4e]">Anti-Forgery</p>
            <p className="text-xs font-bold text-gray-900">Cryptographic QR Validation</p>
            <p className="text-[11px] text-gray-500">Secured against falsification under Bangladesh law</p>
          </div>
        </div>
      </div>

      {/* Bottom return link */}
      <div className="text-center">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Portal</span>
        </button>
      </div>
    </div>
  );
}
