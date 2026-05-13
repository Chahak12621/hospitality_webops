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
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-500/20 blur-[140px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-fuchsia-500/20 blur-[140px] rounded-full" />

      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-6 md:px-12 py-6 relative z-20">

        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Paradox Logo"
            width={55}
            height={55}
            className="drop-shadow-[0_0_20px_rgba(255,0,150,0.9)]"
          />

          <h1 className="text-2xl md:text-3xl font-black tracking-widest bg-gradient-to-r from-pink-400 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
            Paradox 2026
          </h1>
        </div>

        <button
          onClick={() => router.push("/login")}
          className="border border-pink-500 px-5 py-2 rounded-full hover:bg-pink-500 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,20,147,0.7)]"
        >
          Login
        </button>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 px-6 md:px-20 pt-10 md:pt-24 pb-24">

        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >

            <p className="uppercase tracking-[0.4em] text-pink-400 text-sm mb-5">
              Hospitality Department
            </p>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              अतिथि <br />

              <span className="bg-gradient-to-r from-pink-400 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
                देवो भवः
              </span>
            </h1>

            <p className="mt-8 text-gray-300 text-lg leading-relaxed max-w-xl">
              Every guest carries an experience that defines Paradox 2026.
              Let us welcome them with warmth, respect, care,
              and unforgettable hospitality.
            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <button
                onClick={() => router.push("/login")}
                className="group px-7 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 hover:scale-105 transition-all duration-300 shadow-[0_0_35px_rgba(255,20,147,0.6)] flex items-center gap-3"
              >
                Enter Portal

                <ArrowRight className="group-hover:translate-x-1 transition-all duration-300" />
              </button>

              <button className="px-7 py-4 rounded-2xl border border-pink-500/50 hover:bg-pink-500/10 transition-all duration-300">
                Explore Team
              </button>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative flex justify-center"
          >

            <div className="absolute w-[350px] h-[350px] bg-pink-500/20 blur-[100px] rounded-full" />

            <Image
              src="/paradox-text.png"
              alt="Paradox"
              width={650}
              height={650}
              className="relative z-10 drop-shadow-[0_0_40px_rgba(255,20,147,0.8)]"
            />
          </motion.div>
        </div>
      </section>

      {/* QUOTES SECTION */}
      <section className="relative z-10 px-6 md:px-20 pb-24">

        <div className="grid md:grid-cols-3 gap-8">

          {[
            "Guests may forget the event, but they never forget how they were treated.",

            "Hospitality is not a task. It is a reflection of our culture.",

            "Every pickup, every room arrangement, every smile creates memories.",
          ].map((quote, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="backdrop-blur-xl bg-white/5 border border-pink-500/20 rounded-3xl p-8 hover:border-pink-500 transition-all duration-300 hover:shadow-[0_0_35px_rgba(255,20,147,0.3)]"
            >
              <div className="text-5xl text-pink-500 mb-5">“</div>

              <p className="text-gray-300 leading-relaxed text-lg">
                {quote}
              </p>
            </motion.div>
            
          ))}
        </div>
      </section>

      {/* TEAM SPIRIT SECTION */}
      <section className="relative z-10 px-6 md:px-20 pb-28">

        <div className="rounded-[40px] border border-pink-500/20 bg-gradient-to-br from-pink-500/10 to-fuchsia-500/5 backdrop-blur-2xl p-10 md:p-16 relative overflow-hidden">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,0,128,0.18),transparent_40%)]" />

          <div className="relative z-10 max-w-4xl">

            <p className="uppercase tracking-[0.4em] text-pink-400 text-sm mb-4">
              Team Spirit
            </p>

            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-8">
              Together, we create
              <span className="bg-gradient-to-r from-pink-400 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
                {" "}comfort, warmth & unforgettable experiences.
              </span>
            </h2>

            <p className="text-gray-300 text-lg leading-relaxed">
              Hospitality is the heart of Paradox 2026.
              From welcoming artists and guests to ensuring smooth stays,
              every small effort matters.
              Let us serve with respect, unity, and passion.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-pink-500/10 py-8 px-6 md:px-20 text-center text-gray-500">

        <p>
          Paradox 2026 • Hospitality Portal • Built with dedication & teamwork
        </p>
      </footer>
    </main>
  );
}