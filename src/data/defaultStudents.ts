import { Category, Group, Religion, Student } from "../types";
import { generateEmptySubjectGrades } from "./subjectLoader";

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

export const DEFAULT_STUDENTS: Student[] = [
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
  }
];

// Ensure default students have consistent subject codes and marks matching their gradePoints
import { getSubjectCode } from "./subjectLoader";
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
}
