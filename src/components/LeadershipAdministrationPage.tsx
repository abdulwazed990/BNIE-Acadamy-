import { useState, useEffect } from "react";
import { ArrowLeft, Printer, ShieldCheck, Mail, Phone, MapPin, Building2, ExternalLink, UserCheck, Clock, Award, Smartphone } from "lucide-react";
import Logo from "./Logo";
import { LeadershipProfile } from "../types";
import { 
  sectionIdToPosition, 
  fetchLeadershipProfiles, 
  subscribeLeadershipProfiles, 
  getLocalProfiles
} from "../lib/leadershipService";

export type LeadershipSectionId =
  | "vice-chancellor"
  | "pro-vice-chancellor"
  | "chancellor"
  | "treasurer"
  | "pro-vice-chancellor-admin"
  | "registrar"
  | "exam-controller"
  | "former-vice-chancellors"
  | "about-university"
  | "official-information"
  | "academic-administration"
  | "administrative-office"
  | "departments-offices";

interface LeadershipAdministrationPageProps {
  initialSection?: LeadershipSectionId;
  onBackToHome: () => void;
  onNavigateToVcMessage?: () => void;
  onNavigateToRegionalCenters?: () => void;
  onNavigateToContact?: () => void;
  onNavigateToVerify?: () => void;
}

interface RoleData {
  id: LeadershipSectionId;
  title: string;
  category: "Leadership" | "Governance & Administration";
  status: string;
  officeName: string;
  location: string;
  email: string;
  phone: string;
  summary: string;
  statutoryRole: string[];
  bioNotice: string;
}

