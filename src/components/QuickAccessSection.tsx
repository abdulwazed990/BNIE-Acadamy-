import { Mail, GraduationCap, MessagesSquare, Search, BookOpen, UserPlus, LogIn, Tablet, CheckCircle, ChevronRight, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { HomepageContentSettings } from "../types";

interface QuickAccessSectionProps {
  onOpenVcMessage: () => void;
  onOpenResults: () => void;
  onOpenDegreeResults?: () => void;
  onOpenComplaints: () => void;
  onOpenFindProgram: () => void;
  onOpenHandbooks: () => void;
  onOpenAdmission: () => void;
  onOpenOsaps: () => void;
  onOpenEbook: () => void;
  onOpenWebmail: () => void;
  isEmbedded?: boolean;
  settings?: HomepageContentSettings;
}

export default function QuickAccessSection({
  onOpenVcMessage,
  onOpenResults,
  onOpenDegreeResults,
  onOpenComplaints,
  onOpenFindProgram,
  onOpenHandbooks,
  onOpenAdmission,
  onOpenOsaps,
  onOpenEbook,
  onOpenWebmail,
  isEmbedded = false,
  settings
}: QuickAccessSectionProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-white rounded-2xl md:rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8 md:p-10 w-full text-left"
    >
          {/* SECTION 1: TOP QUICK ACCESS */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest text-center mb-5 md:mb-6 font-sans">
              QUICK ACCESS
            </h3>

            {/* Three Large Equal Containers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              
              {/* 1. উপাচার্যের শুভেচ্ছাপত্র */}
              {settings?.isVcMessageCardVisible !== false && (
                <button
                  type="button"
                  onClick={onOpenVcMessage}
                  className="w-full bg-white hover:bg-emerald-50/30 border border-gray-200 hover:border-[#006a4e] rounded-xl sm:rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-3.5 transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#006a4e]/20"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-[#006a4e] group-hover:scale-110 group-hover:bg-[#006a4e] group-hover:text-white transition-all duration-200">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#006a4e] font-sans block transition-colors">
                      উপাচার্যের শুভেচ্ছাপত্র
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium mt-0.5 block">
                      Vice-Chancellor's Welcome Message
                    </span>
                  </div>
                </button>
              )}

              {/* 2. পরীক্ষার ফলাফল ও মার্কশিট (Prestige Dual Action Card) */}
              {settings?.isResultsCardVisible !== false && (
                <div
                  className="w-full bg-white hover:border-[#006a4e]/70 border border-gray-200 hover:border-emerald-500/50 rounded-xl sm:rounded-2xl p-5 sm:p-6 flex flex-col justify-between text-center gap-3.5 transition-all duration-200 shadow-2xs hover:shadow-md relative overflow-hidden group focus-within:ring-2 focus-within:ring-[#006a4e]/20"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-[#006a4e] group-hover:scale-105 group-hover:bg-[#006a4e] group-hover:text-white transition-all duration-200 mb-1.5">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#006a4e] font-sans block transition-colors leading-snug">
                        পরীক্ষার ফলাফল ও মার্কশিট
                      </span>
                      <span className="text-[11px] text-gray-500 font-medium mt-0.5 block">
                        ডিজিটাল রেজাল্ট ভেরিফিকেশন সিস্টেম
                      </span>
                    </div>
                  </div>

                  {/* The 2 Enhanced Action Buttons */}
                  <div className="w-full flex flex-col gap-2.5">
                    {/* Button 1: Degree / Honours / Masters Marksheet */}
                    <button
                      type="button"
                      onClick={onOpenDegreeResults || onOpenResults}
                      className="w-full group/btn relative overflow-hidden bg-linear-to-r from-[#006a4e] to-[#00523c] hover:from-[#005a42] hover:to-[#004432] text-white rounded-xl p-2.5 sm:py-3 sm:px-3.5 transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer text-left border border-emerald-700/60 focus:outline-hidden focus:ring-2 focus:ring-[#006a4e]/40"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0 text-emerald-100 group-hover/btn:bg-white/25 transition-colors">
                            <GraduationCap className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <div className="text-xs sm:text-[13px] font-bold text-white tracking-tight">
                              Degree / Honours / Masters
                            </div>
                            <div className="text-[10px] text-emerald-100/90 font-medium truncate">
                              ফুল মার্কশিট যাচাই • CGPA ৪.০০
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-1 bg-white/20 px-2 py-1 rounded-md text-[10px] font-bold tracking-wider group-hover/btn:bg-white/30 transition-all text-white">
                          <span>যাচাই</span>
                          <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </button>

                    {/* Button 2: SSC / HSC / Diploma Verification */}
                    <button
                      type="button"
                      onClick={onOpenResults}
                      className="w-full group/btn relative overflow-hidden bg-white hover:bg-emerald-50/70 text-gray-900 rounded-xl p-2.5 sm:py-3 sm:px-3.5 transition-all duration-200 border border-gray-200 hover:border-emerald-300/80 shadow-2xs hover:shadow-xs cursor-pointer text-left focus:outline-hidden focus:ring-2 focus:ring-[#006a4e]/30"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/90 flex items-center justify-center shrink-0 text-[#006a4e] group-hover/btn:border-[#006a4e] transition-colors">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <div className="text-xs sm:text-[13px] font-bold text-gray-900 group-hover/btn:text-[#006a4e] tracking-tight transition-colors">
                              SSC / HSC / Diploma
                            </div>
                            <div className="text-[10px] text-gray-500 font-medium truncate">
                              সনদ ও নম্বরপত্র যাচাই • GPA ৫.০০
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-1 bg-gray-100 border border-gray-200/90 text-gray-700 group-hover/btn:text-[#006a4e] group-hover/btn:border-emerald-300 px-2 py-1 rounded-md text-[10px] font-bold tracking-wider transition-all">
                          <span>যাচাই</span>
                          <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* 3. অভিযোগ ও সেবা */}
              {settings?.isComplaintsCardVisible !== false && (
                <button
                  type="button"
                  onClick={onOpenComplaints}
                  className="w-full bg-white hover:bg-emerald-50/30 border border-gray-200 hover:border-[#006a4e] rounded-xl sm:rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-3.5 transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#006a4e]/20"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-[#006a4e] group-hover:scale-110 group-hover:bg-[#006a4e] group-hover:text-white transition-all duration-200">
                    <MessagesSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#006a4e] font-sans block transition-colors">
                      অভিযোগ ও সেবা
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium mt-0.5 block">
                      Complaints, GRS &amp; Student Services
                    </span>
                  </div>
                </button>
              )}

            </div>
          </div>

          {/* Clean Horizontal Divider Separator */}
          <div className="border-t border-gray-200 my-6 sm:my-8" />

          {/* SECTION 2: SECONDARY NAVIGATION BAR */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest text-center mb-5 md:mb-6 font-sans">
              SECONDARY NAVIGATION
            </h3>

            {/* Exactly 6 items in requested order, arranged in a single row on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              
              {/* 1. Find Program */}
              {settings?.isFindProgramCardVisible !== false && (
                <button
                  type="button"
                  onClick={onOpenFindProgram}
                  className="w-full bg-gray-50/90 hover:bg-white border border-gray-200/90 hover:border-[#006a4e]/50 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center gap-2.5 transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#006a4e]/20"
                >
                  <div className="w-9 h-9 rounded-lg bg-white border border-gray-200/70 flex items-center justify-center text-gray-700 group-hover:text-[#006a4e] group-hover:border-[#006a4e]/30 group-hover:scale-105 transition-all">
                    <Search className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-800 group-hover:text-[#006a4e] transition-colors leading-tight">
                    Find Program
                  </span>
                </button>
              )}

              {/* 2. Student Handbooks */}
              {settings?.isHandbooksCardVisible !== false && (
                <button
                  type="button"
                  onClick={onOpenHandbooks}
                  className="w-full bg-gray-50/90 hover:bg-white border border-gray-200/90 hover:border-[#006a4e]/50 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center gap-2.5 transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#006a4e]/20"
                >
                  <div className="w-9 h-9 rounded-lg bg-white border border-gray-200/70 flex items-center justify-center text-gray-700 group-hover:text-[#006a4e] group-hover:border-[#006a4e]/30 group-hover:scale-105 transition-all">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-800 group-hover:text-[#006a4e] transition-colors leading-tight">
                    Student Handbooks
                  </span>
                </button>
              )}

              {/* 3. Online Admission */}
              {settings?.isAdmissionCardVisible !== false && (
                <button
                  type="button"
                  onClick={onOpenAdmission}
                  className="w-full bg-gray-50/90 hover:bg-white border border-gray-200/90 hover:border-[#006a4e]/50 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center gap-2.5 transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#006a4e]/20"
                >
                  <div className="w-9 h-9 rounded-lg bg-white border border-gray-200/70 flex items-center justify-center text-gray-700 group-hover:text-[#006a4e] group-hover:border-[#006a4e]/30 group-hover:scale-105 transition-all">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-800 group-hover:text-[#006a4e] transition-colors leading-tight">
                    Online Admission
                  </span>
                </button>
              )}

              {/* 4. OSAPS Login */}
              {settings?.isOsapsCardVisible !== false && (
                <button
                  type="button"
                  onClick={onOpenOsaps}
                  className="w-full bg-gray-50/90 hover:bg-white border border-gray-200/90 hover:border-[#006a4e]/50 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center gap-2.5 transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#006a4e]/20"
                >
                  <div className="w-9 h-9 rounded-lg bg-white border border-gray-200/70 flex items-center justify-center text-gray-700 group-hover:text-[#006a4e] group-hover:border-[#006a4e]/30 group-hover:scale-105 transition-all">
                    <LogIn className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-800 group-hover:text-[#006a4e] transition-colors leading-tight">
                    OSAPS Login
                  </span>
                </button>
              )}

              {/* 5. Ebook */}
              {settings?.isEbookCardVisible !== false && (
                <button
                  type="button"
                  onClick={onOpenEbook}
                  className="w-full bg-gray-50/90 hover:bg-white border border-gray-200/90 hover:border-[#006a4e]/50 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center gap-2.5 transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#006a4e]/20"
                >
                  <div className="w-9 h-9 rounded-lg bg-white border border-gray-200/70 flex items-center justify-center text-gray-700 group-hover:text-[#006a4e] group-hover:border-[#006a4e]/30 group-hover:scale-105 transition-all">
                    <Tablet className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-800 group-hover:text-[#006a4e] transition-colors leading-tight">
                    Ebook
                  </span>
                </button>
              )}

              {/* 6. Web Email */}
              {settings?.isWebmailCardVisible !== false && (
                <button
                  type="button"
                  onClick={onOpenWebmail}
                  className="w-full bg-gray-50/90 hover:bg-white border border-gray-200/90 hover:border-[#006a4e]/50 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center gap-2.5 transition-all duration-150 shadow-2xs hover:shadow-xs cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#006a4e]/20"
                >
                  <div className="w-9 h-9 rounded-lg bg-white border border-gray-200/70 flex items-center justify-center text-gray-700 group-hover:text-[#006a4e] group-hover:border-[#006a4e]/30 group-hover:scale-105 transition-all">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-gray-800 group-hover:text-[#006a4e] transition-colors leading-tight">
                    Web Email
                  </span>
                </button>
              )}

            </div>
          </div>
    </motion.div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <section className="py-8 sm:py-10 bg-gray-50/60 border-b border-gray-200 no-print" aria-label="Quick Access and Secondary Navigation">
      <div className="max-w-6xl mx-auto px-4">
        {content}
      </div>
    </section>
  );
}
