import { SubjectGrade } from "../types";

export interface AcademicSubjectCatalogueEntry {
  id: string;
  catalogueId?: string;
  serialNo: number;
  paperCode: string;
  subjectTitle: string;
  paperTitle?: string;
  groupType: "History Major" | "Allied, Language, and Compulsory";
  paperType?: "Major / Honours" | "Allied / Subsidiary" | "Compulsory" | "Oral Examination / Viva";
  suggestedYear: "First Year" | "Second Year" | "Third Year" | "Elective / Open";
  defaultFullMarks: number;
  proposedFullMarks?: number;
  defaultPassMarks: number;
  proposedPassMarks?: number;
  isCompulsory: boolean;
  historicalNotes?: string;
}

const RAW_BA_HISTORY_30_CATALOGUE: Omit<AcademicSubjectCatalogueEntry, "catalogueId" | "paperTitle" | "paperType" | "proposedFullMarks" | "proposedPassMarks">[] = [
  // History Major Subjects (Entries 1 to 20)
  {
    id: "bah-01",
    serialNo: 1,
    paperCode: "HIS-101",
    subjectTitle: "Introduction to History and Historical Method",
    groupType: "History Major",
    suggestedYear: "First Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: true,
    historicalNotes: "Historiography, critical method, source criticism and methodology."
  },
  {
    id: "bah-02",
    serialNo: 2,
    paperCode: "HIS-102",
    subjectTitle: "Ancient History of the Indian Subcontinent",
    groupType: "History Major",
    suggestedYear: "First Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: true,
    historicalNotes: "Indus Valley, Vedic era, Mauryan Empire, and classical kingdoms."
  },
  {
    id: "bah-03",
    serialNo: 3,
    paperCode: "HIS-103",
    subjectTitle: "History of Bengal in Ancient Times",
    groupType: "History Major",
    suggestedYear: "First Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: true,
    historicalNotes: "Gangaridai, Sasanka, Pala and Sena dynasties in Bengal."
  },
  {
    id: "bah-04",
    serialNo: 4,
    paperCode: "HIS-201",
    subjectTitle: "History of Medieval Bengal",
    groupType: "History Major",
    suggestedYear: "Second Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: true,
    historicalNotes: "Bakhtiyar Khalji to the independent Sultanate of Bengal (Ilyas Shahi & Hussain Shahi)."
  },
  {
    id: "bah-05",
    serialNo: 5,
    paperCode: "HIS-202",
    subjectTitle: "History of the Delhi Sultanate",
    groupType: "History Major",
    suggestedYear: "Second Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: true,
    historicalNotes: "Slave dynasty, Khalji administrative reforms, Tughlaq and Lodi dynasties."
  },
  {
    id: "bah-06",
    serialNo: 6,
    paperCode: "HIS-203",
    subjectTitle: "History of the Mughal Empire",
    groupType: "History Major",
    suggestedYear: "Second Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: true,
    historicalNotes: "Babur to Aurangzeb; administrative, agrarian, and cultural structures."
  },
  {
    id: "bah-07",
    serialNo: 7,
    paperCode: "HIS-204",
    subjectTitle: "History of Bengal under Mughal Rule",
    groupType: "History Major",
    suggestedYear: "Second Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: true,
    historicalNotes: "Subah Bangla, Baro-Bhuyans, Nawabi administration of Murshid Quli Khan."
  },
  {
    id: "bah-08",
    serialNo: 8,
    paperCode: "HIS-301",
    subjectTitle: "History of Bengal under British Rule",
    groupType: "History Major",
    suggestedYear: "Third Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: true,
    historicalNotes: "Battle of Plassey (1757) to 1947; Permanent Settlement and socio-agrarian changes."
  },
  {
    id: "bah-09",
    serialNo: 9,
    paperCode: "HIS-302",
    subjectTitle: "History of the Indian Subcontinent under British Rule",
    groupType: "History Major",
    suggestedYear: "Third Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: true,
    historicalNotes: "East India Company consolidation, Crown governance, 1857 war, constitutional reforms."
  },
  {
    id: "bah-10",
    serialNo: 10,
    paperCode: "HIS-303",
    subjectTitle: "History of the Partition of Bengal",
    groupType: "History Major",
    suggestedYear: "Third Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: false,
    historicalNotes: "1905 Partition of Bengal, Swadeshi movement, annulment in 1911, and 1947 partition."
  },
  {
    id: "bah-11",
    serialNo: 11,
    paperCode: "HIS-304",
    subjectTitle: "History of the Indian National Movement",
    groupType: "History Major",
    suggestedYear: "Third Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: true,
    historicalNotes: "Anti-colonial struggle, Congress, Muslim League, and mass movements."
  },
  {
    id: "bah-12",
    serialNo: 12,
    paperCode: "HIS-305",
    subjectTitle: "History of the Partition of India",
    groupType: "History Major",
    suggestedYear: "Third Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: false,
    historicalNotes: "1940 Lahore Resolution, Cabinet Mission, Mountbatten Plan, boundary demarcation."
  },
  {
    id: "bah-13",
    serialNo: 13,
    paperCode: "HIS-306",
    subjectTitle: "History of Pakistan",
    groupType: "History Major",
    suggestedYear: "Third Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: false,
    historicalNotes: "1947 to 1971; political, constitutional, and economic disparities."
  },
  {
    id: "bah-14",
    serialNo: 14,
    paperCode: "HIS-307",
    subjectTitle: "History of the Language Movement in East Bengal",
    groupType: "History Major",
    suggestedYear: "Second Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: true,
    historicalNotes: "1948-1952 state language protests, 21st February martyrdom, and cultural resistance."
  },
  {
    id: "bah-15",
    serialNo: 15,
    paperCode: "HIS-308",
    subjectTitle: "History of the Emergence of Bangladesh",
    groupType: "History Major",
    suggestedYear: "Third Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: true,
    historicalNotes: "6-Point programme, 1969 mass uprising, 1970 elections, and 1971 Liberation War."
  },
  {
    id: "bah-16",
    serialNo: 16,
    paperCode: "HIS-309",
    subjectTitle: "Political History of Bangladesh",
    groupType: "History Major",
    suggestedYear: "Third Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: false,
    historicalNotes: "Post-1971 constitution, state restructuring, governance, and democratic transitions."
  },
  {
    id: "bah-17",
    serialNo: 17,
    paperCode: "HIS-310",
    subjectTitle: "Social and Economic History of Bengal",
    groupType: "History Major",
    suggestedYear: "Second Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: false,
    historicalNotes: "Agrarian systems, artisan guilds, indigo cultivation, famine, and trade networks."
  },
  {
    id: "bah-18",
    serialNo: 18,
    paperCode: "HIS-311",
    subjectTitle: "History of Ancient Civilizations",
    groupType: "History Major",
    suggestedYear: "First Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: false,
    historicalNotes: "Mesopotamian, Egyptian, Greek, and Roman civilizations."
  },
  {
    id: "bah-19",
    serialNo: 19,
    paperCode: "HIS-312",
    subjectTitle: "History of Medieval Civilizations",
    groupType: "History Major",
    suggestedYear: "Second Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: false,
    historicalNotes: "Byzantine, Islamic Golden Age, and Feudal European institutions."
  },
  {
    id: "bah-20",
    serialNo: 20,
    paperCode: "HIS-313",
    subjectTitle: "History of Modern Europe",
    groupType: "History Major",
    suggestedYear: "Third Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: false,
    historicalNotes: "French Revolution, Industrial Revolution, World Wars, and contemporary Europe."
  },

  // Allied, Language, and Compulsory Subject Entries (Entries 21 to 30)
  {
    id: "bah-21",
    serialNo: 21,
    paperCode: "ENG-101",
    subjectTitle: "English",
    groupType: "Allied, Language, and Compulsory",
    suggestedYear: "First Year",
    defaultFullMarks: 100,
    defaultPassMarks: 33,
    isCompulsory: true,
    historicalNotes: "Compulsory language paper / subsidiary English literature and grammar."
  },
  {
    id: "bah-22",
    serialNo: 22,
    paperCode: "BEN-101",
    subjectTitle: "Bengali",
    groupType: "Allied, Language, and Compulsory",
    suggestedYear: "First Year",
    defaultFullMarks: 100,
    defaultPassMarks: 33,
    isCompulsory: true,
    historicalNotes: "Compulsory national language paper / Bengali literature."
  },
  {
    id: "bah-23",
    serialNo: 23,
    paperCode: "POL-101",
    subjectTitle: "Political Science",
    groupType: "Allied, Language, and Compulsory",
    suggestedYear: "First Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: false,
    historicalNotes: "Subsidiary subject option: Western and South Asian political thought."
  },
  {
    id: "bah-24",
    serialNo: 24,
    paperCode: "SOC-101",
    subjectTitle: "Sociology",
    groupType: "Allied, Language, and Compulsory",
    suggestedYear: "Second Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: false,
    historicalNotes: "Subsidiary subject option: Social structure, institutions, and community."
  },
  {
    id: "bah-25",
    serialNo: 25,
    paperCode: "ECO-101",
    subjectTitle: "Economics",
    groupType: "Allied, Language, and Compulsory",
    suggestedYear: "First Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: false,
    historicalNotes: "Subsidiary subject option: Principles of micro and macro economics."
  },
  {
    id: "bah-26",
    serialNo: 26,
    paperCode: "PHI-101",
    subjectTitle: "Philosophy",
    groupType: "Allied, Language, and Compulsory",
    suggestedYear: "Second Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: false,
    historicalNotes: "Subsidiary subject option: Epistemology, ethics, and Indian philosophy."
  },
  {
    id: "bah-27",
    serialNo: 27,
    paperCode: "IHC-101",
    subjectTitle: "Islamic History and Culture",
    groupType: "Allied, Language, and Compulsory",
    suggestedYear: "First Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: false,
    historicalNotes: "Subsidiary subject option: History of Islam, Caliphate, and Muslim art."
  },
  {
    id: "bah-28",
    serialNo: 28,
    paperCode: "GEO-101",
    subjectTitle: "Geography",
    groupType: "Allied, Language, and Compulsory",
    suggestedYear: "Second Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: false,
    historicalNotes: "Subsidiary subject option: Physical, economic, and regional geography of Bengal."
  },
  {
    id: "bah-29",
    serialNo: 29,
    paperCode: "SW-101",
    subjectTitle: "Social Work",
    groupType: "Allied, Language, and Compulsory",
    suggestedYear: "Second Year",
    defaultFullMarks: 100,
    defaultPassMarks: 36,
    isCompulsory: false,
    historicalNotes: "Subsidiary subject option: Social welfare principles and community development."
  },
  {
    id: "bah-30",
    serialNo: 30,
    paperCode: "COMP-VER",
    subjectTitle: "Compulsory Paper — Title to Be Verified",
    groupType: "Allied, Language, and Compulsory",
    suggestedYear: "First Year",
    defaultFullMarks: 100,
    defaultPassMarks: 33,
    isCompulsory: true,
    historicalNotes: "Place-holder for historically documented compulsory paper pursuant to university regulations."
  }
];

