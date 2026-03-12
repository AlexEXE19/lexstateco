import { ArrowRight, Home, KeyRound, Sparkles, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import StepsDescription from "./StepsDescription";

export default function UserTypeSelector() {
  const [selected, setSelected] = useState<"buyer" | "seller" | null>(null);

  const cards = useMemo(
    () => [
      {
        key: "buyer" as const,
        title: "I'm looking for a home",
        desc: "Discover spaces matched to your lifestyle, with fast tours and real guidance.",
        icon: Home,
        accent: "blue",
      },
      {
        key: "seller" as const,
        title: "I want to sell my property",
        desc: "List beautifully, manage visits effortlessly, and close with confidence.",
        icon: KeyRound,
        accent: "green",
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col items-center gap-12 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 px-4 py-16 text-white">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
          <Sparkles size={14} />
          <span>Choose your path</span>
        </div>
        <h2 className="text-3xl font-semibold sm:text-4xl">
          Buyer or seller, we keep it calm and clear.
        </h2>
        <p className="max-w-2xl text-sm text-slate-200 sm:text-base">
          Pick the experience that fits you. We’ll surface the next steps and
          the right tools so you can move without the noise.
        </p>
      </div>

      <div className="grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          const active = selected === card.key;
          const accentStyles =
            card.accent === "blue"
              ? "from-blue-500/70 to-cyan-500/70"
              : "from-emerald-500/70 to-lime-500/70";

          return (
            <motion.button
              key={card.key}
              whileHover={{ scale: 1.015, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(card.key)}
              className={`group relative overflow-hidden rounded-3xl p-[1px] text-left shadow-2xl transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950
              ${active ? "ring-2 ring-white/40" : "ring-0"}
            `}
            >
              <div
                className={`absolute inset-0 ${accentStyles} opacity-60 blur-3xl transition duration-500 ${
                  active ? "opacity-80" : "opacity-40"
                }`}
              />

              <div className="relative flex h-full flex-col gap-4 rounded-[22px] bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20 ${
                      active ? "scale-105" : ""
                    }`}
                  >
                    <Icon size={24} />
                  </span>
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {card.title}
                    </p>
                    <p className="text-xs text-slate-200">
                      Tailored steps and guidance
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-200">{card.desc}</p>

                <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-white/90">
                  <Wand2 size={16} className="text-white/80" />
                  <span>{active ? "Selected" : "Preview next steps"}</span>
                  <ArrowRight
                    size={16}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {selected && (
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: -120, rotateX: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          className="w-full max-w-5xl"
        >
          <StepsDescription type={selected} />
        </motion.div>
      )}
    </div>
  );
}
