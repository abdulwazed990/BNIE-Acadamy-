import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc, 
  updateDoc, 
  deleteDoc,
  writeBatch,
  query,
  where
} from "firebase/firestore";
import { Student, SemesterResult, Category } from "../types";
import { DEFAULT_STUDENTS } from "../data/defaultStudents";
import { getBbaAccountingCurriculum, getMbaAccountingCurriculum, generateDefaultSemesterResults } from "../data/degreeProgramsCatalog";

const firebaseConfig = {
  apiKey: "AIzaSyChRPYx_95hDfi7ZRDSnrVFcmZQnYdWDaM",
  authDomain: "project-4c11654d-d39f-461c-a0d.firebaseapp.com",
  projectId: "project-4c11654d-d39f-461c-a0d",
  storageBucket: "project-4c11654d-d39f-461c-a0d.firebasestorage.app",
  messagingSenderId: "172795881055",
  appId: "1:172795881055:web:4e774308b320d625dc9dea",
  firestoreDatabaseId: "ai-studio-bangladeshnation-80eea23f-d145-443f-9c97-94c2c303cf1e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const STUDENTS_COLLECTION = "students";

/**
 * Recursively remove all `undefined` values from an object or nested arrays/objects.
 * Firestore strictly rejects documents containing undefined fields.
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as unknown as T;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  if (typeof data === "object" && !(data instanceof Date)) {
    const cleanObj: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(data as Record<string, unknown>)) {
      if (val !== undefined) {
        cleanObj[key] = sanitizeForFirestore(val);
      }
    }
    return cleanObj as T;
  }
  return data;
}

/**
 * Seed the database with default students if it is empty.
 */
export async function seedDatabaseIfEmpty(): Promise<Student[]> {
  try {
    // Add a stable 15s connection timeout so we don't keep the user waiting forever, but give enough time for mobile connections
    const getDocsPromise = getDocs(collection(db, STUDENTS_COLLECTION));
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error("Firestore backend connection timed out")), 15000)
    );
    
    const querySnapshot = await Promise.race([getDocsPromise, timeoutPromise]);
    if (querySnapshot.empty) {
      console.log("Firestore collection is empty. Seeding with default student records...");
      const batch = writeBatch(db);
      for (const student of DEFAULT_STUDENTS) {
        const docRef = doc(db, STUDENTS_COLLECTION, student.id);
        batch.set(docRef, sanitizeForFirestore(student));
      }
      await batch.commit();
      console.log("Database seeded successfully.");
      return DEFAULT_STUDENTS;
    } else {
      const students: Student[] = [];
      querySnapshot.forEach((doc) => {
        students.push(doc.data() as Student);
      });
      return students;
    }
  } catch (error) {
    console.error("Error seeding or fetching database:", error);
    // Return default students as fallback to keep app functional if network fails
    return DEFAULT_STUDENTS;
  }
}

/**
 * Fetch all students from Firestore
 */
export async function fetchAllStudents(): Promise<Student[]> {
  try {
    const getDocsPromise = getDocs(collection(db, STUDENTS_COLLECTION));
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error("Firestore backend connection timed out")), 15000)
    );
    
    const querySnapshot = await Promise.race([getDocsPromise, timeoutPromise]);
    const students: Student[] = [];
    querySnapshot.forEach((doc) => {
      students.push(doc.data() as Student);
    });
    return students;
  } catch (error) {
    console.error("Error fetching students from Firestore:", error);
    throw error;
  }
}

/**
 * Add a new student record to Firestore permanently
 */
export async function addStudentToDb(student: Student): Promise<void> {
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, student.id);
    const sanitizedStudent = sanitizeForFirestore(student);
    await setDoc(docRef, sanitizedStudent);
    console.log(`Saved student ${student.name} (Roll: ${student.rollNumber}, Reg: ${student.registrationNumber}) permanently to Firestore.`);
  } catch (error) {
    console.error("Error adding student to Firestore:", error);
    throw error;
  }
}

/**
 * Update an existing student record in Firestore
 */
export async function updateStudentInDb(student: Student): Promise<void> {
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, student.id);
    const sanitizedStudent = sanitizeForFirestore(student);
    await setDoc(docRef, sanitizedStudent);
    console.log(`Updated student ${student.name} in Firestore.`);
  } catch (error) {
    console.error("Error updating student in Firestore:", error);
    throw error;
  }
}

/**
 * Delete a student record from Firestore
 */
export async function deleteStudentFromDb(id: string): Promise<void> {
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, id);
    await deleteDoc(docRef);
    console.log(`Deleted student with ID ${id} from Firestore.`);
  } catch (error) {
    console.error("Error deleting student from Firestore:", error);
    throw error;
  }
}

/**
 * Authoritative live query against Firestore to locate student records across windows/devices
 * Searches by Roll Number and Registration Number, handling whitespace and leading zeros.
 */
