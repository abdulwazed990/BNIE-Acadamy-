import { SemesterResult, SubjectGrade, getDiplomaGradePointFromMarks, getDiplomaLetterGrade } from "../types";

export interface DegreeCourse {
  subjectCode: string;
  subjectName: string;
  credits: number;
  period: string; // "1st Year", "2nd Year", "3rd Year" or "1st Semester", "2nd Semester", etc.
  defaultMarks?: number;
}

export interface DegreeProgram {
  code: string;
  name: string;
  nameBn: string;
  academicLevel: "Degree Pass" | "Honours" | "Masters";
  department: string;
  duration: string;
  structureType: "Year-wise" | "Semester-wise";
  periods: string[]; // List of Year 1, Year 2... or Semester 1, Semester 2...
  majorSubjects: string[];
  defaultCourses: DegreeCourse[];
}

export const DEGREE_PROGRAMS_CATALOG: DegreeProgram[] = [
  // ==================== DEGREE PASS PROGRAMS (3-Year Annual Structure) ====================
  {
    code: "BA-PASS",
    name: "Bachelor of Arts (B.A. Pass)",
    nameBn: "স্নাতক (পাস) কলা ও মানবিক",
    academicLevel: "Degree Pass",
    department: "Faculty of Arts & Humanities",
    duration: "3 Years",
    structureType: "Year-wise",
    periods: ["1st Year", "2nd Year", "3rd Year"],
    majorSubjects: [
      "Bengali National & Modern Literature",
      "English Language & Communicative English",
      "History of Bangladesh & South Asian Civilization",
      "Islamic Studies & Islamic Civilization",
      "Political Science & Governance",
      "Philosophy & Ethics"
    ],
    defaultCourses: [
      { subjectCode: "BA-101", subjectName: "National Language & Bengali Literature", credits: 4, period: "1st Year", defaultMarks: 78 },
      { subjectCode: "BA-102", subjectName: "English Language & Foundational Writing", credits: 4, period: "1st Year", defaultMarks: 74 },
      { subjectCode: "BA-103", subjectName: "History of the Emergence of Independent Bangladesh", credits: 4, period: "1st Year", defaultMarks: 82 },
      { subjectCode: "BA-201", subjectName: "Major Subject Paper I", credits: 4, period: "2nd Year", defaultMarks: 76 },
      { subjectCode: "BA-202", subjectName: "Major Subject Paper II", credits: 4, period: "2nd Year", defaultMarks: 80 },
      { subjectCode: "BA-203", subjectName: "Social History & Philosophical Thought", credits: 4, period: "2nd Year", defaultMarks: 75 },
      { subjectCode: "BA-301", subjectName: "Major Subject Paper III", credits: 4, period: "3rd Year", defaultMarks: 84 },
      { subjectCode: "BA-302", subjectName: "Major Subject Paper IV (Advanced Studies)", credits: 4, period: "3rd Year", defaultMarks: 81 },
      { subjectCode: "BA-303", subjectName: "Contemporary Socio-Cultural Studies & Comprehensive Viva", credits: 4, period: "3rd Year", defaultMarks: 85 }
    ]
  },
  {
    code: "BSS-PASS",
    name: "Bachelor of Social Science (B.S.S. Pass)",
    nameBn: "স্নাতক (পাস) সামাজিক বিজ্ঞান",
    academicLevel: "Degree Pass",
    department: "Faculty of Social Sciences",
    duration: "3 Years",
    structureType: "Year-wise",
    periods: ["1st Year", "2nd Year", "3rd Year"],
    majorSubjects: [
      "Political Science & Administrative Systems",
      "Sociology & Community Development",
      "Economics & Micro/Macro Analysis",
      "Social Work & Human Welfare",
      "Public Administration & Public Policy"
    ],
    defaultCourses: [
      { subjectCode: "BSS-101", subjectName: "Principles of Social Sciences & Statecraft", credits: 4, period: "1st Year", defaultMarks: 76 },
      { subjectCode: "BSS-102", subjectName: "History of Independent Bangladesh", credits: 4, period: "1st Year", defaultMarks: 80 },
      { subjectCode: "BSS-103", subjectName: "Sociological Perspectives & Social Institutions", credits: 4, period: "1st Year", defaultMarks: 78 },
      { subjectCode: "BSS-201", subjectName: "Major Subject Paper I", credits: 4, period: "2nd Year", defaultMarks: 82 },
      { subjectCode: "BSS-202", subjectName: "Major Subject Paper II", credits: 4, period: "2nd Year", defaultMarks: 79 },
      { subjectCode: "BSS-203", subjectName: "Applied Social Research & Statistics", credits: 4, period: "2nd Year", defaultMarks: 83 },
      { subjectCode: "BSS-301", subjectName: "Major Subject Paper III", credits: 4, period: "3rd Year", defaultMarks: 85 },
      { subjectCode: "BSS-302", subjectName: "Major Subject Paper IV", credits: 4, period: "3rd Year", defaultMarks: 81 },
      { subjectCode: "BSS-303", subjectName: "Governance, Public Policy & Comprehensive Fieldwork", credits: 4, period: "3rd Year", defaultMarks: 86 }
    ]
  },
  {
    code: "BSC-PASS",
    name: "Bachelor of Science (B.Sc. Pass)",
    nameBn: "স্নাতক (পাস) সাধারণ বিজ্ঞান",
    academicLevel: "Degree Pass",
    department: "Faculty of Natural Sciences",
    duration: "3 Years",
    structureType: "Year-wise",
    periods: ["1st Year", "2nd Year", "3rd Year"],
    majorSubjects: [
      "Physics & Applied Physics",
      "Chemistry & Environmental Chemistry",
      "Mathematics & Mathematical Modeling",
      "Botany & Plant Biotechnology",
      "Zoology & Biodiversity Conservation",
      "Computer Science & Information Systems"
    ],
    defaultCourses: [
      { subjectCode: "BSC-101", subjectName: "General Physics & Mechanics", credits: 4, period: "1st Year", defaultMarks: 80 },
      { subjectCode: "BSC-102", subjectName: "Inorganic & Organic Chemistry", credits: 4, period: "1st Year", defaultMarks: 78 },
      { subjectCode: "BSC-103", subjectName: "Calculus & Linear Algebra", credits: 4, period: "1st Year", defaultMarks: 84 },
      { subjectCode: "BSC-201", subjectName: "Major Subject Theory I", credits: 4, period: "2nd Year", defaultMarks: 82 },
      { subjectCode: "BSC-202", subjectName: "Major Subject Theory II", credits: 4, period: "2nd Year", defaultMarks: 81 },
      { subjectCode: "BSC-203", subjectName: "Laboratory Experimentation & Practical Methods I", credits: 4, period: "2nd Year", defaultMarks: 88 },
      { subjectCode: "BSC-301", subjectName: "Major Subject Advanced Paper III", credits: 4, period: "3rd Year", defaultMarks: 85 },
      { subjectCode: "BSC-302", subjectName: "Major Subject Advanced Paper IV", credits: 4, period: "3rd Year", defaultMarks: 83 },
      { subjectCode: "BSC-303", subjectName: "Scientific Project, Practical Lab & Viva Voce", credits: 4, period: "3rd Year", defaultMarks: 90 }
    ]
  },
  {
    code: "BBS-PASS",
    name: "Bachelor of Business Studies (B.B.S. Pass)",
    nameBn: "স্নাতক (পাস) ব্যবসায় শিক্ষা",
    academicLevel: "Degree Pass",
    department: "Faculty of Business Studies",
    duration: "3 Years",
    structureType: "Year-wise",
    periods: ["1st Year", "2nd Year", "3rd Year"],
    majorSubjects: [
      "Accounting & Financial Reporting",
      "Management Studies & Organizational Behavior",
      "Marketing & Consumer Engagement",
      "Finance, Banking & Insurance",
      "Business Mathematics & Applied Statistics"
    ],
    defaultCourses: [
      { subjectCode: "BBS-101", subjectName: "Principles of Accounting", credits: 4, period: "1st Year", defaultMarks: 82 },
      { subjectCode: "BBS-102", subjectName: "Business Organization & Management", credits: 4, period: "1st Year", defaultMarks: 78 },
      { subjectCode: "BBS-103", subjectName: "Business Economics & Commercial Law", credits: 4, period: "1st Year", defaultMarks: 80 },
      { subjectCode: "BBS-201", subjectName: "Major Subject Paper I", credits: 4, period: "2nd Year", defaultMarks: 85 },
      { subjectCode: "BBS-202", subjectName: "Major Subject Paper II", credits: 4, period: "2nd Year", defaultMarks: 81 },
      { subjectCode: "BBS-203", subjectName: "Business Mathematics & Statistics", credits: 4, period: "2nd Year", defaultMarks: 84 },
      { subjectCode: "BBS-301", subjectName: "Major Subject Paper III", credits: 4, period: "3rd Year", defaultMarks: 86 },
      { subjectCode: "BBS-302", subjectName: "Major Subject Paper IV", credits: 4, period: "3rd Year", defaultMarks: 83 },
      { subjectCode: "BBS-303", subjectName: "Corporate Financial Analysis & Comprehensive Viva", credits: 4, period: "3rd Year", defaultMarks: 88 }
    ]
  },

  // ==================== HONOURS PROGRAMS (4-Year 8-Semester Structure) ====================
  {
    code: "ENG-HON",
    name: "Bachelor of Arts (Honours) in English",
    nameBn: "বি.এ. (অনার্স) ইংরেজি বিভাগ",
    academicLevel: "Honours",
    department: "Department of English",
    duration: "4 Years (8 Semesters)",
    structureType: "Semester-wise",
    periods: ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"],
    majorSubjects: [
      "English Literature & Literary Criticism",
      "Linguistics & Applied ELT (English Language Teaching)",
      "Post-Colonial Literature & Cultural Studies",
      "Modern British & American Drama"
    ],
    defaultCourses: [
      { subjectCode: "ENG-101", subjectName: "Introduction to Poetry & Drama", credits: 3, period: "1st Semester", defaultMarks: 76 },
      { subjectCode: "ENG-102", subjectName: "Introduction to Prose & Fiction", credits: 3, period: "1st Semester", defaultMarks: 78 },
      { subjectCode: "ENG-103", subjectName: "Remedial English Grammar & Writing", credits: 3, period: "1st Semester", defaultMarks: 82 },
      { subjectCode: "ENG-201", subjectName: "Romantic Poetry: Wordsworth to Keats", credits: 3, period: "2nd Semester", defaultMarks: 80 },
      { subjectCode: "ENG-202", subjectName: "Victorian Literature & Society", credits: 3, period: "2nd Semester", defaultMarks: 81 },
      { subjectCode: "ENG-203", subjectName: "History of English Language", credits: 3, period: "2nd Semester", defaultMarks: 77 },
      { subjectCode: "ENG-301", subjectName: "16th & 17th Century Drama", credits: 3, period: "3rd Semester", defaultMarks: 83 },
      { subjectCode: "ENG-302", subjectName: "Shakespeare: Tragedies & Comedies", credits: 3, period: "3rd Semester", defaultMarks: 85 },
      { subjectCode: "ENG-401", subjectName: "18th Century Prose & Fiction", credits: 3, period: "4th Semester", defaultMarks: 79 },
      { subjectCode: "ENG-402", subjectName: "Phonetics & Phonology", credits: 3, period: "4th Semester", defaultMarks: 84 },
      { subjectCode: "ENG-501", subjectName: "20th Century British Poetry", credits: 3, period: "5th Semester", defaultMarks: 82 },
      { subjectCode: "ENG-502", subjectName: "20th Century Novel & Modernism", credits: 3, period: "5th Semester", defaultMarks: 80 },
      { subjectCode: "ENG-601", subjectName: "American Literature: 19th & 20th Century", credits: 3, period: "6th Semester", defaultMarks: 85 },
      { subjectCode: "ENG-602", subjectName: "Literary Theory & Criticism", credits: 3, period: "6th Semester", defaultMarks: 83 },
      { subjectCode: "ENG-701", subjectName: "Post-Colonial Literature in English", credits: 3, period: "7th Semester", defaultMarks: 86 },
      { subjectCode: "ENG-702", subjectName: "Applied Linguistics & ELT Methodology", credits: 3, period: "7th Semester", defaultMarks: 84 },
      { subjectCode: "ENG-801", subjectName: "Translation Studies & Comparative Literature", credits: 3, period: "8th Semester", defaultMarks: 87 },
      { subjectCode: "ENG-802", subjectName: "Graduation Dissertation / Monograph & Comprehensive Viva", credits: 3, period: "8th Semester", defaultMarks: 90 }
    ]
  },
  {
    code: "BEN-HON",
    name: "Bachelor of Arts (Honours) in Bengali",
    nameBn: "বি.এ. (অনার্স) বাংলা বিভাগ",
    academicLevel: "Honours",
    department: "Department of Bengali",
    duration: "4 Years (8 Semesters)",
    structureType: "Semester-wise",
    periods: ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"],
    majorSubjects: [
      "Modern Bengali Poetry & Fiction",
      "Ancient & Medieval Bengali Literature",
      "Bengali Folklore & Cultural Heritage",
      "Linguistics & Bengali Grammar History"
    ],
    defaultCourses: [
      { subjectCode: "BEN-101", subjectName: "প্রাচীন ও মধ্যযুগের কবিতা ও চর্যাপদ", credits: 3, period: "1st Semester", defaultMarks: 80 },
      { subjectCode: "BEN-102", subjectName: "বাংলা সাহিত্যের ইতিহাস (প্রাচীন ও মধ্যযুগ)", credits: 3, period: "1st Semester", defaultMarks: 82 },
      { subjectCode: "BEN-201", subjectName: "আধুনিক বাংলা কবিতার উন্মেষ", credits: 3, period: "2nd Semester", defaultMarks: 84 },
      { subjectCode: "BEN-301", subjectName: "রবীন্দ্র সাহিত্য ও কাব্যসমগ্র", credits: 3, period: "3rd Semester", defaultMarks: 85 },
      { subjectCode: "BEN-401", subjectName: "নজরুল সাহিত্য ও বিদ্রোহী কাব্য", credits: 3, period: "4th Semester", defaultMarks: 86 },
      { subjectCode: "BEN-501", subjectName: "বাংলা নাটক ও নাট্যমঞ্চের বিকাশ", credits: 3, period: "5th Semester", defaultMarks: 83 },
      { subjectCode: "BEN-601", subjectName: "উপন্যাস ও ছোটগল্পের ধারা", credits: 3, period: "6th Semester", defaultMarks: 85 },
      { subjectCode: "BEN-701", subjectName: "ভাষাতত্ত্ব ও ধ্বনিবিজ্ঞান", credits: 3, period: "7th Semester", defaultMarks: 87 },
      { subjectCode: "BEN-801", subjectName: "গবেষণা সন্দর্ভ ও চূড়ান্ত মৌখিক পরীক্ষা", credits: 3, period: "8th Semester", defaultMarks: 91 }
    ]
  },
  {
    code: "IS-HON",
    name: "Bachelor of Arts (Honours) in Islamic Studies",
    nameBn: "বি.এ. (অনার্স) ইসলামিক স্টাডিজ",
    academicLevel: "Honours",
    department: "Department of Islamic Studies",
    duration: "4 Years (8 Semesters)",
    structureType: "Semester-wise",
    periods: ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"],
    majorSubjects: [
      "Al-Quran & Sciences of Tafsir",
      "Al-Hadith & Hadith Literature",
      "Islamic Jurisprudence (Fiqh & Usul-al-Fiqh)",
      "Islamic History & Muslim Civilization"
    ],
    defaultCourses: [
      { subjectCode: "IS-101", subjectName: "Ulum al-Quran & Selected Tafsir", credits: 3, period: "1st Semester", defaultMarks: 85 },
      { subjectCode: "IS-201", subjectName: "Ulum al-Hadith & Sahih Collections", credits: 3, period: "2nd Semester", defaultMarks: 84 },
      { subjectCode: "IS-301", subjectName: "Sirah of Prophet Muhammad (SM)", credits: 3, period: "3rd Semester", defaultMarks: 88 },
      { subjectCode: "IS-401", subjectName: "Islamic Law & Constitutional Systems", credits: 3, period: "4th Semester", defaultMarks: 83 },
      { subjectCode: "IS-501", subjectName: "History of Khulafa-e-Rashidin & Umayyads", credits: 3, period: "5th Semester", defaultMarks: 86 },
      { subjectCode: "IS-601", subjectName: "Comparative Religion & Muslim Philosophy", credits: 3, period: "6th Semester", defaultMarks: 84 },
      { subjectCode: "IS-701", subjectName: "Islamic Economics & Banking Principles", credits: 3, period: "7th Semester", defaultMarks: 89 },
      { subjectCode: "IS-801", subjectName: "Research Thesis & Comprehensive Viva", credits: 3, period: "8th Semester", defaultMarks: 92 }
    ]
  },
  {
    code: "PS-HON",
    name: "Bachelor of Social Science (Honours) in Political Science",
    nameBn: "বি.এস.এস. (অনার্স) রাষ্ট্রবিজ্ঞান",
    academicLevel: "Honours",
    department: "Department of Political Science",
    duration: "4 Years (8 Semesters)",
    structureType: "Semester-wise",
    periods: ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"],
    majorSubjects: [
      "Political Theory & Western Political Thought",
      "Bangladesh Politics, Constitution & Government",
      "International Relations & Global Geopolitics",
      "Public Administration & Public Policy Analysis"
    ],
    defaultCourses: [
      { subjectCode: "PS-101", subjectName: "Introduction to Political Theory & State Concepts", credits: 3, period: "1st Semester", defaultMarks: 80 },
      { subjectCode: "PS-201", subjectName: "Western Political Thought: Plato to Marx", credits: 3, period: "2nd Semester", defaultMarks: 82 },
      { subjectCode: "PS-301", subjectName: "Constitutional Development of Bangladesh", credits: 3, period: "3rd Semester", defaultMarks: 85 },
      { subjectCode: "PS-401", subjectName: "International Politics & World Order", credits: 3, period: "4th Semester", defaultMarks: 84 },
      { subjectCode: "PS-501", subjectName: "Political Economy of Development", credits: 3, period: "5th Semester", defaultMarks: 83 },
      { subjectCode: "PS-601", subjectName: "Public Policy Making & Administrative Systems", credits: 3, period: "6th Semester", defaultMarks: 86 },
      { subjectCode: "PS-701", subjectName: "South Asian Politics & Foreign Policy of Bangladesh", credits: 3, period: "7th Semester", defaultMarks: 88 },
      { subjectCode: "PS-801", subjectName: "Research Project & Comprehensive Defense", credits: 3, period: "8th Semester", defaultMarks: 90 }
    ]
  },
  {
    code: "SOC-HON",
    name: "Bachelor of Social Science (Honours) in Sociology",
    nameBn: "বি.এস.এস. (অনার্স) সমাজবিজ্ঞান",
    academicLevel: "Honours",
    department: "Department of Sociology",
    duration: "4 Years (8 Semesters)",
    structureType: "Semester-wise",
    periods: ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"],
    majorSubjects: [
      "Sociological Theories & Historical Foundations",
      "Rural & Urban Sociology in Bangladesh",
      "Social Stratification, Gender & Inequality",
      "Social Research Methodology & Quantitative Analysis"
    ],
    defaultCourses: [
      { subjectCode: "SOC-101", subjectName: "Introduction to Sociology & Social Structures", credits: 3, period: "1st Semester", defaultMarks: 78 },
      { subjectCode: "SOC-201", subjectName: "Classical Sociological Thinkers (Durkheim, Weber, Marx)", credits: 3, period: "2nd Semester", defaultMarks: 82 },
      { subjectCode: "SOC-301", subjectName: "Bangladesh Society & Cultural Dynamics", credits: 3, period: "3rd Semester", defaultMarks: 84 },
      { subjectCode: "SOC-401", subjectName: "Social Stratification & Power Dynamics", credits: 3, period: "4th Semester", defaultMarks: 81 },
      { subjectCode: "SOC-501", subjectName: "Quantitative & Qualitative Research Methods", credits: 3, period: "5th Semester", defaultMarks: 85 },
      { subjectCode: "SOC-601", subjectName: "Urban Sociology & Sustainable Cities", credits: 3, period: "6th Semester", defaultMarks: 83 },
      { subjectCode: "SOC-701", subjectName: "Sociology of Development & Globalization", credits: 3, period: "7th Semester", defaultMarks: 86 },
      { subjectCode: "SOC-801", subjectName: "Field Practicum, Research Monograph & Viva", credits: 3, period: "8th Semester", defaultMarks: 89 }
    ]
  },
  {
    code: "ECO-HON",
    name: "Bachelor of Social Science (Honours) in Economics",
    nameBn: "বি.এস.এস. (অনার্স) অর্থনীতি",
    academicLevel: "Honours",
    department: "Department of Economics",
    duration: "4 Years (8 Semesters)",
    structureType: "Semester-wise",
    periods: ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"],
    majorSubjects: [
      "Microeconomics & Macroeconomic Principles",
      "Mathematical Economics & Applied Econometrics",
      "Development Economics & Bangladesh Economy",
      "International Trade, Finance & Monetary Policy"
    ],
    defaultCourses: [
      { subjectCode: "ECO-101", subjectName: "Principles of Microeconomics", credits: 3, period: "1st Semester", defaultMarks: 84 },
      { subjectCode: "ECO-201", subjectName: "Principles of Macroeconomics", credits: 3, period: "2nd Semester", defaultMarks: 82 },
      { subjectCode: "ECO-301", subjectName: "Mathematical Economics I", credits: 3, period: "3rd Semester", defaultMarks: 86 },
      { subjectCode: "ECO-401", subjectName: "Intermediate Microeconomic Theory", credits: 3, period: "4th Semester", defaultMarks: 83 },
      { subjectCode: "ECO-501", subjectName: "Applied Econometrics & Statistical Software", credits: 3, period: "5th Semester", defaultMarks: 88 },
      { subjectCode: "ECO-601", subjectName: "Bangladesh Economy: Planning & Policies", credits: 3, period: "6th Semester", defaultMarks: 85 },
      { subjectCode: "ECO-701", subjectName: "International Trade & Foreign Exchange", credits: 3, period: "7th Semester", defaultMarks: 87 },
      { subjectCode: "ECO-801", subjectName: "Economic Modeling, Research Project & Defense", credits: 3, period: "8th Semester", defaultMarks: 91 }
    ]
  },
  {
    code: "BBA-AIS",
    name: "Bachelor of Business Administration (BBA) in Accounting",
    nameBn: "বিবিএ (অনার্স) অ্যাকাউন্টিং অ্যান্ড ইনফরমেশন সিস্টেমস",
    academicLevel: "Honours",
    department: "Department of Accounting & Information Systems",
    duration: "4 Years (8 Semesters)",
    structureType: "Semester-wise",
    periods: ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"],
    majorSubjects: [
      "Financial Accounting & Advanced Financial Reporting",
      "Cost & Management Accounting",
      "Auditing, Assurance & Corporate Governance",
      "Taxation, Fiscal Law & Computerized Accounting Systems"
    ],
    defaultCourses: [
      { subjectCode: "AIS-101", subjectName: "Principles of Financial Accounting", credits: 3, period: "1st Semester", defaultMarks: 85 },
      { subjectCode: "AIS-201", subjectName: "Cost Accounting & Cost Controls", credits: 3, period: "2nd Semester", defaultMarks: 82 },
      { subjectCode: "AIS-301", subjectName: "Intermediate Financial Reporting (IFRS)", credits: 3, period: "3rd Semester", defaultMarks: 84 },
      { subjectCode: "AIS-401", subjectName: "Management Accounting for Decisions", credits: 3, period: "4th Semester", defaultMarks: 86 },
      { subjectCode: "AIS-501", subjectName: "Direct & Indirect Tax Laws of Bangladesh", credits: 3, period: "5th Semester", defaultMarks: 83 },
      { subjectCode: "AIS-601", subjectName: "Corporate Auditing & Forensic Accounting", credits: 3, period: "6th Semester", defaultMarks: 87 },
      { subjectCode: "AIS-701", subjectName: "Computerized Accounting Systems & ERP Software", credits: 3, period: "7th Semester", defaultMarks: 89 },
      { subjectCode: "AIS-801", subjectName: "Corporate Internship, Accounting Project & Viva", credits: 3, period: "8th Semester", defaultMarks: 92 }
    ]
  },
  {
    code: "BBA-MGT",
    name: "Bachelor of Business Administration (BBA) in Management",
    nameBn: "বিবিএ (অনার্স) ম্যানেজমেন্ট স্টাডিজ",
    academicLevel: "Honours",
    department: "Department of Management Studies",
    duration: "4 Years (8 Semesters)",
    structureType: "Semester-wise",
    periods: ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"],
    majorSubjects: [
      "Organizational Behavior & Executive Leadership",
      "Human Resource Management (HRM)",
      "Strategic Management & Corporate Policy",
      "Supply Chain & Operations Management"
    ],
    defaultCourses: [
      { subjectCode: "MGT-101", subjectName: "Fundamentals of Business Management", credits: 3, period: "1st Semester", defaultMarks: 82 },
      { subjectCode: "MGT-201", subjectName: "Organizational Behavior & Group Dynamics", credits: 3, period: "2nd Semester", defaultMarks: 80 },
      { subjectCode: "MGT-301", subjectName: "Human Resource Planning & Talent Acquisition", credits: 3, period: "3rd Semester", defaultMarks: 85 },
      { subjectCode: "MGT-401", subjectName: "Industrial Relations & Labor Law of Bangladesh", credits: 3, period: "4th Semester", defaultMarks: 83 },
      { subjectCode: "MGT-501", subjectName: "Operations & Quality Management (TQM)", credits: 3, period: "5th Semester", defaultMarks: 84 },
      { subjectCode: "MGT-601", subjectName: "Entrepreneurship & Small Business Management", credits: 3, period: "6th Semester", defaultMarks: 87 },
      { subjectCode: "MGT-701", subjectName: "Strategic Corporate Management", credits: 3, period: "7th Semester", defaultMarks: 88 },
      { subjectCode: "MGT-801", subjectName: "Industry Internship Report & Comprehensive Viva", credits: 3, period: "8th Semester", defaultMarks: 90 }
    ]
  },
  {
    code: "BBA-FIN",
    name: "Bachelor of Business Administration (BBA) in Finance & Banking",
    nameBn: "বিবিএ (অনার্স) ফিন্যান্স অ্যান্ড ব্যাংকিং",
    academicLevel: "Honours",
    department: "Department of Finance & Banking",
    duration: "4 Years (8 Semesters)",
    structureType: "Semester-wise",
    periods: ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"],
    majorSubjects: [
      "Corporate Finance & Capital Budgeting",
      "Financial Markets, Securities & Portfolio Management",
      "Commercial Banking & Central Bank Regulations",
      "Islamic Banking & Non-Banking Financial Institutions"
    ],
    defaultCourses: [
      { subjectCode: "FIN-101", subjectName: "Principles of Business Finance", credits: 3, period: "1st Semester", defaultMarks: 83 },
      { subjectCode: "FIN-201", subjectName: "Financial Mathematics & Capital Valuation", credits: 3, period: "2nd Semester", defaultMarks: 85 },
      { subjectCode: "FIN-301", subjectName: "Financial Markets, Institutions & Money Markets", credits: 3, period: "3rd Semester", defaultMarks: 82 },
      { subjectCode: "FIN-401", subjectName: "Commercial Bank Management & Lending Policies", credits: 3, period: "4th Semester", defaultMarks: 86 },
      { subjectCode: "FIN-501", subjectName: "Investment Analysis & Portfolio Management", credits: 3, period: "5th Semester", defaultMarks: 88 },
      { subjectCode: "FIN-601", subjectName: "Islamic Banking & Financial Instruments", credits: 3, period: "6th Semester", defaultMarks: 87 },
      { subjectCode: "FIN-701", subjectName: "International Financial Management", credits: 3, period: "7th Semester", defaultMarks: 89 },
      { subjectCode: "FIN-801", subjectName: "Bank Internship, Financial Project & Final Viva", credits: 3, period: "8th Semester", defaultMarks: 93 }
    ]
  },
  {
    code: "BBA-MKT",
    name: "Bachelor of Business Administration (BBA) in Marketing",
    nameBn: "বিবিএ (অনার্স) মার্কেটিং",
    academicLevel: "Honours",
    department: "Department of Marketing",
    duration: "4 Years (8 Semesters)",
    structureType: "Semester-wise",
    periods: ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"],
    majorSubjects: [
      "Consumer Behavior & Market Segmentation",
      "Brand Management & Integrated Marketing Communications",
      "Digital Marketing, E-Commerce & SEO Strategies",
      "Strategic Marketing & Supply Chain Logistics"
    ],
    defaultCourses: [
      { subjectCode: "MKT-101", subjectName: "Principles of Marketing Management", credits: 3, period: "1st Semester", defaultMarks: 84 },
      { subjectCode: "MKT-201", subjectName: "Consumer Psychology & Buyer Behavior", credits: 3, period: "2nd Semester", defaultMarks: 82 },
      { subjectCode: "MKT-301", subjectName: "Brand Planning & Equity Management", credits: 3, period: "3rd Semester", defaultMarks: 85 },
      { subjectCode: "MKT-401", subjectName: "Advertising, Media & Public Relations", credits: 3, period: "4th Semester", defaultMarks: 86 },
      { subjectCode: "MKT-501", subjectName: "Digital Marketing, Social Media & Analytics", credits: 3, period: "5th Semester", defaultMarks: 89 },
      { subjectCode: "MKT-601", subjectName: "Distribution Logistics & Retail Management", credits: 3, period: "6th Semester", defaultMarks: 83 },
      { subjectCode: "MKT-701", subjectName: "International & Export Marketing", credits: 3, period: "7th Semester", defaultMarks: 87 },
      { subjectCode: "MKT-801", subjectName: "Marketing Practicum Internship & Viva", credits: 3, period: "8th Semester", defaultMarks: 91 }
    ]
  },
  {
    code: "BSC-CSE",
    name: "Bachelor of Science in Computer Science & Engineering (CSE)",
    nameBn: "বি.এস.সি. ইন কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং",
    academicLevel: "Honours",
    department: "Department of Computer Science & Engineering",
    duration: "4 Years (8 Semesters)",
    structureType: "Semester-wise",
    periods: ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"],
    majorSubjects: [
      "Software Engineering & Object-Oriented Programming",
      "Data Structures, Algorithms & Computational Complexity",
      "Database Systems, SQL & Cloud Data Architecture",
      "Computer Networks, Cyber Security & Operating Systems",
      "Artificial Intelligence & Machine Learning"
    ],
    defaultCourses: [
      { subjectCode: "CSE-111", subjectName: "Structured Programming Language (C/C++)", credits: 3, period: "1st Semester", defaultMarks: 86 },
      { subjectCode: "CSE-112", subjectName: "Structured Programming Lab", credits: 1.5, period: "1st Semester", defaultMarks: 92 },
      { subjectCode: "CSE-211", subjectName: "Data Structures & Lab", credits: 4, period: "2nd Semester", defaultMarks: 88 },
      { subjectCode: "CSE-311", subjectName: "Algorithms Design & Analysis", credits: 4, period: "3rd Semester", defaultMarks: 87 },
      { subjectCode: "CSE-411", subjectName: "Database Management Systems & Lab", credits: 4, period: "4th Semester", defaultMarks: 89 },
      { subjectCode: "CSE-511", subjectName: "Operating Systems & System Programming", credits: 4, period: "5th Semester", defaultMarks: 85 },
      { subjectCode: "CSE-611", subjectName: "Computer Networks & Network Security", credits: 4, period: "6th Semester", defaultMarks: 90 },
      { subjectCode: "CSE-711", subjectName: "Artificial Intelligence & Neural Networks", credits: 4, period: "7th Semester", defaultMarks: 91 },
      { subjectCode: "CSE-811", subjectName: "Final Senior Capstone Project & Defense", credits: 4, period: "8th Semester", defaultMarks: 95 }
    ]
  },
  {
    code: "BSC-MATH",
    name: "Bachelor of Science (Honours) in Mathematics",
    nameBn: "বি.এস.সি. (অনার্স) গণিত বিভাগ",
    academicLevel: "Honours",
    department: "Department of Mathematics",
    duration: "4 Years (8 Semesters)",
    structureType: "Semester-wise",
    periods: ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"],
    majorSubjects: [
      "Advanced Calculus & Differential Geometry",
      "Abstract Algebra, Group Theory & Ring Theory",
      "Complex Analysis & Real Analysis",
      "Numerical Methods, MATLAB & Operations Research"
    ],
    defaultCourses: [
      { subjectCode: "MTH-101", subjectName: "Differential & Integral Calculus", credits: 4, period: "1st Semester", defaultMarks: 88 },
      { subjectCode: "MTH-201", subjectName: "Ordinary Differential Equations", credits: 4, period: "2nd Semester", defaultMarks: 85 },
      { subjectCode: "MTH-301", subjectName: "Linear Algebra & Vector Spaces", credits: 4, period: "3rd Semester", defaultMarks: 89 },
      { subjectCode: "MTH-401", subjectName: "Abstract Algebra I", credits: 4, period: "4th Semester", defaultMarks: 84 },
      { subjectCode: "MTH-501", subjectName: "Real Analysis & Topology", credits: 4, period: "5th Semester", defaultMarks: 86 },
      { subjectCode: "MTH-601", subjectName: "Numerical Analysis & Mathematical Software", credits: 4, period: "6th Semester", defaultMarks: 91 },
      { subjectCode: "MTH-701", subjectName: "Complex Variables & Fourier Transforms", credits: 4, period: "7th Semester", defaultMarks: 88 },
      { subjectCode: "MTH-801", subjectName: "Mathematical Research Monograph & Viva", credits: 4, period: "8th Semester", defaultMarks: 94 }
    ]
  },

  // ==================== MASTERS PROGRAMS (1-2 Year 2-4 Semester Structure) ====================
  {
    code: "MA-ENG",
    name: "Master of Arts in English",
    nameBn: "এম.এ. ইংরেজি বিভাগ",
    academicLevel: "Masters",
    department: "Department of English",
    duration: "1 to 2 Years",
    structureType: "Semester-wise",
    periods: ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester"],
    majorSubjects: [
      "Modern & Contemporary English Literature",
      "Applied Linguistics, ELT Curriculum & Testing",
      "Critical Theory & Cultural Studies",
      "Translation Studies & Global Anglophone Writings"
    ],
    defaultCourses: [
      { subjectCode: "MENG-501", subjectName: "Contemporary Literary Theory & Post-Structuralism", credits: 3, period: "1st Semester", defaultMarks: 84 },
      { subjectCode: "MENG-502", subjectName: "20th Century Continental Fiction & Drama", credits: 3, period: "1st Semester", defaultMarks: 82 },
      { subjectCode: "MENG-503", subjectName: "Advanced Research Methodology in Humanities", credits: 3, period: "1st Semester", defaultMarks: 86 },
      { subjectCode: "MENG-601", subjectName: "Advanced Applied Linguistics & Language Testing", credits: 3, period: "2nd Semester", defaultMarks: 85 },
      { subjectCode: "MENG-602", subjectName: "Post-Colonial Discourses & Subaltern Studies", credits: 3, period: "2nd Semester", defaultMarks: 87 },
      { subjectCode: "MENG-701", subjectName: "South Asian Literature in English Translation", credits: 3, period: "3rd Semester", defaultMarks: 86 },
      { subjectCode: "MENG-702", subjectName: "World Literatures & Diasporic Identities", credits: 3, period: "3rd Semester", defaultMarks: 88 },
      { subjectCode: "MENG-801", subjectName: "Master's Thesis / Dissertation Defense & Comprehensive Viva", credits: 6, period: "4th Semester", defaultMarks: 92 }
    ]
  },
  {
    code: "MSS-PS",
    name: "Master of Social Science in Political Science",
    nameBn: "এম.এস.এস. রাষ্ট্রবিজ্ঞান",
    academicLevel: "Masters",
    department: "Department of Political Science",
    duration: "1 to 2 Years",
    structureType: "Semester-wise",
    periods: ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester"],
    majorSubjects: [
      "Democratic Governance & Constitutionalism in Developing States",
      "Global Security, Foreign Policy & Geopolitics",
      "Public Policy Formulation & Bureaucratic Reform",
      "Contemporary Political Philosophy & Global Justice"
    ],
    defaultCourses: [
      { subjectCode: "MPS-501", subjectName: "Advanced Political Analysis & Statecraft", credits: 3, period: "1st Semester", defaultMarks: 85 },
      { subjectCode: "MPS-502", subjectName: "Comparative Politics of South & Southeast Asia", credits: 3, period: "1st Semester", defaultMarks: 83 },
      { subjectCode: "MPS-601", subjectName: "Democratic Transition & Electoral Governance", credits: 3, period: "2nd Semester", defaultMarks: 86 },
      { subjectCode: "MPS-602", subjectName: "Geopolitics of the Indo-Pacific & National Security", credits: 3, period: "2nd Semester", defaultMarks: 88 },
      { subjectCode: "MPS-701", subjectName: "Public Policy Evaluation & Project Management", credits: 3, period: "3rd Semester", defaultMarks: 87 },
      { subjectCode: "MPS-801", subjectName: "Master's Research Thesis & Oral Defense", credits: 6, period: "4th Semester", defaultMarks: 91 }
    ]
  },
  {
    code: "MSS-ECO",
    name: "Master of Social Science in Economics",
    nameBn: "এম.এস.এস. অর্থনীতি",
    academicLevel: "Masters",
    department: "Department of Economics",
    duration: "1 to 2 Years",
    structureType: "Semester-wise",
    periods: ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester"],
    majorSubjects: [
      "Advanced Microeconomic Theory & Game Theory",
      "Advanced Macroeconomics, Inflation & Growth Models",
      "Advanced Econometric Modeling & Time Series Analysis",
      "Development Planning, Sustainable Development & Fiscal Policy"
    ],
    defaultCourses: [
      { subjectCode: "MECO-501", subjectName: "Advanced Microeconomic Analysis", credits: 3, period: "1st Semester", defaultMarks: 88 },
      { subjectCode: "MECO-502", subjectName: "Macroeconomic Policy & International Finance", credits: 3, period: "1st Semester", defaultMarks: 85 },
      { subjectCode: "MECO-601", subjectName: "Advanced Econometrics with Stata / R", credits: 3, period: "2nd Semester", defaultMarks: 90 },
      { subjectCode: "MECO-602", subjectName: "Environmental Economics & Climate Policy", credits: 3, period: "2nd Semester", defaultMarks: 87 },
      { subjectCode: "MECO-701", subjectName: "Development Banking & Microfinance Innovations", credits: 3, period: "3rd Semester", defaultMarks: 89 },
      { subjectCode: "MECO-801", subjectName: "Master's Thesis Research Project & Defense", credits: 6, period: "4th Semester", defaultMarks: 93 }
    ]
  },
  {
    code: "MBA-EXEC",
    name: "Master of Business Administration (Executive / Regular MBA)",
    nameBn: "মাস্টার্স অব বিজনেস অ্যাডমিনিস্ট্রেশন (এমবিএ)",
    academicLevel: "Masters",
    department: "Faculty of Business Administration",
    duration: "1 to 2 Years",
    structureType: "Semester-wise",
    periods: ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester"],
    majorSubjects: [
      "Financial Management & Corporate Investment Strategies",
      "Strategic Marketing Management & Brand Leadership",
      "Strategic Human Resource Management (SHRM)",
      "Supply Chain Operations & Global Logistics",
      "Corporate Entrepreneurship & Fintech Innovations"
    ],
    defaultCourses: [
      { subjectCode: "MBA-501", subjectName: "Managerial Economics & Decision Science", credits: 3, period: "1st Semester", defaultMarks: 86 },
      { subjectCode: "MBA-502", subjectName: "Financial Reporting & Managerial Accounting", credits: 3, period: "1st Semester", defaultMarks: 84 },
      { subjectCode: "MBA-503", subjectName: "Strategic Corporate Management", credits: 3, period: "1st Semester", defaultMarks: 88 },
      { subjectCode: "MBA-601", subjectName: "Corporate Financial Strategy & Risk Management", credits: 3, period: "2nd Semester", defaultMarks: 87 },
      { subjectCode: "MBA-602", subjectName: "Strategic Marketing & Digital Transformation", credits: 3, period: "2nd Semester", defaultMarks: 89 },
      { subjectCode: "MBA-701", subjectName: "Leadership, Organizational Dynamics & Ethics", credits: 3, period: "3rd Semester", defaultMarks: 88 },
      { subjectCode: "MBA-702", subjectName: "Global Supply Chain & Operations Analytics", credits: 3, period: "3rd Semester", defaultMarks: 86 },
      { subjectCode: "MBA-801", subjectName: "Executive Capstone Consultancy / Thesis & Defense", credits: 6, period: "4th Semester", defaultMarks: 94 }
    ]
  },
  {
    code: "MSC-CSE",
    name: "Master of Science in Computer Science & Engineering (M.Sc. CSE)",
    nameBn: "এম.এস.সি. কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং",
    academicLevel: "Masters",
    department: "Department of Computer Science & Engineering",
    duration: "1.5 to 2 Years",
    structureType: "Semester-wise",
    periods: ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester"],
    majorSubjects: [
      "Machine Learning, Deep Learning & Computer Vision",
      "Advanced Distributed Systems & Cloud Infrastructure",
      "Cyber Threat Intelligence & Cryptographic Protocols",
      "Big Data Analytics, NLP & High Performance Computing"
    ],
    defaultCourses: [
      { subjectCode: "MCSE-501", subjectName: "Advanced Algorithms & Optimization", credits: 3, period: "1st Semester", defaultMarks: 90 },
      { subjectCode: "MCSE-502", subjectName: "Deep Learning & Artificial Neural Networks", credits: 3, period: "1st Semester", defaultMarks: 92 },
      { subjectCode: "MCSE-601", subjectName: "Cloud Architecture & Microservices", credits: 3, period: "2nd Semester", defaultMarks: 89 },
      { subjectCode: "MCSE-602", subjectName: "Information Security & Cryptanalysis", credits: 3, period: "2nd Semester", defaultMarks: 91 },
      { subjectCode: "MCSE-701", subjectName: "Big Data Processing & Distributed Databases", credits: 3, period: "3rd Semester", defaultMarks: 93 },
      { subjectCode: "MCSE-801", subjectName: "Master's Thesis Research & International Publication", credits: 6, period: "4th Semester", defaultMarks: 96 }
    ]
  },
  {
    code: "MA-BEN",
    name: "Master of Arts in Bengali",
    nameBn: "এম.এ. বাংলা বিভাগ",
    academicLevel: "Masters",
    department: "Department of Bengali",
    duration: "1 to 2 Years",
    structureType: "Semester-wise",
    periods: ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester"],
    majorSubjects: [
      "আধুনিক বাংলা কবিতা ও নন্দনতত্ত্ব",
      "রবীন্দ্র-উত্তর উপন্যাস ও কথাসাহিত্য",
      "লোকসাহিত্য, লোকসংস্কৃতি ও নৃবিজ্ঞান",
      "তুলনামূলক সাহিত্য ও অনুবাদ তত্ত্ব"
    ],
    defaultCourses: [
      { subjectCode: "MBEN-501", subjectName: "আধুনিক বাংলা কাব্যের নন্দনতত্ত্ব ও দার্শনিক ভিত্তি", credits: 3, period: "1st Semester", defaultMarks: 86 },
      { subjectCode: "MBEN-502", subjectName: "বাংলাদেশের কথাসাহিত্য ও মুক্তিযুদ্ধোত্তর সাহিত্য", credits: 3, period: "1st Semester", defaultMarks: 88 },
      { subjectCode: "MBEN-601", subjectName: "লোকসংস্কৃতি গবেষণা ও ফিল্ডওয়ার্ক পদ্ধতি", credits: 3, period: "2nd Semester", defaultMarks: 85 },
      { subjectCode: "MBEN-602", subjectName: "তুলনামূলক সাহিত্য ও প্রাচ্য-পাশ্চাত্য সাহিত্যতত্ত্ব", credits: 3, period: "2nd Semester", defaultMarks: 87 },
      { subjectCode: "MBEN-701", subjectName: "বাংলা নাট্যসাহিত্য ও আধুনিক প্রয়োগরীতি", credits: 3, period: "3rd Semester", defaultMarks: 89 },
      { subjectCode: "MBEN-801", subjectName: "মাস্টার্স গবেষণা সন্দর্ভ ও ভাইভা ভয়েস", credits: 6, period: "4th Semester", defaultMarks: 93 }
    ]
  }
];

