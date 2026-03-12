import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, RefreshCw, Home } from "lucide-react";

const RedirectPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/home"), 2600);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl ring-1 ring-white/10 backdrop-blur">
        <div className="absolute -left-14 -top-10 h-40 w-40 rounded-full bg-sky-500/25 blur-[90px]" />
        <div className="absolute -bottom-12 right-0 h-48 w-48 rounded-full bg-cyan-400/20 blur-[100px]" />

        <div className="relative space-y-5">
          <motion.div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/15 ring-1 ring-sky-300/30"
            initial={{ rotate: -6, y: -8, opacity: 0 }}
            animate={{ rotate: [0, -4, 3, 0], y: [0, -6, 0], opacity: 1 }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              repeatDelay: 1.4,
              ease: "easeInOut",
            }}
          >
            <Compass className="text-sky-200" size={30} />
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Oops, you are off track</h1>
            <p className="text-sm text-slate-200">
              We could not find that page. We will guide you back to a safe
              spot.
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 text-sm text-slate-200">
            <motion.span
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/10"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <RefreshCw size={16} />
              Redirecting you now...
            </motion.span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <Link
              to="/home"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-400/30 transition hover:-translate-y-[1px] hover:shadow-cyan-400/40"
            >
              <Home size={16} />
              Go now
            </Link>
            <p className="text-xs text-slate-300">
              You will be redirected automatically in a moment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedirectPage;
