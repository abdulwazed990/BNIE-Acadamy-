import Logo from "./Logo";

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      {/* Top Banner Stripe - National Flag Colors of Bangladesh */}
      <div className="w-full h-2.5 flex">
        <div className="w-[45%] bg-[#006a4e]" />
        <div className="w-[10%] bg-[#f42a41]" />
        <div className="w-[45%] bg-[#006a4e]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col items-center text-center">
        {/* Emblem / Logo */}
        <div className="mb-7 relative">
          <Logo size={112} className="mx-auto" />
          {/* Govt Approved Badge */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-[#006a4e] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap uppercase tracking-wider border border-white">
            Govt. Approved
          </div>
        </div>

        {/* Text Container */}
        <div className="space-y-1">
          <span className="text-[#006a4e] text-sm font-semibold tracking-wide block uppercase">
            গণপ্রজাতন্ত্রী বাংলাদেশ সরকার অনুমোদিত
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-sans tracking-tight leading-tight">
            বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউট
          </h1>
          <h2 className="text-lg md:text-xl font-medium text-gray-700 tracking-wide font-sans">
            Bangladesh National Institute of Education (BNIE)
          </h2>
          <div className="h-[2px] w-24 bg-[#f42a41] mx-auto my-3" />
          <p className="text-xs md:text-sm text-gray-500 font-medium max-w-xl mx-auto tracking-normal uppercase">
            SSC, HSC, Vocational and Diploma Certificate Verification Platform
          </p>
        </div>
      </div>
    </header>
  );
}
