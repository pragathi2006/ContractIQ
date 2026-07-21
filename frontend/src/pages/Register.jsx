import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ShieldCheck,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight
} from "lucide-react";

export default function Register() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {

    e.preventDefault();

    if (password !== confirmPassword) {

      alert("Passwords do not match.");

      return;

    }

    /*
      Backend Integration

      await registerUser({
          name,
          email,
          password
      });

    */

    alert("Account created successfully!");

    navigate("/login");

  };

  return (

    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-16">

      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-blue-50"></div>

      <motion.div

        initial={{
          opacity:0,
          y:40
        }}

        animate={{
          opacity:1,
          y:0
        }}

        transition={{
          duration:.6
        }}

        className="grid w-full max-w-6xl overflow-hidden rounded-[40px] bg-white shadow-2xl lg:grid-cols-2"

      >

        {/* LEFT PANEL */}

        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 p-16 text-white">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">

              <ShieldCheck size={34} />

            </div>

            <div>

              <h1 className="text-4xl font-black">

                ContractIQ

              </h1>

              <p className="mt-2 text-indigo-100">

                AI Powered Contract Intelligence

              </p>

            </div>

          </div>

          <h2 className="mt-16 text-5xl font-black leading-tight">

            Create your ContractIQ account.

          </h2>

          <p className="mt-8 text-lg leading-9 text-indigo-100">

            Join thousands of professionals using AI
            to analyze contracts, identify risks,
            generate summaries and improve productivity.

          </p>

          <div className="mt-16 space-y-5">

            {[
              "Secure User Accounts",
              "AI Contract Analysis",
              "Clause Detection",
              "Executive Summaries"
            ].map((item) => (

              <div

                key={item}

                className="rounded-2xl bg-white/10 p-4"

              >

                ✓ {item}

              </div>

            ))}

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="flex items-center justify-center p-10 lg:p-16">

          <div className="w-full max-w-md">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl">

              <ShieldCheck size={32} />

            </div>

            <h1 className="mt-8 text-center text-4xl font-black">

              Create Account

            </h1>

            <p className="mt-4 text-center text-slate-500">

              Start analyzing contracts with AI.

            </p>

            <form

              onSubmit={handleRegister}

              className="mt-10 space-y-6"

            >

              <div>

                <label className="font-semibold">

                  Full Name

                </label>

                <div className="relative mt-3">

                  <User

                    className="absolute left-5 top-4 text-slate-400"

                    size={20}

                  />

                  <input

                    type="text"

                    value={name}

                    onChange={(e)=>setName(e.target.value)}

                    placeholder="Enter your full name"

                    className="input pl-14"

                    required

                  />

                </div>

              </div>

              <div>

                <label className="font-semibold">

                  Email

                </label>

                <div className="relative mt-3">

                  <Mail

                    className="absolute left-5 top-4 text-slate-400"

                    size={20}

                  />

                  <input

                    type="email"

                    value={email}

                    onChange={(e)=>setEmail(e.target.value)}

                    placeholder="Enter your email"

                    className="input pl-14"

                    required

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

                    type={showPassword ? "text":"password"}

                    value={password}

                    onChange={(e)=>setPassword(e.target.value)}

                    placeholder="Create password"

                    className="input pl-14 pr-14"

                    required

                  />

                  <button

                    type="button"

                    onClick={()=>setShowPassword(!showPassword)}

                    className="absolute right-5 top-4 text-slate-400"

                  >

                    {

                      showPassword

                      ?

                      <EyeOff size={20}/>

                      :

                      <Eye size={20}/>

                    }

                  </button>

                </div>

              </div>

              <div>

                <label className="font-semibold">

                  Confirm Password

                </label>

                <div className="relative mt-3">

                  <Lock

                    className="absolute left-5 top-4 text-slate-400"

                    size={20}

                  />

                  <input

                    type={showConfirmPassword ? "text":"password"}

                    value={confirmPassword}

                    onChange={(e)=>setConfirmPassword(e.target.value)}

                    placeholder="Confirm password"

                    className="input pl-14 pr-14"

                    required

                  />

                  <button

                    type="button"

                    onClick={()=>setShowConfirmPassword(!showConfirmPassword)}

                    className="absolute right-5 top-4 text-slate-400"

                  >

                    {

                      showConfirmPassword

                      ?

                      <EyeOff size={20}/>

                      :

                      <Eye size={20}/>

                    }

                  </button>

                </div>

              </div>
                            <motion.button

                whileHover={{
                  scale: 1.02
                }}

                whileTap={{
                  scale: 0.98
                }}

                type="submit"

                className="primary-btn w-full justify-center text-lg"

              >

                Create Account

                <ArrowRight size={20} />

              </motion.button>

            </form>

            <div className="mt-10 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">

              <h3 className="font-bold text-indigo-700">

                Why ContractIQ?

              </h3>

              <ul className="mt-4 space-y-2 text-sm text-slate-600">

                <li>✓ AI Powered Contract Analysis</li>

                <li>✓ Smart Risk Detection</li>

                <li>✓ Automatic Clause Extraction</li>

                <li>✓ Executive Summaries</li>

                <li>✓ Secure Document Processing</li>

              </ul>

            </div>

            <p className="mt-8 text-center text-slate-500">

              Already have an account?

              <Link

                to="/login"

                className="ml-2 font-bold text-indigo-600 hover:text-indigo-700"

              >

                Login

              </Link>

            </p>

          </div>

        </div>

      </motion.div>

    </div>

  );

}