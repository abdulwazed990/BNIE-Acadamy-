import React, { useState } from "react";
import { 
  FlaskConical, 
  Briefcase, 
  BookOpen, 
  Cpu, 
  Zap, 
  Hammer, 
  Scissors, 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  Search, 
  School,
  ArrowRight
} from "lucide-react";
import { motion } from "motion/react";

interface SpecializationItem {
  id: string;
  level: "SSC" | "HSC" | "Vocational";
  groupName: string;
  bengaliName: string;
  icon: React.ComponentType<any>;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  iconColor: string;
  description: string;
  bengaliDescription: string;
  eligibility: string;
  duration: string;
  coreSubjects: string[];
  careerPaths: string[];
}

const SPECIALIZATIONS: SpecializationItem[] = [
  // ==================== SSC SPECIALIZATIONS ====================
  {
    id: "ssc-science",
    level: "SSC",
    groupName: "Science Group",
    bengaliName: "বিজ্ঞান বিভাগ",
    icon: FlaskConical,
    accentColor: "text-blue-600",
    bgColor: "bg-blue-50/50",
    borderColor: "border-blue-100",
    iconColor: "bg-blue-100 text-blue-700",
    description: "Focuses on developing analytical thinking, scientific inquiry, and fundamental knowledge in physical and natural sciences.",
    bengaliDescription: "ভৌত এবং প্রাকৃতিক বিজ্ঞানসমূহে বিশ্লেষণাত্মক চিন্তা, বৈজ্ঞানিক অনুসন্ধান এবং মৌলিক জ্ঞান বিকাশে সাহায্য করে।",
    eligibility: "Completion of Class VIII / JSC or equivalent",
    duration: "2 Years",
    coreSubjects: ["Physics (পদার্থবিজ্ঞান)", "Chemistry (রসায়ন)", "Biology (জীববিজ্ঞান)", "Higher Mathematics (উচ্চতর গণিত)", "Mathematics", "ICT", "Bangla & English"],
    careerPaths: ["Engineering Foundations", "Medical & Nursing prep", "Higher Secondary Science (HSC)", "Technical Diplomas"]
  },
  {
    id: "ssc-humanities",
    level: "SSC",
    groupName: "Humanities Group",
    bengaliName: "মানবিক বিভাগ",
    icon: BookOpen,
    accentColor: "text-amber-600",
    bgColor: "bg-amber-50/50",
    borderColor: "border-amber-100",
    iconColor: "bg-amber-100 text-amber-700",
    description: "Explores history, society, geography, civics, and human culture, nurturing critical thinking and public awareness.",
    bengaliDescription: "ইতিহাস, সমাজ, ভূগোল, পৌরনীতি এবং মানব সংস্কৃতি নিয়ে আলোচনা করে, যা সমালোচনামূলক চিন্তা এবং জনসচেতনতা বৃদ্ধি করে।",
    eligibility: "Completion of Class VIII / JSC or equivalent",
    duration: "2 Years",
    coreSubjects: ["History of Bangladesh & World Civilization", "Geography & Environment", "Civics & Citizenship", "Economics (অর্থনীতি)", "Mathematics", "ICT", "Bangla & English"],
    careerPaths: ["Public Administration", "Law & Legal Studies prep", "HSC Humanities", "Social Services"]
  },
  {
    id: "ssc-business",
    level: "SSC",
    groupName: "Business Studies Group",
    bengaliName: "ব্যবসায় শিক্ষা বিভাগ",
    icon: Briefcase,
    accentColor: "text-emerald-600",
    bgColor: "bg-emerald-50/50",
    borderColor: "border-emerald-100",
    iconColor: "bg-emerald-100 text-emerald-700",
    description: "Introduces basic business principles, standard double-entry bookkeeping, and foundational economic concepts.",
    bengaliDescription: "প্রাথমিক ব্যবসায়িক নীতিসমূহ, স্ট্যান্ডার্ড ডাবল-এন্ট্রি বুককিপিং এবং মৌলিক অর্থনৈতিক ধারণাগুলোর সাথে পরিচয় করায়।",
    eligibility: "Completion of Class VIII / JSC or equivalent",
    duration: "2 Years",
    coreSubjects: ["Accounting (হিসাববিজ্ঞান)", "Finance & Banking", "Business Entrepreneurship (ব্যবসায় উদ্যোগ)", "Mathematics", "ICT", "Bangla & English"],
    careerPaths: ["Banking & Auditing prep", "Business Administration", "HSC Business Studies", "Entrepreneurship"]
  },

  // ==================== HSC SPECIALIZATIONS ====================
  {
    id: "hsc-science",
    level: "HSC",
    groupName: "Science Group",
    bengaliName: "বিজ্ঞান বিভাগ",
    icon: FlaskConical,
    accentColor: "text-sky-600",
    bgColor: "bg-sky-50/50",
    borderColor: "border-sky-100",
    iconColor: "bg-sky-100 text-sky-700",
    description: "Advanced theoretical and practical training in Physics, Chemistry, Biology, and Mathematics, paving the way for professional university degrees.",
    bengaliDescription: "পদার্থবিজ্ঞান, রসায়ন, জীববিজ্ঞান এবং গণিতে উন্নত তাত্ত্বিক ও ব্যবহারিক প্রশিক্ষণ, যা বিশ্ববিদ্যালয়ে পেশাদার ডিগ্রির পথ সুগম করে।",
    eligibility: "SSC (Science) or equivalent passed",
    duration: "2 Years",
    coreSubjects: ["Physics 1st & 2nd Paper", "Chemistry 1st & 2nd Paper", "Higher Mathematics / Biology", "Bangla, English & ICT"],
    careerPaths: ["Engineering (BUET/RUET/etc.)", "Medical College (MBBS)", "B.Sc. in Physics/Chemistry/CSE", "Architectural Programs"]
  },
  {
    id: "hsc-humanities",
    level: "HSC",
    groupName: "Humanities Group",
    bengaliName: "মানবিক বিভাগ",
    icon: BookOpen,
    accentColor: "text-orange-600",
    bgColor: "bg-orange-50/50",
    borderColor: "border-orange-100",
    iconColor: "bg-orange-100 text-orange-700",
    description: "In-depth studies of social sciences, public policy, logical reasoning, and cultural heritage for civil leadership.",
    bengaliDescription: "নাগরিক নেতৃত্বের জন্য সামাজিক বিজ্ঞান, সরকারি নীতি, যৌক্তিক চিন্তাধারা এবং সাংস্কৃতিক ঐতিহ্যের গভীর অধ্যয়ন।",
    eligibility: "SSC (Any Group) or equivalent passed",
    duration: "2 Years",
    coreSubjects: ["Logic (যুক্তিবিদ্যা)", "Economics (অর্থনীতি)", "Civics & Good Governance", "Islamic History & Culture / History", "Bangla, English & ICT"],
    careerPaths: ["Law (LL.B)", "Public Service (BCS prep)", "Sociology / International Relations", "Journalism & Media"]
  },
  {
    id: "hsc-business",
    level: "HSC",
    groupName: "Business Studies Group",
    bengaliName: "ব্যবসায় শিক্ষা বিভাগ",
    icon: Briefcase,
    accentColor: "text-teal-600",
    bgColor: "bg-teal-50/50",
    borderColor: "border-teal-100",
    iconColor: "bg-teal-100 text-teal-700",
    description: "Detailed corporate business curriculum focusing on advanced accounting, managerial logistics, banking operations, and marketing principles.",
    bengaliDescription: "উন্নত হিসাববিজ্ঞান, ব্যবস্থাপকীয় লজিস্টিকস, ব্যাংকিং কার্যক্রম এবং বিপণন নীতির উপর দৃষ্টি নিবদ্ধ করে বিস্তারিত করপোরেট ব্যবসায়িক শিক্ষাক্রম।",
    eligibility: "SSC (Business/Any) or equivalent passed",
    duration: "2 Years",
    coreSubjects: ["Accounting 1st & 2nd Paper", "Business Organization & Management", "Finance, Banking & Insurance", "Production Management & Marketing", "Bangla, English & ICT"],
    careerPaths: ["Chartered Accountancy (CA)", "BBA / MBA Degrees", "Banking & Investment Analyst", "Supply Chain Management"]
  }
];

