import { ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ClauseCard({ clauses = [] }) {

  return (

    <div className="card">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-slate-500">

            AI Clause Detection

          </p>

          <h2 className="mt-2 text-3xl font-black">

            Contract Clauses

          </h2>

        </div>

        <ShieldCheck

          className="text-indigo-600"

          size={32}

        />

      </div>

      <div className="mt-10 grid gap-5">

        {

          clauses.length === 0

          ?

          (

            <div className="rounded-2xl bg-slate-50 p-6 text-center text-slate-500">

              No clauses detected.

            </div>

          )

          :

          clauses.map((clause, index) => {

            const name = typeof clause === "string" ? clause : clause.name;

            const keyword = typeof clause === "object" ? clause.matched_keyword : null;

            return (

              <div

                key={index}

                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1"

              >

                <div className="flex items-center gap-4">

                  <CheckCircle2

                    className="text-emerald-500"

                    size={22}

                  />

                  <div>

                    <span className="font-semibold text-lg">

                      {name}

                    </span>

                    {keyword && (

                      <p className="mt-1 text-sm text-slate-500">

                        Matched keyword: "{keyword}"

                      </p>

                    )}

                  </div>

                </div>

              </div>

            );

          })

        }

      </div>

    </div>

  );

}