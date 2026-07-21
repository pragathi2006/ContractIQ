import { motion } from "framer-motion";

export default function StatCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.03,
      }}
      className="card"
    >
      <div className="flex justify-between">

        <div>

          <p className="text-slate-500">

            {title}

          </p>

          <h2 className="mt-3 text-4xl font-black">

            {value}

          </h2>

        </div>

        <div className={`rounded-2xl p-4 ${color}`}>

          {icon}

        </div>

      </div>
    </motion.div>
  );
}