export default function Specializations({ onBackToHome }: { onBackToHome: () => void }) {
  const [selectedLevel, setSelectedLevel] = useState<"ALL" | "SSC" | "HSC">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSpecializations = SPECIALIZATIONS.filter((spec) => {
    const matchesLevel = selectedLevel === "ALL" || spec.level === selectedLevel;
    const matchesSearch = 
      spec.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spec.bengaliName.includes(searchQuery) ||
      spec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spec.coreSubjects.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen pb-16">
      {/* Page Header Accent */}
      <div className="bg-gray-50 border-y border-gray-200/80 py-10 no-print">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-[#006a4e]/10 text-[#006a4e] text-xs font-bold px-3.5 py-1 rounded-full mb-3 uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Academic Directory</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight font-sans">
                SSC & HSC Specializations
              </h1>
              <p className="text-gray-500 text-xs md:text-sm mt-1.5 max-w-2xl font-medium">
                Official listing of secondary and higher secondary academic groups under the People's Republic of Bangladesh.
              </p>
            </div>
            
            <button
              onClick={onBackToHome}
              className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold shadow-2xs hover:shadow-xs transition-all shrink-0 cursor-pointer"
            >
              <School className="w-4 h-4 text-emerald-600" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="max-w-7xl mx-auto px-4 mt-8 no-print">
        <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-3xs flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Level Filter Tabs */}
          <div className="flex flex-wrap gap-1 bg-gray-100 p-1.5 rounded-xl w-full md:w-auto">
            {(["ALL", "SSC", "HSC"] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedLevel === lvl
                    ? "bg-[#006a4e] text-white shadow-3xs"
                    : "text-gray-600 hover:text-gray-950 hover:bg-gray-200/50"
                }`}
              >
                {lvl === "ALL" ? "All Divisions" : lvl}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search subjects or trades..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50/50 border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-[#006a4e] focus:bg-white focus:ring-1 focus:ring-[#006a4e]/20 transition-all text-gray-800"
            />
          </div>
        </div>
      </div>

      {/* Main Specializations Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        
        {filteredSpecializations.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-700">No Specializations Found</h3>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSpecializations.map((spec, idx) => {
              const IconComp = spec.icon;
              return (
                <motion.div
                  key={spec.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
                  className={`border rounded-2xl p-6 bg-white transition-all duration-300 shadow-2xs hover:shadow-xs flex flex-col justify-between relative group overflow-hidden ${spec.borderColor} hover:border-[#006a4e]/20`}
                >
                  {/* Decorative Banner Tag */}
                  <div className="absolute top-4 right-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      spec.level === "SSC" ? "bg-blue-100 text-blue-800" :
                      spec.level === "HSC" ? "bg-orange-100 text-orange-800" :
                      "bg-[#006a4e]/10 text-[#006a4e]"
                    }`}>
                      {spec.level}
                    </span>
                  </div>

                  <div>
                    {/* Icon and Group Titles */}
                    <div className="flex items-center space-x-3.5 mb-5">
                      <div className={`p-3 rounded-xl transition-transform group-hover:scale-105 duration-300 ${spec.iconColor}`}>
                        <IconComp className="w-5.5 h-5.5 stroke-[2]" />
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-gray-900 tracking-tight font-sans leading-tight">
                          {spec.groupName}
                        </h4>
                        <span className="text-xs text-[#006a4e] font-bold block mt-0.5">
                          {spec.bengaliName}
                        </span>
                      </div>
                    </div>

                    {/* Descriptions */}
                    <div className="space-y-3 mb-6">
                      <p className="text-xs text-gray-600 leading-relaxed font-normal">
                        {spec.description}
                      </p>
                      <p className="text-xs text-gray-400 italic leading-relaxed font-normal bg-gray-50/50 p-2.5 rounded-lg border border-gray-100/75">
                        {spec.bengaliDescription}
                      </p>
                    </div>

                    {/* Educational Meta Info (Duration & Eligibility) */}
                    <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl space-y-1.5 text-[11px] mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-bold uppercase tracking-wider">Duration</span>
                        <span className="text-gray-800 font-extrabold">{spec.duration}</span>
                      </div>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-gray-400 font-bold uppercase tracking-wider shrink-0">Eligibility</span>
                        <span className="text-gray-700 font-bold truncate text-right" title={spec.eligibility}>
                          {spec.eligibility}
                        </span>
                      </div>
                    </div>

                    <div className="h-px bg-gray-100 mb-5" />

                    {/* Key Specialties Included */}
                    <div className="space-y-2.5">
                      <h5 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest flex items-center space-x-1.5">
                        <Award className="w-3.5 h-3.5 text-[#006a4e]" />
                        <span>Core Curriculum / Specialties</span>
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {spec.coreSubjects.map((sub, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[10px] bg-white text-gray-600 border border-gray-100 px-2 py-0.5 rounded font-semibold hover:border-gray-200 transition-colors shadow-3xs"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Career Scope Section */}
                  <div className="mt-6 pt-5 border-t border-gray-100">
                    <h6 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                      Target Pathways
                    </h6>
                    <ul className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] font-bold text-gray-700">
                      {spec.careerPaths.map((path, pIdx) => (
                        <li key={pIdx} className="flex items-center space-x-1 truncate">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{path}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick FAQ / Note Section */}
      <div className="max-w-7xl mx-auto px-4 mt-16 no-print">
        <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 p-6 rounded-3xl flex flex-col md:flex-row gap-6 items-center">
          <div className="p-4 bg-[#006a4e]/5 rounded-2xl text-[#006a4e] shrink-0">
            <School className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-gray-950 font-sans tracking-tight">
              Looking for Polytechic & Engineering Diplomas?
            </h4>
            <p className="text-xs text-gray-500 mt-1 max-w-3xl leading-relaxed font-medium">
              Information regarding 4-Year Diploma in Engineering, 1-Year Vocational Certifications, or corporate-level skills development can be found on our separate <strong className="text-[#006a4e]">Diploma Courses</strong> page. BNIE keeps secondary and advanced technical listings distinct to help candidates navigate easily.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
