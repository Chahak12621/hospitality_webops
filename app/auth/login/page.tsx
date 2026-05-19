"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [requiresPassword, setRequiresPassword] = useState(false);

  // ─────────────────────────────────────────────
  // LOGIN
  // ─────────────────────────────────────────────
  const checkIfPasswordRequired = async (
    value: string
  ) => {

    const trimmed =
      value.trim().toLowerCase();

    if (!trimmed) {
      setRequiresPassword(false);
      return;
    }

    // CHECK PARADOX
    const { data: paradox } = await supabase
      .from("paradox")
      .select("id")
      .eq("mail", trimmed)
      .maybeSingle();

    if (paradox) {
      setRequiresPassword(true);
      return;
    }

    // CHECK ADMIN
    const { data: admin } = await supabase
      .from("admins")
      .select("id")
      .eq("email", trimmed)
      .maybeSingle();

    if (admin) {
      setRequiresPassword(true);
      return;
    }

    setRequiresPassword(false);
  };

  const handleLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      alert("Please enter email");
      return;
    }

    try {
      setLoading(true);

      // --------- Check Paradox Team ---------
      const { data: paradox } = await supabase
        .from("paradox")
        .select("*")
        .eq("mail", trimmedEmail)
        .maybeSingle();

      if (paradox) {

        // PASSWORD CHECK
        if (paradox.password !== password) {
          alert("Invalid password");
          return;
        }

        let department = "";

        if (trimmedEmail === "sports@iitmparadox.org") {
          department = "sports";
        }

        else if (trimmedEmail === "technicals@iitmparadox.org") {
          department = "technical";
        }

        else if (trimmedEmail === "culturals@iitmparadox.org") {
          department = "cultural";
        }

        else if (trimmedEmail === "professionals@iitmparadox.org") {
          department = "open";
        }

        sessionStorage.setItem(
          "portal_email",
          trimmedEmail
        );

        sessionStorage.setItem(
          "portal_role",
          "paradox_team"
        );

        sessionStorage.setItem(
          "portal_department",
          department
        );

        router.push("/dashboard/events");

        return;
      }
      // ───────── CHECK ADMIN ─────────
      const { data: admin } = await supabase
        .from("admins")
        .select("*")
        .eq("email", trimmedEmail)
        .maybeSingle();

      if (admin) {

        // PASSWORD CHECK
        if (admin.password !== password) {
          alert("Invalid password");
          return;
        }

        sessionStorage.setItem(
          "portal_email",
          trimmedEmail
        );

        sessionStorage.setItem(
          "portal_role",
          "admin"
        );

        router.push("/dashboard/admin");

        return;
      }
      // ───────── CHECK EVENT HEAD ─────────
      const { data: eventHead } = await supabase
        .from("event_heads")
        .select("*")
        .eq("email", trimmedEmail)
        .maybeSingle();

      if (eventHead) {
        sessionStorage.setItem(
          "portal_email",
          trimmedEmail
        );

        sessionStorage.setItem(
          "portal_role",
          "event_head"
        );

        router.push("/dashboard/event-head");
        return;
      }

      // ───────── CHECK CORE TEAM ─────────
      const { data: coreMember } = await supabase
        .from("core_team")
        .select("*")
        .eq("email", trimmedEmail)
        .maybeSingle();

      if (coreMember) {
        sessionStorage.setItem(
          "portal_email",
          trimmedEmail
        );

        sessionStorage.setItem(
          "portal_role",
          "core_team"
        );

        router.push("/dashboard/core-team");
        return;
      }

      // ───────── NO ACCESS ─────────
      alert("You are not authorized");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // ENTER KEY
  // ─────────────────────────────────────────────
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6 py-10 text-[#0b0705]">

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#d0e7dd,#fdcbca,#ebdbe6,#ffe8b5,#d8d0e8)] bg-[length:300%_300%] animate-[gradientShift_20s_ease_infinite]" />

      <div className="absolute left-[-120px] top-[-100px] h-[350px] w-[350px] rounded-full bg-[#f56483]/30 blur-3xl" />

      <div className="absolute bottom-[-100px] right-[-100px] h-[350px] w-[350px] rounded-full bg-[#703c84]/20 blur-3xl" />

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[40px] border border-white/40 bg-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl md:grid md:grid-cols-2"
      >

        {/* LEFT */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#ebdbe6] to-[#fcc4b7] p-10 md:flex">

          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-[#703c84]">
              Paradox 2026
            </p>

            <h1 className="mt-6 text-5xl font-black leading-tight text-[#703c84]">
              Welcome
              <span className="block bg-gradient-to-r from-[#f56483] to-[#703c84] bg-clip-text text-transparent">
                Back
              </span>
            </h1>

            <p className="mt-8 max-w-md text-lg leading-9 text-[#3d3144]">

              Paradox celebrates every hidden spectrum within them.
            </p>
          </div>

          <p className="italic text-[#703c84]">
            "Your authentic self is contradictory to society's norms."
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col justify-center p-8 sm:p-12">

          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#703c84]">
            Hospitality Portal
          </p>

          <h2 className="text-4xl font-black text-[#0b0705]">
            Login
          </h2>

          <p className="mt-4 leading-8 text-[#3d3144]">
            Enter your registered email address.
          </p>

          {/* EMAIL */}
          <div className="mt-10">

            <label className="mb-3 block text-sm font-medium text-[#3d3144]">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={async (e) => {
                const value = e.target.value;

                setEmail(value);

                if (value.trim()) {
                  await checkIfPasswordRequired(value);
                } else {
                  setRequiresPassword(false);
                }
              }}
            onKeyDown={handleKeyDown}
            placeholder="Enter your email"
            autoComplete="off"
            className="w-full rounded-2xl border border-white/40 bg-white/50 px-5 py-4 outline-none backdrop-blur-md transition focus:border-[#703c84]"
            />
          </div>
          {/* PASSWORD */}
          {/* PASSWORD */}
          {requiresPassword && (
            <div className="mt-6">

              <label className="mb-3 block text-sm font-medium text-[#3d3144]">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Enter your password"
                autoComplete="off"
                className="w-full rounded-2xl border border-white/40 bg-white/50 px-5 py-4 outline-none backdrop-blur-md transition focus:border-[#703c84]"
              />
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#f56483] px-6 py-4 font-semibold text-white shadow-[0_15px_40px_rgba(245,100,131,0.35)] transition duration-300 hover:scale-[1.02] hover:bg-[#ea4f74]"
          >

            {loading ? "Checking..." : "Continue"}

            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="mt-6 text-sm leading-7 text-[#5b4a62]">
            Only authorized members can access this portal.
          </p>
        </div>
      </motion.div>

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