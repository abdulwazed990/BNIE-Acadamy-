import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { LeadershipSectionId } from "./LeadershipAdministrationPage";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string, section?: LeadershipSectionId) => void;
  currentPage: string;
}

export default function SideDrawer({
  isOpen,
  onClose,
  onNavigate,
  currentPage
}: SideDrawerProps) {
  // Collapsible category states
  const [isLeadershipExpanded, setIsLeadershipExpanded] = useState(true);
  const [isAboutAdminExpanded, setIsAboutAdminExpanded] = useState(true);
  const [isAcademicProgramsExpanded, setIsAcademicProgramsExpanded] = useState(true);
  const [isStudentServicesExpanded, setIsStudentServicesExpanded] = useState(true);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLinkClick = (page: string, section?: LeadershipSectionId) => {
    onNavigate(page, section);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end no-print">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60"
            aria-hidden="true"
          />

          {/* Slide-in Drawer from Right (Text-Only, Black Text Only, English Only) */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-md sm:max-w-lg bg-white h-full shadow-2xl z-10 flex flex-col overflow-hidden border-l border-gray-300 font-sans"
          >
            {/* Drawer Header: Clean, Professional, Text-Only, Black Text */}
            <div className="px-5 py-4 border-b border-gray-300 bg-white flex items-center justify-between shrink-0">
              <div>
                <h2 className="font-extrabold text-base tracking-tight text-[#000000] uppercase">
                  Navigation Menu
                </h2>
                <p className="text-xs text-[#000000] font-medium tracking-normal mt-0.5">
                  Institutional Directory &amp; Academic Services
                </p>
              </div>

              {/* Text-Only Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 border border-gray-300 rounded text-xs font-bold uppercase tracking-wider text-[#000000] hover:bg-gray-100 hover:text-[#000000] transition-colors cursor-pointer"
                aria-label="Close Navigation Menu"
              >
                Close
              </button>
            </div>

            {/* Independent Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
              
              {/* SECTION 1: PRIMARY PORTALS */}
              <div className="space-y-1">
                <div className="text-[11px] font-black uppercase tracking-wider text-[#000000] pb-1 border-b border-gray-200 mb-2">
                  Primary Portals
                </div>

                <button
                  type="button"
                  onClick={() => handleLinkClick("home")}
                  className={`w-full text-left px-3 py-2 rounded text-xs font-bold transition-colors cursor-pointer block ${
                    currentPage === "home"
                      ? "bg-gray-100 text-[#000000] border-l-4 border-[#000000]"
                      : "text-[#000000] hover:bg-gray-100 hover:text-[#000000]"
                  }`}
                >
                  Home
                </button>

                <button
                  type="button"
                  onClick={() => handleLinkClick("verify")}
                  className={`w-full text-left px-3 py-2 rounded text-xs font-bold transition-colors cursor-pointer block ${
                    currentPage === "verify"
                      ? "bg-gray-100 text-[#000000] border-l-4 border-[#000000]"
                      : "text-[#000000] hover:bg-gray-100 hover:text-[#000000]"
                  }`}
                >
                  Verify Certificate &amp; Mark Sheet (SSC / HSC / Diploma)
                </button>

                <button
                  type="button"
                  onClick={() => handleLinkClick("degree-marksheet-result")}
                  className={`w-full text-left px-3 py-2 rounded text-xs font-bold transition-colors cursor-pointer block ${
                    currentPage === "degree-marksheet-result"
                      ? "bg-gray-100 text-[#000000] border-l-4 border-[#000000]"
                      : "text-[#000000] hover:bg-gray-100 hover:text-[#000000]"
                  }`}
                >
                  Degree / Honours / Masters — Full Marksheet Result Check
                </button>
              </div>

              {/* SECTION 2: ABOUT -> LEADERSHIP AND ADMINISTRATION */}
              <div className="space-y-1">
                <div className="flex items-center justify-between pb-1 border-b border-gray-200 mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#000000]">
                    About → Leadership and Administration
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsLeadershipExpanded(!isLeadershipExpanded)}
                    className="text-[11px] font-bold text-[#000000] hover:bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer"
                    aria-label="Toggle Leadership and Administration Menu"
                  >
                    {isLeadershipExpanded ? "[-]" : "[+]"}
                  </button>
                </div>

                {isLeadershipExpanded && (
                  <div className="space-y-1 pl-2 border-l border-gray-200">
                    <button
                      type="button"
                      onClick={() => handleLinkClick("leadership-admin", "chancellor")}
                      className="w-full text-left px-3 py-1.5 rounded text-xs font-semibold text-[#000000] hover:bg-gray-100 hover:text-[#000000] transition-colors cursor-pointer block"
                    >
                      Chancellor
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick("leadership-admin", "vice-chancellor")}
                      className="w-full text-left px-3 py-1.5 rounded text-xs font-semibold text-[#000000] hover:bg-gray-100 hover:text-[#000000] transition-colors cursor-pointer block"
                    >
                      Vice-Chancellor
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick("leadership-admin", "pro-vice-chancellor")}
                      className="w-full text-left px-3 py-1.5 rounded text-xs font-semibold text-[#000000] hover:bg-gray-100 hover:text-[#000000] transition-colors cursor-pointer block"
                    >
                      Pro-Vice-Chancellor
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick("leadership-admin", "treasurer")}
                      className="w-full text-left px-3 py-1.5 rounded text-xs font-semibold text-[#000000] hover:bg-gray-100 hover:text-[#000000] transition-colors cursor-pointer block"
                    >
                      Treasurer
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick("leadership-admin", "pro-vice-chancellor-admin")}
                      className="w-full text-left px-3 py-1.5 rounded text-xs font-semibold text-[#000000] hover:bg-gray-100 hover:text-[#000000] transition-colors cursor-pointer block"
                    >
                      Pro-Vice-Chancellor (Administration)
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick("leadership-admin", "registrar")}
                      className="w-full text-left px-3 py-1.5 rounded text-xs font-semibold text-[#000000] hover:bg-gray-100 hover:text-[#000000] transition-colors cursor-pointer block"
                    >
                      Registrar
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick("leadership-admin", "former-vice-chancellors")}
                      className="w-full text-left px-3 py-1.5 rounded text-xs font-semibold text-[#000000] hover:bg-gray-100 hover:text-[#000000] transition-colors cursor-pointer block"
                    >
                      Former Vice-Chancellors
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION 3: ABOUT AND ADMINISTRATION (REQUIRED DISTINCT MENU ENTRIES) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between pb-1 border-b border-gray-200 mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#000000]">
                    About and Administration
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAboutAdminExpanded(!isAboutAdminExpanded)}
                    className="text-[11px] font-bold text-[#000000] hover:bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer"
                    aria-label="Toggle About and Administration Menu"
                  >
                    {isAboutAdminExpanded ? "[-]" : "[+]"}
                  </button>
                </div>

                {isAboutAdminExpanded && (
                  <div className="space-y-1 pl-2 border-l border-gray-200">
                    <button
                      type="button"
                      onClick={() => handleLinkClick("leadership-admin", "about-university")}
                      className="w-full text-left px-3 py-1.5 rounded text-xs font-semibold text-[#000000] hover:bg-gray-100 hover:text-[#000000] transition-colors cursor-pointer block"
                    >
                      About University
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick("leadership-admin", "official-information")}
                      className="w-full text-left px-3 py-1.5 rounded text-xs font-semibold text-[#000000] hover:bg-gray-100 hover:text-[#000000] transition-colors cursor-pointer block"
                    >
                      Official Information
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick("leadership-admin", "academic-administration")}
                      className="w-full text-left px-3 py-1.5 rounded text-xs font-semibold text-[#000000] hover:bg-gray-100 hover:text-[#000000] transition-colors cursor-pointer block"
                    >
                      Academic Administration
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick("leadership-admin", "administrative-office")}
                      className="w-full text-left px-3 py-1.5 rounded text-xs font-semibold text-[#000000] hover:bg-gray-100 hover:text-[#000000] transition-colors cursor-pointer block"
                    >
                      Administrative Office
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick("regional-centers")}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer block ${
                        currentPage === "regional-centers"
                          ? "bg-gray-100 text-[#000000] font-bold"
                          : "text-[#000000] hover:bg-gray-100 hover:text-[#000000]"
                      }`}
                    >
                      Regional Centers
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick("leadership-admin", "departments-offices")}
                      className="w-full text-left px-3 py-1.5 rounded text-xs font-semibold text-[#000000] hover:bg-gray-100 hover:text-[#000000] transition-colors cursor-pointer block"
                    >
                      Departments and Offices
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick("accreditation")}
                      className="w-full text-left px-3 py-1.5 rounded text-xs font-semibold text-[#000000] hover:bg-gray-100 hover:text-[#000000] transition-colors cursor-pointer block"
                    >
                      Government Accreditation
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION 4: STUDENT SERVICES & LEARNING RESOURCES */}
              <div className="space-y-1">
                <div className="flex items-center justify-between pb-1 border-b border-gray-200 mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#000000]">
                    Student Services
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsStudentServicesExpanded(!isStudentServicesExpanded)}
                    className="text-[11px] font-bold text-[#000000] hover:bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer"
                    aria-label="Toggle Student Services Menu"
                  >
                    {isStudentServicesExpanded ? "[-]" : "[+]"}
                  </button>
                </div>

                {isStudentServicesExpanded && (
                  <div className="space-y-1 pl-2 border-l border-gray-200">
                    <button
                      type="button"
                      onClick={() => handleLinkClick("student-handbooks")}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer block ${
                        currentPage === "student-handbooks"
                          ? "bg-gray-100 text-[#000000] font-bold"
                          : "text-[#000000] hover:bg-gray-100 hover:text-[#000000]"
                      }`}
                    >
                      Student Handbooks
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick("online-admission")}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer block ${
                        currentPage === "online-admission"
                          ? "bg-gray-100 text-[#000000] font-bold"
                          : "text-[#000000] hover:bg-gray-100 hover:text-[#000000]"
                      }`}
                    >
                      Online Admission
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick("osaps-login")}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer block ${
                        currentPage === "osaps-login"
                          ? "bg-gray-100 text-[#000000] font-bold"
                          : "text-[#000000] hover:bg-gray-100 hover:text-[#000000]"
                      }`}
                    >
                      OSAPS Login
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick("ebook")}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer block ${
                        currentPage === "ebook"
                          ? "bg-gray-100 text-[#000000] font-bold"
                          : "text-[#000000] hover:bg-gray-100 hover:text-[#000000]"
                      }`}
                    >
                      Ebook
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick("web-email")}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer block ${
                        currentPage === "web-email"
                          ? "bg-gray-100 text-[#000000] font-bold"
                          : "text-[#000000] hover:bg-gray-100 hover:text-[#000000]"
                      }`}
                    >
                      Web Email
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick("complaints-services")}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer block ${
                        currentPage === "complaints-services"
                          ? "bg-gray-100 text-[#000000] font-bold"
                          : "text-[#000000] hover:bg-gray-100 hover:text-[#000000]"
                      }`}
                    >
                      Complaints and Services
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION 5: ACADEMIC PROGRAMS */}
              <div className="space-y-1">
                <div className="flex items-center justify-between pb-1 border-b border-gray-200 mb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#000000]">
                    Academic Programs
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAcademicProgramsExpanded(!isAcademicProgramsExpanded)}
                    className="text-[11px] font-bold text-[#000000] hover:bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer"
                    aria-label="Toggle Academic Programs Menu"
                  >
                    {isAcademicProgramsExpanded ? "[-]" : "[+]"}
                  </button>
                </div>

                {isAcademicProgramsExpanded && (
                  <div className="space-y-1 pl-2 border-l border-gray-200">
                    <button
                      type="button"
                      onClick={() => handleLinkClick("find-program")}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer block ${
                        currentPage === "find-program"
                          ? "bg-gray-100 text-[#000000] font-bold"
                          : "text-[#000000] hover:bg-gray-100 hover:text-[#000000]"
                      }`}
                    >
                      Find Program
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick("courses")}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer block ${
                        currentPage === "courses"
                          ? "bg-gray-100 text-[#000000] font-bold"
                          : "text-[#000000] hover:bg-gray-100 hover:text-[#000000]"
                      }`}
                    >
                      Diploma in Engineering
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick("specializations")}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer block ${
                        currentPage === "specializations"
                          ? "bg-gray-100 text-[#000000] font-bold"
                          : "text-[#000000] hover:bg-gray-100 hover:text-[#000000]"
                      }`}
                    >
                      SSC and HSC Vocational
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkClick("research-publications")}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer block ${
                        currentPage === "research-publications"
                          ? "bg-gray-100 text-[#000000] font-bold"
                          : "text-[#000000] hover:bg-gray-100 hover:text-[#000000]"
                      }`}
                    >
                      Research and Publications
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION 6: NOTICES, CONTACT & SUPPORT */}
              <div className="space-y-1">
                <div className="text-[11px] font-black uppercase tracking-wider text-[#000000] pb-1 border-b border-gray-200 mb-2">
                  Notices &amp; Support
                </div>

                <button
                  type="button"
                  onClick={() => handleLinkClick("notices")}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer block ${
                    currentPage === "notices"
                      ? "bg-gray-100 text-[#000000] font-bold"
                      : "text-[#000000] hover:bg-gray-100 hover:text-[#000000]"
                  }`}
                >
                  Notices and Announcements
                </button>

                <button
                  type="button"
                  onClick={() => handleLinkClick("help")}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer block ${
                    currentPage === "help"
                      ? "bg-gray-100 text-[#000000] font-bold"
                      : "text-[#000000] hover:bg-gray-100 hover:text-[#000000]"
                  }`}
                >
                  Contact Us
                </button>

                <button
                  type="button"
                  onClick={() => handleLinkClick("help")}
                  className="w-full text-left px-3 py-1.5 rounded text-xs font-semibold text-[#000000] hover:bg-gray-100 hover:text-[#000000] transition-colors cursor-pointer block"
                >
                  FAQs
                </button>

                <button
                  type="button"
                  onClick={() => handleLinkClick("admin-login")}
                  className={`w-full text-left px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer block ${
                    currentPage === "admin-login"
                      ? "bg-gray-100 text-[#000000] font-bold"
                      : "text-[#000000] hover:bg-gray-100 hover:text-[#000000]"
                  }`}
                >
                  Administrator Management Panel
                </button>
              </div>

            </div>

            {/* Drawer Footer: Clean Text-Only */}
            <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-200 text-center shrink-0">
              <span className="text-xs text-[#000000] font-medium block">
                Bangladesh National Institute of Education
              </span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
