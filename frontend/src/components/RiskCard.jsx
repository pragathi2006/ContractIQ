import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { AlertCircle } from "lucide-react";

export default function RiskCard({ risk }) {

  const level = risk?.risk_level || "Low";
  const score = risk?.risk_score ?? 0;
  const reasons = risk?.reasons || [];

  // risk_score is an open-ended additive score (not a 0-100 scale), so cap
  // the ring fill for display purposes while still showing the raw number.
  const percentage = Math.min(score, 100);

  let color = "#10B981";
  let badge = "Low Risk";

  if (level === "Medium") {
    color = "#F59E0B";
    badge = "Medium Risk";
  }

  if (level === "High") {
    color = "#EF4444";
    badge = "High Risk";
  }

  return (

    <div className="card">

      <p className="text-slate-500">

        Overall AI Analysis

      </p>

      <h2 className="mt-2 text-3xl font-black">

        Contract Risk

      </h2>

      <div className="mt-10 flex justify-center">

        <div className="w-56">

          <CircularProgressbar

            value={percentage}

            text={`${score}`}

            styles={buildStyles({

              textSize: "16px",

              pathColor: color,

              textColor: "#0F172A",

              trailColor: "#E5E7EB"

            })}

          />

        </div>

      </div>

      <div className="mt-8 text-center">

        <span

          className={`rounded-full px-5 py-3 font-bold

          ${

            level === "High"

              ? "bg-red-100 text-red-600"

              : level === "Medium"

              ? "bg-yellow-100 text-yellow-700"

              : "bg-emerald-100 text-emerald-700"

          }`}

        >

          {badge}

        </span>

      </div>

      {reasons.length > 0 && (

        <div className="mt-8 space-y-3 text-left">

          {reasons.map((reason, index) => (

            <div
              key={index}
              className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600"
            >
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0 text-red-400"
              />
              <span>{reason}</span>
            </div>

          ))}

        </div>

      )}

    </div>

  );

}
