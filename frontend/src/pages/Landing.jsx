import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  FileText,
  Brain,
  ScanSearch,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Landing() {

  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F7F8FC] text-slate-900">

      {/* BACKGROUND BLOBS */}

      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-300/30 blur-[120px]"
      />

      <motion.div
        animate={{
          x: [0, -60, 0],
          y: [0, 70, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-0 top-0 h-[450px] w-[450px] rounded-full bg-sky-300/30 blur-[120px]"
      />

      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, -60, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-emerald-300/20 blur-[120px]"
      />

      {/* NAVBAR */}

      <header className="fixed left-0 right-0 top-0 z-50 flex justify-center pt-5">

        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex w-[92%] max-w-7xl items-center justify-between rounded-2xl border border-white/50 bg-white/70 px-8 py-4 backdrop-blur-xl shadow-xl"
        >

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">

              <ShieldCheck size={24} />

            </div>

            <div>

              <h1 className="text-xl font-black tracking-tight">

                ContractIQ

              </h1>

              <p className="text-xs text-slate-500">

                AI Contract Intelligence

              </p>

            </div>

          </div>

          <nav className="hidden gap-10 font-medium lg:flex">

            <a href="#features" className="hover:text-indigo-600 transition">

              Features

            </a>

            <a href="#workflow" className="hover:text-indigo-600 transition">

              Workflow

            </a>

            <a href="#about" className="hover:text-indigo-600 transition">

              About

            </a>

            <a href="#contact" className="hover:text-indigo-600 transition">

              Contact

            </a>

          </nav>

          <div className="hidden items-center gap-4 lg:flex">

            {isAuthenticated ? (

              <Link
                to="/dashboard"
                className="group flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-indigo-700"
              >

                Go to Dashboard

                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />

              </Link>

            ) : (

              <>

                <Link
                  to="/login"
                  className="rounded-xl px-5 py-3 font-semibold transition hover:bg-slate-100"
                >

                  Login

                </Link>

                <Link
                  to="/register"
                  className="group flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-indigo-700"
                >

                  Get Started

                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />

                </Link>

              </>

            )}

          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden"
          >

            {menuOpen ? <X /> : <Menu />}

          </button>

        </motion.div>

      </header>

      {/* MOBILE MENU */}

      {menuOpen && (

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-28 left-4 right-4 z-40 rounded-2xl bg-white shadow-xl border border-slate-200 p-6 lg:hidden"
        >

          <div className="flex flex-col gap-5">

            <a href="#features">Features</a>

            <a href="#workflow">Workflow</a>

            <a href="#about">About</a>

            {isAuthenticated ? (

              <Link
                to="/dashboard"
                className="rounded-xl bg-indigo-600 py-3 text-center text-white font-semibold"
              >

                Go to Dashboard

              </Link>

            ) : (

              <>

                <Link to="/login">Login</Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-indigo-600 py-3 text-center text-white font-semibold"
                >

                  Get Started

                </Link>

              </>

            )}

          </div>

        </motion.div>

      )}

      {/* HERO */}

      <section className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-8 pt-32 lg:flex-row">

        {/* LEFT */}

        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex-1"
        >

          <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-indigo-100 px-5 py-3">

            <Sparkles className="text-indigo-600" size={18} />

            <span className="font-semibold text-indigo-700">

              AI Powered Legal Intelligence

            </span>

          </div>

          <h1 className="text-6xl font-black leading-tight tracking-tight lg:text-7xl">

            Analyze

            <br />

            Contracts

            <br />

            <span className="bg-gradient-to-r from-indigo-600 via-blue-500 to-emerald-500 bg-clip-text text-transparent">

              Smarter.

            </span>

          </h1>

          <p className="mt-8 max-w-xl text-xl leading-9 text-slate-600">

            Upload any legal contract and let AI extract clauses,
            calculate risk, summarize content and identify key entities
            within seconds.

          </p>

          <div className="mt-12 flex flex-wrap gap-5">

            <Link
              to="/upload"
              className="group flex items-center gap-3 rounded-2xl bg-indigo-600 px-8 py-5 text-lg font-semibold text-white shadow-xl transition hover:-translate-y-1 hover:bg-indigo-700"
            >

              Start Analysis

              <ArrowRight
                className="transition group-hover:translate-x-2"
                size={22}
              />

            </Link>

            <button className="rounded-2xl border border-slate-300 bg-white px-8 py-5 text-lg font-semibold transition hover:-translate-y-1 hover:shadow-lg">

              Watch Demo

            </button>

          </div>

          <div className="mt-14 flex flex-wrap gap-8">

            <div className="flex items-center gap-3">

              <ShieldCheck className="text-emerald-500" />

              Secure Analysis

            </div>

            <div className="flex items-center gap-3">

              <Brain className="text-indigo-500" />

              AI Driven

            </div>

            <div className="flex items-center gap-3">

              <ScanSearch className="text-sky-500" />

              Smart Detection

            </div>

          </div>

        </motion.div>
                {/* RIGHT */}

        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative mt-20 flex flex-1 justify-center lg:mt-0"
        >

          {/* Floating PDF */}

          <motion.div
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="absolute left-0 top-8 z-30 w-52 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-2xl backdrop-blur-xl"
          >

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-red-100 p-3">

                <FileText className="text-red-500" />

              </div>

              <div>

                <h2 className="font-bold">

                  Employment.pdf

                </h2>

                <p className="text-sm text-slate-500">

                  Uploaded

                </p>

              </div>

            </div>

          </motion.div>

          {/* Floating Risk */}

          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
            className="absolute right-0 top-28 z-30 w-52 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-2xl backdrop-blur-xl"
          >

            <p className="text-sm text-slate-500">

              Risk Score

            </p>

            <h1 className="mt-2 text-5xl font-black text-emerald-500">

              18%

            </h1>

            <div className="mt-3 h-2 rounded-full bg-slate-200">

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "18%" }}
                transition={{ duration: 2 }}
                className="h-2 rounded-full bg-emerald-500"
              />

            </div>

          </motion.div>

          {/* Main Dashboard */}

          <motion.div
            whileHover={{
              y: -10,
            }}
            transition={{
              duration: .4,
            }}
            className="glass relative mt-20 w-full max-w-lg rounded-[35px] border border-white/60 bg-white/75 p-8 shadow-[0_40px_90px_rgba(0,0,0,.15)] backdrop-blur-xl"
          >

            {/* Header */}

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-black">

                  Contract Analysis

                </h2>

                <p className="text-slate-500">

                  AI Generated Report

                </p>

              </div>

              <div className="rounded-xl bg-indigo-100 p-3">

                <Brain
                  className="text-indigo-600"
                  size={28}
                />

              </div>

            </div>

            {/* Risk */}

            <div className="mt-8 rounded-3xl bg-gradient-to-r from-indigo-500 to-blue-500 p-6 text-white">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm opacity-80">

                    Overall Risk

                  </p>

                  <h1 className="mt-2 text-5xl font-black">

                    Low

                  </h1>

                </div>

                <div className="text-6xl font-black">

                  18%

                </div>

              </div>

            </div>

            {/* Summary */}

            <div className="mt-8 rounded-2xl bg-slate-50 p-5">

              <h3 className="font-bold">

                Executive Summary

              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-500">

                Employment agreement between
                ABC Technologies and Rahul Sharma.
                AI detected payment, confidentiality,
                governing law and termination clauses.

              </p>

            </div>

            {/* Clause Pills */}

            <div className="mt-8 flex flex-wrap gap-3">

              {[
                "Payment",
                "Confidentiality",
                "Termination",
                "Governing Law",
              ].map((item) => (

                <motion.div
                  key={item}
                  whileHover={{
                    scale: 1.08,
                  }}
                  className="rounded-full bg-emerald-100 px-5 py-2 font-medium text-emerald-700"
                >

                  ✓ {item}

                </motion.div>

              ))}

            </div>

            {/* Statistics */}

            <div className="mt-10 grid grid-cols-2 gap-4">

              {[
                {
                  title: "Pages",
                  value: "8",
                },
                {
                  title: "Entities",
                  value: "21",
                },
                {
                  title: "Clauses",
                  value: "14",
                },
                {
                  title: "Confidence",
                  value: "98%",
                },
              ].map((item) => (

                <motion.div
                  whileHover={{
                    scale: 1.05,
                  }}
                  key={item.title}
                  className="rounded-2xl bg-slate-50 p-5"
                >

                  <p className="text-sm text-slate-500">

                    {item.title}

                  </p>

                  <h2 className="mt-2 text-3xl font-black">

                    {item.value}

                  </h2>

                </motion.div>

              ))}

            </div>

          </motion.div>

        </motion.div>

      </section>
            {/* FEATURES */}

      <section
        id="features"
        className="mx-auto max-w-7xl px-8 py-24"
      >

        <motion.div
          initial={{opacity:0,y:50}}
          whileInView={{opacity:1,y:0}}
          viewport={{once:true}}
          transition={{duration:.7}}
          className="text-center"
        >

          <span className="rounded-full bg-indigo-100 px-5 py-2 font-semibold text-indigo-700">

            Why ContractIQ?

          </span>

          <h2 className="mt-8 text-5xl font-black">

            Everything You Need

            <span className="text-indigo-600">

              {" "}For Smart Contracts

            </span>

          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-slate-500">

            From uploading legal contracts to extracting clauses,
            calculating risk scores and generating AI summaries,
            ContractIQ simplifies the entire review process.

          </p>

        </motion.div>

        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {[
            {
              icon:"📄",
              title:"Smart Upload",
              desc:"Upload PDF contracts instantly with drag & drop."
            },
            {
              icon:"🧠",
              title:"AI Summary",
              desc:"Get concise executive summaries in seconds."
            },
            {
              icon:"⚠️",
              title:"Risk Detection",
              desc:"Automatically identify risky clauses."
            },
            {
              icon:"📊",
              title:"Analytics",
              desc:"View entities, statistics and insights beautifully."
            }
          ].map((item,index)=>(

            <motion.div

              key={index}

              initial={{opacity:0,y:40}}

              whileInView={{opacity:1,y:0}}

              viewport={{once:true}}

              transition={{delay:index*.15}}

              whileHover={{
                y:-10,
                scale:1.03
              }}

              className="rounded-3xl bg-white p-8 shadow-xl border border-slate-200"

            >

              <div className="text-5xl">

                {item.icon}

              </div>

              <h3 className="mt-6 text-2xl font-bold">

                {item.title}

              </h3>

              <p className="mt-4 leading-8 text-slate-500">

                {item.desc}

              </p>

            </motion.div>

          ))}

        </div>

      </section>

      {/* WORKFLOW */}

      <section
        id="workflow"
        className="bg-white py-24"
      >

        <div className="mx-auto max-w-7xl px-8">

          <motion.div

            initial={{opacity:0}}

            whileInView={{opacity:1}}

            viewport={{once:true}}

            className="text-center"

          >

            <span className="rounded-full bg-emerald-100 px-5 py-2 font-semibold text-emerald-700">

              AI Workflow

            </span>

            <h2 className="mt-8 text-5xl font-black">

              Four Simple Steps

            </h2>

          </motion.div>

          <div className="mt-24 grid gap-10 lg:grid-cols-4">

            {[
              "Upload Contract",
              "AI Processing",
              "Risk Analysis",
              "Download Report"
            ].map((step,index)=>(

              <motion.div

                key={step}

                initial={{opacity:0,y:50}}

                whileInView={{opacity:1,y:0}}

                viewport={{once:true}}

                transition={{delay:index*.2}}

                className="relative"

              >

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-3xl font-black text-white shadow-xl">

                  {index+1}

                </div>

                <h3 className="mt-8 text-center text-2xl font-bold">

                  {step}

                </h3>

                {index!==3 && (

                  <div className="absolute left-[70%] top-10 hidden h-1 w-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 lg:block"/>

                )}

              </motion.div>

            ))}

          </div>

        </div>

      </section>

      {/* CTA */}

      <section
        id="about"
        className="mx-auto max-w-7xl px-8 py-28"
      >

        <motion.div

          initial={{opacity:0,scale:.9}}

          whileInView={{opacity:1,scale:1}}

          viewport={{once:true}}

          className="rounded-[40px] bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 p-16 text-center text-white shadow-[0_40px_100px_rgba(79,70,229,.4)]"

        >

          <h2 className="text-5xl font-black">

            Ready to Analyze Your Contracts?

          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-white/90">

            Experience AI-powered legal intelligence with beautiful
            dashboards, automated summaries and risk detection.

          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-6">

            {isAuthenticated ? (

              <Link

                to="/upload"

                className="rounded-2xl bg-white px-8 py-5 text-lg font-bold text-indigo-700 transition hover:-translate-y-1"

              >

                Upload a Contract

              </Link>

            ) : (

              <>

                <Link

                  to="/register"

                  className="rounded-2xl bg-white px-8 py-5 text-lg font-bold text-indigo-700 transition hover:-translate-y-1"

                >

                  Start Free

                </Link>

                <Link

                  to="/login"

                  className="rounded-2xl border border-white/50 px-8 py-5 text-lg font-bold transition hover:bg-white/10"

                >

                  Login

                </Link>

              </>

            )}

          </div>

        </motion.div>

      </section>

      {/* FOOTER */}

      <footer
        id="contact"
        className="border-t border-slate-200 bg-white py-10"
      >

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-8 text-center lg:flex-row">

          <div>

            <h2 className="text-2xl font-black">

              ContractIQ

            </h2>

            <p className="mt-2 text-slate-500">

              AI Powered Contract Intelligence Platform

            </p>

          </div>

          <div className="flex gap-8 font-medium text-slate-500">

            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#about">About</a>

          </div>

          <p className="text-slate-400">

            © 2026 ContractIQ. All Rights Reserved.

          </p>

        </div>

      </footer>

    </div>

  );

}