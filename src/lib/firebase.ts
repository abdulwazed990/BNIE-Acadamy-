import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  writeBatch
} from "firebase/firestore";
import { Student } from "../types";
import { DEFAULT_STUDENTS } from "../data/defaultStudents";

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
 * Seed the database with default students if it is empty.
 */
export async function seedDatabaseIfEmpty(): Promise<Student[]> {
  try {
    const querySnapshot = await getDocs(collection(db, STUDENTS_COLLECTION));
    if (querySnapshot.empty) {
      console.log("Firestore collection is empty. Seeding with default student records...");
      const batch = writeBatch(db);
      for (const student of DEFAULT_STUDENTS) {
        const docRef = doc(db, STUDENTS_COLLECTION, student.id);
        batch.set(docRef, student);
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
    const querySnapshot = await getDocs(collection(db, STUDENTS_COLLECTION));
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
 * Add a new student record to Firestore
 */
export async function addStudentToDb(student: Student): Promise<void> {
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, student.id);
    await setDoc(docRef, student);
    console.log(`Saved student ${student.name} to Firestore.`);
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
    await setDoc(docRef, student);
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
