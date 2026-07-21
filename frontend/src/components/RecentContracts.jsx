import { motion } from "framer-motion";
import { FileText, ExternalLink } from "lucide-react";

const contracts = [
  {
    id: 1,
    name: "Employment Agreement.pdf",
    risk: "18%",
    status: "Low",
    uploaded: "Today",
    color: "text-emerald-600 bg-emerald-100",
  },
  {
    id: 2,
    name: "NDA Contract.pdf",
    risk: "34%",
    status: "Medium",
    uploaded: "Yesterday",
    color: "text-yellow-600 bg-yellow-100",
  },
  {
    id: 3,
    name: "Lease Agreement.pdf",
    risk: "72%",
    status: "High",
    uploaded: "2 Days Ago",
    color: "text-red-600 bg-red-100",
  },
  {
    id: 4,
    name: "Vendor Agreement.pdf",
    risk: "26%",
    status: "Low",
    uploaded: "5 Days Ago",
    color: "text-emerald-600 bg-emerald-100",
  },
];

export default function RecentContracts() {
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

            Recent Activity

          </p>

          <h2 className="mt-2 text-3xl font-black">

            Recent Contracts

          </h2>

        </div>

        <button className="secondary-btn">

          View All

        </button>

      </div>

      <div className="mt-8 space-y-5">

        {contracts.map((contract) => (

          <motion.div
            key={contract.id}
            whileHover={{
              scale: 1.01,
              x: 5,
            }}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 transition"
          >

            <div className="flex items-center gap-5">

              <div className="rounded-2xl bg-indigo-100 p-4">

                <FileText
                  size={28}
                  className="text-indigo-600"
                />

              </div>

              <div>

                <h3 className="font-bold text-lg">

                  {contract.name}

                </h3>

                <p className="mt-1 text-sm text-slate-500">

                  Uploaded {contract.uploaded}

                </p>

              </div>

            </div>

            <div className="hidden md:block text-center">

              <p className="text-sm text-slate-400">

                Risk

              </p>

              <h3 className="font-black text-xl">

                {contract.risk}

              </h3>

            </div>

            <div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${contract.color}`}
              >
                {contract.status}
              </span>

            </div>

            <button className="rounded-xl p-3 transition hover:bg-slate-200">

              <ExternalLink size={20} />

            </button>

          </motion.div>

        ))}

      </div>
    </motion.div>
  );
}