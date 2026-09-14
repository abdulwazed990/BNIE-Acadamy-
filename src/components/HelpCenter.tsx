import { useState, type FormEvent } from "react";
import { HelpCircle, Search, ChevronDown, ChevronUp, Mail, Phone, Clock, Send, CheckCircle2, ArrowLeft, FileCheck, Award, BookOpen, AlertCircle } from "lucide-react";

interface HelpCenterProps {
  onBackToHome: () => void;
  onNavigateToVerify?: () => void;
}

interface FAQItem {
  id: string;
  category: "verification" | "correction" | "duplicate" | "diploma";
  question: string;
  answer: string;
}

const FAQ_LIST: FAQItem[] = [
  {
    id: "v1",
    category: "verification",
    question: "How do I verify a certificate issued by BNIE?",
    answer: "Go to the 'Verify Certificate' page from the top navigation or home screen. Enter the candidate's exact Roll Number and Registration Number as printed on their certificate or mark sheet, then click 'Search & Verify Record'. If valid, the complete official verification report with photo, grades, and QR stamp will appear."
  },
  {
    id: "v2",
    category: "verification",
    question: "Can an employer or foreign embassy verify certificates online?",
    answer: "Yes. The BNIE verification portal is 100% accessible worldwide without any login requirement. Third-party institutions can immediately verify authentic documents by providing candidate Roll and Registration numbers or scanning the digital QR code on the certificate."
  },
  {
    id: "v3",
    category: "verification",
    question: "What if the system displays 'No Candidate Record Found'?",
    answer: "Please double-check that you entered the numbers correctly without extra spaces or symbols. If the record still cannot be found, it may be pending manual ledger digitization or might be an unverified certificate. Please email our verification desk at bnieeducationbd@gmail.com with clear scanned copies of your certificate."
  },
  {
    id: "c1",
    category: "correction",
    question: "How can I correct a spelling mistake in my name or parent's name?",
    answer: "To request a correction, prepare a formal application along with your SSC/JSC original board certificate copy or National NID/Birth Registration Certificate. Submit your request either directly at the BNIE administrative office or by sending an email to bnieeducationbd@gmail.com."
  },
  {
    id: "d1",
    category: "duplicate",
    question: "How do I apply for a duplicate certificate or mark sheet?",
    answer: "In case of loss or damage, first file a General Diary (GD) with your nearest Police Station. Then submit the GD copy, newspaper notice cutting, and duplicate application form to BNIE. A certified duplicate certificate with a marked 'DUPLICATE' endorsement will be issued within 7-10 working days."
  },
  {
    id: "dp1",
    category: "diploma",
    question: "What are the requirements for 2-Year Diploma in Air Condition and Maintenance (ACM)?",
    answer: "Candidates who have completed SSC or equivalent secondary education are eligible. The 2-Year Diploma curriculum comprises 13 specialized technical subjects across 2 academic sessions (e.g. Session 2020-2021, Passing Year 2022) focusing on practical HVAC, refrigeration, compressor servicing, and electrical troubleshooting."
  },
  {
    id: "dp2",
    category: "diploma",
    question: "What grading scale is used for Diploma engineering programs?",
    answer: "Diploma programs at BNIE utilize the nationwide polytechnic 4.00 Grade Point scale (where 80%+ is A+ / 4.00, 75-79% is A / 3.75, 70-74% is A- / 3.50, etc.). General SSC and HSC programs use the 5.00 Grade Point scale."
  }
];

