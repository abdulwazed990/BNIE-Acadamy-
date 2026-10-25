import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db, sanitizeForFirestore } from "./firebase";
import { HomepageContentSettings } from "../types";

export const HOMEPAGE_COLLECTION = "homepage_content";
export const HOMEPAGE_SETTINGS_DOC = "main_settings";
const LOCAL_STORAGE_KEY = "bnie_homepage_settings_v1";

export const DEFAULT_HOMEPAGE_SETTINGS: HomepageContentSettings = {
  id: HOMEPAGE_SETTINGS_DOC,
  heroTitleBn: "বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউট",
  heroTitleEn: "Bangladesh National Institute of Education (BNIE)",
  heroSubtitleBn: "ডিজিটাল সনদ ও মার্কশিট যাচাইকরণ পোর্টাল",
  heroSubtitleEn: "গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত স্বায়ত্তশাসিত জাতীয় উচ্চশিক্ষা ও কারিগরি শিক্ষা ইনস্টিটিউট (BNIE)। এখানে ৪ বছর মেয়াদী স্নাতক (সম্মান/অনার্স), ৩ বছর মেয়াদী স্নাতক ডিগ্রি (পাস), স্নাতকোত্তর (মাস্টার্স), ১ থেকে ৪ বছর মেয়াদী ডিপ্লোমা ইন ইঞ্জিনিয়ারিং এবং এস.এস.সি ও এইচ.এস.সি এর প্রাতিষ্ঠানিক সনদ ও পূর্ণাঙ্গ সেমিস্টারভিত্তিক মার্কশিট অনলাইন যাচাইকরণের কেন্দ্রীয় সুবিধা রয়েছে।",
  announcementBannerText: "জরুরি নোটিশ: ২০২৪–২০২৫ শিক্ষাবর্ষে কারিগরি, ভোকেশনাল ও উচ্চশিক্ষা ডিগ্রি কোর্সের অনলাইন ভর্তি ও পরীক্ষার ফলাফল যাচাইকরণ কার্যক্রম চলছে।",
  isAnnouncementBannerActive: false,
  announcementLink: "/?page=notices",
  isAccreditationVisible: true,
  isDegreeProgramsVisible: true,
  isVocationalVisible: true,
  isDiplomaStreamsVisible: true,
  isMissionServicesVisible: true,
  isVcMessageCardVisible: true,
  isResultsCardVisible: true,
  isComplaintsCardVisible: true,
  isFindProgramCardVisible: true,
  isHandbooksCardVisible: true,
  isAdmissionCardVisible: true,
  isOsapsCardVisible: true,
  isEbookCardVisible: true,
  isWebmailCardVisible: true,
  updatedAt: new Date().toISOString()
};

/**
 * Read cached homepage settings from localStorage synchronously
 */
export function getLocalHomepageSettings(): HomepageContentSettings {
  if (typeof window === "undefined") return DEFAULT_HOMEPAGE_SETTINGS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return DEFAULT_HOMEPAGE_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_HOMEPAGE_SETTINGS, ...parsed };
  } catch (e) {
    console.warn("Failed to read local homepage settings:", e);
    return DEFAULT_HOMEPAGE_SETTINGS;
  }
}

/**
 * Save homepage settings to localStorage synchronously
 */
export function saveLocalHomepageSettings(settings: HomepageContentSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn("Failed to write local homepage settings:", e);
  }
}

/**
 * Fetch homepage settings from authoritative persistent Firestore database
 */
export async function fetchHomepageSettings(): Promise<HomepageContentSettings> {
  try {
    const docRef = doc(db, HOMEPAGE_COLLECTION, HOMEPAGE_SETTINGS_DOC);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Firestore homepage settings fetch timeout")), 8000)
    );
    const snap = await Promise.race([getDoc(docRef), timeoutPromise]);

    if (snap.exists()) {
      const data = snap.data() as HomepageContentSettings;
      const merged = { ...DEFAULT_HOMEPAGE_SETTINGS, ...data };
      saveLocalHomepageSettings(merged);
      return merged;
    } else {
      // Seed default settings to Firestore
      const sanitized = sanitizeForFirestore(DEFAULT_HOMEPAGE_SETTINGS);
      await setDoc(docRef, sanitized);
      saveLocalHomepageSettings(DEFAULT_HOMEPAGE_SETTINGS);
      return DEFAULT_HOMEPAGE_SETTINGS;
    }
  } catch (err) {
    console.warn("Could not fetch remote homepage settings, using local fallback:", err);
    return getLocalHomepageSettings();
  }
}

/**
 * Persist updated homepage content settings to Firestore
 */
export async function saveHomepageSettings(settings: HomepageContentSettings): Promise<void> {
  const toSave: HomepageContentSettings = {
    ...settings,
    id: HOMEPAGE_SETTINGS_DOC,
    updatedAt: new Date().toISOString()
  };

  const sanitized = sanitizeForFirestore(toSave);

  try {
    const docRef = doc(db, HOMEPAGE_COLLECTION, HOMEPAGE_SETTINGS_DOC);
    await setDoc(docRef, sanitized);
  } catch (err) {
    console.error("Failed to persist homepage settings to Firestore:", err);
    throw err;
  }

  saveLocalHomepageSettings(toSave);
}

/**
 * Real-time subscription to homepage content changes
 */
export function subscribeHomepageSettings(
  onUpdate: (settings: HomepageContentSettings) => void
): () => void {
  try {
    const docRef = doc(db, HOMEPAGE_COLLECTION, HOMEPAGE_SETTINGS_DOC);
    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as HomepageContentSettings;
          const merged = { ...DEFAULT_HOMEPAGE_SETTINGS, ...data };
          saveLocalHomepageSettings(merged);
          onUpdate(merged);
        } else {
          onUpdate(getLocalHomepageSettings());
        }
      },
      (error) => {
        console.warn("Homepage settings listener error:", error);
        onUpdate(getLocalHomepageSettings());
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn("Could not setup homepage settings listener:", err);
    onUpdate(getLocalHomepageSettings());
    return () => {};
  }
}
