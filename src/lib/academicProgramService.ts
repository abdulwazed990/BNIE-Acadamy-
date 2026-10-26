import { AcademicProgramConfig, SubjectGrade } from "../types";
import { getHistorical3YearHonoursHistoryPreset, getDegreePassPreset, PROPOSED_BA_HISTORY_30_CATALOGUE } from "../data/baHistoryCatalogue";
import { db, sanitizeForFirestore } from "./firebase";
import { collection, doc, getDocs, setDoc, deleteDoc, updateDoc } from "firebase/firestore";

const STORAGE_KEY = "bnie_academic_program_configs_v1";
const COLLECTION_NAME = "curriculums"; // Using existing permitted collection in firestore.rules

/**
 * Default Seed Academic Programs for Bangladesh Higher Education
 */
export const DEFAULT_ACADEMIC_PROGRAMS: AcademicProgramConfig[] = [
  // 1. Historical 1994 B.A. Honours in History (3-Year Annual)
  {
    id: "prog-ba-hon-hist-1994",
    institutionName: "University of Dhaka / Bangladesh National Institute of Education (BNIE)",
    affiliatedCollege: "Affiliated Constituent College",
    degreeType: "Bachelor of Arts (B.A.) Honours",
    examinationTitle: "BACHELOR OF ARTS (B.A.) HONOURS EXAMINATION",
    majorSubject: "History",
    academicSession: "1990-1991",
    examinationYear: "1994",
    durationYears: 3,
    examinationStructure: "Annual (3-Year)",
    syllabusVersion: "1990-1994 Historical Regulation (Proposed 30-Catalogue Staging)",
    isSyllabusVerified: false, // Pending official original syllabus verification
    gradingMethod: "Division/Class",
    divisionThresholds: {
      firstClassOrDivisionMinPercent: 60.0,
      secondClassOrDivisionMinPercent: 45.0,
      thirdDivisionMinPercent: 36.0,
      minimumPassMarksPerPaper: 36,
      vivaMinPassMarks: 40,
      starMarksMinPercent: 75.0
    },
    subjects: getHistorical3YearHonoursHistoryPreset(),
    resultPublicationDate: "1994-11-28",
    status: "Published",
    createdAt: "1994-01-10T00:00:00.000Z",
    updatedAt: "2026-10-26T00:00:00.000Z"
  },

  // 2. Historical 2000 B.A. Honours in History (3-Year Annual)
  {
    id: "prog-ba-hon-hist-2000",
    institutionName: "University of Dhaka / Bangladesh National Institute of Education (BNIE)",
    affiliatedCollege: "Dhaka Central College",
    degreeType: "Bachelor of Arts (B.A.) Honours",
    examinationTitle: "BACHELOR OF ARTS (B.A.) HONOURS EXAMINATION",
    majorSubject: "History",
    academicSession: "1996-1997",
    examinationYear: "2000",
    durationYears: 3,
    examinationStructure: "Annual (3-Year)",
    syllabusVersion: "1996-2000 Regulation (Pending Verification)",
    isSyllabusVerified: false,
    gradingMethod: "Division/Class",
    divisionThresholds: {
      firstClassOrDivisionMinPercent: 60.0,
      secondClassOrDivisionMinPercent: 45.0,
      thirdDivisionMinPercent: 36.0,
      minimumPassMarksPerPaper: 36,
      vivaMinPassMarks: 40,
      starMarksMinPercent: 75.0
    },
    subjects: getHistorical3YearHonoursHistoryPreset(),
    resultPublicationDate: "2000-12-14",
    status: "Published",
    createdAt: "2000-01-15T00:00:00.000Z",
    updatedAt: "2026-10-26T00:00:00.000Z"
  },

  // 3. Separate B.A. Degree Pass Examination (3-Year Annual)
  {
    id: "prog-ba-degree-pass",
    institutionName: "National University / Bangladesh National Institute of Education (BNIE)",
    affiliatedCollege: "General Degree College",
    degreeType: "Bachelor of Arts (B.A.) Degree Pass",
    examinationTitle: "BACHELOR OF ARTS (B.A.) DEGREE PASS EXAMINATION",
    majorSubject: "Arts & Humanities (Principal & Subsidiary Structure)",
    academicSession: "1995-1998",
    examinationYear: "1998",
    durationYears: 3,
    examinationStructure: "Annual (3-Year)",
    syllabusVersion: "Degree Pass 3-Year Regulation",
    isSyllabusVerified: true,
    gradingMethod: "Division/Class",
    divisionThresholds: {
      firstClassOrDivisionMinPercent: 60.0,
      secondClassOrDivisionMinPercent: 45.0,
      thirdDivisionMinPercent: 33.0,
      minimumPassMarksPerPaper: 33,
      vivaMinPassMarks: 33,
      starMarksMinPercent: 75.0
    },
    subjects: getDegreePassPreset(),
    resultPublicationDate: "1998-10-22",
    status: "Published",
    createdAt: "1998-02-01T00:00:00.000Z",
    updatedAt: "2026-10-26T00:00:00.000Z"
  },

  // 4. Modern 4-Year B.A. Honours in History (CGPA 4.00 Scale)
  {
    id: "prog-ba-hon-modern",
    institutionName: "Bangladesh National Institute of Education (BNIE)",
    degreeType: "Bachelor of Arts (B.A.) Honours",
    examinationTitle: "BACHELOR OF ARTS (B.A.) HONOURS EXAMINATION",
    majorSubject: "History",
    academicSession: "2020-2024",
    examinationYear: "2024",
    durationYears: 4,
    examinationStructure: "Semester-based (4-Year / 8 Semesters)",
    syllabusVersion: "2020 Outcome-Based Curriculum (OBE)",
    isSyllabusVerified: true,
    gradingMethod: "GPA/CGPA",
    divisionThresholds: {
      firstClassOrDivisionMinPercent: 60.0,
      secondClassOrDivisionMinPercent: 45.0,
      minimumPassMarksPerPaper: 40,
      vivaMinPassMarks: 40,
      starMarksMinPercent: 80.0
    },
    subjects: [
      {
        id: "mod-his-01",
        serialNo: "01",
        displayOrder: 1,
        subjectCode: "HIS-1101",
        subjectName: "Introduction to History and Historical Method",
        year: "1st Semester",
        marks: 84,
        fullMarks: 100,
        passMarks: 40,
        credit: 3,
        gradePoint: 4.0,
        letterGrade: "A+",
        isCompulsory: true
      },
      {
        id: "mod-his-02",
        serialNo: "02",
        displayOrder: 2,
        subjectCode: "HIS-1102",
        subjectName: "Ancient History of the Indian Subcontinent",
        year: "1st Semester",
        marks: 82,
        fullMarks: 100,
        passMarks: 40,
        credit: 3,
        gradePoint: 4.0,
        letterGrade: "A+",
        isCompulsory: true
      },
      {
        id: "mod-his-03",
        serialNo: "03",
        displayOrder: 3,
        subjectCode: "HIS-1201",
        subjectName: "History of Bengal in Ancient Times",
        year: "2nd Semester",
        marks: 78,
        fullMarks: 100,
        passMarks: 40,
        credit: 3,
        gradePoint: 3.75,
        letterGrade: "A",
        isCompulsory: true
      },
      {
        id: "mod-his-04",
        serialNo: "04",
        displayOrder: 4,
        subjectCode: "HIS-2101",
        subjectName: "History of the Emergence of Bangladesh",
        year: "3rd Semester",
        marks: 86,
        fullMarks: 100,
        passMarks: 40,
        credit: 3,
        gradePoint: 4.0,
        letterGrade: "A+",
        isCompulsory: true
      }
    ],
    resultPublicationDate: "2024-05-20",
    status: "Published",
    createdAt: "2024-01-10T00:00:00.000Z",
    updatedAt: "2026-10-26T00:00:00.000Z"
  }
];

