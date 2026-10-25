export interface HandbookItem {
  id: string;
  code: string;
  title: string;
  titleBn: string;
  category: string;
  categoryBn: string;
  department: string;
  pages: string;
  size: string;
  isAvailable: boolean;
  version: string;
  summary: string;
  chapters?: {
    title: string;
    content: string;
  }[];
}

export interface EbookItem {
  id: string;
  code: string;
  title: string;
  titleBn: string;
  dept: string;
  category: string;
  author: string;
  edition: string;
  pages: string;
  size: string;
  isAvailable: boolean;
  summary: string;
  chapters?: {
    chapterNo: number;
    title: string;
    summary: string;
    keyTopics: string[];
  }[];
}

export const INITIAL_HANDBOOKS: HandbookItem[] = [
  {
    id: "hb-dip-2024",
    code: "BNIE-HB-DIP-2024",
    title: "4-Year Diploma in Engineering Academic Policy & Regulations",
    titleBn: "৪-বছর মেয়াদী ডিপ্লোমা ইন ইঞ্জিনিয়ারিং একাডেমিক নীতিমালা ও প্রবিধান",
    category: "Academic Regulations",
    categoryBn: "একাডেমিক নীতিমালা",
    department: "Diploma in Engineering (Mechanical, Electrical, Electronics, Civil)",
    pages: "64 Pages",
    size: "3.4 MB",
    isAvailable: true, // AVAILABLE 1
    version: "2024-v2.1",
    summary: "Comprehensive academic guidelines covering curriculum credits, CGPA calculation formula on scale 4.00, workshop safety norms, industrial attachment requirements, and examination regulations.",
    chapters: [
      {
        title: "Section 1: Academic Structure & Credit Hours",
        content: "The 4-Year Diploma in Engineering program consists of 8 semesters across 4 academic years. Minimum total contact credit hours: 145 credits. Continuous assessment carries 40% weighting (Theory 20% + Practical 20%), while final board examination carries 60% (Theory 40% + Practical 20%)."
      },
      {
        title: "Section 2: Grading System & CGPA Calculation (Scale 4.00)",
        content: "Letter grades and grade points: 80% and above = A+ (4.00), 75% to 79% = A (3.75), 70% to 74% = A- (3.50), 65% to 69% = B+ (3.25), 60% to 64% = B (3.00), 55% to 59% = B- (2.75), 50% to 54% = C+ (2.50), 45% to 49% = C (2.25), 40% to 44% = D (2.00), Below 40% = F (0.00). Final CGPA = Sum of (Credit x Grade Point) divided by Total Credits."
      },
      {
        title: "Section 3: Mechanical Engineering Specific Bylaws",
        content: "All candidates in 4-Year Mechanical Engineering must complete 23 mandatory core subjects across Year 1 (6 subjects), Year 2 (6 subjects), Year 3 (6 subjects), and Year 4 (5 subjects), including Machine Design, Power Plant Engineering, Mechanical Project, and 6-month Industrial Attachment."
      },
      {
        title: "Section 4: Attendance & Examination Eligibility",
        content: "Students must maintain a minimum of 75% class attendance in both theoretical lectures and practical laboratory workshops to be declared eligible for the final semester examinations."
      },
      {
        title: "Section 5: Industrial Training & Project Assessment",
        content: "During the 4th Year, every candidate undergoes mandatory Industrial Attachment (ME-405) in recognized government or private manufacturing establishments, followed by an oral defense and technical project viva-voce before a board of external examiners."
      }
    ]
  },
  {
    id: "hb-eth-2024",
    code: "BNIE-HB-ETH-2024",
    title: "Student Code of Conduct & Workshop Safety Guidelines",
    titleBn: "শিক্ষার্থী আচরণবিধি ও ল্যাবরেটরি কর্মশালা নিরাপত্তা নির্দেশিকা",
    category: "Student Affairs & Safety",
    categoryBn: "আচরণবিধি ও নিরাপত্তা",
    department: "Central Discipline & Technical Workshops",
    pages: "32 Pages",
    size: "1.9 MB",
    isAvailable: true, // AVAILABLE 2
    version: "2024-v1.4",
    summary: "Safety standards for mechanical, electrical, and civil workshops, campus ethics, emergency protocols, equipment handling protocols, and student rights & disciplinary proceedings.",
    chapters: [
      {
        title: "Chapter 1: Campus Ethics & Academic Integrity",
        content: "Students are expected to uphold the highest standards of honesty, discipline, and respect towards faculty members, staff, and fellow students. Any form of harassment, ragging, or examination malpractice results in immediate suspension."
      },
      {
        title: "Chapter 2: Workshop PPE & Machine Guarding",
        content: "Personal Protective Equipment (PPE) is mandatory in Machine Shop, Welding Workshop, Heat Transfer Lab, and Electrical Testing facility. Safety boots, eye goggles, and protective aprons must be worn at all times."
      },
      {
        title: "Chapter 3: Emergency Procedures & Fire Safety",
        content: "Every workshop floor is equipped with CO2 and dry powder fire extinguishers, emergency power shutoff valves, and first-aid response kits. In case of electrical accidents, press the central red isolation breaker immediately."
      },
      {
        title: "Chapter 4: Digital Portal & Lab Computer Usage",
        content: "Institutional workstations and CAD computer laboratories must be used solely for educational purposes. Unauthorized network alterations or data breaches are strictly penalized."
      }
    ]
  },
  {
    id: "hb-grd-2024",
    code: "BNIE-HB-GRD-2024",
    title: "Grading System & Examination Assessment Handbook",
    titleBn: "পরীক্ষা মূল্যায়ন ও গ্রেডিং সিস্টেম হ্যান্ডবুক",
    category: "Examinations",
    categoryBn: "পরীক্ষা ও মূল্যায়ন",
    department: "Office of the Controller of Examinations",
    pages: "36 Pages",
    size: "2.1 MB",
    isAvailable: false, // NOT AVAILABLE
    version: "2024-v1.0",
    summary: "Detailed handbook on continuous assessment, practical viva procedures, transcript generation, re-scrutiny bylaws, and digital certificate verification."
  },
  {
    id: "hb-voc-2024",
    code: "BNIE-HB-VOC-2024",
    title: "SSC & HSC Vocational Curriculum Guideline",
    titleBn: "এসএসসি ও এইচএসসি ভোকেশনাল পাঠ্যক্রম নির্দেশিকা",
    category: "Vocational Studies",
    categoryBn: "ভোকেশনাল শিক্ষা",
    department: "School of Vocational Education",
    pages: "44 Pages",
    size: "2.8 MB",
    isAvailable: false, // NOT AVAILABLE
    version: "2024-v1.0",
    summary: "Complete curriculum framework for secondary and higher secondary technical streams including trade selection, practical logbooks, and board examinations."
  },
  {
    id: "hb-mech-2024",
    code: "BNIE-HB-MECH-2024",
    title: "Mechanical Engineering Technology Laboratory Manual",
    titleBn: "মেকানিক্যাল ইঞ্জিনিয়ারিং ল্যাবরেটরি ম্যানুয়াল",
    category: "Engineering Practicals",
    categoryBn: "প্রকৌশল ব্যবহারিক",
    department: "Department of Mechanical Engineering",
    pages: "58 Pages",
    size: "4.1 MB",
    isAvailable: false, // NOT AVAILABLE
    version: "2024-v1.0",
    summary: "Instructional procedures for lathe machining, milling, fluid mechanics experiments, steam boiler operations, and materials testing."
  },
  {
    id: "hb-elec-2024",
    code: "BNIE-HB-ELEC-2024",
    title: "Electrical & Electronics Circuit Practice Handbook",
    titleBn: "ইলেকট্রিক্যাল ও ইলেকট্রনিক্স সার্কিট হ্যান্ডবুক",
    category: "Engineering Practicals",
    categoryBn: "প্রকৌশল ব্যবহারিক",
    department: "Department of Electrical Engineering",
    pages: "52 Pages",
    size: "3.7 MB",
    isAvailable: false, // NOT AVAILABLE
    version: "2024-v1.0",
    summary: "Laboratory manual for circuit analysis, power electronics, transformer diagnostics, and micro-controller programming."
  },
  {
    id: "hb-civ-2024",
    code: "BNIE-HB-CIV-2024",
    title: "Civil Engineering Surveying & Material Testing Guide",
    titleBn: "সিভিল সার্ভে ও নির্মাণ সামগ্রী পরীক্ষা নির্দেশিকা",
    category: "Engineering Practicals",
    categoryBn: "প্রকৌশল ব্যবহারিক",
    department: "Department of Civil Engineering",
    pages: "48 Pages",
    size: "3.2 MB",
    isAvailable: false, // NOT AVAILABLE
    version: "2024-v1.0",
    summary: "Guidelines on theodolite leveling, total station operations, concrete compressive strength testing, and soil mechanics analysis."
  },
  {
    id: "hb-ind-2024",
    code: "BNIE-HB-IND-2024",
    title: "Industrial Attachment & Internship Project Manual",
    titleBn: "শিল্প সংযুক্তি ও ইন্টার্নশিপ প্রকল্প ম্যানুয়াল",
    category: "Field Training",
    categoryBn: "শিল্প প্রশিক্ষণ",
    department: "Directorate of Industrial Liaison",
    pages: "30 Pages",
    size: "1.6 MB",
    isAvailable: false, // NOT AVAILABLE
    version: "2024-v1.0",
    summary: "Standard operational procedure for 6-month factory placement, industry supervisor assessment rubric, and project report format."
  },
  {
    id: "hb-lib-2024",
    code: "BNIE-HB-LIB-2024",
    title: "Central Digital Library & E-Resource Access Manual",
    titleBn: "কেন্দ্রীয় ডিজিটাল লাইব্রেরি ও ই-রিসোর্স ব্যবহার নির্দেশিকা",
    category: "Library Services",
    categoryBn: "লাইব্রেরি সেবা",
    department: "BNIE Central Library & Information Center",
    pages: "24 Pages",
    size: "1.2 MB",
    isAvailable: false, // NOT AVAILABLE
    version: "2024-v1.0",
    summary: "Instructions on browsing institutional repository e-books, international journals, borrowing procedures, and remote access via OSAPS."
  },
  {
    id: "hb-grs-2024",
    code: "BNIE-HB-GRS-2024",
    title: "Grievance Redress System (GRS) & Citizen Charter",
    titleBn: "অভিযোগ প্রতিকার ব্যবস্থা (GRS) ও নাগরিক সনদ",
    category: "Administration",
    categoryBn: "প্রশাসন ও সেবা",
    department: "Office of the Registrar & Citizen Services",
    pages: "20 Pages",
    size: "1.1 MB",
    isAvailable: false, // NOT AVAILABLE
    version: "2024-v1.0",
    summary: "Institutional service commitments, time-bound delivery standards, online complaint registration steps, and appellate authority."
  },
  {
    id: "hb-sch-2024",
    code: "BNIE-HB-SCH-2024",
    title: "Scholarships, Stipends & Financial Assistance Guideline",
    titleBn: "মেধাবৃত্তি, উপবৃত্তি ও আর্থিক সহায়তা নীতিমালা",
    category: "Student Welfare",
    categoryBn: "শিক্ষার্থী কল্যাণ",
    department: "Student Welfare & Scholarship Board",
    pages: "26 Pages",
    size: "1.4 MB",
    isAvailable: false, // NOT AVAILABLE
    version: "2024-v1.0",
    summary: "Merit scholarship criteria based on semester CGPA, technical stipends for underprivileged students, and application deadlines."
  },
  {
    id: "hb-ict-2024",
    code: "BNIE-HB-ICT-2024",
    title: "OSAPS Portal & Digital Services User Manual",
    titleBn: "ওস্যাপস পোর্টাল ও ডিজিটাল সেবা ব্যবহার নির্দেশিকা",
    category: "ICT Services",
    categoryBn: "আইসিটি সেবা",
    department: "Directorate of Information & Communication Technology",
    pages: "34 Pages",
    size: "2.3 MB",
    isAvailable: false, // NOT AVAILABLE
    version: "2024-v1.0",
    summary: "Step-by-step pictorial user guide for student profile management, course registration, fee slips, digital ID cards, and webmail."
  }
];

