import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">

      <div className="mx-auto max-w-7xl px-8 py-12">

        <div className="grid gap-10 lg:grid-cols-4">

          {/* Logo */}

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">

                <ShieldCheck size={24} />

              </div>

              <div>

                <h2 className="text-2xl font-black">

                  ContractIQ

                </h2>

                <p className="text-sm text-slate-500">

                  AI Contract Intelligence

                </p>

              </div>

            </div>

            <p className="mt-6 leading-7 text-slate-500">

              Analyze legal contracts using AI. Detect risky clauses,
              extract important entities and generate intelligent
              summaries within seconds.

            </p>

          </div>

          {/* Product */}

          <div>

            <h3 className="text-lg font-bold">

              Product

            </h3>

            <div className="mt-6 flex flex-col gap-3 text-slate-500">

              <Link to="/" className="hover:text-indigo-600">

                Home

              </Link>

              <Link to="/dashboard" className="hover:text-indigo-600">

                Dashboard

              </Link>

              <Link to="/upload" className="hover:text-indigo-600">

                Upload

              </Link>

              <Link to="/result" className="hover:text-indigo-600">

                Results

              </Link>

            </div>

          </div>

          {/* Company */}

          <div>

            <h3 className="text-lg font-bold">

              Company

            </h3>

            <div className="mt-6 flex flex-col gap-3 text-slate-500">

              <a href="#">About</a>

              <a href="#">Privacy Policy</a>

              <a href="#">Terms & Conditions</a>

              <a href="#">Support</a>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="text-lg font-bold">

              Contact

            </h3>

            <div className="mt-6 space-y-3 text-slate-500">

              <p>📧 support@contractiq.ai</p>

              <p>📍 Visakhapatnam, India</p>

              <p>🤖 AI Powered Contract Analysis</p>

            </div>

          </div>

        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 lg:flex-row">

          <p className="text-slate-500">

            © 2026 ContractIQ. All Rights Reserved.

          </p>

          <p className="text-sm text-slate-400">

            Built with React • FastAPI • Celery • AI

          </p>

        </div>

      </div>

    </footer>
  );
}