/**
 * Synchronous local read
 */
export function getLocalAcademicPrograms(): AcademicProgramConfig[] {
  if (typeof window === "undefined") return DEFAULT_ACADEMIC_PROGRAMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ACADEMIC_PROGRAMS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_ACADEMIC_PROGRAMS;
  } catch (e) {
    console.warn("Failed to load local academic programs", e);
    return DEFAULT_ACADEMIC_PROGRAMS;
  }
}

/**
 * Save to local storage
 */
export function saveLocalAcademicPrograms(programs: AcademicProgramConfig[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
  } catch (e) {
    console.warn("Failed to save local academic programs", e);
  }
}

/**
 * Fetch all academic programs from Firestore with fallback
 */
export async function fetchAllAcademicPrograms(): Promise<AcademicProgramConfig[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTION_NAME));
    if (snap.empty) {
      // Seed if empty
      console.log("No academic programs in Firestore. Seeding default configurations...");
      for (const prog of DEFAULT_ACADEMIC_PROGRAMS) {
        await setDoc(doc(db, COLLECTION_NAME, prog.id), sanitizeForFirestore(prog));
      }
      saveLocalAcademicPrograms(DEFAULT_ACADEMIC_PROGRAMS);
      return DEFAULT_ACADEMIC_PROGRAMS;
    }

    const list: AcademicProgramConfig[] = [];
    snap.forEach((d) => {
      list.push(d.data() as AcademicProgramConfig);
    });

    // Merge or fallback
    if (list.length === 0) {
      return getLocalAcademicPrograms();
    }
    saveLocalAcademicPrograms(list);
    return list;
  } catch (e) {
    console.warn("Error fetching academic programs from Firestore, using local cache:", e);
    return getLocalAcademicPrograms();
  }
}

/**
 * Save / Update an academic program configuration to Firestore and localStorage
 */
export async function saveAcademicProgram(program: AcademicProgramConfig): Promise<void> {
  const sanitized = sanitizeForFirestore({
    ...program,
    updatedAt: new Date().toISOString()
  });

  // Local sync
  const current = getLocalAcademicPrograms();
  const idx = current.findIndex((p) => p.id === program.id);
  let updatedList: AcademicProgramConfig[];
  if (idx >= 0) {
    updatedList = [...current];
    updatedList[idx] = sanitized;
  } else {
    updatedList = [sanitized, ...current];
  }
  saveLocalAcademicPrograms(updatedList);

  // Firestore sync
  try {
    await setDoc(doc(db, COLLECTION_NAME, program.id), sanitized);
    console.log(`Saved academic program ${program.id} to Firestore.`);
  } catch (e) {
    console.warn("Failed to write academic program to Firestore:", e);
  }
}

/**
 * Delete an academic program configuration
 */
export async function deleteAcademicProgram(programId: string): Promise<void> {
  const current = getLocalAcademicPrograms();
  const updatedList = current.filter((p) => p.id !== programId);
  saveLocalAcademicPrograms(updatedList);

  try {
    await deleteDoc(doc(db, COLLECTION_NAME, programId));
    console.log(`Deleted academic program ${programId} from Firestore.`);
  } catch (e) {
    console.warn("Failed to delete academic program from Firestore:", e);
  }
}
