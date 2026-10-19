import { ShieldCheck, CalendarRange, Landmark, HelpCircle, BadgeCheck, FileCheck2 } from "lucide-react";
import { motion } from "motion/react";

const SERVICES = [
  {
    title: "ডিগ্রি, অনার্স ও মাস্টার্স ফলাফল ও ট্রান্সক্রিপ্ট",
    icon: FileCheck2,
    desc: "৩ বছর মেয়াদী ডিগ্রি (পাস), ৪ বছর মেয়াদী অনার্স এবং স্নাতকোত্তর (মাস্টার্স) শিক্ষাক্রমের পূর্ণাঙ্গ সেমিস্টার মার্কশিট ও সনদ যাচাইকরণ।"
  },
  {
    title: "পলিটেকনিক ডিপ্লোমা ইন ইঞ্জিনিয়ারিং",
    icon: CalendarRange,
    desc: "১ থেকে ৪ বছর মেয়াদী পলিটেকনিক ডিপ্লোমা ইন ইঞ্জিনিয়ারিং ও ইন্ডাস্ট্রিয়াল ট্রেনিং এর প্রাতিষ্ঠানিক পাঠ্যক্রম ও অ্যাটাচমেন্ট।"
  },
  {
    title: "এসএসসি ও এইচএসসি ভোকেশনাল",
    icon: Landmark,
    desc: "বাংলাদেশ কারিগরি শিক্ষা বোর্ড সমমান কারিকুলামে বাস্তবমুখী দক্ষতাভিত্তিক মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা।"
  },
  {
    title: "অনলাইন সনদ ও রেকর্ড ভেরিফিকেশন",
    icon: ShieldCheck,
    desc: "কিউআর কোড (QR Code) ও কেন্দ্রীয় প্রাতিষ্ঠানিক ডেটাবেসের মাধ্যমে বিশ্বস্ত তাৎক্ষণিক সত্যতা যাচাই।"
  },
  {
    title: "শিক্ষার্থী সহায়তা ও হেল্পডেস্ক",
    icon: HelpCircle,
    desc: "একাডেমিক এডভাইজিং, ট্রান্সক্রিপ্ট ও নম্বরপত্র ইস্যু, তথ্য সংশোধন ও ওয়ান-স্টপ স্টুডেন্ট সাপোর্ট।"
  }
];

export default function MissionAndServices() {
  return (
    <section id="services-section" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Mission Column (Span 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-gradient-to-br from-[#006a4e]/5 via-white to-white p-8 rounded-2xl border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f42a41]/5 rounded-full blur-2xl -mr-10 -mt-10" />
            
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-1 bg-[#006a4e] text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full tracking-widest">
                Our Mandate
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 font-sans tracking-tight leading-tight">
                Our Mission &amp; National Commitment
              </h3>
              
              <p className="text-gray-650 text-base leading-relaxed font-medium text-gray-700 italic">
                "Bangladesh National Institute of Education is committed to providing reliable educational services, certificate verification and vocational skill development for students across the country."
              </p>
              
              <div className="h-0.5 bg-gray-200 w-full" />
              
              <p className="text-xs text-gray-500 leading-relaxed font-normal">
                By maintaining a highly secured, modern centralized credential ledger, we protect the hard work of genuine candidates and ensure that corporate and higher academic institutions have a trusted verification anchor.
              </p>
            </div>

            <div className="mt-8 flex items-center space-x-3 bg-white p-4 rounded-xl border border-gray-100 shadow-2xs">
              <div className="p-2 rounded-lg bg-[#006a4e]/10 text-[#006a4e]">
                <BadgeCheck className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900">Official Certification Hub</p>
                <p className="text-[11px] text-gray-400">Under the People's Republic of Bangladesh rules</p>
              </div>
            </div>
          </div>

          {/* Services Column (Span 7) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 font-sans tracking-tight">
                Key Educational &amp; Registry Services
              </h3>
              <p className="text-gray-400 text-xs mt-1">
                The official service desk at BNIE guarantees prompt digital processing of the following student service modules:
              </p>
            </div>

            <div className="space-y-4">
              {SERVICES.map((serv, idx) => {
                const IconComponent = serv.icon;
                return (
                  <motion.div
                    key={serv.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-150 transition-all group"
                  >
                    <div className="p-2.5 rounded-lg bg-gray-50 text-gray-600 group-hover:bg-[#006a4e]/10 group-hover:text-[#006a4e] transition-all">
                      <IconComponent className="w-5 h-5 stroke-[2]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm md:text-base group-hover:text-[#006a4e] transition-colors">
                        {serv.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-2xl font-normal">
                        {serv.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
