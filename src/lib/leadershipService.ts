import { collection, doc, getDocs, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { LeadershipProfile, LeadershipPosition } from "../types";

export const LEADERSHIP_COLLECTION = "leadership_profiles";
const STORAGE_KEY = "bnie_leadership_profiles_v1";

/**
 * Map LeadershipPosition to sectionId used by LeadershipAdministrationPage
 */
export function positionToSectionId(position: LeadershipPosition): string {
  switch (position) {
    case "Chancellor":
      return "chancellor";
    case "Vice-Chancellor":
      return "vice-chancellor";
    case "Pro-Vice-Chancellor":
      return "pro-vice-chancellor";
    case "Treasurer":
      return "treasurer";
    case "Pro-Vice-Chancellor (Administration)":
      return "pro-vice-chancellor-admin";
    case "Registrar":
      return "registrar";
    case "Former Vice-Chancellors":
      return "former-vice-chancellors";
    default:
      return "vice-chancellor";
  }
}

/**
 * Map sectionId to LeadershipPosition
 */
export function sectionIdToPosition(sectionId: string): LeadershipPosition | null {
  switch (sectionId) {
    case "chancellor":
      return "Chancellor";
    case "vice-chancellor":
      return "Vice-Chancellor";
    case "pro-vice-chancellor":
      return "Pro-Vice-Chancellor";
    case "treasurer":
      return "Treasurer";
    case "pro-vice-chancellor-admin":
      return "Pro-Vice-Chancellor (Administration)";
    case "registrar":
      return "Registrar";
    case "former-vice-chancellors":
      return "Former Vice-Chancellors";
    default:
      return null;
  }
}

/**
 * Get cached profiles from localStorage synchronously
 */
export function getLocalProfiles(): LeadershipProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Failed to read local leadership profiles", e);
    return [];
  }
}

/**
 * Save profiles to localStorage synchronously
 */
export function saveLocalProfiles(profiles: LeadershipProfile[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.error("Failed to save local leadership profiles", e);
  }
}

/**
 * Fetch all leadership profiles from Firestore with local fallback
 */
export async function fetchLeadershipProfiles(): Promise<LeadershipProfile[]> {
  try {
    const getDocsPromise = getDocs(collection(db, LEADERSHIP_COLLECTION));
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error("Firestore leadership fetch timeout")), 10000)
    );
    
    const snapshot = await Promise.race([getDocsPromise, timeoutPromise]);
    const remoteProfiles: LeadershipProfile[] = [];
    snapshot.forEach((d) => {
      remoteProfiles.push(d.data() as LeadershipProfile);
    });

    // If Firestore has profiles, cache them locally
    if (remoteProfiles.length > 0) {
      saveLocalProfiles(remoteProfiles);
      return remoteProfiles;
    }

    // If Firestore is empty, check if we have any in local storage
    const local = getLocalProfiles();
    return local;
  } catch (err) {
    console.warn("Could not fetch remote leadership profiles, using local cache:", err);
    return getLocalProfiles();
  }
}

/**
 * Save / Update a leadership profile in both Firestore and local storage
 */
export async function saveLeadershipProfile(profile: LeadershipProfile): Promise<void> {
  // Update local storage immediately for zero-lag response
  const local = getLocalProfiles();
  const existingIdx = local.findIndex((p) => p.id === profile.id);
  let updated: LeadershipProfile[];
  if (existingIdx >= 0) {
    updated = [...local];
    updated[existingIdx] = profile;
  } else {
    updated = [...local, profile];
  }
  saveLocalProfiles(updated);

  // Sync to Firestore
  try {
    const docRef = doc(db, LEADERSHIP_COLLECTION, profile.id);
    await setDoc(docRef, profile);
  } catch (err) {
    console.error("Failed to persist profile to Firestore (saved locally):", err);
    // Don't throw so user experience is not broken when offline
  }
}

/**
 * Delete a leadership profile from both Firestore and local storage
 */
export async function deleteLeadershipProfile(id: string): Promise<void> {
  // Update local storage immediately
  const local = getLocalProfiles();
  const updated = local.filter((p) => p.id !== id);
  saveLocalProfiles(updated);

  // Sync to Firestore
  try {
    const docRef = doc(db, LEADERSHIP_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error("Failed to delete profile from Firestore (deleted locally):", err);
  }
}

/**
 * Listen for real-time updates from Firestore
 */
export function subscribeLeadershipProfiles(
  onUpdate: (profiles: LeadershipProfile[]) => void
): () => void {
  try {
    const unsubscribe = onSnapshot(
      collection(db, LEADERSHIP_COLLECTION),
      (snapshot) => {
        const list: LeadershipProfile[] = [];
        snapshot.forEach((d) => {
          list.push(d.data() as LeadershipProfile);
        });
        if (list.length > 0) {
          saveLocalProfiles(list);
          onUpdate(list);
        } else {
          // If remote empty, deliver local cache
          onUpdate(getLocalProfiles());
        }
      },
      (error) => {
        console.warn("Leadership real-time listener error, falling back to local storage:", error);
        onUpdate(getLocalProfiles());
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn("Could not setup Firestore onSnapshot, delivering local storage profiles:", err);
    onUpdate(getLocalProfiles());
    return () => {};
  }
}
