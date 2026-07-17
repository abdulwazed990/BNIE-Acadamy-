import React, { useEffect, useState } from "react";
import { Student, getLetterGrade } from "../types";
import { ArrowLeft, Printer, Award, Calendar, Clock, CheckCircle2, FileDown } from "lucide-react";
import { motion } from "motion/react";
import { QRCodeCanvas } from "qrcode.react";
import Logo from "./Logo";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

// Helper to convert oklch CSS color values to standard rgb/rgba to prevent html2canvas parsing crashes in Tailwind v4
function oklchToRgba(oklchStr: string): string {
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

  let C = parseFloat(cStr);

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

// Intercept window.getComputedStyle to translate oklch to rgb during html2canvas render
const patchGetComputedStyle = () => {
  const originalGetComputedStyle = window.getComputedStyle;
  
  window.getComputedStyle = function (elt: Element, pseudoElt?: string | null) {
    const style = originalGetComputedStyle(elt, pseudoElt);
    
    return new Proxy(style, {
      get(target, prop) {
        if (prop === "getPropertyValue") {
          return function(propertyName: string) {
            const val = target.getPropertyValue(propertyName);
            if (typeof val === "string" && val.includes("oklch")) {
              return val.replace(/oklch\s*\([^)]+\)/gi, (match) => {
                try {
                  return oklchToRgba(match);
                } catch (e) {
                  return "rgb(0, 0, 0)";
                }
              });
            }
            return val;
          }.bind(target);
        }
        
        const val = Reflect.get(target, prop);
        if (typeof val === "string" && val.includes("oklch")) {
          return val.replace(/oklch\s*\([^)]+\)/gi, (match) => {
            try {
              return oklchToRgba(match);
            } catch (e) {
              return "rgb(0, 0, 0)";
            }
          });
        }
        
        if (typeof val === "function") {
          return val.bind(target);
        }
        return val;
      }
    });
  };

  return () => {
    window.getComputedStyle = originalGetComputedStyle;
  };
};

// Helper to ensure any SVG data URLs are converted to Base64 for iOS/Safari html2canvas compatibility
function getSafePhotoUrl(url: string): string {
  if (url.startsWith("data:image/svg+xml") && !url.includes(";base64,")) {
    try {
      const headerIndex = url.indexOf(",");
      if (headerIndex !== -1) {
        const svgContent = decodeURIComponent(url.substring(headerIndex + 1));
        const base64 = btoa(unescape(encodeURIComponent(svgContent)));
        return `data:image/svg+xml;base64,${base64}`;
      }
    } catch (e) {
      console.error("Error converting SVG data URL to Base64:", e);
    }
  }
  return url;
}

