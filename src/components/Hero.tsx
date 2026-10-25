import { motion } from "motion/react";
import QuickAccessSection from "./QuickAccessSection";
import { HomepageContentSettings } from "../types";

interface HeroProps {
  onOpenVcMessage?: () => void;
  onOpenResults?: () => void;
  onOpenDegreeResults?: () => void;
  onOpenComplaints?: () => void;
  onOpenFindProgram?: () => void;
  onOpenHandbooks?: () => void;
  onOpenAdmission?: () => void;
  onOpenOsaps?: () => void;
  onOpenEbook?: () => void;
  onOpenWebmail?: () => void;
  // Optional backward compatibility
  onVerifyClick?: () => void;
  onCoursesClick?: () => void;
  onAccreditationClick?: () => void;
  homepageSettings?: HomepageContentSettings;
}

export default function Hero({
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
  onVerifyClick,
  onCoursesClick,
  homepageSettings
}: HeroProps) {
  const titleBn = homepageSettings?.heroTitleBn || "বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউট";
  const titleEn = homepageSettings?.heroTitleEn || "Bangladesh National Institute of Education (BNIE)";
  const subtitleBn = homepageSettings?.heroSubtitleBn || "ডিজিটাল সনদ ও মার্কশিট যাচাইকরণ পোর্টাল";
  const subtitleEn = homepageSettings?.heroSubtitleEn || "গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত স্বায়ত্তশাসিত জাতীয় উচ্চশিক্ষা ও কারিগরি শিক্ষা ইনস্টিটিউট (BNIE)। এখানে ৪ বছর মেয়াদী স্নাতক (সম্মান/অনার্স), ৩ বছর মেয়াদী স্নাতক ডিগ্রি (পাস), স্নাতকোত্তর (মাস্টার্স), ১ থেকে ৪ বছর মেয়াদী ডিপ্লোমা ইন ইঞ্জিনিয়ারিং এবং এস.এস.সি ও এইচ.এস.সি এর প্রাতিষ্ঠানিক সনদ ও পূর্ণাঙ্গ সেমিস্টারভিত্তিক মার্কশিট অনলাইন যাচাইকরণের কেন্দ্রীয় সুবিধা রয়েছে।";



  return (
    <section className="bg-radial from-[#006a4e]/10 to-white pt-6 pb-14 md:pt-8 md:pb-20 border-b border-b-gray-200/80 no-print">
      <div className="max-w-6xl mx-auto px-4">



        {/* Centered Top Heading Block */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Title with Bilingual Branding */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold text-gray-950 font-sans tracking-tight leading-tight"
          >
            {titleBn} <br />
            <span className="text-2xl md:text-3xl font-bold text-gray-700 block mt-1">
              {titleEn}
            </span>
            {subtitleBn && (
              <span className="text-xl md:text-2xl font-bold text-[#006a4e] block mt-1">
                {subtitleBn}
              </span>
            )}
          </motion.h2>

          {/* Hero Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-gray-700 text-sm md:text-base max-w-3xl mx-auto mt-4 leading-relaxed font-normal"
          >
            {subtitleEn}
          </motion.p>
        </div>

        {/* Upper Level: Quick Access & Secondary Navigation Layout */}
        <div className="mt-8 sm:mt-10">
          <QuickAccessSection
            isEmbedded={true}
            settings={homepageSettings}
            onOpenVcMessage={onOpenVcMessage || (() => {})}
            onOpenResults={onOpenResults || onVerifyClick || (() => {})}
            onOpenDegreeResults={onOpenDegreeResults || (() => {})}
            onOpenComplaints={onOpenComplaints || (() => {})}
            onOpenFindProgram={onOpenFindProgram || onCoursesClick || (() => {})}
            onOpenHandbooks={onOpenHandbooks || (() => {})}
            onOpenAdmission={onOpenAdmission || (() => {})}
            onOpenOsaps={onOpenOsaps || (() => {})}
            onOpenEbook={onOpenEbook || (() => {})}
            onOpenWebmail={onOpenWebmail || (() => {})}
          />
        </div>
      </div>
    </section>
  );
}
