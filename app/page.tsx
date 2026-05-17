"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const handleEnterPortal = () => {
    router.push("/auth/login");
  };




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
          {/* SVG LOGO — exact from design.md */}
          <div className="h-16 w-16">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="h-full w-full">
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
                [100, 60, 2], [120, 65, 2], [135, 78, 2.5], [140, 95, 2.5],
                [135, 112, 2.5], [125, 126, 3], [112, 136, 3], [95, 140, 3.5],
                [78, 136, 3.5], [64, 126, 4], [58, 112, 4], [58, 95, 4],
                [64, 78, 4.5], [78, 66, 4.5],
              ].map(([cx, cy, r], i) => (
                <circle key={i} cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.9)" />
              ))}
              <circle cx="100" cy="100" r="5" fill="rgba(255,255,255,0.6)" />
              <text x="100" y="88" textAnchor="middle" fontSize="9" fontWeight="600" fill="white" letterSpacing="2">
                IIT MADRAS
              </text>
              <text x="100" y="108" textAnchor="middle" fontSize="20" fontWeight="900" fill="white" letterSpacing="1">
                PARADOX
              </text>
            </svg>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#703c84]">
              IIT Madras BS Presents
            </p>
            <h1 className="text-2xl font-black tracking-tight text-[#0b0705]">
              PARADOX '26
            </h1>
          </div>
        </div>

        <button
          onClick={handleEnterPortal}
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
            className="mb-4 text-sm uppercase tracking-[0.45em] text-[#703c84]"
          >
            IIT Madras BS Presents · Paradox '26
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl font-black leading-tight tracking-tight text-[#703c84] sm:text-6xl md:text-7xl"
          >
            Department of
            <span className="block bg-gradient-to-r from-[#f56483] via-[#703c84] to-[#419bd9] bg-clip-text text-transparent">
              Hospitality
            </span>
          </motion.h1>

          {/* All three taglines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.05 }}
            className="mx-auto mt-8 max-w-3xl space-y-2"
          >
            <p className="text-lg font-semibold text-[#3a2a42]">
              Crafting Comfort, Creating Memories &amp; Providing exceptional experiences at Paradox.
            </p>
            <p className="text-base italic text-[#703c84]">
              Indulge in Refined Comfort — Greetings welcomes you here — Sophistication in Every Stay.
            </p>
            <p className="text-base italic text-[#703c84]">
              Your Comfort, Our Commitment — Elegance Served with Warmth for Guests.
            </p>
          </motion.div>

          {/* Sub Headline */}
          <motion.p
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
            className="mx-auto mt-8 max-w-3xl text-base leading-8 text-[#3a2a42]"
          >
            The Hospitality Department of Paradox 2026 serves as the welcoming face of the fest,
            ensuring that every guest experiences comfort, professionalism, and seamless coordination
            throughout the event. Our team is responsible for managing guest reception, accommodation
            support, refreshments, logistics coordination, and overall guest experience for
            dignitaries, speakers, artists, sponsors, and participants. With dedication, discipline,
            and teamwork, we aim to create an environment where every interaction reflects the values
            and spirit of Paradox 2026.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row"
          >
            <button
              onClick={handleEnterPortal}
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

          {/* Email Sign-In prompt — shown when Login / Enter Portal is clicked */}

        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="rounded-[32px] border border-white/40 bg-gradient-to-br from-[#ebdbe6] to-[#fcc4b7] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] backdrop-blur-md"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-[#703c84]">Our Vision</p>
            <h2 className="mt-4 text-3xl font-black text-[#703c84]">Vision</h2>
            <p className="mt-5 leading-8 text-[#3d3144]">
              To become a symbol of excellence in hospitality by creating exceptional experiences
              that inspire comfort, trust, and lasting memories for Guests, Judges and artists
              coming to Paradox.
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-[32px] border border-white/40 bg-gradient-to-br from-[#d0e7dd] to-[#ffe8b5] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] backdrop-blur-md"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-[#703c84]">Our Mission</p>
            <h2 className="mt-4 text-3xl font-black text-[#703c84]">Mission</h2>
            <ul className="mt-5 space-y-3">
              {[
                "To ensure smooth guest coordination and support during the fest.",
                "To provide a welcoming and comfortable experience for all visitors.",
                "To maintain professionalism, discipline, and efficiency in all operations.",
                "To build meaningful interactions that leave a lasting impression.",
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

      {/* WHAT WE HANDLE */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-[#703c84]">Responsibilities</p>
          <h2 className="mt-4 text-4xl font-black text-[#703c84]">What We Handle</h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Guest Reception & Help Desk",
              desc: "Situated at Gajendra Circle, welcoming and assisting guests, speakers, and dignitaries throughout the Fest.",
              color: "from-[#fdcbca] to-[#fcc4b7]",
            },
            {
              title: "Guest House Accommodation & Food Coordination",
              desc: "Managing stay arrangements and food arrangements as per the food preferences and health conditions and ensuring guest comfort and convenience.",
              color: "from-[#ebdbe6] to-[#d8d0e8]",
            },
            {
              title: "Refreshments and Mementos Management",
              desc: "Coordinating food, beverages, and hospitality requirements during sessions and events.",
              color: "from-[#d0e7dd] to-[#ffe8b5]",
            },
            {
              title: "Event Support for Guests and Judges",
              desc: "Providing on-ground support for all the artists and Guests of ceremonies, conferences, performances, and official gatherings.",
              color: "from-[#fcc4b7] to-[#fdcbca]",
            },
            {
              title: "Logistics Assistance and Transportation",
              desc: "Ensuring smooth movement, communication, and coordination for all invited guests.",
              color: "from-[#ffe8b5] to-[#d0e7dd]",
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              viewport={{ once: true }}
              className={`rounded-[32px] border border-white/40 bg-gradient-to-br ${item.color} p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] backdrop-blur-md transition duration-300 hover:-translate-y-1`}
            >
              <h3 className="text-xl font-bold text-[#703c84]">{item.title}</h3>
              <p className="mt-4 leading-7 text-[#3d3144]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT THEME */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-[#703c84]">The Theme</p>
          <h2 className="mt-4 text-4xl font-black text-[#703c84]">Symphony in Shades</h2>
        </motion.div>

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
              <h3 className="text-3xl font-bold text-[#703c84]">{item.title}</h3>
              <p className="mt-5 leading-8 text-[#3d3144]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* IMPORTANT DOCUMENTS */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-[36px] border border-white/40 bg-white/25 p-10 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.4em] text-[#703c84]">Resources</p>
            <h2 className="mt-4 text-4xl font-black text-[#703c84]">Important Documents</h2>
            <p className="mt-5 text-base leading-8 text-[#3d3144]">
              Access guidelines, schedules and essential documents related to Paradox '26 Hospitality
              and Coordination.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <a
              href="https://docs.google.com/document/d/1RqkJz_kUOYEARLdovpxhDdIYNN78-HTZNntkdRYlmIk/edit?usp=drivesdk"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[28px] bg-gradient-to-br from-[#ebdbe6] to-[#fcc4b7] p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)]"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-[#703c84]">Document 01</p>
              <h3 className="mt-4 text-2xl font-black text-[#703c84]">Hospitality Guidelines</h3>
              <p className="mt-4 leading-7 text-[#3d3144]">
                Rules, accommodation process, reporting structure and important instructions for
                volunteers and coordinators.
              </p>
              <div className="mt-6 text-sm font-semibold text-[#0b0705] group-hover:text-[#703c84]">
                Open Document →
              </div>
            </a>

            <a
              href="https://docs.google.com/document/d/1Pjczgw4ltprVU6LHP1TxoP5l1pKpgXGg03ZXXEpxOEA/edit?usp=drivesdk"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-[28px] bg-gradient-to-br from-[#d0e7dd] to-[#ffe8b5] p-8 transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)]"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-[#703c84]">Document 02</p>
              <h3 className="mt-4 text-2xl font-black text-[#703c84]">Event Schedule</h3>
              <p className="mt-4 leading-7 text-[#3d3144]">
                Complete timeline of guest arrivals, registrations, accommodation allocation and
                major event activities.
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
            <div className="rounded-[28px] bg-gradient-to-br from-[#ebdbe6] to-[#fcc4b7] p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-[#703c84]">Admin Contact</p>
              <h3 className="mt-4 text-3xl font-black text-[#703c84]">Tanishq Ojha</h3>
              <p className="mt-5 text-base leading-8 text-[#3d3144]">
                For registrations, hospitality queries, team support or any issue related to
                Paradox '26.
              </p>
              <div className="mt-6 space-y-3">
                <p className="text-sm font-semibold text-[#0b0705]">📧 23f2000546@ds.study.iitm.ac.in</p>
                <p className="text-sm font-semibold text-[#0b0705]">📞 +91 7987376613</p>
              </div>
            </div>

            <div className="rounded-[28px] bg-gradient-to-br from-[#d0e7dd] to-[#ffe8b5] p-8">
              <p className="text-xs uppercase tracking-[0.35em] text-[#703c84]">Admin Contact</p>
              <h3 className="mt-4 text-3xl font-black text-[#703c84]">Ayush Sk</h3>
              <p className="mt-5 text-base leading-8 text-[#3d3144]">
                Reach out for accommodation help, technical support, coordination assistance or
                general event information.
              </p>
              <div className="mt-6 space-y-3">
                <p className="text-sm font-semibold text-[#0b0705]">
                  📧 24f3100265@es.study.iitm.ac.in
                </p>
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

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/40 bg-white/20 py-8 text-center backdrop-blur-xl">
        <p className="text-sm tracking-wide text-[#3d3144]">
          IIT Madras BS Presents • PARADOX '26 • Symphony in Shades
        </p>
      </footer>

      {/* KEYFRAMES */}
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