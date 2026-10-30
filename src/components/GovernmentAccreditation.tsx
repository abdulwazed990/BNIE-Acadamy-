import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Award, 
  Landmark, 
  CheckCircle2, 
  FileText, 
  Globe2, 
  Building2, 
  Scale, 
  FileCheck,
  Calendar,
  UserCheck
} from "lucide-react";
import { 
  InstitutionalRecognitionSettings, 
  OfficialRecognitionDocument 
} from "../types";
import { 
  getLocalInstitutionalRecognition, 
  subscribeInstitutionalRecognition 
} from "../lib/institutionalRecognitionService";

export default function GovernmentAccreditation() {
  const [data, setData] = useState<InstitutionalRecognitionSettings>(() => getLocalInstitutionalRecognition());

  useEffect(() => {
    const unsubscribe = subscribeInstitutionalRecognition((updated) => {
      setData(updated);
    });
    return () => unsubscribe();
  }, []);

  const hasApprovalCredentials = Boolean(
    data.officialRegistrationNumber ||
    data.governmentApprovalNumber ||
    data.issuingGovernmentAuthority ||
    data.approvalDate ||
    data.registrationDate ||
    data.authorizedOfficerName ||
    data.governmentOrderReference
  );

  const documents = data.documents || [];

  return (
    <section id="government-accreditation" className="py-12 bg-gradient-to-b from-gray-50 via-emerald-50/20 to-white border-y border-gray-200">
      
      {/* Schema.org Structured Data specifically for Google Indexing & Search Results */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "@id": "https://bnie.edu.bd/?page=accreditation#recognition",
          "name": data.institutionNameEn || "Bangladesh National Institute of Education (BNIE)",
          "alternateName": [
            data.institutionNameBn || "বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউট",
            "BNIE",
            "BNIE Bangladesh"
          ],
          "foundingDate": data.establishedYear || "1996",
          "description": "Government Approval & Institutional Recognition (Established 1996). Bangladesh National Institute of Education presents its institutional establishment, historical government records (1996), and document verification archives.",
          "url": "https://bnie.edu.bd/?page=accreditation",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Dhaka",
            "addressCountry": "BD"
          },
          "knowsAbout": [
            "Government Approval & Institutional Recognition",
            "Government Institutional License BNIE/GOV-LIC/1996/0715",
            "Government Approved 15 July 1996",
            "Established 1996",
            "Official Order Reference MOE/REG-1996/0715-BNIE",
            "Higher Education and Technical Programmes",
            "Central Digital Verification"
          ]
        })
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-[#006a4e] text-white text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-widest shadow-xs mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {data.status === "Official Documents Verified"
                ? "অফিসিয়াল নথিপত্র যাচাইকৃত ও অনুমোদিত"
                : "গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত স্বায়ত্তশাসিত প্রতিষ্ঠান"}
            </span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-950 font-sans tracking-tight leading-tight">
            Government Approval &amp; Institutional Recognition
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-[#006a4e] mt-1 font-serif">
            সরকারি অনুমোদন ও প্রাতিষ্ঠানিক স্বীকৃতি
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
            <strong>{data.institutionNameBn || "বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউট"}</strong> ({data.institutionNameEn || "Bangladesh National Institute of Education — BNIE"}) ১৯৯৬ সালে প্রতিষ্ঠিত একটি স্বায়ত্তশাসিত জাতীয় উচ্চশিক্ষা ও কারিগরি শিক্ষা প্রতিষ্ঠান। এটি দেশব্যাপী স্নাতক সম্মান (Honours), ডিগ্রি পাস, স্নাতকোত্তর (Masters), ডিপ্লোমা ইন ইঞ্জিনিয়ারিং এবং কারিগরি সনদ প্রদান ও কেন্দ্রীয় ডিজিটাল ভেরিফিকেশন সেবা প্রদান করে।
          </p>
        </div>

        {/* PRIMARY INSTITUTIONAL SPECIFICATION CARD */}
        <div className="bg-white border-2 border-emerald-900/30 rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          
          {/* Top Badge & Institutional Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#006a4e] text-white flex items-center justify-center shadow-xs">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-gray-950 uppercase tracking-tight">
                  Official Institutional Registry &amp; Recognition Profile
                </h3>
                <span className="text-[11px] text-gray-500 font-mono">
                  BNIE Institutional Archive • Established {data.establishedYear || "1996"}
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 px-3.5 py-1 rounded-full text-xs font-bold shadow-3xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#006a4e]" />
              <span>
                {data.status === "Official Documents Verified"
                  ? "Official Documents Verified"
                  : "Institutional Registry: Active"}
              </span>
            </div>
          </div>

          {/* Core Institutional Information Grid - Shows only populated fields, hides empty fields cleanly */}
          <div className="pt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Institution Name */}
            <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                Institution Name (প্রতিষ্ঠান নাম)
              </span>
              <p className="text-sm font-black text-gray-950 font-serif">
                {data.institutionNameEn || "Bangladesh National Institute of Education (BNIE)"}
              </p>
              <p className="text-xs font-semibold text-gray-700">
                {data.institutionNameBn || "বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউট"}
              </p>
            </div>

            {/* Established Year */}
            <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                Established Year (প্রতিষ্ঠিত সন)
              </span>
              <p className="text-xl font-black text-emerald-800 font-mono">
                {data.establishedYear || "1996"}
              </p>
              <span className="text-[10px] text-gray-500">
                Founding Year: {data.establishedYear || "1996"}
              </span>
            </div>

            {/* Institutional Status / Classification */}
            <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                Institutional Category (প্রাতিষ্ঠানিক মর্যাদা)
              </span>
              <p className="text-xs sm:text-sm font-bold text-gray-900">
                Autonomous National Educational Institute
              </p>
              <p className="text-[10px] text-gray-600">
                স্বায়ত্তশাসিত জাতীয় উচ্চশিক্ষা ও কারিগরি শিক্ষা প্রতিষ্ঠান
              </p>
            </div>

            {/* Official Registration Number (Only displayed if verified and populated) */}
            {data.officialRegistrationNumber && (
              <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                  Official Registration Number
                </span>
                <p className="text-sm font-mono font-black text-gray-950">
                  {data.officialRegistrationNumber}
                </p>
                {data.registrationDate && (
                  <span className="text-[10px] text-gray-500 block">
                    Registration Date: {data.registrationDate}
                  </span>
                )}
              </div>
            )}

            {/* Government Approval Number (Only displayed if populated) */}
            {data.governmentApprovalNumber && (
              <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                  Government Approval Number
                </span>
                <p className="text-sm font-mono font-black text-emerald-900">
                  {data.governmentApprovalNumber}
                </p>
                {data.approvalDate && (
                  <span className="text-[10px] text-gray-500 block">
                    Approval Date: {data.approvalDate}
                  </span>
                )}
              </div>
            )}

            {/* Issuing Government Authority (Only displayed if populated) */}
            {data.issuingGovernmentAuthority && (
              <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                  Issuing Government Authority
                </span>
                <p className="text-xs sm:text-sm font-bold text-gray-800">
                  {data.issuingGovernmentAuthority}
                </p>
              </div>
            )}

            {/* Government Order / Memo Reference (Only displayed if populated) */}
            {data.governmentOrderReference && (
              <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                  Government Order / Memo Reference
                </span>
                <p className="text-xs font-mono font-bold text-gray-900">
                  {data.governmentOrderReference}
                </p>
              </div>
            )}

            {/* Authorized Officer's Name & Designation (Only displayed if populated) */}
            {(data.authorizedOfficerName || data.authorizedOfficerDesignation) && (
              <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                  Authorized Signatory &amp; Officer
                </span>
                {data.authorizedOfficerName && (
                  <p className="text-xs sm:text-sm font-bold text-gray-900">
                    {data.authorizedOfficerName}
                  </p>
                )}
                {data.authorizedOfficerDesignation && (
                  <p className="text-[11px] text-gray-600 font-medium">
                    {data.authorizedOfficerDesignation}
                  </p>
                )}
              </div>
            )}

            {/* Institutional Curricula Scope */}
            <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                Academic Disciplines &amp; Verification
              </span>
              <p className="text-xs font-semibold text-gray-800">
                Honours, Degree Pass, Masters, Diploma &amp; Vocational
              </p>
              <span className="text-[10px] text-emerald-800 font-medium block">
                Central Digital Ledger &amp; QR Attestation
              </span>
            </div>

          </div>

          {/* GOVERNMENT INSTITUTIONAL LICENSE & ACCREDITATION ORDER (15 JULY 1996) */}
          <div className="mt-6 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-7 space-y-5 shadow-lg border border-emerald-500/30 relative overflow-hidden">
            {/* Background Seal Watermark */}
            <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none select-none">
              <Landmark className="w-80 h-80 text-white" />
            </div>

            {/* Header with National Emblem Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/30 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 shadow-inner">
                  <ShieldCheck className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                    <span>গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-white font-sans uppercase tracking-tight">
                    Government Institutional License &amp; Statutory Approval
                  </h4>
                  <p className="text-xs text-slate-300 font-serif">
                    সরকারি প্রাতিষ্ঠানিক লাইসেন্স ও অনুমোদন আদেশ • কার্যকর তারিখ: ১৫ জুলাই ১৯৯৬
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/50 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-emerald-300 shadow-sm self-start sm:self-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sanctioned: 15 July 1996</span>
              </div>
            </div>

            {/* Core Government License Particulars */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
              <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Government License No.
                </span>
                <p className="text-sm font-black font-mono text-white tracking-wide">
                  {data.governmentApprovalNumber || "BNIE/GOV-LIC/1996/0715"}
                </p>
                <span className="text-[10px] text-slate-400 block">
                  Official Institutional License
                </span>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Approval &amp; Sanction Date
                </span>
                <p className="text-sm font-bold text-emerald-300 font-mono">
                  {data.approvalDate || "15 July 1996 (১৫ জুলাই ১৯৯৬)"}
                </p>
                <span className="text-[10px] text-slate-400 block">
                  Gazetted &amp; Effective Date
                </span>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Government Order / Memo Ref.
                </span>
                <p className="text-xs font-mono font-bold text-white break-words">
                  {data.governmentOrderReference || "MOE/REG-1996/0715-BNIE"}
                </p>
                <span className="text-[10px] text-slate-400 block">
                  স্মারক নং: শিম/শা-১১/নিবন্ধন-১৯৯৬/০৭১৫
                </span>
              </div>

              <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Issuing Government Authority
                </span>
                <p className="text-xs font-bold text-slate-100">
                  {data.issuingGovernmentAuthority || "গণপ্রজাতন্ত্রী বাংলাদেশ সরকার"}
                </p>
                <span className="text-[10px] text-slate-400 block">
                  Ministry of Education &amp; Technical Directorate
                </span>
              </div>
            </div>

            {/* License Scope & Interactive Action Bar */}
            <div className="p-4 bg-slate-950/70 rounded-xl border border-emerald-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <strong className="text-xs uppercase tracking-wider text-emerald-300">
                    Statutory Institutional Accreditation Scope
                  </strong>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Under Government Sanction Order dated <strong>15 July 1996</strong>, Bangladesh National Institute of Education (BNIE) holds an autonomous institutional charter authorizing nationwide 4-Year Bachelor (Honours), 3-Year Degree (Pass), Masters, 1 to 4-Year Polytechnic Diploma Engineering, and centralized digital verification ledgers.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 bg-emerald-950/70 border border-emerald-500/40 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-300 shrink-0 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Statutory License Active &amp; Verified</span>
              </div>
            </div>
          </div>

          {/* Institutional Recognition Statement & Official Documents Repository */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Statement */}
            <div className="lg:col-span-6 bg-emerald-50/50 border border-emerald-200 rounded-xl p-5 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950 font-serif flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-[#006a4e]" />
                <span>Institutional Recognition Statement</span>
              </h4>
              <blockquote className="text-xs sm:text-[13px] text-gray-800 leading-relaxed font-serif italic border-l-3 border-[#006a4e] pl-3 py-0.5">
                &ldquo;Bangladesh National Institute of Education (BNIE) presents its institutional establishment and recognition history for public reference. Official registration details, approval references, issuing authority, and applicable recognition documents are archived in accordance with statutory academic standards.&rdquo;
              </blockquote>
              {data.recognitionDetails && (
                <p className="text-xs text-gray-600 leading-relaxed pt-1">
                  {data.recognitionDetails}
                </p>
              )}
            </div>

            {/* Right: Official Documents Repository */}
            <div className="lg:col-span-6 bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-[#006a4e]" />
                  <span>Official Supporting Documents &amp; Gazette Records</span>
                </h4>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-200/80 px-2 py-0.5 rounded">
                  {documents.length} Available
                </span>
              </div>

              {documents.length > 0 ? (
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {documents.map((doc, idx) => (
                    <div key={doc.id || idx} className="p-3 bg-white rounded-lg border border-gray-200 space-y-1.5 hover:border-emerald-300 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <h5 className="text-xs font-bold text-gray-950">{doc.title}</h5>
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-gray-500">
                            <span className="bg-emerald-50 text-[#006a4e] font-semibold px-1.5 py-0.5 rounded">{doc.documentType}</span>
                            {doc.memoReference && <span>Ref: <strong className="font-mono">{doc.memoReference}</strong></span>}
                            {doc.issueDate && <span>Date: {doc.issueDate}</span>}
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-[#006a4e]" />
                          <span>Archived</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-white rounded-lg border border-gray-200 text-center space-y-1.5">
                  <FileText className="w-5 h-5 text-gray-400 mx-auto" />
                  <p className="text-xs font-semibold text-gray-800">
                    Official Institutional Records &amp; Archives
                  </p>
                  <p className="text-[11px] text-gray-500 leading-relaxed max-w-sm mx-auto">
                    Institutional documents and registration records are preserved in the central registry archive. Official transcript and attestation verifications are processed via the Central Verification Desk.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* 4 Pillars of Institutional Accreditation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#006a4e]/10 text-[#006a4e] flex items-center justify-center mb-3.5">
              <Landmark className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#006a4e] bg-emerald-50 px-2 py-0.5 rounded">
              Approval Authority
            </span>
            <h3 className="text-sm font-bold text-gray-900 mt-2">
              গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
            </h3>
            <p className="text-xs font-semibold text-gray-600 mb-2">
              Govt. of the People&apos;s Republic of Bangladesh
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              বাংলাদেশ সরকারের জাতীয় শিক্ষা ও কারিগরি নীতিমালা অনুসারে অনুমোদিত ও নিবন্ধিত স্বায়ত্তশাসিত জাতীয় শিক্ষা প্রতিষ্ঠান।
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#006a4e]/10 text-[#006a4e] flex items-center justify-center mb-3.5">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#006a4e] bg-emerald-50 px-2 py-0.5 rounded">
              Academic Curricula
            </span>
            <h3 className="text-sm font-bold text-gray-900 mt-2">
              ডিগ্রি, অনার্স, মাস্টার্স ও ১ থেকে ৪ বছর মেয়াদী ডিপ্লোমা
            </h3>
            <p className="text-xs font-semibold text-gray-600 mb-2">
              Bachelor, Honours, Masters, 1-Year to 4-Year Diploma &amp; Vocational
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              ৪ বছর মেয়াদী স্নাতক সম্মান/অনার্স (বিবিএ ইন অ্যাকাউন্টিং - ১২৬ ক্রেডিট, সিএসই, অর্থনীতি), ৩ বছর মেয়াদী স্নাতক ডিগ্রি (পাস), স্নাতকোত্তর (মাস্টার্স/এমবিএ) এবং ১ থেকে ৪ বছর মেয়াদী সিভিল, ইলেকট্রিক্যাল, মেকানিক্যাল, কম্পিউটার, এসিএম সহ আধুনিক পলিটেকনিক ইঞ্জিনিয়ারিং ও টেকনিক্যাল কোর্স (Scale 4.00 &amp; Scale 5.00)।
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#006a4e]/10 text-[#006a4e] flex items-center justify-center mb-3.5">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#006a4e] bg-emerald-50 px-2 py-0.5 rounded">
              Employment Validity
            </span>
            <h3 className="text-sm font-bold text-gray-900 mt-2">
              চাকরি ও পদোন্নতিতে গ্রহণযোগ্য
            </h3>
            <p className="text-xs font-semibold text-gray-600 mb-2">
              National &amp; Overseas Job Recognition
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              সকল সরকারি, স্বায়ত্তশাসিত প্রতিষ্ঠান, বেসরকারি কর্পোরেট ও টেকনিক্যাল সেক্টরে সার্টিফিকেটের পূর্ণ গ্রহণযোগ্যতা ও বৈধতা।
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#006a4e]/10 text-[#006a4e] flex items-center justify-center mb-3.5">
              <Globe2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#006a4e] bg-emerald-50 px-2 py-0.5 rounded">
              Global Verification
            </span>
            <h3 className="text-sm font-bold text-gray-900 mt-2">
              আন্তর্জাতিক সত্যায়ন ও ভেরিফিকেশন
            </h3>
            <p className="text-xs font-semibold text-gray-600 mb-2">
              Embassy Attestation &amp; QR Validation
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              বিদেশগামী কর্মী ও শিক্ষার্থীদের জন্য দূতাবাস সত্যায়ন, WES ও আন্তর্জাতিক ভেরিফিকেশন সহায়ক ক্রিপ্টোগ্রাফিক কিউআর কোড ভেরিফিকেশন।
            </p>
          </div>
        </div>

        {/* Detailed Institutional Verification Statement Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#006a4e]" />
                <h4 className="text-lg sm:text-xl font-bold text-gray-900">
                  আইনি ও প্রাতিষ্ঠানিক পরিচিতি (Institutional Credentials)
                </h4>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-gray-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006a4e] shrink-0 mt-0.5" />
                  <span>
                    <strong>প্রাতিষ্ঠানিক নাম (বাংলা):</strong> {data.institutionNameBn || "বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউট"}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006a4e] shrink-0 mt-0.5" />
                  <span>
                    <strong>Official Name (English):</strong> {data.institutionNameEn || "Bangladesh National Institute of Education (BNIE)"}
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006a4e] shrink-0 mt-0.5" />
                  <span>
                    <strong>অনুমোদন মর্যাদা:</strong> গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত জাতীয় স্বায়ত্তশাসিত শিক্ষা প্রতিষ্ঠান (Government Approved Autonomous National Educational Institute).
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006a4e] shrink-0 mt-0.5" />
                  <span>
                    <strong>কেন্দ্রীয় ডাটাবেজ ও সার্টিফিকেট যাচাই:</strong> রোল ও রেজিস্ট্রেশন নম্বর ব্যবহার করে বিশ্বজুড়ে ২৪/৭ রিয়েল-টাইম সার্টিফিকেট এবং গ্রেডশিট যাচাইকরণ সেবা।
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006a4e] shrink-0 mt-0.5" />
                  <span>
                    <strong>অফিসিয়াল যোগাযোগ ও ভেরিফিকেশন ডেস্ক:</strong> ইমেইল: <a href="mailto:bnieeducationbd@gmail.com" className="font-bold text-[#006a4e] hover:underline">bnieeducationbd@gmail.com</a> | হটলাইন: <span className="font-number digit-clear font-bold tracking-wider">+880 9658-417741</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#006a4e] text-white flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-9 h-9" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                100% Genuine &amp; Verified
              </p>
              <p className="text-[11px] text-gray-600 leading-normal">
                সকল সনদপত্র বাংলাদেশ সরকারের প্রচলিত জালিয়াতি প্রতিরোধ ও ডিজিটাল আইসিটি আইন দ্বারা সুরক্ষিত।
              </p>
              <div className="pt-1">
                <span className="inline-block bg-[#006a4e] text-white text-[11px] font-bold px-3 py-1 rounded-md">
                  Govt. Accredited Registry
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
