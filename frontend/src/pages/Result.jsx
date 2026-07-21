import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StatCard from "../components/StatCard";

import RiskCard from "../components/RiskCard";
import SummaryCard from "../components/SummaryCard";
import EntityCard from "../components/EntityCard";
import ClauseCard from "../components/ClauseCard";
import { getContract } from "../api/contracts";

import {
  FileText,
  Clock,
  Hash
} from "lucide-react";

export default function Result() {

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  // Fresh analysis lands here via router state; viewing a past contract
  // (from Dashboard/History) lands here via /result/:id and fetches it.
  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(Boolean(id) && !location.state?.result);
  const [error, setError] = useState("");

  useEffect(() => {

    if (location.state?.result || !id) {
      return;
    }

    getContract(id)
      .then((contract) => {

        if (contract.status !== "SUCCESS" || !contract.result) {
          setError("This contract hasn't finished analyzing or the analysis failed.");
          return;
        }

        setResult(contract.result);

      })
      .catch(() => setError("Unable to load this contract."))
      .finally(() => setLoading(false));

  }, [id, location.state]);

  useEffect(() => {

    if (!loading && !result && !error) {
      navigate("/upload");
    }

  }, [loading, result, error, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8FC]">
        <Loader2 size={48} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8FC] px-6">
        <div className="card max-w-lg text-center">
          <h1 className="text-2xl font-black">Couldn't load this result</h1>
          <p className="mt-4 text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

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
