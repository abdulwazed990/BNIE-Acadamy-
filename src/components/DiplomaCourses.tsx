import React, { useState, useMemo } from "react";
import { 
  Search, 
  Calendar, 
  Award, 
  Briefcase, 
  BookOpen, 
  Download, 
  ArrowLeft, 
  CheckCircle2, 
  FileText, 
  Tag, 
  Layers, 
  X, 
  Check, 
  DollarSign, 
  HelpCircle,
  Clock,
  Sparkles,
  Flame,
  Clock3,
  User,
  Phone,
  Mail,
  Home
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DIPLOMA_COURSES, Course } from "../data/coursesData";

function CourseImage({ 
  src, 
  alt, 
  courseName, 
  className, 
  loading = "lazy" 
}: { 
  src: string; 
  alt: string; 
  courseName: string; 
  className?: string; 
  loading?: "lazy" | "eager";
}) {
  const [imgSrc, setImgSrc] = React.useState(src);
  const [hasError, setHasError] = React.useState(false);
  
  React.useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleImageError = () => {
    if (hasError) return;
    setHasError(true);
    const nameLower = courseName.toLowerCase();
    if (nameLower.includes("textile")) {
      // High-quality Textile Engineering fallback placeholder
      setImgSrc("https://images.unsplash.com/photo-1524295981-150193d88a2f?auto=format&fit=crop&q=80&w=600");
    } else if (nameLower.includes("computer") || nameLower.includes("web") || nameLower.includes("ict") || nameLower.includes("software") || nameLower.includes("programming") || nameLower.includes("office")) {
      setImgSrc("https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600");
    } else if (nameLower.includes("civil") || nameLower.includes("architecture") || nameLower.includes("surveying")) {
      setImgSrc("https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=600");
    } else if (nameLower.includes("electrical") || nameLower.includes("electronics") || nameLower.includes("power")) {
      setImgSrc("https://images.unsplash.com/photo-1517055720413-77a282491f6f?auto=format&fit=crop&q=80&w=600");
    } else if (nameLower.includes("mechanical") || nameLower.includes("automobile")) {
      setImgSrc("https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?auto=format&fit=crop&q=80&w=600");
    } else {
      // General professional education placeholder
      setImgSrc("https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600");
    }
  };

  return (
    <img
      src={imgSrc || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600"}
      alt={alt}
      className={className}
      onError={handleImageError}
      loading={loading}
      referrerPolicy="no-referrer"
    />
  );
}

interface DiplomaCoursesProps {
  onBackToHome: () => void;
  onNavigateToVerify: () => void;
}

export default function DiplomaCourses({ onBackToHome, onNavigateToVerify }: DiplomaCoursesProps) {
  // Navigation State: "list" | "details"
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDuration, setSelectedDuration] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Apply Form state
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applyName, setApplyName] = useState("");
  const [applyEmail, setApplyEmail] = useState("");
  const [applyPhone, setApplyPhone] = useState("");
  const [applyAcademicLevel, setApplyAcademicLevel] = useState("HSC");
  const [applySuccessCode, setApplySuccessCode] = useState<string | null>(null);

  // Prospectus state
  const [showProspectusModal, setShowProspectusModal] = useState(false);
  const [prospectusEmail, setProspectusEmail] = useState("");
  const [prospectusDownloaded, setProspectusDownloaded] = useState(false);

  // 1. Featured Courses List (from preloaded flags)
  const featuredCourses = useMemo(() => {
    return DIPLOMA_COURSES.filter(c => c.isFeatured);
  }, []);

  // 2. Popular Courses List (from preloaded flags)
  const popularCourses = useMemo(() => {
    return DIPLOMA_COURSES.filter(c => c.isPopular);
  }, []);

  // 3. Latest Courses List (from preloaded flags)
  const latestCourses = useMemo(() => {
    return DIPLOMA_COURSES.filter(c => c.isLatest);
  }, []);

  // Filtered List
  const filteredCourses = useMemo(() => {
    return DIPLOMA_COURSES.filter((course) => {
      const matchesSearch = 
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.bengaliName.includes(searchQuery) ||
        course.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDuration = 
        selectedDuration === "All" || 
        course.durationCategory === selectedDuration;

      const matchesCategory = 
        selectedCategory === "All" || 
        course.category === selectedCategory;

      return matchesSearch && matchesDuration && matchesCategory;
    });
  }, [searchQuery, selectedDuration, selectedCategory]);

  // Related suggestions in details view (Exclude selected, match either category or duration)
  const relatedCourses = useMemo(() => {
    if (!selectedCourse) return [];
    return DIPLOMA_COURSES.filter(
      (c) => 
        c.id !== selectedCourse.id && 
        (c.category === selectedCourse.category || c.durationCategory === selectedCourse.durationCategory)
    ).slice(0, 3);
  }, [selectedCourse]);

  // Handle Prospectus Submission
  const handleDownloadProspectusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prospectusEmail.trim()) return;
    setProspectusDownloaded(true);
    setTimeout(() => {
      // Simulate download alert
      setProspectusDownloaded(false);
      setShowProspectusModal(false);
      setProspectusEmail("");
      alert(`BNIE Prospectus for "${selectedCourse?.name}" has been sent to ${prospectusEmail}!`);
    }, 1500);
  };

  // Handle Admission Application Submit
  const handleApplyOnlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyName.trim() || !applyEmail.trim() || !applyPhone.trim()) {
      alert("Please fill in all fields.");
      return;
    }
    // Generate a random high security BNIE Registration application number
    const applicationNo = `BNIE-ADM-${Math.floor(100000 + Math.random() * 90000)}`;
    setApplySuccessCode(applicationNo);
  };

  // Handle closing Apply Modal / Form
  const resetApplyForm = () => {
    setShowApplyForm(false);
    setApplyName("");
    setApplyEmail("");
    setApplyPhone("");
    setApplySuccessCode(null);
  };

  return (
    <div className="bg-white min-h-screen text-gray-900 no-print font-sans select-none">
      
      {/* Title Header Ribbon */}
      <div className="bg-gradient-to-r from-[#006a4e] to-emerald-800 text-white py-12 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                Official programs
              </span>
              <span className="text-emerald-200 text-xs font-semibold">• BNIE Dhaka Divisional Office</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold font-sans tracking-tight">
              Diploma Courses & Programs
            </h1>
            <h2 className="text-lg md:text-xl font-medium text-emerald-100 font-sans tracking-normal Bengali-Font">
              ডিপ্লোমা কোর্স ও প্রফেশনাল প্রোগ্রামসমূহ
            </h2>
            <p className="text-xs md:text-sm text-emerald-100/90 max-w-2xl font-light">
              Explore 45 highly accredited Technical, Vocational, and Professional Engineering & Business diplomas designed to align with Bangladesh National Technical and Vocational Qualifications Framework (NTVQF).
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onBackToHome}
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-white/20 flex items-center space-x-1 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Portal Home</span>
            </button>
            <button
              onClick={onNavigateToVerify}
              className="bg-[#f42a41] hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-md flex items-center space-x-1 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-red-100" />
              <span>Verify Certificate</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          
          {/* ==================== LIST VIEW ROUTE ==================== */}
          {!selectedCourse ? (
            <motion.div
              key="list-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              
              {/* SECTION: Featured, Popular, Latest Quick Rails */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Featured Course Spot */}
                <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#006a4e] uppercase tracking-wider flex items-center space-x-1">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Featured Programs</span>
                    </span>
                    <span className="text-[10px] bg-[#006a4e]/10 text-[#006a4e] px-2 py-0.5 rounded-full font-bold">Industry Top</span>
                  </div>
                  <div className="space-y-3">
                    {featuredCourses.slice(0, 3).map((course) => (
                      <div 
                        key={course.id}
                        onClick={() => setSelectedCourse(course)}
                        className="p-3 bg-white hover:bg-emerald-50/50 border border-gray-150 rounded-xl transition-all cursor-pointer flex items-center space-x-3 group"
                      >
                        <CourseImage 
                          src={course.imageUrl} 
                          alt={course.name} 
                          courseName={course.name}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-200" 
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#006a4e] transition-colors truncate">{course.name}</h4>
                          <span className="text-[10px] text-gray-500 block">{course.duration} • Fee: ৳{course.totalFee.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Popular Course Spot */}
                <div className="bg-red-50/30 border border-red-100 rounded-2xl p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center space-x-1">
                      <Flame className="w-4 h-4 text-red-500" />
                      <span>Popular Careers</span>
                    </span>
                    <span className="text-[10px] bg-red-100/50 text-red-700 px-2 py-0.5 rounded-full font-bold">Highly Rated</span>
                  </div>
                  <div className="space-y-3">
                    {popularCourses.slice(0, 3).map((course) => (
                      <div 
                        key={course.id}
                        onClick={() => setSelectedCourse(course)}
                        className="p-3 bg-white hover:bg-red-50/30 border border-gray-150 rounded-xl transition-all cursor-pointer flex items-center space-x-3 group"
                      >
                        <CourseImage 
                          src={course.imageUrl} 
                          alt={course.name} 
                          courseName={course.name}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-200" 
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-gray-900 group-hover:text-red-600 transition-colors truncate">{course.name}</h4>
                          <span className="text-[10px] text-gray-500 block">{course.duration} • Fee: ৳{course.totalFee.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Latest Additions */}
                <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center space-x-1">
                      <Clock3 className="w-4 h-4 text-blue-500" />
                      <span>Latest Semesters</span>
                    </span>
                    <span className="text-[10px] bg-blue-100/40 text-blue-700 px-2 py-0.5 rounded-full font-bold">New Intake</span>
                  </div>
                  <div className="space-y-3">
                    {latestCourses.slice(0, 3).map((course) => (
                      <div 
                        key={course.id}
                        onClick={() => setSelectedCourse(course)}
                        className="p-3 bg-white hover:bg-blue-50/30 border border-gray-150 rounded-xl transition-all cursor-pointer flex items-center space-x-3 group"
                      >
                        <CourseImage 
                          src={course.imageUrl} 
                          alt={course.name} 
                          courseName={course.name}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-200" 
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-gray-900 group-hover:text-blue-700 transition-colors truncate">{course.name}</h4>
                          <span className="text-[10px] text-gray-500 block">{course.duration} • Fee: ৳{course.totalFee.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* SEARCH & FILTERS CONTROLS PANEL */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-5">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
                      <Search className="w-4 h-4 text-[#006a4e]" />
                      <span>Search and Filter Programs</span>
                    </h3>
                    <p className="text-xs text-gray-500">Narrow down from our complete collection of 45 academic programs instantly.</p>
                  </div>
                  
                  {/* Quick stats indicator */}
                  <span className="text-[11px] bg-white border border-gray-200 px-3.5 py-1.5 rounded-full text-gray-600 font-medium self-start lg:self-auto">
                    Showing <strong className="text-gray-950 font-bold">{filteredCourses.length}</strong> of 45 courses
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  
                  {/* Search Input Box */}
                  <div className="md:col-span-5 relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, category or details..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm placeholder-gray-450 text-gray-900 focus:outline-hidden focus:border-[#006a4e] focus:ring-1 focus:ring-[#006a4e]"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Duration Filter dropdown */}
                  <div className="md:col-span-3 relative">
                    <select
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-3 text-xs font-bold text-gray-700 focus:outline-hidden focus:border-[#006a4e] cursor-pointer appearance-none"
                    >
                      <option value="All">⏱️ All Durations</option>
                      <option value="3-Month">3 Months (Certificate)</option>
                      <option value="6-Month">6 Months Diploma</option>
                      <option value="1-Year">1 Year Professional</option>
                      <option value="2-Year">2 Years Higher National</option>
                      <option value="4-Year">4 Years Engineering</option>
                    </select>
                  </div>

                  {/* Category Filter dropdown */}
                  <div className="md:col-span-3">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-3 text-xs font-bold text-gray-700 focus:outline-hidden focus:border-[#006a4e] cursor-pointer appearance-none"
                    >
                      <option value="All">💼 All Sectors & Streams</option>
                      <option value="Technology">Technology / IT</option>
                      <option value="Business">Business & Management</option>
                      <option value="Professional">Professional Skills</option>
                      <option value="Engineering">Engineering Technologies</option>
                      <option value="Vocational">Vocational Trades</option>
                    </select>
                  </div>

                  {/* Clear all Filters */}
                  <div className="md:col-span-1">
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedDuration("All");
                        setSelectedCategory("All");
                      }}
                      className="w-full h-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold rounded-xl transition-all py-3 px-1 flex items-center justify-center cursor-pointer"
                      title="Clear Filters"
                    >
                      Reset
                    </button>
                  </div>

                </div>
              </div>

              {/* MAIN 45-COURSES CARD GRID */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-3">
                  <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
                    Browse Course Directory
                  </h3>
                </div>

                {filteredCourses.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                    <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3 animate-bounce" />
                    <h4 className="text-base font-bold text-gray-900">No Programs Match Your Filters</h4>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">Try resetting the search query or changing filters to look up different diploma programs.</p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedDuration("All");
                        setSelectedCategory("All");
                      }}
                      className="mt-4 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.2) }}
                        className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-gray-300 transition-all group"
                      >
                        {/* Course Image Wrapper */}
                        <div className="relative h-44 bg-gray-100 overflow-hidden shrink-0">
                          <CourseImage
                            src={course.imageUrl}
                            alt={course.name}
                            courseName={course.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          {/* Duration Badge */}
                          <div className="absolute top-3 left-3 bg-white/95 text-gray-900 px-3 py-1 rounded-full text-[10px] font-extrabold shadow-sm uppercase tracking-wider border border-gray-100 flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-[#006a4e]" />
                            <span>{course.duration}</span>
                          </div>
                          
                          {/* Stream Category Badge */}
                          <div className="absolute bottom-3 right-3 bg-[#006a4e] text-white px-2.5 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase shadow-xs">
                            {course.category}
                          </div>
                        </div>

                        {/* Card Contents */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-1.5 text-left">
                            <span className="text-[10px] font-mono text-gray-400 font-semibold block tracking-wider uppercase">
                              ID: {course.id.toUpperCase()}
                            </span>
                            <h3 className="text-base font-bold text-gray-950 group-hover:text-[#006a4e] transition-colors leading-snug">
                              {course.name}
                            </h3>
                            <p className="text-[12px] font-medium text-gray-500 font-sans Bengali-Font italic">
                              {course.bengaliName}
                            </p>
                            <p className="text-xs text-gray-500 leading-relaxed font-light line-clamp-3">
                              {course.shortDescription}
                            </p>
                          </div>

                          <div className="border-t border-gray-150 pt-3.5 space-y-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-400 font-medium">Admission Eligibility:</span>
                              <span className="text-gray-800 font-semibold truncate max-w-[160px]">{course.eligibility}</span>
                            </div>
                            
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-400 font-medium">Certificate Type:</span>
                              <span className="text-gray-800 font-semibold truncate max-w-[160px]" title={course.certificateType}>
                                {course.certificateType}
                              </span>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-2.5 grid grid-cols-2 gap-2 text-center border border-gray-150 mt-1">
                              <div>
                                <span className="text-[10px] text-gray-400 block uppercase font-medium tracking-wide">Enrollment Fee</span>
                                <span className="text-xs font-bold text-gray-900">৳{course.enrollmentFee.toLocaleString()}</span>
                              </div>
                              <div className="border-l border-gray-200">
                                <span className="text-[10px] text-gray-400 block uppercase font-medium tracking-wide">Total Course Fee</span>
                                <span className="text-xs font-extrabold text-[#006a4e]">৳{course.totalFee.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Buttons */}
                        <div className="p-5 pt-0 grid grid-cols-2 gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setSelectedCourse(course)}
                            className="bg-gray-100 hover:bg-gray-250 text-gray-800 font-bold py-2.5 rounded-xl text-[11px] uppercase tracking-wider transition-all cursor-pointer text-center"
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCourse(course);
                              setShowApplyForm(true);
                            }}
                            className="bg-[#006a4e] hover:bg-[#00523c] text-white font-extrabold py-2.5 rounded-xl text-[11px] uppercase tracking-wider transition-all cursor-pointer text-center shadow-xs"
                          >
                            Apply Now
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

            </motion.div>
          ) : (
            
            // ==================== COURSE DETAILS VIEW ====================
            <motion.div
              key="details-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              
              {/* Back Button */}
              <button
                onClick={() => {
                  setSelectedCourse(null);
                  setShowApplyForm(false);
                  setApplySuccessCode(null);
                }}
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to All Courses</span>
              </button>

              {/* Course details top banner card */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-0">
                
                {/* Banner Image */}
                <div className="lg:col-span-5 h-64 lg:h-full relative bg-gray-100 min-h-[250px]">
                  <CourseImage
                    src={selectedCourse.imageUrl}
                    alt={selectedCourse.name}
                    courseName={selectedCourse.name}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute top-4 left-4 bg-[#006a4e] text-white text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider shadow-xs">
                    {selectedCourse.category} Stream
                  </div>
                </div>

                {/* Main Hero information */}
                <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-3 text-left">
                    <span className="text-[11px] font-mono text-[#006a4e] font-bold uppercase tracking-widest block">
                      Program ID: {selectedCourse.id.toUpperCase()}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                      {selectedCourse.name}
                    </h2>
                    <h3 className="text-sm md:text-base font-semibold text-gray-500 font-sans Bengali-Font">
                      {selectedCourse.bengaliName}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-light">
                      {selectedCourse.fullDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-b border-gray-150 py-4 text-left">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-medium tracking-wide">Duration</span>
                      <span className="text-xs font-bold text-gray-900 flex items-center mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-[#006a4e] mr-1 shrink-0" />
                        <span>{selectedCourse.duration}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-medium tracking-wide">Award Title</span>
                      <span className="text-xs font-bold text-gray-900 flex items-center mt-0.5">
                        <Award className="w-3.5 h-3.5 text-emerald-600 mr-1 shrink-0" />
                        <span className="truncate" title={selectedCourse.certificateType}>{selectedCourse.certificateType}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-medium tracking-wide">Enrollment Fee</span>
                      <span className="text-xs font-bold text-gray-900 mt-0.5 block">৳{selectedCourse.enrollmentFee.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-medium tracking-wide">Total Fee</span>
                      <span className="text-xs font-extrabold text-[#006a4e] mt-0.5 block">৳{selectedCourse.totalFee.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => setShowApplyForm(!showApplyForm)}
                      className="bg-[#006a4e] hover:bg-[#00523c] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center space-x-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      <span>{showApplyForm ? "Close Form" : "Apply Online Now"}</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setProspectusDownloaded(false);
                        setShowProspectusModal(true);
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-850 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1.5"
                    >
                      <Download className="w-4 h-4 text-gray-500" />
                      <span>Download Prospectus</span>
                    </button>
                  </div>

                </div>
              </div>

              {/* TWO-COLUMN LAYOUT: DETAILED WORKSHOP ACCORDIONS vs SIDE PANEL */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                
                {/* LEFT SIDE: Application forms OR Curriculum breakdown */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* INTERACTIVE ONLINE APPLICATION FORM (Collapsible overlay / panel) */}
                  {showApplyForm && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-emerald-50/50 border-2 border-[#006a4e]/25 rounded-2xl p-6 space-y-5"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>Online Admission Request Form</span>
                          </h3>
                          <p className="text-[11px] text-[#006a4e] font-semibold">Bangladesh National Institute of Education Admissions Intake</p>
                        </div>
                        <button 
                          onClick={() => resetApplyForm()}
                          className="p-1 rounded-md bg-white hover:bg-red-550 hover:text-white border border-gray-200 text-gray-500 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {!applySuccessCode ? (
                        <form onSubmit={handleApplyOnlineSubmit} className="space-y-4">
                          
                          <div className="bg-white p-3 rounded-xl border border-[#006a4e]/15 text-xs text-gray-600">
                            You are applying for: <strong className="text-gray-900">{selectedCourse.name}</strong> ({selectedCourse.duration}). Upon submission, a regional counselor will call your mobile within 24 hours.
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 uppercase block">Candidate Full Name *</label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="text"
                                  required
                                  value={applyName}
                                  onChange={(e) => setApplyName(e.target.value)}
                                  placeholder="e.g. Mohammad Abdul"
                                  className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-hidden focus:border-[#006a4e]"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 uppercase block">Mobile Helpline Number *</label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="tel"
                                  required
                                  value={applyPhone}
                                  onChange={(e) => setApplyPhone(e.target.value)}
                                  placeholder="e.g. +8801700000000"
                                  className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-hidden focus:border-[#006a4e]"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 uppercase block">Email Address *</label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="email"
                                  required
                                  value={applyEmail}
                                  onChange={(e) => setApplyEmail(e.target.value)}
                                  placeholder="e.g. name@gmail.com"
                                  className="w-full bg-white border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-hidden focus:border-[#006a4e]"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 uppercase block">Last Academic Qualification *</label>
                              <select
                                value={applyAcademicLevel}
                                onChange={(e) => setApplyAcademicLevel(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden focus:border-[#006a4e] cursor-pointer"
                              >
                                <option value="SSC">SSC or Equivalent</option>
                                <option value="HSC">HSC or Equivalent</option>
                                <option value="Diploma">Diploma / Polytechnic</option>
                                <option value="Graduate">Bachelor Degree / Higher</option>
                              </select>
                            </div>
                          </div>

                          <div className="pt-2">
                            <button
                              type="submit"
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm text-center"
                            >
                              Submit Digital Admission request
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="bg-white rounded-xl border border-emerald-200 p-5 text-center space-y-4">
                          <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#006a4e] flex items-center justify-center mx-auto">
                            <Check className="w-6 h-6 stroke-[3]" />
                          </div>
                          
                          <div className="space-y-1">
                            <h4 className="text-sm font-extrabold text-gray-900 uppercase">Application Submitted Successfully!</h4>
                            <p className="text-xs text-gray-500">Your digital enrollment credentials have been securely logged.</p>
                          </div>

                          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 max-w-sm mx-auto">
                            <span className="text-[9px] text-emerald-600 font-bold uppercase block tracking-wider">SECURE ADMISSION RECEIPT CODE</span>
                            <span className="text-sm font-mono font-extrabold text-gray-900">{applySuccessCode}</span>
                          </div>

                          <p className="text-[10px] text-gray-500 max-w-md mx-auto">
                            Please save this application number. Candidate name <strong className="text-gray-900">{applyName}</strong> is now pre-allocated for the upcoming session intake. One of our admission registrars will call <strong className="text-gray-900">{applyPhone}</strong> to verify final documentation.
                          </p>

                          <div className="pt-1.5">
                            <button
                              type="button"
                              onClick={() => resetApplyForm()}
                              className="bg-gray-900 hover:bg-gray-850 text-white text-[11px] font-bold px-4 py-2 rounded-lg cursor-pointer uppercase"
                            >
                              Close Receipt
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Course Syllabus & Curriculum Breakdown */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
                    <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5 pb-2 border-b border-gray-150">
                      <BookOpen className="w-4 h-4 text-[#006a4e]" />
                      <span>Standard Course Syllabus & Modules</span>
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Our modern syllabus is regularly refined with global industrial committees. Below are the core modules trained under this curriculum:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {selectedCourse.curriculum.map((module, i) => (
                        <div key={i} className="flex items-start space-x-2.5 p-3 bg-gray-50 rounded-xl border border-gray-150">
                          <span className="w-5 h-5 rounded-md bg-[#006a4e]/10 text-[#006a4e] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-xs font-semibold text-gray-850">{module}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SEMESTER BREAKDOWN (If 4-Year engineering program is chosen) */}
                  {selectedCourse.semesterBreakdown && (
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
                      <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5 pb-2 border-b border-gray-150">
                        <Layers className="w-4 h-4 text-emerald-600" />
                        <span>Four-Year Semester-wise Subjects Outline</span>
                      </h3>
                      <p className="text-xs text-gray-500">
                        Total 8 academic semesters are mandatory for this engineering diploma including industrial attachments:
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        {selectedCourse.semesterBreakdown.map((sem, index) => (
                          <div key={index} className="p-4 bg-gray-50/50 border border-gray-200 rounded-xl space-y-2">
                            <span className="text-[11px] font-bold text-[#006a4e] uppercase tracking-wider block">
                              📚 {sem.semester}
                            </span>
                            <ul className="space-y-1.5">
                              {sem.subjects.map((sub, j) => (
                                <li key={j} className="text-xs text-gray-700 flex items-start">
                                  <span className="text-[#006a4e] mr-1.5 font-bold">•</span>
                                  <span>{sub}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CAREER OPPORTUNITIES */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
                    <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5 pb-2 border-b border-gray-150">
                      <Briefcase className="w-4 h-4 text-emerald-600" />
                      <span>Employment & Career Opportunities</span>
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Graduates of BNIE certifications enjoy robust recognition across local private and national government projects. Typical entry avenues include:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      {selectedCourse.careerOpportunities.map((career, idx) => (
                        <div key={idx} className="bg-emerald-50/30 border border-emerald-100 p-3 rounded-xl text-center flex flex-col justify-center items-center">
                          <CheckCircle2 className="w-4 h-4 text-[#006a4e] mb-1 shrink-0" />
                          <span className="text-xs font-bold text-gray-900">{career}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* RIGHT SIDE: FEES, INTAKE REQUIREMENTS & BROCHURES */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Admission Intake Requirements */}
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-bold text-gray-950 uppercase tracking-wider flex items-center space-x-1.5 pb-2 border-b border-gray-200">
                      <FileText className="w-4 h-4 text-[#006a4e]" />
                      <span>Admission Prerequisites</span>
                    </h3>
                    
                    <div className="space-y-3.5 text-xs text-gray-750">
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">Educational Standard</span>
                        <p className="font-bold text-gray-900">{selectedCourse.eligibility}</p>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">Documents Required</span>
                        <ul className="space-y-1.5">
                          {selectedCourse.admissionRequirements.map((req, i) => (
                            <li key={i} className="flex items-start text-[11px]">
                              <Check className="w-3.5 h-3.5 text-[#006a4e] mr-1.5 shrink-0 mt-0.5" />
                              <span className="text-gray-700">{req}</span>
                            </li>
                          ))}
                          <li className="flex items-start text-[11px]">
                            <Check className="w-3.5 h-3.5 text-[#006a4e] mr-1.5 shrink-0 mt-0.5" />
                            <span className="text-gray-700">Admission Fee payment receipt</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Financial Installment plan helper */}
                  <div className="bg-[#006a4e]/5 border border-[#006a4e]/15 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-bold text-gray-950 uppercase tracking-wider flex items-center space-x-1.5 pb-2 border-b border-gray-200">
                      <DollarSign className="w-4 h-4 text-[#006a4e]" />
                      <span>Payment Plan & Installments</span>
                    </h3>
                    <p className="text-[11px] text-gray-600 leading-relaxed">
                      We offer flexible semester-wise payment pathways for students in Bangladesh to encourage technical education access.
                    </p>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-150">
                        <span className="text-gray-500 text-[11px]">Admission Booking</span>
                        <span className="font-bold text-gray-900">৳{selectedCourse.enrollmentFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-150">
                        <span className="text-gray-500 text-[11px]">Semester installment</span>
                        <span className="font-bold text-gray-900">
                          ৳{Math.floor((selectedCourse.totalFee - selectedCourse.enrollmentFee) / 2).toLocaleString()} x 2
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                        <span className="text-emerald-800 text-[11px] font-bold">Total Program Cost</span>
                        <span className="font-extrabold text-[#006a4e]">৳{selectedCourse.totalFee.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* SECTION: Related course suggestions */}
              {relatedCourses.length > 0 && (
                <div className="space-y-6 pt-6 border-t border-gray-200">
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
                      Related Diploma Courses
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Students interested in this course also explore these technical and professional diplomas.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedCourses.map((course) => (
                      <div
                        key={course.id}
                        onClick={() => {
                          setSelectedCourse(course);
                          setShowApplyForm(false);
                          setApplySuccessCode(null);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="bg-white border border-gray-250 rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-sm cursor-pointer group"
                      >
                        <div className="h-32 bg-gray-100 overflow-hidden relative">
                          <CourseImage 
                            src={course.imageUrl} 
                            alt={course.name} 
                            courseName={course.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          />
                          <span className="absolute top-2.5 left-2.5 bg-white/95 text-gray-900 text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                            {course.duration}
                          </span>
                        </div>
                        <div className="p-4 space-y-1.5 text-left flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#006a4e] transition-colors line-clamp-1">
                              {course.name}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-mono">ID: {course.id.toUpperCase()}</p>
                            <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-snug">{course.shortDescription}</p>
                          </div>
                          <div className="pt-2 flex items-center justify-between border-t border-gray-100 text-[10px] font-bold">
                            <span className="text-gray-400">Total Fee:</span>
                            <span className="text-[#006a4e]">৳{course.totalFee.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* DETAILED PROSPECTUS DOWNLOAD POPUP MODAL */}
      {showProspectusModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-md w-full overflow-hidden text-left"
          >
            {/* Header Ribbon */}
            <div className="bg-[#006a4e] text-white p-5 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-extrabold text-sm uppercase tracking-wide">Download Official Prospectus</h3>
                <p className="text-[10px] text-emerald-100">National Accreditation Syllabus Manual</p>
              </div>
              <button
                onClick={() => setShowProspectusModal(false)}
                className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-3 bg-emerald-50 p-3.5 rounded-xl border border-emerald-100">
                <FileText className="w-5 h-5 text-[#006a4e] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-gray-900 block">{selectedCourse?.name} Brochure</span>
                  <span className="text-gray-500 text-[11px]">Format: PDF Manual (4.2 MB) • Includes curriculum credit models, grading matrices, and lab details.</span>
                </div>
              </div>

              <form onSubmit={handleDownloadProspectusSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase block">Candidate Email Address</label>
                  <input
                    type="email"
                    required
                    value={prospectusEmail}
                    onChange={(e) => setProspectusEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden focus:border-[#006a4e]"
                  />
                  <span className="text-[10px] text-gray-400 block font-light leading-normal">
                    By submitting, the official educational prospectus download link will also be triggered on your browser immediately.
                  </span>
                </div>

                <div className="flex justify-end space-x-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowProspectusModal(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={prospectusDownloaded}
                    className="bg-[#006a4e] hover:bg-[#00523c] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-1"
                  >
                    {prospectusDownloaded ? (
                      <>
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending Link...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5 text-emerald-200" />
                        <span>Download Now</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
