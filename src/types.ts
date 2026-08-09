export enum Category {
  SSC = "SSC",
  HSC = "HSC",
  DIPLOMA = "Diploma"
}

export enum Group {
  SCIENCE = "Science",
  HUMANITIES = "Humanities",
  BUSINESS_STUDIES = "Business Studies",
  ENGINEERING = "Engineering",
  COMPUTER_TECHNOLOGY = "Computer Technology",
  ELECTRICAL_ELECTRONICS_ENGINEERING = "Electrical & Electronics Engineering"
}

export enum Religion {
  ISLAM = "Islam",
  HINDUISM = "Hinduism",
  BUDDHISM = "Buddhism",
  CHRISTIANITY = "Christianity"
}

export interface SubjectGrade {
  subjectName: string;
  gradePoint: number; // 0.00 to 5.00 or 0.00 to 4.00
  subjectCode?: string;
  marks?: number; // optional mark 0 to 100
  credit?: number; // credit for Diploma calculation
  year?: string; // academic year e.g. "FIRST YEAR", "SECOND YEAR", "THIRD YEAR", "FOURTH YEAR"
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
  finalGpa: number; // calculated automatically
  totalMarks?: number; // optional total marks
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
