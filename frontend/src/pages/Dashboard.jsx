import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import RecentContracts from "../components/RecentContracts";
import ActivityCard from "../components/ActivityCard";
import Footer from "../components/Footer";
import { listContracts } from "../api/contracts";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {

  const { user } = useAuth();

  const firstName = user?.name?.split(" ")[0]?.replace(/^\w/, (c) => c.toUpperCase());

  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    listContracts()
      .then(setContracts)
      .catch((err) => console.error("Failed to load contracts:", err))
      .finally(() => setLoading(false));

  }, []);

  const completed = contracts.filter((c) => c.status === "SUCCESS");
  const highRisk = completed.filter((c) => c.risk_level === "High");

  const averageRisk = completed.length
    ? Math.round(
        completed.reduce((sum, c) => sum + (c.risk_score || 0), 0) / completed.length
      )
    : 0;

  const stats = [
    {
      title: "Contracts",
      value: contracts.length,
      icon: <FileText size={28} />,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      title: "Average Risk Score",
      value: averageRisk,
      icon: <AlertTriangle size={28} />,
      color: "bg-red-100 text-red-500",
    },
    {
      title: "High Risk Contracts",
      value: highRisk.length,
      icon: <ShieldAlert size={28} />,
      color: "bg-amber-100 text-amber-600",
    },
    {
      title: "Completed",
      value: completed.length,
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

          <h1 className="section-title">

            Welcome Back{firstName ? `, ${firstName}` : ""} 👋

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
              value={loading ? "-" : item.value}
              icon={item.icon}
              color={item.color}
            />

          ))}

        </div>

        {/* CONTENT */}

        <div className="grid lg:grid-cols-3 gap-8 mt-20">

          <div className="lg:col-span-2">

            <RecentContracts contracts={contracts} loading={loading} limit={5} />

          </div>

          <ActivityCard contracts={contracts} loading={loading} />

        </div>

      </div>

      <Footer />

    </div>
  );
}
