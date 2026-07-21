import { motion } from "framer-motion";
import {
  UploadCloud,
  Brain,
  AlertTriangle,
  FileCheck,
} from "lucide-react";

const activities = [
  {
    icon: <UploadCloud size={22} />,
    title: "Contract Uploaded",
    description: "Employment Agreement.pdf",
    time: "2 mins ago",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: <Brain size={22} />,
    title: "AI Analysis Completed",
    description: "Executive summary generated",
    time: "3 mins ago",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    icon: <AlertTriangle size={22} />,
    title: "High Risk Clause Found",
    description: "Termination Clause",
    time: "5 mins ago",
    color: "bg-red-100 text-red-500",
  },
  {
    icon: <FileCheck size={22} />,
    title: "Report Generated",
    description: "Ready for download",
    time: "6 mins ago",
    color: "bg-emerald-100 text-emerald-600",
  },
];

export default function ActivityCard() {
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

        {activities.map((activity, index) => (

          <motion.div
            key={index}
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

              <p className="mt-1 text-slate-500 text-sm">

                {activity.description}

              </p>

            </div>

            <span className="text-xs text-slate-400 whitespace-nowrap">

              {activity.time}

            </span>

          </motion.div>

        ))}

      </div>
    </motion.div>
  );
}