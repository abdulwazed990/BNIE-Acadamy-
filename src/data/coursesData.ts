export interface Course {
  id: string;
  name: string;
  bengaliName: string;
  shortDescription: string;
  fullDescription: string;
  duration: string; // "3 Months" | "6 Months" | "1 Year" | "2 Years" | "4 Years"
  durationCategory: "3-Month" | "6-Month" | "1-Year" | "2-Year" | "4-Year";
  category: "Technology" | "Business" | "Professional" | "Engineering" | "Vocational";
  enrollmentFee: number;
  totalFee: number;
  certificateType: string;
  eligibility: string;
  careerOpportunities: string[];
  curriculum: string[];
  semesterBreakdown?: {
    semester: string;
    subjects: string[];
  }[];
  imageUrl: string;
  admissionRequirements: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
  isLatest?: boolean;
}

export const DIPLOMA_COURSES: Course[] = [
  // ==================== 3-MONTH PROGRAMS (10 courses) ====================
  {
    id: "om-3m",
    name: "Office Management",
    bengaliName: "অফিস ম্যানেজমেন্ট",
    shortDescription: "Learn key administrative procedures, filing systems, business communications, and professional office tool operations.",
    fullDescription: "This intensive 3-Month certificate program prepares students with essential skills for standard corporate administrative roles. Students learn standard business correspondence, digital filing architectures, meeting coordination protocols, and office software tools.",
    duration: "3 Months",
    durationCategory: "3-Month",
    category: "Business",
    enrollmentFee: 1500,
    totalFee: 6500,
    certificateType: "Certificate in Office Administration",
    eligibility: "HSC or equivalent passed",
    careerOpportunities: ["Office Assistant", "Front Desk Representative", "Administrative Secretary"],
    curriculum: [
      "Introduction to Modern Office Administration",
      "Business Communications & Email Etiquette",
      "Digital Data Archival and Filing Systems",
      "Meeting Scheduling and Minutes Writing",
      "Office Ethics and Interpersonal Skills"
    ],
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of HSC Certificate/Marksheet",
      "Two passport-sized photographs",
      "National ID or Birth Registration Card"
    ],
    isFeatured: true
  },
  {
    id: "coa-3m",
    name: "Computer Office Application",
    bengaliName: "কম্পিউটার অফিস অ্যাপ্লিকেশন",
    shortDescription: "Master Microsoft Word, Excel, PowerPoint, Access, and web browsing essentials for workplace efficiency.",
    fullDescription: "The absolute standard for digital literacy. This 3-month course focuses strictly on hands-on exercises in document preparation, spreadsheet bookkeeping, presentations, basic databases, and internet technologies.",
    duration: "3 Months",
    durationCategory: "3-Month",
    category: "Technology",
    enrollmentFee: 1000,
    totalFee: 4500,
    certificateType: "Certificate in Computer Applications",
    eligibility: "SSC or equivalent passed",
    careerOpportunities: ["Data Entry Operator", "Computer Operator", "Office Clerk"],
    curriculum: [
      "Microsoft Word (Advanced Formatting & Mail Merge)",
      "Microsoft Excel (Formulas, Pivot Tables, Charts)",
      "Microsoft PowerPoint (Corporate Presentations)",
      "Basic Database Management (MS Access)",
      "Internet, Email, and Cloud Drive operations"
    ],
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC Certificate/Marksheet",
      "Two passport-sized photographs"
    ],
    isPopular: true
  },
  {
    id: "gd-3m",
    name: "Graphic Design",
    bengaliName: "গ্রাফিক ডিজাইন",
    shortDescription: "Develop design sensibilities while mastering Adobe Photoshop and Illustrator for logo, print, and social media design.",
    fullDescription: "A fast-paced program teaching core layout concepts, vector design principles, photo restoration, brand identity assets, and freelancing project submission.",
    duration: "3 Months",
    durationCategory: "3-Month",
    category: "Professional",
    enrollmentFee: 2000,
    totalFee: 8000,
    certificateType: "Certificate in Graphic Arts",
    eligibility: "SSC or equivalent passed",
    careerOpportunities: ["Junior Graphic Designer", "UI/UX Assistant", "Social Media Asset Creator"],
    curriculum: [
      "Principles of Design & Color Theory",
      "Adobe Photoshop: Image Editing, Retouching & Compositing",
      "Adobe Illustrator: Vector Graphics & Logo Creation",
      "Typography, Layout, and Branding Guidelines",
      "Export Formats and Marketplace Setup"
    ],
    imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC Certificate",
      "Basic computer operating knowledge is mandatory"
    ],
    isLatest: true
  },
  {
    id: "dm-3m",
    name: "Digital Marketing",
    bengaliName: "ডিজিটাল মার্কেটিং",
    shortDescription: "Boost products online with SEO, Social Media Ads, Content Strategy, and Marketing Analytics.",
    fullDescription: "Perfect for entrepreneurs and young marketers. Covers SEO strategies, paid ad campaigns, copywriting, and dynamic performance reporting platforms.",
    duration: "3 Months",
    durationCategory: "3-Month",
    category: "Business",
    enrollmentFee: 1500,
    totalFee: 7000,
    certificateType: "Certificate in Digital Marketing",
    eligibility: "HSC or equivalent passed",
    careerOpportunities: ["Social Media Specialist", "SEO Executive", "Digital Marketing Assistant"],
    curriculum: [
      "Foundations of Search Engine Optimization (SEO)",
      "Social Media Marketing (Facebook, Instagram Ads)",
      "Google Ads and Analytics Suite",
      "Copywriting and Content Marketing",
      "Email Campaign Systems"
    ],
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of HSC Marksheet",
      "Basic English proficiency"
    ],
    isFeatured: true
  },
  {
    id: "wd-3m",
    name: "Web Design",
    bengaliName: "ওয়েব ডিজাইন",
    shortDescription: "Build mobile-friendly modern layouts using HTML5, CSS3, Tailwind CSS, and basic JavaScript interactions.",
    fullDescription: "Gain standard modern frontend skills. Master semantics, grid layouts, responsive queries, and deploying standard code templates online.",
    duration: "3 Months",
    durationCategory: "3-Month",
    category: "Technology",
    enrollmentFee: 2000,
    totalFee: 8500,
    certificateType: "Certificate in Web Design",
    eligibility: "HSC or equivalent passed",
    careerOpportunities: ["Web Designer", "Frontend Assistant", "HTML/CSS Developer"],
    curriculum: [
      "Semantic HTML5 & Visual Structuring",
      "CSS3 Styling: Flexbox, Grid, and Variables",
      "Tailwind CSS and Utility-First Systems",
      "Responsive Web Design (Mobile First principles)",
      "JavaScript Basics and DOM Manipulation"
    ],
    imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of HSC Certificate",
      "Prior knowledge of Computer Applications recommended"
    ]
  },
  {
    id: "ff-3m",
    name: "Freelancing Fundamentals",
    bengaliName: "ফ্রিল্যান্সিং ফান্ডামেন্টালস",
    shortDescription: "Understand Upwork, Fiverr, global client communications, bid drafting, and payment gateway architectures.",
    fullDescription: "This guide bridges the gap between skill and revenue. Learn to bid, construct client proposals, receive payments securely, and scale freelance operations.",
    duration: "3 Months",
    durationCategory: "3-Month",
    category: "Professional",
    enrollmentFee: 1500,
    totalFee: 6000,
    certificateType: "Certificate in Freelancing Operations",
    eligibility: "HSC or equivalent with intermediate digital skill",
    careerOpportunities: ["Independent Contractor", "Client Accounts Coordinator"],
    curriculum: [
      "Freelance Platforms (Fiverr, Upwork, Freelancer)",
      "Crafting High-Converting Proposals",
      "Client Communications & Conflict Management",
      "Invoicing & International Money Transfers",
      "Personal Branding and Portfolio Layouts"
    ],
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of HSC Certificate",
      "Verified digital portfolio of any core skill"
    ]
  },
  {
    id: "se-3m",
    name: "Spoken English",
    bengaliName: "স্পোকেন ইংলিশ",
    shortDescription: "Overcome barriers and speak English fluently in professional, interview, and everyday environments.",
    fullDescription: "A highly interactive speaking course focusing on clear pronunciation, phonetics, professional interviews, mock presentations, and business negotiation dialogue.",
    duration: "3 Months",
    durationCategory: "3-Month",
    category: "Professional",
    enrollmentFee: 1000,
    totalFee: 4000,
    certificateType: "Certificate in English Communication",
    eligibility: "SSC or equivalent passed",
    careerOpportunities: ["Call Center Representative", "Customer Success Agent", "Front Office Host"],
    curriculum: [
      "Phonetics & Accent Correction Essentials",
      "Daily Conversation Scenarios & Roleplaying",
      "Corporate Presentation & Interview Prep",
      "Basic Business Correspondence Syntax",
      "Active Listening Skills & Group Debates"
    ],
    imageUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC Certificate"
    ]
  },
  {
    id: "ba-3m",
    name: "Basic Accounting",
    bengaliName: "বেসিক অ্যাকাউন্টিং",
    shortDescription: "Learn double-entry bookkeeping, ledger management, petty cash controls, and basic Excel accounting.",
    fullDescription: "Provides absolute clarity on ledger balancing, journal entry bookkeeping, and manual auditing controls for small business operations.",
    duration: "3 Months",
    durationCategory: "3-Month",
    category: "Business",
    enrollmentFee: 1500,
    totalFee: 5500,
    certificateType: "Certificate in Bookkeeping & Accounting",
    eligibility: "SSC or equivalent passed",
    careerOpportunities: ["Junior Bookkeeper", "Cashier", "Accounts Assistant"],
    curriculum: [
      "Fundamentals of Accounts & Accounting Cycles",
      "Journal Entries, Ledgers, and Trial Balances",
      "Bank Reconciliation Statements",
      "Financial Statements Preparation",
      "Introduction to Digital Accounting Systems"
    ],
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC Certificate"
    ]
  },
  {
    id: "cctv-3m",
    name: "CCTV & Security System",
    bengaliName: "সিসিটিভি ও সিকিউরিটি সিস্টেম",
    shortDescription: "Acquire hardware installation, network mapping, DVR/NVR configuration, and IP camera routing skills.",
    fullDescription: "A physical, hands-on workshop focused on mounting digital security infrastructure, power management, cable termination, and cloud remote view configuration.",
    duration: "3 Months",
    durationCategory: "3-Month",
    category: "Vocational",
    enrollmentFee: 1500,
    totalFee: 7500,
    certificateType: "Certificate in Electronic Security Systems",
    eligibility: "Class 8 or SSC passed",
    careerOpportunities: ["CCTV Technician", "Security System Installer", "Maintenance Executive"],
    curriculum: [
      "Analog vs. IP Camera architectures",
      "DVR, NVR & Hard Drive hardware installation",
      "Cat6 Cabling, RJ45 and BNC termination",
      "Network Router configuration & Static IP allocation",
      "Troubleshooting signal loss & remote monitoring"
    ],
    imageUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC or School Certificate",
      "Two passport-sized photographs"
    ],
    isLatest: true
  },
  {
    id: "ms-3m",
    name: "Mobile Servicing",
    bengaliName: "মোবাইল সার্ভিসিং",
    shortDescription: "Master smartphone hardware micro-soldering, screen replacement, and firmware flashing.",
    fullDescription: "Practical lab training to repair and troubleshoot hardware boards, charging ports, sensors, LCDs, and flash Android/iOS system software.",
    duration: "3 Months",
    durationCategory: "3-Month",
    category: "Vocational",
    enrollmentFee: 1500,
    totalFee: 8000,
    certificateType: "Certificate in Mobile Hardware Repairs",
    eligibility: "Class 8 or SSC passed",
    careerOpportunities: ["Mobile Service Technician", "Repair Shop Supervisor", "Independent Technician"],
    curriculum: [
      "Electronics Fundamentals & Multimeter Usage",
      "SMD Re-soldering & Micro-soldering of chips",
      "OCA Lamination & Display Repair Modules",
      "Software Flashing, Bootloader unlock & FRP controls",
      "Battery Diagnostic & Safety Management"
    ],
    imageUrl: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC or School Card"
    ]
  },

  // ==================== 6-MONTH PROGRAMS (10 courses) ====================
  {
    id: "ca-6m",
    name: "Computer Applications",
    bengaliName: "কম্পিউটার অ্যাপ্লিকেশনস",
    shortDescription: "Go beyond basic office software with intermediate databases, business calculations, and graphic reports.",
    fullDescription: "A balanced semester-long course that blends digital publishing tools, MS Access databases, spreadsheet accounting, and network resource sharing.",
    duration: "6 Months",
    durationCategory: "6-Month",
    category: "Technology",
    enrollmentFee: 2000,
    totalFee: 8500,
    certificateType: "Diploma in Computer Applications",
    eligibility: "HSC or equivalent passed",
    careerOpportunities: ["Senior Office Operator", "Database Clerk", "Admin Coordinator"],
    curriculum: [
      "Advanced Document Formats & Word Processing",
      "Intermediate Relational Databases (MS Access)",
      "Spreadsheet Formulas & Pivot Automations",
      "Desk Publishing & Presentation Frameworks",
      "Basic System Administration & Network Sharing"
    ],
    imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of HSC Certificate/Marksheet",
      "Two passport-sized photographs"
    ],
    isFeatured: true
  },
  {
    id: "ch-6m",
    name: "Computer Hardware",
    bengaliName: "কম্পিউটার হার্ডওয়্যার",
    shortDescription: "Learn diagnostic techniques, hardware maintenance, component installations, and OS deployment.",
    fullDescription: "Comprehensive training in assembling computer hardware, testing motherboards, configuring BIOS, installing dual boots, and fixing power failures.",
    duration: "6 Months",
    durationCategory: "6-Month",
    category: "Technology",
    enrollmentFee: 2000,
    totalFee: 9000,
    certificateType: "Diploma in Computer Hardware Maintenance",
    eligibility: "SSC or equivalent passed",
    careerOpportunities: ["IT Support Technician", "Hardware Repair Analyst", "Help Desk Admin"],
    curriculum: [
      "Assembling components and System Compatibility",
      "BIOS/UEFI Configuration & Post diagnostics",
      "OS Installations (Windows, Linux, Servers)",
      "SMPS, RAM, CPU troubleshooting & replacement",
      "Thermal Paste allocation and cleaning protocols"
    ],
    imageUrl: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC Certificate"
    ]
  },
  {
    id: "nf-6m",
    name: "Networking Fundamentals",
    bengaliName: "নেটওয়ার্কিং ফান্ডামেন্টালস",
    shortDescription: "Understand IPv4 subnetting, router/switch configuration, cabling standards, and server routing.",
    fullDescription: "Step into modern networking. Learn network architectures, configure routers, construct reliable LAN infrastructure, and handle network security audits.",
    duration: "6 Months",
    durationCategory: "6-Month",
    category: "Technology",
    enrollmentFee: 2500,
    totalFee: 11000,
    certificateType: "Diploma in Network Administration",
    eligibility: "HSC or Science background",
    careerOpportunities: ["Network Assistant", "Jr. Network Engineer", "IT Administrator"],
    curriculum: [
      "OSI & TCP/IP Network Architectures",
      "IP Addressing, Subnetting, and CIDR protocols",
      "Router & Switch command line diagnostics",
      "Wi-Fi and Local LAN routing structures",
      "Basic Server security configurations"
    ],
    imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of HSC Science Certificate",
      "General mathematical skills"
    ]
  },
  {
    id: "ac-6m",
    name: "AutoCAD Design",
    bengaliName: "অটোক্যাড ডিজাইন",
    shortDescription: "Master 2D drafting and 3D modeling for industrial engineering, architecture, and civil layouts.",
    fullDescription: "Develop architectural drafts, site plans, structural sections, machine parts, and layer management schemes on industry-standard AutoCAD software.",
    duration: "6 Months",
    durationCategory: "6-Month",
    category: "Engineering",
    enrollmentFee: 2500,
    totalFee: 12000,
    certificateType: "Diploma in CAD Design",
    eligibility: "HSC or Diploma student",
    careerOpportunities: ["CAD Draftsman", "Structural Draftsperson", "Architectural Assistant"],
    curriculum: [
      "AutoCAD UI, Coordinate system, and drawing commands",
      "Layering, Dimensions, Blocks, and Annotations",
      "Isometrics and mechanical drawing layout schemes",
      "3D Modeling, Extrusions, and Materials rendering",
      "Plotting, Scaling, and Architectural Layout sets"
    ],
    imageUrl: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of HSC or Polytechnic Certificate",
      "Basic geometric knowledge"
    ],
    isPopular: true
  },
  {
    id: "id-6m",
    name: "Interior Design",
    bengaliName: "ইন্টেরিয়র ডিজাইন",
    shortDescription: "Formulate spatial plans, select lighting, materials, colors, and design functional furniture.",
    fullDescription: "Learn to optimize spaces, design beautiful modern rooms, select materials, understand cost estimates, and pitch designs.",
    duration: "6 Months",
    durationCategory: "6-Month",
    category: "Professional",
    enrollmentFee: 2500,
    totalFee: 15000,
    certificateType: "Diploma in Interior Design",
    eligibility: "HSC or equivalent passed",
    careerOpportunities: ["Interior Consultant", "Space Planner", "Furniture Designer"],
    curriculum: [
      "Elements of Interior Design & Spatial Balance",
      "Material science: Wood, Glass, Veneers, and Fabrics",
      "Lighting design (Ambient, Task, Accent rules)",
      "Space layout configurations and floor plans",
      "Costing, Budgeting, and presentation methods"
    ],
    imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of HSC Certificate",
      "Creative portfolio or test"
    ]
  },
  {
    id: "pve-6m",
    name: "Photography & Video Editing",
    bengaliName: "ফটোগ্রাফি ও ভিডিও এডিটিং",
    shortDescription: "Master camera operations, lighting setups, Premiere Pro, and DaVinci Resolve color grading.",
    fullDescription: "Hands-on training in DSLR camera mechanics, exposure triangle, portrait photography, video shoot setups, and advanced post-production.",
    duration: "6 Months",
    durationCategory: "6-Month",
    category: "Professional",
    enrollmentFee: 2500,
    totalFee: 14000,
    certificateType: "Diploma in Media Production",
    eligibility: "SSC or equivalent passed",
    careerOpportunities: ["Video Editor", "Event Photographer", "Social Media Content Producer"],
    curriculum: [
      "Camera bodies, Lenses, and Exposure physics",
      "Studio and natural lighting arrangements",
      "Adobe Premiere Pro: Timeline, Audio syncing & Cuts",
      "Color Correction and Grading in DaVinci Resolve",
      "Sound design, Audio cleanup, and Export codecs"
    ],
    imageUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC Certificate",
      "Having a personal camera is optional but highly helpful"
    ],
    isLatest: true
  },
  {
    id: "hm-6m",
    name: "Hotel Management",
    bengaliName: "হোটেল ম্যানেজমেন্ট",
    shortDescription: "Acquire front desk, housekeeping operations, customer relation, and food service credentials.",
    fullDescription: "Gain practical insights into hotel operations. Learn guest check-in/out, standard sanitation procedures, and luxury facility coordination.",
    duration: "6 Months",
    durationCategory: "6-Month",
    category: "Vocational",
    enrollmentFee: 2000,
    totalFee: 12000,
    certificateType: "Diploma in Hospitality Management",
    eligibility: "HSC or equivalent passed",
    careerOpportunities: ["Front Desk Supervisor", "Guest Relations Executive", "Housekeeping Lead"],
    curriculum: [
      "Overview of the Global Hospitality Sector",
      "Front Office operations and reservations software",
      "Food and Beverage services management",
      "Housekeeping standards & hygiene control",
      "Corporate communications & dispute resolution"
    ],
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of HSC Certificate/Marksheet"
    ]
  },
  {
    id: "tm-6m",
    name: "Tourism Management",
    bengaliName: "ট্যুরিজম ম্যানেজমেন্ট",
    shortDescription: "Build tour planning, ticket routing, destination guiding, and travel agency operations skills.",
    fullDescription: "A specialized diploma covering domestic and international tourism architectures, digital booking systems, and tourist safety protocols.",
    duration: "6 Months",
    durationCategory: "6-Month",
    category: "Vocational",
    enrollmentFee: 2000,
    totalFee: 11000,
    certificateType: "Diploma in Travel & Tourism",
    eligibility: "HSC or equivalent passed",
    careerOpportunities: ["Tour Operator", "Travel Consultant", "Destination Planner"],
    curriculum: [
      "Introduction to Tourism Systems and Geography",
      "Tour packaging, costing, and itinerary schemes",
      "Global Distribution Systems (GDS: Amadeus/Galileo)",
      "Destination marketing and PR management",
      "Tour guiding principles & emergency rescue protocols"
    ],
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of HSC Certificate"
    ]
  },
  {
    id: "cg-6m",
    name: "Caregiving",
    bengaliName: "কেয়ারগিভিং",
    shortDescription: "Acquire first-aid skills, elder care, child care, medication protocols, and nursing fundamentals.",
    fullDescription: "A highly humanitarian curriculum mapping first aid, nutrition plans, vital checks, occupational therapy, and emergency caregiving operations.",
    duration: "6 Months",
    durationCategory: "6-Month",
    category: "Vocational",
    enrollmentFee: 2000,
    totalFee: 16000,
    certificateType: "Diploma in Caregiving & Nursing Support",
    eligibility: "SSC or equivalent passed",
    careerOpportunities: ["Professional Caregiver", "Nanny Supervisor", "Elderly Care Assistant"],
    curriculum: [
      "Introduction to Human Anatomy and Vital Signs",
      "Geriatric and Elderly Care protocols",
      "Early Childhood Care and development schemes",
      "Emergency First Aid, CPR, and accident safety",
      "Nutrition, Hygiene, and Medication Administration"
    ],
    imageUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC Certificate",
      "Medical fitness certificate mandatory"
    ],
    isPopular: true
  },
  {
    id: "bm-6m",
    name: "Business Management",
    bengaliName: "বিজনেস ম্যানেজমেন্ট",
    shortDescription: "Learn core operations management, strategic planning, business communication, and small business finances.",
    fullDescription: "Acquire actionable business planning skills. Master budget forecasting, organization architectures, and modern product marketing tactics.",
    duration: "6 Months",
    durationCategory: "6-Month",
    category: "Business",
    enrollmentFee: 2000,
    totalFee: 10000,
    certificateType: "Diploma in Business Management",
    eligibility: "HSC or equivalent passed",
    careerOpportunities: ["Business Assistant", "Assistant Manager", "Operations Coordinator"],
    curriculum: [
      "Principles of Administration and Supervision",
      "Business Plan formulation & Pitch strategies",
      "Small Business Finance & Balance Analysis",
      "Sales, Client Acquisition, and CRM tools",
      "Team Building & Conflict Resolution"
    ],
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of HSC Certificate"
    ]
  },

  // ==================== 1-YEAR PROGRAMS (10 courses) ====================
  {
    id: "cs-1y",
    name: "Computer Science",
    bengaliName: "কম্পিউটার সায়েন্স",
    shortDescription: "One-year deep dive into data structures, algorithms, object-oriented programming, and databases.",
    fullDescription: "A comprehensive program designed to build algorithmic thinking. Gain deep software knowledge, learn database optimization, and construct full projects.",
    duration: "1 Year",
    durationCategory: "1-Year",
    category: "Technology",
    enrollmentFee: 3000,
    totalFee: 24000,
    certificateType: "Professional Diploma in Computer Science",
    eligibility: "HSC passed (Science/Math background highly preferred)",
    careerOpportunities: ["Software Engineer Associate", "Junior Developer", "Database Administrator"],
    curriculum: [
      "Programming Fundamentals using C/C++",
      "Data Structures and Core Algorithmic concepts",
      "Object Oriented Programming (Java or Python)",
      "Relational Database Systems and SQL query design",
      "Web Applications architecture and deployment"
    ],
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of HSC Certificate with Math",
      "Two passport photographs",
      "Pass on-campus basic diagnostic test"
    ],
    isFeatured: true
  },
  {
    id: "it-1y",
    name: "Information Technology",
    bengaliName: "ইনফরমেশন টেকনোলজি",
    shortDescription: "Complete training in system administration, cybersecurity, server management, and network security.",
    fullDescription: "Designed for IT careers. Master server setups, manage network firewalls, deploy virtualization, and fix system hardware.",
    duration: "1 Year",
    durationCategory: "1-Year",
    category: "Technology",
    enrollmentFee: 3000,
    totalFee: 25000,
    certificateType: "Professional Diploma in Information Technology",
    eligibility: "HSC or equivalent passed",
    careerOpportunities: ["IT System Administrator", "Helpdesk Manager", "Systems Support Engineer"],
    curriculum: [
      "Enterprise System Hardware & OS architectures",
      "Advanced Computer Networking and Switch configurations",
      "Windows Server & Linux Server Administration",
      "Cybersecurity threat management & encryption rules",
      "Cloud services (AWS, Google Cloud) & Virtualization"
    ],
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of HSC Certificate",
      "Prior tech experience recommended"
    ],
    isPopular: true
  },
  {
    id: "gmd-1y",
    name: "Graphic & Multimedia Design",
    bengaliName: "গ্রাফিক ও মাল্টিমিডিয়া ডিজাইন",
    shortDescription: "Comprehensive training in corporate graphic layouts, vector designs, UI layouts, and 2D animations.",
    fullDescription: "Master digital graphics and animation. Formulate layouts, build UX wireframes, design vector models, and compile professional motion graphics.",
    duration: "1 Year",
    durationCategory: "1-Year",
    category: "Professional",
    enrollmentFee: 3000,
    totalFee: 28000,
    certificateType: "Professional Diploma in Multimedia Design",
    eligibility: "SSC or HSC passed",
    careerOpportunities: ["Lead Designer", "Multimedia Specialist", "Motion Graphic Artist"],
    curriculum: [
      "Advanced Adobe Suite (Illustrator, Photoshop, InDesign)",
      "User Experience (UX) and Interface (UI) wireframing",
      "Vector character modeling & Typography assets",
      "Adobe After Effects: Motion Graphics & Logo intro setups",
      "Multimedia Portfolio construction and freelancing"
    ],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC/HSC marksheets"
    ]
  },
  {
    id: "ba-1y",
    name: "Business Administration",
    bengaliName: "বিজনেস অ্যাডমিনিস্ট্রেশন",
    shortDescription: "Master corporate administrative systems, HR management, operational frameworks, and business marketing.",
    fullDescription: "A comprehensive professional diploma teaching business analysis, team supervision, strategic planning, and modern sales strategies.",
    duration: "1 Year",
    durationCategory: "1-Year",
    category: "Business",
    enrollmentFee: 3000,
    totalFee: 22000,
    certificateType: "Professional Diploma in Business Administration",
    eligibility: "HSC or equivalent passed",
    careerOpportunities: ["Office Manager", "Executive Assistant", "Retail Manager"],
    curriculum: [
      "Introduction to Corporate Management principles",
      "Human Resource structures and labor welfare rules",
      "Sales, Marketing, and Client Communication setups",
      "Financial budgeting and corporate performance audits",
      "Strategic Business communication and management report layouts"
    ],
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of HSC Certificate"
    ]
  },
  {
    id: "af-1y",
    name: "Accounting and Finance",
    bengaliName: "অ্যাকাউন্টিং অ্যান্ড ফিন্যান্স",
    shortDescription: "A year-long deep dive into taxation, financial analysis, corporate audits, and Tally ERP systems.",
    fullDescription: "Become an expert in digital accounting. Master balance sheets, compute income tax, handle corporate audits, and master Tally Prime.",
    duration: "1 Year",
    durationCategory: "1-Year",
    category: "Business",
    enrollmentFee: 3000,
    totalFee: 23000,
    certificateType: "Professional Diploma in Accounting & Finance",
    eligibility: "HSC in Commerce preferred",
    careerOpportunities: ["Senior Bookkeeper", "Audit Assistant", "Tax Consultant Asssociate"],
    curriculum: [
      "Corporate Accounting cycles and protocols",
      "Financial Reporting and Balance Sheet auditing",
      "Taxation laws & VAT calculation schemes in Bangladesh",
      "Tally Prime ERP / QuickBooks automation packages",
      "Cost Accounting and management asset auditing"
    ],
    imageUrl: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of HSC Certificate",
      "Basic mathematics and Excel knowledge"
    ],
    isLatest: true
  },
  {
    id: "hrm-1y",
    name: "Human Resource Management",
    bengaliName: "হিউম্যান রিসোর্স ম্যানেজমেন্ট",
    shortDescription: "Master corporate recruitment models, employee welfare systems, payroll calculations, and labor laws.",
    fullDescription: "This course trains you in HR operations. Learn recruitment strategies, run payrolls, organize evaluations, and resolve disputes.",
    duration: "1 Year",
    durationCategory: "1-Year",
    category: "Business",
    enrollmentFee: 3000,
    totalFee: 21000,
    certificateType: "Professional Diploma in Human Resources",
    eligibility: "HSC or equivalent passed",
    careerOpportunities: ["HR Officer", "Recruitment Specialist", "Payroll Coordinator"],
    curriculum: [
      "Foundations of Strategic Human Resource Management",
      "Talent Acquisition & Employee recruitment cycles",
      "Performance Appraisals and KPIs formulation",
      "Bangladesh Labor Law (2006) & Compliance frameworks",
      "Compensation structures & Payroll automation software"
    ],
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of HSC Certificate"
    ]
  },
  {
    id: "oad-1y",
    name: "Office Administration",
    bengaliName: "অফিস অ্যাডমিনিস্ট্রেশন",
    shortDescription: "Advanced administrative training covering digital databases, executive routing, and office systems.",
    fullDescription: "Prepares students for executive secretary and office manager roles. Covers advanced documentation, records management, and travel planning.",
    duration: "1 Year",
    durationCategory: "1-Year",
    category: "Business",
    enrollmentFee: 2500,
    totalFee: 18000,
    certificateType: "Professional Diploma in Office Admin",
    eligibility: "HSC passed",
    careerOpportunities: ["Executive Secretary", "Office Administrator", "Records Registrar"],
    curriculum: [
      "Executive Office Management & Systems design",
      "Database systems & digital recording directories",
      "Interpersonal communication & public speaking",
      "Event hosting, scheduling, and protocol management",
      "Advanced Corporate Excel audits and presentations"
    ],
    imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of HSC Marksheet"
    ]
  },
  {
    id: "scm-1y",
    name: "Supply Chain Management",
    bengaliName: "সাপ্লাই চেইন ম্যানেজমেন্ট",
    shortDescription: "Learn procurement, warehouse logistics, distribution systems, and global shipping operations.",
    fullDescription: "Study shipping logistics, customs processes, port transport, warehouse operations, and inventory planning.",
    duration: "1 Year",
    durationCategory: "1-Year",
    category: "Business",
    enrollmentFee: 3000,
    totalFee: 25000,
    certificateType: "Professional Diploma in Supply Chain",
    eligibility: "HSC or Graduate",
    careerOpportunities: ["Logistics Coordinator", "Procurement Assistant", "Inventory Specialist"],
    curriculum: [
      "Principles of Supply Chain & Global Trade",
      "Logistics, Fleet management, and Freight routing",
      "Procurement standards, RFPs, and Vendor contracts",
      "Warehouse Inventory, FIFO models, and safety stocks",
      "Customs clearing, duties, and port coordination"
    ],
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of HSC Certificate"
    ]
  },
  {
    id: "ece-1y",
    name: "Early Childhood Education",
    bengaliName: "আর্লি চাইল্ডহুড এডুকেশন",
    shortDescription: "Become a professional teacher by learning child psychology, lesson formulation, and preschool models.",
    fullDescription: "Gain teacher training credentials. Study child mental health, cognitive development, lesson planning, and interactive class management.",
    duration: "1 Year",
    durationCategory: "1-Year",
    category: "Professional",
    enrollmentFee: 2000,
    totalFee: 17000,
    certificateType: "Professional Diploma in Early Childhood Care",
    eligibility: "HSC or equivalent passed",
    careerOpportunities: ["Preschool Teacher", "Childcare Administrator", "Education Consultant"],
    curriculum: [
      "Child Development Theories and mental evolution",
      "Montessori Method and play-based lesson models",
      "Creative classroom layout design and safety rules",
      "Child health, hygiene, and emergency pediatric care",
      "Lesson Planning, teaching aids, and student evaluations"
    ],
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of HSC Certificate"
    ],
    isLatest: true
  },
  {
    id: "els-1y",
    name: "English Language Studies",
    bengaliName: "ইংলিশ ল্যাঙ্গুয়েজ স্টাডিজ",
    shortDescription: "One year study of IELTS preparation, academic writing, grammar structures, and corporate communication.",
    fullDescription: "Advance your career or study abroad. This course focuses on speech clarity, advanced academic writing, literature overviews, and IELTS prep.",
    duration: "1 Year",
    durationCategory: "1-Year",
    category: "Professional",
    enrollmentFee: 2000,
    totalFee: 16000,
    certificateType: "Professional Diploma in English Studies",
    eligibility: "HSC or equivalent passed",
    careerOpportunities: ["Language Trainer", "Content Writer", "IELTS Instructor Assistant"],
    curriculum: [
      "Advanced English Grammar structures & Lexicon",
      "Creative Writing and Academic report formulating",
      "Public Speaking, debate styles, and oral defense",
      "Comprehensive IELTS preparation (Listening, Reading, Writing, Speaking)",
      "Business and Translation methodologies"
    ],
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of HSC Certificate"
    ]
  },

  // ==================== 2-YEAR PROGRAMS (10 courses) ====================
  {
    id: "ce-2y",
    name: "Computer Engineering",
    bengaliName: "কম্পিউটার ইঞ্জিনিয়ারিং",
    shortDescription: "Two-year higher diploma mapping electronics, microcontroller programming, databases, and network routing.",
    fullDescription: "Gain strong technical engineering skills. Study circuit analysis, microprocessors, database servers, and modern operating systems.",
    duration: "2 Years",
    durationCategory: "2-Year",
    category: "Engineering",
    enrollmentFee: 4000,
    totalFee: 48000,
    certificateType: "Higher National Diploma in Computer Engineering",
    eligibility: "SSC or HSC in Science passed",
    careerOpportunities: ["Hardware System Engineer", "Database Specialist", "Jr. Network Designer"],
    curriculum: [
      "Basic Electronics, Semiconductor Devices & Circuit Design",
      "Digital Logic design and microcontroller systems",
      "Object Oriented software structures and compilers",
      "Database server administration and networking routing",
      "Embedded Systems, IoT, and Sensors configurations"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC/HSC Science Certificate",
      "Basic diagnostic test score sheet"
    ],
    isFeatured: true
  },
  {
    id: "ee-2y",
    name: "Electrical Engineering",
    bengaliName: "ইলেকট্রিক্যাল ইঞ্জিনিয়ারিং",
    shortDescription: "Acquire electrical wiring, power grid calculation, electrical machines, and PLC controller design skills.",
    fullDescription: "Comprehensive industrial training. Study motor controls, heavy grid wiring, PLC programming, solar grids, and high-voltage safety.",
    duration: "2 Years",
    durationCategory: "2-Year",
    category: "Engineering",
    enrollmentFee: 4000,
    totalFee: 50000,
    certificateType: "Higher National Diploma in Electrical Engineering",
    eligibility: "SSC or HSC in Science passed",
    careerOpportunities: ["Electrical Sub-Inspector", "PLC Operator", "Power Plant Technician"],
    curriculum: [
      "AC and DC Circuit physics and calculations",
      "Electrical Machines: Generators, Alternators, Transformers",
      "Industrial Control Panels, Switchgears, and safety rules",
      "Programmable Logic Controllers (PLC) automation",
      "Renewable Energy Systems and Solar Grid planning"
    ],
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC Science Certificate",
      "Physical fitness test for grid work"
    ],
    isPopular: true
  },
  {
    id: "cive-2y",
    name: "Civil Engineering",
    bengaliName: "সিভিল ইঞ্জিনিয়ারিং",
    shortDescription: "Acquire surveying, concrete structures, soil mechanics, and site estimation calculations.",
    fullDescription: "Train for construction careers. Study material testing, surveying, foundation estimation, and CAD drawing setups.",
    duration: "2 Years",
    durationCategory: "2-Year",
    category: "Engineering",
    enrollmentFee: 4000,
    totalFee: 52000,
    certificateType: "Higher National Diploma in Civil Engineering",
    eligibility: "SSC or HSC in Science passed",
    careerOpportunities: ["Construction Supervisor", "Civil Estimator", "Surveying Associate"],
    curriculum: [
      "Engineering Surveying (Theodolite, Total Station operations)",
      "Construction Materials: Concrete, Steel, Brick testing",
      "Structural Analysis and RCC designs basics",
      "Soil Mechanics and Foundations construction setups",
      "Cost Estimation, BOQ formulating and Project planning"
    ],
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC Certificate",
      "Eyesight and color blindness clearance"
    ]
  },
  {
    id: "me-2y",
    name: "Mechanical Engineering",
    bengaliName: "মেকানিক্যাল ইঞ্জিনিয়ারিং",
    shortDescription: "Study thermodynamics, auto engines, lathe machining, hydraulics, and power mechanics.",
    fullDescription: "Learn to operate lathe machines, understand engine components, compute fluid dynamics, and manage industrial boilers.",
    duration: "2 Years",
    durationCategory: "2-Year",
    category: "Engineering",
    enrollmentFee: 4000,
    totalFee: 49000,
    certificateType: "Higher National Diploma in Mechanical",
    eligibility: "SSC or HSC in Science passed",
    careerOpportunities: ["Mechanical Workshop Supervisor", "Boiler Operator", "Automotive Technician"],
    curriculum: [
      "Thermodynamics, Heat engines, and power cycles",
      "Fluid Mechanics, Pumps, and Hydraulics machinery",
      "Machining Processes: Lathe, CNC, Milling setups",
      "Engineering Graphics & CAD modeling basics",
      "Maintenance Planning, Safety standardizations"
    ],
    imageUrl: "https://images.unsplash.com/photo-1537462715879-360eeb61a0bc?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC Science Certificate"
    ]
  },
  {
    id: "at-2y",
    name: "Architecture Technology",
    bengaliName: "আর্কিটেকচার টেকনোলজি",
    shortDescription: "Study building layouts, spatial concepts, model building, and digital drafting architectures.",
    fullDescription: "Combine design and technology. Master SketchUp, study historic architectures, plan ventilation layouts, and build architectural scale models.",
    duration: "2 Years",
    durationCategory: "2-Year",
    category: "Engineering",
    enrollmentFee: 4000,
    totalFee: 55000,
    certificateType: "Higher National Diploma in Architecture",
    eligibility: "SSC or HSC passed",
    careerOpportunities: ["Architectural Draftsman", "3D Visualizer Associate", "Model Maker Specialist"],
    curriculum: [
      "Architectural Design Principles and spatial grids",
      "Building Materials, insulation, and sustainability",
      "Computer-Aided Architectural Drafting (2D & 3D AutoCAD/SketchUp)",
      "History of Global and Regional Architectures",
      "Building Services: Electrical, plumbing, HVAC planning"
    ],
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC Certificate",
      "Drawing test portfolio"
    ],
    isLatest: true
  },
  {
    id: "ag-2y",
    name: "Agriculture Technology",
    bengaliName: "এগ্রিকালচার টেকনোলজি",
    shortDescription: "Study agronomy, soil chemistry, crop cultivation, poultry management, and organic farming.",
    fullDescription: "Gain skills in modern agricultural practices, seed genetics, soil health, fertilizer management, organic farming, and food processing.",
    duration: "2 Years",
    durationCategory: "2-Year",
    category: "Vocational",
    enrollmentFee: 3000,
    totalFee: 38000,
    certificateType: "Higher National Diploma in Agriculture",
    eligibility: "SSC passed",
    careerOpportunities: ["Agriculture Officer Assistant", "Farming Supervisor", "Seed Technologist Associate"],
    curriculum: [
      "Fundamentals of Agronomy and crop patterns",
      "Soil Science, chemistry, and organic nutrition",
      "Pest control, weed management, and bio-pesticides",
      "Poultry, Dairy, and Fisheries management models",
      "Agri-business marketing and cold storage structures"
    ],
    imageUrl: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC Certificate"
    ]
  },
  {
    id: "tt-2y",
    name: "Textile Technology",
    bengaliName: "টেক্সটাইল টেকনোলজি",
    shortDescription: "Study yarn manufacturing, fabric layouts, textile chemistry, and dye operations.",
    fullDescription: "Gain production-floor skills. Learn yarn spinning, weave structures, chemical dyeing, and textile quality testing.",
    duration: "2 Years",
    durationCategory: "2-Year",
    category: "Engineering",
    enrollmentFee: 3500,
    totalFee: 45000,
    certificateType: "Higher National Diploma in Textile",
    eligibility: "SSC passed",
    careerOpportunities: ["Textile Floor Supervisor", "Dyeing Lab Assistant", "Fabric Quality Inspector"],
    curriculum: [
      "Introduction to Textile Fibers and Spinning science",
      "Yarn Manufacturing and weave configurations",
      "Fabric Structure, Knitted and Woven layouts",
      "Textile Chemistry: Dyeing, Printing, and Finishing",
      "Quality Assurance and fabric diagnostic testing"
    ],
    imageUrl: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC Certificate"
    ]
  },
  {
    id: "fdt-2y",
    name: "Fashion Design Technology",
    bengaliName: "ফ্যাশন ডিজাইন টেকনোলজি",
    shortDescription: "Acquire pattern drafting, sewing, fabric science, fashion illustration, and retail credentials.",
    fullDescription: "Develop your fashion design skills. Learn pattern creation, textile sketching, digital styling, and fashion show planning.",
    duration: "2 Years",
    durationCategory: "2-Year",
    category: "Vocational",
    enrollmentFee: 3500,
    totalFee: 46000,
    certificateType: "Higher Diploma in Fashion Design",
    eligibility: "SSC passed",
    careerOpportunities: ["Fashion Illustrator", "Pattern Maker Asssociate", "Boutique Owner"],
    curriculum: [
      "Principles of Fashion Design & Illustration",
      "Textile Science and Fabric selections",
      "Pattern Drafting, cutting, and garment construction",
      "Digital Fashion design and CAD tools",
      "Fashion merchandising, branding, and styling"
    ],
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC Certificate"
    ]
  },
  {
    id: "htm-2y",
    name: "Hotel & Tourism Management",
    bengaliName: "হোটেল ও ট্যুরিজম ম্যানেজমেন্ট",
    shortDescription: "Master hotel administration, food catering systems, tourism economics, and staff management.",
    fullDescription: "Advance your hospitality career. Learn to manage major luxury resorts, design food services, coordinate travel tickets, and handle HR budgets.",
    duration: "2 Years",
    durationCategory: "2-Year",
    category: "Vocational",
    enrollmentFee: 4000,
    totalFee: 42000,
    certificateType: "Higher Diploma in Hospitality & Tourism",
    eligibility: "HSC or equivalent passed",
    careerOpportunities: ["Hotel Assistant Manager", "Tour Operation Director", "F&B Manager"],
    curriculum: [
      "Hospitality & Tourism Economics frameworks",
      "Front Office and CRS Reservation structures",
      "Food and Beverage Production & Catering setups",
      "Travel Agency operations & Ticketing integrations",
      "Customer Relations, CRM, and Event planning models"
    ],
    imageUrl: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of HSC Certificate"
    ]
  },
  {
    id: "mlt-2y",
    name: "Medical Laboratory Technology",
    bengaliName: "মেডিকেল ল্যাবরেটরি টেকনোলজি",
    shortDescription: "Acquire blood testing, pathology, clinic lab, microbiology, and hospital diagnosis skills.",
    fullDescription: "Qualify for hospital lab careers. Learn blood analysis, sample testing, chemical pathology, and medical safety procedures.",
    duration: "2 Years",
    durationCategory: "2-Year",
    category: "Vocational",
    enrollmentFee: 4000,
    totalFee: 56000,
    certificateType: "Higher National Diploma in Lab Tech",
    eligibility: "SSC or HSC in Science passed",
    careerOpportunities: ["Pathology Lab Assistant", "Medical Technician", "Clinic Supervisor"],
    curriculum: [
      "Clinical Biochemistry and Blood diagnostic science",
      "Hematology, blood grouping, and matching rules",
      "Microbiology, Parasitology, and lab testing",
      "Pathology, tissue sampling, and staining layouts",
      "Laboratory management and bio-safety protocols"
    ],
    imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351167?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC Science Certificate",
      "Hepatitis B vaccine clearance"
    ]
  },

  // ==================== 4-YEAR DIPLOMA PROGRAMS (5 courses) ====================
  {
    id: "cse-4y",
    name: "Diploma in Computer Science and Engineering",
    bengaliName: "ডিপ্লোমা ইন কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং",
    shortDescription: "Four-year comprehensive engineering diploma covering advanced programming, networks, hardware, and software development.",
    fullDescription: "The absolute standard in tech. This extensive 4-year engineering diploma includes circuit design, databases, networks, compilers, and a major thesis project.",
    duration: "4 Years",
    durationCategory: "4-Year",
    category: "Engineering",
    enrollmentFee: 5000,
    totalFee: 80000,
    certificateType: "Diploma in Engineering (Computer)",
    eligibility: "SSC passed (with minimum GPA 3.0 in Math/Science)",
    careerOpportunities: ["IT Officer", "Software Engineer Assistant", "Network Operations Lead", "System Engineer"],
    curriculum: [
      "Advanced Math (Calculus & Linear Algebra)",
      "Object-Oriented Coding (Python, C++ & Java)",
      "Database Systems, SQL & Server Management",
      "Computer Networks, Switches, Firewalls & Cybersecurity",
      "Microprocessors, IoT Embedded Systems & Robotics",
      "Software Engineering methodologies & Thesis Project"
    ],
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC Marksheet (Min GPA 3.0)",
      "Three passport-sized photographs",
      "Birth Certificate photocopy"
    ],
    semesterBreakdown: [
      { semester: "Semester 1", subjects: ["Engineering Drawing", "Mathematics-I", "Physics-I", "Basic Electronics", "Computer Fundamentals"] },
      { semester: "Semester 2", subjects: ["Mathematics-II", "Chemistry", "English Communication", "Programming in C", "Electrical Technology"] },
      { semester: "Semester 3", subjects: ["Data Structures", "Digital Electronics", "Physics-II", "Mathematics-III", "Computer Peripherals"] },
      { semester: "Semester 4", subjects: ["Object Oriented Programming", "Database Management", "Microprocessors", "Network Fundamentals", "Web Programming"] },
      { semester: "Semester 5", subjects: ["Operating Systems", "Java Programming", "System Analysis & Design", "Data Communications", "Software Engineering"] },
      { semester: "Semester 6", subjects: ["Cybersecurity", "Network Routing & Switching", "IoT & Embedded Systems", "Advanced Database", "Industrial Management"] },
      { semester: "Semester 7", subjects: ["Cloud Computing", "Artificial Intelligence Basics", "Mobile Apps Development", "Project & Thesis Part I", "Professional Ethics"] },
      { semester: "Semester 8", subjects: ["Industrial Attachment / Internship", "Project & Thesis Part II", "Viva Voce"] }
    ],
    isFeatured: true
  },
  {
    id: "civil-4y",
    name: "Diploma in Civil Engineering",
    bengaliName: "ডিপ্লোমা ইন সিভিল ইঞ্জিনিয়ারিং",
    shortDescription: "Four-year standard civil engineering covering structures, transportation, concrete design, and hydraulic structures.",
    fullDescription: "Gain professional structural planning skills. Study surveying, reinforced concrete, soil diagnostics, site estimating, and building management.",
    duration: "4 Years",
    durationCategory: "4-Year",
    category: "Engineering",
    enrollmentFee: 5000,
    totalFee: 85000,
    certificateType: "Diploma in Engineering (Civil)",
    eligibility: "SSC passed (with minimum GPA 3.0 in Math/Science)",
    careerOpportunities: ["Civil Sub-Assistant Engineer", "Construction Estimator", "CAD Specialist", "Real Estate Quality Executive"],
    curriculum: [
      "Structural Engineering Analysis & RCC Designs",
      "Advanced Surveying & Digital Geodesy (Total Station)",
      "Soil Mechanics, Foundations, and Retaining walls",
      "Environmental Engineering & Waste management",
      "Transportation Engineering & Highway layout planning",
      "Estimating, Costing, BOQ and Project Management"
    ],
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC Marksheet (Min GPA 3.0)",
      "Three passport-sized photographs"
    ],
    semesterBreakdown: [
      { semester: "Semester 1", subjects: ["Civil Engineering Drawing-I", "Mathematics-I", "Physics-I", "Chemistry", "Workshop Practice"] },
      { semester: "Semester 2", subjects: ["Mathematics-II", "Civil Engineering Drawing-II", "Surveying-I", "Construction Materials", "English"] },
      { semester: "Semester 3", subjects: ["Surveying-II", "Applied Mechanics", "Mathematics-III", "Physics-II", "Computer Applications"] },
      { semester: "Semester 4", subjects: ["Theory of Structures", "Geotechnical Engineering", "Fluid Mechanics", "Surveying-III", "RCC Design-I"] },
      { semester: "Semester 5", subjects: ["RCC Design-II", "Transportation Engineering-I", "Estimating & Costing-I", "Hydrology", "Environmental Engineering"] },
      { semester: "Semester 6", subjects: ["Foundation Engineering", "Transportation Engineering-II", "Steel Structure Design", "Estimating-II", "Business Communication"] },
      { semester: "Semester 7", subjects: ["Construction Management", "Hydraulic Structures", "Structural Drafting", "Project Work", "Social Science"] },
      { semester: "Semester 8", subjects: ["Industrial Attachment (3 Months on Real Construction Site)", "Final Project Presentation", "Board Viva"] }
    ],
    isPopular: true
  },
  {
    id: "elec-4y",
    name: "Diploma in Electrical Engineering",
    bengaliName: "ডিপ্লোমা ইন ইলেকট্রিক্যাল ইঞ্জিনিয়ারিং",
    shortDescription: "Four-year standard program covering heavy electrical machines, PLC controllers, solar power grids, and high voltage wiring.",
    fullDescription: "Qualify for senior industrial roles. Study electrical machine designs, high-voltage networks, power transmission, solar grids, and PLCs.",
    duration: "4 Years",
    durationCategory: "4-Year",
    category: "Engineering",
    enrollmentFee: 5000,
    totalFee: 82000,
    certificateType: "Diploma in Engineering (Electrical)",
    eligibility: "SSC passed (with minimum GPA 3.0 in Math/Science)",
    careerOpportunities: ["Sub-Assistant Electrical Engineer", "Power Grid Operator", "PLC System Designer", "Solar System Lead Installer"],
    curriculum: [
      "Electrical Machines (AC/DC Motors & Transformers)",
      "Power Transmission, Distribution & Switchgear systems",
      "Industrial Automation, PLCs & SCADA configurations",
      "High Voltage Engineering & Electrical Grid safety rules",
      "Power Plant Operations & Load calculations",
      "Project work: Smart Grid prototype and panel testing"
    ],
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC Marksheet (Min GPA 3.0)",
      "Three passport-sized photographs"
    ],
    semesterBreakdown: [
      { semester: "Semester 1", subjects: ["Electrical Engineering Drawing", "Mathematics-I", "Physics-I", "Chemistry", "Basic Shop Practice"] },
      { semester: "Semester 2", subjects: ["Mathematics-II", "Electrical Circuits-I", "Electronic Devices", "Programming Basics", "English"] },
      { semester: "Semester 3", subjects: ["Electrical Circuits-II", "DC Machines", "Mathematics-III", "Physics-II", "Computer Applications"] },
      { semester: "Semester 4", subjects: ["AC Machines-I", "Digital Electronics", "Electrical Measurements-I", "Network Analysis", "Industrial Electronics"] },
      { semester: "Semester 5", subjects: ["AC Machines-II", "Transmission & Distribution-I", "Electrical Measurements-II", "PLC & Automation Basics", "Social Science"] },
      { semester: "Semester 6", subjects: ["Switchgear & Protection", "Power Plant Engineering", "Transmission & Distribution-II", "Electrical Machine Design", "Industrial Management"] },
      { semester: "Semester 7", subjects: ["Special Power Grid systems", "Control Systems", "Advanced PLC & SCADA", "Project Work", "Accounting Basics"] },
      { semester: "Semester 8", subjects: ["Industrial Internship (Substation attachment)", "Thesis Viva Voce", "Project Evaluation"] }
    ]
  },
  {
    id: "mech-4y",
    name: "Diploma in Mechanical Engineering",
    bengaliName: "ডিপ্লোমা ইন মেকানিক্যাল ইঞ্জিনিয়ারিং",
    shortDescription: "Four-year deep engineering study covering thermodynamics, fluid machinery, lathe/CNC tooling, and metallurgy.",
    fullDescription: "Gain core manufacturing engineering skills. Study heat power, fluid mechanics, CNC manufacturing, mechanical diagnostics, and automotive systems.",
    duration: "4 Years",
    durationCategory: "4-Year",
    category: "Engineering",
    enrollmentFee: 5000,
    totalFee: 83000,
    certificateType: "Diploma in Engineering (Mechanical)",
    eligibility: "SSC passed (with minimum GPA 3.0 in Math/Science)",
    careerOpportunities: ["Sub-Assistant Mechanical Engineer", "CNC Shop Supervisor", "Boiler Quality Controller", "Automotive Diagnostic Inspector"],
    curriculum: [
      "Heat Power & Advanced Thermodynamics cycles",
      "Fluid Machinery, Turbines, Pumps & Pneumatics",
      "CNC Tooling, Machining & metallurgy calculations",
      "Refrigeration & Air Conditioning plant structures",
      "Strength of Materials & mechanical testing",
      "Thesis/Project: Manufacturing of a functional mechanical system"
    ],
    imageUrl: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC Marksheet (Min GPA 3.0)",
      "Three passport-sized photographs"
    ],
    semesterBreakdown: [
      { semester: "Semester 1", subjects: ["Mechanical Drawing", "Mathematics-I", "Physics-I", "Chemistry", "Basic Fitting Shop"] },
      { semester: "Semester 2", subjects: ["Mathematics-II", "Engineering Mechanics", "Lathe Machining practice", "English", "Basic Electronics"] },
      { semester: "Semester 3", subjects: ["Machine Shop-I", "Mathematics-III", "Physics-II", "Materials Science", "Computer Fundamentals"] },
      { semester: "Semester 4", subjects: ["Machine Shop-II", "Thermodynamics-I", "Strength of Materials", "Fluid Mechanics", "AutoCAD Drafting"] },
      { semester: "Semester 5", subjects: ["Thermodynamics-II", "Hydraulics Machinery", "Refrigeration basics", "Machine Design-I", "Social Science"] },
      { semester: "Semester 6", subjects: ["Heat Power systems", "Air Conditioning design", "Machine Design-II", "CNC Machining & Tools", "Industrial Management"] },
      { semester: "Semester 7", subjects: ["Power Plant Mechanics", "Automotive Systems", "Advanced CNC Lab", "Project Work", "Instrumentation & Control"] },
      { semester: "Semester 8", subjects: ["Industrial Internship (Heavy Machinery Plant)", "Thesis Viva Voce", "Project Review"] }
    ]
  },
  {
    id: "text-4y",
    name: "Diploma in Textile Engineering",
    bengaliName: "ডিপ্লোমা ইন টেক্সটাইল ইঞ্জিনিয়ারিং",
    shortDescription: "Four-year standard study covering yarn processing, weaving structures, dyestuff chemistry, and apparel manufacturing.",
    fullDescription: "Enter the major garment manufacturing sector. Study spinning, chemical dye processing, quality diagnostics, garment layouts, and factory management.",
    duration: "4 Years",
    durationCategory: "4-Year",
    category: "Engineering",
    enrollmentFee: 5000,
    totalFee: 84000,
    certificateType: "Diploma in Engineering (Textile)",
    eligibility: "SSC passed (with minimum GPA 3.0 in Math/Science)",
    careerOpportunities: ["Textile Production Engineer", "Garments Lab Manager", "Dyeing Master", "Textile Merchandiser Assistant"],
    curriculum: [
      "Yarn Manufacture & advanced spinning calculations",
      "Fabric Manufacture, weaves & automatic loom structures",
      "Wet Processing, dyestuff chemistry & printing chemistry",
      "Apparel Manufacturing, patterns & factory setups",
      "Quality diagnostics and physical fabric audits",
      "Merchandising, export-import, and commercial compliance"
    ],
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600",
    admissionRequirements: [
      "Photocopy of SSC Marksheet (Min GPA 3.0)",
      "Three passport-sized photographs"
    ],
    semesterBreakdown: [
      { semester: "Semester 1", subjects: ["Textile Drawing", "Mathematics-I", "Physics-I", "Chemistry", "Yarn Spinning Practice-I"] },
      { semester: "Semester 2", subjects: ["Mathematics-II", "Textile Fibers", "Weaving Practice-I", "English", "Basic Electronics"] },
      { semester: "Semester 3", subjects: ["Yarn Spinning-II", "Fabric Weaving-II", "Mathematics-III", "Physics-II", "Computer Applications"] },
      { semester: "Semester 4", subjects: ["Wet Processing-I", "Textile Testing-I", "Knitting Science", "Spun Yarn calculations", "Social Science"] },
      { semester: "Semester 5", subjects: ["Wet Processing-II", "Textile Testing-II", "Garments Manufacturing-I", "Loom Mechanics", "Chemistry of Dyestuffs"] },
      { semester: "Semester 6", subjects: ["Garments Manufacturing-II", "Dyeing & Printing machines", "Advanced Fabric designs", "Industrial Management", "Welfare rules"] },
      { semester: "Semester 7", subjects: ["Textile Merchandising", "Specialty Fiber technology", "Technical Textiles", "Project Work", "Export-Import controls"] },
      { semester: "Semester 8", subjects: ["Industrial Attachment (Composite Textile / Garments factory)", "Project Defense", "Board Viva Voce"] }
    ],
    isFeatured: true
  }
];
