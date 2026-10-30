import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import VocationalSpecialization from "./components/VocationalSpecialization";
import DiplomaStreams from "./components/DiplomaStreams";
import MissionAndServices from "./components/MissionAndServices";
import Contact from "./components/Contact";
import VerificationForm from "./components/VerificationForm";
import VerificationReport from "./components/VerificationReport";
import AdminPanel from "./components/AdminPanel";
import DiplomaCourses from "./components/DiplomaCourses";
import Specializations from "./components/Specializations";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TermsAndConditions";
import HelpCenter from "./components/HelpCenter";
import ServicesPage from "./components/ServicesPage";
import GovernmentAccreditation from "./components/GovernmentAccreditation";
import ViceChancellorMessage from "./components/ViceChancellorMessage";
import ComplaintsAndServices from "./components/ComplaintsAndServices";
import StudentHandbooksPage from "./components/StudentHandbooksPage";
import OnlineAdmissionPage from "./components/OnlineAdmissionPage";
import OsapsLoginPage from "./components/OsapsLoginPage";
import EbookPage from "./components/EbookPage";
import WebEmailPage from "./components/WebEmailPage";
import DegreeProgramsSection from "./components/DegreeProgramsSection";
import FindProgramPage from "./components/FindProgramPage";
import ResearchPublicationsPage from "./components/ResearchPublicationsPage";
import NoticesPage from "./components/NoticesPage";
import RegionalCentersPage from "./components/RegionalCentersPage";
import SideDrawer from "./components/SideDrawer";
import LeadershipAdministrationPage, { LeadershipSectionId } from "./components/LeadershipAdministrationPage";
import DegreeResultVerificationPage from "./components/DegreeResultVerificationPage";
import { Student, HomepageContentSettings } from "./types";
import { DEFAULT_STUDENTS } from "./data/defaultStudents";
import { 
  seedDatabaseIfEmpty, 
  fetchAllStudents,
  addStudentToDb, 
  updateStudentInDb, 
  deleteStudentFromDb 
} from "./lib/firebase";
import { 
  getLocalHomepageSettings, 
  fetchHomepageSettings, 
  subscribeHomepageSettings 
} from "./lib/homepageContentService";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const getInitialPage = (): string => {
  if (typeof window === "undefined") return "home";
  
  const params = new URLSearchParams(window.location.search);
  const pageParam = params.get("page");
  if (pageParam) return pageParam;

  const path = window.location.pathname.toLowerCase();
  if (path.includes("/degree-marksheet-result") || path.includes("/degree-result")) {
    return "degree-marksheet-result";
  }
  if (
    path.includes("/verify") ||
    path.includes("/certificate") ||
    path.includes("/record") ||
    params.get("token") ||
    params.get("id") ||
    params.get("roll") ||
    params.get("serial")
  ) {
    return "verify";
  }
  if (path.includes("/admin")) return "admin-login";
  if (path.includes("/handbooks")) return "student-handbooks";
  if (path.includes("/admission")) return "online-admission";
  if (path.includes("/osaps")) return "osaps-login";
  if (path.includes("/ebook")) return "ebook";
  if (path.includes("/webmail")) return "web-email";
  if (path.includes("/find-program")) return "find-program";

  const hash = window.location.hash.replace("#", "").replace("/", "");
  if (hash) return hash;

  return "home";
};

interface PageSeoMetadata {
  title: string;
  description: string;
  canonicalPath: string;
  breadcrumbName: string;
  noIndex?: boolean;
}

