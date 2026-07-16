import { FlaskConical, Briefcase, BookOpen, GraduationCap } from "lucide-react";
import { motion } from "motion/react";

const CATEGORIES = [
  {
    title: "Science",
    icon: FlaskConical,
    color: "border-sky-200 bg-sky-50 text-sky-700 hover:border-sky-300",
    iconBg: "bg-sky-100 text-sky-700",
    description: "Tailored for innovators, engineers, and healthcare prospects, offering key analytical foundations in physical and computing disciplines.",
    subjects: [
      "Physics", "Chemistry", "Biology", "Mathematics", 
      "Computer Science", "Electronics", "Engineering", "Medical Science"
    ]
  },
  {
    title: "Business Studies",
    icon: Briefcase,
    color: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300",
    iconBg: "bg-emerald-100 text-emerald-700",
    description: "Designed for future entrepreneurs, accountants, and executive leaders to master finance, trade systems, and human resources.",
    subjects: [
      "Accounting", "Business Management", "Economics", "Finance", 
      "Marketing", "International Business", "Human Resource Management"
    ]
  },
  {
    title: "Humanities",
    icon: BookOpen,
    color: "border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300",
    iconBg: "bg-amber-100 text-amber-700",
    description: "Focuses on culture, history, law, and human behavior, nurturing critical thinkers, writers, and public administrators.",
    subjects: [
      "English Literature", "History", "Geography", "Psychology", 
      "Philosophy", "Political Science", "Islamic Studies"
    ]
  }
];

export default function VocationalSpecialization() {
  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 bg-[#006a4e]/10 text-[#006a4e] text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Groups</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 font-sans tracking-tight">
            Vocational Specialization Pathways
          </h3>
          <p className="text-gray-500 text-sm mt-2">
            Explore the core academic divisions of BNIE. Each specialization is meticulously engineered to combine theoretical mastery with market-ready vocational competencies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`border rounded-2xl p-6 transition-all shadow-sm ${cat.color} hover:shadow-md flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-3 rounded-xl ${cat.iconBg}`}>
                      <IconComponent className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-950 font-sans">{cat.title}</h4>
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed mb-6 font-normal">
                    {cat.description}
                  </p>

                  <div className="h-px bg-gray-200/50 my-4" />

                  <h5 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-3">
                    Key Specialties Included:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {cat.subjects.map((subj) => (
                      <span
                        key={subj}
                        className="text-xs bg-white text-gray-700 px-2.5 py-1 rounded-md border border-gray-100 font-medium shadow-2xs hover:border-gray-200 hover:text-gray-900 transition-colors"
                      >
                        {subj}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
