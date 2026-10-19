import { Menu, Landmark } from "lucide-react";
import Logo from "./Logo";

interface HeaderProps {
  onNavigate?: (page: string) => void;
  onOpenDrawer?: () => void;
  isDbLoading?: boolean;
}

export default function Header({ onNavigate, onOpenDrawer, isDbLoading }: HeaderProps) {
  return (
    <header 
      className="w-full bg-white border-b border-gray-200 no-print"
      itemScope 
      itemType="https://schema.org/EducationalOrganization"
    >
      {/* Top Banner Stripe - National Flag Colors of Bangladesh */}
      <div className="w-full h-2 flex shrink-0">
        <div className="w-[45%] bg-[#006a4e]" />
        <div className="w-[10%] bg-[#f42a41]" />
        <div className="w-[45%] bg-[#006a4e]" />
      </div>

      {/* Main Header Container: Logo on Left, Branding, Three-Line Menu on Far Right */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* LEFT: Existing Website Logo & Main Website Branding */}
          <button 
            type="button"
            onClick={() => onNavigate && onNavigate("home")}
            className="flex items-center space-x-3.5 text-left cursor-pointer group shrink min-w-0"
            title="Return to Home"
          >
            <div className="shrink-0 transition-transform group-hover:scale-105">
              <Logo size={68} className="sm:w-20 sm:h-20" />
            </div>

            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span 
                  className="text-[#006a4e] text-[10px] sm:text-xs font-bold tracking-wide uppercase block"
                  itemProp="award"
                >
                  গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত
                </span>
              </div>

              <h1 
                className="text-lg sm:text-xl md:text-2xl font-black text-gray-950 font-sans tracking-tight leading-tight truncate"
                itemProp="name"
                lang="bn"
              >
                বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউট
              </h1>

              <h2 
                className="text-xs sm:text-sm font-medium text-gray-700 tracking-wide font-sans truncate"
                itemProp="alternateName"
                lang="en"
              >
                Bangladesh National Institute of Education (BNIE)
              </h2>
            </div>
          </button>

          {/* RIGHT: Three-Line Menu Button */}
          <div className="flex items-center shrink-0">
            {/* THREE-LINE HAMBURGER MENU BUTTON ON THE FAR RIGHT */}
            <button
              type="button"
              onClick={onOpenDrawer}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-[#006a4e] hover:bg-[#005a42] text-white rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer group focus:outline-hidden focus:ring-2 focus:ring-[#006a4e]/40"
              aria-label="Open Navigation Menu"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-105 transition-transform" />
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider font-sans">
                Menu
              </span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