const PAGE_SEO_CONFIG: Record<string, PageSeoMetadata> = {
  home: {
    title: "BNIE Bangladesh | Bangladesh National Institute of Education (বিএনআইই)",
    description: "Official portal of Bangladesh National Institute of Education (BNIE / বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউট). Check student result, certificate verification, marksheet checking, Degree, Honours, Masters, and admission.",
    canonicalPath: "/",
    breadcrumbName: "Home"
  },
  "degree-marksheet-result": {
    title: "BNIE Degree, Honours & Masters Result Check | Marksheet Verification",
    description: "Check and verify official BNIE degree results, honours results, and masters marksheets online (বিএনআইই ডিগ্রি ও অনার্স রেজাল্ট). Semester-wise GPA and CGPA calculation.",
    canonicalPath: "/?page=degree-marksheet-result",
    breadcrumbName: "Degree Marksheet Result"
  },
  verify: {
    title: "BNIE Certificate Verification Online | SSC, HSC & Diploma (সনদ যাচাই)",
    description: "Online BNIE certificate verification (বিএনআইই সার্টিফিকেট যাচাই). Verify roll, registration, and serial numbers for SSC, HSC, and Polytechnic Engineering Diploma credentials.",
    canonicalPath: "/?page=verify",
    breadcrumbName: "Certificate Verification"
  },
  report: {
    title: "BNIE Verified Academic Transcript & Certificate Dossier (সনদ রিপোর্ট)",
    description: "Official verified academic record and transcript report from Bangladesh National Institute of Education (BNIE) credential verification system.",
    canonicalPath: "/?page=report",
    breadcrumbName: "Transcript Report"
  },
  "find-program": {
    title: "BNIE Academic Programs | Bachelor Degree, Honours & Masters Courses",
    description: "Explore BBA Honours, Degree Pass, Masters, and Polytechnic Diploma programs at Bangladesh National Institute of Education (BNIE Bangladesh / বাংলাদেশ ডিগ্রি শিক্ষা).",
    canonicalPath: "/?page=find-program",
    breadcrumbName: "Academic Programs"
  },
  "online-admission": {
    title: "BNIE Admission & Student Registration Portal (বিএনআইই ভর্তি)",
    description: "Apply online for BNIE admission in Bachelor Honours, Degree Pass, Masters, and Polytechnic Diploma engineering programs at Bangladesh National Institute of Education.",
    canonicalPath: "/?page=online-admission",
    breadcrumbName: "Online Admission"
  },
  accreditation: {
    title: "Government Institutional License & Recognition (1996) | BNIE",
    description: "Official Government Institutional License (BNIE/GOV-LIC/1996/0715), statutory approval (15 July 1996), and institutional registry of Bangladesh National Institute of Education (BNIE).",
    canonicalPath: "/?page=accreditation",
    breadcrumbName: "Government Approval & Recognition"
  },
  services: {
    title: "BNIE Student Services & Portal | Academic Verification (শিক্ষার্থী সেবা)",
    description: "Comprehensive student services at BNIE: certificate verification, marksheet checking, academic records, transcript issuance, and student support.",
    canonicalPath: "/?page=services",
    breadcrumbName: "Student Services"
  },
  notices: {
    title: "BNIE Examination Results, Notices & Academic Circulars (নোটিশ)",
    description: "Latest examination results, notice circulars, examination schedules, and academic announcements from Bangladesh National Institute of Education (BNIE).",
    canonicalPath: "/?page=notices",
    breadcrumbName: "Notices"
  },
  "research-publications": {
    title: "Research, Journals & Publications | BNIE",
    description: "Academic journals, scholarly research, conference proceedings, and faculty publications from Bangladesh National Institute of Education.",
    canonicalPath: "/?page=research-publications",
    breadcrumbName: "Research Publications"
  },
  "regional-centers": {
    title: "Regional Resource Centers | BNIE",
    description: "Divisional and regional learning centers, academic support hubs, and liaison points of Bangladesh National Institute of Education across Bangladesh.",
    canonicalPath: "/?page=regional-centers",
    breadcrumbName: "Regional Centers"
  },
  leadership: {
    title: "Leadership & Administration | BNIE",
    description: "Governing body, Academic Council, Syndicate, and administrative leadership of Bangladesh National Institute of Education (BNIE).",
    canonicalPath: "/?page=leadership",
    breadcrumbName: "Leadership & Governance"
  },
  "student-handbooks": {
    title: "BNIE Student Handbooks & Academic Records (শিক্ষার্থী হ্যান্ডবুক)",
    description: "Download official student handbooks, examination codes of conduct, grading guidelines, and academic rules of BNIE Bangladesh.",
    canonicalPath: "/?page=student-handbooks",
    breadcrumbName: "Student Handbooks"
  },
  "vc-message": {
    title: "Message from the Vice-Chancellor | BNIE",
    description: "Executive address and strategic educational vision from the Vice-Chancellor of Bangladesh National Institute of Education.",
    canonicalPath: "/?page=vc-message",
    breadcrumbName: "Vice-Chancellor Message"
  },
  "complaints-services": {
    title: "Citizen Charter & Grievance Redress | BNIE",
    description: "Student grievance redressal system, citizen charter, and service dispute resolution cell at BNIE.",
    canonicalPath: "/?page=complaints-services",
    breadcrumbName: "Citizen Charter"
  },
  "help-center": {
    title: "BNIE Help Center & FAQs | Result & Certificate Check (সহায়তা)",
    description: "Help Center: how to check BNIE result, verify certificates online, degree marksheets, and answers to student questions at Bangladesh National Institute of Education.",
    canonicalPath: "/?page=help-center",
    breadcrumbName: "Help Center"
  },
  "privacy-policy": {
    title: "Privacy Policy & Data Protection | BNIE",
    description: "Student data privacy principles, verification record security, and digital privacy policy of Bangladesh National Institute of Education.",
    canonicalPath: "/?page=privacy-policy",
    breadcrumbName: "Privacy Policy"
  },
  "terms-conditions": {
    title: "Terms of Service & Usage Conditions | BNIE",
    description: "Terms of service governing use of the BNIE portal, online certificate verification, and institutional digital resources.",
    canonicalPath: "/?page=terms-conditions",
    breadcrumbName: "Terms & Conditions"
  },
  "osaps-login": {
    title: "OSAPS Online Student Access Portal | BNIE",
    description: "Student login portal for OSAPS course registration, marksheet checks, and student records at BNIE.",
    canonicalPath: "/?page=osaps-login",
    breadcrumbName: "OSAPS Student Portal"
  },
  ebook: {
    title: "Digital E-Library & Academic Resources | BNIE",
    description: "Open educational resources, lecture textbooks, and course syllabus readers for BNIE students.",
    canonicalPath: "/?page=ebook",
    breadcrumbName: "E-Library"
  },
  "web-email": {
    title: "Institutional Webmail Gateway | BNIE",
    description: "Official webmail and communication gateway for BNIE students, faculty, and administrative staff.",
    canonicalPath: "/?page=web-email",
    breadcrumbName: "Webmail"
  },
  courses: {
    title: "BNIE Polytechnic Diploma Engineering Programs (পলিটেকনিক ডিপ্লোমা)",
    description: "1-Year to 4-Year Polytechnic Diploma in Engineering (Civil, Electrical, Mechanical, Computer) at Bangladesh National Institute of Education (BNIE Bangladesh).",
    canonicalPath: "/?page=courses",
    breadcrumbName: "Diploma Courses"
  },
  specializations: {
    title: "Vocational & Professional Specializations | BNIE",
    description: "Explore vocational trade certifications, skill development tracks, and technology programs at BNIE.",
    canonicalPath: "/?page=specializations",
    breadcrumbName: "Vocational Specializations"
  },
  "admin-login": {
    title: "Administrative Registry Console | BNIE",
    description: "Secure credential management console for authorized BNIE registry officers only.",
    canonicalPath: "/?page=admin-login",
    breadcrumbName: "Admin Registry",
    noIndex: true
  }
};

