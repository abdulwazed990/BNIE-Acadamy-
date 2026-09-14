import { Search, ShieldCheck, BookOpen, CheckCircle, Landmark } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  onVerifyClick: () => void;
  onCoursesClick?: () => void;
  onAccreditationClick?: () => void;
}

export default function Hero({ onVerifyClick, onCoursesClick, onAccreditationClick }: HeroProps) {
  return (
    <section className="bg-radial from-[#006a4e]/10 to-white py-16 md:py-24 border-b border-b-gray-100 no-print">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Animated Government Approved & Registry Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex flex-wrap items-center justify-center gap-2 bg-emerald-50 text-[#006a4e] border border-emerald-300/60 rounded-full px-4 py-1.5 mb-6 text-xs font-semibold uppercase tracking-wider shadow-2xs"
        >
          <span className="flex items-center space-x-1 font-bold text-emerald-800">
            <Landmark className="w-3.5 h-3.5 text-[#006a4e]" />
            <span>গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত</span>
          </span>
          <span className="text-gray-300 hidden sm:inline">•</span>
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#006a4e]" />
            <span>Govt. Approved &amp; Centralized Registry</span>
          </span>
        </motion.div>

        {/* Hero Title with Bilingual Branding */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-3xl md:text-5xl font-extrabold text-gray-950 font-sans tracking-tight leading-tight"
        >
          বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউট <br />
          <span className="text-2xl md:text-3xl font-bold text-gray-700 block mt-1">
            Bangladesh National Institute of Education (BNIE)
          </span>
          <span className="text-xl md:text-2xl font-bold text-[#006a4e] block mt-1">
            ডিজিটাল সনদ ও মার্কশিট যাচাইকরণ পোর্টাল
          </span>
        </motion.h2>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto mt-4 leading-relaxed font-normal"
        >
          গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত একটি স্বায়ত্তশাসিত জাতীয় শিক্ষা প্রতিষ্ঠান। এখানে এস.এস.সি, এইচ.এস.সি, ভোকেশনাল এবং ১ বছর থেকে ৪ বছর মেয়াদী পলিটেকনিক ডিপ্লোমা ইন ইঞ্জিনিয়ারিং সনদ ও মার্কশিটের অনলাইন যাচাইকরণ সুবিধা রয়েছে।
        </motion.p>

        {/* Trust Chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-4 text-[12px] text-gray-700 font-medium"
        >
          <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-gray-200 shadow-2xs">
            <CheckCircle className="w-3.5 h-3.5 text-[#006a4e]" />
            সরকারি ও বেসরকারি চাকরিতে প্রযোজ্য
          </span>
          <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-gray-200 shadow-2xs">
            <CheckCircle className="w-3.5 h-3.5 text-[#006a4e]" />
            আন্তর্জাতিক দূতাবাস ও WES সত্যায়ন উপযোগী
          </span>
          <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-gray-200 shadow-2xs">
            <CheckCircle className="w-3.5 h-3.5 text-[#006a4e]" />
            ক্রিপ্টোগ্রাফিক QR ভেরিফাইড
          </span>
        </motion.div>

        {/* Main Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <button
            onClick={onVerifyClick}
            className="w-full sm:w-auto group relative inline-flex items-center justify-center space-x-3 bg-[#006a4e] hover:bg-[#00563f] text-white font-bold text-base md:text-lg px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer border border-[#00563f]"
          >
            <Search className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
            <span>Verify Certificate (সনদ যাচাই)</span>
            <div className="absolute right-2 top-2 w-2 h-2 rounded-full bg-[#f42a41]" />
          </button>

          {onCoursesClick && (
            <button
              onClick={onCoursesClick}
              className="w-full sm:w-auto group inline-flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-gray-800 font-bold text-base px-6 py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer border border-gray-300"
            >
              <BookOpen className="w-5 h-5 text-emerald-700 group-hover:scale-110 transition-transform" />
              <span>Browse 45+ Diplomas</span>
            </button>
          )}

          {onAccreditationClick && (
            <button
              onClick={onAccreditationClick}
              className="w-full sm:w-auto group inline-flex items-center justify-center space-x-2 bg-emerald-50/80 hover:bg-emerald-100/70 text-[#006a4e] font-bold text-sm sm:text-base px-5 py-4 rounded-xl shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer border border-emerald-200"
            >
              <Landmark className="w-4 h-4 text-[#006a4e]" />
              <span>Govt. Approval Details</span>
            </button>
          )}
        </motion.div>

        {/* Quick Help Banner */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.5 }}
          className="text-[11px] text-gray-500 mt-4 font-normal"
        >
          * রোল এবং রেজিস্ট্রেশন নম্বর দিয়ে তাৎক্ষণিক অনলাইন ভেরিফিকেশন করুন | হেল্পলাইন: <span className="font-number digit-clear font-bold tracking-wider text-gray-700">+880 9658-417741</span>
        </motion.p>
      </div>
    </section>
  );
}
