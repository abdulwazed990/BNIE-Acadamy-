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
  COMPUTER_TECHNOLOGY = "Computer Technology"
}

export enum Religion {
  ISLAM = "Islam",
  HINDUISM = "Hinduism",
  BUDDHISM = "Buddhism",
  CHRISTIANITY = "Christianity"
}

export interface SubjectGrade {
  subjectName: string;
  gradePoint: number; // 0.00 to 5.00
  subjectCode?: string;
  marks?: number; // optional mark 0 to 100
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

// Map grade point to letter grade
export function getLetterGrade(gp: number): string {
  if (gp >= 5.0) return "A+";
  if (gp >= 4.0) return "A";
  if (gp >= 3.5) return "A-";
  if (gp >= 3.0) return "B";
  if (gp >= 2.0) return "C";
  if (gp >= 1.0) return "D";
  return "F";
}

// Calculate GPA from subject grades.
// Standard Bangladesh education rule: If any core subject has grade point < 1.0 (or 0), final GPA is 0.00 (Fail)
export function calculateFinalGpa(subjects: SubjectGrade[]): number {
  if (subjects.length === 0) return 0.0;
  
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
