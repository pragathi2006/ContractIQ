import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RecentContracts from "../components/RecentContracts";

export default function History() {
  return (
    <div className="min-h-screen bg-[#F7F8FC] relative overflow-hidden">

      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>

      <Navbar />

      <div className="section">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .7 }}
        >

          <h1 className="hero-title">
            Contract History
          </h1>

          <p className="subtitle mt-6 max-w-2xl">
            Every contract you've analyzed with ContractIQ, in one place.
          </p>

        </motion.div>

        <div className="mt-16 max-w-4xl">
          <RecentContracts />
        </div>

      </div>

      <Footer />

    </div>
  );
}