// Rewriter to force desktop-equivalent classes on cloned nodes to avoid mobile column collapse
function forceDesktopLayout(node: HTMLElement) {
  const elements = [node, ...Array.from(node.querySelectorAll("*"))];
  elements.forEach((el) => {
    const classList = el.className;
    if (typeof classList === "string") {
      let newClasses = classList;
      
      // Convert grid/flex layouts to force desktop specifications
      if (newClasses.includes("md:col-span-9")) {
        newClasses = newClasses.replace(/\bcol-span-12\b/g, "").replace(/\bmd:col-span-9\b/g, "col-span-9");
      }
      if (newClasses.includes("md:col-span-3")) {
        newClasses = newClasses.replace(/\bcol-span-12\b/g, "").replace(/\bmd:col-span-3\b/g, "col-span-3");
      }
      if (newClasses.includes("md:flex-col")) {
        newClasses = newClasses.replace(/\bflex-row\b/g, "").replace(/\bmd:flex-col\b/g, "flex-col");
      }
      if (newClasses.includes("md:block")) {
        newClasses = newClasses.replace(/\bhidden\b/g, "block").replace(/\bmd:block\b/g, "block");
      }
      if (newClasses.includes("md:hidden")) {
        newClasses = newClasses.replace(/\bblock\b/g, "hidden").replace(/\bmd:hidden\b/g, "hidden");
      }
      
      // Force table rendering classes from collapsed mobile blocks to proper rows/cells
      if (newClasses.includes("sm:table-row-group")) {
        newClasses = newClasses.replace(/\bflex\b/g, "").replace(/\bflex-col\b/g, "").replace(/\bsm:table-row-group\b/g, "table-row-group");
      }
      if (newClasses.includes("sm:table-row")) {
        newClasses = newClasses.replace(/\bflex\b/g, "").replace(/\bflex-col\b/g, "").replace(/\bsm:table-row\b/g, "table-row");
      }
      if (newClasses.includes("sm:w-[22%]")) {
        newClasses = newClasses.replace(/\bw-full\b/g, "").replace(/\bsm:w-\[22%\]\b/g, "w-[22%]");
      }
      if (newClasses.includes("sm:w-[28%]")) {
        newClasses = newClasses.replace(/\bw-full\b/g, "").replace(/\bsm:w-\[28%\]\b/g, "w-[28%]");
      }
      if (newClasses.includes("sm:w-auto")) {
        newClasses = newClasses.replace(/\bw-full\b/g, "").replace(/\bsm:w-auto\b/g, "w-auto");
      }
      if (newClasses.includes("sm:border")) {
        newClasses = newClasses.replace(/\bborder-b\b/g, "border").replace(/\bsm:border\b/g, "border");
      }
      if (newClasses.includes("sm:border-b-0")) {
        newClasses = newClasses.replace(/\bborder-b\b/g, "").replace(/\bsm:border-b-0\b/g, "");
      }
      
      // Align borders and paddings to matches full desktop proportions
      if (newClasses.includes("md:p-10")) {
        newClasses = newClasses.replace(/\bp-4\b/g, "p-10").replace(/\bsm:p-6\b/g, "p-10").replace(/\bmd:p-10\b/g, "p-10");
      }
      if (newClasses.includes("sm:border-[6px]")) {
        newClasses = newClasses.replace(/\bborder-\[4px\]\b/g, "border-[10px]").replace(/\bsm:border-\[6px\]\b/g, "border-[10px]").replace(/\bmd:border-\[10px\]\b/g, "border-[10px]");
      }
      
      el.className = newClasses;
    }
  });
}

interface VerificationReportProps {
  student: Student;
  onBack: () => void;
}

