import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight
} from "lucide-react";

export default function Login() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = (e) => {

    e.preventDefault();

    // Later we'll connect FastAPI login API

    navigate("/dashboard");

  };

  return (

    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-16">

      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-blue-50"></div>

      <motion.div

        initial={{ opacity: 0, y: 40 }}

        animate={{ opacity: 1, y: 0 }}

        transition={{ duration: .6 }}

        className="grid w-full max-w-6xl overflow-hidden rounded-[40px] bg-white shadow-2xl lg:grid-cols-2"

      >

        {/* LEFT */}

        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 p-16 text-white">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">

              <ShieldCheck size={34} />

            </div>

            <div>

              <h1 className="text-4xl font-black">

                ContractIQ

              </h1>

              <p className="mt-1 text-indigo-100">

                AI Powered Contract Intelligence

              </p>

            </div>

          </div>

          <h2 className="mt-16 text-5xl font-black leading-tight">

            Analyze contracts in seconds.

          </h2>

          <p className="mt-8 text-lg leading-9 text-indigo-100">

            Upload agreements, detect risky clauses,
            extract entities, generate summaries,
            and receive AI insights instantly.

          </p>

          <div className="mt-16 space-y-5">

            {[
              "AI Risk Detection",
              "Automatic Clause Extraction",
              "Entity Recognition",
              "Executive Summary"
            ].map((item) => (

              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur"
              >

                <ShieldCheck size={20} />

                <span className="font-medium">

                  {item}

                </span>

              </div>

            ))}

          </div>

        </div>

        {/* RIGHT */}

        <div className="flex items-center justify-center p-10 lg:p-16">

          <div className="w-full max-w-md">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl">

              <ShieldCheck size={32} />

            </div>

            <h1 className="mt-8 text-center text-4xl font-black">

              Welcome Back

            </h1>

            <p className="mt-4 text-center text-slate-500">

              Sign in to continue using ContractIQ.

            </p>

            <form
              onSubmit={handleLogin}
              noValidate
              className="mt-10 space-y-6"
            >

              <div>

                <label className="font-semibold">

                  Email Address

                </label>

                <div className="relative mt-3">

                  <Mail
                    className="absolute left-5 top-4 text-slate-400"
                    size={20}
                  />

                  <input

                    type="email"

                    value={email}

                    onChange={(e) => setEmail(e.target.value)}

                    placeholder="Enter your email"

                    className="input pl-14"

                  />

                </div>

              </div>

              <div>

                <label className="font-semibold">

                  Password

                </label>

                <div className="relative mt-3">

                  <Lock
                    className="absolute left-5 top-4 text-slate-400"
                    size={20}
                  />

                  <input

                    type={showPassword ? "text" : "password"}

                    value={password}

                    onChange={(e) => setPassword(e.target.value)}

                    placeholder="Enter your password"

                    className="input pl-14 pr-14"

                  />

                  <button

                    type="button"

                    onClick={() => setShowPassword(!showPassword)}

                    className="absolute right-5 top-4 text-slate-400"

                  >

                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}

                  </button>

                </div>

              </div>
                            <div className="flex items-center justify-between">

                <label className="flex items-center gap-3 cursor-pointer">

                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-indigo-600"
                  />

                  <span className="text-sm text-slate-600">

                    Remember Me

                  </span>

                </label>

                <button

                  type="button"

                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"

                >

                  Forgot Password?

                </button>

              </div>

              <motion.button

                whileHover={{
                  scale: 1.02
                }}

                whileTap={{
                  scale: .98
                }}

                type="submit"

                className="primary-btn w-full justify-center text-lg"

              >

                Login

                <ArrowRight size={20} />

              </motion.button>

            </form>

            {/* Divider */}

            <div className="my-8 flex items-center">

              <div className="h-px flex-1 bg-slate-200"></div>

              <span className="px-4 text-sm text-slate-400">

                OR

              </span>

              <div className="h-px flex-1 bg-slate-200"></div>

            </div>

            <button

              className="w-full rounded-2xl border border-slate-300 bg-white py-4 font-semibold transition hover:bg-slate-50"

            >

              Continue with Google

            </button>

            <p className="mt-10 text-center text-slate-500">

              Don't have an account?

              <Link

                to="/register"

                className="ml-2 font-bold text-indigo-600 hover:text-indigo-700"

              >

                Create Account

              </Link>

            </p>

          </div>

        </div>

      </motion.div>

    </div>

  );

}