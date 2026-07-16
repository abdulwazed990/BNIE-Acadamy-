import { Search, ShieldCheck, BookOpen } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  onVerifyClick: () => void;
  onCoursesClick?: () => void;
}

export default function Hero({ onVerifyClick, onCoursesClick }: HeroProps) {
  return (
    <section className="bg-radial from-[#006a4e]/10 to-white py-16 md:py-24 border-b border-b-gray-100 no-print">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center space-x-2 bg-emerald-50 text-[#006a4e] border border-emerald-200/50 rounded-full px-4 py-1.5 mb-6 text-xs font-semibold uppercase tracking-wider shadow-2xs"
        >
          <ShieldCheck className="w-4 h-4 text-[#006a4e]" />
          <span>Centralized National Credentials Registry</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-3xl md:text-5xl font-extrabold text-gray-950 font-sans tracking-tight leading-tight"
        >
          Secured Digital Student <br />
          <span className="text-[#006a4e]">Verification Portal</span>
        </motion.h2>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto mt-4 leading-relaxed font-normal"
        >
          Enter the secure portal to instantly query, validate, and download authentic, certified academic transcripts and vocational records of SSC, HSC, and Diploma programs.
        </motion.p>

        {/* Main Verify Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onVerifyClick}
            className="w-full sm:w-auto group relative inline-flex items-center justify-center space-x-3 bg-[#006a4e] hover:bg-[#00563f] text-white font-bold text-base md:text-lg px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer border border-[#00563f]"
          >
            <Search className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
            <span>Verify Certificate</span>
            <div className="absolute right-2 top-2 w-2 h-2 rounded-full bg-[#f42a41]" />
          </button>

          {onCoursesClick && (
            <button
              onClick={onCoursesClick}
              className="w-full sm:w-auto group inline-flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 text-gray-800 font-bold text-base md:text-lg px-8 py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer border border-gray-300"
            >
              <BookOpen className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
              <span>Browse 45+ Diplomas</span>
            </button>
          )}
        </motion.div>

        {/* Quick Help Banner */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.5 }}
          className="text-[11px] text-gray-400 mt-4 font-normal"
        >
          * Recommended credentials: Keep Candidate Roll &amp; Registration Number ready before initiating verification.
        </motion.p>
      </div>
    </section>
  );
}