export function getProgramsByLevel(level: "Degree Pass" | "Honours" | "Masters"): DegreeProgram[] {
  return DEGREE_PROGRAMS_CATALOG.filter((p) => p.academicLevel === level);
}

export function getProgramByCode(code: string): DegreeProgram | undefined {
  return DEGREE_PROGRAMS_CATALOG.find((p) => p.code.toLowerCase() === code.toLowerCase());
}

/**
 * Generate default semester results populated with realistic courses for the given program
 */
export function generateDefaultSemesterResults(program: DegreeProgram, marksOffset = 0): SemesterResult[] {
  const results: SemesterResult[] = [];

  for (const period of program.periods) {
    const periodCourses = program.defaultCourses.filter((c) => c.period === period);
    
    // If no specific courses for this period in template, generate standard course
    const coursesToUse: DegreeCourse[] = periodCourses.length > 0 
      ? periodCourses 
      : [
          { subjectCode: `${program.code}-${period.replace(/\s+/g, "").toUpperCase()}-01`, subjectName: `${program.name} - Core Paper I`, credits: 3, period, defaultMarks: 80 },
          { subjectCode: `${program.code}-${period.replace(/\s+/g, "").toUpperCase()}-02`, subjectName: `${program.name} - Core Paper II`, credits: 3, period, defaultMarks: 82 },
          { subjectCode: `${program.code}-${period.replace(/\s+/g, "").toUpperCase()}-03`, subjectName: `${program.name} - Elective / Practical`, credits: 3, period, defaultMarks: 85 }
        ];

    const subjects: SubjectGrade[] = coursesToUse.map((c) => {
      const marks = Math.min(98, Math.max(45, (c.defaultMarks || 80) + marksOffset));
      const gp = getDiplomaGradePointFromMarks(marks);
      return {
        subjectCode: c.subjectCode,
        subjectName: c.subjectName,
        marks: marks,
        gradePoint: gp,
        credit: c.credits,
        letterGrade: getDiplomaLetterGrade(gp),
        year: period
      };
    });

    let totalWeighted = 0;
    let totalCredits = 0;
    for (const s of subjects) {
      const cred = s.credit || 3;
      totalWeighted += s.gradePoint * cred;
      totalCredits += cred;
    }
    const semesterGpa = totalCredits > 0 ? Math.min(4.00, Math.round((totalWeighted / totalCredits) * 100) / 100) : 3.50;

    results.push({
      semesterName: period,
      semesterGpa: semesterGpa,
      totalCredits: totalCredits,
      publicationDate: "2024-05-15",
      subjects: subjects
    });
  }

  return results;
}
