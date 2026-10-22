// Helper to convert oklch CSS color values to standard rgb/rgba to prevent html2canvas parsing crashes in Tailwind v4
export function oklchToRgba(oklchStr: string): string {
  const match = oklchStr.match(/oklch\s*\(([^)]+)\)/i);
  if (!match) return oklchStr;

  const parts = match[1].trim().split(/[\s,/]+/);
  if (parts.length < 3) return oklchStr;

  const lStr = parts[0];
  const cStr = parts[1];
  const hStr = parts[2];
  const aStr = parts[3] || "1";

  let L = 0;
  if (lStr.endsWith("%")) {
    L = parseFloat(lStr) / 100;
  } else {
    L = parseFloat(lStr);
  }

  const C = parseFloat(cStr);

  let H = 0;
  if (hStr) {
    if (hStr.endsWith("deg")) {
      H = parseFloat(hStr);
    } else if (hStr.endsWith("rad")) {
      H = parseFloat(hStr) * (180 / Math.PI);
    } else if (hStr.endsWith("turn")) {
      H = parseFloat(hStr) * 360;
    } else {
      H = parseFloat(hStr);
    }
  }

  let A = 1;
  if (aStr) {
    if (aStr.endsWith("%")) {
      A = parseFloat(aStr) / 100;
    } else {
      A = parseFloat(aStr);
    }
  }

  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  const gamma = (c: number) => {
    const clamped = Math.max(0, Math.min(1, c));
    return clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  };

  const R = Math.round(gamma(r) * 255);
  const G = Math.round(gamma(g) * 255);
  const B = Math.round(gamma(bl) * 255);

  if (A === 1) {
    return `rgb(${R}, ${G}, ${B})`;
  } else {
    return `rgba(${R}, ${G}, ${B}, ${A})`;
  }
}

// Helper to convert oklab CSS color values to standard rgb/rgba
export function oklabToRgba(oklabStr: string): string {
  const match = oklabStr.match(/oklab\s*\(([^)]+)\)/i);
  if (!match) return oklabStr;

  const parts = match[1].trim().split(/[\s,/]+/);
  if (parts.length < 3) return oklabStr;

  const lStr = parts[0];
  const aValStr = parts[1];
  const bValStr = parts[2];
  const alphaStr = parts[3] || "1";

  let L = 0;
  if (lStr.endsWith("%")) {
    L = parseFloat(lStr) / 100;
  } else {
    L = parseFloat(lStr);
  }

  const a = parseFloat(aValStr);
  const b = parseFloat(bValStr);

  let A = 1;
  if (alphaStr) {
    if (alphaStr.endsWith("%")) {
      A = parseFloat(alphaStr) / 100;
    } else {
      A = parseFloat(alphaStr);
    }
  }

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  const gamma = (c: number) => {
    const clamped = Math.max(0, Math.min(1, c));
    return clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  };

  const R = Math.round(gamma(r) * 255);
  const G = Math.round(gamma(g) * 255);
  const B = Math.round(gamma(bl) * 255);

  if (A === 1) {
    return `rgb(${R}, ${G}, ${B})`;
  } else {
    return `rgba(${R}, ${G}, ${B}, ${A})`;
  }
}

// Intercept window.getComputedStyle to translate oklch and oklab to rgb during html2canvas render
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const patchGetComputedStyle = (targetWindow: any) => {
  const originalGetComputedStyle = targetWindow.getComputedStyle;
  
  targetWindow.getComputedStyle = function (elt: Element, pseudoElt?: string | null) {
    const style = originalGetComputedStyle(elt, pseudoElt);
    
    return new Proxy(style, {
      get(target, prop) {
        if (prop === "getPropertyValue") {
          return function(propertyName: string) {
            let val = target.getPropertyValue(propertyName);
            if (typeof val === "string") {
              if (val.includes("oklch")) {
                val = val.replace(/oklch\s*\([^)]+\)/gi, (m: string) => {
                  try {
                    return oklchToRgba(m);
                  } catch {
                    return "rgb(0, 0, 0)";
                  }
                });
              }
              if (val.includes("oklab")) {
                val = val.replace(/oklab\s*\([^)]+\)/gi, (m: string) => {
                  try {
                    return oklabToRgba(m);
                  } catch {
                    return "rgb(0, 0, 0)";
                  }
                });
              }
            }
            return val;
          }.bind(target);
        }
        
        const val = Reflect.get(target, prop);
        if (typeof val === "string") {
          if (val.includes("oklch")) {
            return val.replace(/oklch\s*\([^)]+\)/gi, (m: string) => {
              try {
                return oklchToRgba(m);
              } catch {
                return "rgb(0, 0, 0)";
              }
            });
          }
          if (val.includes("oklab")) {
            return val.replace(/oklab\s*\([^)]+\)/gi, (m: string) => {
              try {
                return oklabToRgba(m);
              } catch {
                return "rgb(0, 0, 0)";
              }
            });
          }
        }
        
        if (typeof val === "function") {
          return val.bind(target);
        }
        return val;
      }
    });
  };

  return () => {
    targetWindow.getComputedStyle = originalGetComputedStyle;
  };
};
