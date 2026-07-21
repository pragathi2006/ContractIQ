import { motion } from "framer-motion";
import {
  FileText,
  AlertTriangle,
  Brain,
  CheckCircle2,
} from "lucide-react";

import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import RecentContracts from "../components/RecentContracts";
import ActivityCard from "../components/ActivityCard";
import Footer from "../components/Footer";

export default function Dashboard() {
  const stats = [
    {
      title: "Contracts",
      value: "124",
      icon: <FileText size={28} />,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      title: "Average Risk",
      value: "24%",
      icon: <AlertTriangle size={28} />,
      color: "bg-red-100 text-red-500",
    },
    {
      title: "AI Accuracy",
      value: "98%",
      icon: <Brain size={28} />,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Completed",
      value: "118",
      icon: <CheckCircle2 size={28} />,
      color: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FC] relative overflow-hidden">

      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>

      <Navbar />

      <div className="section">

        {/* HERO */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
        >

          <h1 className="hero-title">

            Welcome Back 👋

          </h1>

          <p className="subtitle mt-6 max-w-2xl">

            Manage contracts, analyze legal documents,
            review AI insights and monitor risks from
            one intelligent dashboard.

          </p>

        </motion.div>

        {/* STATS */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mt-16">

          {stats.map((item) => (

            <StatCard
              key={item.title}
              title={item.title}
              value={item.value}
              icon={item.icon}
              color={item.color}
            />

          ))}

        </div>

        {/* CONTENT */}

        <div className="grid lg:grid-cols-3 gap-8 mt-20">

          <div className="lg:col-span-2">

            <RecentContracts />

          </div>

          <ActivityCard />

        </div>

      </div>

      <Footer />

    </div>
  );
}