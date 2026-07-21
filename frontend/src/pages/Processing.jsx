import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { getTaskStatus } from "../api/upload";

export default function Processing() {

  const navigate = useNavigate();
  const location = useLocation();

  const taskId = location.state?.taskId;

  const [progress, setProgress] = useState(5);
  const [step, setStep] = useState("Uploading Contract...");
  const [error, setError] = useState("");

  useEffect(() => {

    if (!taskId) {

      navigate("/upload");

      return;

    }

    const interval = setInterval(async () => {

      try {

        const response = await getTaskStatus(taskId);

        const data = response.data;

        if (data.state === "PENDING") {

          setProgress(15);
          setStep("Waiting in queue...");

        }

        else if (data.state === "STARTED") {

          setProgress(40);
          setStep("Analyzing contract...");

        }

        else if (data.state === "SUCCESS") {

          setProgress(100);

          setStep("Analysis Complete");

          clearInterval(interval);

          setTimeout(() => {

            navigate("/result", {

              state: {

                result: data.result

              }

            });

          }, 1200);

        }

        else if (data.state === "FAILURE") {

          clearInterval(interval);

          setError(data.error || "Analysis failed. Please try again.");

        }

      }

      catch (err) {

        console.error(err);

        clearInterval(interval);

        setError("Unable to connect to the backend. Is the server running?");

      }

    }, 2000);

    return () => clearInterval(interval);

  }, [navigate, taskId]);

  return (

    <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center px-6">

      <motion.div

        initial={{
          opacity: 0,
          y: 40
        }}

        animate={{
          opacity: 1,
          y: 0
        }}

        className="card w-full max-w-2xl text-center"

      >

        {error ? (

          <AlertTriangle
            size={70}
            className="mx-auto text-red-500"
          />

        ) : (

          <Loader2

            size={70}

            className="mx-auto animate-spin text-indigo-600"

          />

        )}

        <h1 className="mt-8 text-4xl font-black">

          {error ? "Something Went Wrong" : "AI Processing Contract"}

        </h1>

        <p className="mt-5 text-slate-500">

          {error
            ? "We couldn't finish analyzing your document."
            : "Please wait while ContractIQ analyzes your document."}

        </p>

        {!error && (

          <>

            <div className="mt-12 h-4 overflow-hidden rounded-full bg-slate-200">

              <motion.div

                animate={{

                  width: `${progress}%`

                }}

                transition={{

                  duration: .5

                }}

                className="h-full bg-gradient-to-r from-indigo-600 to-blue-500"

              />

            </div>

            <h2 className="mt-6 text-xl font-bold">

              {progress}%

            </h2>

            <p className="mt-4 text-slate-600">

              {step}

            </p>

            <div className="mt-12 space-y-4 text-left">

              {[
                "Reading PDF",
                "Extracting Text",
                "Analyzing Clauses",
                "Extracting Entities",
                "Calculating Risk",
                "Generating Report"
              ].map((item, index) => (

                <motion.div

                  key={item}

                  initial={{
                    opacity: 0,
                    x: -20
                  }}

                  animate={{
                    opacity: 1,
                    x: 0
                  }}

                  transition={{
                    delay: index * .15
                  }}

                  className="flex items-center gap-4"

                >

                  <CheckCircle2

                    className={`${

                      progress > ((index + 1) * 15)

                        ? "text-emerald-500"

                        : "text-slate-300"

                    }`}

                  />

                  <span>

                    {item}

                  </span>

                </motion.div>

              ))}

            </div>

          </>

        )}

        {

          error && (

            <>

              <p className="mt-10 font-semibold text-red-500">

                {error}

              </p>

              <Link
                to="/upload"
                className="primary-btn mt-8 inline-flex justify-center"
              >
                Try Again
              </Link>

            </>

          )

        }

      </motion.div>

    </div>

  );

}