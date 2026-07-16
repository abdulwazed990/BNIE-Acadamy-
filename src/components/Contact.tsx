import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { motion } from "motion/react";

export default function Contact() {
  return (
    <section className="py-12 bg-[#006a4e]/5 border-t border-gray-100 no-print">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Info panel */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#006a4e] uppercase tracking-widest block mb-2">
                  Have Questions?
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-950 font-sans tracking-tight">
                  Official Support Helpdesk
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  For corrections of student records, spelling mistakes, or unrecognized roll numbers, reach out directly to the registrar's division.
                </p>
              </div>

              <div className="space-y-4">
                <a
                  href="tel:+8801000000000"
                  className="flex items-center space-x-3 p-3 rounded-xl border border-gray-100 hover:border-[#006a4e]/20 hover:bg-emerald-50/20 transition-all group"
                >
                  <div className="p-2.5 rounded-lg bg-[#006a4e]/10 text-[#006a4e] group-hover:bg-[#006a4e] group-hover:text-white transition-all">
                    <Phone className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">National Helpline</p>
                    <p className="text-sm font-bold text-gray-900">+8801000000000</p>
                  </div>
                </a>

                <a
                  href="mailto:info@bnie-gov.org"
                  className="flex items-center space-x-3 p-3 rounded-xl border border-gray-100 hover:border-[#006a4e]/20 hover:bg-emerald-50/20 transition-all group"
                >
                  <div className="p-2.5 rounded-lg bg-[#006a4e]/10 text-[#006a4e] group-hover:bg-[#006a4e] group-hover:text-white transition-all">
                    <Mail className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Official Email</p>
                    <p className="text-sm font-bold text-gray-900">info@bnie-gov.org</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Support context & schedule */}
            <div className="lg:col-span-7 bg-gray-50 rounded-xl p-6 border border-gray-200/60 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-[#f42a41]" />
                  <span className="text-xs font-bold uppercase tracking-wider">Secretariat Address</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-normal">
                  Bangladesh National Institute of Education (BNIE)<br />
                  Administrative Complex, Block-B, Agargaon,<br />
                  Sher-e-Bangla Nagar, Dhaka-1207, Bangladesh
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Clock className="w-4 h-4 text-[#006a4e]" />
                  <span className="text-xs font-bold uppercase tracking-wider">Office Hours</span>
                </div>
                <ul className="text-xs text-gray-500 space-y-1 font-normal">
                  <li>Sunday — Thursday: <span className="font-semibold text-gray-700">09:00 AM - 05:00 PM</span></li>
                  <li>Friday — Saturday: <span className="text-[#f42a41] font-semibold">Closed</span></li>
                  <li>* Closed on Government Gazetted Holidays</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
