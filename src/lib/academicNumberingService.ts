import { Student } from "../types";

export interface AcademicTimeline {
  session: string;
  admissionYear: string;
  courseDuration: string;
  courseDurationYears: number;
  expectedCompletionYear: string;
  examinationYear: string;
  suggestedPublicationDate: string;
  suggestedCertificateIssueDate: string;
}

/**
 * Extract 4-digit start year from academic session (e.g. "2024–2025" -> "2024", "2020-2024" -> "2020")
 */
export function extractAdmissionYearFromSession(sessionStr: string): string {
  if (!sessionStr) return new Date().getFullYear().toString();
  const match = sessionStr.match(/\d{4}/);
  return match ? match[0] : new Date().getFullYear().toString();
}

/**
 * Extract 2-digit start year from academic session (e.g. "2024–2025" -> "24")
 */
export function extractAdmissionYear2Digit(sessionStr: string): string {
  const y4 = extractAdmissionYearFromSession(sessionStr);
  return y4.slice(-2);
}

/**
 * Standard Academic Level Code:
 * Degree Pass -> DG
 * Honours (including BBA, CSE, BA, BSS) -> HN
 * Masters (including MBA, MA, MSS, MSc) -> MS
 */
export function getAcademicLevelCode(academicLevel: string, programCode?: string): "DG" | "HN" | "MS" {
  if (academicLevel === "Degree Pass") return "DG";
  if (academicLevel === "Masters") return "MS";
  return "HN"; // Honours, BBA, etc.
}

/**
 * Base mixed starting numbers for authentic institutional records:
 * Degree Pass: 5837 (e.g. BNIE-DG-24-5837)
 * Honours: 7294 (e.g. BNIE-HN-24-7294)
 * Masters: 4168 (e.g. BNIE-MS-24-4168)
 */
export const BASE_ROLL_SEEDS: Record<"DG" | "HN" | "MS", number> = {
  DG: 5837,
  HN: 7294,
  MS: 4168
};

/**
 * Base mixed registration numbers:
 * Honours: 846291 (e.g. BNIE-REG-HN-2024-846291)
 * Degree Pass: 531842 (e.g. BNIE-REG-DG-2024-531842)
 * Masters: 416821 (e.g. BNIE-REG-MS-2024-416821)
 */
export const BASE_REG_SEEDS: Record<"DG" | "HN" | "MS", number> = {
  DG: 531842,
  HN: 846291,
  MS: 416821
};

/**
 * Determine program code prefix for roll numbers and certificates
 */
export function getProgramAbbreviation(academicLevel: string, programCode?: string): string {
  return getAcademicLevelCode(academicLevel, programCode);
}

/**
 * Default duration in years for degree qualification levels
 */
export function getDefaultDurationYears(academicLevel: string, programCode?: string): number {
  if (academicLevel === "Degree Pass") return 3;
  if (academicLevel === "Masters") {
    const code = (programCode || "").toUpperCase();
    if (code.includes("1Y") || code.includes("EMBA") || code === "MBA-ACC" || code.includes("1-YEAR")) return 1;
    return 2;
  }
  // Honours & BBA
  return 4;
}

/**
 * Calculate expected timeline based on admission session, duration and examination rules
 */
export function calculateAcademicTimeline(params: {
  academicLevel: string;
  programCode?: string;
  session: string;
  manualAdmissionYear?: string;
  manualDurationYears?: number;
}): AcademicTimeline {
  const admissionYear = params.manualAdmissionYear || extractAdmissionYearFromSession(params.session);
  const admissionYearNum = parseInt(admissionYear, 10) || new Date().getFullYear();
  const durationYears = params.manualDurationYears ?? getDefaultDurationYears(params.academicLevel, params.programCode);
  
  const expectedYearNum = admissionYearNum + durationYears;
  const expectedCompletionYear = expectedYearNum.toString();
  const examinationYear = expectedCompletionYear;

  // Suggested official result publication date: e.g. 20th of May following final exams
  const suggestedPublicationDate = `${examinationYear}-05-20`;

  // Suggested certificate date based on 180-day policy
  const suggestedCertificateIssueDate = calculateSuggestedCertificateIssueDate(suggestedPublicationDate, 180);

  return {
    session: params.session,
    admissionYear,
    courseDuration: `${durationYears} Year${durationYears > 1 ? "s" : ""}`,
    courseDurationYears: durationYears,
    expectedCompletionYear,
    examinationYear,
    suggestedPublicationDate,
    suggestedCertificateIssueDate
  };
}

/**
 * Policy-based calculation for certificate issue date (e.g. 180 days after official publication)
 */
export function calculateSuggestedCertificateIssueDate(publicationDate: string, delayDays: number = 180): string {
  try {
    if (!publicationDate) return "";
    const date = new Date(publicationDate);
    if (isNaN(date.getTime())) return "";
    date.setDate(date.getDate() + delayDays);
    return date.toISOString().split("T")[0];
  } catch {
    return "";
  }
}