export default function App() {
  // Navigation State with full browser refresh and URL parameter persistence
  const [currentPage, setCurrentPage] = useState<string>(getInitialPage);

  // Side Drawer state (The only intended overlay in this navigation design)
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);

  // Selected program for online admission preselection
  const [selectedAdmissionProgram, setSelectedAdmissionProgram] = useState<string>("mech_4y");

  // Leadership & Administration section state
  const [leadershipSection, setLeadershipSection] = useState<LeadershipSectionId>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const sec = params.get("section") as LeadershipSectionId | null;
      if (sec) return sec;
    }
    return "vice-chancellor";
  });

  // Database Loading state
  const [isDbLoading, setIsDbLoading] = useState(true);
  
  // Database State - seeded with default students, persistent in localStorage as secondary backup
  const [students, setStudents] = useState<Student[]>(() => {
    let saved = localStorage.getItem("bnie_students");
    if (!saved) {
      saved = localStorage.getItem("bisd_students");
    }
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved students", e);
      }
    }
    return DEFAULT_STUDENTS;
  });

  // Load and sync with Cloud Firestore on mount
  useEffect(() => {
    async function syncCloudDatabase() {
      try {
        setIsDbLoading(true);
        const cloudStudents = await seedDatabaseIfEmpty();
        setStudents(cloudStudents);
      } catch (error) {
        console.error("Failed to sync cloud database. Fallback to local storage remains active.", error);
      } finally {
        setIsDbLoading(false);
      }
    }
    syncCloudDatabase();
  }, []);

  // Homepage CMS Content & Visibility settings from persistent Firestore database
  const [homepageSettings, setHomepageSettings] = useState<HomepageContentSettings>(getLocalHomepageSettings);

  useEffect(() => {
    fetchHomepageSettings().then((s) => {
      setHomepageSettings(s);
    }).catch((err) => {
      console.warn("Could not initial load homepage settings:", err);
    });

    const unsubscribe = subscribeHomepageSettings((updated) => {
      setHomepageSettings(updated);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Track currently selected/verified student for the Report view
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Synchronize student ledger changes to localStorage as a robust hybrid/secondary backup
  useEffect(() => {
    localStorage.setItem("bnie_students", JSON.stringify(students));
  }, [students]);

  // Handle auto-routing for QR code scans
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const path = window.location.pathname.toLowerCase();
    const pageParam = params.get("page");
    if (path.includes("/degree-marksheet-result") || path.includes("/degree-result") || pageParam === "degree-marksheet-result") {
      setCurrentPage("degree-marksheet-result");
      return;
    }
    const hasVerifyPath = path.includes("/verify") || path.includes("/certificate") || path.includes("/record");
    if (params.get("token") || params.get("id") || params.get("roll") || params.get("serial") || hasVerifyPath) {
      setCurrentPage("verify");
    }
  }, []);

  // Browser Back/Forward navigation listener for bookmark & refresh consistency
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
        if (event.state.section) {
          setLeadershipSection(event.state.section);
        }
      } else {
        const params = new URLSearchParams(window.location.search);
        const p = params.get("page") || "home";
        setCurrentPage(p);
        const sec = params.get("section") as LeadershipSectionId | null;
        if (sec) {
          setLeadershipSection(sec);
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Handle route navigation smoothly with URL query persistence
  const handleNavigate = (page: string, section?: LeadershipSectionId) => {
    if (section) {
      setLeadershipSection(section);
    }
    setCurrentPage(page);
    try {
      const sectionQuery = section ? `&section=${section}` : "";
      const newUrl = page === "home" ? window.location.pathname : `?page=${page}${sectionQuery}`;
      window.history.pushState({ page, section }, "", newUrl);
    } catch (e) {
      console.warn("Failed to update history state", e);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsSideDrawerOpen(false);
  };

  // Dynamic Route-Based SEO synchronization for Google, Gemini, ChatGPT & AI Search Crawlers
  useEffect(() => {
    if (typeof document === "undefined") return;

    const seo = PAGE_SEO_CONFIG[currentPage] || PAGE_SEO_CONFIG.home;
    const baseOrigin = "https://bnie.edu.bd";
    const canonicalUrl = `${baseOrigin}${seo.canonicalPath}`;

    // 1. Document Title
    document.title = seo.title;

    // 2. Helper to set/update meta tag
    const setMetaTag = (selector: string, attr: "name" | "property", attrVal: string, content: string) => {
      let tag = document.querySelector(selector) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, attrVal);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    setMetaTag('meta[name="title"]', "name", "title", seo.title);
    setMetaTag('meta[name="description"]', "name", "description", seo.description);
    setMetaTag('meta[property="og:title"]', "property", "og:title", seo.title);
    setMetaTag('meta[property="og:description"]', "property", "og:description", seo.description);
    setMetaTag('meta[property="og:url"]', "property", "og:url", canonicalUrl);
    setMetaTag('meta[property="og:image"]', "property", "og:image", `${baseOrigin}/bnie_logo.jpg`);
    setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", seo.title);
    setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", seo.description);
    setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", `${baseOrigin}/bnie_logo.jpg`);

    // 3. Robots directive (block private admin, allow public pages)
    if (seo.noIndex) {
      setMetaTag('meta[name="robots"]', "name", "robots", "noindex, nofollow");
    } else {
      setMetaTag('meta[name="robots"]', "name", "robots", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    }

    // 4. Canonical Link Tag
    let canonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.rel = "canonical";
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.href = canonicalUrl;

    // 5. Dynamic Breadcrumbs Structured Data (JSON-LD)
    let breadcrumbScript = document.getElementById("bnie-route-breadcrumbs") as HTMLScriptElement | null;
    if (!breadcrumbScript) {
      breadcrumbScript = document.createElement("script");
      breadcrumbScript.id = "bnie-route-breadcrumbs";
      breadcrumbScript.type = "application/ld+json";
      document.head.appendChild(breadcrumbScript);
    }

    const breadcrumbsData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseOrigin + "/"
        },
        ...(currentPage !== "home" ? [{
          "@type": "ListItem",
          "position": 2,
          "name": seo.breadcrumbName,
          "item": canonicalUrl
        }] : [])
      ]
    };
    breadcrumbScript.text = JSON.stringify(breadcrumbsData);
  }, [currentPage, leadershipSection]);

  // Callback when student is successfully queried
  const handleVerifySuccess = (student: Student) => {
    setSelectedStudent(student);
    handleNavigate("report");
  };

  // CMS functions with authoritative Firestore cloud persistence and immediate database reload
  const handleStudentFound = (student: Student) => {
    setStudents((prev) => {
      const exists = prev.some((s) => s.id === student.id);
      if (exists) return prev;
      return [student, ...prev];
    });
  };

  const handleAddStudent = async (newStudent: Student): Promise<void> => {
    try {
      // 1. Authoritative write to Firestore
      await addStudentToDb(newStudent);
      
      // 2. Refresh student list directly from persistent database
      try {
        const freshStudents = await fetchAllStudents();
        if (freshStudents && freshStudents.length > 0) {
          setStudents(freshStudents);
          try {
            localStorage.setItem("bnie_students_cloud_cache", JSON.stringify(freshStudents));
          } catch (e) {
            console.warn("Local storage cache write failed:", e);
          }
        } else {
          setStudents((prev) => [newStudent, ...prev]);
        }
      } catch (fetchErr) {
        console.warn("Failed to refresh students list after add, updating local state directly:", fetchErr);
        setStudents((prev) => [newStudent, ...prev]);
      }

      alert(`Successfully registered candidate: ${newStudent.name} (Roll: ${newStudent.rollNumber}, Reg: ${newStudent.registrationNumber}) permanently to the database.`);
    } catch (error) {
      console.error("Failed to save student permanently to Firestore:", error);
      alert(`Database Error: Could not save student to the persistent database. ${error instanceof Error ? error.message : "Please check your network and try again."}`);
      throw error;
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student): Promise<void> => {
    try {
      // 1. Authoritative update in Firestore
      await updateStudentInDb(updatedStudent);

      // 2. Refresh student list directly from persistent database
      try {
        const freshStudents = await fetchAllStudents();
        if (freshStudents && freshStudents.length > 0) {
          setStudents(freshStudents);
          try {
            localStorage.setItem("bnie_students_cloud_cache", JSON.stringify(freshStudents));
          } catch (e) {
            console.warn("Local storage cache write failed:", e);
          }
        } else {
          setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
        }
      } catch (fetchErr) {
        console.warn("Failed to refresh students list after update, updating local state directly:", fetchErr);
        setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
      }

      alert(`Successfully updated record for: ${updatedStudent.name}`);
    } catch (error) {
      console.error("Failed to update student in Firestore:", error);
      alert(`Database Error: Could not update student in persistent database. ${error instanceof Error ? error.message : ""}`);
      throw error;
    }
  };

  const handleDeleteStudent = async (id: string): Promise<void> => {
    try {
      await deleteStudentFromDb(id);
      try {
        const freshStudents = await fetchAllStudents();
        setStudents(freshStudents);
        try {
          localStorage.setItem("bnie_students_cloud_cache", JSON.stringify(freshStudents));
        } catch (e) {
          console.warn("Local storage cache write failed:", e);
        }
      } catch (fetchErr) {
        console.warn("Failed to refresh students list after delete, filtering local state:", fetchErr);
        setStudents((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete student from Firestore:", error);
      alert(`Database Error: Could not delete student from persistent database.`);
      throw error;
    }
  };

  const handleViewStudentFromAdmin = (student: Student) => {
    setSelectedStudent(student);
    handleNavigate("report");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans selection:bg-[#006a4e]/20 selection:text-[#006a4e] w-full max-w-full overflow-x-hidden print:min-w-0">
      
      {/* Webpage contents layout wrapper */}
      <div className="flex-1 flex flex-col">

      {/* Main Professional Educational Header with Logo on Left and Three-Line Menu on Far Right */}
      <Header 
        onNavigate={handleNavigate} 
        onOpenDrawer={() => setIsSideDrawerOpen(true)}
        isDbLoading={isDbLoading}
      />

      {/* Page Content Body (Dynamic Full-Page Router) */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          
          {/* 1. HOME PAGE ROUTE */}
          {currentPage === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Hero 
                homepageSettings={homepageSettings}
                onOpenVcMessage={() => handleNavigate("vc-message")}
                onOpenResults={() => handleNavigate("verify")}
                onOpenDegreeResults={() => handleNavigate("degree-marksheet-result")}
                onOpenComplaints={() => handleNavigate("complaints-services")}
                onOpenFindProgram={() => handleNavigate("find-program")}
                onOpenHandbooks={() => handleNavigate("student-handbooks")}
                onOpenAdmission={() => handleNavigate("online-admission")}
                onOpenOsaps={() => handleNavigate("osaps-login")}
                onOpenEbook={() => handleNavigate("ebook")}
                onOpenWebmail={() => handleNavigate("web-email")}
              />
              {homepageSettings.isAccreditationVisible !== false && <GovernmentAccreditation />}
              {homepageSettings.isDegreeProgramsVisible !== false && (
                <DegreeProgramsSection 
                  onNavigateToDegreeVerify={() => handleNavigate("degree-marksheet-result")}
                  onNavigateToAdmission={(code) => {
                    if (code) setSelectedAdmissionProgram(code);
                    handleNavigate("online-admission");
                  }}
                  onNavigateToFindProgram={() => handleNavigate("find-program")}
                />
              )}
              {homepageSettings.isVocationalVisible !== false && <VocationalSpecialization />}
              {homepageSettings.isDiplomaStreamsVisible !== false && <DiplomaStreams />}
              {homepageSettings.isMissionServicesVisible !== false && <MissionAndServices />}
              <Contact />
            </motion.div>
          )}

          {/* 2. FIND PROGRAM FULL PAGE ROUTE */}
          {currentPage === "find-program" && (
            <motion.div
              key="find-program"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <FindProgramPage
                onBackToHome={() => handleNavigate("home")}
                onNavigateToAdmission={(code) => {
                  if (code) setSelectedAdmissionProgram(code);
                  handleNavigate("online-admission");
                }}
                onNavigateToVerify={() => handleNavigate("verify")}
              />
              <Contact />
            </motion.div>
          )}

          {/* 3. STUDENT HANDBOOKS FULL PAGE ROUTE (Limited Availability) */}
          {currentPage === "student-handbooks" && (
            <motion.div
              key="student-handbooks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <StudentHandbooksPage
                onBackToHome={() => handleNavigate("home")}
                onNavigateToCourses={() => handleNavigate("courses")}
                onNavigateToVerify={() => handleNavigate("verify")}
              />
              <Contact />
            </motion.div>
          )}

          {/* 4. ONLINE ADMISSION FULL PAGE ROUTE */}
          {currentPage === "online-admission" && (
            <motion.div
              key="online-admission"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <OnlineAdmissionPage
                onBackToHome={() => handleNavigate("home")}
                onNavigateToCourses={() => handleNavigate("courses")}
                initialProgram={selectedAdmissionProgram}
              />
              <Contact />
            </motion.div>
          )}

          {/* 5. OSAPS STUDENT LOGIN FULL PAGE ROUTE */}
          {currentPage === "osaps-login" && (
            <motion.div
              key="osaps-login"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <OsapsLoginPage
                students={students}
                onBackToHome={() => handleNavigate("home")}
                onNavigateToVerify={(student) => {
                  if (student) {
                    setSelectedStudent(student);
                    handleNavigate("report");
                  } else {
                    handleNavigate("verify");
                  }
                }}
                onNavigateToAdmin={() => handleNavigate("admin-login")}
              />
              <Contact />
            </motion.div>
          )}

          {/* 6. E-BOOK DIGITAL LIBRARY FULL PAGE ROUTE (Limited Availability) */}
          {currentPage === "ebook" && (
            <motion.div
              key="ebook"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <EbookPage
                onBackToHome={() => handleNavigate("home")}
                onNavigateToCourses={() => handleNavigate("courses")}
              />
              <Contact />
            </motion.div>
          )}

          {/* 7. WEB EMAIL FULL PAGE ROUTE */}
          {currentPage === "web-email" && (
            <motion.div
              key="web-email"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <WebEmailPage
                onBackToHome={() => handleNavigate("home")}
              />
              <Contact />
            </motion.div>
          )}

          {/* 8. RESEARCH & PUBLICATIONS FULL PAGE ROUTE */}
          {currentPage === "research-publications" && (
            <motion.div
              key="research-publications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ResearchPublicationsPage
                onBackToHome={() => handleNavigate("home")}
                onNavigateToEbooks={() => handleNavigate("ebook")}
              />
              <Contact />
            </motion.div>
          )}

          {/* 9. NOTICES & ANNOUNCEMENTS FULL PAGE ROUTE */}
          {currentPage === "notices" && (
            <motion.div
              key="notices"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <NoticesPage
                onBackToHome={() => handleNavigate("home")}
                onNavigateToVerify={() => handleNavigate("verify")}
              />
              <Contact />
            </motion.div>
          )}

          {/* 10. REGIONAL CENTERS FULL PAGE ROUTE */}
          {currentPage === "regional-centers" && (
            <motion.div
              key="regional-centers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <RegionalCentersPage
                onBackToHome={() => handleNavigate("home")}
                onNavigateToContact={() => handleNavigate("help")}
              />
              <Contact />
            </motion.div>
          )}

          {/* SPECIALIZATIONS PAGE ROUTE */}
          {currentPage === "specializations" && (
            <motion.div
              key="specializations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Specializations
                onBackToHome={() => handleNavigate("home")}
              />
              <Contact />
            </motion.div>
          )}

          {/* DIPLOMA COURSES PAGE ROUTE */}
          {currentPage === "courses" && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <DiplomaCourses
                onBackToHome={() => handleNavigate("home")}
                onNavigateToVerify={() => handleNavigate("verify")}
              />
              <Contact />
            </motion.div>
          )}

          {/* OUR SERVICES PAGE ROUTE */}
          {currentPage === "services" && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ServicesPage
                onBackToHome={() => handleNavigate("home")}
                onNavigateToVerify={() => handleNavigate("verify")}
                onNavigateToCourses={() => handleNavigate("courses")}
                onNavigateToSpecializations={() => handleNavigate("specializations")}
                onNavigateToHelp={() => handleNavigate("help")}
              />
              <Contact />
            </motion.div>
          )}

          {/* GOVERNMENT ACCREDITATION PAGE ROUTE */}
          {currentPage === "accreditation" && (
            <motion.div
              key="accreditation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="py-6 px-4 max-w-7xl mx-auto">
                <button
                  onClick={() => handleNavigate("home")}
                  className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer group mb-2"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span>Return to Home Portal</span>
                </button>
              </div>
              <GovernmentAccreditation />
              <Contact />
            </motion.div>
          )}

          {/* PRIVACY POLICY PAGE ROUTE */}
          {currentPage === "privacy" && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <PrivacyPolicy
                onBackToHome={() => handleNavigate("home")}
                onNavigateToContact={() => handleNavigate("help")}
              />
              <Contact />
            </motion.div>
          )}

          {/* TERMS & CONDITIONS PAGE ROUTE */}
          {currentPage === "terms" && (
            <motion.div
              key="terms"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TermsAndConditions
                onBackToHome={() => handleNavigate("home")}
                onNavigateToVerify={() => handleNavigate("verify")}
              />
              <Contact />
            </motion.div>
          )}

          {/* HELP CENTER PAGE ROUTE */}
          {currentPage === "help" && (
            <motion.div
              key="help"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <HelpCenter
                onBackToHome={() => handleNavigate("home")}
                onNavigateToVerify={() => handleNavigate("verify")}
              />
              <Contact />
            </motion.div>
          )}

          {/* VERIFY PAGE ROUTE */}
          {currentPage === "verify" && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="py-8 bg-gray-50/50">
                <VerificationForm 
                  students={students} 
                  onVerifySuccess={handleVerifySuccess} 
                  isDbLoading={isDbLoading}
                  onNavigateToDegreeVerify={() => handleNavigate("degree-marksheet-result")}
                  onStudentFound={handleStudentFound}
                />
              </div>
              <Contact />
            </motion.div>
          )}

          {/* DEGREE / HONOURS / MASTERS FULL MARKSHEET RESULT ROUTE */}
          {currentPage === "degree-marksheet-result" && (
            <motion.div
              key="degree-marksheet-result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <DegreeResultVerificationPage
                students={students}
                isDbLoading={isDbLoading}
                onBackToHome={() => handleNavigate("home")}
                onNavigateToAdmin={() => handleNavigate("admin-login")}
                onNavigateToSscHscVerify={() => handleNavigate("verify")}
                onStudentFound={handleStudentFound}
              />
              <Contact />
            </motion.div>
          )}

          {/* REPORT PAGE ROUTE */}
          {currentPage === "report" && selectedStudent && (
            <motion.div
              key="report"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <VerificationReport 
                student={selectedStudent} 
                onBack={() => {
                  handleNavigate("verify");
                }} 
              />
            </motion.div>
          )}

          {/* ADMIN CONSOLE ROUTE */}
          {currentPage === "admin-login" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Back Button for Admin Page */}
              <div className="max-w-7xl mx-auto px-4 pt-6 no-print">
                <button
                  onClick={() => handleNavigate("home")}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-gray-500 hover:text-gray-900 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Home Portal</span>
                </button>
              </div>

              <AdminPanel
                students={students}
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
                onViewStudent={handleViewStudentFromAdmin}
              />
            </motion.div>
          )}

          {/* VICE-CHANCELLOR WELCOME MESSAGE ROUTE (উপাচার্যের শুভেচ্ছাপত্র) */}
          {currentPage === "vc-message" && (
            <motion.div
              key="vc-message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ViceChancellorMessage
                onBackToHome={() => handleNavigate("home")}
                onNavigateToVerify={() => handleNavigate("verify")}
                onNavigateToCourses={() => handleNavigate("courses")}
              />
              <Contact />
            </motion.div>
          )}

          {/* COMPLAINTS & STUDENT SERVICES ROUTE (অভিযোগ ও সেবা) */}
          {currentPage === "complaints-services" && (
            <motion.div
              key="complaints-services"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ComplaintsAndServices
                onBackToHome={() => handleNavigate("home")}
                onNavigateToVerify={() => handleNavigate("verify")}
                onNavigateToHelp={() => handleNavigate("help")}
              />
              <Contact />
            </motion.div>
          )}

          {/* LEADERSHIP & INSTITUTIONAL GOVERNANCE ROUTE */}
          {currentPage === "leadership-admin" && (
            <motion.div
              key="leadership-admin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <LeadershipAdministrationPage
                initialSection={leadershipSection}
                onBackToHome={() => handleNavigate("home")}
                onNavigateToVcMessage={() => handleNavigate("vc-message")}
                onNavigateToRegionalCenters={() => handleNavigate("regional-centers")}
                onNavigateToContact={() => handleNavigate("help")}
                onNavigateToVerify={() => handleNavigate("verify")}
              />
              <Contact />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Official Government footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Scrollable Side Drawer Overlay (Only intended overlay) */}
      <SideDrawer
        isOpen={isSideDrawerOpen}
        onClose={() => setIsSideDrawerOpen(false)}
        onNavigate={handleNavigate}
        currentPage={currentPage}
        currentSection={leadershipSection}
      />

      </div>
    </div>
  );
}
