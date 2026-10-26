import { Category, Group, Religion, Student } from "../types";
import { generateEmptySubjectGrades } from "./subjectLoader";
import { getHistorical3YearHonoursHistoryPreset, getDegreePassPreset } from "./baHistoryCatalogue";

// SVG avatar data representing realistic passport photos for government credentials
export const PASSPORT_AVATARS = {
  male1: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100" height="120">
    <rect width="100" height="120" fill="%23d6e4ff" />
    <circle cx="50" cy="45" r="22" fill="%23f9cda3" />
    <path d="M50,23 C42,23 38,28 38,34 C42,34 45,30 50,30 C55,30 58,34 62,34 C62,28 58,23 50,23 Z" fill="%231a1a1a" />
    <path d="M50,45 C50,45 42,44 38,40" stroke="%231a1a1a" stroke-width="1.5" fill="none" />
    <path d="M62,40 C58,44 50,45 50,45" stroke="%231a1a1a" stroke-width="1.5" fill="none" />
    <circle cx="43" cy="42" r="2" fill="%231a1a1a" />
    <circle cx="57" cy="42" r="2" fill="%231a1a1a" />
    <path d="M50,46 L50,50" stroke="%23e0a370" stroke-width="2" stroke-linecap="round" />
    <path d="M44,53 Q50,58 56,53" stroke="%231a1a1a" stroke-width="1.5" fill="none" />
    <path d="M15,105 Q50,75 85,105 L85,120 L15,120 Z" fill="%23004d40" />
    <path d="M50,77 L50,95" stroke="%23ffffff" stroke-width="4" />
    <rect x="42" y="95" width="16" height="25" fill="%23ffffff" />
    <path d="M50,95 L40,110 L60,110 Z" fill="%23f42a41" />
    <text x="50" y="115" font-family="sans-serif" font-size="6" fill="%23ffffff" text-anchor="middle" font-weight="bold">BNIE</text>
  </svg>`,
  
  female1: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100" height="120">
    <rect width="100" height="120" fill="%23ffe4e6" />
    <circle cx="50" cy="45" r="21" fill="%23fbcfe8" />
    <circle cx="50" cy="45" r="20" fill="%23fed7aa" />
    <path d="M50,22 C34,22 30,32 30,48 C36,44 42,46 50,42 C58,46 64,44 70,48 C70,32 66,22 50,22 Z" fill="%232d1500" />
    <circle cx="42" cy="43" r="2" fill="%231a1a1a" />
    <circle cx="58" cy="43" r="2" fill="%231a1a1a" />
    <path d="M50,47 L50,51" stroke="%23ea580c" stroke-width="1.5" stroke-linecap="round" />
    <path d="M45,53 Q50,57 55,53" stroke="%231a1a1a" stroke-width="1.5" fill="none" />
    <path d="M15,110 C25,82 75,82 85,110 L85,120 L15,120 Z" fill="%230369a1" />
    <path d="M45,82 Q50,95 55,82" fill="%23fed7aa" />
    <path d="M35,90 C45,95 55,95 65,90" stroke="%23fcd34d" stroke-width="3" fill="none" />
    <text x="50" y="115" font-family="sans-serif" font-size="6" fill="%23ffffff" text-anchor="middle" font-weight="bold">GOVT APPROVED</text>
  </svg>`,

  male2: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" width="100" height="120">
    <rect width="100" height="120" fill="%23f0fdf4" />
    <circle cx="50" cy="46" r="22" fill="%23ffedd5" />
    <path d="M50,24 C40,24 36,30 36,36 C42,36 45,32 50,32 C55,32 58,36 64,36 C64,30 60,24 50,24 Z" fill="%23451a03" />
    <circle cx="43" cy="43" r="2" fill="%231a1a1a" />
    <circle cx="57" cy="43" r="2" fill="%231a1a1a" />
    <path d="M50,47 L50,51" stroke="%23c2410c" stroke-width="2" stroke-linecap="round" />
    <path d="M44,54 Q50,59 56,54" stroke="%231a1a1a" stroke-width="1.5" fill="none" />
    <path d="M15,108 Q50,80 85,108 L85,120 L15,120 Z" fill="%231e3a8a" />
    <path d="M50,80 L50,98" stroke="%23f59e0b" stroke-width="3" />
    <text x="50" y="115" font-family="sans-serif" font-size="6" fill="%23ffffff" text-anchor="middle" font-weight="bold">BNIE</text>
  </svg>`
};

const sscGrades = generateEmptySubjectGrades(Category.SSC, Group.SCIENCE, Religion.ISLAM);
// Tweak grades slightly to make it look authentic (mix of A+, A, A-)
sscGrades[0].gradePoint = 5.0; // Bangla 1st: A+
sscGrades[1].gradePoint = 4.0; // Bangla 2nd: A
sscGrades[2].gradePoint = 5.0; // English 1st: A+
sscGrades[3].gradePoint = 4.0; // English 2nd: A
sscGrades[4].gradePoint = 5.0; // Mathematics: A+
sscGrades[5].gradePoint = 5.0; // Religion: A+
sscGrades[6].gradePoint = 4.0; // Physics: A
sscGrades[7].gradePoint = 5.0; // Chemistry: A+
sscGrades[8].gradePoint = 3.5; // Biology: A-
sscGrades[9].gradePoint = 5.0; // Higher Mathematics: A+
sscGrades[10].gradePoint = 5.0; // ICT: A+

const hscGrades = generateEmptySubjectGrades(Category.HSC, Group.BUSINESS_STUDIES, Religion.HINDUISM);
hscGrades[0].gradePoint = 4.0;
hscGrades[1].gradePoint = 4.0;
hscGrades[2].gradePoint = 5.0;
hscGrades[3].gradePoint = 5.0;
hscGrades[4].gradePoint = 5.0;
hscGrades[5].gradePoint = 5.0; // Accounting 1
hscGrades[6].gradePoint = 5.0; // Accounting 2
hscGrades[7].gradePoint = 4.0; // Business Org 1
hscGrades[8].gradePoint = 4.0; // Business Org 2
hscGrades[9].gradePoint = 3.5; // Prod Mgmt 1
hscGrades[10].gradePoint = 4.0; // Prod Mgmt 2
hscGrades[11].gradePoint = 5.0; // Stats 1
hscGrades[12].gradePoint = 5.0; // Stats 2

const diplomaGrades = generateEmptySubjectGrades(Category.DIPLOMA, Group.ENGINEERING, Religion.BUDDHISM);
diplomaGrades[0].gradePoint = 5.0;
diplomaGrades[1].gradePoint = 5.0;
diplomaGrades[2].gradePoint = 4.0;
diplomaGrades[3].gradePoint = 4.0;
diplomaGrades[4].gradePoint = 5.0;
diplomaGrades[5].gradePoint = 5.0;
diplomaGrades[6].gradePoint = 5.0;
diplomaGrades[7].gradePoint = 4.0;
diplomaGrades[8].gradePoint = 5.0;
diplomaGrades[9].gradePoint = 5.0;
diplomaGrades[10].gradePoint = 5.0;

const eeeGrades = generateEmptySubjectGrades(Category.DIPLOMA, Group.ELECTRICAL_ELECTRONICS_ENGINEERING, Religion.ISLAM);
eeeGrades.forEach((g) => {
  g.gradePoint = 3.85;
  g.marks = 82;
});

const acmGrades = generateEmptySubjectGrades(Category.DIPLOMA, Group.AIR_CONDITION_MAINTENANCE, Religion.ISLAM);
acmGrades.forEach((g, idx) => {
  const sampleMarks = [88, 85, 90, 82, 86, 84, 92, 87, 85, 89, 88, 86, 90];
  g.marks = sampleMarks[idx % 13];
  g.gradePoint = 4.00;
});

const electronicsGrades = generateEmptySubjectGrades(Category.DIPLOMA, Group.ELECTRONICS_TECHNOLOGY, Religion.ISLAM);
electronicsGrades.forEach((g, idx) => {
  const sampleMarks = [85, 82, 88, 79, 90, 84, 86, 88, 83, 85, 92, 87, 81, 84, 89, 86, 88, 90, 85, 83, 87, 89, 91];
  g.marks = sampleMarks[idx % sampleMarks.length];
  g.gradePoint = 3.82;
});

const mechanicalGrades = generateEmptySubjectGrades(Category.DIPLOMA, Group.MECHANICAL_ENGINEERING, Religion.ISLAM);
mechanicalGrades.forEach((g, idx) => {
  const sampleMarks = [86, 84, 88, 82, 89, 85, 87, 83, 88, 90, 84, 86, 89, 87, 85, 88, 86, 91, 84, 88, 87, 92, 90];
  g.marks = sampleMarks[idx % sampleMarks.length];
  g.gradePoint = 3.88;
});

// Pre-2001 Bangladesh Board Division System presets (Subject Marks & Divisions, No GPA)
const pre2001SscGrades = generateEmptySubjectGrades(Category.SSC, Group.SCIENCE, Religion.ISLAM);
const ssc1998Marks = [82, 79, 74, 76, 92, 85, 84, 88, 72, 86, 80];
pre2001SscGrades.forEach((g, idx) => {
  g.marks = ssc1998Marks[idx % ssc1998Marks.length];
  g.gradePoint = 0;
});

const pre2001HscGrades = generateEmptySubjectGrades(Category.HSC, Group.SCIENCE, Religion.ISLAM);
const hsc2000Marks = [68, 72, 65, 70, 78, 64, 75, 70, 62, 74, 66];
pre2001HscGrades.forEach((g, idx) => {
  g.marks = hsc2000Marks[idx % hsc2000Marks.length];
  g.gradePoint = 0;
});

export const DEFAULT_STUDENTS: Student[] = [
  {
    id: "stud_pre2001_ssc",
    category: Category.SSC,
    group: Group.SCIENCE,
    religion: Religion.ISLAM,
    name: "Kazi Nurul Islam",
    fatherName: "Kazi Rafiqul Islam",
    motherName: "Begum Jahanara Islam",
    dob: "1982-04-12",
    rollNumber: "184920",
    registrationNumber: "8472910",
    instituteName: "Dhaka Collegiate School, Dhaka",
    session: "1996-1997",
    passingYear: "1998",
    certificateSerialNumber: "BNIE-SSC-1998-4412",
    issueDate: "1998-07-28",
    photoUrl: PASSPORT_AVATARS.male1,
    subjects: pre2001SscGrades,
    finalGpa: 0.00,
    gradingSystem: "Division",
    division: "First Division (Star Marks)",
    totalMarks: 898,
    secureToken: "bnie_sec_ssc_1998_star_8472910"
  },
  {
    id: "stud_pre2001_hsc",
    category: Category.HSC,
    group: Group.SCIENCE,
    religion: Religion.ISLAM,
    name: "Shahana Parveen",
    fatherName: "Anwar Hossain",
    motherName: "Laila Anwar",
    dob: "1984-09-20",
    rollNumber: "394821",
    registrationNumber: "9482715",
    instituteName: "Dhaka City College, Dhaka",
    session: "1998-2000",
    passingYear: "2000",
    certificateSerialNumber: "BNIE-HSC-2000-7219",
    issueDate: "2000-08-30",
    photoUrl: PASSPORT_AVATARS.female1,
    subjects: pre2001HscGrades,
    finalGpa: 0.00,
    gradingSystem: "Division",
    division: "First Division",
    totalMarks: 754,
    secureToken: "bnie_sec_hsc_2000_div_9482715"
  },
  {
    id: "stud_1",
    category: Category.SSC,
    group: Group.SCIENCE,
    religion: Religion.ISLAM,
    name: "Mohammad Tanvir Rahman",
    fatherName: "Mohammad Fazlur Rahman",
    motherName: "Begum Rokeya Rahman",
    dob: "2008-05-14",
    rollNumber: "102938",
    registrationNumber: "2019384756",
    instituteName: "Dhaka Government Vocational High School",
    session: "2022-2023",
    passingYear: "2024",
    certificateSerialNumber: "BNIE-SSC-2024-88491",
    issueDate: "2024-06-20",
    photoUrl: PASSPORT_AVATARS.male1,
    subjects: sscGrades,
    finalGpa: 4.59
  },
  {
    id: "stud_2",
    category: Category.HSC,
    group: Group.BUSINESS_STUDIES,
    religion: Religion.HINDUISM,
    name: "Priya Rani Das",
    fatherName: "Anil Chandra Das",
    motherName: "Gouri Rani Das",
    dob: "2006-11-23",
    rollNumber: "203948",
    registrationNumber: "3019284756",
    instituteName: "Chattogram Government Commerce College",
    session: "2022-2024",
    passingYear: "2024",
    certificateSerialNumber: "BNIE-HSC-2024-91204",
    issueDate: "2024-08-12",
    photoUrl: PASSPORT_AVATARS.female1,
    subjects: hscGrades,
    finalGpa: 4.42
  },
  {
    id: "stud_3",
    category: Category.DIPLOMA,
    group: Group.ENGINEERING, // treated as Engineering stream
    religion: Religion.BUDDHISM,
    name: "Subrata Barua",
    fatherName: "Bimal Barua",
    motherName: "Maya Barua",
    dob: "2004-03-09",
    rollNumber: "405968",
    registrationNumber: "5019283746",
    instituteName: "Bangladesh National Institute of Education, Dhaka",
    session: "2020-2024",
    passingYear: "2024",
    certificateSerialNumber: "BNIE-DIP-2024-11029",
    issueDate: "2024-09-01",
    photoUrl: PASSPORT_AVATARS.male2,
    subjects: diplomaGrades,
    finalGpa: 4.68 // auto calculated in client, but hardcoded here for seed
  },
  {
    id: "stud_4",
    category: Category.DIPLOMA,
    group: Group.ELECTRICAL_ELECTRONICS_ENGINEERING,
    religion: Religion.ISLAM,
    name: "Mahmudul Hasan Siddique",
    fatherName: "Kamrul Hasan Siddique",
    motherName: "Salma Begum",
    dob: "2003-08-18",
    rollNumber: "667101",
    registrationNumber: "1502938471",
    instituteName: "Dhaka Polytechnic Institute, Dhaka",
    session: "2020-2024",
    passingYear: "2024",
    certificateSerialNumber: "BNIE-EEE-2024-66701",
    issueDate: "2024-09-10",
    photoUrl: PASSPORT_AVATARS.male1,
    subjects: eeeGrades,
    finalGpa: 3.85
  },
  {
    id: "stud_5",
    category: Category.DIPLOMA,
    group: Group.AIR_CONDITION_MAINTENANCE,
    religion: Religion.ISLAM,
    name: "Tariqul Islam Rashed",
    fatherName: "Mokhlesur Rahman",
    motherName: "Fatema Begum",
    dob: "2003-10-12",
    rollNumber: "ACM1029",
    registrationNumber: "REG90182736",
    instituteName: "Bangladesh National Institute of Education, Dhaka",
    session: "2020-2021",
    passingYear: "2022",
    certificateSerialNumber: "BNIE-ACM-2022-88102",
    issueDate: "2022-09-12",
    photoUrl: PASSPORT_AVATARS.male2,
    subjects: acmGrades,
    finalGpa: 4.00
  },
  {
    id: "stud_6",
    category: Category.DIPLOMA,
    group: Group.ELECTRONICS_TECHNOLOGY,
    religion: Religion.ISLAM,
    name: "Sajjad Hossain Emon",
    fatherName: "Delwar Hossain",
    motherName: "Shahnaz Parveen",
    dob: "2003-04-15",
    rollNumber: "ET88291",
    registrationNumber: "1602938492",
    instituteName: "Dhaka Polytechnic Institute, Dhaka",
    session: "2020-2024",
    passingYear: "2024",
    certificateSerialNumber: "BNIE-DIP-ET-2024-0821",
    issueDate: "2024-09-15",
    photoUrl: PASSPORT_AVATARS.male2,
    subjects: electronicsGrades,
    finalGpa: 3.82
  },
  {
    id: "stud_7",
    category: Category.DIPLOMA,
    group: Group.MECHANICAL_ENGINEERING,
    religion: Religion.ISLAM,
    name: "Mahfuzur Rahman Shuvo",
    fatherName: "Anisur Rahman",
    motherName: "Hosne Ara Begum",
    dob: "2003-08-20",
    rollNumber: "ME77412",
    registrationNumber: "1703849201",
    instituteName: "Dhaka Polytechnic Institute, Dhaka",
    session: "2020-2024",
    passingYear: "2024",
    certificateSerialNumber: "BNIE-DIP-ME-2024-1104",
    issueDate: "2024-09-15",
    photoUrl: PASSPORT_AVATARS.male1,
    subjects: mechanicalGrades,
    finalGpa: 3.88
  },
  {
    id: "BNIE-DEG-1001",
    category: Category.DEGREE_PASS,
    academicLevel: "Degree Pass",
    programCode: "BA-PASS",
    programName: "Bachelor of Arts (B.A. Pass)",
    department: "Faculty of Arts & Humanities",
    majorSubject: "Bengali National & Modern Literature",
    group: Group.HUMANITIES,
    religion: Religion.ISLAM,
    name: "Farhana Akter Rima",
    fatherName: "Nurul Islam",
    motherName: "Suraiya Begum",
    dob: "2001-04-10",
    rollNumber: "331001",
    registrationNumber: "1903829101",
    instituteName: "Bangladesh National Institute of Education (BNIE)",
    session: "2020-2023",
    currentSemesterOrYear: "3rd Year (Final)",
    admissionYear: "2020",
    courseDuration: "3 Years",
    expectedCompletionYear: "2023",
    examinationYear: "2023",
    passingYear: "2024",
    resultPublicationDate: "2024-05-18",
    certificateSerialNumber: "BNIE-DEG-2024-33101",
    certificateNumber: "BNIE-DEG-CERT-2024-33101",
    certificateStatus: "Issued",
    issueDate: "2024-07-20",
    certificateIssueDate: "2024-07-20",
    photoUrl: PASSPORT_AVATARS.female1,
    finalGpa: 3.65,
    resultStatus: "First Division",
    semesterResults: DEGREE_PROGRAMS_CATALOG.find((p) => p.code === "BA-PASS") 
      ? generateDefaultSemesterResults(DEGREE_PROGRAMS_CATALOG.find((p) => p.code === "BA-PASS")!, 2)
      : [],
    subjects: DEGREE_PROGRAMS_CATALOG.find((p) => p.code === "BA-PASS") 
      ? generateDefaultSemesterResults(DEGREE_PROGRAMS_CATALOG.find((p) => p.code === "BA-PASS")!, 2).flatMap(s => s.subjects)
      : [],
    secureToken: "bnie_sec_deg_331001"
  },
  {
    id: "BNIE-HON-2001",
    category: Category.HONOURS,
    academicLevel: "Honours",
    programCode: "CSE-HON",
    programName: "B.Sc. (Honours) in Computer Science & Engineering (CSE)",
    department: "Department of Computer Science & Engineering",
    majorSubject: "Software Engineering & Artificial Intelligence",
    group: Group.SCIENCE,
    religion: Religion.ISLAM,
    name: "Shahriar Ahmed Tanvir",
    fatherName: "Kamrul Hassan",
    motherName: "Nasreen Sultana",
    dob: "2000-09-18",
    rollNumber: "441001",
    registrationNumber: "2003829102",
    instituteName: "Bangladesh National Institute of Education (BNIE)",
    session: "2019-2023",
    currentSemesterOrYear: "8th Semester (Final)",
    admissionYear: "2019",
    courseDuration: "4 Years",
    expectedCompletionYear: "2023",
    examinationYear: "2023",
    passingYear: "2024",
    resultPublicationDate: "2024-05-20",
    certificateSerialNumber: "BNIE-HON-2024-44102",
    certificateNumber: "BNIE-HON-CERT-2024-44102",
    certificateStatus: "Issued",
    issueDate: "2024-08-15",
    certificateIssueDate: "2024-08-15",
    photoUrl: PASSPORT_AVATARS.male1,
    finalGpa: 3.82,
    resultStatus: "First Class with Honours",
    semesterResults: DEGREE_PROGRAMS_CATALOG.find((p) => p.code === "CSE-HON")
      ? generateDefaultSemesterResults(DEGREE_PROGRAMS_CATALOG.find((p) => p.code === "CSE-HON")!, 4)
      : [],
    subjects: DEGREE_PROGRAMS_CATALOG.find((p) => p.code === "CSE-HON")
      ? generateDefaultSemesterResults(DEGREE_PROGRAMS_CATALOG.find((p) => p.code === "CSE-HON")!, 4).flatMap(s => s.subjects)
      : [],
    secureToken: "bnie_sec_hon_441001"
  },
  {
    id: "BNIE-MAS-3001",
    category: Category.MASTERS,
    academicLevel: "Masters",
    programCode: "MBA-GEN",
    programName: "Master of Business Administration (M.B.A.)",
    department: "Faculty of Business Administration",
    majorSubject: "Financial Management & Banking",
    group: Group.BUSINESS_STUDIES,
    religion: Religion.ISLAM,
    name: "Nusrat Jahan Mim",
    fatherName: "Abdul Mannan",
    motherName: "Ferdousi Begum",
    dob: "1998-11-22",
    rollNumber: "551001",
    registrationNumber: "2203829103",
    instituteName: "Bangladesh National Institute of Education (BNIE)",
    session: "2022-2024",
    currentSemesterOrYear: "4th Semester (Final)",
    admissionYear: "2022",
    courseDuration: "2 Years",
    expectedCompletionYear: "2024",
    examinationYear: "2024",
    passingYear: "2024",
    resultPublicationDate: "2024-06-15",
    certificateSerialNumber: "BNIE-MAS-2024-55103",
    certificateNumber: "BNIE-MAS-CERT-2024-55103",
    certificateStatus: "Issued",
    issueDate: "2024-09-10",
    certificateIssueDate: "2024-09-10",
    photoUrl: PASSPORT_AVATARS.female1,
    finalGpa: 3.90,
    resultStatus: "First Class with Distinction",
    semesterResults: DEGREE_PROGRAMS_CATALOG.find((p) => p.code === "MBA-GEN")
      ? generateDefaultSemesterResults(DEGREE_PROGRAMS_CATALOG.find((p) => p.code === "MBA-GEN")!, 6)
      : [],
    subjects: DEGREE_PROGRAMS_CATALOG.find((p) => p.code === "MBA-GEN")
      ? generateDefaultSemesterResults(DEGREE_PROGRAMS_CATALOG.find((p) => p.code === "MBA-GEN")!, 6).flatMap(s => s.subjects)
      : [],
    secureToken: "bnie_sec_mas_551001"
  },
  {
    id: "BNIE-BBA-4001",
    category: Category.HONOURS,
    academicLevel: "Honours",
    programCode: "BBA-ACC",
    programName: "Bachelor of Business Administration (BBA)",
    department: "Department of Accounting & Information Systems",
    majorSubject: "Accounting",
    group: Group.BUSINESS_STUDIES,
    religion: Religion.ISLAM,
    name: "Mahmudul Hasan",
    fatherName: "Khorshed Alam",
    motherName: "Rokeya Begum",
    dob: "2001-05-12",
    rollNumber: "661001",
    registrationNumber: "2003829104",
    instituteName: "Bangladesh National Institute of Education (BNIE)",
    session: "2020-2024",
    currentSemesterOrYear: "8th Semester (Final)",
    admissionYear: "2020",
    courseDuration: "4 Years",
    expectedCompletionYear: "2024",
    examinationYear: "2024",
    passingYear: "2024",
    resultPublicationDate: "2024-05-20",
    certificateSerialNumber: "BNIE-BBA-2024-66104",
    certificateNumber: "BNIE-BBA-CERT-2024-0012",
    certificateStatus: "Issued",
    issueDate: "2024-09-15",
    certificateIssueDate: "2024-11-16",
    photoUrl: PASSPORT_AVATARS.male2,
    finalGpa: 3.85,
    resultStatus: "First Class with Honours",
    semesterResults: DEGREE_PROGRAMS_CATALOG.find((p) => p.code === "BBA-ACC")
      ? generateDefaultSemesterResults(DEGREE_PROGRAMS_CATALOG.find((p) => p.code === "BBA-ACC")!, 4)
      : [],
    subjects: DEGREE_PROGRAMS_CATALOG.find((p) => p.code === "BBA-ACC")
      ? generateDefaultSemesterResults(DEGREE_PROGRAMS_CATALOG.find((p) => p.code === "BBA-ACC")!, 4).flatMap(s => s.subjects)
      : [],
    secureToken: "bnie_sec_bba_661001"
  },
  {
    id: "BNIE-BA-5001",
    category: Category.HONOURS,
    academicLevel: "Honours",
    programCode: "BA-HIS",
    programName: "Bachelor of Arts (BA)",
    department: "Department of History",
    majorSubject: "History",
    group: Group.HUMANITIES,
    religion: Religion.ISLAM,
    name: "Ahsan Habib",
    fatherName: "Mokbul Hossain",
    motherName: "Fatema Begum",
    dob: "2000-03-14",
    rollNumber: "771001",
    registrationNumber: "2003829105",
    instituteName: "Bangladesh National Institute of Education (BNIE)",
    session: "2020-2024",
    currentSemesterOrYear: "8th Semester (Final)",
    admissionYear: "2020",
    courseDuration: "4 Years",
    expectedCompletionYear: "2024",
    examinationYear: "2024",
    passingYear: "2024",
    resultPublicationDate: "2024-05-20",
    certificateSerialNumber: "BNIE-BA-2024-77105",
    certificateNumber: "BNIE-BA-CERT-2024-0025",
    certificateStatus: "Issued",
    issueDate: "2024-09-15",
    certificateIssueDate: "2024-11-16",
    photoUrl: PASSPORT_AVATARS.male1,
    finalGpa: 3.84,
    resultStatus: "First Class with Honours",
    semesterResults: DEGREE_PROGRAMS_CATALOG.find((p) => p.code === "BA-HIS")
      ? generateDefaultSemesterResults(DEGREE_PROGRAMS_CATALOG.find((p) => p.code === "BA-HIS")!, 3)
      : [],
    subjects: DEGREE_PROGRAMS_CATALOG.find((p) => p.code === "BA-HIS")
      ? generateDefaultSemesterResults(DEGREE_PROGRAMS_CATALOG.find((p) => p.code === "BA-HIS")!, 3).flatMap(s => s.subjects)
      : [],
    secureToken: "bnie_sec_ba_771001"
  },

  // ==================== HISTORICAL 1994 B.A. HONOURS IN HISTORY ====================
  {
    id: "BNIE-BA-1994-01",
    category: Category.HONOURS,
    academicLevel: "Honours",
    programCode: "BA-HIS-1994",
    programName: "Bachelor of Arts (B.A.) Honours",
    examinationTitle: "BACHELOR OF ARTS (B.A.) HONOURS EXAMINATION",
    department: "Department of History",
    majorSubject: "History",
    group: Group.HUMANITIES,
    religion: Religion.ISLAM,
    name: "Mohammad Rafiqul Islam",
    fatherName: "Nurul Islam Chowdhury",
    motherName: "Razia Begum",
    dob: "1972-04-18",
    rollNumber: "194012",
    registrationNumber: "90148201",
    instituteName: "University of Dhaka / Bangladesh National Institute of Education (BNIE)",
    affiliatedCollege: "Dhaka College",
    session: "1990-1991",
    courseDuration: "3 Years",
    admissionYear: "1990",
    examinationYear: "1994",
    passingYear: "1994",
    resultPublicationDate: "1994-11-28",
    certificateSerialNumber: "BNIE-BA-1994-19401",
    certificateNumber: "BNIE-BA-CERT-1994-0018",
    certificateStatus: "Issued",
    issueDate: "1995-02-15",
    certificateIssueDate: "1995-03-20",
    photoUrl: PASSPORT_AVATARS.male1,
    gradingSystem: "Class",
    division: "First Class",
    resultStatus: "First Class with Honours",
    finalGpa: 0, // GPA is conditionally hidden for historical records!
    totalFullMarks: 1600,
    totalMarks: 1036,
    percentage: 64.8,
    isHistoricalRecord: true,
    isVerifiedAcademicRecord: true,
    verificationRemarks: "SAMPLE DATA — NOT AN OFFICIAL ACADEMIC RECORD. Verified against 1990-1994 historical regulation.",
    subjects: getHistorical3YearHonoursHistoryPreset(),
    secureToken: "bnie_sec_ba_194012_1994"
  },

  // ==================== HISTORICAL 2000 B.A. HONOURS IN HISTORY ====================
  {
    id: "BNIE-BA-2000-01",
    category: Category.HONOURS,
    academicLevel: "Honours",
    programCode: "BA-HIS-2000",
    programName: "Bachelor of Arts (B.A.) Honours",
    examinationTitle: "BACHELOR OF ARTS (B.A.) HONOURS EXAMINATION",
    department: "Department of History",
    majorSubject: "History",
    group: Group.HUMANITIES,
    religion: Religion.ISLAM,
    name: "Shamsur Rahman Talukder",
    fatherName: "Kazi Mozammel Haque",
    motherName: "Shamsun Nahar",
    dob: "1978-08-12",
    rollNumber: "200451",
    registrationNumber: "96120491",
    instituteName: "University of Dhaka / Bangladesh National Institute of Education (BNIE)",
    affiliatedCollege: "Dhaka Central College",
    session: "1996-1997",
    courseDuration: "3 Years",
    admissionYear: "1996",
    examinationYear: "2000",
    passingYear: "2000",
    resultPublicationDate: "2000-12-14",
    certificateSerialNumber: "BNIE-BA-2000-20045",
    certificateNumber: "BNIE-BA-CERT-2000-0082",
    certificateStatus: "Issued",
    issueDate: "2001-03-10",
    certificateIssueDate: "2001-04-18",
    photoUrl: PASSPORT_AVATARS.male2,
    gradingSystem: "Class",
    division: "Second Class",
    resultStatus: "Second Class with Honours",
    finalGpa: 0,
    totalFullMarks: 1600,
    totalMarks: 924,
    percentage: 57.8,
    isHistoricalRecord: true,
    isVerifiedAcademicRecord: true,
    verificationRemarks: "SAMPLE DATA — NOT AN OFFICIAL ACADEMIC RECORD.",
    subjects: getHistorical3YearHonoursHistoryPreset().map(s => ({
      ...s,
      marks: Math.max(45, (s.marks || 60) - 7)
    })),
    secureToken: "bnie_sec_ba_200451_2000"
  },

  // ==================== HISTORICAL 1998 B.A. DEGREE PASS ====================
  {
    id: "BNIE-DEG-PASS-1998",
    category: Category.DEGREE_PASS,
    academicLevel: "Degree Pass",
    programCode: "BA-PASS-1998",
    programName: "Bachelor of Arts (B.A.) Degree Pass",
    examinationTitle: "BACHELOR OF ARTS (B.A.) DEGREE PASS EXAMINATION",
    department: "Faculty of Arts & Humanities",
    majorSubject: "Arts & Humanities (Principal & Subsidiary Structure)",
    group: Group.HUMANITIES,
    religion: Religion.ISLAM,
    name: "Begum Rokeya Akhter",
    fatherName: "Abdur Rashid Mia",
    motherName: "Sufia Khatun",
    dob: "1976-11-05",
    rollNumber: "198305",
    registrationNumber: "95180412",
    instituteName: "National University / Bangladesh National Institute of Education (BNIE)",
    affiliatedCollege: "Government College of Arts & Commerce",
    session: "1995-1998",
    courseDuration: "3 Years",
    admissionYear: "1995",
    examinationYear: "1998",
    passingYear: "1998",
    resultPublicationDate: "1998-10-22",
    certificateSerialNumber: "BNIE-PASS-1998-19830",
    certificateNumber: "BNIE-PASS-CERT-1998-0044",
    certificateStatus: "Issued",
    issueDate: "1999-01-20",
    certificateIssueDate: "1999-02-15",
    photoUrl: PASSPORT_AVATARS.female1,
    gradingSystem: "Division",
    division: "First Division",
    resultStatus: "First Division",
    finalGpa: 0,
    totalFullMarks: 900,
    totalMarks: 568,
    percentage: 63.1,
    isHistoricalRecord: true,
    isVerifiedAcademicRecord: true,
    verificationRemarks: "SAMPLE DATA — NOT AN OFFICIAL ACADEMIC RECORD. B.A. Degree Pass verified record.",
    subjects: getDegreePassPreset(),
    secureToken: "bnie_sec_pass_198305_1998"
  }
];

// Ensure default students have consistent subject codes and marks matching their gradePoints
import { getSubjectCode } from "./subjectLoader";
import { DEGREE_PROGRAMS_CATALOG, generateDefaultSemesterResults } from "./degreeProgramsCatalog";
import { generateSecureToken } from "../types";

for (const student of DEFAULT_STUDENTS) {
  // Assign deterministic secure tokens to default seed records for easy testing and consistent verification urls
  if (!student.secureToken) {
    if (student.rollNumber === "102938") {
      student.secureToken = "bnie_sec_8bf2d91a-c0fe-429a-8e2d-304ab8d9b152";
    } else if (student.rollNumber === "203948") {
      student.secureToken = "bnie_sec_d572e90c-b26a-4c22-b9e7-49cd5e8b61c9";
    } else if (student.rollNumber === "405968") {
      student.secureToken = "bnie_sec_e2c90a1b-36d4-4a59-be21-d7ac3f29ef88";
    } else {
      student.secureToken = generateSecureToken();
    }
  }

  let studentTotalMarks = 0;
  for (const sub of student.subjects) {
    if (!sub.subjectCode) {
      sub.subjectCode = getSubjectCode(sub.subjectName);
    }
    if (sub.marks === undefined) {
      // Map grade point to a realistic mark
      if (sub.gradePoint >= 5.0) sub.marks = 88;
      else if (sub.gradePoint >= 4.0) sub.marks = 74;
      else if (sub.gradePoint >= 3.5) sub.marks = 65;
      else if (sub.gradePoint >= 3.0) sub.marks = 55;
      else if (sub.gradePoint >= 2.0) sub.marks = 45;
      else if (sub.gradePoint >= 1.0) sub.marks = 36;
      else sub.marks = 20;
    }
    studentTotalMarks += sub.marks;
  }
  student.totalMarks = studentTotalMarks;
  if (!student.totalFullMarks) {
    let tfm = 0;
    for (const sub of student.subjects) {
      tfm += sub.fullMarks || 100;
    }
    student.totalFullMarks = tfm;
  }
  if (!student.percentage && student.totalFullMarks && student.totalFullMarks > 0) {
    student.percentage = Math.round((studentTotalMarks / student.totalFullMarks) * 1000) / 10;
  }
}