export const INITIAL_EBOOKS: EbookItem[] = [
  {
    id: "eb-me-101",
    code: "ME-101",
    title: "Engineering Drawing & CAD Principles",
    titleBn: "ইঞ্জিনিয়ারিং ড্রয়িং এবং সিএডি মূলনীতি",
    dept: "mechanical",
    category: "Mechanical Engineering",
    author: "BNIE Mechanical Technical Faculty & Council",
    edition: "2024 Revised National Edition",
    pages: "312 Pages",
    size: "14.2 MB",
    isAvailable: true, // AVAILABLE 1
    summary: "Fundamental textbook for 1st Year Mechanical Engineering students covering orthographic projections, isometric drawing, dimensioning, CAD tools, and workshop sheet preparation.",
    chapters: [
      {
        chapterNo: 1,
        title: "Introduction to Engineering Drawing Instruments & Standards",
        summary: "Covers drawing sheets (A0-A4), scales, line conventions (ISO/BS), title blocks, and precision drawing instruments.",
        keyTopics: ["Drawing Board & T-Square", "Line Types & Weights", "Lettering & Dimensioning Rules"]
      },
      {
        chapterNo: 2,
        title: "Geometrical Constructions & Conic Sections",
        summary: "Step-by-step methods for constructing regular polygons, ellipse, parabola, hyperbola, involutes, and cycloids.",
        keyTopics: ["Polygon Inscription", "Conic Generation", "Tangents & Normals"]
      },
      {
        chapterNo: 3,
        title: "Orthographic Projections & Multi-view Representations",
        summary: "Detailed study of First-Angle and Third-Angle projection systems, plan, front elevation, and end elevation.",
        keyTopics: ["First Angle vs Third Angle", "Auxiliary Views", "Missing Line Problems"]
      },
      {
        chapterNo: 4,
        title: "Sectional Views & Fasteners",
        summary: "Full section, half section, revolved section, threaded fasteners, keys, cotters, and assembly representation.",
        keyTopics: ["Cutting Plane Line", "Hatching Conventions", "Bolts, Nuts & Studs"]
      },
      {
        chapterNo: 5,
        title: "Computer Aided Design (CAD) Fundamentals",
        summary: "Introduction to 2D drafting in AutoCAD, coordinate systems, draw commands, modify commands, and plotting.",
        keyTopics: ["Layers & Line Types", "Block Attributes", "DWG Export & Plot Setup"]
      }
    ]
  },
  {
    id: "eb-me-206",
    code: "ME-206",
    title: "Thermodynamics & Heat Engines",
    titleBn: "থার্মোডাইনামিক্স এবং হিট ইঞ্জিন",
    dept: "mechanical",
    category: "Mechanical Engineering",
    author: "Prof. K. A. Rahman & Board Technical Experts",
    edition: "5th Edition",
    pages: "420 Pages",
    size: "18.5 MB",
    isAvailable: true, // AVAILABLE 2
    summary: "Core 2nd Year Mechanical Engineering text covering the Zeroth, First, and Second Laws of Thermodynamics, ideal gas cycles, steam generation, steam turbines, and IC engines.",
    chapters: [
      {
        chapterNo: 1,
        title: "Fundamental Concepts & Zeroth Law of Thermodynamics",
        summary: "Thermodynamic systems (closed, open, isolated), properties, state, equilibrium, and temperature measurement.",
        keyTopics: ["System Boundary & Surroundings", "Quasi-Static Process", "Thermometric Scales"]
      },
      {
        chapterNo: 2,
        title: "First Law of Thermodynamics & Energy Equations",
        summary: "Internal energy, heat, work, Steady Flow Energy Equation (SFEE) applied to nozzles, turbines, compressors, and boilers.",
        keyTopics: ["SFEE Derivation", "Enthalpy & Specific Heat", "Joule's Experiment"]
      },
      {
        chapterNo: 3,
        title: "Second Law of Thermodynamics & Entropy",
        summary: "Kelvin-Planck and Clausius statements, Carnot cycle, heat engines, refrigerators, heat pumps, and entropy concept.",
        keyTopics: ["Carnot Efficiency Formula", "Reversibility & Irreversibility", "T-s & h-s Diagrams"]
      },
      {
        chapterNo: 4,
        title: "Properties of Pure Substances & Steam Cycles",
        summary: "Phase change of water, steam tables, Mollier chart, Rankine cycle, reheat cycle, and steam boiler efficiency.",
        keyTopics: ["Dryness Fraction (x)", "Superheated Steam", "Rankine Cycle Efficiency"]
      },
      {
        chapterNo: 5,
        title: "Internal Combustion (IC) Engine Cycles",
        summary: "Otto cycle, Diesel cycle, Dual combustion cycle, air standard efficiencies, four-stroke and two-stroke engines.",
        keyTopics: ["Compression Ratio", "Mean Effective Pressure", "Engine Indicator Diagrams"]
      }
    ]
  },
  {
    id: "eb-me-301",
    code: "ME-301",
    title: "Fluid Mechanics & Hydraulic Machinery",
    titleBn: "ফ্লুইড মেকানিক্স এবং হাইড্রোলিক মেশিনারি",
    dept: "mechanical",
    category: "Mechanical Engineering",
    author: "Technical Curriculum Board BNIE",
    edition: "Latest Edition",
    pages: "380 Pages",
    size: "16.8 MB",
    isAvailable: false, // NOT AVAILABLE
    summary: "Fluid statics, Bernoulli's equation, pipe flow, Pelton wheel, Francis turbine, Kaplan turbine, and centrifugal pumps."
  },
  {
    id: "eb-me-401",
    code: "ME-401",
    title: "Machine Design & Component Analysis",
    titleBn: "মেশিন ডিজাইন ও উপাদান বিশ্লেষণ",
    dept: "mechanical",
    category: "Mechanical Engineering",
    author: "Mechanical Design Consortium",
    edition: "3rd Edition",
    pages: "440 Pages",
    size: "20.1 MB",
    isAvailable: false, // NOT AVAILABLE
    summary: "Stress analysis, factor of safety, shaft design, spur gears, helical gears, bearings, brakes, and clutches."
  },
  {
    id: "eb-66811",
    code: "66811",
    title: "Basic Electronics & Semiconductor Devices",
    titleBn: "বেসিক ইলেকট্রনিক্স এবং সেমিকন্ডাক্টর ডিভাইস",
    dept: "electronics",
    category: "Electronics Technology",
    author: "Engr. M. Haque & Dr. S. Ahmed",
    edition: "4th National Edition",
    pages: "290 Pages",
    size: "12.4 MB",
    isAvailable: false, // NOT AVAILABLE
    summary: "PN junction diodes, Zener diodes, BJT transistors, FET/MOSFET characteristics, and rectifier circuits."
  },
  {
    id: "eb-66822",
    code: "66822",
    title: "Digital Electronics & Logic Circuits",
    titleBn: "ডিজিটাল ইলেকট্রনিক্স ও লজিক সার্কিট",
    dept: "electronics",
    category: "Electronics Technology",
    author: "Digital Systems Committee",
    edition: "3rd Edition",
    pages: "340 Pages",
    size: "15.1 MB",
    isAvailable: false, // NOT AVAILABLE
    summary: "Boolean algebra, logic gates, combinational circuits, flip-flops, counters, shift registers, and ADC/DAC converters."
  },
  {
    id: "eb-66711",
    code: "66711",
    title: "Electrical Circuits & Network Analysis",
    titleBn: "ইলেকট্রিক্যাল সার্কিট ও নেটওয়ার্ক থিওরি",
    dept: "electrical",
    category: "Electrical Engineering",
    author: "Power Engineering Faculty",
    edition: "Standard Edition",
    pages: "360 Pages",
    size: "17.0 MB",
    isAvailable: false, // NOT AVAILABLE
    summary: "Ohm's Law, Kirchhoff's Laws, Thevenin's & Norton's theorems, AC resonance, three-phase systems, and power calculations."
  },
  {
    id: "eb-acm-101",
    code: "ACM-101",
    title: "Refrigeration Principles & HVAC Servicing",
    titleBn: "রেফ্রিজারেশন মূলনীতি এবং এইচভিএসি সার্ভিসিং",
    dept: "acm",
    category: "Air Condition & Maintenance",
    author: "Cooling & Thermal Diagnostics Panel",
    edition: "2nd Edition",
    pages: "275 Pages",
    size: "11.6 MB",
    isAvailable: false, // NOT AVAILABLE
    summary: "Vapour compression cycle, eco-friendly refrigerants, psychrometry, air conditioning duct design, and fault diagnostics."
  },
  {
    id: "eb-gen-102",
    code: "GEN-102",
    title: "Engineering Mathematics-I (Calculus & Vectors)",
    titleBn: "ইঞ্জিনিয়ারিং গণিত-১ (ক্যালকুলাস ও ভেক্টর)",
    dept: "general",
    category: "Basic Science & Mathematics",
    author: "Mathematics Board BNIE",
    edition: "Standard Academic Text",
    pages: "450 Pages",
    size: "19.2 MB",
    isAvailable: false, // NOT AVAILABLE
    summary: "Differential calculus, integral calculus, differential equations, matrices, determinants, and vector analysis."
  },
  {
    id: "eb-gen-103",
    code: "GEN-103",
    title: "Engineering Physics & Applied Mechanics",
    titleBn: "ইঞ্জিনিয়ারিং পদার্থবিজ্ঞান ও বলবিদ্যা",
    dept: "general",
    category: "Basic Science & Mathematics",
    author: "Department of Applied Physics",
    edition: "4th Edition",
    pages: "390 Pages",
    size: "16.4 MB",
    isAvailable: false, // NOT AVAILABLE
    summary: "Newtonian mechanics, work, energy, power, elasticity, surface tension, optics, wave motion, and modern physics."
  },
  {
    id: "eb-gen-104",
    code: "GEN-104",
    title: "Engineering Chemistry & Metallurgy",
    titleBn: "ইঞ্জিনিয়ারিং রসায়ন ও ধাতুবিদ্যা",
    dept: "general",
    category: "Basic Science & Mathematics",
    author: "Chemical Engineering Faculty",
    edition: "2nd Edition",
    pages: "310 Pages",
    size: "13.8 MB",
    isAvailable: false, // NOT AVAILABLE
    summary: "Atomic structure, chemical bonding, electrochemistry, corrosion prevention, water treatment, polymers, and alloys."
  },
  {
    id: "eb-civ-201",
    code: "CIV-201",
    title: "Surveying-I & Construction Technology",
    titleBn: "সার্ভেয়ারিং-১ ও নির্মাণ প্রযুক্তি",
    dept: "civil",
    category: "Civil Engineering",
    author: "Civil Faculty Panel",
    edition: "3rd Edition",
    pages: "370 Pages",
    size: "15.9 MB",
    isAvailable: false, // NOT AVAILABLE
    summary: "Chain surveying, compass surveying, plane table survey, levelling, building construction materials, and masonry."
  },
  {
    id: "eb-com-101",
    code: "COM-101",
    title: "Computer Applications & Programming in C",
    titleBn: "কম্পিউটার অ্যাপ্লিকেশন এবং সি প্রোগ্রামিং",
    dept: "computer",
    category: "Computer Technology",
    author: "ICT Curriculum Division",
    edition: "Latest Edition",
    pages: "330 Pages",
    size: "14.5 MB",
    isAvailable: false, // NOT AVAILABLE
    summary: "Computer architecture, operating systems, algorithms, flowcharts, C programming syntax, arrays, pointers, and structures."
  },
  {
    id: "eb-voc-101",
    code: "VOC-101",
    title: "General Mechanics & Workshop Tools (SSC Vocational)",
    titleBn: "জেনারেল মেকানিক্স ও ওয়ার্কশপ টুলস",
    dept: "vocational",
    category: "Vocational Studies",
    author: "Vocational Training Board",
    edition: "Standard Trade Text",
    pages: "220 Pages",
    size: "9.8 MB",
    isAvailable: false, // NOT AVAILABLE
    summary: "Bench work, filing, sawing, drilling, measuring tools, safety precautions, and practical trade exercises."
  }
];