export async function findStudentInDatabase(
  rollNumber: string,
  registrationNumber: string,
  category?: Category
): Promise<Student | null> {
  try {
    const cleanRoll = rollNumber.trim();
    const cleanReg = registrationNumber.trim();

    if (!cleanRoll || !cleanReg) return null;

    // 1. Direct query by exact rollNumber
    const rollQuery = query(
      collection(db, STUDENTS_COLLECTION),
      where("rollNumber", "==", cleanRoll)
    );
    const snap = await getDocs(rollQuery);

    let candidates: Student[] = [];
    snap.forEach((d) => {
      candidates.push(d.data() as Student);
    });

    // Match registrationNumber (case-insensitive & trimmed)
    let matched = candidates.find((s) => {
      const sReg = (s.registrationNumber || "").trim().toLowerCase();
      const targetReg = cleanReg.toLowerCase();
      if (sReg !== targetReg) return false;
      if (category && s.category === category) return true;
      return true;
    });

    if (matched) return matched;

    // 2. Query by registrationNumber if roll had alternate formatting
    const regQuery = query(
      collection(db, STUDENTS_COLLECTION),
      where("registrationNumber", "==", cleanReg)
    );
    const regSnap = await getDocs(regQuery);
    regSnap.forEach((d) => {
      const s = d.data() as Student;
      const sRoll = (s.rollNumber || "").trim().toLowerCase();
      const sReg = (s.registrationNumber || "").trim().toLowerCase();
      if (sRoll === cleanRoll.toLowerCase() && sReg === cleanReg.toLowerCase()) {
        matched = s;
      }
    });

    return matched || null;
  } catch (error) {
    console.warn("Live database search failed, falling back to local memory:", error);
    return null;
  }
}

const CURRICULUMS_COLLECTION = "curriculums";

export interface ProgramCurriculumRecord {
  id: string; // "bba-accounting"
  programCode: string; // "BBA-ACC"
  programName: string; // "Bachelor of Business Administration (BBA)"
  major: string; // "Accounting"
  duration: string; // "4 Years"
  totalSemesters: number; // 8
  totalCredits: number; // 126
  courseCredits: number; // 120
  oralExamCredits: number; // 3
  internshipCredits: number; // 3
  semesters: SemesterResult[];
  updatedAt: string;
}

/**
 * Generate standard BBA in Accounting curriculum record
 */
export function getDefaultBbaCurriculumRecord(): ProgramCurriculumRecord {
  const bbaProg = getBbaAccountingCurriculum();
  const defaultSemesters = generateDefaultSemesterResults(bbaProg);
  return {
    id: "bba-accounting",
    programCode: "BBA-ACC",
    programName: "Bachelor of Business Administration (BBA)",
    major: "Accounting",
    duration: "4 Years",
    totalSemesters: 8,
    totalCredits: 126,
    courseCredits: 120,
    oralExamCredits: 3,
    internshipCredits: 3,
    semesters: defaultSemesters,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Generate standard MBA in Accounting curriculum record (48 Credits, 2 Semesters, 15 Subjects)
 */
export function getDefaultMbaCurriculumRecord(): ProgramCurriculumRecord {
  const mbaProg = getMbaAccountingCurriculum();
  const defaultSemesters = generateDefaultSemesterResults(mbaProg);
  return {
    id: "mba-accounting",
    programCode: "MBA-ACC",
    programName: "Master of Business Administration (MBA)",
    major: "Accounting",
    duration: "1 Year",
    totalSemesters: 2,
    totalCredits: 48,
    courseCredits: 42,
    oralExamCredits: 0,
    internshipCredits: 6,
    semesters: defaultSemesters,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Persistently save program curriculum template in Firestore database
 */
export async function saveCurriculumToDb(curriculum: ProgramCurriculumRecord): Promise<void> {
  try {
    const docRef = doc(db, CURRICULUMS_COLLECTION, curriculum.id);
    await setDoc(docRef, curriculum);
    console.log(`Saved curriculum ${curriculum.programName} (${curriculum.major}) to Firestore.`);
  } catch (error) {
    console.error("Error saving curriculum to Firestore:", error);
    // Also save in localStorage as safe fallback
    try {
      localStorage.setItem(`bnie_curriculum_${curriculum.id}`, JSON.stringify(curriculum));
    } catch (e) {
      console.warn("Local storage fallback failed:", e);
    }
  }
}

/**
 * Fetch program curriculum from Firestore or local fallback
 */
export async function fetchCurriculumFromDb(id: string): Promise<ProgramCurriculumRecord> {
  try {
    const docRef = doc(db, CURRICULUMS_COLLECTION, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as ProgramCurriculumRecord;
    }
  } catch (error) {
    console.warn(`Firestore curriculum read for ${id} failed, checking local backup:`, error);
  }

  // Check localStorage backup
  try {
    const local = localStorage.getItem(`bnie_curriculum_${id}`);
    if (local) {
      return JSON.parse(local) as ProgramCurriculumRecord;
    }
  } catch (e) {
    console.warn("Failed to read local curriculum backup:", e);
  }

  // Fallback to default curriculum record based on id
  const defaultRecord = id === "mba-accounting" ? getDefaultMbaCurriculumRecord() : getDefaultBbaCurriculumRecord();
  // Automatically seed to DB in background
  saveCurriculumToDb(defaultRecord).catch(() => {});
  return defaultRecord;
}
