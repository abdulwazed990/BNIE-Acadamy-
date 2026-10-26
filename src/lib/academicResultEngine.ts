import { SubjectGrade } from "../types";

export interface AcademicCalculationRule {
  gradingMethod: "Division/Class" | "GPA/CGPA" | "Marks Only";
  isHonoursDegree: boolean; // Honours uses "First Class", Degree Pass uses "First Division"
  firstDivisionOrClassMinPercent: number; // default 60%
  secondDivisionOrClassMinPercent: number; // default 45%
  thirdDivisionMinPercent?: number; // default 33% (Honours typically does not have Third Class; Pass Degree or Failed)
  minimumPassMarksPerPaper?: number; // default 36 for honours major, 33 for pass
  vivaMinPassMarks?: number; // default 40
  starMarksMinPercent?: number; // default 75%
  scaleMaxGpa?: number; // 4.00 for modern degree
}

export interface ValidationIssue {
  type: "error" | "warning";
  code: "DUPLICATE_SUBJECT" | "MARK_EXCEEDS_FULL" | "MISSING_MARK" | "BELOW_PASS_MARK" | "INVALID_FULL_MARK";
  message: string;
  subjectIndex?: number;
  subjectCode?: string;
  subjectName?: string;
}

export interface CalculationAuditEntry {
  step: string;
  formula: string;
  result: string;
  timestamp: string;
}

export interface AcademicResultCalculation {
  totalFullMarks: number;
  totalObtainedMarks: number;
  percentage: number;
  divisionOrClass: string; // e.g. "First Class", "Second Class", "First Division", "Second Division", "Third Division", "Failed", "Pending Verification"
  isPassed: boolean;
  hasStarMarks: boolean;
  gpaOrCgpa?: number;
  resultStatus: string;
  validationIssues: ValidationIssue[];
  hasErrors: boolean;
  hasMissingMarks: boolean;
  auditTrail: CalculationAuditEntry[];
}

export const DEFAULT_HONOURS_HISTORICAL_RULES: AcademicCalculationRule = {
  gradingMethod: "Division/Class",
  isHonoursDegree: true,
  firstDivisionOrClassMinPercent: 60.0,
  secondDivisionOrClassMinPercent: 45.0,
  thirdDivisionMinPercent: 36.0,
  minimumPassMarksPerPaper: 36,
  vivaMinPassMarks: 40,
  starMarksMinPercent: 75.0,
  scaleMaxGpa: 4.00
};

export const DEFAULT_DEGREE_PASS_HISTORICAL_RULES: AcademicCalculationRule = {
  gradingMethod: "Division/Class",
  isHonoursDegree: false,
  firstDivisionOrClassMinPercent: 60.0,
  secondDivisionOrClassMinPercent: 45.0,
  thirdDivisionMinPercent: 33.0,
  minimumPassMarksPerPaper: 33,
  vivaMinPassMarks: 33,
  starMarksMinPercent: 75.0,
  scaleMaxGpa: 4.00
};

/**
 * Validates subject list for duplicates, missing marks, and exceeding full marks
 */
