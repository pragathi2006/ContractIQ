import { Link } from "react-router-dom";
import { ShieldCheck, Bell } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex justify-center pt-6">
      <div className="glass w-[94%] max-w-7xl rounded-2xl px-8 py-4 shadow-xl flex items-center justify-between">

        <Link
          to="/dashboard"
          className="flex items-center gap-3"
        >
          <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <ShieldCheck size={24} />
          </div>

          <div>
            <h2 className="font-black text-xl">
              ContractIQ
            </h2>

            <p className="text-xs text-slate-500">
              AI Contract Intelligence
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex gap-8 font-medium">

          <Link to="/dashboard">Dashboard</Link>

          <Link to="/upload">Upload</Link>

          <Link to="/history">History</Link>

        </nav>

        <div className="flex items-center gap-5">

          <Bell />

          <img
            src="https://ui-avatars.com/api/?name=Y&background=4F46E5&color=fff"
            className="w-11 h-11 rounded-full"
            alt="avatar"
          />

        </div>

      </div>
    </header>
  );
}