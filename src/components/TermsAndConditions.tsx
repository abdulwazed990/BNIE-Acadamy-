import { FileText, ShieldAlert, Scale, CheckCircle2, ArrowLeft, AlertTriangle, Building2 } from "lucide-react";

interface TermsAndConditionsProps {
  onBackToHome: () => void;
  onNavigateToVerify?: () => void;
}

export default function TermsAndConditions({ onBackToHome, onNavigateToVerify }: TermsAndConditionsProps) {
  return (
    <div className="py-10 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Top Breadcrumb / Return to Home */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-150 pb-4">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Home Portal</span>
        </button>
        <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
          Document Ref: BNIE-TERMS-2026-V1
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-gray-50 via-slate-50 to-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <div className="p-3 bg-[#006a4e]/10 text-[#006a4e] rounded-xl border border-[#006a4e]/20">
            <Scale className="w-8 h-8 stroke-[2]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#006a4e] text-white mb-1.5">
              Institutional Framework
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Terms &amp; Conditions of Service
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Bangladesh National Institute of Education (BNIE) — Official Registry &amp; Verification Rules
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-200/80">
          <span>Effective Date: <strong>January 1, 2024</strong></span>
          <span>•</span>
          <span>Regulatory Revision: <strong>September 2026</strong></span>
          <span>•</span>
          <span className="text-[#006a4e] font-semibold">Authorized Public Registry</span>
        </div>
      </div>

      {/* Terms Sections */}
      <div className="space-y-8 text-gray-700 leading-relaxed text-sm">
        {/* Section 1 */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs space-y-3">
          <div className="flex items-center gap-2.5 text-gray-900 font-bold text-base">
            <FileText className="w-5 h-5 text-[#006a4e]" />
            <h2>1. Acceptance of Terms &amp; Public Access</h2>
          </div>
          <p className="text-gray-650">
            By accessing or using the <strong>Bangladesh National Institute of Education (BNIE)</strong> online portal, credential verification engine, or student records databases, you unequivocally agree to be bound by these official Terms and Conditions. If you do not agree to these terms, you are not authorized to use the verification portal.
          </p>
          <p className="text-gray-650">
            This system is maintained for verified academic credential validation on behalf of students, accredited institutions, employers, recruitment authorities, and governmental departments.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 text-gray-900 font-bold text-base">
            <CheckCircle2 className="w-5 h-5 text-[#006a4e]" />
            <h2>2. Credential Authenticity &amp; Verification Procedures</h2>
          </div>
          <p className="text-gray-650">
            All certificates, marksheets, and registration records presented through the BNIE Verification System correspond strictly to the official institutional database ledgers.
          </p>
          <div className="space-y-2.5 text-xs text-gray-650">
            <div className="p-3 bg-gray-50 border border-gray-150 rounded-lg">
              <strong className="text-gray-900 block mb-1">Dual-Factor Verification Requirement</strong>
              Public query of any candidate record requires providing BOTH the valid Roll Number and Registration Number associated with the candidate’s official file.
            </div>
            <div className="p-3 bg-gray-50 border border-gray-150 rounded-lg">
              <strong className="text-gray-900 block mb-1">Cryptographic QR Verification</strong>
              QR codes printed on authorized certificates directly link to the verified cloud database token. Any disparity between the printed document and the digital ledger designates the digital record as definitive.
            </div>
            <div className="p-3 bg-gray-50 border border-gray-150 rounded-lg">
              <strong className="text-gray-900 block mb-1">Official Scale Standards</strong>
              Grading parameters strictly follow the national educational standard: Scale 5.00 for SSC/HSC groups and Scale 4.00 for Polytechnic Diploma programs (e.g. Electrical &amp; Electronics Engineering, Air Condition and Maintenance 2-Year Diploma).
            </div>
          </div>
        </section>

        {/* Section 3 - Legal warning / Anti-forgery */}
        <section className="bg-red-50/50 border border-red-200 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-red-800 font-bold text-base">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <h2>3. Anti-Forgery &amp; Penal Liability Warning</h2>
          </div>
          <p className="text-xs sm:text-sm text-red-950 font-medium">
            Strict warning under the Penal Code and ICT Laws of the People’s Republic of Bangladesh:
          </p>
          <div className="bg-white p-4 rounded-lg border border-red-200 text-xs text-gray-700 space-y-2">
            <p>
              Any attempt to <strong>forge, alter, duplicate, reproduce, or fraudulently present</strong> an educational certificate, mark sheet, or online verification result without express authorization constitutes a criminal offense under national forgery and cyber-crime laws.
            </p>
            <p className="font-semibold text-red-900">
              Violators are subject to prosecution, criminal penalties, imprisonment, and immediate revocation of any institutional credentials.
            </p>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs space-y-3">
          <div className="flex items-center gap-2.5 text-gray-900 font-bold text-base">
            <Building2 className="w-5 h-5 text-[#006a4e]" />
            <h2>4. Permitted Use for Employers &amp; Higher Education</h2>
          </div>
          <p className="text-gray-650">
            Corporations, recruitment agencies, foreign embassies, and universities may utilize the verification system free of charge for genuine employment screening or academic admission checks. Bulk or automated web scraping without written administrative consent is strictly prohibited.
          </p>
        </section>

        {/* Section 5 */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs space-y-3">
          <div className="flex items-center gap-2.5 text-gray-900 font-bold text-base">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2>5. Service Availability &amp; Disclaimer</h2>
          </div>
          <p className="text-gray-650">
            While BNIE endeavors to maintain 99.9% uptime of the verification cloud registry, temporary maintenance downtimes may occur. In the event of system downtime or discrepancy inquiries, official physical verifications may be requested directly from the BNIE Controller of Examinations.
          </p>
        </section>

        {/* Contact section */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-gray-900">Have legal or verification questions?</p>
            <p className="text-xs text-gray-600">Contact the Legal &amp; Registration Division at BNIE Dhaka.</p>
            <p className="text-xs text-[#006a4e] font-semibold mt-0.5">bnieeducationbd@gmail.com</p>
          </div>
          {onNavigateToVerify && (
            <button
              onClick={onNavigateToVerify}
              className="px-4 py-2 bg-[#006a4e] hover:bg-[#005a42] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Go to Verify Certificate
            </button>
          )}
        </div>
      </div>

      {/* Bottom return link */}
      <div className="mt-10 text-center">
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