/**
 * PROPOSED 30-SUBJECT CATALOGUE FOR B.A. HONOURS IN HISTORY
 * 
 * CRITICAL HISTORICAL SYLLABUS REQUIREMENT (Clause 4 & Clause 13):
 * These 30 entries represent a proposed master catalogue for configuring academic programmes.
 * They are NOT an authenticated 1994 syllabus until verified against original university ordinances
 * (e.g., University of Dhaka, Rajshahi University, or National University).
 * 
 * The administrator must be able to select applicable subjects, remove irrelevant entries,
 * add historically verified papers, and reorder subjects.
 */
export const PROPOSED_BA_HISTORY_30_CATALOGUE: AcademicSubjectCatalogueEntry[] = RAW_BA_HISTORY_30_CATALOGUE.map((item) => ({
  ...item,
  catalogueId: item.id,
  paperTitle: item.subjectTitle,
  paperType: item.groupType === "History Major" ? "Major / Honours" : "Allied / Subsidiary",
  proposedFullMarks: item.defaultFullMarks,
  proposedPassMarks: item.defaultPassMarks
}));

export const COMPLETE_30_SUBJECT_CATALOGUE = PROPOSED_BA_HISTORY_30_CATALOGUE;

/**
 * Standard preset for Historical 3-Year B.A. Honours in History (e.g. 1994 / 2000 structure)
 * 16 papers total (1600 Marks) spanning Year 1, Year 2, and Year 3 + Comprehensive Viva
 */