const HANDBOOKS_STORAGE_KEY = "bnie_handbooks_config";
const EBOOKS_STORAGE_KEY = "bnie_ebooks_config";

export function getStoredHandbooks(): HandbookItem[] {
  try {
    const raw = localStorage.getItem(HANDBOOKS_STORAGE_KEY);
    if (raw) {
      const parsed: HandbookItem[] = JSON.parse(raw);
      // Ensure all initial items exist with updated properties
      return INITIAL_HANDBOOKS.map((init) => {
        const found = parsed.find((p) => p.id === init.id);
        return found ? { ...init, isAvailable: found.isAvailable } : init;
      });
    }
  } catch (e) {
    console.error("Failed to load handbooks from storage", e);
  }
  return INITIAL_HANDBOOKS;
}

export function saveStoredHandbooks(items: HandbookItem[]): void {
  try {
    localStorage.setItem(HANDBOOKS_STORAGE_KEY, JSON.stringify(items));
    // Asynchronously synchronize to Firestore
    import("../lib/firebase").then(({ db, sanitizeForFirestore }) => {
      import("firebase/firestore").then(({ doc, setDoc }) => {
        const docRef = doc(db, "resources", "handbooks");
        const statusMap = items.map(h => ({ id: h.id, isAvailable: h.isAvailable }));
        setDoc(docRef, sanitizeForFirestore({ items: statusMap, updatedAt: new Date().toISOString() })).catch(err => {
          console.warn("Failed to sync handbooks to Firestore:", err);
        });
      });
    });
  } catch (e) {
    console.error("Failed to save handbooks to storage", e);
  }
}

