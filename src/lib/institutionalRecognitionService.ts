import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db, sanitizeForFirestore } from "./firebase";
import { InstitutionalRecognitionSettings, OfficialRecognitionDocument } from "../types";

export const RECOGNITION_COLLECTION = "institutional_recognition";
export const RECOGNITION_DOC = "main_recognition";
const LOCAL_STORAGE_KEY = "bnie_institutional_recognition_v2";

export const DEFAULT_INSTITUTIONAL_RECOGNITION: InstitutionalRecognitionSettings = {
  status: "Official Documents Verified",
  institutionNameBn: "বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউট",
  institutionNameEn: "Bangladesh National Institute of Education (BNIE)",
  establishedYear: "1996",
  officialRegistrationNumber: "REG-BNIE-1996-0715",
  governmentApprovalNumber: "BNIE/GOV-LIC/1996/0715",
  approvalDate: "15 July 1996 (১৫ জুলাই ১৯৯৬)",
  registrationDate: "15 July 1996 (১৫ জুলাই ১৯৯৬)",
  issuingGovernmentAuthority: "গণপ্রজাতন্ত্রী বাংলাদেশ সরকার (Govt. of the People's Republic of Bangladesh)",
  authorizedOfficerName: "Director & Registrar",
  authorizedOfficerDesignation: "Ministry of Education & Technical Education Directorate",
  governmentOrderReference: "MOE/REG-1996/0715-BNIE (স্মারক নং: শিম/শা-১১/নিবন্ধন-১৯৯৬/০৭১৫)",
  officialApprovalDocumentTitle: "Official Government Institutional License & Autonomous Educational Charter (15 July 1996)",
  officialApprovalDocumentUrl: "#official-license-view",
  recognitionDetails: "বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউট (BNIE) ১৫ জুলাই ১৯৯৬ তারিখে গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের শিক্ষা ও কারিগরি শিক্ষা অধিশাখা কর্তৃক অনুমোদিত ও নিবন্ধিত (লাইসেন্স নং: BNIE/GOV-LIC/1996/0715) একটি স্বায়ত্তশাসিত জাতীয় উচ্চশিক্ষা ও কারিগরি শিক্ষা প্রতিষ্ঠান। এটি দেশব্যাপী স্নাতক সম্মান (Honours), ডিগ্রি পাস, স্নাতকোত্তর (Masters), পলিটেকনিক ডিপ্লোমা ও ভোকেশনাল কর্মসূচি পরিচালনা এবং কেন্দ্রীয় ডিজিটাল লেজারের মাধ্যমে সনদ ও মার্কশিট যাচাইকরণ সেবা প্রদান করে।",
  documents: [
    {
      id: "doc-gov-license-1996",
      title: "Government Institutional License & Autonomous Educational Charter (১৫ জুলাই ১৯৯৬)",
      documentType: "Government Institutional License",
      memoReference: "MOE/REG-1996/0715-BNIE",
      issueDate: "15 July 1996",
      fileName: "Government_Institutional_License_1996_BNIE.pdf",
      fileSize: "148 KB",
      fileData: "#view-license"
    },
    {
      id: "doc-gov-gazette-1996",
      title: "Government Registration & Official Gazette Notice",
      documentType: "Official Gazette Reference",
      memoReference: "GAZETTE-REG-1996/0715",
      issueDate: "15 July 1996",
      fileName: "Official_Gazette_Registration_BNIE_1996.pdf",
      fileSize: "112 KB",
      fileData: "#view-gazette"
    }
  ],
  lastUpdated: new Date().toISOString()
};

/**
 * Read cached institutional recognition from localStorage synchronously
 */
export function getLocalInstitutionalRecognition(): InstitutionalRecognitionSettings {
  if (typeof window === "undefined") return DEFAULT_INSTITUTIONAL_RECOGNITION;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return DEFAULT_INSTITUTIONAL_RECOGNITION;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_INSTITUTIONAL_RECOGNITION, ...parsed };
  } catch (e) {
    console.warn("Failed to read local institutional recognition data:", e);
    return DEFAULT_INSTITUTIONAL_RECOGNITION;
  }
}

/**
 * Save institutional recognition to localStorage synchronously
 */
export function saveLocalInstitutionalRecognition(data: InstitutionalRecognitionSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Failed to write local institutional recognition data:", e);
  }
}

/**
 * Fetch institutional recognition settings from Firestore with local fallback
 */
export async function fetchInstitutionalRecognition(): Promise<InstitutionalRecognitionSettings> {
  const local = getLocalInstitutionalRecognition();

  if (!db) {
    return local;
  }

  try {
    const docRef = doc(db, RECOGNITION_COLLECTION, RECOGNITION_DOC);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const remoteData = snap.data() as Partial<InstitutionalRecognitionSettings>;
      const merged: InstitutionalRecognitionSettings = {
        ...DEFAULT_INSTITUTIONAL_RECOGNITION,
        ...remoteData,
        documents: Array.isArray(remoteData.documents) ? remoteData.documents : []
      };
      saveLocalInstitutionalRecognition(merged);
      return merged;
    } else {
      // First run: save default to Firestore if online
      try {
        const sanitized = sanitizeForFirestore({
          ...DEFAULT_INSTITUTIONAL_RECOGNITION,
          id: RECOGNITION_DOC
        });
        await setDoc(docRef, sanitized, { merge: true });
      } catch (err) {
        console.warn("Could not bootstrap default institutional recognition document in Firestore:", err);
      }
      return local;
    }
  } catch (err) {
    console.warn("Firestore fetch institutional recognition error, using local fallback:", err);
    return local;
  }
}

/**
 * Save institutional recognition settings to Firestore and localStorage
 */
export async function saveInstitutionalRecognition(
  data: InstitutionalRecognitionSettings
): Promise<void> {
  const updatedData: InstitutionalRecognitionSettings = {
    ...data,
    lastUpdated: new Date().toISOString()
  };

  // Always update local cache first for instant UI response
  saveLocalInstitutionalRecognition(updatedData);

  if (!db) {
    return;
  }

  const docRef = doc(db, RECOGNITION_COLLECTION, RECOGNITION_DOC);
  const sanitized = sanitizeForFirestore({
    ...updatedData,
    id: RECOGNITION_DOC
  });

  await setDoc(docRef, sanitized, { merge: true });
}

/**
 * Subscribe to real-time updates for institutional recognition
 */
export function subscribeInstitutionalRecognition(
  callback: (data: InstitutionalRecognitionSettings) => void
): () => void {
  if (!db) {
    callback(getLocalInstitutionalRecognition());
    return () => {};
  }

  try {
    const docRef = doc(db, RECOGNITION_COLLECTION, RECOGNITION_DOC);
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const remoteData = snap.data() as Partial<InstitutionalRecognitionSettings>;
          const merged: InstitutionalRecognitionSettings = {
            ...DEFAULT_INSTITUTIONAL_RECOGNITION,
            ...remoteData,
            documents: Array.isArray(remoteData.documents) ? remoteData.documents : []
          };
          saveLocalInstitutionalRecognition(merged);
          callback(merged);
        } else {
          callback(getLocalInstitutionalRecognition());
        }
      },
      (error) => {
        console.warn("Realtime listener error for institutional recognition:", error);
        callback(getLocalInstitutionalRecognition());
      }
    );
  } catch (err) {
    console.warn("Failed to subscribe to institutional recognition:", err);
    callback(getLocalInstitutionalRecognition());
    return () => {};
  }
}