export function getHistorical3YearHonoursHistoryPreset(examYear?: number): SubjectGrade[] {
  return [
    // FIRST YEAR (4 Papers - 400 Marks)
    {
      id: "his-y1-01",
      serialNo: "01",
      displayOrder: 1,
      subjectCode: "HIS-101",
      subjectName: "Introduction to History and Historical Method",
      year: "First Year",
      marks: 68,
      fullMarks: 100,
      passMarks: 36,
      gradePoint: 0,
      isCompulsory: true,
      paperType: "Major / Honours"
    },
    {
      id: "his-y1-02",
      serialNo: "02",
      displayOrder: 2,
      subjectCode: "HIS-102",
      subjectName: "Ancient History of the Indian Subcontinent",
      year: "First Year",
      marks: 65,
      fullMarks: 100,
      passMarks: 36,
      gradePoint: 0,
      isCompulsory: true,
      paperType: "Major / Honours"
    },
    {
      id: "his-y1-03",
      serialNo: "03",
      displayOrder: 3,
      subjectCode: "HIS-103",
      subjectName: "History of Bengal in Ancient Times",
      year: "First Year",
      marks: 72,
      fullMarks: 100,
      passMarks: 36,
      gradePoint: 0,
      isCompulsory: true,
      paperType: "Major / Honours"
    },
    {
      id: "his-y1-04",
      serialNo: "04",
      displayOrder: 4,
      subjectCode: "BEN-101",
      subjectName: "Bengali (Compulsory Subsidiary Paper)",
      year: "First Year",
      marks: 64,
      fullMarks: 100,
      passMarks: 33,
      gradePoint: 0,
      isCompulsory: true,
      paperType: "Compulsory"
    },

    // SECOND YEAR (5 Papers - 500 Marks)
    {
      id: "his-y2-01",
      serialNo: "05",
      displayOrder: 5,
      subjectCode: "HIS-201",
      subjectName: "History of Medieval Bengal",
      year: "Second Year",
      marks: 67,
      fullMarks: 100,
      passMarks: 36,
      gradePoint: 0,
      isCompulsory: true,
      paperType: "Major / Honours"
    },
    {
      id: "his-y2-02",
      serialNo: "06",
      displayOrder: 6,
      subjectCode: "HIS-202",
      subjectName: "History of the Delhi Sultanate",
      year: "Second Year",
      marks: 63,
      fullMarks: 100,
      passMarks: 36,
      gradePoint: 0,
      isCompulsory: true,
      paperType: "Major / Honours"
    },
    {
      id: "his-y2-03",
      serialNo: "07",
      displayOrder: 7,
      subjectCode: "HIS-203",
      subjectName: "History of the Mughal Empire",
      year: "Second Year",
      marks: 70,
      fullMarks: 100,
      passMarks: 36,
      gradePoint: 0,
      isCompulsory: true,
      paperType: "Major / Honours"
    },
    {
      id: "his-y2-04",
      serialNo: "08",
      displayOrder: 8,
      subjectCode: "HIS-204",
      subjectName: "History of Bengal under Mughal Rule",
      year: "Second Year",
      marks: 69,
      fullMarks: 100,
      passMarks: 36,
      gradePoint: 0,
      isCompulsory: true,
      paperType: "Major / Honours"
    },
    {
      id: "his-y2-05",
      serialNo: "09",
      displayOrder: 9,
      subjectCode: "ENG-101",
      subjectName: "English (Compulsory Subsidiary Paper)",
      year: "Second Year",
      marks: 58,
      fullMarks: 100,
      passMarks: 33,
      gradePoint: 0,
      isCompulsory: true,
      paperType: "Compulsory"
    },

    // THIRD YEAR (7 Papers - 700 Marks)
    {
      id: "his-y3-01",
      serialNo: "10",
      displayOrder: 10,
      subjectCode: "HIS-301",
      subjectName: "History of Bengal under British Rule",
      year: "Third Year",
      marks: 66,
      fullMarks: 100,
      passMarks: 36,
      gradePoint: 0,
      isCompulsory: true,
      paperType: "Major / Honours"
    },
    {
      id: "his-y3-02",
      serialNo: "11",
      displayOrder: 11,
      subjectCode: "HIS-302",
      subjectName: "History of the Indian Subcontinent under British Rule",
      year: "Third Year",
      marks: 62,
      fullMarks: 100,
      passMarks: 36,
      gradePoint: 0,
      isCompulsory: true,
      paperType: "Major / Honours"
    },
    {
      id: "his-y3-03",
      serialNo: "12",
      displayOrder: 12,
      subjectCode: "HIS-304",
      subjectName: "History of the Indian National Movement",
      year: "Third Year",
      marks: 64,
      fullMarks: 100,
      passMarks: 36,
      gradePoint: 0,
      isCompulsory: true,
      paperType: "Major / Honours"
    },
    {
      id: "his-y3-04",
      serialNo: "13",
      displayOrder: 13,
      subjectCode: "HIS-307",
      subjectName: "History of the Language Movement in East Bengal",
      year: "Third Year",
      marks: 74,
      fullMarks: 100,
      passMarks: 36,
      gradePoint: 0,
      isCompulsory: true,
      paperType: "Major / Honours"
    },
    {
      id: "his-y3-05",
      serialNo: "14",
      displayOrder: 14,
      subjectCode: "HIS-308",
      subjectName: "History of the Emergence of Bangladesh",
      year: "Third Year",
      marks: 76,
      fullMarks: 100,
      passMarks: 36,
      gradePoint: 0,
      isCompulsory: true,
      paperType: "Major / Honours"
    },
    {
      id: "his-y3-06",
      serialNo: "15",
      displayOrder: 15,
      subjectCode: "HIS-313",
      subjectName: "History of Modern Europe",
      year: "Third Year",
      marks: 61,
      fullMarks: 100,
      passMarks: 36,
      gradePoint: 0,
      isCompulsory: false,
      paperType: "Major / Honours"
    },
    {
      id: "his-y3-07",
      serialNo: "16",
      displayOrder: 16,
      subjectCode: "HIS-VIVA",
      subjectName: "Comprehensive Oral Examination (Viva-Voce)",
      year: "Third Year",
      marks: 78,
      fullMarks: 100,
      passMarks: 40,
      gradePoint: 0,
      isCompulsory: true,
      paperType: "Oral Examination / Viva"
    }
  ];
}

