import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StatCard from "../components/StatCard";

import RiskCard from "../components/RiskCard";
import SummaryCard from "../components/SummaryCard";
import EntityCard from "../components/EntityCard";
import ClauseCard from "../components/ClauseCard";
import { getContract, getSimilarContracts } from "../api/contracts";

import {
  FileText,
  Clock,
  Hash,
  ScanText
} from "lucide-react";

export default function Result() {

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(Boolean(id) && !location.state?.result);
  const [error, setError] = useState("");
  const [similar, setSimilar] = useState([]);

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

    if (!id) {
      return;
    }

    getSimilarContracts(id)
      .then(setSimilar)
      .catch(() => setSimilar([]));

  }, [id]);

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


        <motion.div

          initial={{ opacity: 0, y: 30 }}

          animate={{ opacity: 1, y: 0 }}

          className="mb-16 text-center"

        >

          <h1 className="section-title">

            Analysis

            <span className="gradient-text">

              {" "}Results

            </span>

          </h1>

          <p className="subtitle mt-6">

            AI generated contract report

          </p>

        </motion.div>


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


        <div className="grid gap-6 mt-20 md:grid-cols-2 lg:grid-cols-4">

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

          <StatCard

            title="Text Source"

            value={statistics.extraction_method === "ocr" ? "OCR" : "Native"}

            icon={<ScanText size={24} />}

          />

        </div>


        <div className="grid gap-8 mt-20 lg:grid-cols-2">

          <EntityCard

            entities={result.entities}

          />

          <ClauseCard

            clauses={result.clauses}

          />

        </div>


        <div className="card mt-20">

          <h2 className="text-3xl font-black">

            Document Preview

          </h2>

          <p className="mt-8 whitespace-pre-wrap leading-8 text-slate-600">

            {result.preview}

          </p>

        </div>

        {similar.length > 0 && (

          <div className="card mt-20">

            <div className="flex items-center gap-4">

              <div className="rounded-2xl bg-indigo-100 p-4">
                <Sparkles className="text-indigo-600" size={28} />
              </div>

              <div>
                <p className="text-slate-500">Semantic Search</p>
                <h2 className="text-3xl font-black">Similar Contracts</h2>
              </div>

            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">

              {similar.map((match) => (

                <Link

                  key={match.contract_id}

                  to={`/result/${match.contract_id}`}

                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-indigo-300"

                >

                  <p className="truncate font-bold">{match.filename}</p>

                  <p className="mt-2 text-sm text-slate-500">
                    {Math.round(match.score * 100)}% similar
                  </p>

                </Link>

              ))}

            </div>

          </div>

        )}

      </div>

      <Footer />

    </div>

  );

}
