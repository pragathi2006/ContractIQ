import { motion } from "framer-motion";
import {
  UploadCloud,
  Brain,
  AlertTriangle,
  FileCheck,
  Loader2,
} from "lucide-react";

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function buildActivity(contract) {

  if (contract.status === "SUCCESS") {

    if (contract.risk_level === "High") {
      return {
        icon: <AlertTriangle size={22} />,
        title: "High Risk Contract Detected",
        description: contract.filename,
        color: "bg-red-100 text-red-500",
      };
    }

    return {
      icon: <FileCheck size={22} />,
      title: "Analysis Completed",
      description: `${contract.filename} · Risk: ${contract.risk_level || "Unknown"}`,
      color: "bg-emerald-100 text-emerald-600",
    };
  }

  if (contract.status === "FAILURE") {
    return {
      icon: <AlertTriangle size={22} />,
      title: "Analysis Failed",
      description: contract.filename,
      color: "bg-red-100 text-red-500",
    };
  }

  return {
    icon: <Loader2 size={22} className="animate-spin" />,
    title: "Processing",
    description: contract.filename,
    color: "bg-blue-100 text-blue-600",
  };
}

export default function ActivityCard({ contracts = [], loading = false }) {

  const activities = contracts.slice(0, 6).map((contract) => ({
    ...buildActivity(contract),
    time: timeAgo(contract.created_at),
    id: contract.id,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card"
    >
      <div>

        <p className="text-slate-500 text-sm">

          Live Updates

        </p>

        <h2 className="mt-2 text-3xl font-black">

          Recent Activity

        </h2>

      </div>

      <div className="mt-8 space-y-6">

        {loading ? (

          <div className="flex items-center justify-center rounded-2xl bg-slate-50 p-10 text-slate-400">
            <Loader2 className="animate-spin" size={28} />
          </div>

        ) : activities.length === 0 ? (

          <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
            No activity yet — upload a contract to get started.
          </div>

        ) : (

          activities.map((activity) => (

            <motion.div
              key={activity.id}
              whileHover={{
                x: 5,
              }}
              className="flex gap-5"
            >

              <div
                className={`h-12 w-12 rounded-2xl flex items-center justify-center ${activity.color}`}
              >
                {activity.icon}
              </div>

              <div className="flex-1">

                <h3 className="font-bold">

                  {activity.title}

                </h3>

                <p className="mt-1 text-slate-500 text-sm truncate">

                  {activity.description}

                </p>

              </div>

              <span className="text-xs text-slate-400 whitespace-nowrap">

                {activity.time}

              </span>

            </motion.div>

          ))

        )}

      </div>
    </motion.div>
  );
}
