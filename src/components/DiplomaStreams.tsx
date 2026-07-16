import { Cpu, Home, Settings, Zap, HardDrive, Car, Beaker, Scissors, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

const STREAMS = [
  { name: "Civil Engineering", icon: Home, desc: "Structural designing, surveying, concrete tech, and green infrastructure planning." },
  { name: "Mechanical Engineering", icon: Settings, desc: "Thermodynamics, fluid mechanics, CAD modelling, and industrial manufacturing systems." },
  { name: "Electrical Engineering", icon: Zap, desc: "Power grid systems, transformer design, electrical machines, and distribution lines." },
  { name: "Electronics Engineering", icon: Cpu, desc: "Semiconductors, microcontrollers, embedded systems, and telecommunication devices." },
  { name: "Computer Engineering", icon: HardDrive, desc: "Software architecture, database setups, network routing, and server administration." },
  { name: "Automobile Engineering", icon: Car, desc: "Engine performance, hybrid drivetrains, automotive chassis design, and diagnostics." },
  { name: "Chemical Engineering", icon: Beaker, desc: "Industrial chemistry, polymers, mass transfer, and refinery operation dynamics." },
  { name: "Textile Engineering", icon: Scissors, desc: "Yarn manufacturing, fabric structures, chemical processing, and apparel production." }
];

export default function DiplomaStreams() {
  return (
    <section className="py-12 bg-gray-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div className="max-w-xl">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-950 font-sans tracking-tight">
              Diploma in Engineering Streams
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              A 4-year professional credential equipping students with specialized technical expertise and practical laboratory mastery.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-[#006a4e]/5 text-[#006a4e] px-3.5 py-1.5 rounded-lg border border-[#006a4e]/20 text-xs font-semibold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5 text-[#f42a41]" />
            <span>4-Year National Curriculum</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STREAMS.map((stream, idx) => {
            const IconComp = stream.icon;
            return (
              <motion.div
                key={stream.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:border-[#006a4e]/30 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2.5 rounded-lg bg-gray-100 text-gray-700 group-hover:bg-[#006a4e]/10 group-hover:text-[#006a4e] transition-colors">
                    <IconComp className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h4 className="font-bold text-gray-950 text-sm md:text-base leading-snug font-sans group-hover:text-[#006a4e] transition-colors">
                    {stream.name}
                  </h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-normal">
                  {stream.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
