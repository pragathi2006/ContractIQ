import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StatCard from "../components/StatCard";

import RiskCard from "../components/RiskCard";
import SummaryCard from "../components/SummaryCard";
import EntityCard from "../components/EntityCard";
import ClauseCard from "../components/ClauseCard";

import {
  FileText,
  Clock,
  Hash
} from "lucide-react";

export default function Result() {

  const location = useLocation();

  const navigate = useNavigate();

  const result = location.state?.result;

  useEffect(() => {

    if (!result) {

      navigate("/upload");

    }

  }, [result, navigate]);

  if (!result) return null;

  const statistics = result.statistics || {};

  return (

    <div className="min-h-screen bg-[#F7F8FC]">

      <Navbar />

      <div className="section">

        {/* PAGE TITLE */}

        <motion.div

          initial={{ opacity: 0, y: 30 }}

          animate={{ opacity: 1, y: 0 }}

          className="mb-16 text-center"

        >

          <h1 className="hero-title">

            Analysis

            <span className="gradient-text">

              {" "}Results

            </span>

          </h1>

          <p className="subtitle mt-6">

            AI generated contract report

          </p>

        </motion.div>

        {/* TOP */}

        <div className="grid gap-8 lg:grid-cols-3">

          <RiskCard

            risk={result.risk}

          />

          <div className="lg:col-span-2">

            <SummaryCard

              summary={result.summary}

              preview={result.preview}

            />

          </div>

        </div>

        {/* STATISTICS */}

        <div className="grid gap-6 mt-20 md:grid-cols-3">

          <StatCard

            title="Pages"

            value={statistics.pages || 0}

            icon={<FileText size={24} />}

          />

          <StatCard

            title="Characters"

            value={statistics.characters || 0}

            icon={<Hash size={24} />}

          />

          <StatCard

            title="Processing Time"

            value={`${statistics.processing_time_seconds || 0}s`}

            icon={<Clock size={24} />}

          />

        </div>

        {/* ENTITIES + CLAUSES */}

        <div className="grid gap-8 mt-20 lg:grid-cols-2">

          <EntityCard

            entities={result.entities}

          />

          <ClauseCard

            clauses={result.clauses}

          />

        </div>

        {/* PREVIEW */}

        <div className="card mt-20">

          <h2 className="text-3xl font-black">

            Document Preview

          </h2>

          <p className="mt-8 whitespace-pre-wrap leading-8 text-slate-600">

            {result.preview}

          </p>

        </div>

      </div>

      <Footer />

    </div>

  );

}