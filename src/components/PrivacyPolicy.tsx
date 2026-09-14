import { ShieldCheck, Lock, FileText, CheckCircle2, ArrowLeft, Mail, AlertCircle, Database } from "lucide-react";
import Logo from "./Logo";

interface PrivacyPolicyProps {
  onBackToHome: () => void;
  onNavigateToContact?: () => void;
}

export default function PrivacyPolicy({ onBackToHome }: PrivacyPolicyProps) {
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
          Document Ref: BNIE-POL-2026-V1
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-gray-50 via-emerald-50/20 to-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
          <div className="p-3 bg-[#006a4e]/10 text-[#006a4e] rounded-xl border border-[#006a4e]/20">
            <ShieldCheck className="w-8 h-8 stroke-[2]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#006a4e] text-white mb-1.5">
              Official Regulatory Policy
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Privacy &amp; Data Protection Policy
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Bangladesh National Institute of Education (BNIE) — Educational Records Registry
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-200/80">
          <span>Effective Date: <strong>January 1, 2024</strong></span>
          <span>•</span>
          <span>Last Reviewed: <strong>September 2026</strong></span>
          <span>•</span>
          <span className="text-[#006a4e] font-semibold">Government Certified Verification System</span>
        </div>
      </div>

      {/* Policy Content Sections */}
      <div className="space-y-8 text-gray-700 leading-relaxed text-sm">
        {/* Section 1 */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs space-y-3">
          <div className="flex items-center gap-2.5 text-gray-900 font-bold text-base">
            <FileText className="w-5 h-5 text-[#006a4e]" />
            <h2>1. Institutional Mandate &amp; Scope</h2>
          </div>
          <p className="text-gray-650">
            The <strong>Bangladesh National Institute of Education (BNIE)</strong> operates this centralized digital registry under regulatory educational frameworks to validate SSC, HSC, Vocational, and Polytechnic Diploma certificates. We are strictly committed to safeguarding the privacy, integrity, and authenticity of all student records and public verification interactions.
          </p>
          <p className="text-gray-650">
            This Privacy Policy explains the nature of personal and academic data held in the BNIE registry, the methods by which information is verified, and the robust security protocols enforced to prevent unauthorized alterations or data breaches.
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 text-gray-900 font-bold text-base">
            <Database className="w-5 h-5 text-[#006a4e]" />
            <h2>2. Information Stored in the Central Registry</h2>
          </div>
          <p className="text-gray-650">
            To provide legally recognized academic certification and employer verification, BNIE archives the following student parameters:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="bg-gray-50 border border-gray-150 p-3.5 rounded-lg">
              <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#006a4e]" /> Candidate Identity
              </h3>
              <p className="text-xs text-gray-600">
                Full legal name, father’s name, mother’s name, date of birth, biometric/passport photo, and unique Roll/Registration numbers.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-150 p-3.5 rounded-lg">
              <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#006a4e]" /> Academic Transcripts
              </h3>
              <p className="text-xs text-gray-600">
                Course streams, educational sessions, passing years, GPA/CGPA scores, and subject-wise grades with letter evaluations.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-150 p-3.5 rounded-lg">
              <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#006a4e]" /> Institutional Credentials
              </h3>
              <p className="text-xs text-gray-600">
                Enrolled institute/polytechnic name, center code, certificate serial numbers, and administrative issue dates.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-150 p-3.5 rounded-lg">
              <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#006a4e]" /> Verification Audit Trail
              </h3>
              <p className="text-xs text-gray-600">
                Timestamps of verification inquiries, unique token references, and QR-scan validation hashes for fraud deterrence.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs space-y-3">
          <div className="flex items-center gap-2.5 text-gray-900 font-bold text-base">
            <Lock className="w-5 h-5 text-[#006a4e]" />
            <h2>3. Purpose of Processing &amp; Verification Protocol</h2>
          </div>
          <p className="text-gray-650">
            Information preserved in this system is utilized exclusively for:
          </p>
          <ul className="space-y-2 text-xs text-gray-650 pl-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006a4e] mt-1.5 shrink-0" />
              <span><strong>Instant Credential Verification:</strong> Allowing domestic and overseas employers, higher educational institutions, and government bodies to confirm certificate validity using Roll and Registration pairs.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006a4e] mt-1.5 shrink-0" />
              <span><strong>Anti-Forgery Validation:</strong> Eliminating counterfeit paper certificates by providing an authoritative, tamper-proof online ledger.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006a4e] mt-1.5 shrink-0" />
              <span><strong>Official Transcript Issuance:</strong> Facilitating duplicate certificate generation and academic status confirmation upon verified candidate request.</span>
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs space-y-3">
          <div className="flex items-center gap-2.5 text-gray-900 font-bold text-base">
            <AlertCircle className="w-5 h-5 text-[#006a4e]" />
            <h2>4. Third-Party Disclosure &amp; Data Security</h2>
          </div>
          <p className="text-gray-650">
            BNIE does <strong>not sell, lease, or commercially distribute</strong> any student personal data. Academic transcripts are disclosed strictly through two-factor lookup criteria (requiring the exact matching combination of Roll and Registration Number) or an authenticated QR verification token.
          </p>
          <p className="text-gray-650">
            Our cloud architecture employs enterprise-grade cryptographic encryption, HTTPS transport security, and continuous security auditing to safeguard academic records against unauthorized tampering.
          </p>
        </section>

        {/* Section 5 */}
        <section className="bg-emerald-50/40 border border-emerald-200 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-gray-900 font-bold text-base">
            <Mail className="w-5 h-5 text-[#006a4e]" />
            <h2>5. Candidate Rights &amp; Data Officer Contact</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-750">
            Registered candidates maintain the right to inspect their academic record, request corrections of typographical errors in names or dates of birth, and request certified duplicate transcripts. For any data protection inquiries or record amendments, contact our regulatory desk:
          </p>
          <div className="bg-white p-4 rounded-lg border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-bold text-gray-900">BNIE Records &amp; Data Protection Officer</p>
              <p className="text-gray-600">Administrative Headquarters, Dhaka, Bangladesh</p>
              <p className="text-[#006a4e] font-semibold mt-1">bnieeducationbd@gmail.com</p>
            </div>
            <a
              href="mailto:bnieeducationbd@gmail.com"
              className="px-4 py-2 bg-[#006a4e] hover:bg-[#005a42] text-white font-bold rounded-lg transition-colors cursor-pointer text-center"
            >
              Contact Data Officer
            </a>
          </div>
        </section>
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