export default function VerificationReport({ student, onBack }: VerificationReportProps) {
  const [currentDateTime, setCurrentDateTime] = useState({ date: "", time: "" });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      // Format Date: DD MMM YYYY (e.g. 16 Jul 2026)
      const dateStr = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
      // Format Time: HH:MM:SS AM/PM
      const timeStr = now.toLocaleTimeString("en-US", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
      setCurrentDateTime({ date: dateStr, time: timeStr });
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Generate secure URL with encrypted identifier
  const verificationUrl = `${window.location.origin}${window.location.pathname}?token=${student.secureToken || student.id}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const reportElement = document.getElementById("a4-verification-report");
    if (!reportElement) {
      alert("Verification report element not found!");
      return;
    }

    setIsGeneratingPDF(true);
    const restoreGetComputedStyle = patchGetComputedStyle();

    // Create wrapper node to hold the clone off-screen but visible to layout rendering
    const wrapper = document.createElement("div");
    wrapper.className = "force-desktop-pdf";
    wrapper.style.position = "fixed";
    wrapper.style.top = "0";
    wrapper.style.left = "-9999px"; // Off-screen to avoid any screen flashes
    wrapper.style.width = "840px";
    wrapper.style.height = "auto";
    wrapper.style.overflow = "visible";
    wrapper.style.zIndex = "-9999";
    wrapper.style.pointerEvents = "none";

    // Inject temporary custom stylesheet to force desktop rules unconditionally on mobile viewports
    const styleEl = document.createElement("style");
    styleEl.id = "force-desktop-pdf-styles";
    styleEl.innerHTML = `
      .force-desktop-pdf #a4-verification-report {
        width: 840px !important;
        max-width: 840px !important;
        padding: 40px !important;
        border-width: 10px !important;
        border-style: double !important;
        border-color: #006a4e !important;
        border-radius: 1rem !important;
        box-shadow: none !important;
        background-color: #ffffff !important;
      }
      .force-desktop-pdf .print-card .text-center.border-b-2 {
        flex-direction: row !important;
        justify-content: space-between !important;
        align-items: center !important;
      }
      .force-desktop-pdf .print-card .text-center.border-b-2 .hidden.sm\\:block {
        display: block !important;
      }
      .force-desktop-pdf .print-card .text-center.border-b-2 .sm\\:hidden {
        display: none !important;
      }
      .force-desktop-pdf .grid.grid-cols-12 {
        display: grid !important;
        grid-template-columns: repeat(12, minmax(0, 1fr)) !important;
        align-items: stretch !important;
      }
      .force-desktop-pdf .col-span-12.md\\:col-span-9 {
        grid-column: span 9 / span 9 !important;
      }
      .force-desktop-pdf .col-span-12.md\\:col-span-3 {
        grid-column: span 3 / span 3 !important;
      }
      .force-desktop-pdf table {
        width: 100% !important;
        display: table !important;
        border-collapse: collapse !important;
      }
      .force-desktop-pdf tbody {
        display: table-row-group !important;
      }
      .force-desktop-pdf tr {
        display: table-row !important;
      }
      .force-desktop-pdf td {
        display: table-cell !important;
        border: 1px solid #d1d5db !important;
      }
      .force-desktop-pdf td.sm\\:w-\\[22\\%\\] {
        width: 22% !important;
      }
      .force-desktop-pdf td.sm\\:w-\\[28\\%\\] {
        width: 28% !important;
      }
      .force-desktop-pdf td.sm\\:w-auto {
        width: auto !important;
      }
      .force-desktop-pdf .flex-row.md\\:flex-col {
        flex-direction: column !important;
        justify-content: space-between !important;
        align-items: center !important;
        height: 100% !important;
      }
      .force-desktop-pdf .hidden.md\\:block {
        display: block !important;
      }
      .force-desktop-pdf .block.md\\:hidden {
        display: none !important;
      }
      .force-desktop-pdf .overflow-x-auto {
        overflow-x: visible !important;
      }
      .force-desktop-pdf .min-w-\\[600px\\] {
        min-width: 0 !important;
      }
      .force-desktop-pdf .flex-col.sm\\:flex-row {
        flex-direction: row !important;
        justify-content: space-between !important;
        align-items: flex-end !important;
      }
      .force-desktop-pdf .text-center.sm\\:text-left {
        text-align: left !important;
      }
      .force-desktop-pdf .justify-center.sm\\:justify-start {
        justify-content: flex-start !important;
      }
      .force-desktop-pdf .w-full.sm\\:w-auto {
        width: auto !important;
      }
      .force-desktop-pdf .w-full.max-w-\\[260px\\].sm\\:w-64 {
        width: 16rem !important;
      }
      .force-desktop-pdf .sm\\:mt-10 {
        margin-top: 2.5rem !important;
      }
    `;
    document.head.appendChild(styleEl);

    try {
      // 1. Clone the report element
      const clone = reportElement.cloneNode(true) as HTMLDivElement;
      
      // 2. Set static design overrides for pixel-perfect standard portrait layout
      clone.style.width = "840px";
      clone.style.height = "auto";
      clone.style.margin = "0";
      clone.style.boxShadow = "none";
      clone.style.backgroundColor = "#ffffff";

      // 3. Force full desktop classes to replace responsive collapsed equivalents
      forceDesktopLayout(clone);
      
      // Append clone to off-screen wrapper and DOM
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      // 3.5 Copy Canvas pixel buffers. Since cloneNode does not duplicate canvas drawing buffers,
      // we must copy the QR code canvas' pixels from the original canvas to the cloned canvas manually.
      const originalCanvases = Array.from(reportElement.querySelectorAll("canvas"));
      const clonedCanvases = Array.from(clone.querySelectorAll("canvas"));
      originalCanvases.forEach((origCanvas, idx) => {
        const clonedCanvas = clonedCanvases[idx];
        if (clonedCanvas) {
          const ctx = clonedCanvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(origCanvas, 0, 0);
          }
        }
      });

      // Wait a moment for dynamic SVGs / QR canvas and style evaluations
      await new Promise((resolve) => setTimeout(resolve, 350));

      // Wait for all images in clone to load completely before capturing
      const images = Array.from(clone.querySelectorAll("img"));
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );

      // Render with 3.0 scale (ultra high-definition crisp output)
      const renderScale = 3.0;

      // 4. Render canvas from full-size desktop clone
      const canvas = await html2canvas(clone, {
        scale: renderScale, 
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // 5. Generate high-quality portrait PDF conforming exactly to A4 boundaries
      const imgData = canvas.toDataURL("image/jpeg", 1.0); // 100% Quality
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 4; // Minimal margin to maximize card size on A4 sheet (matching user image)

      const printableWidth = pdfWidth - (margin * 2); // 202mm
      const printableHeight = pdfHeight - (margin * 2); // 289mm
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const contentRatio = canvasHeight / canvasWidth;

      let finalImgWidth = printableWidth;
      let finalImgHeight = printableWidth * contentRatio;
      let xOffset = margin;
      let yOffset = margin;

      if (finalImgHeight > printableHeight) {
        // Shrink width slightly to maintain exact height constraints within margins limits
        finalImgHeight = printableHeight;
        finalImgWidth = printableHeight / contentRatio;
        xOffset = margin + (printableWidth - finalImgWidth) / 2;
      } else {
        // Perfectly center vertically inside the margins printable area
        yOffset = margin + (printableHeight - finalImgHeight) / 2;
      }

      pdf.addImage(imgData, "JPEG", xOffset, yOffset, finalImgWidth, finalImgHeight);

      // Save using compliant format: StudentName_BNIE_Verification_Report.pdf
      const sanitizedName = student.name.trim().replace(/\s+/g, "_");
      const filename = `${sanitizedName}_BNIE_Verification_Report.pdf`;
      pdf.save(filename);

    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("An error occurred during PDF generation. Please use the Print feature as a workaround.");
    } finally {
      // Clean up DOM wrapper & custom style tag
      if (wrapper.parentNode) {
        document.body.removeChild(wrapper);
      }
      const injectedStyle = document.getElementById("force-desktop-pdf-styles");
      if (injectedStyle) {
        injectedStyle.parentNode?.removeChild(injectedStyle);
      }
      restoreGetComputedStyle();
      setIsGeneratingPDF(false);
    }
  };


  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back & Print Row (Hidden in Print) */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-bold text-gray-600 hover:text-[#006a4e] bg-white border border-gray-200 px-4 py-2.5 rounded-xl transition-all shadow-2xs hover:shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Verification Console</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="inline-flex items-center space-x-2 text-xs font-bold text-white bg-[#f42a41] hover:bg-[#d11d31] px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer border border-[#f42a41] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPDF ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>Download PDF Report</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center space-x-2 text-xs font-bold text-white bg-[#006a4e] hover:bg-[#00563f] px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer border border-[#00563f]"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report (A4)</span>
          </button>
        </div>
      </div>



      {/* Official A4 Certificate Verification Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white border-[4px] sm:border-[6px] md:border-[10px] border-double border-[#006a4e] p-4 sm:p-6 md:p-10 rounded-2xl shadow-xl relative overflow-hidden print-card max-w-[840px] mx-auto flex flex-col justify-between text-left"
        id="a4-verification-report"
      >
        {/* Government Watermark background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <svg className="w-[450px] h-[450px]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#006a4e" strokeWidth="1.5" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="#f42a41" strokeWidth="1.5" />
            <text x="50" y="48" fill="#006a4e" fontSize="5" fontWeight="black" textAnchor="middle">
              BNIE VERIFIED
            </text>
            <text x="50" y="54" fill="#f42a41" fontSize="3.5" fontWeight="bold" textAnchor="middle">
              OFFICIAL LEGER REGISTRY
            </text>
          </svg>
        </div>

        {/* Certificate Frame/Header */}
        <div className="text-center border-b-2 border-gray-300 pb-4 mb-6 relative flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
            <Logo size={60} className="object-contain sm:hidden" />
            <Logo size={76} className="object-contain hidden sm:block" />
          </div>
          <div className="flex-1 text-center px-1 sm:px-4">
            <span className="text-[9px] sm:text-[10px] text-gray-500 font-extrabold uppercase tracking-widest block leading-none mb-1">
              People's Republic of Bangladesh
            </span>
            <h2 className="text-base sm:text-lg md:text-2xl font-black text-gray-950 font-sans tracking-tight uppercase leading-snug">
              Bangladesh National Institute of Education
            </h2>
            <p className="text-[9px] sm:text-[10px] text-[#006a4e] font-black tracking-widest mt-1 uppercase">
              BNIE Divisional Academic Ledger Registry
            </p>
            <div className="inline-block bg-[#f42a41] text-white font-extrabold text-[9px] sm:text-[10px] px-3.5 py-0.5 rounded-full uppercase tracking-wider mt-2.5 shadow-xs">
              Certificate Verification Report
            </div>
          </div>
          <div className="hidden sm:flex w-20 h-20 items-center justify-center shrink-0 opacity-0 select-none pointer-events-none">
            <Logo size={76} />
          </div>
        </div>

        {/* Candidate Profile and QR Column Layout */}
        <div className="grid grid-cols-12 gap-4 md:gap-6 mb-6 items-stretch relative">
          
          {/* Left Column: Responsive Column Table */}
          <div className="col-span-12 md:col-span-9 space-y-3">
            <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest border-l-4 border-[#006a4e] pl-2 mb-2">
              Candidate Academic Profile
            </h4>
            
            <table className="w-full border-collapse border border-gray-300 text-xs">
              <tbody className="flex flex-col sm:table-row-group">
                <tr className="flex flex-col sm:table-row border-b sm:border-b-0 border-gray-200">
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-bold text-gray-500 bg-gray-50/70 w-full sm:w-[22%]">Student Name</td>
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-extrabold text-gray-950 text-xs sm:text-[13px] uppercase w-full sm:w-auto" colSpan={3}>{student.name}</td>
                </tr>
                <tr className="flex flex-col sm:table-row border-b sm:border-b-0 border-gray-200">
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-bold text-gray-500 bg-gray-50/70 w-full sm:w-[22%]">Father's Name</td>
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-bold text-gray-800 w-full sm:w-auto" colSpan={3}>{student.fatherName}</td>
                </tr>
                <tr className="flex flex-col sm:table-row border-b sm:border-b-0 border-gray-200">
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-bold text-gray-500 bg-gray-50/70 w-full sm:w-[22%]">Mother's Name</td>
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-bold text-gray-800 w-full sm:w-auto" colSpan={3}>{student.motherName}</td>
                </tr>
                <tr className="flex flex-col sm:table-row border-b sm:border-b-0 border-gray-200">
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-bold text-gray-500 bg-gray-50/70 w-full sm:w-[22%]">Date of Birth</td>
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-bold text-gray-800 w-full sm:w-[28%]">
                    {new Date(student.dob).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric"
                    })}
                  </td>
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-bold text-gray-500 bg-gray-50/70 w-full sm:w-[22%]">Session</td>
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-bold text-gray-800 font-mono w-full sm:w-[28%]">{student.session}</td>
                </tr>
                <tr className="flex flex-col sm:table-row border-b sm:border-b-0 border-gray-200">
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-bold text-gray-500 bg-gray-50/70 w-full sm:w-[22%]">Program / Course</td>
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-extrabold text-[#006a4e] w-full sm:w-[28%]">
                    {student.category === "Diploma" ? "Diploma in Engineering" : `${student.category} Program`}
                  </td>
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-bold text-gray-500 bg-gray-50/70 w-full sm:w-[22%]">Group / Dept</td>
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-extrabold text-gray-900 w-full sm:w-[28%]">{student.group}</td>
                </tr>
                <tr className="flex flex-col sm:table-row border-b sm:border-b-0 border-gray-200">
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-bold text-gray-500 bg-gray-50/70 w-full sm:w-[22%]">Roll Number</td>
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-black text-[#006a4e] font-mono text-xs sm:text-[13px] w-full sm:w-[28%]">{student.rollNumber}</td>
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-bold text-gray-500 bg-gray-50/70 w-full sm:w-[22%]">Registration No</td>
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-bold text-gray-900 font-mono w-full sm:w-[28%]">{student.registrationNumber}</td>
                </tr>
                <tr className="flex flex-col sm:table-row border-b sm:border-b-0 border-gray-200">
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-bold text-gray-500 bg-gray-50/70 w-full sm:w-[22%]">Certificate No</td>
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-bold text-gray-800 font-mono text-[10px] sm:text-[11px] w-full sm:w-[28%]">{student.certificateSerialNumber}</td>
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-bold text-gray-500 bg-gray-50/70 w-full sm:w-[22%]">Passing Year</td>
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-bold text-gray-800 font-mono w-full sm:w-[28%]">{student.passingYear}</td>
                </tr>
                <tr className="flex flex-col sm:table-row border-b sm:border-b-0 border-gray-200">
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-bold text-gray-500 bg-gray-50/70 w-full sm:w-[22%]">Examination Year</td>
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-bold text-gray-800 font-mono w-full sm:w-[28%]">{student.passingYear}</td>
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-bold text-gray-500 bg-gray-50/70 w-full sm:w-[22%]">GPA / CGPA</td>
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-black text-[#006a4e] text-xs sm:text-sm font-mono w-full sm:w-[28%]">{student.finalGpa.toFixed(2)}</td>
                </tr>
                <tr className="flex flex-col sm:table-row">
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-bold text-gray-500 bg-gray-50/70 w-full sm:w-[22%]">Result Status</td>
                  <td className="border-b sm:border border-gray-300 px-3 py-1.5 font-extrabold text-emerald-800 bg-emerald-50 w-full sm:w-auto" colSpan={3}>
                    {student.finalGpa > 0.00 ? "PASSED" : "FAILED"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Right Column: Photo and QR Code side-by-side on mobile, stacked on desktop */}
          <div className="col-span-12 md:col-span-3 flex flex-row md:flex-col justify-around md:justify-between items-center border border-gray-300 rounded-lg p-3 bg-gray-50/50 gap-4">
            {/* Student Passport Photo */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-24 h-28 border border-gray-300 bg-white rounded-md overflow-hidden relative shadow-sm shrink-0">
                <img
                  src={getSafePhotoUrl(student.photoUrl)}
                  alt={student.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[7px] font-mono py-0.5 text-center tracking-widest uppercase">
                  SECURED PHOTO
                </div>
              </div>
            </div>
            
            <div className="hidden md:block border-t border-gray-200 w-full my-3"></div>
            <div className="block md:hidden border-l border-gray-200 h-20 my-auto"></div>

            {/* QR Code */}
            <div className="flex flex-col items-center shrink-0">
              <div className="bg-white p-1.5 border border-gray-200 rounded-lg shadow-2xs">
                <QRCodeCanvas
                  value={verificationUrl}
                  size={150}
                  style={{ width: "76px", height: "76px" }}
                  bgColor={"#ffffff"}
                  fgColor={"#006a4e"}
                  level={"H"}
                  includeMargin={false}
                />
              </div>
              <span className="text-[7px] text-gray-400 font-mono mt-1 uppercase tracking-wider block text-center font-bold">
                Scan to Verify
              </span>
            </div>
          </div>

        </div>

        {/* Detailed Subject Transcript Grade Sheet */}
        <div className="space-y-2 mb-6">
          <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest border-l-4 border-[#006a4e] pl-2 mb-2">
            Subject-wise Grade Transcript
          </h4>

          <div className="border border-gray-300 rounded-lg overflow-x-auto shadow-2xs">
            <table className="w-full min-w-[600px] sm:min-w-0 text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-1.5 px-3 w-28 text-center border-r border-gray-200">Subject Code</th>
                  <th className="py-1.5 px-3 border-r border-gray-200">Subject Name</th>
                  <th className="py-1.5 px-3 text-center w-24 border-r border-gray-200">Marks</th>
                  <th className="py-1.5 px-3 text-center w-32 border-r border-gray-200">Grade Point (GP)</th>
                  <th className="py-1.5 px-3 text-center w-28">Letter Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {student.subjects.map((sub, idx) => {
                  const subCode = sub.subjectCode || "—";
                  const subMarks = sub.marks !== undefined ? sub.marks : "—";
                  return (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-2 px-3 text-center font-mono font-semibold text-gray-600 border-r border-gray-200 print-compact-py">{subCode}</td>
                      <td className="py-2 px-3 font-bold text-gray-800 border-r border-gray-200 print-compact-py">
                        {sub.subjectName}
                      </td>
                      <td className="py-2 px-3 text-center font-mono font-semibold text-gray-700 border-r border-gray-200 print-compact-py">{subMarks}</td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-gray-900 border-r border-gray-200 print-compact-py">
                        {sub.gradePoint.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-center print-compact-py">
                        <span className={`inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-sm ${
                          sub.gradePoint >= 5.0 ? "bg-emerald-100 text-emerald-800" :
                          sub.gradePoint >= 4.0 ? "bg-green-100 text-green-800" :
                          sub.gradePoint >= 3.5 ? "bg-blue-100 text-blue-800" :
                          sub.gradePoint >= 3.0 ? "bg-cyan-100 text-cyan-800" :
                          sub.gradePoint >= 2.0 ? "bg-amber-100 text-amber-800" :
                          sub.gradePoint >= 1.0 ? "bg-orange-100 text-orange-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {getLetterGrade(sub.gradePoint)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                
                {/* Result Summary Row */}
                <tr className="bg-emerald-50/30 font-bold border-t-2 border-emerald-600">
                  <td colSpan={2} className="py-2 px-3 text-xs text-[#006a4e] uppercase font-bold border-r border-gray-200">
                    Cumulative Grade Point Average (CGPA / GPA)
                  </td>
                  <td className="py-2 px-3 text-center font-mono text-xs text-gray-700 border-r border-gray-200">
                    {student.totalMarks !== undefined ? `${student.totalMarks} Total` : "—"}
                  </td>
                  <td className="py-2 px-3 text-center font-mono text-sm text-[#006a4e] font-black border-r border-gray-200">
                    {student.finalGpa.toFixed(2)}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span className="text-[10px] bg-[#006a4e] text-white font-bold px-3 py-0.5 rounded-full shadow-2xs">
                      {getLetterGrade(student.finalGpa)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Status Banner */}
        <div className="bg-emerald-50/60 border border-emerald-200 p-2.5 rounded-lg text-center flex items-center justify-center space-x-2 mb-6">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold text-emerald-900">
            This verification report is dynamically validated against the official BNIE divisional database records.
          </span>
        </div>

        {/* Footer block: Timestamp details and Blank Signature & Seal */}
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 pt-6 border-t border-gray-200 mt-auto">
          {/* Left Side: System Verification Timestamps */}
          <div className="space-y-1.5 text-xs text-gray-500 text-center sm:text-left w-full sm:w-auto">
            <div className="flex items-center justify-center sm:justify-start space-x-1.5 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#006a4e]" />
              <span>Verification Date: <span className="text-gray-800 font-bold">{currentDateTime.date}</span></span>
            </div>
            <div className="flex items-center justify-center sm:justify-start space-x-1.5 font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#f42a41]" />
              <span>Verification Time: <span className="text-gray-800 font-bold">{currentDateTime.time}</span></span>
            </div>
            <div className="text-[9px] text-gray-400 font-mono mt-2 block uppercase text-center sm:text-left">
              Fingerprint: BNIE_REGISTRY_{student.rollNumber}_{student.passingYear}
            </div>
          </div>

          {/* Right Side: Blank Signature and Seal Section */}
          <div className="flex flex-col items-center w-full sm:w-auto">
            {/* Blank line for signature and seal */}
            <div className="w-full max-w-[260px] sm:w-64 border-t-2 border-gray-400 border-dashed mb-2 mt-6 sm:mt-10"></div>
            <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">
              Authorized Signature &amp; Seal
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider text-center">
              Bangladesh National Institute of Education
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