/**
 * Standard preset for B.A. Degree Pass programme (3-Year Annual / 9 to 12 Papers)
 * Distinct from Honours, containing Principal and Subsidiary subjects.
 */
export function getDegreePassPreset(examYear?: number): SubjectGrade[] {
  return [
    {
      id: "pass-y1-01",
      serialNo: "01",
      displayOrder: 1,
      subjectCode: "BA-P-101",
      subjectName: "National Language & Bengali Literature",
      year: "First Year",
      marks: 62,
      fullMarks: 100,
      passMarks: 33,
      gradePoint: 0,
      isCompulsory: true,
      paperType: "Compulsory"
    },
    {
      id: "pass-y1-02",
      serialNo: "02",
      displayOrder: 2,
      subjectCode: "BA-P-102",
      subjectName: "English Language & Foundational Writing",
      year: "First Year",
      marks: 58,
      fullMarks: 100,
      passMarks: 33,
      gradePoint: 0,
      isCompulsory: true,
      paperType: "Compulsory"
    },
    {
      id: "pass-y1-03",
      serialNo: "03",
      displayOrder: 3,
      subjectCode: "BA-P-103",
      subjectName: "History of the Emergence of Independent Bangladesh",
      year: "First Year",
      marks: 70,
      fullMarks: 100,
      passMarks: 33,
      gradePoint: 0,
      isCompulsory: true,
      paperType: "Compulsory"
    },
    {
      id: "pass-y2-01",
      serialNo: "04",
      displayOrder: 4,
      subjectCode: "BA-P-201",
      subjectName: "History of Bengal & South Asia (Principal Paper I)",
      year: "Second Year",
      marks: 65,
      fullMarks: 100,
      passMarks: 33,
      gradePoint: 0,
      isCompulsory: false,
      paperType: "Major / Honours"
    },
    {
      id: "pass-y2-02",
      serialNo: "05",
      displayOrder: 5,
      subjectCode: "BA-P-202",
      subjectName: "Political Science & Government Systems (Subsidiary Paper I)",
      year: "Second Year",
      marks: 60,
      fullMarks: 100,
      passMarks: 33,
      gradePoint: 0,
      isCompulsory: false,
      paperType: "Allied / Subsidiary"
    },
    {
      id: "pass-y2-03",
      serialNo: "06",
      displayOrder: 6,
      subjectCode: "BA-P-203",
      subjectName: "Islamic History and Culture (Subsidiary Paper II)",
      year: "Second Year",
      marks: 64,
      fullMarks: 100,
      passMarks: 33,
      gradePoint: 0,
      isCompulsory: false,
      paperType: "Allied / Subsidiary"
    },
    {
      id: "pass-y3-01",
      serialNo: "07",
      displayOrder: 7,
      subjectCode: "BA-P-301",
      subjectName: "Modern History & Bangladesh Affairs (Principal Paper II)",
      year: "Third Year",
      marks: 68,
      fullMarks: 100,
      passMarks: 33,
      gradePoint: 0,
      isCompulsory: false,
      paperType: "Major / Honours"
    },
    {
      id: "pass-y3-02",
      serialNo: "08",
      displayOrder: 8,
      subjectCode: "BA-P-302",
      subjectName: "Social Philosophy & Ethics (Subsidiary Paper III)",
      year: "Third Year",
      marks: 59,
      fullMarks: 100,
      passMarks: 33,
      gradePoint: 0,
      isCompulsory: false,
      paperType: "Allied / Subsidiary"
    },
    {
      id: "pass-y3-03",
      serialNo: "09",
      displayOrder: 9,
      subjectCode: "BA-P-303",
      subjectName: "Comprehensive Oral Examination & General Studies",
      year: "Third Year",
      marks: 75,
      fullMarks: 100,
      passMarks: 33,
      gradePoint: 0,
      isCompulsory: true,
      paperType: "Oral Examination / Viva"
    }
  ];
}
