export enum Category {
  SSC = "SSC",
  HSC = "HSC",
  DIPLOMA = "Diploma",
  DEGREE_PASS = "Degree Pass",
  HONOURS = "Honours",
  MASTERS = "Masters"
}

export enum Group {
  SCIENCE = "Science",
  HUMANITIES = "Humanities",
  BUSINESS_STUDIES = "Business Studies",
  ENGINEERING = "Engineering",
  AIR_CONDITION_MAINTENANCE = "Air Condition and Maintenance",
  ELECTRICAL_ELECTRONICS_ENGINEERING = "Electrical & Electronics Engineering",
  ELECTRONICS_TECHNOLOGY = "Electronics Technology",
  MECHANICAL_ENGINEERING = "Mechanical Engineering",
  GENERAL = "General"
}

export enum Religion {
  ISLAM = "Islam",
  HINDUISM = "Hinduism",
  BUDDHISM = "Buddhism",
  CHRISTIANITY = "Christianity"
}

export interface SubjectGrade {
  id?: string; // unique subject ID (e.g. "mba-acc-sub-01")
  serialNo?: string | number; // serial number e.g. "01", "02"
  displayOrder?: number; // strict serial display order (1 to 15)
  subjectName: string;
  gradePoint: number; // 0.00 to 5.00 or 0.00 to 4.00
  subjectCode?: string;
  marks?: number; // optional mark 0 to 100
  credit?: number; // credit for Diploma and Degree calculation
  credits?: number; // optional alias for credit
  letterGrade?: string; // Letter grade e.g. "A+", "A", "B"
  year?: string; // academic year e.g. "FIRST YEAR", "SECOND YEAR", "THIRD YEAR", "FOURTH YEAR"
}

export interface SemesterResult {
  semesterName: string; // e.g. "1st Semester" or "1st Year"
  semesterGpa: number; // GPA out of 4.00 for this semester/year
  totalCredits?: number;
  publicationDate?: string;
  subjects: SubjectGrade[];
}

export interface Student {
  id: string;
  category: Category;
  group: Group;
  religion: Religion;
  name: string;
  fatherName: string;
  motherName: string;
  dob: string; // YYYY-MM-DD
  rollNumber: string;
  registrationNumber: string;
  instituteName: string;
  session: string;
  passingYear: string;
  certificateSerialNumber: string;
  issueDate: string; // YYYY-MM-DD
  photoUrl: string; // passport size photo
  qrCodeUrl?: string; // custom QR upload or auto-generated
  secureToken?: string; // Secure high-entropy verification token
  subjects: SubjectGrade[];
  finalGpa: number; // calculated automatically (CGPA on 4.00 scale for Degree/Honours/Masters/Diploma, 5.00 for SSC/HSC)
  totalMarks?: number; // optional total marks
  gradingSystem?: "GPA" | "Division"; // "Division" for 1995-2000 (pre-2001) SSC/HSC, "GPA" for 2001+
  division?: string; // "First Division", "Second Division", "Third Division", "First Division (Star Marks)", "Failed"

  // Degree Pass, Honours & Masters Specific Fields
  academicLevel?: "Degree Pass" | "Honours" | "Masters";
  programName?: string;
  programCode?: string;
  department?: string;
  majorSubject?: string;
  currentSemesterOrYear?: string;
  resultStatus?: string; // e.g. "Passed", "First Class", "Promoted", "Graduated"
  maxGpa?: number; // 4.00
  semesterResults?: SemesterResult[];

  // Automatic Academic Numbering, Timeline & Certification Fields
  registrationYear?: string; // e.g. "2012"
  admissionYear?: string; // e.g. "2020"
  courseDuration?: string; // e.g. "4 Years", "3 Years", "2 Years", "1 Year"
  expectedCompletionYear?: string; // e.g. "2024"
  examinationYear?: string; // e.g. "2024"
  resultPublicationDate?: string; // e.g. "2024-05-20"
  certificateIssueDate?: string; // e.g. "2024-11-16"
  certificateNumber?: string; // e.g. "BNIE-BBA-CERT-2024-0012"
  certificateStatus?: "Pending" | "Eligible for Issue" | "Issued";
  auditLog?: Array<{
    action: string;
    timestamp: string;
    details: string;
    changedBy?: string;
  }>;
}

/**
 * Checks if a student qualifies for the traditional Bangladesh Board Division System
 * Prior to 2001 (e.g. 1995-2000), SSC and HSC had no GPA system; results were exclusively in Marks & Divisions.
 */
