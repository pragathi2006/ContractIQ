import { Brain, Download } from "lucide-react";

export default function SummaryCard({ summary, preview }) {

  const downloadReport = () => {

    const content = `
ContractIQ AI Report

===================================

EXECUTIVE SUMMARY

${summary}

===================================

DOCUMENT PREVIEW

${preview}
`;

    const blob = new Blob([content], {
      type: "text/plain",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "ContractIQ_Report.txt";

    link.click();

    window.URL.revokeObjectURL(url);

  };

  return (

    <div className="card flex-[2]">

      <div className="flex items-center gap-4">

        <Brain

          className="text-indigo-600"

          size={32}

        />

        <div>

          <p className="text-slate-500">

            AI Generated

          </p>

          <h2 className="text-3xl font-black">

            Executive Summary

          </h2>

        </div>

      </div>

      <p className="mt-8 text-lg leading-9 text-slate-600 whitespace-pre-line">

        {summary || "No summary generated."}

      </p>

      <button

        onClick={downloadReport}

        className="primary-btn mt-10"

      >

        <Download size={20} />

        Download Report

      </button>

    </div>

  );

}