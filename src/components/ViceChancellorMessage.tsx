import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Quote, 
  Award, 
  Calendar, 
  Landmark, 
  Search, 
  BookOpen 
} from "lucide-react";
import Logo from "./Logo";
import { LeadershipProfile } from "../types";
import { 
  getLocalProfiles, 
  fetchLeadershipProfiles, 
  subscribeLeadershipProfiles 
} from "../lib/leadershipService";

interface ViceChancellorMessageProps {
  onBackToHome: () => void;
  onNavigateToVerify: () => void;
  onNavigateToCourses: () => void;
}

export default function ViceChancellorMessage({
  onBackToHome,
  onNavigateToVerify,
  onNavigateToCourses
}: ViceChancellorMessageProps) {
  const [profiles, setProfiles] = useState<LeadershipProfile[]>(() => getLocalProfiles());

  useEffect(() => {
    fetchLeadershipProfiles().then((p) => setProfiles(p));
    const unsub = subscribeLeadershipProfiles((p) => setProfiles(p));
    return () => unsub();
  }, []);

  const publishedVc = profiles.find((p) => p.position === "Vice-Chancellor" && p.status === "Published");
  const isProfileReady = Boolean(publishedVc && publishedVc.status === "Published" && publishedVc.photoUrl && publishedVc.photoUrl.trim() !== "");

  return (
    <div className="min-h-screen bg-gray-50/60 py-10 no-print">
      <div className="max-w-4xl mx-auto px-4">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>হোমে ফিরে যান (Return to Home)</span>
          </button>

          <span className="text-[11px] font-semibold text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-2xs">
            অফিসিয়াল বার্তা • Office of the Vice-Chancellor
          </span>
        </div>

        {/* Main Document Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
        >
          {/* Top National Header Stripe */}
          <div className="w-full h-2 flex">
            <div className="w-[45%] bg-[#006a4e]" />
            <div className="w-[10%] bg-[#f42a41]" />
            <div className="w-[45%] bg-[#006a4e]" />
          </div>

          {/* Letterhead */}
          <div className="p-6 md:p-10 border-b border-gray-100 bg-radial from-emerald-50/40 to-white text-center">
            <div className="w-20 h-20 mx-auto mb-3">
              <Logo size={80} />
            </div>
            <span className="text-[11px] font-bold text-[#006a4e] uppercase tracking-widest block">
              গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-950 font-sans tracking-tight mt-1">
              বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউট (BNIE)
            </h1>
            <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">
              Bangladesh National Institute of Education • Divisional Academic Administration
            </p>
            <div className="inline-block bg-[#006a4e] text-white font-bold text-xs px-4 py-1 rounded-full uppercase tracking-wider mt-3 shadow-2xs">
              উপাচার্যের শুভেচ্ছা বার্তা • Vice-Chancellor's Welcome Message
            </div>
          </div>

          {/* Profile & Speech Body */}
          <div className="p-6 md:p-10 space-y-8">
            {/* VC Profile Card: Displayed ONLY when official profile with photo has been published by Administration */}
            {isProfileReady && publishedVc && (
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-5 bg-gray-50 rounded-xl border border-gray-200/80">
                <div className="flex flex-col items-center shrink-0">
                  <div className="relative">
                    <img
                      src={publishedVc.photoUrl}
                      alt={publishedVc.fullName || "উপাচার্য ও প্রধান একাডেমিক উপদেষ্টা"}
                      className="w-28 h-36 md:w-32 md:h-40 object-cover rounded-xl border-2 border-[#006a4e] shadow-sm bg-white"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-[#006a4e] text-white p-1 rounded-full shadow-xs">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="text-center sm:text-left space-y-1.5 flex-1">
                  <h3 className="text-lg md:text-xl font-black text-gray-900 font-sans">
                    {publishedVc.fullName}
                  </h3>
                  <p className="text-xs md:text-sm font-bold text-[#006a4e]">
                    {publishedVc.designation || "উপাচার্য ও প্রধান একাডেমিক উপদেষ্টা"}
                  </p>
                  <p className="text-xs text-gray-600 font-medium">
                    {publishedVc.departmentOrOffice || "বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউট (BNIE), ঢাকা, বাংলাদেশ"}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] text-gray-500">
                    <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2 py-0.5 rounded">
                      <Calendar className="w-3 h-3 text-[#006a4e]" /> শিক্ষাবর্ষ ২০২৪–২০২৫
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white border border-gray-200 px-2 py-0.5 rounded">
                      <Landmark className="w-3 h-3 text-[#006a4e]" /> স্বায়ত্তশাসিত জাতীয় পর্ষদ
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Message Body in Bengali */}
            <div className="prose prose-emerald max-w-none text-gray-800 space-y-4 font-sans text-sm md:text-base leading-relaxed">
              <div className="relative pl-6 border-l-4 border-[#006a4e] italic text-gray-700 font-medium py-1">
                <Quote className="w-6 h-6 text-[#006a4e]/20 absolute -left-3 -top-2" />
                "কারিগরি ও আধুনিক যুগোপযোগী শিক্ষাই একটি স্বনির্ভর ও মেধাভিত্তিক স্মার্ট বাংলাদেশের মূল চালিকাশক্তি।"
              </div>

              <p className="font-semibold text-gray-900">
                বিসমিল্লাহির রাহমানির রাহিম,
              </p>

              <p>
                বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউট (BNIE)-এর পক্ষ থেকে সকল নবীন ও অধ্যয়নরত শিক্ষার্থী, অভিভাবকবৃন্দ, সম্মানিত শিক্ষক-শিক্ষিকা এবং শুভানুধ্যায়ীদের আন্তরিক শুভেচ্ছা ও অভিনন্দন জানাচ্ছি।
              </p>

              <p>
                একুশ শতকের দ্রুত পরিবর্তনশীল কর্মবাজার এবং বৈশ্বিক চতুর্থ শিল্পবিপ্লবের (4IR) চ্যালেঞ্জ মোকাবেলায় আমাদের প্রচলিত শিক্ষাব্যবস্থাকে প্রায়োগিক, বৃত্তিমূলক ও প্রযুক্তিগত দক্ষতার সাথে সমন্বয় করা এখন সময়ের অন্যতম বড় দাবি। BNIE সেই অঙ্গীকার নিয়েই কাজ করে যাচ্ছে। আমাদের লক্ষ্য কেবল সনদ প্রদান নয়; বরং প্রতিটি শিক্ষার্থীকে সুনির্দিষ্ট কারিগরি দক্ষতায় পারদর্শী করে দেশ ও বিদেশের শিল্পখাতে নেতৃত্ব দেওয়ার যোগ্য করে গড়ে তোলা।
              </p>

              <p>
                ইনস্টিটিউটের অধীনে পরিচালিত <strong>৪ বছর মেয়াদী ডিপ্লোমা ইন ইঞ্জিনিয়ারিং</strong> (মেকানিক্যাল, ইলেকট্রনিক্স, ইলেকট্রিক্যাল, সিভিল ও কম্পিউটার), <strong>২ বছর মেয়াদী এসি অ্যান্ড মেইনটেন্যান্স</strong> এবং এসএসসি ও এইচএসসি সমমানের ভোকেশনাল ও সাধারণ কারিকুলাম জাতীয় ও আন্তর্জাতিক মানদণ্ডে প্রণীত। প্রতিটি বিভাগে আধুনিক ল্যাবরেটরি, ইন্ডাস্ট্রিয়াল ওয়ার্কশপ এবং প্রশিক্ষণপ্রাপ্ত অভিজ্ঞ শিক্ষকমণ্ডলীর মাধ্যমে শিক্ষার্থীদের হাতে-কলমে শিক্ষা দেওয়া হয়।
              </p>

              <p>
                ডিজিটাল বাংলাদেশের স্বপ্ন বাস্তবায়নে আমাদের সবচেয়ে গৌরবময় সংযোজন হচ্ছে <strong>সম্পূর্ণ অনলাইন ভিত্তিক ডিজিটাল সনদ ও মার্কশিট যাচাইকরণ পোর্টাল</strong>। যে কোনো নিয়োগকারী কর্তৃপক্ষ, সরকারি অধিদপ্তর কিংবা আন্তর্জাতিক দূতাবাস আমাদের সেন্ট্রালাইজড ডেটাবেজ ও ক্রিপ্টোগ্রাফিক QR কোডের মাধ্যমে মুহূর্তের মধ্যেই যে কোনো সনদ ও ট্রানস্ক্রিপ্টের সঠিকতা যাচাই করতে সক্ষম। এটি আমাদের স্বচ্ছতা, জবাবদিহিতা ও মেধার মূল্যায়নের এক অনন্য দৃষ্টান্ত।
              </p>

              <p>
                আমি দৃঢ়ভাবে বিশ্বাস করি, অধ্যবসায়, নৈতিকতা ও সঠিক কারিগরি প্রশিক্ষণের মাধ্যমে আমাদের শিক্ষার্থীরা জাতীয় অগ্রযাত্রায় অগ্রণী ভূমিকা রাখবে এবং বিশ্বমঞ্চে বাংলাদেশের সুনাম বৃদ্ধি করবে। সবার উজ্জ্বল ভবিষ্যৎ ও সুস্বাস্থ্য কামনা করছি।
              </p>
            </div>

            {/* Signature Block */}
            <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">তারিখ ও স্মারক নং</p>
                <p className="text-xs font-mono font-bold text-gray-700">BNIE/VC-OFFICE/DESK/2024-09</p>
              </div>

              <div className="text-center sm:text-right space-y-1">
                <div className="font-serif italic text-lg text-gray-800 tracking-wider">
                  {publishedVc?.fullName ? publishedVc.fullName.replace(/^প্রফেসর\s+ড\.\s+/, "") : "Prof. Rafiqul Islam"}
                </div>
                <div className="h-0.5 w-32 bg-gray-400 mx-auto sm:ml-auto my-1" />
                <p className="text-xs font-bold text-gray-900 font-sans">
                  ({publishedVc?.fullName || "প্রফেসর ড. মোঃ রফিকুল ইসলাম"})
                </p>
                <p className="text-[11px] text-gray-500 font-medium">
                  {publishedVc?.designation || "উপাচার্য ও প্রধান একাডেমিক উপদেষ্টা"}, BNIE
                </p>
              </div>
            </div>

            {/* Quick Action Footer inside VC Page */}
            <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onNavigateToVerify}
                className="inline-flex items-center space-x-2 bg-[#006a4e] hover:bg-[#00563f] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <Search className="w-4 h-4 text-emerald-200" />
                <span>পরীক্ষার ফলাফল ও সনদ যাচাই</span>
              </button>
              <button
                onClick={onNavigateToCourses}
                className="inline-flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>ডিপ্লোমা কোর্সসমূহ দেখুন</span>
              </button>
              <button
                onClick={onBackToHome}
                className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>মূল পাতায় যান</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
