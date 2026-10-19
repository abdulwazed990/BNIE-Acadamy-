import { Building2, MapPin, Phone, Mail, Clock, ArrowLeft, ChevronRight, ShieldCheck, ExternalLink } from "lucide-react";

interface RegionalCentersPageProps {
  onBackToHome: () => void;
  onNavigateToContact: () => void;
}

export default function RegionalCentersPage({ onBackToHome, onNavigateToContact }: RegionalCentersPageProps) {
  const centers = [
    {
      name: "Dhaka Central Headquarters & Campus",
      nameBn: "ঢাকা প্রধান কার্যালয় ও কেন্দ্রীয় ক্যাম্পাস",
      type: "Main Campus & Administrative Secretariat",
      address: "BNIE Bhaban, Plot 14/B, Technical Educational Zone, Mirpur-2, Dhaka-1216",
      phone: "+880 1819-847320, +880 2-9834721",
      email: "info@bnie.edu.bd, admission@bnie.edu.bd",
      hours: "Sunday - Thursday: 8:30 AM - 5:00 PM",
      lead: "Dr. M. A. Karim (Executive Director)",
      isHeadquarters: true
    },
    {
      name: "Chittagong Regional Liaison Center",
      nameBn: "চট্টগ্রাম আঞ্চলিক সমন্বয় কেন্দ্র",
      type: "Divisional Regional Center",
      address: "Technical Education Complex, Nasirabad Industrial Area, Chattogram-4209",
      phone: "+880 31-654890, +880 1711-209843",
      email: "ctg.center@bnie.edu.bd",
      hours: "Sunday - Thursday: 9:00 AM - 4:30 PM",
      lead: "Engr. S. K. Barua (Regional Coordinator)"
    },
    {
      name: "Rajshahi Regional Liaison Center",
      nameBn: "রাজশাহী আঞ্চলিক সমন্বয় কেন্দ্র",
      type: "Divisional Regional Center",
      address: "Polytechnic Bypass Road, Sopura Industrial Estate, Rajshahi-6203",
      phone: "+880 721-760312",
      email: "rajshahi.center@bnie.edu.bd",
      hours: "Sunday - Thursday: 9:00 AM - 4:30 PM",
      lead: "Prof. Md. Asaduzzaman (Regional Officer)"
    },
    {
      name: "Khulna Regional Liaison Center",
      nameBn: "খুলনা আঞ্চলিক সমন্বয় কেন্দ্র",
      type: "Divisional Regional Center",
      address: "Khalishpur Industrial Zone, Mujgunni Road, Khulna-9000",
      phone: "+880 41-723145",
      email: "khulna.center@bnie.edu.bd",
      hours: "Sunday - Thursday: 9:00 AM - 4:30 PM",
      lead: "Engr. Mostafa Kamal (Divisional Representative)"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/70 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Home Portal (মূল পাতায় ফিরুন)</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span>Home</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span>Administration</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-[#006a4e] font-bold">Regional Centers</span>
          </div>
        </div>

        {/* Page Banner */}
        <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-[#006a4e] rounded-full text-xs font-bold border border-emerald-200/80">
              <Building2 className="w-3.5 h-3.5" />
              <span>Institutional Network (আঞ্চলিক সমন্বয় কেন্দ্র ও শাখা অফিস)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Regional Centers &amp; Liaison Offices
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              সারা দেশের শিক্ষার্থীদের প্রশাসনিক সেবা, ভর্তি সহায়তা, প্রবেশপত্র বিতরণ ও সনদ প্রত্যয়নের সুবিধার্থে বাংলাদেশ জাতীয় শিক্ষা ইনস্টিটিউটের বিভাগীয় আঞ্চলিক কেন্দ্রসমূহ।
            </p>
          </div>
        </div>

        {/* Centers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {centers.map((center, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl border p-6 shadow-xs space-y-4 ${
                center.isHeadquarters ? "border-[#006a4e] ring-1 ring-[#006a4e]/20" : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    center.isHeadquarters ? "bg-[#006a4e] text-white" : "bg-gray-100 text-gray-700"
                  }`}>
                    {center.type}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 mt-2 font-sans">
                    {center.name}
                  </h3>
                  <h4 className="text-xs text-gray-600 font-medium">
                    {center.nameBn}
                  </h4>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-gray-600 pt-1">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#006a4e] shrink-0 mt-0.5" />
                  <span>{center.address}</span>
                </div>
                <div className="flex items-center gap-2.5 font-mono">
                  <Phone className="w-4 h-4 text-[#006a4e] shrink-0" />
                  <span>{center.phone}</span>
                </div>
                <div className="flex items-center gap-2.5 font-mono">
                  <Mail className="w-4 h-4 text-[#006a4e] shrink-0" />
                  <span>{center.email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>{center.hours}</span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-[11px] text-gray-600">
                <strong>Officer in Charge:</strong> {center.lead}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