export function validateAcademicSubjects(subjects: SubjectGrade[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seenCodes = new Set<string>();
  const seenNames = new Set<string>();

  subjects.forEach((sub, idx) => {
    // 1. Detect Duplicate Subjects
    const normalizedCode = sub.subjectCode ? sub.subjectCode.trim().toUpperCase() : "";
    const normalizedName = sub.subjectName ? sub.subjectName.trim().toLowerCase() : "";

    if (normalizedCode && seenCodes.has(normalizedCode)) {
      issues.push({
        type: "error",
        code: "DUPLICATE_SUBJECT",
        message: `Duplicate paper code "${sub.subjectCode}" detected at row ${idx + 1}.`,
        subjectIndex: idx,
        subjectCode: sub.subjectCode,
        subjectName: sub.subjectName
      });
    } else if (normalizedCode) {
      seenCodes.add(normalizedCode);
    }

    if (normalizedName && seenNames.has(normalizedName)) {
      issues.push({
        type: "warning",
        code: "DUPLICATE_SUBJECT",
        message: `Duplicate subject title "${sub.subjectName}" detected at row ${idx + 1}.`,
        subjectIndex: idx,
        subjectCode: sub.subjectCode,
        subjectName: sub.subjectName
      });
    } else if (normalizedName) {
      seenNames.add(normalizedName);
    }

    // 2. Reject Marks Exceeding Full Marks
    const fullMark = typeof sub.fullMarks === "number" && sub.fullMarks > 0 ? sub.fullMarks : 100;
    if (sub.marks !== undefined && sub.marks !== null) {
      if (sub.marks > fullMark) {
        issues.push({
          type: "error",
          code: "MARK_EXCEEDS_FULL",
          message: `Obtained mark (${sub.marks}) exceeds full marks (${fullMark}) in "${sub.subjectName}".`,
          subjectIndex: idx,
          subjectCode: sub.subjectCode,
          subjectName: sub.subjectName
        });
      }
      if (sub.marks < 0) {
        issues.push({
          type: "error",
          code: "MARK_EXCEEDS_FULL",
          message: `Obtained mark cannot be negative (${sub.marks}) in "${sub.subjectName}".`,
          subjectIndex: idx,
          subjectCode: sub.subjectCode,
          subjectName: sub.subjectName
        });
      }
    } else {
      // 3. Flag Missing or Incomplete Marks
      issues.push({
        type: "warning",
        code: "MISSING_MARK",
        message: `Missing obtained mark for "${sub.subjectName}".`,
        subjectIndex: idx,
        subjectCode: sub.subjectCode,
        subjectName: sub.subjectName
      });
    }
  });

  return issues;
}

/**
 * Authoritative Academic Result Calculation Engine
 * Strictly adheres to historical rules:
 * - Does not silently treat missing marks as 0
 * - Does not force GPA onto historical records
 * - Auditable step-by-step logs
 */
export function calculateAcademicResult(
  subjects: SubjectGrade[],
  rule: AcademicCalculationRule = DEFAULT_HONOURS_HISTORICAL_RULES,
  options?: {
    isVerified?: boolean;
    academicLevel?: "Honours" | "Degree Pass" | "Masters";
  }
): AcademicResultCalculation {
  const auditTrail: CalculationAuditEntry[] = [];
  const now = new Date().toISOString();

  // Validate subjects first
  const validationIssues = validateAcademicSubjects(subjects);
  const hasErrors = validationIssues.some((i) => i.type === "error");
  const hasMissingMarks = validationIssues.some((i) => i.code === "MISSING_MARK");

  if (subjects.length === 0) {
    return {
      totalFullMarks: 0,
      totalObtainedMarks: 0,
      percentage: 0,
      divisionOrClass: "Pending Verification",
      isPassed: false,
      hasStarMarks: false,
      resultStatus: "No Recorded Papers",
      validationIssues,
      hasErrors,
      hasMissingMarks,
      auditTrail: [
        {
          step: "Initialization",
          formula: "Count(subjects) == 0",
          result: "No subjects available for calculation",
          timestamp: now
        }
      ]
    };
  }

  let totalFullMarks = 0;
  let totalObtainedMarks = 0;
  let hasFailedSubject = false;
  let validMarksCount = 0;

  subjects.forEach((sub, idx) => {
    const full = typeof sub.fullMarks === "number" && sub.fullMarks > 0 ? sub.fullMarks : 100;
    totalFullMarks += full;

    if (typeof sub.marks === "number" && !isNaN(sub.marks)) {
      totalObtainedMarks += sub.marks;
      validMarksCount++;

      // Check pass requirement per paper
      const passReq = typeof sub.passMarks === "number" ? sub.passMarks : (rule.minimumPassMarksPerPaper || 36);
      if (sub.marks < passReq) {
        hasFailedSubject = true;
        validationIssues.push({
          type: "warning",
          code: "BELOW_PASS_MARK",
          message: `Paper "${sub.subjectName}" mark (${sub.marks}) is below pass requirement (${passReq}).`,
          subjectIndex: idx,
          subjectCode: sub.subjectCode,
          subjectName: sub.subjectName
        });
      }
    }
  });

  auditTrail.push({
    step: "Mark Aggregation",
    formula: `Sum of ${validMarksCount}/${subjects.length} papers fullMarks = ${totalFullMarks}, obtained = ${totalObtainedMarks}`,
    result: `Total Marks: ${totalObtainedMarks} / ${totalFullMarks}`,
    timestamp: now
  });

  // Calculate percentage only when fullMarks > 0 and no critical errors
  let percentage = 0;
  if (totalFullMarks > 0 && !hasErrors) {
    percentage = Math.round((totalObtainedMarks / totalFullMarks) * 1000) / 10;
  }

  auditTrail.push({
    step: "Percentage Computation",
    formula: `(${totalObtainedMarks} / ${totalFullMarks}) * 100`,
    result: `${percentage.toFixed(1)}%`,
    timestamp: now
  });

  let divisionOrClass = "Pending Verification";
  let isPassed = false;
  const hasStarMarks = !hasFailedSubject && percentage >= (rule.starMarksMinPercent || 75.0);

  if (hasMissingMarks) {
    divisionOrClass = "Pending Verification (Incomplete Marks)";
    isPassed = false;
  } else if (hasErrors) {
    divisionOrClass = "Calculation Error (Check Inputs)";
    isPassed = false;
  } else if (hasFailedSubject) {
    divisionOrClass = "Failed";
    isPassed = false;
  } else if (rule.isHonoursDegree || options?.academicLevel === "Honours") {
    // HONOURS CLASSIFICATION: First Class, Second Class, Third Class / Pass
    if (percentage >= rule.firstDivisionOrClassMinPercent) {
      divisionOrClass = "First Class";
      isPassed = true;
    } else if (percentage >= rule.secondDivisionOrClassMinPercent) {
      divisionOrClass = "Second Class";
      isPassed = true;
    } else if (rule.thirdDivisionMinPercent && percentage >= rule.thirdDivisionMinPercent) {
      divisionOrClass = "Third Class";
      isPassed = true;
    } else {
      divisionOrClass = "Failed";
      isPassed = false;
    }
  } else {
    // DEGREE PASS CLASSIFICATION: First Division, Second Division, Third Division
    if (percentage >= (rule.starMarksMinPercent || 75.0)) {
      divisionOrClass = "First Division (Star Marks)";
      isPassed = true;
    } else if (percentage >= rule.firstDivisionOrClassMinPercent) {
      divisionOrClass = "First Division";
      isPassed = true;
    } else if (percentage >= rule.secondDivisionOrClassMinPercent) {
      divisionOrClass = "Second Division";
      isPassed = true;
    } else if (percentage >= (rule.thirdDivisionMinPercent || 33.0)) {
      divisionOrClass = "Third Division";
      isPassed = true;
    } else {
      divisionOrClass = "Failed";
      isPassed = false;
    }
  }

  auditTrail.push({
    step: "Classification",
    formula: `Classified based on ${rule.isHonoursDegree ? "Honours Class regulations" : "Degree Pass Division regulations"} (Percentage: ${percentage.toFixed(1)}%)`,
    result: divisionOrClass,
    timestamp: now
  });

  // Result Status String
  let resultStatus = divisionOrClass;
  if (isPassed && rule.isHonoursDegree) {
    resultStatus = `${divisionOrClass} with Honours`;
  } else if (isPassed && !rule.isHonoursDegree) {
    resultStatus = `Passed in ${divisionOrClass}`;
  }

  // GPA / CGPA Calculation only when explicitly configured for GPA/CGPA
  let gpaOrCgpa: number | undefined = undefined;
  if (rule.gradingMethod === "GPA/CGPA") {
    // Standard 4.00 degree CGPA calculation
    let totalCredits = 0;
    let weightedPoints = 0;
    subjects.forEach((s) => {
      const cr = s.credit || s.credits || 3;
      const gp = typeof s.gradePoint === "number" ? s.gradePoint : 0;
      totalCredits += cr;
      weightedPoints += cr * gp;
    });
    if (totalCredits > 0) {
      gpaOrCgpa = Math.round((weightedPoints / totalCredits) * 100) / 100;
    }
  }

  return {
    totalFullMarks,
    totalObtainedMarks,
    percentage,
    divisionOrClass,
    isPassed,
    hasStarMarks,
    gpaOrCgpa,
    resultStatus,
    validationIssues,
    hasErrors,
    hasMissingMarks,
    auditTrail
  };
}
