import { ShieldCheck, Award, Landmark, CheckCircle2, FileText, Globe2, Building2, Scale, ExternalLink } from "lucide-react";

export default function GovernmentAccreditation() {
  return (
    <section id="government-accreditation" className="py-14 bg-gradient-to-b from-gray-50 via-emerald-50/20 to-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 bg-[#006a4e] text-white text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-widest shadow-xs mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-950 font-sans tracking-tight leading-tight">
            সরকারি অনুমোদন ও প্রাতিষ্ঠানিক স্বীকৃতি
          </h2>
          <p className="text-sm sm:text-base font-semibold text-[#006a4e] mt-1">
            Government Approval, Institutional Accreditation &amp; Legal Recognition
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
            <strong>বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউট</strong> (Bangladesh National Institute of Education — BNIE) গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত একটি স্বায়ত্তশাসিত জাতীয় শিক্ষা প্রতিষ্ঠান। এটি দেশব্যাপী এস.এস.সি, এইচ.এস.সি, ভোকেশনাল এবং ১ বছর থেকে ৪ বছর মেয়াদী পলিটেকনিক ডিপ্লোমা সনদ প্রদান ও অনলাইন ডিজিটাল ভেরিফিকেশন সেবা প্রদান করে।
          </p>
        </div>

        {/* 4 Pillars of Accreditation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {/* Card 1 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#006a4e]/10 text-[#006a4e] flex items-center justify-center mb-3.5">
              <Landmark className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#006a4e] bg-emerald-50 px-2 py-0.5 rounded">
              Approval Authority
            </span>
            <h3 className="text-sm font-bold text-gray-900 mt-2">
              গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
            </h3>
            <p className="text-xs font-semibold text-gray-600 mb-2">
              Govt. of the People's Republic of Bangladesh
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              বাংলাদেশ সরকারের জাতীয় শিক্ষা ও কারিগরি নীতিমালা অনুসারে অনুমোদিত ও নিবন্ধিত স্বায়ত্তশাসিত জাতীয় শিক্ষা প্রতিষ্ঠান।
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#006a4e]/10 text-[#006a4e] flex items-center justify-center mb-3.5">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#006a4e] bg-emerald-50 px-2 py-0.5 rounded">
              Academic Curricula
            </span>
            <h3 className="text-sm font-bold text-gray-900 mt-2">
              ১ থেকে ৪ বছর মেয়াদী ডিপ্লোমা
            </h3>
            <p className="text-xs font-semibold text-gray-600 mb-2">
              1-Year to 4-Year Diploma &amp; Vocational
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              সিভিল, ইলেকট্রিক্যাল, মেকানিক্যাল, কম্পিউটার, এসিএম সহ আধুনিক পলিটেকনিক ইঞ্জিনিয়ারিং ও টেকনিক্যাল কোর্স (Scale 4.00 &amp; Scale 5.00)।
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#006a4e]/10 text-[#006a4e] flex items-center justify-center mb-3.5">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#006a4e] bg-emerald-50 px-2 py-0.5 rounded">
              Employment Validity
            </span>
            <h3 className="text-sm font-bold text-gray-900 mt-2">
              চাকরি ও পদোন্নতিতে গ্রহণযোগ্য
            </h3>
            <p className="text-xs font-semibold text-gray-600 mb-2">
              National &amp; Overseas Job Recognition
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              সকল সরকারি, স্বায়ত্তশাসিত প্রতিষ্ঠান, বেসরকারি কর্পোরেট ও টেকনিক্যাল সেক্টরে সার্টিফিকেটের পূর্ণ গ্রহণযোগ্যতা ও বৈধতা।
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#006a4e]/10 text-[#006a4e] flex items-center justify-center mb-3.5">
              <Globe2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#006a4e] bg-emerald-50 px-2 py-0.5 rounded">
              Global Verification
            </span>
            <h3 className="text-sm font-bold text-gray-900 mt-2">
              আন্তর্জাতিক সত্যায়ন ও ভেরিফিকেশন
            </h3>
            <p className="text-xs font-semibold text-gray-600 mb-2">
              Embassy Attestation &amp; QR Validation
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              বিদেশগামী কর্মী ও শিক্ষার্থীদের জন্য দূতাবাস সত্যায়ন, WES ও আন্তর্জাতিক ভেরিফিকেশন সহায়ক ক্রিপ্টোগ্রাফিক কিউআর কোড ভেরিফিকেশন।
            </p>
          </div>
        </div>

        {/* Detailed Institutional Verification Statement Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#006a4e]" />
                <h4 className="text-lg sm:text-xl font-bold text-gray-900">
                  আইনি ও প্রাতিষ্ঠানিক পরিচিতি (Institutional Credentials)
                </h4>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-gray-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006a4e] shrink-0 mt-0.5" />
                  <span>
                    <strong>প্রাতিষ্ঠানিক নাম (বাংলা):</strong> বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউট
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006a4e] shrink-0 mt-0.5" />
                  <span>
                    <strong>Official Name (English):</strong> Bangladesh National Institute of Education (BNIE)
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006a4e] shrink-0 mt-0.5" />
                  <span>
                    <strong>অনুমোদন মর্যাদা:</strong> গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত জাতীয় স্বায়ত্তশাসিত শিক্ষা প্রতিষ্ঠান (Government Approved Autonomous National Educational Institute).
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006a4e] shrink-0 mt-0.5" />
                  <span>
                    <strong>কেন্দ্রীয় ডাটাবেজ ও সার্টিফিকেট যাচাই:</strong> রোল ও রেজিস্ট্রেশন নম্বর ব্যবহার করে বিশ্বজুড়ে ২৪/৭ রিয়েল-টাইম সার্টিফিকেট এবং গ্রেডশিট যাচাইকরণ সেবা।
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#006a4e] shrink-0 mt-0.5" />
                  <span>
                    <strong>অফিসিয়াল যোগাযোগ ও ভেরিফিকেশন ডেস্ক:</strong> ইমেইল: <a href="mailto:bnieeducationbd@gmail.com" className="font-bold text-[#006a4e] hover:underline">bnieeducationbd@gmail.com</a> | হটলাইন: <span className="font-number digit-clear font-bold tracking-wider">+880 9658-417741</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#006a4e] text-white flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-9 h-9" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                100% Genuine &amp; Verified
              </p>
              <p className="text-[11px] text-gray-600 leading-normal">
                সকল সনদপত্র বাংলাদেশ সরকারের প্রচলিত জালিয়াতি প্রতিরোধ ও ডিজিটাল আইসিটি আইন দ্বারা সুরক্ষিত।
              </p>
              <div className="pt-1">
                <span className="inline-block bg-[#006a4e] text-white text-[11px] font-bold px-3 py-1 rounded-md">
                  Govt. Accredited Registry
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
