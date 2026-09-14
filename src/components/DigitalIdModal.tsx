import React, { useState, useRef } from "react";
import { Student } from "../types";
import { 
  X, 
  Download, 
  Printer, 
  QrCode, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  Sparkles,
  Layers
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import Logo from "./Logo";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface DigitalIdModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
}

export default function DigitalIdModal({ student, isOpen, onClose }: DigitalIdModalProps) {
  const [activeSide, setActiveSide] = useState<"both" | "front" | "back">("both");
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<"pdf" | "image" | null>(null);

  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Determine section fallback
  const studentSection = student.section && student.section.trim() !== "" ? student.section.trim() : "A";

  // Public/Authority QR verification URL:
  // Points to official certificate verification system using roll, reg, and section parameters
  const verificationUrl = `${window.location.origin}${window.location.pathname}?roll=${encodeURIComponent(
    student.rollNumber
  )}&reg=${encodeURIComponent(student.registrationNumber)}&section=${encodeURIComponent(
    studentSection
  )}&verify=id_card`;

  // Download high-resolution PNG image containing both Front & Back side-by-side
  const handleDownloadImage = async () => {
    const container = document.getElementById("printable-digital-id-container");
    if (!container) return;

    try {
      setIsExporting(true);
      setExportType("image");

      const canvas = await html2canvas(container, {
        scale: 3, // High DPI for crisp printing
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false
      });

      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      const safeName = student.name.trim().replace(/\s+/g, "_");
      link.download = `${safeName}_BNIE_Digital_ID_Card.png`;
      link.href = imgData;
      link.click();
    } catch (err) {
      console.error("Failed to generate Digital ID image:", err);
      alert("Could not export ID image. Please try printing directly or downloading as PDF.");
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  // Download high-resolution Print-Ready PDF
  const handleDownloadPDF = async () => {
    const container = document.getElementById("printable-digital-id-container");
    if (!container) return;

    try {
      setIsExporting(true);
      setExportType("pdf");

      const canvas = await html2canvas(container, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      // Landscape A4 or standard credit-card sizing. Let's create a clean A4 sheet with cutting marks or standalone card sheet
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Top title and instructions in PDF
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(0, 106, 78);
      pdf.text("BANGLADESH NATIONAL INSTITUTE OF EDUCATION (BNIE)", pageWidth / 2, 18, { align: "center" });
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Official Student Digital ID Card (Front & Back) — High Resolution Print Sheet", pageWidth / 2, 24, { align: "center" });

      const contentWidth = 180; // mm
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", (pageWidth - contentWidth) / 2, 34, contentWidth, contentHeight);

      // Footer note
      pdf.setFontSize(8);
      pdf.setTextColor(130, 130, 130);
      pdf.text("Cut along card borders. Standard CR80 ID Card dimensions (85.6mm × 53.98mm).", pageWidth / 2, 34 + contentHeight + 10, { align: "center" });
      pdf.text("Official verification link: " + verificationUrl, pageWidth / 2, 34 + contentHeight + 15, { align: "center" });

      const safeName = student.name.trim().replace(/\s+/g, "_");
      pdf.save(`${safeName}_BNIE_Digital_ID_Card.pdf`);
    } catch (err) {
      console.error("Failed to generate Digital ID PDF:", err);
      alert("Could not export ID PDF. Please try printing directly.");
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  // Browser Print trigger
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in no-print-backdrop">
      <div 
        id="digital-id-modal-card"
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Header Bar */}
        <div className="bg-linear-to-r from-[#006a4e] via-[#005a42] to-[#004d38] text-white px-5 py-4 flex items-center justify-between no-print">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/20">
              <UserCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white font-sans">
                  Official Student Digital ID Card
                </h3>
                <span className="text-[10px] bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Verified Genuine
                </span>
              </div>
              <p className="text-[11px] text-emerald-100 font-medium">
                Printable Front & Back Identity Card with Live Verification QR
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Toolbar: View Selector & Export Buttons */}
        <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3 no-print">
          {/* View Mode Selector */}
          <div className="inline-flex bg-gray-200/80 p-1 rounded-xl text-xs font-semibold text-gray-700">
            <button
              type="button"
              onClick={() => setActiveSide("both")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeSide === "both" ? "bg-white text-[#006a4e] font-black shadow-xs" : "hover:text-gray-950"
              }`}
            >
              Both Sides (Print Sheet)
            </button>
            <button
              type="button"
              onClick={() => setActiveSide("front")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeSide === "front" ? "bg-white text-[#006a4e] font-black shadow-xs" : "hover:text-gray-950"
              }`}
            >
              Front Side
            </button>
            <button
              type="button"
              onClick={() => setActiveSide("back")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeSide === "back" ? "bg-white text-[#006a4e] font-black shadow-xs" : "hover:text-gray-950"
              }`}
            >
              Back Side
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-[#006a4e] hover:bg-[#00563f] px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isExporting && exportType === "pdf" ? (
                <span>Generating PDF...</span>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-800 bg-white hover:bg-gray-100 border border-gray-300 px-3.5 py-2 rounded-xl shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isExporting && exportType === "image" ? (
                <span>Exporting PNG...</span>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5 text-gray-600" />
                  <span>Download Image (PNG)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-800 bg-white hover:bg-gray-100 border border-gray-300 px-3 py-2 rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-gray-600" />
              <span className="hidden sm:inline">Print ID</span>
            </button>
          </div>
        </div>

        {/* Modal Body: Scrollable ID Card Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-100/70">
          
          {/* Information Notice */}
          <div className="max-w-2xl mx-auto mb-5 bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-950 no-print">
            <ShieldCheck className="w-4 h-4 text-[#006a4e] shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Official Identity Verification Standard:</strong> This card features a dynamic verification QR code linked to the candidate's verified record. Scanning the QR code accesses the official verification desk verifying Roll, Registration, and Section without disclosing private examination records.
            </div>
          </div>

          {/* PRINTABLE DIGITAL ID CONTAINER (Captured for PDF/PNG/Print) */}
          <div 
            id="printable-digital-id-container" 
            className="max-w-3xl mx-auto bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center justify-center">

              {/* ========================================================
                  DIGITAL ID CARD — FRONT SIDE
                 ======================================================== */}
              {(activeSide === "both" || activeSide === "front") && (
                <div 
                  ref={frontRef}
                  id="digital-id-front"
                  className="w-full max-w-[340px] mx-auto aspect-[1.586/1] bg-white rounded-2xl border-2 border-emerald-900/20 shadow-md flex flex-col overflow-hidden relative select-none font-sans"
                  style={{ minHeight: "220px" }}
                >
                  {/* Subtle Background Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
                    <Logo size={180} />
                  </div>

                  {/* Top Header Banner */}
                  <div className="bg-[#006a4e] text-white px-3 py-2 flex items-center gap-2.5 border-b-2 border-[#f42a41] relative z-10 shrink-0">
                    <div className="bg-white p-0.5 rounded-full shrink-0 shadow-xs">
                      <Logo size={28} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-tight truncate leading-tight">
                        Bangladesh National Institute of Education
                      </h4>
                      <div className="flex items-center justify-between text-[7.5px] sm:text-[8px] text-emerald-100 uppercase tracking-widest font-semibold">
                        <span>Govt. Approved Institute</span>
                        <span className="text-amber-300 font-bold">Student ID</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Front Main Body */}
                  <div className="flex-1 p-3 flex gap-3 relative z-10">
                    
                    {/* Left Column: Student Photo + Roll / Reg Badges */}
                    <div className="w-[88px] sm:w-[96px] shrink-0 flex flex-col items-center">
                      <div className="w-[78px] h-[94px] sm:w-[84px] sm:h-[102px] rounded-lg overflow-hidden border-2 border-[#006a4e] shadow-2xs bg-gray-50 flex items-center justify-center">
                        <img
                          src={student.photoUrl}
                          alt={student.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      {/* Section Badge */}
                      <div className="mt-1.5 w-full bg-emerald-50 border border-emerald-200 rounded-md py-0.5 text-center">
                        <span className="text-[8px] uppercase font-bold text-gray-500 block leading-none">Section</span>
                        <span className="text-[11px] font-black text-[#006a4e] font-number digit-clear leading-tight">{studentSection}</span>
                      </div>
                    </div>

                    {/* Right Column: Student Credentials & QR */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      {/* Name & Program */}
                      <div>
                        <h5 className="text-xs sm:text-[13px] font-black text-gray-950 uppercase tracking-tight leading-tight line-clamp-2">
                          {student.name}
                        </h5>
                        <p className="text-[8.5px] sm:text-[9px] font-extrabold text-[#006a4e] tracking-tight uppercase mt-0.5">
                          {student.category === "Diploma" ? "Diploma in Engineering" : `${student.category} Program`}
                        </p>
                        <p className="text-[8px] sm:text-[8.5px] font-semibold text-gray-600 truncate">
                          Dept: {student.group}
                        </p>
                      </div>

                      {/* Credentials Matrix (Roll, Reg, Session) */}
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 bg-gray-50/90 border border-gray-200/90 p-1.5 rounded-lg text-[8.5px] sm:text-[9px]">
                        <div>
                          <span className="text-gray-400 font-semibold block uppercase text-[7px]">Roll No</span>
                          <span className="font-black text-gray-950 font-number digit-clear">{student.rollNumber}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-semibold block uppercase text-[7px]">Reg No</span>
                          <span className="font-black text-gray-950 font-number digit-clear">{student.registrationNumber}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-semibold block uppercase text-[7px]">Session</span>
                          <span className="font-bold text-gray-800 font-number digit-clear">{student.session}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 font-semibold block uppercase text-[7px]">Passing Year</span>
                          <span className="font-bold text-gray-800 font-number digit-clear">{student.passingYear}</span>
                        </div>
                      </div>

                      {/* Bottom Front Row: Small QR Code + Verification Badge */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center space-x-1.5">
                          <div className="p-0.5 bg-white border border-gray-300 rounded-sm shadow-2xs">
                            <QRCodeCanvas
                              value={verificationUrl}
                              size={30}
                              level="M"
                              includeMargin={false}
                            />
                          </div>
                          <div className="text-[6.5px] text-gray-500 font-medium leading-tight">
                            <span className="font-bold text-[#006a4e] block">SCAN TO VERIFY</span>
                            <span>Official Student Record</span>
                          </div>
                        </div>

                        {/* Authorized Seal Mark */}
                        <div className="text-right">
                          <span className="text-[7.5px] font-extrabold text-[#006a4e] border-b border-[#006a4e]/40 pb-0.5 block">
                            BNIE Controller
                          </span>
                          <span className="text-[6.5px] text-gray-400 uppercase font-semibold">Authority Seal</span>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Bottom Color Bar */}
                  <div className="h-1.5 bg-linear-to-r from-[#006a4e] via-[#f42a41] to-[#006a4e] shrink-0" />
                </div>
              )}


              {/* ========================================================
                  DIGITAL ID CARD — BACK SIDE
                 ======================================================== */}
              {(activeSide === "both" || activeSide === "back") && (
                <div 
                  ref={backRef}
                  id="digital-id-back"
                  className="w-full max-w-[340px] mx-auto aspect-[1.586/1] bg-white rounded-2xl border-2 border-emerald-900/20 shadow-md flex flex-col overflow-hidden relative select-none font-sans"
                  style={{ minHeight: "220px" }}
                >
                  {/* Subtle Background Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
                    <Logo size={180} />
                  </div>

                  {/* Back Top Header */}
                  <div className="bg-gray-900 text-white px-3 py-1.5 flex items-center justify-between border-b border-[#006a4e] shrink-0">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[9px] font-black uppercase tracking-wider">
                        Institutional Verification Portal
                      </span>
                    </div>
                    <span className="text-[7.5px] text-gray-400 font-mono tracking-wider font-semibold">
                      SEC-ID #{student.rollNumber}
                    </span>
                  </div>

                  {/* Back Card Main Content */}
                  <div className="flex-1 p-3 flex flex-col justify-between relative z-10 text-gray-800">
                    
                    {/* Verification Authority Statement */}
                    <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-2 text-center">
                      <p className="text-[8.5px] sm:text-[9px] font-black text-[#006a4e] uppercase tracking-tight leading-snug">
                        “This Digital ID can be verified through the official Certificate Verification System.”
                      </p>
                      <p className="text-[7px] sm:text-[7.5px] text-gray-600 mt-0.5 leading-tight">
                        Scan the QR code or visit the official portal to confirm authenticity, student credentials, and enrollment status.
                      </p>
                    </div>

                    {/* Middle: Prominent QR Code + Candidate Key Specs */}
                    <div className="flex items-center justify-between gap-3 my-1">
                      
                      {/* Left: Prominent Verification QR Code */}
                      <div className="flex flex-col items-center text-center">
                        <div className="p-1.5 bg-white border-2 border-[#006a4e] rounded-xl shadow-xs">
                          <QRCodeCanvas
                            value={verificationUrl}
                            size={56}
                            level="M"
                            includeMargin={false}
                          />
                        </div>
                        <span className="text-[7px] font-extrabold text-[#006a4e] uppercase mt-1 tracking-wider">
                          Official QR
                        </span>
                      </div>

                      {/* Right: Roll / Reg / Section Summary for quick employer inspection */}
                      <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2 text-[8px] sm:text-[8.5px] space-y-1">
                        <div className="flex justify-between border-b border-gray-200 pb-0.5">
                          <span className="text-gray-500 font-semibold">Roll Number:</span>
                          <span className="font-black text-gray-900 font-number digit-clear">{student.rollNumber}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-0.5">
                          <span className="text-gray-500 font-semibold">Reg Number:</span>
                          <span className="font-black text-gray-900 font-number digit-clear">{student.registrationNumber}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-0.5">
                          <span className="text-gray-500 font-semibold">Section:</span>
                          <span className="font-black text-[#006a4e] font-number digit-clear">{studentSection}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 font-semibold">Certificate:</span>
                          <span className="font-bold text-gray-800 font-number digit-clear text-[7.5px] truncate max-w-[110px]">{student.certificateSerialNumber}</span>
                        </div>
                      </div>

                    </div>

                    {/* Bottom: Instructions, Website & Signature line */}
                    <div className="pt-1 border-t border-gray-200 flex items-end justify-between text-[7px] text-gray-500">
                      <div>
                        <p className="font-bold text-gray-700">Official Verification Desk:</p>
                        <p className="text-[#006a4e] font-semibold truncate max-w-[180px]">
                          bnie.gov.bd / verification
                        </p>
                        <p className="text-[6.5px] text-gray-400">If found, please return to institute authority.</p>
                      </div>

                      {/* Authorized Signature Box */}
                      <div className="text-center w-24">
                        <div className="h-4 border-b border-dashed border-gray-400 mb-0.5 flex items-end justify-center">
                          <span className="text-[6px] text-emerald-800 font-mono italic">Verified Authorized</span>
                        </div>
                        <span className="text-[6.5px] font-bold text-gray-700 uppercase block leading-none">
                          Director of Exams
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Bottom Color Bar */}
                  <div className="h-1.5 bg-[#006a4e] shrink-0" />
                </div>
              )}

            </div>

            {/* Print Note Below Cards */}
            <div className="mt-4 pt-3 border-t border-gray-200 text-center text-gray-400 text-[10px] no-print">
              Standard CR80 Identity Card Spec (85.60 mm × 53.98 mm). Suitable for high-density PVC / paper card printing.
            </div>
          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="bg-white border-t border-gray-200 px-5 py-3 flex items-center justify-between no-print">
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#006a4e]" />
            <span>Digital ID dynamically bound to Student Record (Roll: <strong className="text-gray-900 font-mono">{student.rollNumber}</strong>, Reg: <strong className="text-gray-900 font-mono">{student.registrationNumber}</strong>)</span>
          </div>

          <button
            onClick={onClose}
            className="text-xs font-bold text-gray-700 hover:text-gray-950 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
