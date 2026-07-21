import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { uploadPDF } from "../api/upload";
import {
  UploadCloud,
  FileText,
  Sparkles,
  ArrowRight,
  Trash2,
  ShieldCheck,
} from "lucide-react";

export default function Upload() {

  const inputRef = useRef(null);

  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);

  const [dragging, setDragging] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");

  const handleFile = (file) => {

    if (!file) return;

    if (file.type !== "application/pdf") {

      setError("Please select a PDF file only.");

      return;

    }

    setError("");

    setSelectedFile(file);

  };

  const handleUpload = async () => {

  if (!selectedFile) {

    setError("Please select a PDF file.");

    return;

  }

  try {

    setUploading(true);

    setError("");

    const response = await uploadPDF(selectedFile);

    const taskId = response.data.task_id;

    navigate("/processing", {

      state: {

        taskId: taskId

      }

    });

  }

  catch (err) {

    console.error(err);

    setError("Upload failed. Please try again.");

  }

  finally {

    setUploading(false);

  }

};
  return (

<div className="min-h-screen bg-[#F7F8FC] relative overflow-hidden">

<div className="blob blob1"></div>
<div className="blob blob2"></div>
<div className="blob blob3"></div>

{/* NAVBAR */}

<div className="w-full flex justify-center pt-6">

<div className="glass rounded-2xl px-8 py-4 w-[92%] max-w-7xl flex items-center justify-between shadow-xl">

<Link
to="/dashboard"
className="flex items-center gap-3"
>

<div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white">

<ShieldCheck size={24}/>

</div>

<div>

<h1 className="font-black text-xl">

ContractIQ

</h1>

<p className="text-xs text-slate-500">

AI Contract Intelligence

</p>

</div>

</Link>

<Link
to="/dashboard"
className="font-semibold text-indigo-600"
>

Dashboard

</Link>

</div>

</div>

{/* CONTENT */}

<div className="section">

<motion.div

initial={{opacity:0,y:40}}

animate={{opacity:1,y:0}}

transition={{duration:.7}}

className="text-center"

>

<div className="inline-flex items-center gap-3 rounded-full bg-indigo-100 px-5 py-3">

<Sparkles
size={18}
className="text-indigo-600"
/>

<span className="font-semibold text-indigo-700">

Upload Contract

</span>

</div>

<h1 className="hero-title mt-8">

Upload Your

<br/>

<span className="gradient-text">

Legal Contract

</span>

</h1>

<p className="subtitle mx-auto mt-8 max-w-2xl">

Drag & drop your contract or browse your files.
Our AI will detect clauses, calculate risk,
extract entities and generate a professional report.

</p>

</motion.div>

{/* UPLOAD CARD */}

<motion.div

initial={{opacity:0,scale:.9}}

animate={{opacity:1,scale:1}}

transition={{delay:.2}}

className="mx-auto mt-20 max-w-4xl"

>

<div

onDragOver={(e)=>{

e.preventDefault();

setDragging(true);

}}

onDragLeave={()=>setDragging(false)}

onDrop={(e)=>{

e.preventDefault();

setDragging(false);

handleFile(e.dataTransfer.files[0]);

}}

className={`card text-center transition-all duration-300 cursor-pointer border-2 border-dashed

${dragging

?

"border-indigo-600 shadow-indigo scale-[1.02]"

:

"border-slate-300"

}

`}

onClick={()=>inputRef.current.click()}

>

<input

ref={inputRef}

type="file"

accept=".pdf"

hidden

onChange={(e)=>handleFile(e.target.files[0])}

/>

<motion.div

animate={{

y:[0,-12,0]

}}

transition={{

repeat:Infinity,

duration:4

}}

>

<UploadCloud

size={90}

className="mx-auto text-indigo-600"

/>

</motion.div>

<h2 className="mt-8 text-3xl font-black">

Drag & Drop Your PDF

</h2>

<p className="mt-4 text-slate-500">

or click anywhere to browse files

</p>

<div className="mt-10">

<button className="primary-btn">

Browse Files

</button>

</div>

<p className="mt-10 text-sm text-slate-400">

Supported Format: PDF

</p>

</div>
          {/* SELECTED FILE */}

          {selectedFile && (

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .4 }}
              className="card mt-10"
            >

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-center gap-5">

                  <div className="rounded-2xl bg-red-100 p-5">

                    <FileText
                      size={40}
                      className="text-red-500"
                    />

                  </div>

                  <div>

                    <h2 className="text-xl font-black">

                      {selectedFile.name}

                    </h2>

                    <p className="mt-2 text-slate-500">

                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB

                    </p>

                  </div>

                </div>

                <button

                  onClick={() => setSelectedFile(null)}

                  className="flex items-center justify-center gap-3 rounded-2xl bg-red-50 px-6 py-4 font-semibold text-red-500 transition hover:bg-red-100"

                >

                  <Trash2 size={20} />

                  Remove

                </button>

              </div>

            </motion.div>

          )}

          {/* AI FEATURES */}

          <div className="mt-16 grid gap-6 md:grid-cols-3">

            {[
              {
                title: "Extract Clauses",
                desc: "AI detects payment, confidentiality, liability and more."
              },
              {
                title: "Risk Analysis",
                desc: "Instantly calculate the overall legal risk score."
              },
              {
                title: "Executive Summary",
                desc: "Generate a concise summary in seconds."
              }
            ].map((item) => (

              <motion.div

                key={item.title}

                whileHover={{
                  y: -8
                }}

                className="card"

              >

                <Sparkles
                  className="text-indigo-600"
                />

                <h3 className="mt-6 text-2xl font-black">

                  {item.title}

                </h3>

                <p className="mt-4 leading-8 text-slate-500">

                  {item.desc}

                </p>

              </motion.div>

            ))}

          </div>

          {/* ANALYZE BUTTON */}

<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="mt-16 text-center"
>
  <button
    onClick={handleUpload}
    disabled={!selectedFile || uploading}
    className={`primary-btn text-lg px-10 py-5 ${
      uploading || !selectedFile
        ? "opacity-50 cursor-not-allowed"
        : ""
    }`}
  >
    {uploading ? "Uploading..." : "Analyze Contract"}

    <ArrowRight size={22} />
  </button>

  {error && (
    <p className="mt-5 text-center text-red-500 font-medium">
      {error}
    </p>
  )}
</motion.div>
          

          {/* WORKFLOW */}

          <div className="mt-24">

            <h2 className="section-title text-center">

              AI Processing Pipeline

            </h2>

            <div className="mt-16 grid gap-8 lg:grid-cols-4">

              {[
                "Upload PDF",
                "Extract Text",
                "Analyze Contract",
                "Generate Report"
              ].map((step, index) => (

                <motion.div

                  key={step}

                  initial={{ opacity: 0, y: 40 }}

                  whileInView={{
                    opacity: 1,
                    y: 0
                  }}

                  viewport={{ once: true }}

                  transition={{
                    delay: index * .15
                  }}

                  whileHover={{
                    scale: 1.05
                  }}

                  className="card text-center"

                >

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-2xl font-black text-white">

                    {index + 1}

                  </div>

                  <h3 className="mt-6 text-xl font-black">

                    {step}

                  </h3>

                </motion.div>

              ))}

            </div>

          </div>

        </motion.div>

      </div>

    </div>

  );

}