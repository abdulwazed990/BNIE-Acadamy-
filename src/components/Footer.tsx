import Logo from "./Logo";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 mt-auto no-print">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Logo size={48} className="hover:scale-105 transition-transform" />
              <div>
                <span className="font-bold text-gray-950 text-sm tracking-tight block">
                  বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউট
                </span>
                <span className="text-[11px] text-gray-600 font-medium block">
                  Bangladesh National Institute of Education (BNIE)
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed max-w-sm">
              গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত একটি স্বায়ত্তশাসিত জাতীয় উচ্চশিক্ষা ও কারিগরি শিক্ষা প্রতিষ্ঠান। ৪ বছর মেয়াদী স্নাতক সম্মান (অনার্স), ৩ বছর মেয়াদী ডিগ্রি (পাস), স্নাতকোত্তর (মাস্টার্স), ১ থেকে ৪ বছর মেয়াদী পলিটেকনিক ডিপ্লোমা এবং এস.এস.সি, এইচ.এস.সি ও ভোকেশনাল সনদ ও কেন্দ্রীয় ডিজিটাল ভেরিফিকেশন পোর্টাল।
            </p>
            <div className="inline-block bg-emerald-50 text-[#006a4e] border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
              Govt. Approved &amp; Accredited Institute
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
                Main Portal
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    onClick={(e) => { e.preventDefault(); onNavigate("home"); }}
                    className="text-xs text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer"
                  >
                    Home — BNIE Bangladesh
                  </a>
                </li>
                <li>
                  <a
                    href="/?page=verify"
                    onClick={(e) => { e.preventDefault(); onNavigate("verify"); }}
                    className="text-xs text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer font-medium"
                  >
                    Certificate Verification (সনদ যাচাই)
                  </a>
                </li>
                <li>
                  <a
                    href="/?page=degree-marksheet-result"
                    onClick={(e) => { e.preventDefault(); onNavigate("degree-marksheet-result"); }}
                    className="text-xs text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer font-medium"
                  >
                    Online Marksheet (Honours / Degree / Masters)
                  </a>
                </li>
                <li>
                  <a
                    href="/?page=courses"
                    onClick={(e) => { e.preventDefault(); onNavigate("courses"); }}
                    className="text-xs text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer"
                  >
                    Diploma in Engineering Courses
                  </a>
                </li>
                <li>
                  <a
                    href="/?page=online-admission"
                    onClick={(e) => { e.preventDefault(); onNavigate("online-admission"); }}
                    className="text-xs text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer"
                  >
                    Online Admission (অনলাইন ভর্তি)
                  </a>
                </li>
                <li>
                  <a
                    href="/?page=accreditation"
                    onClick={(e) => { e.preventDefault(); onNavigate("accreditation"); }}
                    className="text-xs text-[#006a4e] hover:underline font-bold transition-colors cursor-pointer"
                  >
                    Govt. Approval (সরকারি অনুমোদন)
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
                Academic &amp; Support
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/?page=find-program"
                    onClick={(e) => { e.preventDefault(); onNavigate("find-program"); }}
                    className="text-xs text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer"
                  >
                    Honours, Degree &amp; Masters Programs
                  </a>
                </li>
                <li>
                  <a
                    href="/?page=services"
                    onClick={(e) => { e.preventDefault(); onNavigate("services"); }}
                    className="text-xs text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer"
                  >
                    Student Services (শিক্ষার্থী সেবা)
                  </a>
                </li>
                <li>
                  <a
                    href="/?page=help-center"
                    onClick={(e) => { e.preventDefault(); onNavigate("help-center"); }}
                    className="text-xs text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/?page=privacy-policy"
                    onClick={(e) => { e.preventDefault(); onNavigate("privacy-policy"); }}
                    className="text-xs text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/?page=terms-conditions"
                    onClick={(e) => { e.preventDefault(); onNavigate("terms-conditions"); }}
                    className="text-xs text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer"
                  >
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
                Support Helpline
              </h4>
              <ul className="space-y-2">
                <li className="text-xs text-gray-500">
                  Phone: <span className="font-semibold text-gray-800 font-number digit-clear tracking-wider">+880 9658-417741</span>
                </li>
                <li className="text-xs text-gray-500">
                  Email: <span className="font-semibold text-gray-800">bnieeducationbd@gmail.com</span>
                </li>
                <li 
                  onClick={() => onNavigate("admin-login")}
                  className="text-xs text-gray-500 cursor-default select-none"
                  title="Administrative Office Hours"
                >
                  Hours: Sun - Thu, 9:00 AM - 5:00 PM
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright stripe and hidden Admin gate */}
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p 
            onClick={() => {
              onNavigate("admin-login");
              // Quick alert/notification so they know it worked
              console.log("Secret admin pathway triggered!");
            }}
            className="text-xs text-gray-400 hover:text-gray-900 cursor-pointer select-none transition-colors duration-200 text-center sm:text-left"
            title="Secret Administrative Access"
          >
            © Bangladesh National Institute of Education (BNIE). All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