const ROLES_DATA: Record<LeadershipSectionId, RoleData> = {
  "chancellor": {
    id: "chancellor",
    title: "Chancellor",
    category: "Leadership",
    status: "Constitutional Head of the Institution",
    officeName: "Office of the Chancellor",
    location: "National Secretariat, Dhaka, Bangladesh",
    email: "chancellor.office@bnie.edu.bd",
    phone: "+880 2 9876501",
    summary: "The Chancellor is the titular and constitutional head of the Bangladesh National Institute of Education, presiding over all official convocations and conferring statutory diplomas, academic degrees, and honorary recognitions.",
    statutoryRole: [
      "Presides over statutory convocation ceremonies for conferring vocational and engineering diplomas.",
      "Sanctions the official statutes and institutional governance charter.",
      "Appoints the Vice-Chancellor in accordance with the national education framework and regulatory gazette.",
      "Ensures the academic standards align with national technical qualifications."
    ],
    bioNotice: "Official state appointment record maintained pursuant to statutory provisions. Verified institutional appointment details are on file with the Ministry of Education and institute registry."
  },
  "vice-chancellor": {
    id: "vice-chancellor",
    title: "Vice-Chancellor",
    category: "Leadership",
    status: "Principal Executive & Academic Officer",
    officeName: "Vice-Chancellor's Secretariat",
    location: "Central Administration Building (Level 4), Dhaka, Bangladesh",
    email: "vc@bnie.edu.bd",
    phone: "+880 2 9876502",
    summary: "The Vice-Chancellor serves as the chief executive and academic leader of BNIE, overseeing strategic planning, technical curriculum development, research programs, and national administrative operations.",
    statutoryRole: [
      "Executive leadership of academic faculties, engineering diploma schools, and vocational centers.",
      "Chief authority over institute examinations, certificate issuance, and academic audits.",
      "Chair of the Academic Council, Syndicate, and Finance Committee.",
      "Representing the institution before the Ministry of Education, BTEB, and international educational bodies."
    ],
    bioNotice: "Official appointment gazette and administrative record registered under the BNIE Technical Education Charter. Full address to students and faculty is available in the Vice-Chancellor's Welcome Message."
  },
  "pro-vice-chancellor": {
    id: "pro-vice-chancellor",
    title: "Pro-Vice-Chancellor",
    category: "Leadership",
    status: "Senior Academic Executive",
    officeName: "Office of the Pro-Vice-Chancellor (Academic)",
    location: "Academic Complex (Level 3), Dhaka, Bangladesh",
    email: "pvc.academic@bnie.edu.bd",
    phone: "+880 2 9876503",
    summary: "The Pro-Vice-Chancellor directs curriculum innovation, laboratory infrastructure accreditation, faculty recruitment, and institutional academic governance across all engineering and vocational disciplines.",
    statutoryRole: [
      "Supervision of 4-year Diploma in Engineering departments (Mechanical, Electrical, Electronics, Civil).",
      "Coordination of SSC & HSC Vocational secondary technical curriculum frameworks.",
      "Implementation of Outcome-Based Education (OBE) and continuous academic quality audits.",
      "Presiding over academic review boards and institutional accreditation standards."
    ],
    bioNotice: "Senior academic credentials, faculty leadership records, and research publications are filed with the BNIE Academic Council Secretariat."
  },
  "pro-vice-chancellor-admin": {
    id: "pro-vice-chancellor-admin",
    title: "Pro-Vice-Chancellor (Administration)",
    category: "Leadership",
    status: "Senior Administrative Executive",
    officeName: "Office of the Pro-Vice-Chancellor (Administration)",
    location: "Central Administration Complex (Level 3), Dhaka, Bangladesh",
    email: "pvc.admin@bnie.edu.bd",
    phone: "+880 2 9876504",
    summary: "The Pro-Vice-Chancellor (Administration) oversees institutional operations, campus security, digital infrastructure, personnel management, and divisional center administrative oversight.",
    statutoryRole: [
      "Executive management of administrative offices, divisional centers, and regional hubs.",
      "Supervision of physical estate development, workshops, testing labs, and campus safety.",
      "Coordination of inter-departmental human resources and civil service compliance.",
      "Implementation of national e-governance policies and institutional digitalization."
    ],
    bioNotice: "Administrative appointment notice and executive service portfolio maintained under the Institute Service Regulations."
  },
  "treasurer": {
    id: "treasurer",
    title: "Treasurer",
    category: "Leadership",
    status: "Chief Financial & Fiscal Officer",
    officeName: "Office of the Treasurer",
    location: "Finance & Accounts Tower (Level 2), Dhaka, Bangladesh",
    email: "treasurer@bnie.edu.bd",
    phone: "+880 2 9876505",
    summary: "The Treasurer exercises authoritative control over institute funds, budgetary planning, audit compliance, student tuition fee schedules, and fiscal development allocations.",
    statutoryRole: [
      "Preparation of annual institutional operating budgets and developmental fiscal statements.",
      "Auditing and compliance oversight under national public procurement rules (PPR).",
      "Management of student tuition subsidies, laboratory grants, and academic scholarships.",
      "Secretary to the institutional Finance and Budget Committee."
    ],
    bioNotice: "Fiscal authority gazette and certified audit credentials archived with the Comptroller & Auditor General liaison cell."
  },
  "registrar": {
    id: "registrar",
    title: "Registrar",
    category: "Leadership",
    status: "Custodian of Institutional Records & Legal Seal",
    officeName: "Office of the Registrar",
    location: "Central Records Building (Level 1), Dhaka, Bangladesh",
    email: "registrar@bnie.edu.bd",
    phone: "+880 2 9876506",
    summary: "The Registrar is the chief administrative officer and custodian of the Institute Common Seal, student academic ledgers, official transcripts, certificate authentication archives, and legal affairs.",
    statutoryRole: [
      "Maintenance of authenticated permanent student registries and verification databases.",
      "Execution of official degree certificates, diploma documents, and migration records.",
      "Legal custodian of statutory meeting minutes, contracts, and gazette records.",
      "Issuance of official institutional circulars, admission notices, and verification verifications."
    ],
    bioNotice: "Permanent registry records and administrative orders are countersigned by the Registrar in accordance with official university statutes."
  },
  "exam-controller": {
    id: "exam-controller",
    title: "Exam Controller",
    category: "Leadership",
    status: "Chief Examination & Certification Authority",
    officeName: "Office of the Controller of Examinations",
    location: "Examination & Records Tower (Level 3), Dhaka, Bangladesh",
    email: "exam.controller@bnie.edu.bd",
    phone: "+880 2 9876510",
    summary: "The Controller of Examinations is responsible for the overall conduct and integrity of institute examinations, paper setting, moderation, script evaluation, result publication, and authentication of academic transcripts and certificates.",
    statutoryRole: [
      "Administration and scheduling of semester finals, diploma, and degree examinations.",
      "Preparation, secure custody, and publication of official academic examination results.",
      "Issuance and digital verification oversight of student marksheets and diplomas.",
      "Coordination with divisional examination centers and external assessment boards."
    ],
    bioNotice: "Official examination gazette and appointment portfolio maintained pursuant to statutory examination ordinances."
  },
  "former-vice-chancellors": {
    id: "former-vice-chancellors",
    title: "Former Vice-Chancellors",
    category: "Leadership",
    status: "Institutional Honor Roll & Historical Leadership",
    officeName: "Archives of Institutional Leadership",
    location: "Central Library & Heritage Archive, Dhaka, Bangladesh",
    email: "archives@bnie.edu.bd",
    phone: "+880 2 9876500",
    summary: "The Roll of Former Vice-Chancellors commemorates the pioneering scholars and administrators who have guided the Bangladesh National Institute of Education through institutional expansion, curriculum modernization, and national accreditation milestones.",
    statutoryRole: [
      "Historical custodianship of founding principles and vocational training charters.",
      "Honorary advisory role on the Council of Elders and Academic Elders Forum.",
      "Permanent inclusion in the institutional Convocation Honor Ledger.",
      "Archived administrative decisions and academic foundation directives."
    ],
    bioNotice: "Historical tenures, foundation records, and distinguished leadership milestones are permanently preserved in the BNIE Institutional History Museum."
  },
  "about-university": {
    id: "about-university",
    title: "About University",
    category: "Governance & Administration",
    status: "Institutional Profile & Statutory Foundation",
    officeName: "Information & Public Relations Directorate",
    location: "Administrative Headquarters, Dhaka, Bangladesh",
    email: "info@bnie.edu.bd",
    phone: "+880 2 9876500",
    summary: "The Bangladesh National Institute of Education (BNIE) is a premier state-recognized technical and vocational educational institution offering 4-Year Diploma in Engineering programs, SSC/HSC Vocational curriculums, and national skill qualification certifications.",
    statutoryRole: [
      "Comprehensive nationwide distance and laboratory-based technical education.",
      "Full compliance with Bangladesh Technical Education Board (BTEB) and Ministry standards.",
      "Over 40 regional examination and resource centers across all 8 administrative divisions.",
      "Digital student records verification platform with instantaneous QR and Roll authentication."
    ],
    bioNotice: "Approved by the Government of the People's Republic of Bangladesh. Full statutory charter and registration records on public file."
  },
  "official-information": {
    id: "official-information",
    title: "Official Information",
    category: "Governance & Administration",
    status: "Statutory Gazette & Public Disclosure",
    officeName: "Public Information Disclosure Cell",
    location: "Legal & Gazette Wing, Level 2, Dhaka, Bangladesh",
    email: "disclosure@bnie.edu.bd",
    phone: "+880 2 9876507",
    summary: "The Official Information desk ensures statutory compliance with the Right to Information Act, providing public access to institutional gazettes, regulatory approvals, academic ordinances, and financial accounts.",
    statutoryRole: [
      "Publication of official examination schedules and results gazettes.",
      "Dissemination of administrative circulars and public notifications.",
      "Designated Right to Information (RTI) officer contacts and grievance protocols.",
      "Annual statutory audit reports and program accreditation documentation."
    ],
    bioNotice: "All public disclosures are issued under the seal and authority of the Registrar."
  },
  "academic-administration": {
    id: "academic-administration",
    title: "Academic Administration",
    category: "Governance & Administration",
    status: "Deanery & Curriculum Directorate",
    officeName: "Office of Academic Administration",
    location: "Academic Tower (Level 2), Dhaka, Bangladesh",
    email: "academic.admin@bnie.edu.bd",
    phone: "+880 2 9876508",
    summary: "Academic Administration manages syllabus architecture, semester registrations, laboratory session protocols, examination moderation, and faculty teaching assignments across all technical schools.",
    statutoryRole: [
      "Syllabus formulation under BTEB and National Technical and Vocational Qualification (NTVQ) frameworks.",
      "Moderation and secure distribution of semester final examination question papers.",
      "Student continuous assessment and CGPA computation protocols.",
      "Academic calendar formulation and semester scheduling."
    ],
    bioNotice: "Curriculum specifications and syllabus handbooks are reviewed annually by the Academic Council."
  },
  "administrative-office": {
    id: "administrative-office",
    title: "Administrative Office",
    category: "Governance & Administration",
    status: "Central Operations & General Administration",
    officeName: "General Administration Directorate",
    location: "Ground Level, Central Administrative Wing, Dhaka, Bangladesh",
    email: "admin.office@bnie.edu.bd",
    phone: "+880 2 9876509",
    summary: "The Administrative Office directs logistics, estate management, security protocols, transportation services, and general institutional support operations.",
    statutoryRole: [
      "Coordination of central campus facility management and logistical support.",
      "Procurement of engineering laboratory supplies and testing machinery.",
      "General student inquiries desk and official postal correspondence hub.",
      "Administrative coordination with divisional regional offices."
    ],
    bioNotice: "Operational hours: Sunday to Thursday, 9:00 AM – 5:00 PM."
  },
  "departments-offices": {
    id: "departments-offices",
    title: "Departments and Offices",
    category: "Governance & Administration",
    status: "Academic Schools & Administrative Wings",
    officeName: "Institutional Directory Cell",
    location: "Administrative Headquarters, Dhaka, Bangladesh",
    email: "directory@bnie.edu.bd",
    phone: "+880 2 9876510",
    summary: "A comprehensive institutional directory of academic engineering departments, vocational faculties, and centralized administrative wings serving students and faculty nationwide.",
    statutoryRole: [
      "Department of Mechanical Engineering (Power, Automotive, Refrigeration & AC)",
      "Department of Electrical & Electronics Engineering (Telecommunication, Power Systems)",
      "Department of Civil Engineering & Architectural Technologies",
      "School of Vocational Studies (SSC Vocational, HSC Vocational Streams)",
      "Controller of Examinations & Certification Verification Directorate",
      "Office of Student Affairs & OSAPS Technical Helpdesk"
    ],
    bioNotice: "Contact the respective head of department or wing officer through the institutional directory."
  }
};

