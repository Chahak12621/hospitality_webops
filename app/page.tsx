"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  const handleEnterPortal = () => {
    router.push("/auth/login");
  };

  const handleItems = [
    {
      title: "Guest Reception & Help Desk",
      desc: "Situated at Gajendra Circle, welcoming and assisting guests, speakers, and dignitaries throughout the fest.",
      color: "from-[#fdcbca] to-[#fcc4b7]",
    },
    {
      title: "Accommodation & Food Coordination",
      desc: "Managing stays and food arrangements according to preferences and health needs while ensuring guest comfort.",
      color: "from-[#ebdbe6] to-[#d8d0e8]",
    },
    {
      title: "Refreshments & Mementos",
      desc: "Coordinating food, beverages, and hospitality needs during sessions and performances.",
      color: "from-[#d0e7dd] to-[#ffe8b5]",
    },
    {
      title: "Event Support for Guests & Judges",
      desc: "Providing on-ground support for artists, dignitaries, and official events throughout the fest.",
      color: "from-[#fcc4b7] to-[#fdcbca]",
    },
    {
      title: "Logistics & Transportation",
      desc: "Ensuring seamless movement, communication, and coordination for all invited guests.",
      color: "from-[#ffe8b5] to-[#d0e7dd]",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fdf8f5] text-[#0b0705]">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#d0e7dd,#fdcbca,#ebdbe6,#ffe8b5,#d8d0e8)] bg-[length:280%_280%] animate-[gradientShift_22s_ease_infinite]" />
      <div className="absolute left-[-100px] top-[-100px] h-[360px] w-[360px] rounded-full bg-[#f56483]/25 blur-3xl" />
      <div className="absolute right-[-100px] bottom-[-100px] h-[360px] w-[360px] rounded-full bg-[#703c84]/20 blur-3xl" />

      <nav className="relative z-20 mx-auto flex max-w-screen-xl flex-col gap-6 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="h-14 w-14 rounded-2xl bg-white/60 p-2 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl">
            <img src="logo1.png" alt="paradox-logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <p className="font-felix font-bold tracking-[0.2em] text-[#703c84]">IIT Madras BS Presents</p>
            <h1 className="text-2xl font-black tracking-tight text-[#0b0705] sm:text-3xl">PARADOX '26</h1>
          </div>
        </div>

        <button
          onClick={handleEnterPortal}
          className="inline-flex items-center justify-center rounded-full bg-[#f56483] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(245,100,131,0.28)] transition duration-300 hover:scale-[1.03] hover:bg-[#e14f72]"
        >
          Login
        </button>
      </nav>

      <section className="relative z-10 flex min-h-[85vh] items-center justify-center px-6 py-16">
        <div className="w-full max-w-5xl rounded-[40px] border border-white/40 bg-white/20 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.12)] backdrop-blur-[30px] backdrop-saturate-150 sm:p-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-[#703c84]">IIT Madras BS Presents · Paradox '26</p>
            <h2 className="mt-6 text-4xl font-felix font-black leading-tight tracking-tight text-[#703c84] sm:text-5xl md:text-6xl">
              Department of Hospitality
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.05 }}
            className="mx-auto mt-8 max-w-3xl space-y-4 text-center"
          >
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
            className="mx-auto mt-8 max-w-3xl text-base leading-8 text-[#3a2a42] sm:text-lg"
          >
            The Hospitality Department of Paradox 2026 is the welcoming face of the fest, delivering comfort,
            professional coordination, and seamless guest experiences for dignitaries, speakers, artists,
            sponsors and participants. Every detail is managed with dedication, discipline, and teamwork.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <button
              onClick={handleEnterPortal}
              className="inline-flex items-center gap-2 rounded-full bg-[#f56483] px-8 py-4 text-sm font-semibold text-white shadow-[0_15px_50px_rgba(245,100,131,0.34)] transition duration-300 hover:scale-[1.03] hover:bg-[#e14f72]"
            >
              Enter Portal
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-screen-xl px-6 pb-20 sm:px-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-[32px] border border-white/40 bg-gradient-to-br from-[#ebdbe6] to-[#fcc4b7] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] backdrop-blur-md"
          >
            <h2 className="mt-4 text-3xl font-felix font-bold text-[#703c84]">Our Vision</h2>
            <p className="mt-5 leading-8 text-[#3d3144]">
              To become a symbol of excellence in hospitality by creating exceptional experiences that
              inspire comfort, trust, and lasting memories for guests, judges, and artists at Paradox.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-[32px] border border-white/40 bg-gradient-to-br from-[#d0e7dd] to-[#ffe8b5] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] backdrop-blur-md"
          >
            <h2 className="mt-4 text-3xl font-felix font-bold text-[#703c84]">Our Mission</h2>
            <ul className="mt-5 space-y-3">
              {[
                "Ensure smooth guest coordination and support during the fest.",
                "Provide a welcoming and comfortable experience for all visitors.",
                "Maintain professionalism, discipline, and efficiency in all operations.",
                "Create meaningful interactions that leave a lasting impression.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 leading-7 text-[#3d3144]">
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#703c84]" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-screen-xl px-6 pb-20 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >

          <h2 className="mt-4 text-4xl font-felix font-bold text-[#703c84]">What We Handle</h2>
        </motion.div>

        <div className="space-y-8">
          {handleItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: index * 0.08 }}
              className={`rounded-[32px] border border-white/40 bg-gradient-to-br ${item.color} p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] backdrop-blur-md transition duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-center gap-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-sm font-semibold text-[#703c84] shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                  {index + 1}
                </span>
                <h3 className="text-2xl font-black text-[#703c84]">{item.title}</h3>
              </div>
              <p className="mt-5 leading-8 text-[#3d3144]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-screen-xl px-6 pb-16 sm:px-10">
        <div className="rounded-[36px] border border-white/40 bg-white/25 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-10">
          <div className="max-w-3xl">
            
            <h2 className="mt-4 text-4xl font-felix font-bold text-[#703c84]">Important Documents</h2>
            <p className="mt-5 text-base text-[#3d3144]">
              Access guidelines, schedules and essential documents related to Paradox '26 hospitality and coordination.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <a
              href="https://docs.google.com/document/d/1RqkJz_kUOYEARLdovpxhDdIYNN78-HTZNntkdRYlmIk/edit?usp=drivesdk"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[28px] bg-gradient-to-br from-[#ebdbe6] to-[#fcc4b7] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] sm:p-8"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-[#703c84]">Document 01</p>
              <h3 className="mt-4 text-2xl font-black text-[#703c84]">Workflow Document</h3>
              <p className="mt-4 leading-7 text-[#3d3144]">
                Rules, accommodation process, reporting structure and important instructions for volunteers and coordinators.
              </p>
              <div className="mt-6 text-sm font-semibold text-[#0b0705] group-hover:text-[#703c84]">
                Open Document →
              </div>
            </a>

            <a
              href="https://docs.google.com/document/d/1Pjczgw4ltprVU6LHP1TxoP5l1pKpgXGg03ZXXEpxOEA/edit?usp=drivesdk"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[28px] bg-gradient-to-br from-[#d0e7dd] to-[#ffe8b5] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] sm:p-8"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-[#703c84]">Document 02</p>
              <h3 className="mt-4 text-2xl font-black text-[#703c84]">Standard Operating Procedure</h3>
              <p className="mt-4 leading-7 text-[#3d3144]">
                Complete timeline of guest arrivals, registrations, accommodation allocation and major event activities.
              </p>
              <div className="mt-6 text-sm font-semibold text-[#0b0705] group-hover:text-[#703c84]">
                Open Document →
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-screen-xl px-6 pb-14 sm:px-10">
        <div className="overflow-hidden rounded-[36px] border border-white/40 bg-white/30 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="grid gap-8 p-8 md:grid-cols-2 sm:p-10">
            <div className="rounded-[28px] bg-gradient-to-br from-[#ebdbe6] to-[#fcc4b7] p-7 sm:p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-[#703c84]">Admin Contact</p>
              <h3 className="mt-4 text-3xl font-black text-[#703c84]">Tanishq Ojha</h3>
              <p className="mt-5 text-base leading-8 text-[#3d3144]">
                For registrations, hospitality queries, team support or any issue related to Paradox '26.
              </p>
              <div className="mt-6 space-y-3">
                <p className="text-sm font-semibold text-[#0b0705]">📧 23f2000546@ds.study.iitm.ac.in</p>
                <p className="text-sm font-semibold text-[#0b0705]">📞 +91 7987376613</p>
              </div>
            </div>

            <div className="rounded-[28px] bg-gradient-to-br from-[#d0e7dd] to-[#ffe8b5] p-7 sm:p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-[#703c84]">Admin Contact</p>
              <h3 className="mt-4 text-3xl font-black text-[#703c84]">Ayush Sk</h3>
              <p className="mt-5 text-base leading-8 text-[#3d3144]">
                Reach out for accommodation help, technical support, coordination assistance or general event information.
              </p>
              <div className="mt-6 space-y-3">
                <p className="text-sm font-semibold text-[#0b0705]">📧 24f3100265@es.study.iitm.ac.in</p>
                <a
                  href="tel:+919322949492"
                  className="block text-sm font-semibold text-[#0b0705] transition hover:text-[#703c84]"
                >
                  📞 +91 9322949492
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/40 bg-white/20 py-8 text-center backdrop-blur-xl">
        <p className="text-sm tracking-wide text-[#3d3144]">IIT Madras BS Presents • PARADOX '26</p>
      </footer>

      <style jsx global>{`
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </main>
  );
}