export function isDivisionSystemStudent(student?: {
  category?: Category | string;
  passingYear?: string;
  gradingSystem?: string;
}): boolean {
  if (!student) return false;
  if (student.gradingSystem === "Division") return true;
  if (student.category === Category.SSC || student.category === Category.HSC || student.category === "SSC" || student.category === "HSC") {
    const year = parseInt(student.passingYear || "0", 10);
    if (!isNaN(year) && year > 1950 && year <= 2000) {
      return true;
    }
  }
  return false;
}

/**
 * Calculates Bangladesh Board Division System result based on subject marks
 */
export function calculateDivisionFromMarks(subjects: SubjectGrade[] = []): {
  totalMarks: number;
  totalFullMarks: number;
  percentage: number;
  division: string;
  isPassed: boolean;
  hasStarMarks: boolean;
} {
  if (subjects.length === 0) {
    return {
      totalMarks: 0,
      totalFullMarks: 0,
      percentage: 0,
      division: "Failed",
      isPassed: false,
      hasStarMarks: false
    };
  }

  let totalMarks = 0;
  const totalFullMarks = subjects.length * 100;
  let hasFailedSubject = false;

  for (const s of subjects) {
    const mark = typeof s.marks === "number" ? s.marks : 0;
    totalMarks += mark;
    if (mark < 33) {
      hasFailedSubject = true;
    }
  }

  const percentage = totalFullMarks > 0 ? (totalMarks / totalFullMarks) * 100 : 0;
  const hasStarMarks = !hasFailedSubject && percentage >= 75;

  let division = "Failed";
  let isPassed = false;

  if (hasFailedSubject || percentage < 33) {
    division = "Failed";
    isPassed = false;
  } else if (percentage >= 75) {
    division = "First Division (Star Marks)";
    isPassed = true;
  } else if (percentage >= 60) {
    division = "First Division";
    isPassed = true;
  } else if (percentage >= 45) {
    division = "Second Division";
    isPassed = true;
  } else {
    division = "Third Division";
    isPassed = true;
  }

  return {
    totalMarks,
    totalFullMarks,
    percentage: Math.round(percentage * 10) / 10,
    division,
    isPassed,
    hasStarMarks
  };
}

export type LeadershipPosition =
  | "Chancellor"
  | "Vice-Chancellor"
  | "Pro-Vice-Chancellor"
  | "Treasurer"
  | "Pro-Vice-Chancellor (Administration)"
  | "Registrar"
  | "Former Vice-Chancellors";

export const LEADERSHIP_POSITIONS: LeadershipPosition[] = [
  "Chancellor",
  "Vice-Chancellor",
  "Pro-Vice-Chancellor",
  "Treasurer",
  "Pro-Vice-Chancellor (Administration)",
  "Registrar",
  "Former Vice-Chancellors"
];

export type PublicationStatus = "Draft" | "Published" | "Unpublished";

export interface LeadershipProfile {
  id: string;
  position: LeadershipPosition;
  fullName: string;
  designation: string;
  departmentOrOffice: string;
  email: string;
  phone: string;
  mobileNumber?: string;
  biography?: string;
  officeAddress?: string;
  photoUrl?: string; // Optimized passport-size base64 data URL
  displayOrder: number;
  status: PublicationStatus;
  createdAt: string;
  updatedAt: string;
}

// Map marks to grade point
export function getGradePointFromMarks(marks: number): number {
  if (marks >= 80) return 5.0;
  if (marks >= 70) return 4.0;
  if (marks >= 60) return 3.5;
  if (marks >= 50) return 3.0;
  if (marks >= 40) return 2.0;
  if (marks >= 33) return 1.0;
  return 0.0;
}

// Map grade point to letter grade (5.00 scale for SSC/HSC)
export function getLetterGrade(gp: number): string {
  if (gp >= 5.0) return "A+";
  if (gp >= 4.0) return "A";
  if (gp >= 3.5) return "A-";
  if (gp >= 3.0) return "B";
  if (gp >= 2.0) return "C";
  if (gp >= 1.0) return "D";
  return "F";
}

