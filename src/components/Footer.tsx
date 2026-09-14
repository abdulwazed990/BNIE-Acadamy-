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
              গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত একটি স্বায়ত্তশাসিত জাতীয় শিক্ষা প্রতিষ্ঠান। এস.এস.সি, এইচ.এস.সি, ভোকেশনাল এবং ১ বছর থেকে ৪ বছর মেয়াদী পলিটেকনিক ডিপ্লোমা সনদ ও কেন্দ্রীয় ডিজিটাল ভেরিফিকেশন পোর্টাল।
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
                  <button
                    onClick={() => onNavigate("home")}
                    className="text-xs text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("accreditation")}
                    className="text-xs text-[#006a4e] hover:underline font-bold transition-colors cursor-pointer"
                  >
                    Govt. Approval (সরকারি অনুমোদন)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("verify")}
                    className="text-xs text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer font-medium"
                  >
                    Verify Certificate
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("services")}
                    className="text-xs text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer"
                  >
                    Our Services
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
                Legal & Support
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => onNavigate("privacy")}
                    className="text-xs text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("terms")}
                    className="text-xs text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer"
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("help")}
                    className="text-xs text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer"
                  >
                    Help Center
                  </button>
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
          <div className="flex space-x-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#006a4e]" title="Active Registry Portal" />
            <span className="text-[10px] text-gray-400 font-mono">SECURE REGISTRY SSL v3.4</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
