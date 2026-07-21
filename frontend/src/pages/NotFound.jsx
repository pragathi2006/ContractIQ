import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center px-6">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .6 }}
        className="card max-w-lg text-center"
      >

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl">
          <ShieldCheck size={32} />
        </div>

        <h1 className="mt-8 text-6xl font-black text-indigo-600">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-black">
          Page Not Found
        </h2>

        <p className="mt-4 text-slate-500">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="primary-btn mt-10 inline-flex justify-center"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

      </motion.div>

    </div>
  );
}