const SECTIONS_LIST: { id: LeadershipSectionId; label: string; group: "Leadership" | "About & Administration" }[] = [
  // Required Leadership positions
  { id: "chancellor", label: "Chancellor", group: "Leadership" },
  { id: "vice-chancellor", label: "Vice-Chancellor", group: "Leadership" },
  { id: "pro-vice-chancellor", label: "Pro-Vice-Chancellor", group: "Leadership" },
  { id: "treasurer", label: "Treasurer", group: "Leadership" },
  { id: "pro-vice-chancellor-admin", label: "Pro-Vice-Chancellor (Administration)", group: "Leadership" },
  { id: "registrar", label: "Registrar", group: "Leadership" },
  { id: "exam-controller", label: "Exam Controller", group: "Leadership" },
  { id: "former-vice-chancellors", label: "Former Vice-Chancellors", group: "Leadership" },
  
  // Required Academic & Administrative sections
  { id: "about-university", label: "About University", group: "About & Administration" },
  { id: "official-information", label: "Official Information", group: "About & Administration" },
  { id: "academic-administration", label: "Academic Administration", group: "About & Administration" },
  { id: "administrative-office", label: "Administrative Office", group: "About & Administration" },
  { id: "departments-offices", label: "Departments and Offices", group: "About & Administration" }
];