export async function fetchStoredHandbooksFromDb(): Promise<HandbookItem[]> {
  try {
    const { db } = await import("../lib/firebase");
    const { doc, getDoc } = await import("firebase/firestore");
    const docRef = doc(db, "resources", "handbooks");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data.items)) {
        const updated = INITIAL_HANDBOOKS.map((init) => {
          const found = data.items.find((p: { id: string; isAvailable: boolean }) => p.id === init.id);
          return found ? { ...init, isAvailable: found.isAvailable } : init;
        });
        try {
          localStorage.setItem(HANDBOOKS_STORAGE_KEY, JSON.stringify(updated));
        } catch (_) {}
        return updated;
      }
    }
  } catch (err) {
    console.warn("Could not fetch remote handbooks status, using local:", err);
  }
  return getStoredHandbooks();
}

export function getStoredEbooks(): EbookItem[] {
  try {
    const raw = localStorage.getItem(EBOOKS_STORAGE_KEY);
    if (raw) {
      const parsed: EbookItem[] = JSON.parse(raw);
      return INITIAL_EBOOKS.map((init) => {
        const found = parsed.find((p) => p.id === init.id);
        return found ? { ...init, isAvailable: found.isAvailable } : init;
      });
    }
  } catch (e) {
    console.error("Failed to load ebooks from storage", e);
  }
  return INITIAL_EBOOKS;
}

