import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, ExternalLink, Loader2 } from "lucide-react";

const RISK_STYLES = {
  Low: "text-emerald-600 bg-emerald-100",
  Medium: "text-yellow-600 bg-yellow-100",
  High: "text-red-600 bg-red-100",
};

const STATUS_LABEL = {
  PROCESSING: "Processing",
  SUCCESS: "Analyzed",
  FAILURE: "Failed",
};

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

export default function RecentContracts({ contracts = [], loading = false, showViewAll = true, limit }) {

  const visible = limit ? contracts.slice(0, limit) : contracts;

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="card"
    >
      <div className="flex items-center justify-between">

        <div>

          <p className="text-slate-500 text-sm">

            Your Contracts

          </p>

          <h2 className="mt-2 text-3xl font-black">

            Recent Contracts

          </h2>

        </div>

        {showViewAll && (

          <Link to="/history" className="secondary-btn">

            View All

          </Link>

        )}

      </div>

      <div className="mt-8 space-y-5">

        {loading ? (

          <div className="flex items-center justify-center rounded-2xl bg-slate-50 p-10 text-slate-400">
            <Loader2 className="animate-spin" size={28} />
          </div>

        ) : visible.length === 0 ? (

          <div className="rounded-2xl bg-slate-50 p-10 text-center text-slate-500">
            No contracts analyzed yet.
            <Link to="/upload" className="ml-2 font-semibold text-indigo-600 hover:text-indigo-700">
              Upload one
            </Link>
          </div>

        ) : (

          visible.map((contract) => (

            <motion.div
              key={contract.id}
              whileHover={{
                scale: 1.01,
                x: 5,
              }}
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 transition"
            >

              <div className="flex min-w-0 items-center gap-5">

                <div className="rounded-2xl bg-indigo-100 p-4">

                  <FileText
                    size={28}
                    className="text-indigo-600"
                  />

                </div>

                <div className="min-w-0">

                  <h3 className="truncate font-bold text-lg">

                    {contract.filename}

                  </h3>

                  <p className="mt-1 text-sm text-slate-500">

                    {STATUS_LABEL[contract.status] || contract.status} &middot; {timeAgo(contract.created_at)}

                  </p>

                </div>

              </div>

              {contract.status === "SUCCESS" && (

                <div className="hidden shrink-0 text-center md:block">

                  <p className="text-sm text-slate-400">

                    Risk

                  </p>

                  <h3 className="font-black text-xl">

                    {contract.risk_score ?? "-"}

                  </h3>

                </div>

              )}

              <div className="shrink-0">

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    RISK_STYLES[contract.risk_level] || "bg-slate-200 text-slate-600"
                  }`}
                >
                  {contract.risk_level || STATUS_LABEL[contract.status] || contract.status}
                </span>

              </div>

              {contract.status === "SUCCESS" ? (

                <Link
                  to={`/result/${contract.id}`}
                  className="shrink-0 rounded-xl p-3 transition hover:bg-slate-200"
                >

                  <ExternalLink size={20} />

                </Link>

              ) : (

                <span className="shrink-0 p-3 text-slate-300">

                  <ExternalLink size={20} />

                </span>

              )}

            </motion.div>

          ))

        )}

      </div>
    </motion.div>
  );
}
