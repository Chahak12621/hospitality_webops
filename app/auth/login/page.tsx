"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [isSignup, setIsSignup] = useState(false);

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: "coordinator",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // SIGN IN
  // =========================

  const handleSignIn = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      const user = data.user;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      // ROLE BASED REDIRECT

      if (profile.role === "superadmin") {
        router.push("/dashboard");
      }

      else if (profile.role === "coordinator") {
        router.push("/dashboard");
      }

      else if (profile.role === "event_head") {
        router.push("/dashboard/my-guests");
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SIGN UP
  // =========================

  const handleSignUp = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      const user = data.user;

      if (!user) return;

      // INSERT INTO PROFILES

      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: user.id,
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
          },
        ]);

      if (profileError) {
        console.log(profileError);
        alert(profileError.message);
        return;
      }

      alert("Account created successfully!");

      router.push("/dashboard");

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center px-6 py-10">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-pink-500/20 blur-[120px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-fuchsia-500/20 blur-[120px] rounded-full" />

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 rounded-[40px] overflow-hidden border border-pink-500/20 backdrop-blur-2xl bg-white/5 shadow-[0_0_50px_rgba(255,20,147,0.15)]"
      >

        {/* LEFT */}
        <div className="hidden md:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-pink-500/10 to-fuchsia-500/5">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,0,128,0.2),transparent_45%)]" />

          <div className="relative z-10">

            <div className="flex items-center gap-4">

              <Image
                src="/logo.png"
                alt="logo"
                width={65}
                height={65}
                className="drop-shadow-[0_0_25px_rgba(255,20,147,0.8)]"
              />

              <h1 className="text-4xl font-black bg-gradient-to-r from-pink-400 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
                Paradox 2026
              </h1>
            </div>

            <h2 className="text-5xl font-black leading-tight mt-16">
              अतिथि
              <br />

              <span className="bg-gradient-to-r from-pink-400 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
                देवो भवः
              </span>
            </h2>

            <p className="text-gray-300 leading-relaxed mt-8 text-lg">
              Every guest deserves warmth, comfort and respect.
              Let us work together to create unforgettable experiences.
            </p>
          </div>

          <div className="relative z-10">
            <p className="text-pink-400 text-lg italic">
              “Hospitality is not a responsibility —
              it is the soul of Paradox.”
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="p-8 md:p-14 flex flex-col justify-center">

          <div className="mb-10">

            <p className="uppercase tracking-[0.35em] text-pink-400 text-sm mb-4">
              Hospitality Portal
            </p>

            <h2 className="text-4xl font-black">

              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>

            <p className="text-gray-400 mt-3">
              {isSignup
                ? "Join the hospitality team."
                : "Sign in to continue."}
            </p>
          </div>

          {/* SIGNUP ONLY */}
          {isSignup && (
            <>
              <div className="mb-5">
                <label className="text-sm text-gray-300 mb-2 block">
                  Full Name
                </label>

                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full bg-black/40 border border-pink-500/20 focus:border-pink-500 rounded-2xl px-5 py-4 outline-none"
                />
              </div>

              <div className="mb-5">
                <label className="text-sm text-gray-300 mb-2 block">
                  Contact Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                  className="w-full bg-black/40 border border-pink-500/20 focus:border-pink-500 rounded-2xl px-5 py-4 outline-none"
                />
              </div>

              <div className="mb-5">
                <label className="text-sm text-gray-300 mb-2 block">
                  Select Role
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-pink-500/20 focus:border-pink-500 rounded-2xl px-5 py-4 outline-none"
                >
                  <option value="coordinator">
                    Coordinator / Volunteer
                  </option>

                  <option value="event_head">
                    Event Head
                  </option>
                </select>
              </div>
            </>
          )}

          {/* EMAIL */}
          <div className="mb-5">
            <label className="text-sm text-gray-300 mb-2 block">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full bg-black/40 border border-pink-500/20 focus:border-pink-500 rounded-2xl px-5 py-4 outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-7">
            <label className="text-sm text-gray-300 mb-2 block">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full bg-black/40 border border-pink-500/20 focus:border-pink-500 rounded-2xl px-5 py-4 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={isSignup ? handleSignUp : handleSignIn}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 font-semibold hover:scale-[1.02] transition-all duration-300 shadow-[0_0_35px_rgba(255,20,147,0.4)]"
          >
            {loading
              ? "Please wait..."
              : isSignup
              ? "Create Account"
              : "Sign In"}
          </button>

          {/* TOGGLE */}
          <div className="mt-8 text-center text-gray-400">

            {isSignup ? (
              <>
                Already have an account?{" "}

                <button
                  onClick={() => setIsSignup(false)}
                  className="text-pink-400 hover:text-pink-300"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                New here?{" "}

                <button
                  onClick={() => setIsSignup(true)}
                  className="text-pink-400 hover:text-pink-300"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </main>
  );
}