export default function LeadershipAdministrationPage({
  initialSection = "vice-chancellor",
  onBackToHome,
  onNavigateToVcMessage,
  onNavigateToRegionalCenters,
  onNavigateToContact,
  onNavigateToVerify
}: LeadershipAdministrationPageProps) {
  const [activeSection, setActiveSection] = useState<LeadershipSectionId>(initialSection);
  const [profiles, setProfiles] = useState<LeadershipProfile[]>(() => getLocalProfiles());

  useEffect(() => {
    if (initialSection) {
      setActiveSection(initialSection);
    }
  }, [initialSection]);

  useEffect(() => {
    fetchLeadershipProfiles().then((data) => setProfiles(data));
    const unsubscribe = subscribeLeadershipProfiles((updated) => setProfiles(updated));
    return () => unsubscribe();
  }, []);

  const currentRole = ROLES_DATA[activeSection] || ROLES_DATA["vice-chancellor"];
  const targetPosition = sectionIdToPosition(activeSection);
  const publishedProfiles = targetPosition
    ? profiles
        .filter((p) => p.position === targetPosition && p.status === "Published")
        .sort((a, b) => (a.displayOrder || 1) - (b.displayOrder || 1))
    : [];

  return (
    <div className="min-h-screen bg-gray-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-black hover:bg-gray-100 px-3 py-2 rounded-lg border border-gray-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-black" />
            <span>Return to Home Portal</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-black bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg">
              Institutional Governance &amp; Administration
            </span>
            <button
              type="button"
              onClick={() => window.print()}
              className="p-2 text-black hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors cursor-pointer no-print"
              title="Print Documentation"
            >
              <Printer className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>

        {/* Page Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar: Distinct Text-Only Menu Entries */}
          <aside className="lg:col-span-4 bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs space-y-6">
            
            {/* Leadership Group */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-black border-b border-gray-200 pb-2 mb-3">
                About → Leadership and Administration
              </h3>
              <nav className="space-y-1">
                {SECTIONS_LIST.filter(s => s.group === "Leadership").map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer block ${
                      activeSection === item.id
                        ? "bg-gray-100 text-black border-l-4 border-black font-extrabold"
                        : "text-black hover:bg-gray-50 border-l-4 border-transparent"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* About & Administration Group */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-black border-b border-gray-200 pb-2 mb-3">
                About &amp; Administration
              </h3>
              <nav className="space-y-1">
                {SECTIONS_LIST.filter(s => s.group === "About & Administration").map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer block ${
                      activeSection === item.id
                        ? "bg-gray-100 text-black border-l-4 border-black font-extrabold"
                        : "text-black hover:bg-gray-50 border-l-4 border-transparent"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Quick Link to Regional Centers */}
            <div className="pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={onNavigateToRegionalCenters}
                className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold text-black hover:bg-gray-50 border border-gray-200 cursor-pointer block"
              >
                Divisional Regional Centers Directory
              </button>
            </div>

          </aside>

          {/* Right Main Content Panel */}
          <main className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
            
            {/* National Color Banner */}
            <div className="w-full h-1.5 flex shrink-0">
              <div className="w-[45%] bg-[#006a4e]" />
              <div className="w-[10%] bg-[#f42a41]" />
              <div className="w-[45%] bg-[#006a4e]" />
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Header Profile Title */}
              <div className="border-b border-gray-200 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-black bg-gray-100 border border-gray-200 px-3 py-1 rounded-md inline-block">
                    {currentRole.category} • Statutory Designation
                  </span>

                  {publishedProfiles.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{publishedProfiles.length} Verified Profile{publishedProfiles.length > 1 ? "s" : ""} Online</span>
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                  {currentRole.title}
                </h1>
                <p className="text-sm font-semibold text-black mt-1">
                  {currentRole.status}
                </p>
              </div>

              {/* DYNAMIC PUBLISHED PROFILES SECTION */}
              {targetPosition === "Former Vice-Chancellors" ? (
                publishedProfiles.length > 0 ? (
                  <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-2 flex items-center justify-between">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-black">
                        Roll of Former Vice-Chancellors ({publishedProfiles.length})
                      </h2>
                      <span className="text-[10px] text-gray-500 font-mono">Archival Leadership Ledger</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {publishedProfiles.map((p) => (
                        <div
                          key={p.id}
                          className="p-5 rounded-2xl border border-gray-200 bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-3"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start gap-3.5">
                              {/* 3:4 Passport Portrait */}
                              <div className="w-20 h-26 rounded-xl border border-gray-300 bg-gray-100 overflow-hidden shrink-0 shadow-2xs flex items-center justify-center">
                                {p.photoUrl ? (
                                  <img
                                    src={p.photoUrl}
                                    alt={p.fullName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="text-center p-1 text-gray-400">
                                    <span className="text-[9px] font-mono block">PORTRAIT</span>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-1 flex-1 min-w-0">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#006a4e] bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                                  Honor Roll #{p.displayOrder}
                                </span>
                                <h3 className="text-base font-extrabold text-gray-950 leading-snug truncate">
                                  {p.fullName}
                                </h3>
                                <p className="text-xs font-bold text-gray-800 leading-snug">
                                  {p.designation}
                                </p>
                                <p className="text-[11px] text-gray-600 flex items-center gap-1">
                                  <Building2 className="w-3 h-3 text-gray-400 shrink-0" />
                                  <span className="truncate">{p.departmentOrOffice}</span>
                                </p>
                              </div>
                            </div>

                            {/* Contact & Desk Details */}
                            <div className="bg-gray-50/70 rounded-xl p-3 border border-gray-100 space-y-1 text-xs">
                              <div className="flex items-center gap-2 text-gray-700">
                                <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span className="font-mono text-[11px] truncate">{p.email}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-700">
                                <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                <span className="font-mono text-[11px]">{p.phone}</span>
                              </div>
                              {p.mobileNumber && (
                                <div className="flex items-center gap-2 text-gray-700">
                                  <Smartphone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                  <span className="font-mono text-[11px]">{p.mobileNumber}</span>
                                </div>
                              )}
                              {p.officeAddress && (
                                <div className="flex items-center gap-2 text-gray-600 pt-0.5">
                                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                  <span className="text-[11px] truncate">{p.officeAddress}</span>
                                </div>
                              )}
                            </div>

                            {/* Biography Description */}
                            {p.biography && (
                              <p className="text-xs text-gray-700 bg-emerald-50/30 p-3 rounded-xl border border-emerald-100/60 leading-relaxed italic">
                                &quot;{p.biography}&quot;
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1">
                    <span className="font-bold text-gray-800 uppercase tracking-wider block">
                      Archival Record Notice
                    </span>
                    <p className="text-gray-600 leading-relaxed">
                      Official historical archives and roll of former vice-chancellors are currently being updated in the central registry. Statutory institutional background is detailed below.
                    </p>
                  </div>
                )
              ) : targetPosition && publishedProfiles.length > 0 ? (
                /* Primary Leadership Profiles (Chancellor, VC, PVC, Treasurer, Registrar, etc.) */
                <div className="space-y-6">
                  {publishedProfiles.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl border-2 border-[#006a4e]/20 p-6 shadow-sm space-y-5"
                    >
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Passport-size Portrait Photo Frame (3:4 ratio) with Direct Change Photo Button */}
                        <div className="flex flex-col items-center shrink-0">
                          <div className="relative w-36 h-48 sm:w-44 sm:h-56 rounded-2xl border-2 border-[#006a4e] bg-gray-100 overflow-hidden shadow-md flex items-center justify-center">
                            {p.photoUrl ? (
                              <img
                                src={p.photoUrl}
                                alt={p.fullName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center p-3 text-gray-400">
                                <span className="text-xs font-mono font-bold block">OFFICIAL PORTRAIT</span>
                              </div>
                            )}

                            <div className="absolute top-2 right-2 bg-[#006a4e] text-white p-1 rounded-full shadow-xs">
                              <Award className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>

                        {/* Executive Identity Details */}
                        <div className="text-center sm:text-left space-y-2 flex-1 min-w-0">
                          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-[#006a4e] border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Official Institutional Appointee</span>
                          </div>

                          <h2 className="text-xl sm:text-2xl font-black text-gray-950 font-sans tracking-tight">
                            {p.fullName}
                          </h2>

                          <p className="text-sm font-bold text-[#006a4e]">
                            {p.designation}
                          </p>

                          <p className="text-xs text-gray-700 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
                            <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{p.departmentOrOffice}</span>
                          </p>

                          {/* Contact Details Grid */}
                          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                              <Mail className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
                              <a href={`mailto:${p.email}`} className="font-mono text-[11px] truncate hover:text-[#006a4e]">
                                {p.email}
                              </a>
                            </div>

                            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                              <Phone className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
                              <a href={`tel:${p.phone}`} className="font-mono text-[11px] hover:text-[#006a4e]">
                                {p.phone}
                              </a>
                            </div>

                            {p.mobileNumber && (
                              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100">
                                <Smartphone className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
                                <span className="font-mono text-[11px]">{p.mobileNumber}</span>
                              </div>
                            )}

                            {p.officeAddress && (
                              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-gray-700 bg-gray-50 p-2 rounded-lg border border-gray-100 sm:col-span-2">
                                <MapPin className="w-3.5 h-3.5 text-[#006a4e] shrink-0" />
                                <span className="text-[11px] truncate">{p.officeAddress}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Official Biography or Profile Description */}
                      {p.biography && (
                        <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100 space-y-1.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-black block">
                            Executive Profile &amp; Biography
                          </span>
                          <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-normal whitespace-pre-line">
                            {p.biography}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : targetPosition ? (
                /* Placeholder Notice When No Official Profile Is Published Yet */
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-black font-bold uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>Official Profile Registration Notice</span>
                  </div>
                  <p className="text-black leading-relaxed">
                    Official leadership profile information for this statutory position will be updated soon. Statutory institutional jurisdiction, overview, and correspondence details are provided below.
                  </p>
                </div>
              ) : null}

              {/* Verified Information Summary */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-black">
                  Overview &amp; Executive Summary
                </h2>
                <p className="text-sm text-black leading-relaxed font-normal">
                  {currentRole.summary}
                </p>
              </div>

              {/* Statutory Responsibilities */}
              <div className="space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-black">
                  Statutory Responsibilities &amp; Jurisdiction
                </h2>
                <div className="grid grid-cols-1 gap-2.5">
                  {currentRole.statutoryRole.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50/50 flex items-start gap-3 transition-colors"
                    >
                      <span className="text-xs font-bold text-black font-mono mt-0.5 shrink-0">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <p className="text-xs sm:text-sm text-black leading-normal">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secretariat & Official Contact Desk */}
              <div className="border border-gray-200 rounded-xl p-5 bg-white space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-black">
                  Secretariat &amp; Official Correspondence Desk
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-black block mb-0.5">Office:</span>
                    <span className="text-black block">{currentRole.officeName}</span>
                  </div>
                  <div>
                    <span className="font-bold text-black block mb-0.5">Location:</span>
                    <span className="text-black block">{currentRole.location}</span>
                  </div>
                  <div>
                    <span className="font-bold text-black block mb-0.5">Official Email:</span>
                    <span className="text-black font-mono block">{currentRole.email}</span>
                  </div>
                  <div>
                    <span className="font-bold text-black block mb-0.5">Telephone PABX:</span>
                    <span className="text-black font-mono block">{currentRole.phone}</span>
                  </div>
                </div>
              </div>

              {/* Verified Record Notice / Official Placeholder */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1.5">
                <span className="font-bold uppercase tracking-wider text-black block">
                  Official Verification &amp; Registry Notice
                </span>
                <p className="text-black leading-relaxed">
                  {currentRole.bioNotice}
                </p>
                <p className="text-[11px] text-black">
                  Verified record of appointment in accordance with official university statutes and national educational gazette.
                </p>
              </div>

              {/* Additional Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-3">
                {activeSection === "vice-chancellor" && onNavigateToVcMessage && (
                  <button
                    type="button"
                    onClick={onNavigateToVcMessage}
                    className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Read Vice-Chancellor's Welcome Message
                  </button>
                )}
                
                {onNavigateToVerify && (
                  <button
                    type="button"
                    onClick={onNavigateToVerify}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-black border border-gray-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Online Verification Portal
                  </button>
                )}

                {onNavigateToContact && (
                  <button
                    type="button"
                    onClick={onNavigateToContact}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-black border border-gray-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Contact Helpdesk
                  </button>
                )}
              </div>

            </div>

          </main>

        </div>
      </div>
    </div>
  );
}
