import { Users, User, Building2, Calendar, DollarSign } from "lucide-react";

const CATEGORY_META = {
  people: { label: "People", icon: User, color: "bg-indigo-100 text-indigo-700" },
  organizations: { label: "Organizations", icon: Building2, color: "bg-blue-100 text-blue-700" },
  dates: { label: "Dates", icon: Calendar, color: "bg-amber-100 text-amber-700" },
  money: { label: "Money", icon: DollarSign, color: "bg-emerald-100 text-emerald-700" },
};

export default function EntityCard({ entities = {} }) {

  const categories = Object.keys(CATEGORY_META).filter(
    (key) => (entities[key] || []).length > 0
  );

  return (

    <div className="card">

      <div className="flex items-center gap-4">

        <div className="rounded-2xl bg-indigo-100 p-4">

          <Users
            className="text-indigo-600"
            size={28}
          />

        </div>

        <div>

          <p className="text-slate-500">

            Extracted Information

          </p>

          <h2 className="text-3xl font-black">

            Named Entities

          </h2>

        </div>

      </div>

      <div className="mt-10 space-y-6">

        {

          categories.length === 0

          ?

          (

            <div className="rounded-2xl bg-slate-50 p-6 text-center text-slate-500">

              No entities detected.

            </div>

          )

          :

          categories.map((key) => {

            const { label, icon: Icon, color } = CATEGORY_META[key];
            const values = entities[key] || [];

            return (

              <div key={key}>

                <div className="flex items-center gap-3">

                  <div className={`rounded-xl p-2 ${color}`}>
                    <Icon size={16} />
                  </div>

                  <h3 className="font-bold text-slate-700">
                    {label}
                    <span className="ml-2 text-sm font-medium text-slate-400">
                      {values.length}
                    </span>
                  </h3>

                </div>

                <div className="mt-4 flex flex-wrap gap-2">

                  {values.map((value, index) => (

                    <span

                      key={index}

                      className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"

                    >

                      {value}

                    </span>

                  ))}

                </div>

              </div>

            );

          })

        }

      </div>

    </div>

  );

}
