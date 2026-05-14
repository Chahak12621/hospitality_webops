// src/app/page.tsx

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[220px] sm:w-[500px] h-[220px] sm:h-[500px] bg-pink-500/20 blur-[90px] sm:blur-[140px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[220px] sm:w-[500px] h-[220px] sm:h-[500px] bg-fuchsia-500/20 blur-[90px] sm:blur-[140px] rounded-full" />

      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 sm:py-6 relative z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <Image
            src="/logo.png"
            alt="Paradox Logo"
            width={42}
            height={42}
            className="sm:w-[55px] sm:h-[55px] drop-shadow-[0_0_20px_rgba(255,0,150,0.9)]"
          />

          <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-widest bg-gradient-to-r from-pink-400 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
            Paradox 2026
          </h1>
        </div>

        <button
          onClick={() => router.push("/auth/login")}
          className="text-xs sm:text-sm md:text-base border border-pink-500 px-3 sm:px-5 py-1 sm:py-2 rounded-full hover:bg-pink-500 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,20,147,0.7)]"
        >
          Login
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 px-4 sm:px-6 md:px-20 pt-8 sm:pt-10 md:pt-24 pb-14 sm:pb-20 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <p className="uppercase tracking-[0.25em] sm:tracking-[0.4em] text-pink-400 text-[10px] sm:text-sm mb-3 sm:mb-5">
              Hospitality Department
            </p>

            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black leading-tight">
              अतिथि <br />
              <span className="bg-gradient-to-r from-pink-400 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
                देवो भवः
              </span>
            </h1>

            <p className="mt-4 sm:mt-8 text-gray-300 text-sm sm:text-lg leading-relaxed max-w-xl">
              Every guest carries an experience that defines Paradox 2026.
              Let us welcome them with warmth, respect, care, and unforgettable hospitality.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-6 sm:mt-10">
              <button
                onClick={() => router.push("/auth/login")}
                className="group w-full sm:w-auto px-5 sm:px-7 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,20,147,0.6)] flex items-center justify-center gap-3 text-sm sm:text-base"
              >
                Enter Portal
                <ArrowRight className="group-hover:translate-x-1 transition-all duration-300" />
              </button>

              <button className="w-full sm:w-auto px-5 sm:px-7 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-pink-500/50 hover:bg-pink-500/10 transition-all duration-300 text-sm sm:text-base">
                Explore Team
              </button>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative flex justify-center mt-6 md:mt-0"
          >
            <div className="absolute w-[180px] sm:w-[350px] h-[180px] sm:h-[350px] bg-pink-500/20 blur-[70px] sm:blur-[100px] rounded-full" />

            <Image
              src="/paradox-text.png"
              alt="Paradox"
              width={420}
              height={420}
              className="sm:w-[650px] sm:h-[650px] relative z-10 drop-shadow-[0_0_40px_rgba(255,20,147,0.8)]"
            />
          </motion.div>
        </div>
      </section>

      {/* QUOTES */}
      <section className="relative z-10 px-4 sm:px-6 md:px-20 pb-14 sm:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          {[
            "Guests may forget the event, but they never forget how they were treated.",
            "Hospitality is not a task. It is a reflection of our culture.",
            "Every pickup, every room arrangement, every smile creates memories.",
          ].map((quote, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              className="backdrop-blur-xl bg-white/5 border border-pink-500/20 rounded-2xl sm:rounded-3xl p-5 sm:p-8 hover:border-pink-500 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,20,147,0.3)]"
            >
              <div className="text-3xl sm:text-5xl text-pink-500 mb-3 sm:mb-5">“</div>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-lg">
                {quote}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="relative z-10 px-4 sm:px-6 md:px-20 pb-16 sm:pb-28">
        <div className="rounded-2xl sm:rounded-[40px] border border-pink-500/20 bg-gradient-to-br from-pink-500/10 to-fuchsia-500/5 backdrop-blur-2xl p-6 sm:p-10 md:p-16 relative overflow-hidden">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,0,128,0.18),transparent_40%)]" />

          <div className="relative z-10 max-w-4xl">
            <p className="uppercase tracking-[0.25em] sm:tracking-[0.4em] text-pink-400 text-[10px] sm:text-sm mb-3 sm:mb-4">
              Team Spirit
            </p>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight mb-5 sm:mb-8">
              Together, we create{" "}
              <span className="bg-gradient-to-r from-pink-400 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
                comfort, warmth & unforgettable experiences.
              </span>
            </h2>

            <p className="text-gray-300 text-sm sm:text-lg leading-relaxed">
              Hospitality is the heart of Paradox 2026. From welcoming artists and guests to ensuring smooth stays,
              every small effort matters.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-pink-500/10 py-5 sm:py-8 px-4 sm:px-6 md:px-20 text-center text-gray-500 text-xs sm:text-base">
        <p>Paradox 2026 • Hospitality Portal • Built with dedication & teamwork</p>
      </footer>
    </main>
  );
}