/**
 * Generate sequential, unique Automatic Roll Number based on authentic institutional mixed ranges:
 * Degree Pass — Session 2024–2025: BNIE-DG-24-5837
 * Honours — Session 2024–2025: BNIE-HN-24-7294
 * Masters — Session 2024–2025: BNIE-MS-24-4168
 * 
 * Subsequent students in the same level and session year receive the next sequential number (e.g. 5838, 7295, 4169...)
 */
export function generateAutomaticRollNumber(params: {
  programCode?: string;
  academicLevel: string;
  session: string;
  admissionYear?: string;
  existingStudents: Student[];
}): string {
  const levelCode = getAcademicLevelCode(params.academicLevel, params.programCode);
  const year4 = params.admissionYear || extractAdmissionYearFromSession(params.session);
  const year2 = year4.slice(-2);
  const prefix = `BNIE-${levelCode}-${year2}-`;

  const baseSeed = BASE_ROLL_SEEDS[levelCode] || 5000;
  let maxSeq = baseSeed - 1;

  for (const s of params.existingStudents) {
    if (!s.rollNumber) continue;
    const r = s.rollNumber.trim().toUpperCase();
    if (r.startsWith(prefix)) {
      const part = r.substring(prefix.length);
      const num = parseInt(part, 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    } else if (r.includes(levelCode) && (r.includes(`-${year2}-`) || r.includes(`-${year4}-`))) {
      const parts = r.split("-");
      const last = parts[parts.length - 1];
      const num = parseInt(last, 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    }
  }

  const nextSeq = maxSeq + 1;
  let candidate = `${prefix}${nextSeq}`;

  while (params.existingStudents.some((s) => s.rollNumber && s.rollNumber.trim().toUpperCase() === candidate)) {
    maxSeq++;
    candidate = `${prefix}${maxSeq + 1}`;
  }

  return candidate;
}

/**
 * Generate sequential, unique Automatic Registration Number
 * Format: BNIE-REG-[LEVEL]-[YEAR]-[6_DIGIT_MIXED_SERIAL]
 * Example: BNIE-REG-HN-2024-846291
 * Subsequent students in the same level and session year receive the next sequential number (846292, 846293...)
 */
export function generateAutomaticRegistrationNumber(params: {
  academicLevel?: string;
  session: string;
  admissionYear?: string;
  existingStudents: Student[];
}): string {
  const levelCode = getAcademicLevelCode(params.academicLevel || "Honours");
  const year4 = params.admissionYear || extractAdmissionYearFromSession(params.session);
  const prefix = `BNIE-REG-${levelCode}-${year4}-`;

  const baseSeed = BASE_REG_SEEDS[levelCode] || 800000;
  let maxSeq = baseSeed - 1;

  for (const s of params.existingStudents) {
    if (!s.registrationNumber) continue;
    const reg = s.registrationNumber.trim().toUpperCase();
    if (reg.startsWith(prefix)) {
      const part = reg.substring(prefix.length);
      const num = parseInt(part, 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    } else if (reg.startsWith(`BNIE-REG-${levelCode}-`)) {
      const parts = reg.split("-");
      const last = parts[parts.length - 1];
      const num = parseInt(last, 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    }
  }

  const nextSeq = maxSeq + 1;
  let candidate = `${prefix}${nextSeq}`;

  while (params.existingStudents.some((s) => s.registrationNumber && s.registrationNumber.trim().toUpperCase() === candidate)) {
    maxSeq++;
    candidate = `${prefix}${maxSeq + 1}`;
  }

  return candidate;
}

/**
 * Generate official certificate number upon confirmation
 * Format: BNIE-CERT-[LEVEL]-[YEAR]-[SERIAL]
 * E.g. BNIE-CERT-HN-2024-7294
 */
export function generateOfficialCertificateNumber(params: {
  academicLevel: string;
  programCode?: string;
  passingYear: string;
  existingStudents: Student[];
}): string {
  const levelCode = getAcademicLevelCode(params.academicLevel, params.programCode);
  const year = params.passingYear || new Date().getFullYear().toString();
  const basePrefix = `BNIE-CERT-${levelCode}-${year}-`;

  const baseSeed = BASE_ROLL_SEEDS[levelCode] || 5000;
  let maxSeq = baseSeed - 1;
  for (const s of params.existingStudents) {
    const certNum = s.certificateNumber || s.certificateSerialNumber || "";
    if (certNum.toUpperCase().startsWith(basePrefix)) {
      const part = certNum.toUpperCase().substring(basePrefix.length);
      const num = parseInt(part, 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    }
  }

  const nextSeq = maxSeq + 1;
  return `${basePrefix}${nextSeq}`;
}
