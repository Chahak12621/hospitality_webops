"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="relative overflow-hidden bg-white text-[#0b0705]">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#d0e7dd,#fdcbca,#ebdbe6,#ffe8b5,#d8d0e8)] bg-[length:300%_300%] animate-[gradientShift_20s_ease_infinite]" />

      {/* Floating Blur Orbs */}
      <div className="absolute left-[-120px] top-[-100px] h-[400px] w-[400px] rounded-full bg-[#f56483]/30 blur-3xl" />
      <div className="absolute right-[-120px] bottom-[-100px] h-[400px] w-[400px] rounded-full bg-[#703c84]/20 blur-3xl" />

      {/* NAVBAR */}
      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-4">
          {/* SVG LOGO */}
          <div className="h-16 w-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 200"
              className="h-full w-full"
            >
              <defs>
                <radialGradient id="logoGrad" cx="45%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#f56483" />
                  <stop offset="60%" stopColor="#703c84" />
                  <stop offset="100%" stopColor="#4a1a6b" />
                </radialGradient>

                <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#8b3fa8" />
                  <stop offset="100%" stopColor="#4a1060" />
                </radialGradient>
              </defs>

              <circle cx="100" cy="100" r="98" fill="url(#ringGrad)" />
              <circle cx="100" cy="100" r="90" fill="url(#logoGrad)" />

              {[
                [100, 60, 2],
                [120, 65, 2],
                [135, 78, 2.5],
                [140, 95, 2.5],
                [135, 112, 2.5],
                [125, 126, 3],
                [112, 136, 3],
                [95, 140, 3.5],
                [78, 136, 3.5],
                [64, 126, 4],
                [58, 112, 4],
                [58, 95, 4],
                [64, 78, 4.5],
                [78, 66, 4.5],
              ].map(([cx, cy, r], i) => (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="rgba(255,255,255,0.9)"
                />
              ))}

              <circle cx="100" cy="100" r="5" fill="rgba(255,255,255,0.6)" />

              <text
                x="100"
                y="88"
                textAnchor="middle"
                fontSize="9"
                fontWeight="600"
                fill="white"
                letterSpacing="2"
              >
                IIT MADRAS
              </text>

              <text
                x="100"
                y="108"
                textAnchor="middle"
                fontSize="20"
                fontWeight="900"
                fill="white"
                letterSpacing="1"
              >
                PARADOX
              </text>
            </svg>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#703c84]">
              IIT Madras BS Presents
            </p>

            <h1 className="text-2xl font-black tracking-tight text-[#0b0705]">
              PARADOX ’26
            </h1>
          </div>
        </div>

        <button
          onClick={() => router.push("/auth/login")}
          className="rounded-full bg-[#f56483] px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:scale-105 hover:bg-[#e14f72]"
        >
          Login
        </button>
      </nav>

      {/* HERO */}
      <section className="relative z-10 flex min-h-[85vh] items-center justify-center px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 text-sm uppercase tracking-[0.45em] text-[#703c84]"
          >
            Symphony in Shades
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-6xl font-black leading-none tracking-tight text-[#703c84] sm:text-7xl md:text-8xl"
          >
            PARADOX
            <span className="block bg-gradient-to-r from-[#f56483] via-[#703c84] to-[#419bd9] bg-clip-text text-transparent">
              ’26
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
            className="mx-auto mt-10 max-w-3xl text-lg leading-9 text-[#3a2a42]"
          >
            We live in a monochrome world of labels,
            yet within every individual exists a vibrant spectrum
            waiting to be understood.
            <span className="block mt-4 italic text-[#703c84]">
              “Your authentic self is contradictory to society’s norms.”
            </span>
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="mt-14 flex flex-col items-center justify-center gap-5 sm:flex-row"
          >
            <button
              onClick={() => router.push("/auth/login")}
              className="inline-flex items-center gap-2 rounded-full bg-[#f56483] px-8 py-4 text-sm font-semibold text-white shadow-[0_15px_50px_rgba(245,100,131,0.35)] transition duration-300 hover:scale-105 hover:bg-[#e14f72]"
            >
              Enter Portal
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => router.push("/dashboard/team")}
              className="rounded-full border-2 border-[#703c84] bg-white/40 px-8 py-4 text-sm font-semibold text-[#703c84] backdrop-blur-md transition duration-300 hover:scale-105 hover:bg-white/70"
            >
              Explore Team
            </button>
          </motion.div>
        </div>
      </section>

      {/* ABOUT THEME */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Monochrome World",
              desc: "A world shaped by labels, stereotypes and routine thinking.",
              color: "from-[#fdcbca] to-[#fcc4b7]",
            },
            {
              title: "Hidden Spectrum",
              desc: "Within every individual lies emotion, curiosity and untold stories.",
              color: "from-[#ebdbe6] to-[#d8d0e8]",
            },
            {
              title: "Quest for Colour",
              desc: "Paradox celebrates the courage to ask why and look deeper.",
              color: "from-[#d0e7dd] to-[#ffe8b5]",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`rounded-[32px] border border-white/40 bg-gradient-to-br ${item.color} p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] backdrop-blur-md transition duration-300 hover:-translate-y-1`}
            >
              <h3 className="text-3xl font-bold text-[#703c84]">
                {item.title}
              </h3>

              <p className="mt-5 leading-8 text-[#3d3144]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
      {/* IMPORTANT DOCUMENTS */}
<section className="relative z-10 mx-auto max-w-7xl px-6 pb-16">
  <div className="rounded-[36px] border border-white/40 bg-white/25 p-10 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
    
    <div className="max-w-3xl">
      <p className="text-xs uppercase tracking-[0.4em] text-[#703c84]">
        Resources
      </p>

      <h2 className="mt-4 text-4xl font-black text-[#703c84]">
        Important Documents
      </h2>

      <p className="mt-5 text-base leading-8 text-[#3d3144]">
        Access guidelines, schedules and essential documents related to
        Paradox ’26 Hospitality and Coordination.
      </p>
    </div>

    <div className="mt-10 grid gap-6 md:grid-cols-2">
      
      {/* DOCUMENT 1 */}
      <a
        href="https://docs.google.com/document/d/1RqkJz_kUOYEARLdovpxhDdIYNN78-HTZNntkdRYlmIk/edit?usp=drivesdk"
        target="_blank"
        rel="noopener noreferrer"
        className="group rounded-[28px] bg-gradient-to-br from-[#ebdbe6] to-[#fcc4b7] p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)]"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-[#703c84]">
          Document 01
        </p>

        <h3 className="mt-4 text-2xl font-black text-[#703c84]">
          Hospitality Guidelines
        </h3>

        <p className="mt-4 leading-7 text-[#3d3144]">
          Rules, accommodation process, reporting structure and important
          instructions for volunteers and coordinators.
        </p>

        <div className="mt-6 text-sm font-semibold text-[#0b0705] group-hover:text-[#703c84]">
          Open Document →
        </div>
      </a>

      {/* DOCUMENT 2 */}
      <a
        href="https://docs.google.com/document/d/1Pjczgw4ltprVU6LHP1TxoP5l1pKpgXGg03ZXXEpxOEA/edit?usp=drivesdk"
        target="_blank"
        rel="noopener noreferrer"
        className="group rounded-[28px] bg-gradient-to-br from-[#d0e7dd] to-[#ffe8b5] p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)]"
      >
        <p className="text-xs uppercase tracking-[0.35em] text-[#703c84]">
          Document 02
        </p>

        <h3 className="mt-4 text-2xl font-black text-[#703c84]">
          Event Schedule
        </h3>

        <p className="mt-4 leading-7 text-[#3d3144]">
          Complete timeline of guest arrivals, registrations,
          accommodation allocation and major event activities.
        </p>

        <div className="mt-6 text-sm font-semibold text-[#0b0705] group-hover:text-[#703c84]">
          Open Document →
        </div>
      </a>
    </div>
  </div>
</section>
      {/* CONTACT SECTION */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-14">
        <div className="overflow-hidden rounded-[36px] border border-white/40 bg-white/30 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="grid gap-8 p-10 md:grid-cols-2">

            {/* ADMIN 1 */}
            <div className="rounded-[28px] bg-gradient-to-br from-[#ebdbe6] to-[#fcc4b7] p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-[#703c84]">
                Admin Contact
              </p>

              <h3 className="mt-4 text-3xl font-black text-[#703c84]">
                Admin Name
              </h3>

              <p className="mt-5 text-base leading-8 text-[#3d3144]">
                For registrations, hospitality queries, team support or any issue
                related to Paradox ’26.
              </p>

              <div className="mt-6 space-y-3">
                <p className="text-sm font-semibold text-[#0b0705]">
                  📧 admin1@example.com
                </p>

                <p className="text-sm font-semibold text-[#0b0705]">
                  📞 +91 9876543210
                </p>
              </div>
            </div>

            {/* ADMIN 2 */}
            <div className="rounded-[28px] bg-gradient-to-br from-[#d0e7dd] to-[#ffe8b5] p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-[#703c84]">
                Admin Contact
              </p>

              <h3 className="mt-4 text-3xl font-black text-[#703c84]">
                Admin Name
              </h3>

              <p className="mt-5 text-base leading-8 text-[#3d3144]">
                Reach out for accommodation help, technical support,
                coordination assistance or general event information.
              </p>

              <div className="mt-6 space-y-3">
                <p className="text-sm font-semibold text-[#0b0705]">
                  📧 24f3100265@es.study.iitm.ac.in
                </p>

                <a
                  href="tel:+919876543210"
                  className="block text-sm font-semibold text-[#0b0705] transition hover:text-[#703c84]"
                >
                  📞 +91 9322949492
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/40 bg-white/20 py-8 text-center backdrop-blur-xl">
        <p className="text-sm tracking-wide text-[#3d3144]">
          IIT Madras BS Presents • PARADOX ’26 • Symphony in Shades
        </p>
      </footer>

      {/* KEYFRAMES */}
      <style jsx global>{`
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </main>
  );
}