export default function HelpCenter({ onBackToHome, onNavigateToVerify }: HelpCenterProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>("v1");

  // Support Ticket Form State
  const [ticketName, setTicketName] = useState("");
  const [ticketRoll, setTicketRoll] = useState("");
  const [ticketEmail, setTicketEmail] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const filteredFaqs = FAQ_LIST.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmitTicket = (e: FormEvent) => {
    e.preventDefault();
    if (!ticketName || !ticketEmail || !ticketMessage) return;

    const generatedId = `BNIE-TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generatedId);
    setTicketSubmitted(true);
  };

  return (
    <div className="py-10 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Top Breadcrumb */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-150 pb-4">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-[#006a4e] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Home Portal</span>
        </button>
        <span className="text-[11px] font-mono text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
          BNIE Official Helpdesk
        </span>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-emerald-900 via-[#006a4e] to-[#004d38] text-white rounded-2xl p-6 sm:p-10 mb-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            24/7 Candidate &amp; Institutional Assistance
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            How can we assist you today?
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-2">
            Search frequently asked questions, learn how to verify credentials, or submit an official support ticket directly to our records division.
          </p>

          {/* Live Search Bar */}
          <div className="mt-6 relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search help by question, verification, or roll issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Direct Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs flex items-start gap-3">
          <div className="p-2.5 bg-[#006a4e]/10 text-[#006a4e] rounded-lg">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Official Email</p>
            <p className="text-xs font-bold text-gray-900 select-all">bnieeducationbd@gmail.com</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Response within 24 hours</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs flex items-start gap-3">
          <div className="p-2.5 bg-[#006a4e]/10 text-[#006a4e] rounded-lg">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Helpline Numbers</p>
            <p className="text-xs sm:text-sm font-bold text-gray-900 font-number digit-clear tracking-wider">+880 9658-417741</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Official hotline / Switchboard</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs flex items-start gap-3">
          <div className="p-2.5 bg-[#006a4e]/10 text-[#006a4e] rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Office Hours</p>
            <p className="text-xs font-bold text-gray-900">Sun - Thu, 9 AM - 5 PM</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Closed on Friday &amp; Govt. Holidays</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="text-xs text-gray-500 mt-0.5">Quick answers regarding certificate verification and services</p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { key: "all", label: "All Questions" },
              { key: "verification", label: "Verification" },
              { key: "correction", label: "Correction" },
              { key: "duplicate", label: "Duplicates" },
              { key: "diploma", label: "Diploma" }
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeCategory === cat.key
                    ? "bg-[#006a4e] text-white font-bold"
                    : "bg-gray-100 text-gray-650 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion FAQ Items */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-200">
              <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">No matching questions found</p>
              <p className="text-xs text-gray-500 mt-1">Try another keyword or submit an inquiry below.</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = expandedFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                    className="w-full text-left p-4.5 flex items-center justify-between gap-4 hover:bg-gray-50/70 transition-colors cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-gray-900">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#006a4e] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4.5 pb-4 pt-1 text-xs sm:text-sm text-gray-650 leading-relaxed border-t border-gray-100 bg-gray-50/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Submit an Official Support Ticket */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="max-w-2xl mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#006a4e]/10 text-[#006a4e] mb-1.5">
            Support Inquiry Form
          </div>
          <h2 className="text-xl font-bold text-gray-900">Submit an Academic Record Inquiry</h2>
          <p className="text-xs text-gray-500 mt-1">
            If you need assistance resolving an unverified certificate, request data correction, or need physical verification.
          </p>
        </div>

        {ticketSubmitted ? (
          <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#006a4e] mx-auto" />
            <h3 className="text-base font-bold text-gray-900">Support Inquiry Received</h3>
            <p className="text-xs text-gray-650 max-w-md mx-auto">
              Your inquiry reference number is <strong className="text-gray-900 font-mono">{ticketId}</strong>. A response has been queued for our verification desk. We will reach back to <strong className="text-gray-900">{ticketEmail}</strong> within 24 hours.
            </p>
            <button
              onClick={() => {
                setTicketSubmitted(false);
                setTicketName("");
                setTicketRoll("");
                setTicketEmail("");
                setTicketSubject("");
                setTicketMessage("");
              }}
              className="mt-2 text-xs font-bold text-[#006a4e] hover:underline cursor-pointer"
            >
              Submit another query
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Md. Abdul Karim"
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#006a4e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  Roll / Registration No. (If Applicable)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ACM1029 / REG90182736"
                  value={ticketRoll}
                  onChange={(e) => setTicketRoll(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#006a4e]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  Your Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={ticketEmail}
                  onChange={(e) => setTicketEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#006a4e]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  Inquiry Category
                </label>
                <select
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#006a4e]"
                >
                  <option value="">Select category...</option>
                  <option value="Certificate Verification Issue">Certificate Verification Issue</option>
                  <option value="Spelling / Data Correction">Spelling / Data Correction</option>
                  <option value="Duplicate Certificate Application">Duplicate Certificate Application</option>
                  <option value="Diploma Course Inquiries">Diploma Course Inquiries</option>
                  <option value="Employer / Embassy Screening">Employer / Embassy Screening</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Detailed Message <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Please describe your query with candidate details, session, and any relevant certificate serial numbers..."
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#006a4e]"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-[11px] text-gray-500">
                You can also email directly: <span className="font-semibold text-gray-700">bnieeducationbd@gmail.com</span>
              </p>
              <button
                type="submit"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#006a4e] hover:bg-[#005a42] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Bottom return link */}
      <div className="mt-10 text-center">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Portal</span>
        </button>
      </div>
    </div>
  );
}
