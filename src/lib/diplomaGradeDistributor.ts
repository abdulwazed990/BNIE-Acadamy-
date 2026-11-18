import { Category, Student, SubjectGrade, calculateDiplomaGpa } from "../types";

export const VALID_DIPLOMA_GRADE_POINTS = [4.00, 3.75, 3.50, 3.25, 3.00, 2.75, 2.50, 2.25, 2.00] as const;

// Deterministic PRNG (Mulberry32) seeded from string
function hashSeed(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function createRng(seedStr: string): () => number {
  let a = hashSeed(seedStr) || 123456789;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleIndices(length: number, rng: () => number): number[] {
  const arr = Array.from({ length }, (_, i) => i);
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function snapToQuarter(val: number): number {
  const clamped = Math.max(2.0, Math.min(4.0, val));
  return Math.round(clamped * 4) / 4;
}

/**
 * Generates realistic marks matching a Diploma 4.00-scale grade point
 */
export function getMarksForDiplomaGp(gp: number, rng: () => number): number {
  if (gp >= 4.00) return 80 + Math.floor(rng() * 14); // 80-93
  if (gp >= 3.75) return 75 + Math.floor(rng() * 5);  // 75-79
  if (gp >= 3.50) return 70 + Math.floor(rng() * 5);  // 70-74
  if (gp >= 3.25) return 65 + Math.floor(rng() * 5);  // 65-69
  if (gp >= 3.00) return 60 + Math.floor(rng() * 5);  // 60-64
  if (gp >= 2.75) return 55 + Math.floor(rng() * 5);  // 55-59
  if (gp >= 2.50) return 50 + Math.floor(rng() * 5);  // 50-54
  if (gp >= 2.25) return 45 + Math.floor(rng() * 5);  // 45-49
  if (gp >= 2.00) return 40 + Math.floor(rng() * 5);  // 40-44
  return 25 + Math.floor(rng() * 10);
}

/**
 * Distributes realistic, naturally varying grade points across all Diploma subjects
 * (and across all academic years) while preserving the exact target cumulative CGPA.
 */
export function distributeDiplomaSubjectGrades(
  subjects: SubjectGrade[],
  targetGpa: number,
  seedKey = "bnie-diploma"
): SubjectGrade[] {
  const n = subjects.length;
  if (n === 0) return subjects;

  const targetRounded = Math.round(Math.max(0, Math.min(4.0, targetGpa)) * 100) / 100;
  const rng = createRng(`${seedKey}-${targetRounded.toFixed(2)}-${n}`);

  // Perfect 4.00 CGPA requires 4.00 in every subject; vary marks realistically (81-93)
  if (targetRounded >= 4.00) {
    return subjects.map((sub) => ({
      ...sub,
      gradePoint: 4.00,
      marks: getMarksForDiplomaGp(4.00, rng),
    }));
  }

  // Failed record (below 2.00)
  if (targetRounded < 2.00) {
    return subjects.map((sub) => ({ ...sub }));
  }

  // 1. Seed initial varied grade points centered around targetRounded using 0.25 steps
  // Include broader natural offsets (-0.75 to +0.50) so subjects mix A+, A, A-, B+, etc.
  const offsetPool = [-0.50, -0.25, -0.25, 0.0, 0.25, 0.25, 0.50, -0.75, 0.0, 0.25];
  const gps = subjects.map((_, idx) => {
    const pick = offsetPool[Math.floor(rng() * offsetPool.length)];
    // Add slight per-year drift so different years naturally vary
    const yearHint = subjects[idx].year || "";
    const yearShift =
      yearHint === "FIRST YEAR" ? -0.25 :
      yearHint === "SECOND YEAR" ? 0.0 :
      yearHint === "THIRD YEAR" ? (rng() > 0.5 ? 0.25 : -0.25) :
      yearHint === "FOURTH YEAR" ? 0.25 : 0.0;
    const raw = targetRounded + pick + (rng() > 0.6 ? yearShift : 0);
    return snapToQuarter(raw);
  });

  // Ensure initial spread is never uniform when target < 4.00
  if (new Set(gps).size <= 1 && n >= 2) {
    const shuffled = shuffleIndices(n, rng);
    gps[shuffled[0]] = snapToQuarter(targetRounded - 0.25);
    gps[shuffled[1]] = snapToQuarter(targetRounded + 0.25);
    if (n >= 4) {
      gps[shuffled[2]] = snapToQuarter(targetRounded - 0.50);
    }
  }

  const credits = subjects.map((s) => (s.credit && s.credit > 0 ? s.credit : 1));
  const totalCredits = credits.reduce((a, b) => a + b, 0);

  const computeRoundedGpa = (arr: number[]): number => {
    let weighted = 0;
    for (let i = 0; i < n; i++) {
      weighted += arr[i] * credits[i];
    }
    return Math.min(4.0, Math.round((weighted / totalCredits) * 100) / 100);
  };

  const computeRawGpa = (arr: number[]): number => {
    let weighted = 0;
    for (let i = 0; i < n; i++) {
      weighted += arr[i] * credits[i];
    }
    return weighted / totalCredits;
  };

  // 2. Coordinate descent using standard 0.25 grade steps to hit exact targetRounded
  let iterations = 0;
  while (computeRoundedGpa(gps) !== targetRounded && iterations < 1000) {
    iterations++;
    const currentRaw = computeRawGpa(gps);
    const needIncrease = currentRaw < targetRounded;

    // Order candidates randomly, preferring subjects closer to the middle so we keep natural highs & lows
    const order = shuffleIndices(n, rng);
    order.sort((a, b) => {
      if (needIncrease) {
        // Prefer raising lower grades slightly first, but avoid raising every low grade if high ones aren't maxed
        return gps[a] - gps[b];
      } else {
        // Prefer lowering higher grades, especially if there are too many 4.00s
        return gps[b] - gps[a];
      }
    });

    // Pick from top candidates with small randomness to avoid monotonous patterns
    const candidates = order.filter((idx) => (needIncrease ? gps[idx] < 4.0 : gps[idx] > 2.0));
    if (candidates.length === 0) break;

    // Select among first few candidates so we don't always modify the same index
    const poolSize = Math.min(candidates.length, Math.max(1, Math.ceil(candidates.length * 0.4)));
    const chosenIdx = candidates[Math.floor(rng() * poolSize)];
    gps[chosenIdx] = snapToQuarter(gps[chosenIdx] + (needIncrease ? 0.25 : -0.25));
  }

  // 3. Encourage multi-grade spread (e.g., avoid having only 4.00 & 3.75 when a 3.50 + 4.00 pair keeps the same sum!)
  if (n >= 6 && targetRounded <= 3.92 && targetRounded >= 2.25) {
    const order = shuffleIndices(n, rng);
    const swaps = Math.min(3, Math.floor(n / 6));
    for (let s = 0; s < swaps; s++) {
      const idxHigh = order.find((i) => gps[i] <= 3.75 && gps[i] >= 2.50);
      const idxLow = order.find((i) => i !== idxHigh && credits[i] === credits[idxHigh ?? 0] && gps[i] <= 3.75 && gps[i] >= 2.50);
      if (idxHigh !== undefined && idxLow !== undefined) {
        const nextHigh = snapToQuarter(gps[idxHigh] + 0.25);
        const nextLow = snapToQuarter(gps[idxLow] - 0.25);
        if (nextHigh - gps[idxHigh] === 0.25 && gps[idxLow] - nextLow === 0.25) {
          const prevHigh = gps[idxHigh];
          const prevLow = gps[idxLow];
          gps[idxHigh] = nextHigh;
          gps[idxLow] = nextLow;
          if (computeRoundedGpa(gps) !== targetRounded) {
            gps[idxHigh] = prevHigh;
            gps[idxLow] = prevLow;
          }
        }
      }
    }
  }

  // 4. Ensure year-to-year variation (no two years identical or uniform when year tags exist)
  const years = Array.from(new Set(subjects.map((s) => s.year).filter(Boolean))) as string[];
  if (years.length >= 2) {
    for (let pass = 0; pass < 8; pass++) {
      let adjusted = false;
      const yearStats = years.map((yr) => {
        const idxs = subjects.map((s, idx) => (s.year === yr ? idx : -1)).filter((idx) => idx !== -1);
        const uniqueInYear = new Set(idxs.map((i) => gps[i]));
        const yrCredits = idxs.reduce((sum, i) => sum + credits[i], 0);
        const yrAvg = yrCredits > 0 ? idxs.reduce((sum, i) => sum + gps[i] * credits[i], 0) / yrCredits : 0;
        return { yr, idxs, uniqueInYear, yrAvg: Math.round(yrAvg * 100) / 100 };
      });

      const uniformYear = yearStats.find((ys) => ys.idxs.length >= 3 && ys.uniqueInYear.size <= 1);
      const duplicateAvgYear = yearStats.find((ys, i) =>
        yearStats.some((other, j) => i !== j && Math.abs(ys.yrAvg - other.yrAvg) < 0.005)
      );
      const targetYear = uniformYear || duplicateAvgYear;
      if (!targetYear) break;

      // Try equal-credit balanced swap between targetYear and another year
      for (const iA of shuffleIndices(targetYear.idxs.length, rng).map((k) => targetYear.idxs[k])) {
        const otherIdxs = subjects
          .map((s, idx) => (s.year && s.year !== targetYear.yr && credits[idx] === credits[iA] ? idx : -1))
          .filter((idx) => idx !== -1);
        for (const iB of shuffleIndices(otherIdxs.length, rng).map((k) => otherIdxs[k])) {
          if (gps[iA] !== gps[iB]) {
            const tmp = gps[iA];
            gps[iA] = gps[iB];
            gps[iB] = tmp;
            if (computeRoundedGpa(gps) === targetRounded) {
              adjusted = true;
              break;
            }
            gps[iB] = gps[iA];
            gps[iA] = tmp;
          }
        }
        if (adjusted) break;
      }
      if (!adjusted) break;
    }
  }

  // 5. Fallback fine adjustment ONLY if small subject count prevented pure 0.25 steps from hitting targetRounded
  if (computeRoundedGpa(gps) !== targetRounded) {
    const targetWeighted = targetRounded * totalCredits;
    let currentWeighted = 0;
    for (let i = 0; i < n; i++) currentWeighted += gps[i] * credits[i];
    let diff = targetWeighted - currentWeighted;

    const order = shuffleIndices(n, rng);
    for (const idx of order) {
      if (Math.abs(diff) < 0.0001) break;
      const maxDelta = diff > 0 ? (4.0 - gps[idx]) * credits[idx] : (2.0 - gps[idx]) * credits[idx];
      if (diff > 0 && maxDelta > 0) {
        const applyWeighted = Math.min(diff, maxDelta);
        gps[idx] = Math.round((gps[idx] + applyWeighted / credits[idx]) * 100) / 100;
        diff -= applyWeighted;
      } else if (diff < 0 && maxDelta < 0) {
        const applyWeighted = Math.max(diff, maxDelta);
        gps[idx] = Math.round((gps[idx] + applyWeighted / credits[idx]) * 100) / 100;
        diff -= applyWeighted;
      }
    }
  }

  // 6. Build updated SubjectGrade list with realistic marks matching each subject's gradePoint
  return subjects.map((sub, i) => {
    const gp = Math.round(gps[i] * 100) / 100;
    // Pick marks consistent with the gradePoint band
    const marks = getMarksForDiplomaGp(gp, rng);
    return {
      ...sub,
      gradePoint: gp,
      marks,
    };
  });
}

/**
 * Checks whether a Diploma student has unrealistically identical subject/year grade points
 * (while target CGPA is < 4.00) and repairs them while keeping exact finalGpa unchanged.
 */
export function normalizeDiplomaStudentGrades(student: Student): { student: Student; changed: boolean } {
  if (student.category !== Category.DIPLOMA || !student.subjects || student.subjects.length < 4) {
    return { student, changed: false };
  }

  const calculatedGpa = calculateDiplomaGpa(student.subjects);
  const targetGpa =
    typeof student.finalGpa === "number" && student.finalGpa >= 2.0 && student.finalGpa < 4.0
      ? Math.round(student.finalGpa * 100) / 100
      : calculatedGpa >= 2.0 && calculatedGpa < 4.0
      ? calculatedGpa
      : 0;

  if (targetGpa < 2.0 || targetGpa >= 4.0) {
    return { student, changed: false };
  }

  const distinctGps = new Set(student.subjects.map((s) => Math.round((s.gradePoint || 0) * 100) / 100));
  const allSubjectsSame = distinctGps.size <= 1;

  // Check if all years have identical GPAs or every multi-subject year is uniform
  let allYearsUniformOrIdentical = false;
  const years = Array.from(new Set(student.subjects.map((s) => s.year).filter(Boolean))) as string[];
  if (years.length >= 2) {
    const yearAverages = years.map((yr) => {
      const subs = student.subjects.filter((s) => s.year === yr);
      const totalCr = subs.reduce((sum, s) => sum + (s.credit && s.credit > 0 ? s.credit : 1), 0);
      const wSum = subs.reduce((sum, s) => sum + (s.gradePoint || 0) * (s.credit && s.credit > 0 ? s.credit : 1), 0);
      return totalCr > 0 ? Math.round((wSum / totalCr) * 100) / 100 : 0;
    });
    const everyYearIdenticalAvg = new Set(yearAverages).size <= 1;
    const everyYearInternallyUniform = years.every((yr) => {
      const subs = student.subjects.filter((s) => s.year === yr);
      return new Set(subs.map((s) => Math.round((s.gradePoint || 0) * 100) / 100)).size <= 1;
    });
    allYearsUniformOrIdentical = everyYearIdenticalAvg || everyYearInternallyUniform;
  }

  if (!allSubjectsSame && !allYearsUniformOrIdentical) {
    return { student, changed: false };
  }

  const distributedSubjects = distributeDiplomaSubjectGrades(
    student.subjects,
    targetGpa,
    student.id || student.rollNumber || student.name
  );
  const newFinalGpa = calculateDiplomaGpa(distributedSubjects);
  const newTotalMarks = distributedSubjects.reduce((sum, s) => sum + (s.marks || 0), 0);

  return {
    changed: true,
    student: {
      ...student,
      subjects: distributedSubjects,
      finalGpa: newFinalGpa,
      totalMarks: newTotalMarks,
    },
  };
}