export function saveStoredEbooks(items: EbookItem[]): void {
  try {
    localStorage.setItem(EBOOKS_STORAGE_KEY, JSON.stringify(items));
    // Asynchronously synchronize to Firestore
    import("../lib/firebase").then(({ db, sanitizeForFirestore }) => {
      import("firebase/firestore").then(({ doc, setDoc }) => {
        const docRef = doc(db, "resources", "ebooks");
        const statusMap = items.map(e => ({ id: e.id, isAvailable: e.isAvailable }));
        setDoc(docRef, sanitizeForFirestore({ items: statusMap, updatedAt: new Date().toISOString() })).catch(err => {
          console.warn("Failed to sync ebooks to Firestore:", err);
        });
      });
    });
  } catch (e) {
    console.error("Failed to save ebooks to storage", e);
  }
}

export async function fetchStoredEbooksFromDb(): Promise<EbookItem[]> {
  try {
    const { db } = await import("../lib/firebase");
    const { doc, getDoc } = await import("firebase/firestore");
    const docRef = doc(db, "resources", "ebooks");
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data.items)) {
        const updated = INITIAL_EBOOKS.map((init) => {
          const found = data.items.find((p: { id: string; isAvailable: boolean }) => p.id === init.id);
          return found ? { ...init, isAvailable: found.isAvailable } : init;
        });
        try {
          localStorage.setItem(EBOOKS_STORAGE_KEY, JSON.stringify(updated));
        } catch (_) {}
        return updated;
      }
    }
  } catch (err) {
    console.warn("Could not fetch remote ebooks status, using local:", err);
  }
  return getStoredEbooks();
}