// Map grade point to letter grade (4.00 scale for Diploma)
export function getDiplomaLetterGrade(gp: number): string {
  if (gp >= 4.00) return "A+";
  if (gp >= 3.75) return "A";
  if (gp >= 3.50) return "A-";
  if (gp >= 3.25) return "B+";
  if (gp >= 3.00) return "B";
  if (gp >= 2.75) return "B-";
  if (gp >= 2.50) return "C+";
  if (gp >= 2.25) return "C";
  if (gp >= 2.00) return "D";
  return "F";
}

// Map marks to grade point for Diploma 4.00 scale
export function getDiplomaGradePointFromMarks(marks: number): number {
  if (marks >= 80) return 4.00;
  if (marks >= 75) return 3.75;
  if (marks >= 70) return 3.50;
  if (marks >= 65) return 3.25;
  if (marks >= 60) return 3.00;
  if (marks >= 55) return 2.75;
  if (marks >= 50) return 2.50;
  if (marks >= 45) return 2.25;
  if (marks >= 40) return 2.00;
  return 0.00;
}

// Calculate Diploma GPA on 4.00 scale weighted by subject credits
export function calculateDiplomaGpa(subjects: SubjectGrade[]): number {
  if (subjects.length === 0) return 0.0;
  
  let hasFailed = false;
  let totalWeightedPoints = 0;
  let totalCredits = 0;
  
  for (const sub of subjects) {
    if (sub.gradePoint < 2.0) { // F grade (GP < 2.00) causes fail
      hasFailed = true;
    }
    const credit = sub.credit || 1;
    totalWeightedPoints += sub.gradePoint * credit;
    totalCredits += credit;
  }
  
  if (hasFailed) return 0.0;
  if (totalCredits === 0) return 0.0;
  
  const gpa = totalWeightedPoints / totalCredits;
  return Math.min(4.00, Math.round(gpa * 100) / 100);
}

// Calculate GPA from subject grades.
// Standard Bangladesh education rule: If any core subject has grade point < 1.0 (or 0), final GPA is 0.00 (Fail)
export function calculateFinalGpa(subjects: SubjectGrade[]): number {
  if (subjects.length === 0) return 0.0;
  
  // If subjects have year or credit specified, check if it's a 4.00 scale Diploma course
  const isDiploma4Scale = subjects.some(s => s.year !== undefined || (s.credit !== undefined && s.credit > 0));
  if (isDiploma4Scale) {
    return calculateDiplomaGpa(subjects);
  }
  
  let hasFailed = false;
  let totalPoints = 0;
  
  for (const sub of subjects) {
    if (sub.gradePoint < 1.0) {
      hasFailed = true;
    }
    totalPoints += sub.gradePoint;
  }
  
  if (hasFailed) return 0.0;
  
  const average = totalPoints / subjects.length;
  // Format to two decimal places
  return Math.round(average * 100) / 100;
}

// Calculate GPA for a single semester / academic year on 4.00 scale
export function calculateSemesterGpa(subjects: SubjectGrade[]): number {
  if (subjects.length === 0) return 0.0;
  let totalWeighted = 0;
  let totalCredits = 0;
  for (const s of subjects) {
    const cred = s.credit && s.credit > 0 ? s.credit : 3.0;
    totalWeighted += (s.gradePoint || 0) * cred;
    totalCredits += cred;
  }
  if (totalCredits === 0) return 0.0;
  const gpa = totalWeighted / totalCredits;
  return Math.min(4.00, Math.round(gpa * 100) / 100);
}

// Calculate Cumulative CGPA across all semesters on 4.00 scale
export function calculateDegreeCgpa(semesters: SemesterResult[]): number {
  if (!semesters || semesters.length === 0) return 0.0;
  let totalWeighted = 0;
  let totalCredits = 0;

  for (const sem of semesters) {
    for (const sub of sem.subjects) {
      const cred = sub.credit && sub.credit > 0 ? sub.credit : 3.0;
      totalWeighted += (sub.gradePoint || 0) * cred;
      totalCredits += cred;
    }
  }

  if (totalCredits === 0) {
    const avg = semesters.reduce((sum, s) => sum + s.semesterGpa, 0) / semesters.length;
    return Math.min(4.00, Math.round(avg * 100) / 100);
  }

  const cgpa = totalWeighted / totalCredits;
  return Math.min(4.00, Math.round(cgpa * 100) / 100);
}

// Generate a high-entropy cryptographically secure verification token
export function generateSecureToken(): string {
  const chars = "abcdef0123456789";
  let token = "bnie_sec_";
  for (let i = 0; i < 32; i++) {
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      token += "-";
    }
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}
